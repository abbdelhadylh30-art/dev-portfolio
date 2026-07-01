{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

module LeadProfiler.Schemas.ProspectAuditSpec (spec) where

import           Test.Hspec
import           Test.Hspec.Expectations

import           LeadProfiler.Prelude
import           LeadProfiler.Schemas.ProspectAudit
import           LeadProfiler.Schemas.Common        (Confidence(..))
import           LeadProfiler.Validate

import qualified Data.Aeson          as A
import qualified Data.Aeson.Types     as AT
import qualified Data.Text           as T
import           System.Directory    (listDirectory)
import           System.FilePath     ((</>), takeExtension)

spec :: Spec
spec = do
  describe "parseProspectAudit" $ do
    it "parses a well-formed object" $ do
      let v = A.object
            [ "audit_confidence" A..= String "medium"
            , "content_themes" A..= [ A.object
                [ "theme" A..= String "Educational"
                , "estimated_percentage" A..= Number 40
                , "example_post" A..= String "Tips carousel"
                ]
              ]
            , "visual_style" A..= A.object
                [ "description" A..= String "Warm."
                , "polish_level" A..= String "polished"
                , "consistency" A..= String "consistent"
                , "colors_or_design_notes" A..= String "Terracotta."
                ]
            , "posting_strategy" A..= A.object
                [ "formats_used" A..= [String "carousel"]
                , "pattern" A..= String "consistent"
                , "recurring_series" A..= [String "Tip Tuesday"]
                ]
            , "engagement_patterns" A..= A.object
                [ "comment_volume" A..= String "medium"
                , "reply_behavior" A..= String "Replies to ~half."
                , "negative_comments_visible" A..= String "no"
                , "user_generated_content" A..= String "yes"
                ]
            , "brand_voice" A..= A.object
                [ "tone" A..= String "warm"
                , "language_register" A..= String "english"
                , "signature_phrases" A..= [String "DM to apply"]
                , "audience_address" A..= String "friends"
                ]
            , "gaps_and_opportunities" A..= A.object
                [ "missing_content" A..= [String "No testimonials"]
                , "operational_pain_points" A..= [String "Slow DMs"]
                , "digital_presence_gaps" A..= [String "No booking"]
                , "services_to_pitch" A..= [String "Booking dashboard"]
                ]
            , "sales_recommendation" A..= A.object
                [ "should_pitch" A..= String "yes"
                , "why" A..= String "Pain visible."
                , "pitch_angle" A..= String "Time-saver."
                , "likely_pain_point" A..= String "DM overload."
                , "rough_disc_style" A..= String "i"
                , "recommended_register" A..= String "Warm."
                ]
            , "what_i_could_not_determine" A..= [String "Revenue"]
            ]
          parsed = AT.parseEither parseProspectAudit v
      case parsed of
        Left e   -> expectationFailure ("parse failed: " <> e)
        Right pa -> do
          paAuditConfidence pa `shouldBe` ConfMedium
          length (paContentThemes pa) `shouldBe` 1
          ctEstimatedPct (head (paContentThemes pa)) `shouldBe` 40
          vsPolishLevel (paVisualStyle pa) `shouldBe` PolishPolished
          epCommentVolume (paEngagementPatterns pa) `shouldBe` VolMedium
          srShouldPitch (paSalesRecommendation pa) `shouldBe` PitchYes
          srRoughDiscStyle (paSalesRecommendation pa) `shouldBe` DiscI

    it "clamps estimated_percentage to 0..100" $ do
      let v = A.object
              [ "audit_confidence" A..= String "low"
              , "content_themes" A..= [ A.object
                  [ "theme" A..= String "x"
                  , "estimated_percentage" A..= Number 250
                  , "example_post" A..= String "x"
                  ]
                ]
              ]
          parsed = AT.parseEither parseProspectAudit v
      case parsed of
        Right pa -> ctEstimatedPct (head (paContentThemes pa)) `shouldBe` 100
        Left e   -> expectationFailure ("parse failed: " <> e)

    it "falls back to defaults for an empty object" $ do
      let v = A.object []
          parsed = AT.parseEither parseProspectAudit v
      case parsed of
        Right pa -> do
          paAuditConfidence pa `shouldBe` ConfLow
          paContentThemes pa `shouldBe` []
          srShouldPitch (paSalesRecommendation pa) `shouldBe` PitchMaybe
          srRoughDiscStyle (paSalesRecommendation pa) `shouldBe` DiscUnknown
        Left e   -> expectationFailure ("parse failed: " <> e)

  describe "corpus/prospect-audit" $ do
    corpusFiles <- runIO (listCorpus "prospect-audit")
    mapM_ (\fp ->
      it ("validates " <> fp) $ do
        raw <- readFileText ("corpus/prospect-audit" </> fp)
        case validateProspectAudit raw of
          Left err -> expectationFailure ("validation failed: " <> T.unpack (renderValidationError err))
          Right _  -> pure ()
      ) corpusFiles

readFileText :: FilePath -> IO Text
readFileText = fmap T.pack . readFile

listCorpus :: String -> IO [FilePath]
listCorpus sub =
  listDirectory ("corpus" </> sub)
    >>= pure . filter (\f -> takeExtension f `elem` [".json", ".txt"])
