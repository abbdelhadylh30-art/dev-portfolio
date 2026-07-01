{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

-- |
-- Module      : LeadProfiler.Defaults
-- Description : Fill missing or @unknown@ fields with honest sentinel values.
--
-- The strict parsers in @LeadProfiler.Schemas.*@ already supply defaults
-- for missing fields — but what about fields that the LLM /did/ emit but
-- set to a placeholder like @"unknown"@, @"not specified"@, or
-- @"track record not visible"@? Those slip past the schema parser because
-- they are valid 'Text' values, but they carry no useful information for
-- downstream code.
--
-- This module walks a populated ADT and replaces placeholder text with
-- the canonical sentinel values from 'LeadProfiler.Schemas.Common'. That
-- way, downstream consumers can pattern-match on a single canonical
-- "no data" string instead of trying to guess what the LLM meant.
module LeadProfiler.Defaults
  ( fillDefaultsLeadObservation
  , fillDefaultsProspectAudit
  , fillDefaultsUserServices
  , isPlaceholderText
  ) where

import           LeadProfiler.Prelude
import           LeadProfiler.Schemas.Common
import           LeadProfiler.Schemas.LeadObservation
import           LeadProfiler.Schemas.ProspectAudit
import           LeadProfiler.Schemas.UserServices

import qualified Data.Text as T

-- | Returns 'True' for the textual patterns LLMs use when they have no
-- real answer. Case-insensitive, after stripping whitespace.
--
-- Examples we treat as "no data":
--
--   * @""@, @" "@
--   * @"unknown"@, @"not specified"@, @"not visible"@, @"not visible in screenshots"@
--   * @"cannot determine"@, @"cannot_determine"@, @"n/a"@, @"na"@
--   * @"none"@, @"null"@
--   * @"see above"@, @"see below"@, @"as mentioned"@
isPlaceholderText :: Text -> Bool
isPlaceholderText t =
  let s = T.toLower (T.strip t)
  in T.null s
     || s `elem`
        [ "unknown"
        , "not specified"
        , "not visible"
        , "not visible in screenshots"
        , "cannot determine"
        , "cannot_determine"
        , "n/a"
        , "na"
        , "none"
        , "null"
        , "see above"
        , "see below"
        , "as mentioned"
        , "various"
        , "various projects"
        , "various web projects"
        ]
     || T.isPrefixOf "track record not" s
     || T.isPrefixOf "service depth not" s

-- | Walk a 'LeadObservation' and replace any placeholder text fields with
-- the canonical sentinel. Tri-bool fields are not touched — they are
-- already either a real Yes/No or 'TriCannotDetermine'.
fillDefaultsLeadObservation :: LeadObservation -> LeadObservation
fillDefaultsLeadObservation lo = lo
  { loObservationNotes = normaliseNotes (loObservationNotes lo)
  , loDigitalPresenceAudit = normaliseDpa (loDigitalPresenceAudit lo)
  , loScreenshotSummary =
      if isPlaceholderText (loScreenshotSummary lo)
        then "No screenshots were summarised."
        else loScreenshotSummary lo
  }
  where
    normaliseNotes on = on
      { onPace              = canon (onPace on)              notVisibleText
      , onPeopleOrientation = canon (onPeopleOrientation on) notVisibleText
      , onContentShape      = canon (onContentShape on)      notVisibleText
      , onEngagement        = canon (onEngagement on)        notVisibleText
      , onSelfPresentation  = canon (onSelfPresentation on)  notVisibleText
      , onPressureTells     = canon (onPressureTells on)     notVisibleText
      }
    normaliseDpa dpa = dpa
      { dpaBioText       = canon (dpaBioText dpa)       "not visible"
      , dpaFollowerCount = canon (dpaFollowerCount dpa) "not visible"
      }

    canon :: Text -> Text -> Text
    canon v dflt = if isPlaceholderText v then dflt else v

-- | Walk a 'ProspectAudit' and replace placeholder text fields.
fillDefaultsProspectAudit :: ProspectAudit -> ProspectAudit
fillDefaultsProspectAudit pa = pa
  { paVisualStyle = vs'
  , paEngagementPatterns = ep'
  , paBrandVoice = bv'
  , paSalesRecommendation = sr'
  , paContentThemes = map normaliseTheme (paContentThemes pa)
  }
  where
    canon :: Text -> Text -> Text
    canon v dflt = if isPlaceholderText v then dflt else v

    vs' = (paVisualStyle pa)
      { vsDescription         = canon (vsDescription (paVisualStyle pa))
                                  "Visual style not assessed from screenshots."
      , vsColorsOrDesignNotes = canon (vsColorsOrDesignNotes (paVisualStyle pa))
                                  "not visible in screenshots"
      }
    ep' = (paEngagementPatterns pa)
      { epReplyBehavior = canon (epReplyBehavior (paEngagementPatterns pa))
                            "not visible in screenshots"
      }
    bv' = (paBrandVoice pa)
      { bvTone             = canon (bvTone (paBrandVoice pa))             "unknown"
      , bvLanguageRegister = canon (bvLanguageRegister (paBrandVoice pa)) "unknown"
      , bvAudienceAddress  = canon (bvAudienceAddress (paBrandVoice pa))  "unknown"
      , bvSignaturePhrases = filter (not . isPlaceholderText)
                                    (bvSignaturePhrases (paBrandVoice pa))
      }
    sr' = (paSalesRecommendation pa)
      { srWhy                 = canon (srWhy (paSalesRecommendation pa))
                                  "Audit did not produce enough evidence to recommend."
      , srPitchAngle          = canon (srPitchAngle (paSalesRecommendation pa))          "unknown"
      , srLikelyPainPoint     = canon (srLikelyPainPoint (paSalesRecommendation pa))     "unknown"
      , srRecommendedRegister = canon (srRecommendedRegister (paSalesRecommendation pa)) "unknown"
      }
    normaliseTheme ct = ct
      { ctTheme       = canon (ctTheme ct)       "unknown"
      , ctExamplePost = canon (ctExamplePost ct) ""
      }

-- | Walk a 'UserServices' and replace placeholder text fields. Also drops
-- placeholder entries from @past_work_examples@.
fillDefaultsUserServices :: UserServices -> UserServices
fillDefaultsUserServices us = us
  { usPrimary         = usPrimary us  -- leave primary as-is; empty is meaningful
  , usSecondary       = usSecondary us
  , usPastWorkExamples = filter (not . isPlaceholderText) (usPastWorkExamples us)
  , usTrackRecord     = canon (usTrackRecord us)
                          "Track record not specified on portfolio page — user should fill in manually."
  , usServiceDepth    = canon (usServiceDepth us)
                          "Service depth not clearly differentiated on portfolio page."
  , usExtractionNotes = if isPlaceholderText (usExtractionNotes us)
                          then "No extraction notes provided."
                          else usExtractionNotes us
  }
  where
    canon v dflt = if isPlaceholderText v then dflt else v
