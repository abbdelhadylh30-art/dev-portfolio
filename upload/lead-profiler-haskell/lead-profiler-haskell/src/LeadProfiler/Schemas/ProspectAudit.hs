{-# LANGUAGE OverloadedStrings #-}

-- |
-- Module      : LeadProfiler.Schemas.ProspectAudit
-- Description : Strict ADT for the @prospect-content-audit@ route's VLM output.
module LeadProfiler.Schemas.ProspectAudit
  ( -- * Types
    ProspectAudit(..)
  , ContentTheme(..)
  , VisualStyle(..)
  , PostingStrategy(..)
  , EngagementPatterns(..)
  , BrandVoice(..)
  , GapsAndOpportunities(..)
  , SalesRecommendation(..)
  , PolishLevel(..)
  , Consistency(..)
  , PostingPattern(..)
  , CommentVolume(..)
  , TriYesNo(..)
  , PitchRecommendation(..)
  , DiscStyle(..)

    -- * Constructors
  , emptyProspectAudit

    -- * JSON
  , parseProspectAudit
  , prospectAuditToJson
  , encodeProspectAuditPretty
  ) where

import           LeadProfiler.Prelude
import           LeadProfiler.Schemas.Common

import qualified Data.Aeson           as A
import qualified Data.Aeson.Types     as AT
import qualified Data.ByteString.Lazy as BL
import qualified Data.Text            as T
import qualified Data.Vector          as V

-- | Polish level of the prospect's content.
data PolishLevel = PolishPolished | PolishSemiPolished | PolishRaw
  deriving (Eq, Show, Ord, Bounded, Enum)

parsePolishLevel :: Text -> Parser PolishLevel
parsePolishLevel t = case T.toLower (T.strip t) of
  "polished"      -> pure PolishPolished
  "semi-polished" -> pure PolishSemiPolished
  "semipolished"  -> pure PolishSemiPolished
  "raw"           -> pure PolishRaw
  _               -> pure PolishRaw  -- lenient default

renderPolishLevel :: PolishLevel -> Text
renderPolishLevel PolishPolished     = "polished"
renderPolishLevel PolishSemiPolished = "semi-polished"
renderPolishLevel PolishRaw          = "raw"

-- | Visual consistency.
data Consistency = Consistent | Inconsistent
  deriving (Eq, Show, Ord, Bounded, Enum)

parseConsistency :: Text -> Parser Consistency
parseConsistency t = case T.toLower (T.strip t) of
  "consistent"   -> pure Consistent
  "inconsistent" -> pure Inconsistent
  _              -> pure Inconsistent

renderConsistency :: Consistency -> Text
renderConsistency Consistent   = "consistent"
renderConsistency Inconsistent = "inconsistent"

-- | Posting pattern.
data PostingPattern = PatternConsistent | PatternSporadic | PatternCampaignBased
  deriving (Eq, Show, Ord, Bounded, Enum)

parsePostingPattern :: Text -> Parser PostingPattern
parsePostingPattern t = case T.toLower (T.strip t) of
  "consistent"      -> pure PatternConsistent
  "sporadic"        -> pure PatternSporadic
  "campaign-based"  -> pure PatternCampaignBased
  "campaignbased"   -> pure PatternCampaignBased
  _                 -> pure PatternSporadic

renderPostingPattern :: PostingPattern -> Text
renderPostingPattern PatternConsistent     = "consistent"
renderPostingPattern PatternSporadic       = "sporadic"
renderPostingPattern PatternCampaignBased  = "campaign-based"

-- | Comment volume bucket.
data CommentVolume = VolLow | VolMedium | VolHigh | VolCannotDetermine
  deriving (Eq, Show, Ord, Bounded, Enum)

parseCommentVolume :: Text -> Parser CommentVolume
parseCommentVolume t = case T.toLower (T.strip t) of
  "low"              -> pure VolLow
  "medium"           -> pure VolMedium
  "high"             -> pure VolHigh
  "cannot_determine" -> pure VolCannotDetermine
  _                  -> pure VolCannotDetermine

renderCommentVolume :: CommentVolume -> Text
renderCommentVolume VolLow               = "low"
renderCommentVolume VolMedium            = "medium"
renderCommentVolume VolHigh              = "high"
renderCommentVolume VolCannotDetermine   = "cannot_determine"

-- | A yes/no/(cannot_determine) bucket (used for negative comments etc.).
data TriYesNo = TYNYes | TYNNo | TYNCannotDetermine
  deriving (Eq, Show, Ord, Bounded, Enum)

parseTriYesNo :: Text -> Parser TriYesNo
parseTriYesNo t = case T.toLower (T.strip t) of
  "yes"              -> pure TYNYes
  "no"               -> pure TYNNo
  "cannot_determine" -> pure TYNCannotDetermine
  _                  -> pure TYNCannotDetermine

renderTriYesNo :: TriYesNo -> Text
renderTriYesNo TYNYes              = "yes"
renderTriYesNo TYNNo               = "no"
renderTriYesNo TYNCannotDetermine  = "cannot_determine"

-- | Should the salesperson pitch?
data PitchRecommendation = PitchYes | PitchNo | PitchMaybe
  deriving (Eq, Show, Ord, Bounded, Enum)

parsePitchRecommendation :: Text -> Parser PitchRecommendation
parsePitchRecommendation t = case T.toLower (T.strip t) of
  "yes"   -> pure PitchYes
  "no"    -> pure PitchNo
  "maybe" -> pure PitchMaybe
  _       -> pure PitchMaybe

renderPitchRecommendation :: PitchRecommendation -> Text
renderPitchRecommendation PitchYes   = "yes"
renderPitchRecommendation PitchNo    = "no"
renderPitchRecommendation PitchMaybe = "maybe"

-- | Rough DiSC style guess.
data DiscStyle = DiscD | DiscI | DiscS | DiscC
               | DiscDi | DiscIS | DiscSC | DiscDC
               | DiscSI | DiscID | DiscCS | DiscCD
               | DiscUnknown
  deriving (Eq, Show, Ord, Bounded, Enum)

parseDiscStyle :: Text -> Parser DiscStyle
parseDiscStyle t =
  case T.toUpper (T.strip t) of
    "D"     -> pure DiscD
    "I"     -> pure DiscI
    "S"     -> pure DiscS
    "C"     -> pure DiscC
    "DI"    -> pure DiscDi
    "ID"    -> pure DiscID
    "IS"    -> pure DiscIS
    "SI"    -> pure DiscSI
    "SC"    -> pure DiscSC
    "CS"    -> pure DiscCS
    "DC"    -> pure DiscDC
    "CD"    -> pure DiscCD
    ""      -> pure DiscUnknown
    _       -> pure DiscUnknown

renderDiscStyle :: DiscStyle -> Text
renderDiscStyle DiscD       = "D"
renderDiscStyle DiscI       = "i"
renderDiscStyle DiscS       = "S"
renderDiscStyle DiscC       = "C"
renderDiscStyle DiscDi      = "Di"
renderDiscStyle DiscID      = "iD"
renderDiscStyle DiscIS      = "iS"
renderDiscStyle DiscSI      = "Si"
renderDiscStyle DiscSC      = "SC"
renderDiscStyle DiscCS      = "CS"
renderDiscStyle DiscDC      = "DC"
renderDiscStyle DiscCD      = "CD"
renderDiscStyle DiscUnknown = "unknown"

-- | A content theme entry.
data ContentTheme = ContentTheme
  { ctTheme             :: !Text
  , ctEstimatedPct      :: !Int       -- 0..100; clamped
  , ctExamplePost       :: !Text
  } deriving (Eq, Show)

-- | Visual style block.
data VisualStyle = VisualStyle
  { vsDescription        :: !Text
  , vsPolishLevel        :: !PolishLevel
  , vsConsistency        :: !Consistency
  , vsColorsOrDesignNotes :: !Text
  } deriving (Eq, Show)

-- | Posting strategy block.
data PostingStrategy = PostingStrategy
  { psFormatsUsed      :: ![Text]
  , psPattern          :: !PostingPattern
  , psRecurringSeries  :: ![Text]
  } deriving (Eq, Show)

-- | Engagement patterns block.
data EngagementPatterns = EngagementPatterns
  { epCommentVolume         :: !CommentVolume
  , epReplyBehavior         :: !Text
  , epNegativeCommentsVisible :: !TriYesNo
  , epUserGeneratedContent  :: !TriYesNo
  } deriving (Eq, Show)

-- | Brand voice block.
data BrandVoice = BrandVoice
  { bvTone             :: !Text
  , bvLanguageRegister :: !Text
  , bvSignaturePhrases :: ![Text]
  , bvAudienceAddress  :: !Text
  } deriving (Eq, Show)

-- | Gaps and opportunities block.
data GapsAndOpportunities = GapsAndOpportunities
  { goMissingContent        :: ![Text]
  , goOperationalPainPoints :: ![Text]
  , goDigitalPresenceGaps   :: ![Text]
  , goServicesToPitch       :: ![Text]
  } deriving (Eq, Show)

-- | Sales recommendation block.
data SalesRecommendation = SalesRecommendation
  { srShouldPitch         :: !PitchRecommendation
  , srWhy                 :: !Text
  , srPitchAngle          :: !Text
  , srLikelyPainPoint     :: !Text
  , srRoughDiscStyle      :: !DiscStyle
  , srRecommendedRegister :: !Text
  } deriving (Eq, Show)

-- | Top-level prospect audit object.
data ProspectAudit = ProspectAudit
  { paAuditConfidence        :: !Confidence
  , paContentThemes          :: ![ContentTheme]
  , paVisualStyle            :: !VisualStyle
  , paPostingStrategy        :: !PostingStrategy
  , paEngagementPatterns     :: !EngagementPatterns
  , paBrandVoice             :: !BrandVoice
  , paGapsAndOpportunities   :: !GapsAndOpportunities
  , paSalesRecommendation    :: !SalesRecommendation
  , paWhatICouldNotDetermine :: ![Text]
  } deriving (Eq, Show)

-- | Honest "no data" default.
emptyProspectAudit :: ProspectAudit
emptyProspectAudit = ProspectAudit
  { paAuditConfidence = ConfLow
  , paContentThemes = []
  , paVisualStyle = VisualStyle
      { vsDescription         = "Visual style not assessed from screenshots."
      , vsPolishLevel         = PolishRaw
      , vsConsistency         = Inconsistent
      , vsColorsOrDesignNotes = "not visible in screenshots"
      }
  , paPostingStrategy = PostingStrategy
      { psFormatsUsed = []
      , psPattern = PatternSporadic
      , psRecurringSeries = []
      }
  , paEngagementPatterns = EngagementPatterns
      { epCommentVolume = VolCannotDetermine
      , epReplyBehavior = "not visible in screenshots"
      , epNegativeCommentsVisible = TYNCannotDetermine
      , epUserGeneratedContent = TYNCannotDetermine
      }
  , paBrandVoice = BrandVoice
      { bvTone = "unknown"
      , bvLanguageRegister = "unknown"
      , bvSignaturePhrases = []
      , bvAudienceAddress = "unknown"
      }
  , paGapsAndOpportunities = GapsAndOpportunities
      { goMissingContent = []
      , goOperationalPainPoints = []
      , goDigitalPresenceGaps = []
      , goServicesToPitch = []
      }
  , paSalesRecommendation = SalesRecommendation
      { srShouldPitch = PitchMaybe
      , srWhy = "Audit did not produce enough evidence to recommend."
      , srPitchAngle = "unknown"
      , srLikelyPainPoint = "unknown"
      , srRoughDiscStyle = DiscUnknown
      , srRecommendedRegister = "unknown"
      }
  , paWhatICouldNotDetermine = []
  }

-- | Strict aeson parser. Uses 'withObject' on the outer object and
-- 'parseMaybe' on each sub-field so a single bad sub-field doesn't blow
-- up the whole parse — instead, we fall back to the empty default for
-- that sub-object.
parseProspectAudit :: Value -> Parser ProspectAudit
parseProspectAudit = withObject "ProspectAudit" $ \o -> do
  confRaw <- o .:? "audit_confidence" .!= ""
  let conf = case parseConfidence confRaw of Right c -> c; Left _ -> ConfLow

  themes <- parseThemes <$> (o .:? "content_themes" .!= A.Array mempty)

  vs <- parseVisualStyle <$> (o .:? "visual_style" .!= A.object [])

  ps <- parsePostingStrategy' <$> (o .:? "posting_strategy" .!= A.object [])

  ep <- parseEngagementPatterns' <$> (o .:? "engagement_patterns" .!= A.object [])

  bv <- parseBrandVoice <$> (o .:? "brand_voice" .!= A.object [])

  go <- parseGaps <$> (o .:? "gaps_and_opportunities" .!= A.object [])

  sr <- parseSalesRec <$> (o .:? "sales_recommendation" .!= A.object [])

  couldNotRaw <- o .:? "what_i_could_not_determine" .!= A.Array mempty
  let couldNot = parseStringListLenient couldNotRaw

  pure ProspectAudit
    { paAuditConfidence        = conf
    , paContentThemes          = themes
    , paVisualStyle            = vs
    , paPostingStrategy        = ps
    , paEngagementPatterns     = ep
    , paBrandVoice             = bv
    , paGapsAndOpportunities   = go
    , paSalesRecommendation    = sr
    , paWhatICouldNotDetermine = couldNot
    }
  where
    parseThemes :: Value -> [ContentTheme]
    parseThemes = \case
      Array a -> [ theme | Just theme <- map themeFromValue (V.toList a) ]
      _       -> []
    themeFromValue v = case v of
      Object o' -> Just ContentTheme
        { ctTheme = textField o' "theme" "unknown"
        , ctEstimatedPct = clampPct (intField o' "estimated_percentage" 0)
        , ctExamplePost = textField o' "example_post" ""
        }
      _ -> Nothing

    parseVisualStyle :: Value -> VisualStyle
    parseVisualStyle = \case
      Object o' -> VisualStyle
        { vsDescription         = textField o' "description" "not visible in screenshots"
        , vsPolishLevel        = polishField o' "polish_level"
        , vsConsistency        = consistencyField o' "consistency"
        , vsColorsOrDesignNotes = textField o' "colors_or_design_notes" "not visible in screenshots"
        }
      _ -> paVisualStyle emptyProspectAudit

    parsePostingStrategy' :: Value -> PostingStrategy
    parsePostingStrategy' = \case
      Object o' -> PostingStrategy
        { psFormatsUsed     = listTextField o' "formats_used"
        , psPattern         = patternField o' "pattern"
        , psRecurringSeries = listTextField o' "recurring_series"
        }
      _ -> paPostingStrategy emptyProspectAudit

    parseEngagementPatterns' :: Value -> EngagementPatterns
    parseEngagementPatterns' = \case
      Object o' -> EngagementPatterns
        { epCommentVolume           = volumeField o' "comment_volume"
        , epReplyBehavior           = textField o' "reply_behavior" "not visible in screenshots"
        , epNegativeCommentsVisible = triYesNoField o' "negative_comments_visible"
        , epUserGeneratedContent    = triYesNoField o' "user_generated_content"
        }
      _ -> paEngagementPatterns emptyProspectAudit

    parseBrandVoice :: Value -> BrandVoice
    parseBrandVoice = \case
      Object o' -> BrandVoice
        { bvTone             = textField o' "tone" "unknown"
        , bvLanguageRegister = textField o' "language_register" "unknown"
        , bvSignaturePhrases = listTextField o' "signature_phrases"
        , bvAudienceAddress  = textField o' "audience_address" "unknown"
        }
      _ -> paBrandVoice emptyProspectAudit

    parseGaps :: Value -> GapsAndOpportunities
    parseGaps = \case
      Object o' -> GapsAndOpportunities
        { goMissingContent        = listTextField o' "missing_content"
        , goOperationalPainPoints = listTextField o' "operational_pain_points"
        , goDigitalPresenceGaps   = listTextField o' "digital_presence_gaps"
        , goServicesToPitch       = listTextField o' "services_to_pitch"
        }
      _ -> paGapsAndOpportunities emptyProspectAudit

    parseSalesRec :: Value -> SalesRecommendation
    parseSalesRec = \case
      Object o' -> SalesRecommendation
        { srShouldPitch         = pitchField o' "should_pitch"
        , srWhy                 = textField o' "why" ""
        , srPitchAngle          = textField o' "pitch_angle" ""
        , srLikelyPainPoint     = textField o' "likely_pain_point" ""
        , srRoughDiscStyle      = discField o' "rough_disc_style"
        , srRecommendedRegister = textField o' "recommended_register" ""
        }
      _ -> paSalesRecommendation emptyProspectAudit

    -- Field helpers --------------------------------------------------------

    textField :: Object -> Key -> Text -> Text
    textField o' k dflt = case AT.parseMaybe (.:? k) o' of
      Just (Just (String s)) -> if T.null s then dflt else s
      Just (Just (Bool b))   -> if b then "yes" else "no"
      Just (Just (Number n)) -> tshow n
      _                      -> dflt

    intField :: Object -> Key -> Int -> Int
    intField o' k dflt = case AT.parseMaybe (.:? k) o' of
      Just (Just (Number n)) -> fromInteger (round n)
      _                      -> dflt

    listTextField :: Object -> Key -> [Text]
    listTextField o' k = case AT.parseMaybe (.:? k) o' of
      Just (Just v) -> parseStringListLenient v
      _             -> []

    polishField o' k      = case textField o' k "" of
                              "" -> PolishRaw
                              t  -> case AT.parseMaybe parsePolishLevel' (String t) of
                                      Just p  -> p
                                      Nothing -> PolishRaw
    consistencyField o' k = case textField o' k "" of
                              "" -> Inconsistent
                              t  -> case AT.parseMaybe parseConsistency' (String t) of
                                      Just c  -> c
                                      Nothing -> Inconsistent
    patternField o' k     = case textField o' k "" of
                              "" -> PatternSporadic
                              t  -> case AT.parseMaybe parsePostingPattern' (String t) of
                                      Just p  -> p
                                      Nothing -> PatternSporadic
    volumeField o' k      = case textField o' k "" of
                              "" -> VolCannotDetermine
                              t  -> case AT.parseMaybe parseCommentVolume' (String t) of
                                      Just v  -> v
                                      Nothing -> VolCannotDetermine
    triYesNoField o' k    = case textField o' k "" of
                              "" -> TYNCannotDetermine
                              t  -> case AT.parseMaybe parseTriYesNo' (String t) of
                                      Just t' -> t'
                                      Nothing -> TYNCannotDetermine
    pitchField o' k       = case textField o' k "" of
                              "" -> PitchMaybe
                              t  -> case AT.parseMaybe parsePitchRecommendation' (String t) of
                                      Just p  -> p
                                      Nothing -> PitchMaybe
    discField o' k        = case textField o' k "" of
                              "" -> DiscUnknown
                              t  -> case AT.parseMaybe parseDiscStyle' (String t) of
                                      Just d  -> d
                                      Nothing -> DiscUnknown

    parsePolishLevel'         = withText "PolishLevel"        parsePolishLevel
    parseConsistency'         = withText "Consistency"        parseConsistency
    parsePostingPattern'      = withText "PostingPattern"     parsePostingPattern
    parseCommentVolume'       = withText "CommentVolume"      parseCommentVolume
    parseTriYesNo'            = withText "TriYesNo"           parseTriYesNo
    parsePitchRecommendation' = withText "PitchRecommendation" parsePitchRecommendation
    parseDiscStyle'           = withText "DiscStyle"          parseDiscStyle

    clampPct n
      | n < 0    = 0
      | n > 100  = 100
      | otherwise = n

-- | Pretty-encode to lazy 'ByteString'.
encodeProspectAuditPretty :: ProspectAudit -> BL.ByteString
encodeProspectAuditPretty = encodePretty . prospectAuditToJson

prospectAuditToJson :: ProspectAudit -> Value
prospectAuditToJson pa = A.object
  [ "audit_confidence"           A..= renderConfidence (paAuditConfidence pa)
  , "content_themes"             A..= map themeToJson (paContentThemes pa)
  , "visual_style"               A..= visualStyleToJson (paVisualStyle pa)
  , "posting_strategy"           A..= postingStrategyToJson (paPostingStrategy pa)
  , "engagement_patterns"        A..= engagementPatternsToJson (paEngagementPatterns pa)
  , "brand_voice"                A..= brandVoiceToJson (paBrandVoice pa)
  , "gaps_and_opportunities"     A..= gapsToJson (paGapsAndOpportunities pa)
  , "sales_recommendation"       A..= salesRecToJson (paSalesRecommendation pa)
  , "what_i_could_not_determine" A..= paWhatICouldNotDetermine pa
  ]

themeToJson :: ContentTheme -> Value
themeToJson ct = A.object
  [ "theme"               A..= ctTheme ct
  , "estimated_percentage" A..= ctEstimatedPct ct
  , "example_post"        A..= ctExamplePost ct
  ]

visualStyleToJson :: VisualStyle -> Value
visualStyleToJson vs = A.object
  [ "description"            A..= vsDescription vs
  , "polish_level"           A..= renderPolishLevel (vsPolishLevel vs)
  , "consistency"            A..= renderConsistency (vsConsistency vs)
  , "colors_or_design_notes" A..= vsColorsOrDesignNotes vs
  ]

postingStrategyToJson :: PostingStrategy -> Value
postingStrategyToJson ps = A.object
  [ "formats_used"     A..= psFormatsUsed ps
  , "pattern"          A..= renderPostingPattern (psPattern ps)
  , "recurring_series" A..= psRecurringSeries ps
  ]

engagementPatternsToJson :: EngagementPatterns -> Value
engagementPatternsToJson ep = A.object
  [ "comment_volume"             A..= renderCommentVolume (epCommentVolume ep)
  , "reply_behavior"             A..= epReplyBehavior ep
  , "negative_comments_visible"  A..= renderTriYesNo (epNegativeCommentsVisible ep)
  , "user_generated_content"     A..= renderTriYesNo (epUserGeneratedContent ep)
  ]

brandVoiceToJson :: BrandVoice -> Value
brandVoiceToJson bv = A.object
  [ "tone"              A..= bvTone bv
  , "language_register" A..= bvLanguageRegister bv
  , "signature_phrases" A..= bvSignaturePhrases bv
  , "audience_address"  A..= bvAudienceAddress bv
  ]

gapsToJson :: GapsAndOpportunities -> Value
gapsToJson go = A.object
  [ "missing_content"        A..= goMissingContent go
  , "operational_pain_points" A..= goOperationalPainPoints go
  , "digital_presence_gaps"  A..= goDigitalPresenceGaps go
  , "services_to_pitch"      A..= goServicesToPitch go
  ]

salesRecToJson :: SalesRecommendation -> Value
salesRecToJson sr = A.object
  [ "should_pitch"          A..= renderPitchRecommendation (srShouldPitch sr)
  , "why"                   A..= srWhy sr
  , "pitch_angle"           A..= srPitchAngle sr
  , "likely_pain_point"     A..= srLikelyPainPoint sr
  , "rough_disc_style"      A..= renderDiscStyle (srRoughDiscStyle sr)
  , "recommended_register"  A..= srRecommendedRegister sr
  ]
