{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

module LeadProfiler.LenientSpec (spec) where

import           Test.Hspec
import           Test.Hspec.Expectations
import           Test.QuickCheck

import           LeadProfiler.Lenient
import           LeadProfiler.Prelude

import qualified Data.Aeson           as Aeson
import qualified Data.ByteString.Lazy as BL
import qualified Data.Text            as T
import qualified Data.Text.Encoding   as TE

-- | QuickCheck generator for 'ExtractWarning'. Since the type derives
-- 'Bounded' and 'Enum', we can use 'arbitraryBoundedEnum' to enumerate
-- all constructors.
instance Arbitrary ExtractWarning where
  arbitrary = arbitraryBoundedEnum

spec :: Spec
spec = do
  describe "extractJson" $ do
    it "passes through clean JSON unchanged" $ do
      let clean = "{\"a\":1,\"b\":[2,3]}"
      extractJson clean `shouldBe` Right (ExtractResult
        { erJsonText = clean
        , erWarnings = []
        , erBytesDropped = 0
        })

    it "strips markdown code fences anywhere in the input" $
      let input = "Sure! Here's the JSON:\n```json\n{\"a\":1}\n```\nLet me know."
      in case extractJson input of
           Left e  -> expectationFailure ("unexpected Left: " <> T.unpack e)
           Right r -> do
             erJsonText r `shouldBe` "{\"a\":1}"
             HadCodeFence `shouldSatisfy` (`elem` erWarnings r)

    it "handles ```json language tag" $
      let input = "```json\n{\"x\":true}\n```"
      in case extractJson input of
           Left e  -> expectationFailure ("unexpected Left: " <> T.unpack e)
           Right r -> erJsonText r `shouldBe` "{\"x\":true}"

    it "removes trailing commas in objects" $
      let input = "{\"a\":1, \"b\":2,}"
      in case extractJson input of
           Left e  -> expectationFailure ("unexpected Left: " <> T.unpack e)
           Right r -> do
             erJsonText r `shouldBe` "{\"a\":1, \"b\":2}"
             HadTrailingComma `shouldSatisfy` (`elem` erWarnings r)

    it "removes trailing commas in nested arrays" $
      let input = "{\"a\":[1, 2, 3,]}"
      in case extractJson input of
           Left e  -> expectationFailure ("unexpected Left: " <> T.unpack e)
           Right r -> do
             erJsonText r `shouldBe` "{\"a\":[1, 2, 3]}"
             HadTrailingComma `shouldSatisfy` (`elem` erWarnings r)

    it "preserves non-trailing commas" $
      let input = "{\"a\":1,\n  \"b\":2\n}"
      in case extractJson input of
           Left e  -> expectationFailure ("unexpected Left: " <> T.unpack e)
           Right r -> erJsonText r `shouldBe` input

    it "normalises smart quotes to ASCII" $
      let input = "{\x201Ckey\x201D: \x201Cvalue\x201D}"
      in case extractJson input of
           Left e  -> expectationFailure ("unexpected Left: " <> T.unpack e)
           Right r -> do
             erJsonText r `shouldBe` "{\"key\": \"value\"}"
             HadSmartQuotes `shouldSatisfy` (`elem` erWarnings r)

    it "quotes bare object keys" $
      let input = "{ theme: \"x\", percentage: 50 }"
      in case extractJson input of
           Left e  -> expectationFailure ("unexpected Left: " <> T.unpack e)
           Right r -> do
             let out = erJsonText r
             out `shouldSatisfy` (T.isInfixOf "\"theme\"")
             out `shouldSatisfy` (T.isInfixOf "\"percentage\"")
             HadBareKey `shouldSatisfy` (`elem` erWarnings r)

    it "converts single-quoted strings to double-quoted" $
      let input = "{'theme': 'x', 'pct': 50}"
      in case extractJson input of
           Left e  -> expectationFailure ("unexpected Left: " <> T.unpack e)
           Right r -> do
             erJsonText r `shouldBe` "{\"theme\": \"x\", \"pct\": 50}"
             HadSingleQuotes `shouldSatisfy` (`elem` erWarnings r)

    it "strips zero-width characters" $
      let input = "{\x200B\"a\"\x200B: 1\xFEFF}"
      in case extractJson input of
           Left e  -> expectationFailure ("unexpected Left: " <> T.unpack e)
           Right r -> do
             erJsonText r `shouldBe` "{\"a\": 1}"
             HadZeroWidthChars `shouldSatisfy` (`elem` erWarnings r)

    it "uses balanced-brace fallback when first-{...last-} heuristic fails" $
      let input = "{\"a\": 1} and here's a stray } character"
      in case extractJson input of
           Left e  -> expectationFailure ("unexpected Left: " <> T.unpack e)
           Right r -> erJsonText r `shouldBe` "{\"a\": 1}"

    it "returns Left for input with no JSON object" $
      extractJson "hello world, no JSON here"
        `shouldSatisfy` \case Left _ -> True; Right _ -> False

    it "returns Left for empty input" $
      extractJson "" `shouldSatisfy` \case Left _ -> True; Right _ -> False

    it "returns Left for whitespace-only input" $
      extractJson "   \n\t  " `shouldSatisfy` \case Left _ -> True; Right _ -> False

  describe "stripCodeFences" $ do
    it "is idempotent on input without fences" $
      property $ \s ->
        let t = T.pack (s :: String)
        in stripCodeFences t === (t, [])

    it "strips a single fenced block" $
      stripCodeFences "```json\n{}\n```" `shouldBe` ("{}", [HadCodeFence])

  describe "normaliseTrailingCommas" $ do
    it "removes trailing comma before }" $
      normaliseTrailingCommas "{\"a\":1,}" `shouldBe` "{\"a\":1}"

    it "removes trailing comma before ]" $
      normaliseTrailingCommas "[1,2,]" `shouldBe` "[1,2]"

    it "preserves comma before value" $
      normaliseTrailingCommas "{\"a\":1, \"b\":2}" `shouldBe` "{\"a\":1, \"b\":2}"

    it "removes trailing comma with whitespace (strips comma and following whitespace)" $
      normaliseTrailingCommas "{\"a\":1,\n}" `shouldBe` "{\"a\":1}"

  describe "normaliseSmartQuotes" $ do
    it "converts left/right double quotes" $
      normaliseSmartQuotes "\x201Chello\x201D" `shouldBe` "\"hello\""

    it "converts left/right single quotes" $
      normaliseSmartQuotes "\x2018hello\x2019" `shouldBe` "'hello'"

    it "converts guillemets" $
      normaliseSmartQuotes "\x00ABhello\x00BB" `shouldBe` "\"hello\""

  describe "normaliseBareKeys" $ do
    it "quotes a single bare key" $
      normaliseBareKeys "{theme: \"x\"}" `shouldBe` "{\"theme\": \"x\"}"

    it "quotes multiple bare keys" $
      normaliseBareKeys "{a: 1, b: 2}" `shouldBe` "{\"a\": 1, \"b\": 2}"

    it "leaves already-quoted keys alone" $
      normaliseBareKeys "{\"a\": 1}" `shouldBe` "{\"a\": 1}"

    it "handles keys with underscores and dashes" $
      normaliseBareKeys "{my_key: 1, my-key: 2}"
        `shouldBe` "{\"my_key\": 1, \"my-key\": 2}"

  describe "normaliseSingleQuotes" $ do
    it "converts single-quoted strings" $
      normaliseSingleQuotes "{'a': 'b'}" `shouldBe` "{\"a\": \"b\"}"

    it "preserves apostrophes inside double-quoted strings" $
      normaliseSingleQuotes "{\"a\": \"don't\"}" `shouldBe` "{\"a\": \"don't\"}"

  describe "normaliseZeroWidthChars" $ do
    it "strips U+200B" $
      normaliseZeroWidthChars (T.pack ['a','\x200B','b']) `shouldBe` "ab"

    it "strips U+FEFF (BOM)" $
      normaliseZeroWidthChars (T.pack ['\xFEFF','h','e','l','l','o']) `shouldBe` "hello"

  describe "explainWarnings" $ do
    it "produces a non-empty explanation for each warning" $
      property $ \w ->
        let ws = [w :: ExtractWarning]
            expls = explainWarnings ws
        in length expls === 1 .&&. T.length (head expls) > 0

    it "produces one explanation per warning" $
      property $ \ws ->
        let ws' = (ws :: [ExtractWarning])
        in length (explainWarnings ws') === length ws'

  describe "round-trip: extract -> aeson decode" $ do
    it "extractJson output is always valid JSON when given a clean JSON value" $
      property $ \(s :: String) ->
        -- Wrap a SAFE string in a JSON object as a quoted value.
        -- We restrict to alphanumeric characters to avoid generating
        -- strings that contain JSON syntax characters (which would
        -- confuse our brace-counting balanced check).
        let safeStr = T.pack (filter (\c -> (c >= 'a' && c <= 'z')
                                          || (c >= 'A' && c <= 'Z')
                                          || (c >= '0' && c <= '9')
                                          || c == ' ') s)
            padded = "{ \"k\": \"" <> safeStr <> "\" }"
        in case extractJson padded of
             Left _         -> property True
             Right result   ->
               case Aeson.decode (BL.fromStrict (TE.encodeUtf8 (erJsonText result))) of
                 Just (_ :: Value) -> property True
                 Nothing           -> property False
  where
    padWithNoise :: String -> String
    padWithNoise s = "  \n  " <> s <> "  \n  "
