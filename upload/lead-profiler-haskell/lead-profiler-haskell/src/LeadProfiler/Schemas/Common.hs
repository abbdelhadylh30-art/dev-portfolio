{-# LANGUAGE OverloadedStrings #-}

-- |
-- Module      : LeadProfiler.Schemas.Common
-- Description : Shared types used by all three route schemas.
module LeadProfiler.Schemas.Common
  ( -- * Three-valued booleans
    TriBool(..)
  , parseTriBool
  , renderTriBool

    -- * Confidence levels
  , Confidence(..)
  , parseConfidence
  , renderConfidence

    -- * Helper aeson parsers
  , lenientTextField
  , parseStringListLenient

    -- * Defaults
  , unknownText
  , notVisibleText
  , cannotDetermineText
  ) where

import           LeadProfiler.Prelude

import qualified Data.Text        as T
import qualified Data.Vector      as V

-- | Three-valued boolean used by the lead-observation schema for fields
-- like @has_website@ which can be @\"yes\"@, @\"no\"@, or
-- @\"cannot_determine\"@.
data TriBool = TriYes | TriNo | TriCannotDetermine
  deriving (Eq, Show, Ord, Bounded, Enum)

parseTriBool :: Text -> Either Text TriBool
parseTriBool t = case T.toLower (T.strip t) of
  "yes"               -> Right TriYes
  "no"                -> Right TriNo
  "cannot_determine"  -> Right TriCannotDetermine
  "unknown"           -> Right TriCannotDetermine
  "n/a"               -> Right TriCannotDetermine
  "maybe"             -> Right TriCannotDetermine
  _                   -> Left $ "not a tri-bool: " <> t

renderTriBool :: TriBool -> Text
renderTriBool TriYes              = "yes"
renderTriBool TriNo               = "no"
renderTriBool TriCannotDetermine  = "cannot_determine"

-- | Confidence level used by both @extraction_confidence@ and
-- @audit_confidence@.
data Confidence = ConfHigh | ConfMedium | ConfLow
  deriving (Eq, Show, Ord, Bounded, Enum)

parseConfidence :: Text -> Either Text Confidence
parseConfidence t = case T.toLower (T.strip t) of
  "high"   -> Right ConfHigh
  "medium" -> Right ConfMedium
  "low"    -> Right ConfLow
  _        -> Left $ "not a confidence level: " <> t

renderConfidence :: Confidence -> Text
renderConfidence ConfHigh   = "high"
renderConfidence ConfMedium = "medium"
renderConfidence ConfLow    = "low"

-- | Sentinel value used to mark a field that the LLM omitted or set to
-- an unrecognised value. Downstream code can detect this and react.
unknownText :: Text
unknownText = "unknown"

-- | Sentinel for fields where the LLM said it could not see the answer
-- in the screenshots.
notVisibleText :: Text
notVisibleText = "not visible in screenshots"

-- | Sentinel for tri-valued fields where the LLM said it could not
-- determine the answer.
cannotDetermineText :: Text
cannotDetermineText = "cannot_determine"

-- | Aeson parser combinator: read a field that should be a string, but
-- tolerate missing keys, null, numbers, or booleans (coercing them to
-- text). Returns the default for missing/null/empty.
lenientTextField :: Object -> Key -> Text -> Parser Text
lenientTextField o k dflt = do
  mv <- o .:? k
  pure $ case mv of
    Nothing   -> dflt
    Just Null -> dflt
    Just (String s) -> if T.null s then dflt else s
    Just (Bool b)   -> if b then "yes" else "no"
    Just (Number n) -> tshow n
    Just (Array a)  -> case V.toList a of
                         [String s] -> s
                         _          -> dflt
    Just _          -> dflt

-- | Parse a JSON array of strings, tolerating:
--
--   * Missing key -> empty list
--   * null -> empty list
--   * a single string instead of an array -> one-element list
--   * non-string elements -> those elements are dropped (not fatal)
--
-- This is a pure function (not a 'Parser') because there is no failure
-- mode — every input maps to some list. Callers can wrap it in 'pure'
-- if they need a 'Parser'.
parseStringListLenient :: Value -> [Text]
parseStringListLenient = \case
  Null      -> []
  String s  -> [s]
  Array a   -> [ s | String s <- V.toList a ]
  _         -> []
