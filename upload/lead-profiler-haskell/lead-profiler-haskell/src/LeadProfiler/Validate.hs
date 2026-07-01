{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

-- |
-- Module      : LeadProfiler.Validate
-- Description : Orchestrate the lenient parse + strict schema validation.
--
-- This module ties together 'LeadProfiler.Lenient' (which turns
-- "almost-JSON" LLM output into strict JSON text) with the three schema
-- parsers ('LeadProfiler.Schemas.LeadObservation.parseLeadObservation',
-- 'LeadProfiler.Schemas.ProspectAudit.parseProspectAudit',
-- 'LeadProfiler.Schemas.UserServices.parseUserServices').
--
-- The result is a set of @validate*@ functions that the Next.js sidecar
-- can call with raw LLM output and get back either a populated ADT plus
-- a list of warnings, or a structured error explaining what went wrong.
module LeadProfiler.Validate
  ( -- * Route tag
    Route(..)
  , routeKey
  , parseRouteKey

    -- * Validation result
  , ValidationResult(..)
  , ValidationError(..)
  , renderValidationError

    -- * Entry points (typed)
  , validateLeadObservation
  , validateProspectAudit
  , validateUserServices

    -- * Entry point (dynamic, by route)
  , validateRouteText
  ) where

import           LeadProfiler.Prelude
import           LeadProfiler.Lenient
import           LeadProfiler.Schemas.LeadObservation  (LeadObservation, parseLeadObservation,
                                                       leadObservationToJson)
import           LeadProfiler.Schemas.ProspectAudit   (ProspectAudit, parseProspectAudit,
                                                       prospectAuditToJson)
import           LeadProfiler.Schemas.UserServices    (UserServices, parseUserServices,
                                                       userServicesToJson)

import qualified Data.Aeson            as A
import qualified Data.Aeson.Types      as AT
import qualified Data.ByteString.Lazy  as BL
import qualified Data.Text             as T
import qualified Data.Text.Encoding    as TE

-- | Which route we are validating for. Determines which schema parser
-- we run after the lenient pre-processor.
data Route = RouteLeadObservation
           | RouteProspectAudit
           | RouteUserServices
  deriving (Eq, Show, Ord, Bounded, Enum)

-- | The route identifier as a string, matching the @route@ field in the
-- sidecar's JSON request body.
routeKey :: Route -> Text
routeKey RouteLeadObservation = "analyze-lead-images"
routeKey RouteProspectAudit   = "prospect-content-audit"
routeKey RouteUserServices    = "read-portfolio"

-- | Parse a route key from text. Returns 'Nothing' if the key is not
-- recognised (so the caller can return a 400).
parseRouteKey :: Text -> Maybe Route
parseRouteKey t = case T.toLower (T.strip t) of
  "analyze-lead-images"    -> Just RouteLeadObservation
  "prospect-content-audit" -> Just RouteProspectAudit
  "read-portfolio"         -> Just RouteUserServices
  _                        -> Nothing

-- | A structured validation error. Unlike the original TS code's
-- @"{ error: "Could not parse VLM response as JSON" }"@, this carries
-- enough context for the user (or developer) to understand what failed
-- and why.
data ValidationError
  = UnknownRoute !Text
    -- ^ The request specified an unknown @route@.
  | NoJsonObjectFound !Text
    -- ^ The lenient pre-processor could not locate a balanced @{...}@
    -- region in the input. The payload is the error message from
    -- 'extractJson'.
  | AesonDecodeFailed !Text
    -- ^ The lenient pre-processor produced JSON text, but @aeson@ could
    -- not parse it. This is rare (it means our lenient pass missed
    -- something) but we surface it explicitly rather than crashing.
  | SchemaParseFailed !Text
    -- ^ @aeson@ parsed the JSON, but the schema parser rejected it
    -- (e.g. a required field was missing or had the wrong type).
    -- The payload is the parser's error message.
  deriving (Eq, Show)

-- | Render a 'ValidationError' as a human-readable 'Text'.
renderValidationError :: ValidationError -> Text
renderValidationError = \case
  UnknownRoute t      -> "unknown route: " <> t <>
                          ". Expected one of: analyze-lead-images, prospect-content-audit, read-portfolio"
  NoJsonObjectFound e -> "could not locate a JSON object in the LLM output: " <> e
  AesonDecodeFailed e -> "internal: lenient parser produced invalid JSON: " <> e
  SchemaParseFailed e -> "schema validation failed: " <> e

-- | The result of a successful validation.
data ValidationResult a = ValidationResult
  { vrRoute               :: !Route
  , vrValue               :: !a
  , vrWarnings            :: ![ExtractWarning]
  , vrWarningExplanations :: ![Text]
  , vrBytesDropped        :: !Int
  } deriving (Eq, Show)

-- | Validate raw LLM/VLM text against the @analyze-lead-images@ schema.
validateLeadObservation :: Text -> Either ValidationError (ValidationResult LeadObservation)
validateLeadObservation raw = do
  (jsonText, warnings, dropped) <- preProcess raw
  value <- decodeJson jsonText
  lo <- case AT.parseEither parseLeadObservation value of
          Right lo -> Right lo
          Left e   -> Left (SchemaParseFailed (T.pack e))
  Right ValidationResult
    { vrRoute               = RouteLeadObservation
    , vrValue               = lo
    , vrWarnings            = warnings
    , vrWarningExplanations = explainWarnings warnings
    , vrBytesDropped        = dropped
    }

-- | Validate raw LLM/VLM text against the @prospect-content-audit@ schema.
validateProspectAudit :: Text -> Either ValidationError (ValidationResult ProspectAudit)
validateProspectAudit raw = do
  (jsonText, warnings, dropped) <- preProcess raw
  value <- decodeJson jsonText
  pa <- case AT.parseEither parseProspectAudit value of
          Right pa -> Right pa
          Left e   -> Left (SchemaParseFailed (T.pack e))
  Right ValidationResult
    { vrRoute               = RouteProspectAudit
    , vrValue               = pa
    , vrWarnings            = warnings
    , vrWarningExplanations = explainWarnings warnings
    , vrBytesDropped        = dropped
    }

-- | Validate raw LLM/VLM text against the @read-portfolio@ schema.
validateUserServices :: Text -> Either ValidationError (ValidationResult UserServices)
validateUserServices raw = do
  (jsonText, warnings, dropped) <- preProcess raw
  value <- decodeJson jsonText
  us <- case AT.parseEither parseUserServices value of
          Right us -> Right us
          Left e   -> Left (SchemaParseFailed (T.pack e))
  Right ValidationResult
    { vrRoute               = RouteUserServices
    , vrValue               = us
    , vrWarnings            = warnings
    , vrWarningExplanations = explainWarnings warnings
    , vrBytesDropped        = dropped
    }

-- | Dynamic dispatch: validate raw text against the route named in the
-- first argument. Returns the validated value as a JSON 'Value' (the
-- sidecar serialises this directly into the HTTP response).
validateRouteText :: Text -> Text -> Either ValidationError (ValidationResult Value)
validateRouteText routeKeyText raw =
  case parseRouteKey routeKeyText of
    Nothing -> Left (UnknownRoute routeKeyText)
    Just route -> case route of
      RouteLeadObservation -> fmap (\vr -> vr { vrValue = leadObservationToJson (vrValue vr) })
                                   (validateLeadObservation raw)
      RouteProspectAudit   -> fmap (\vr -> vr { vrValue = prospectAuditToJson (vrValue vr) })
                                   (validateProspectAudit raw)
      RouteUserServices    -> fmap (\vr -> vr { vrValue = userServicesToJson (vrValue vr) })
                                   (validateUserServices raw)

-- ---------------------------------------------------------------------------
-- Internal helpers
-- ---------------------------------------------------------------------------

-- | Run the lenient pre-processor and return the JSON text plus warnings
-- and the count of bytes of prose/fences stripped.
preProcess :: Text -> Either ValidationError (Text, [ExtractWarning], Int)
preProcess raw = case extractJson raw of
  Right (ExtractResult jsonText warnings dropped) ->
    Right (jsonText, warnings, dropped)
  Left e -> Left (NoJsonObjectFound e)

-- | Decode a JSON 'Text' into an aeson 'Value'. Strict — fails if the
-- text is not valid JSON. Uses 'eitherDecode' so we can surface the
-- actual parse error to the caller.
decodeJson :: Text -> Either ValidationError Value
decodeJson jsonText =
  case A.eitherDecode (BL.fromStrict (TE.encodeUtf8 jsonText)) of
    Right v  -> Right v
    Left e   -> Left (AesonDecodeFailed (T.pack e <> " | json was: " <> T.take 300 jsonText))
