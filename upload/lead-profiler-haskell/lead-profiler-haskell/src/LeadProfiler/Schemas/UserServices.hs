{-# LANGUAGE OverloadedStrings #-}

-- |
-- Module      : LeadProfiler.Schemas.UserServices
-- Description : Strict ADT for the @read-portfolio@ route's LLM output.
module LeadProfiler.Schemas.UserServices
  ( -- * Types
    UserServices(..)

    -- * Constructors
  , emptyUserServices

    -- * JSON
  , parseUserServices
  , userServicesToJson
  , encodeUserServicesPretty
  ) where

import           LeadProfiler.Prelude
import           LeadProfiler.Schemas.Common

import qualified Data.Aeson           as A
import qualified Data.Aeson.Types     as AT
import qualified Data.ByteString.Lazy as BL
import qualified Data.Text            as T

-- | The user_services schema from the original @read-portfolio@ route.
-- This is also the shape the lead-profiler frontend expects (see
-- @lib/lead-profiler-types.ts@ in the Next.js project).
data UserServices = UserServices
  { usPrimary           :: !Text
  , usSecondary         :: !Text
  , usPastWorkExamples  :: ![Text]
  , usTrackRecord       :: !Text
  , usServiceDepth      :: !Text
  , usExtractionNotes   :: !Text
  } deriving (Eq, Show)

-- | Honest "no data" default. Mirrors the empty-state copy in the original
-- prompt ("Track record not specified...", "Service depth not clearly
-- differentiated...").
emptyUserServices :: UserServices
emptyUserServices = UserServices
  { usPrimary          = ""
  , usSecondary        = ""
  , usPastWorkExamples = []
  , usTrackRecord      = "Track record not specified on portfolio page — user should fill in manually."
  , usServiceDepth     = "Service depth not clearly differentiated on portfolio page."
  , usExtractionNotes  = "No extraction notes provided."
  }

-- | Strict aeson parser. Tolerates missing keys, null values, and
-- non-array values for @past_work_examples@ (a single string is coerced
-- to a one-element list).
parseUserServices :: Value -> Parser UserServices
parseUserServices = withObject "UserServices" $ \o -> do
  primary   <- textField o "primary" ""
  secondary <- textField o "secondary" ""
  pastWork  <- listField o "past_work_examples"
  track     <- textField o "track_record"
                "Track record not specified on portfolio page — user should fill in manually."
  depth     <- textField o "service_depth"
                "Service depth not clearly differentiated on portfolio page."
  notes     <- textField o "extraction_notes" "No extraction notes provided."

  -- Sanitise past_work_examples: drop empty / placeholder entries.
  let pastWork' = filter isUsable pastWork

  pure UserServices
    { usPrimary          = primary
    , usSecondary        = secondary
    , usPastWorkExamples = pastWork'
    , usTrackRecord      = track
    , usServiceDepth     = depth
    , usExtractionNotes  = notes
    }
  where
    textField :: Object -> Key -> Text -> Parser Text
    textField o k dflt = case AT.parseMaybe (.:? k) o of
      Just (Just (String s)) -> pure (if T.null s then dflt else s)
      Just (Just (Bool b))   -> pure (if b then "yes" else "no")
      Just (Just (Number n)) -> pure (tshow n)
      _                      -> pure dflt

    listField :: Object -> Key -> Parser [Text]
    listField o k = case AT.parseMaybe (.:? k) o of
      Just (Just v) -> pure (parseStringListLenient v)
      _             -> pure []

    isUsable t =
      not (T.null (T.strip t))
      && T.toLower (T.strip t) `notElem`
           [ "various web projects"
           , "various projects"
           , "n/a"
           , "none"
           , "see above"
           ]

-- | Pretty-encode to lazy 'ByteString'.
encodeUserServicesPretty :: UserServices -> BL.ByteString
encodeUserServicesPretty = encodePretty . userServicesToJson

userServicesToJson :: UserServices -> Value
userServicesToJson us = A.object
  [ "primary"            A..= usPrimary us
  , "secondary"          A..= usSecondary us
  , "past_work_examples" A..= usPastWorkExamples us
  , "track_record"       A..= usTrackRecord us
  , "service_depth"      A..= usServiceDepth us
  , "extraction_notes"   A..= usExtractionNotes us
  ]
