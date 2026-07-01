{-# LANGUAGE OverloadedStrings #-}

-- |
-- Module      : LeadProfiler.Schemas.LeadObservation
-- Description : Strict ADT for the @analyze-lead-images@ route's VLM output.
--
-- This mirrors the JSON schema documented in the original
-- @analyze-lead-images/route.ts@ prompt:
--
-- @
-- {
--   "extraction_confidence": "<high | medium | low>",
--   "observation_notes": {
--     "pace": "<text>",
--     "people_orientation": "<text>",
--     "content_shape": "<text>",
--     "engagement": "<text>",
--     "self_presentation": "<text>",
--     "pressure_tells": "<text>"
--   },
--   "digital_presence_audit": {
--     "has_website": "<yes | no | cannot_determine>",
--     "has_booking_or_payment_link": "<yes | no | cannot_determine>",
--     "has_google_reviews": "<yes | no | cannot_determine>",
--     "primary_call_to_action": "<dm | call | link | none | cannot_determine>",
--     "bio_text": "<text>",
--     "follower_count": "<text>"
--   },
--   "screenshot_summary": "<text>",
--   "what_i_could_not_determine": ["..."]
-- }
-- @
module LeadProfiler.Schemas.LeadObservation
  ( -- * Types
    LeadObservation(..)
  , ObservationNotes(..)
  , DigitalPresenceAudit(..)
  , CallToAction(..)

    -- * Constructors
  , emptyLeadObservation

    -- * JSON
  , parseLeadObservation
  , leadObservationToJson
  , encodeLeadObservationPretty
  ) where

import           LeadProfiler.Prelude
import           LeadProfiler.Schemas.Common

import qualified Data.Aeson          as A
import qualified Data.Aeson.Types    as AT
import qualified Data.ByteString.Lazy as BL
import qualified Data.Text           as T

-- | What kind of call-to-action the lead's bio contains.
data CallToAction
  = CtaDm
  | CtaCall
  | CtaLink
  | CtaNone
  | CtaCannotDetermine
  deriving (Eq, Show, Ord, Bounded, Enum)

parseCallToAction :: Text -> Parser CallToAction
parseCallToAction t = case T.toLower (T.strip t) of
  "dm"                -> pure CtaDm
  "call"              -> pure CtaCall
  "link"              -> pure CtaLink
  "none"              -> pure CtaNone
  "cannot_determine"  -> pure CtaCannotDetermine
  "unknown"           -> pure CtaCannotDetermine
  ""                  -> pure CtaCannotDetermine
  _                   -> pure CtaCannotDetermine  -- lenient: unknown CTA -> cannot_determine

renderCallToAction :: CallToAction -> Text
renderCallToAction CtaDm                = "dm"
renderCallToAction CtaCall              = "call"
renderCallToAction CtaLink              = "link"
renderCallToAction CtaNone              = "none"
renderCallToAction CtaCannotDetermine   = "cannot_determine"

-- | The @observation_notes@ sub-object.
data ObservationNotes = ObservationNotes
  { onPace               :: !Text
  , onPeopleOrientation  :: !Text
  , onContentShape       :: !Text
  , onEngagement         :: !Text
  , onSelfPresentation   :: !Text
  , onPressureTells      :: !Text
  } deriving (Eq, Show)

-- | The @digital_presence_audit@ sub-object.
data DigitalPresenceAudit = DigitalPresenceAudit
  { dpaHasWebsite              :: !TriBool
  , dpaHasBookingOrPaymentLink :: !TriBool
  , dpaHasGoogleReviews        :: !TriBool
  , dpaPrimaryCallToAction     :: !CallToAction
  , dpaBioText                 :: !Text
  , dpaFollowerCount           :: !Text
  } deriving (Eq, Show)

-- | The top-level schema for @analyze-lead-images@ output.
data LeadObservation = LeadObservation
  { loExtractionConfidence   :: !Confidence
  , loObservationNotes       :: !ObservationNotes
  , loDigitalPresenceAudit   :: !DigitalPresenceAudit
  , loScreenshotSummary      :: !Text
  , loWhatICouldNotDetermine :: ![Text]
  } deriving (Eq, Show)

-- | A honest "I have no data" value. Used as the starting point for
-- 'LeadProfiler.Defaults.fillDefaults' and as the result of last resort
-- when the LLM's output is unrecoverable.
emptyLeadObservation :: LeadObservation
emptyLeadObservation = LeadObservation
  { loExtractionConfidence   = ConfLow
  , loObservationNotes       = ObservationNotes
      { onPace              = notVisibleText
      , onPeopleOrientation = notVisibleText
      , onContentShape      = notVisibleText
      , onEngagement        = notVisibleText
      , onSelfPresentation  = notVisibleText
      , onPressureTells     = notVisibleText
      }
  , loDigitalPresenceAudit   = DigitalPresenceAudit
      { dpaHasWebsite              = TriCannotDetermine
      , dpaHasBookingOrPaymentLink = TriCannotDetermine
      , dpaHasGoogleReviews        = TriCannotDetermine
      , dpaPrimaryCallToAction     = CtaCannotDetermine
      , dpaBioText                 = "not visible"
      , dpaFollowerCount           = "not visible"
      }
  , loScreenshotSummary      = "No screenshots were summarised."
  , loWhatICouldNotDetermine = []
  }

-- | Strict aeson parser for 'LeadObservation'. Accumulates field-level
-- errors so the caller can report /all/ problems at once instead of
-- failing on the first one.
parseLeadObservation :: Value -> Parser LeadObservation
parseLeadObservation = withObject "LeadObservation" $ \o -> do
  confidenceRaw <- o .:? "extraction_confidence" .!= ""
  let confidence = case parseConfidence confidenceRaw of
                     Right c -> c
                     Left _  -> ConfLow

  notes <- parseNotes <$> (o .:? "observation_notes" .!= A.object [])

  dpa <- parseDpa <$> (o .:? "digital_presence_audit" .!= A.object [])

  screenshotSummary <- lenientTextField o "screenshot_summary"
                         "No screenshots were summarised."

  couldNotDetermineRaw <- o .:? "what_i_could_not_determine" .!= A.Array mempty
  let couldNotDetermine = parseStringListLenient couldNotDetermineRaw

  pure LeadObservation
    { loExtractionConfidence   = confidence
    , loObservationNotes       = notes
    , loDigitalPresenceAudit   = dpa
    , loScreenshotSummary      = screenshotSummary
    , loWhatICouldNotDetermine = couldNotDetermine
    }
  where
    parseNotes :: Value -> ObservationNotes
    parseNotes v = case v of
      Object o' -> ObservationNotes
        { onPace              = parseField o' "pace"              notVisibleText
        , onPeopleOrientation = parseField o' "people_orientation" notVisibleText
        , onContentShape      = parseField o' "content_shape"     notVisibleText
        , onEngagement        = parseField o' "engagement"        notVisibleText
        , onSelfPresentation  = parseField o' "self_presentation" notVisibleText
        , onPressureTells     = parseField o' "pressure_tells"    notVisibleText
        }
      _ -> loObservationNotes emptyLeadObservation

    parseDpa :: Value -> DigitalPresenceAudit
    parseDpa v = case v of
      Object o' -> DigitalPresenceAudit
        { dpaHasWebsite              = parseTriField o' "has_website"
        , dpaHasBookingOrPaymentLink = parseTriField o' "has_booking_or_payment_link"
        , dpaHasGoogleReviews        = parseTriField o' "has_google_reviews"
        , dpaPrimaryCallToAction     = parseCtaField o' "primary_call_to_action"
        , dpaBioText                 = parseField o' "bio_text"       "not visible"
        , dpaFollowerCount           = parseField o' "follower_count" "not visible"
        }
      _ -> loDigitalPresenceAudit emptyLeadObservation

    parseField :: Object -> Key -> Text -> Text
    parseField o' k dflt = case AT.parseMaybe (.:? k) o' of
      Just (Just (String s)) -> if T.null s then dflt else s
      Just (Just (Bool b))   -> if b then "yes" else "no"
      Just (Just (Number n)) -> tshow n
      _                      -> dflt

    parseTriField :: Object -> Key -> TriBool
    parseTriField o' k = case AT.parseMaybe (.:? k) o' of
      Just (Just (String s)) -> case parseTriBool s of
                                  Right tb -> tb
                                  Left _   -> TriCannotDetermine
      Just (Just (Bool b))   -> if b then TriYes else TriNo
      _                      -> TriCannotDetermine

    parseCtaField :: Object -> Key -> CallToAction
    parseCtaField o' k = case AT.parseMaybe (.:? k) o' of
      Just (Just (String s)) -> case AT.parseMaybe parseCallToAction' (String s) of
                                  Just cta -> cta
                                  Nothing  -> CtaCannotDetermine
      _                      -> CtaCannotDetermine

    parseCallToAction' :: Value -> Parser CallToAction
    parseCallToAction' = withText "CallToAction" parseCallToAction

-- | Pretty-encode a 'LeadObservation' to lazy 'ByteString' for HTTP responses.
encodeLeadObservationPretty :: LeadObservation -> BL.ByteString
encodeLeadObservationPretty lo = encodePretty (leadObservationToJson lo)

leadObservationToJson :: LeadObservation -> Value
leadObservationToJson lo = A.object
  [ "extraction_confidence" A..= renderConfidence (loExtractionConfidence lo)
  , "observation_notes" A..= observationNotesToJson (loObservationNotes lo)
  , "digital_presence_audit" A..= dpaToJson (loDigitalPresenceAudit lo)
  , "screenshot_summary" A..= loScreenshotSummary lo
  , "what_i_could_not_determine" A..= loWhatICouldNotDetermine lo
  ]

observationNotesToJson :: ObservationNotes -> Value
observationNotesToJson on = A.object
  [ "pace"               A..= onPace on
  , "people_orientation" A..= onPeopleOrientation on
  , "content_shape"      A..= onContentShape on
  , "engagement"         A..= onEngagement on
  , "self_presentation"  A..= onSelfPresentation on
  , "pressure_tells"     A..= onPressureTells on
  ]

dpaToJson :: DigitalPresenceAudit -> Value
dpaToJson dpa = A.object
  [ "has_website"                  A..= renderTriBool (dpaHasWebsite dpa)
  , "has_booking_or_payment_link"  A..= renderTriBool (dpaHasBookingOrPaymentLink dpa)
  , "has_google_reviews"           A..= renderTriBool (dpaHasGoogleReviews dpa)
  , "primary_call_to_action"       A..= renderCallToAction (dpaPrimaryCallToAction dpa)
  , "bio_text"                     A..= dpaBioText dpa
  , "follower_count"               A..= dpaFollowerCount dpa
  ]
