{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

module LeadProfiler.Schemas.LeadObservationSpec (spec) where

import           Test.Hspec
import           Test.Hspec.Expectations

import           LeadProfiler.Prelude
import           LeadProfiler.Schemas.LeadObservation
import           LeadProfiler.Schemas.Common         (Confidence(..), TriBool(..), notVisibleText)
import           LeadProfiler.Validate

import qualified Data.Aeson          as A
import qualified Data.Aeson.Types     as AT
import qualified Data.Text           as T
import           System.Directory    (listDirectory)
import           System.FilePath     ((</>), takeExtension)

spec :: Spec
spec = do
  describe "parseLeadObservation" $ do
    it "parses a well-formed object" $ do
      let v = A.object
            [ "extraction_confidence" A..= String "high"
            , "observation_notes" A..= A.object
                [ "pace" A..= String "~3 posts/week"
                , "people_orientation" A..= String "warm"
                , "content_shape" A..= String "carousel-heavy"
                , "engagement" A..= String "medium"
                , "self_presentation" A..= String "professional"
                , "pressure_tells" A..= String "not visible"
                ]
            , "digital_presence_audit" A..= A.object
                [ "has_website" A..= String "yes"
                , "has_booking_or_payment_link" A..= String "no"
                , "has_google_reviews" A..= String "cannot_determine"
                , "primary_call_to_action" A..= String "dm"
                , "bio_text" A..= String "Helping businesses grow"
                , "follower_count" A..= String "8432"
                ]
            , "screenshot_summary" A..= String "Profile screenshot."
            , "what_i_could_not_determine" A..= [String "email"]
            ]
          parsed = AT.parseEither parseLeadObservation v
      case parsed of
        Left e  -> expectationFailure ("parse failed: " <> e)
        Right lo -> do
          loExtractionConfidence lo `shouldBe` ConfHigh
          onPace (loObservationNotes lo) `shouldBe` "~3 posts/week"
          dpaHasWebsite (loDigitalPresenceAudit lo) `shouldBe` TriYes
          dpaFollowerCount (loDigitalPresenceAudit lo) `shouldBe` "8432"
          loWhatICouldNotDetermine lo `shouldBe` ["email"]

    it "fills defaults for missing fields" $ do
      let v = A.object [ "extraction_confidence" A..= String "low" ]
          parsed = AT.parseEither parseLeadObservation v
      case parsed of
        Left e  -> expectationFailure ("parse failed: " <> e)
        Right lo -> do
          loExtractionConfidence lo `shouldBe` ConfLow
          onPace (loObservationNotes lo) `shouldBe` notVisibleText
          dpaHasWebsite (loDigitalPresenceAudit lo) `shouldBe` TriCannotDetermine
          dpaBioText (loDigitalPresenceAudit lo) `shouldBe` "not visible"
          loScreenshotSummary lo `shouldBe` "No screenshots were summarised."
          loWhatICouldNotDetermine lo `shouldBe` []

    it "treats unknown confidence as Low" $ do
      let v = A.object [ "extraction_confidence" A..= String "super-high" ]
          parsed = AT.parseEither parseLeadObservation v
      case parsed of
        Right lo -> loExtractionConfidence lo `shouldBe` ConfLow
        Left e   -> expectationFailure ("parse failed: " <> e)

    it "tolerates a string instead of an array for what_i_could_not_determine" $ do
      let v = A.object
              [ "extraction_confidence" A..= String "low"
              , "what_i_could_not_determine" A..= String "single string instead of array"
              ]
          parsed = AT.parseEither parseLeadObservation v
      case parsed of
        Right lo -> loWhatICouldNotDetermine lo `shouldBe` ["single string instead of array"]
        Left e   -> expectationFailure ("parse failed: " <> e)

  describe "leadObservationToJson" $ do
    it "round-trips through parseLeadObservation" $ do
      let v = A.object
            [ "extraction_confidence" A..= String "high"
            , "observation_notes" A..= A.object
                [ "pace" A..= String "test"
                , "people_orientation" A..= String "test"
                , "content_shape" A..= String "test"
                , "engagement" A..= String "test"
                , "self_presentation" A..= String "test"
                , "pressure_tells" A..= String "test"
                ]
            , "digital_presence_audit" A..= A.object
                [ "has_website" A..= String "yes"
                , "has_booking_or_payment_link" A..= String "no"
                , "has_google_reviews" A..= String "cannot_determine"
                , "primary_call_to_action" A..= String "link"
                , "bio_text" A..= String "bio"
                , "follower_count" A..= String "100"
                ]
            , "screenshot_summary" A..= String "summary"
            , "what_i_could_not_determine" A..= [String "x"]
            ]
      case AT.parseEither parseLeadObservation v of
        Left e   -> expectationFailure ("parse failed: " <> e)
        Right lo ->
          let v2 = leadObservationToJson lo
          in case AT.parseEither parseLeadObservation v2 of
               Left e    -> expectationFailure ("re-parse failed: " <> e)
               Right lo2 -> lo `shouldBe` lo2

  describe "corpus/lead-observation" $ do
    corpusFiles <- runIO (listCorpus "lead-observation")
    mapM_ (\fp ->
      it ("validates " <> fp) $ do
        raw <- readFileText ("corpus/lead-observation" </> fp)
        case validateLeadObservation raw of
          Left err -> expectationFailure ("validation failed: " <> T.unpack (renderValidationError err))
          Right _  -> pure ()
      ) corpusFiles

readFileText :: FilePath -> IO Text
readFileText = fmap T.pack . readFile

listCorpus :: String -> IO [FilePath]
listCorpus sub =
  listDirectory ("corpus" </> sub)
    >>= pure . filter (\f -> takeExtension f `elem` [".json", ".txt"])
