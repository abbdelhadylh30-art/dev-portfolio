{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

module LeadProfiler.DefaultsSpec (spec) where

import           Test.Hspec
import           Test.Hspec.Expectations

import           LeadProfiler.Prelude
import           LeadProfiler.Defaults
import           LeadProfiler.Schemas.UserServices
import           LeadProfiler.Schemas.LeadObservation
import           LeadProfiler.Schemas.Common         (TriBool(..), notVisibleText)

import qualified Data.Aeson          as A
import qualified Data.Text           as T

spec :: Spec
spec = do
  describe "isPlaceholderText" $ do
    let cases =
          [ ("unknown", True)
          , ("UNKNOWN", True)
          , ("  unknown  ", True)
          , ("not specified", True)
          , ("n/a", True)
          , ("", True)
          , ("   ", True)
          , ("various web projects", True)
          , ("see above", True)
          , ("track record not visible", True)
          , ("real content here", False)
          , ("8 years of experience", False)
          , ("Booking dashboard for a clinic", False)
          ]
    mapM_ (\(input, expected) ->
      it ("isPlaceholderText " <> show input <> " == " <> show expected) $
        isPlaceholderText input `shouldBe` expected
      ) cases

  describe "fillDefaultsUserServices" $ do
    it "replaces placeholder track_record with the canonical default" $ do
      let us = emptyUserServices { usTrackRecord = "unknown" }
          us' = fillDefaultsUserServices us
      usTrackRecord us' `shouldSatisfy` T.isPrefixOf "Track record not specified"

    it "drops placeholder entries from past_work_examples" $ do
      let us = emptyUserServices
            { usPastWorkExamples = ["various web projects", "real project", "n/a", ""]
            }
          us' = fillDefaultsUserServices us
      usPastWorkExamples us' `shouldBe` ["real project"]

    it "leaves real content alone" $ do
      let us = emptyUserServices
            { usPrimary = "Custom web tools."
            , usTrackRecord = "8 years, 60+ projects."
            , usPastWorkExamples = ["Booking dashboard for a clinic"]
            }
          us' = fillDefaultsUserServices us
      usTrackRecord us' `shouldBe` "8 years, 60+ projects."
      usPastWorkExamples us' `shouldBe` ["Booking dashboard for a clinic"]

  describe "fillDefaultsLeadObservation" $ do
    it "replaces placeholder observation text with notVisibleText" $ do
      let lo = emptyLeadObservation
            { loObservationNotes = (loObservationNotes emptyLeadObservation)
                { onPace = "unknown"
                , onPeopleOrientation = "not specified"
                }
            }
          lo' = fillDefaultsLeadObservation lo
      onPace (loObservationNotes lo') `shouldBe` notVisibleText
      onPeopleOrientation (loObservationNotes lo') `shouldBe` notVisibleText

    it "leaves real observation text alone" $ do
      let lo = emptyLeadObservation
            { loObservationNotes = (loObservationNotes emptyLeadObservation)
                { onPace = "3 posts/week visible"
                }
            }
          lo' = fillDefaultsLeadObservation lo
      onPace (loObservationNotes lo') `shouldBe` "3 posts/week visible"
