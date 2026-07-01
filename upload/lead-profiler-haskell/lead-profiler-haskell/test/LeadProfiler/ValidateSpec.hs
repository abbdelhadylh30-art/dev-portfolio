{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

module LeadProfiler.ValidateSpec (spec) where

import           Test.Hspec
import           Test.Hspec.Expectations

import           LeadProfiler.Prelude
import           LeadProfiler.Validate
import           LeadProfiler.Lenient      (ExtractWarning(..))

import qualified Data.Text as T

spec :: Spec
spec = do
  describe "validateRouteText" $ do
    it "returns UnknownRoute for an unrecognised route key" $ do
      let result = validateRouteText "unknown-route" "{}"
      result `shouldSatisfy` \case
        Left (UnknownRoute _) -> True
        _                     -> False

    it "returns NoJsonObjectFound for plain text input" $ do
      let result = validateRouteText "analyze-lead-images" "just plain text, no JSON"
      result `shouldSatisfy` \case
        Left (NoJsonObjectFound _) -> True
        _                          -> False

    it "returns NoJsonObjectFound for empty input" $ do
      let result = validateRouteText "read-portfolio" ""
      result `shouldSatisfy` \case
        Left (NoJsonObjectFound _) -> True
        _                          -> False

    it "validates a clean lead-observation input" $ do
      let input = T.unlines
            [ "{"
            , "  \"extraction_confidence\": \"high\","
            , "  \"observation_notes\": {"
            , "    \"pace\": \"3/week\","
            , "    \"people_orientation\": \"warm\","
            , "    \"content_shape\": \"carousel\","
            , "    \"engagement\": \"medium\","
            , "    \"self_presentation\": \"professional\","
            , "    \"pressure_tells\": \"none\""
            , "  },"
            , "  \"digital_presence_audit\": {"
            , "    \"has_website\": \"yes\","
            , "    \"has_booking_or_payment_link\": \"no\","
            , "    \"has_google_reviews\": \"cannot_determine\","
            , "    \"primary_call_to_action\": \"dm\","
            , "    \"bio_text\": \"Helping businesses grow\","
            , "    \"follower_count\": \"8432\""
            , "  },"
            , "  \"screenshot_summary\": \"Profile screenshot.\","
            , "  \"what_i_could_not_determine\": []"
            , "}"
            ]
      case validateRouteText "analyze-lead-images" input of
        Left err -> expectationFailure ("validation failed: " <> T.unpack (renderValidationError err))
        Right vr -> do
          vrRoute vr `shouldBe` RouteLeadObservation
          vrWarnings vr `shouldBe` []

    it "validates a fenced lead-observation input and reports the fence warning" $ do
      let input = T.unlines
            [ "```json"
            , "{\"extraction_confidence\": \"low\"}"
            , "```"
            ]
      case validateRouteText "analyze-lead-images" input of
        Left err -> expectationFailure ("validation failed: " <> T.unpack (renderValidationError err))
        Right vr -> HadCodeFence `shouldSatisfy` (`elem` vrWarnings vr)

    it "validates a clean prospect-audit input" $ do
      let input = "{\"audit_confidence\":\"medium\",\"content_themes\":[],\"visual_style\":{\"polish_level\":\"polished\",\"consistency\":\"consistent\"},\"posting_strategy\":{\"pattern\":\"consistent\"},\"engagement_patterns\":{\"comment_volume\":\"medium\",\"negative_comments_visible\":\"no\",\"user_generated_content\":\"yes\"},\"brand_voice\":{\"tone\":\"warm\"},\"gaps_and_opportunities\":{},\"sales_recommendation\":{\"should_pitch\":\"yes\",\"rough_disc_style\":\"i\"},\"what_i_could_not_determine\":[]}"
      case validateRouteText "prospect-content-audit" input of
        Left err -> expectationFailure ("validation failed: " <> T.unpack (renderValidationError err))
        Right vr -> vrRoute vr `shouldBe` RouteProspectAudit

    it "validates a clean user-services input" $ do
      let input = "{\"primary\":\"x\",\"secondary\":\"\",\"past_work_examples\":[],\"track_record\":\"x\",\"service_depth\":\"x\",\"extraction_notes\":\"x\"}"
      case validateRouteText "read-portfolio" input of
        Left err -> expectationFailure ("validation failed: " <> T.unpack (renderValidationError err))
        Right vr -> vrRoute vr `shouldBe` RouteUserServices

    it "validates a single-quoted user-services input" $ do
      let input = "{'primary':'x','secondary':'','past_work_examples':[],'track_record':'x','service_depth':'x','extraction_notes':'x'}"
      case validateRouteText "read-portfolio" input of
        Left err -> expectationFailure ("validation failed: " <> T.unpack (renderValidationError err))
        Right vr -> HadSingleQuotes `shouldSatisfy` (`elem` vrWarnings vr)
