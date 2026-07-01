{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

module LeadProfiler.Schemas.UserServicesSpec (spec) where

import           Test.Hspec
import           Test.Hspec.Expectations

import           LeadProfiler.Prelude
import           LeadProfiler.Schemas.UserServices
import           LeadProfiler.Validate

import qualified Data.Aeson          as A
import qualified Data.Aeson.Types     as AT
import qualified Data.Text           as T
import           System.Directory    (listDirectory)
import           System.FilePath     ((</>), takeExtension)

spec :: Spec
spec = do
  describe "parseUserServices" $ do
    it "parses a well-formed object" $ do
      let v = A.object
            [ "primary" A..= String "Custom web tools."
            , "secondary" A..= String "Brand identity."
            , "past_work_examples" A..= [ String "Booking dashboard for a Riyadh dental clinic"
                                        , String "Landing page for a fitness coach"
                                        ]
            , "track_record" A..= String "8 years, 60+ projects."
            , "service_depth" A..= String "Functional tools, not just landing pages."
            , "extraction_notes" A..= String "3 case studies extracted."
            ]
          parsed = AT.parseEither parseUserServices v
      case parsed of
        Left e  -> expectationFailure ("parse failed: " <> e)
        Right us -> do
          usPrimary us `shouldBe` "Custom web tools."
          length (usPastWorkExamples us) `shouldBe` 2
          usTrackRecord us `shouldBe` "8 years, 60+ projects."

    it "fills defaults for missing fields" $ do
      let v = A.object []
          parsed = AT.parseEither parseUserServices v
      case parsed of
        Left e  -> expectationFailure ("parse failed: " <> e)
        Right us -> do
          usPrimary us `shouldBe` ""
          usPastWorkExamples us `shouldBe` []
          usTrackRecord us `shouldSatisfy` T.isPrefixOf "Track record not specified"

    it "filters out placeholder past_work_examples entries" $ do
      let v = A.object
            [ "primary" A..= String "x"
            , "past_work_examples" A..= [ String "various web projects"
                                        , String "real project: Booking dashboard"
                                        , String "n/a"
                                        , String ""
                                        ]
            ]
          parsed = AT.parseEither parseUserServices v
      case parsed of
        Right us -> usPastWorkExamples us `shouldBe` ["real project: Booking dashboard"]
        Left e   -> expectationFailure ("parse failed: " <> e)

    it "tolerates a single string for past_work_examples" $ do
      let v = A.object
            [ "primary" A..= String "x"
            , "past_work_examples" A..= String "just one project"
            ]
          parsed = AT.parseEither parseUserServices v
      case parsed of
        Right us -> usPastWorkExamples us `shouldBe` ["just one project"]
        Left e   -> expectationFailure ("parse failed: " <> e)

  describe "corpus/user-services" $ do
    corpusFiles <- runIO (listCorpus "user-services")
    mapM_ (\fp ->
      it ("validates " <> fp) $ do
        raw <- readFileText ("corpus/user-services" </> fp)
        case validateUserServices raw of
          Left err -> expectationFailure ("validation failed: " <> T.unpack (renderValidationError err))
          Right _  -> pure ()
      ) corpusFiles

readFileText :: FilePath -> IO Text
readFileText = fmap T.pack . readFile

listCorpus :: String -> IO [FilePath]
listCorpus sub =
  listDirectory ("corpus" </> sub)
    >>= pure . filter (\f -> takeExtension f `elem` [".json", ".txt"])
