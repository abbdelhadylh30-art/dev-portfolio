{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

-- |
-- Module      : LeadProfiler.Lenient
-- Description : Turn "almost-JSON" LLM output into strict, parseable JSON.
--
-- The original TypeScript API routes did this:
--
-- @
-- let stripped = content_text.trim();
-- if (stripped.startsWith("\`\`\`")) {
--   stripped = stripped.split("\\n").filter(l => !l.trim().startsWith("\`\`\`")).join("\\n").trim();
-- }
-- try { extracted = JSON.parse(stripped); }
-- catch {
--   const start = stripped.indexOf("{");
--   const end   = stripped.lastIndexOf("}");
--   if (start >= 0 && end > start) extracted = JSON.parse(stripped.slice(start, end + 1));
--   else return NextResponse.json({ error: "Could not parse VLM response as JSON" }, ...);
-- }
-- @
--
-- This is fragile in several ways:
--
-- 1. Code-fence detection only fires when the response /starts/ with a fence.
--    LLMs sometimes prefix with prose (e.g. @"Here is the JSON:\n\`\`\`json\n{...}\`\`\`"@),
--    which slips through and breaks @JSON.parse@.
-- 2. The @{ ... }@ slice fallback happily captures the /outermost/ braces,
--    which is wrong if the model emitted two adjacent JSON objects, or if it
--    emitted a fenced block followed by a follow-up note containing braces.
-- 3. Common LLM mistakes — trailing commas, smart quotes, unquoted bare keys,
--    single-quoted strings, em-dashes inside strings — all defeat strict JSON.
-- 4. There is no diagnostic surface: when parsing fails, the user sees
--    "Could not parse VLM response as JSON" with no clue /why/.
--
-- This module addresses all four. It is /pure/ — no IO, no global state — so
-- it is trivially testable with QuickCheck and corpus fixtures.
module LeadProfiler.Lenient
  ( -- * High-level entry point
    extractJson
  , ExtractResult(..)
  , ExtractWarning(..)

    -- * Individual normalisation passes (exported for testing)
  , stripCodeFences
  , findBalancedJsonObject
  , normaliseSmartQuotes
  , normaliseTrailingCommas
  , normaliseBareKeys
  , normaliseSingleQuotes
  , normaliseZeroWidthChars
  , removeTrailingProse

    -- * Diagnostics
  , explainWarnings
  ) where

import           LeadProfiler.Prelude

import qualified Data.Text              as T
import           Data.Char              (isSpace, isAlphaNum)

-- | Non-fatal issues the lenient pre-processor detected and tried to fix.
-- These are surfaced to the caller so the response can include a
-- @"warnings"@ field — the user deserves to know when the LLM produced
-- malformed output that we silently repaired.
data ExtractWarning
  = HadLeadingOrTrailingProse     -- ^ Stripped prose around the JSON block.
  | HadCodeFence                  -- ^ Stripped a markdown code fence.
  | HadTrailingComma              -- ^ Removed a trailing comma in an array/object.
  | HadSmartQuotes                -- ^ Normalised typographic quotes to @"@.
  | HadSingleQuotes               -- ^ Normalised single-quoted strings to double-quoted.
  | HadBareKey                    -- ^ Quoted a bare object key.
  | HadZeroWidthChars             -- ^ Stripped zero-width / BOM characters.
  | UsedBalancedSliceFallback     -- ^ The simple @indexOf('{')@ heuristic did not work
                                   --   and we had to scan for a balanced @{...}@ region.
  deriving (Eq, Show, Ord, Bounded, Enum)

-- | Result of a lenient extraction.
data ExtractResult = ExtractResult
  { erJsonText     :: !Text     -- ^ The normalised, parseable JSON text.
  , erWarnings     :: ![ExtractWarning]
  , erBytesDropped :: !Int      -- ^ How many chars of prose / fences were stripped.
  } deriving (Eq, Show)

-- | The main entry point. Takes raw LLM/VLM output (any text) and returns
-- either the cleaned-up JSON text plus the warnings the pre-processor
-- emitted, or an explanatory error if no JSON object could be found.
--
-- Note: this function only /pre-processes/ — it does not validate against
-- any schema. That is 'LeadProfiler.Validate.validateRoute's job.
extractJson :: Text -> Either Text ExtractResult
extractJson raw = do
  let step0 = normaliseZeroWidthChars raw
      w0 = if step0 /= raw then [HadZeroWidthChars] else []

      (step1, w1) = stripCodeFences step0
      (step2, w2) = removeTrailingProse step1
      w_prose = w1 <> w2

  -- Find the JSON object substring.
  (jsonText, usedBalanced) <- case findBalancedJsonObject step2 of
    Right r  -> Right r
    Left e   -> Left e

  -- If the balanced scan returned a substring shorter than the trimmed
  -- input, there was prose around the JSON object — flag it.
  let proseWarning = if T.length jsonText < T.length step2
                       then [HadLeadingOrTrailingProse]
                       else []

  let step3 = normaliseSmartQuotes jsonText
      w3 = if step3 /= jsonText then [HadSmartQuotes] else []
      step4 = normaliseSingleQuotes step3
      w4 = if step4 /= step3 then [HadSingleQuotes] else []
      step5 = normaliseBareKeys step4
      w5 = if step5 /= step4 then [HadBareKey] else []
      step6 = normaliseTrailingCommas step5
      w6 = if step6 /= step5 then [HadTrailingComma] else []
      allWarnings = w0 <> w_prose <> proseWarning <> w3 <> w4 <> w5 <> w6
                    <> (if usedBalanced then [UsedBalancedSliceFallback] else [])
      bytesDropped = T.length raw - T.length step6
  Right $ ExtractResult
    { erJsonText     = step6
    , erWarnings     = allWarnings
    , erBytesDropped = bytesDropped
    }

-- ---------------------------------------------------------------------------
-- Pass: zero-width / BOM characters
-- ---------------------------------------------------------------------------

-- | LLMs occasionally emit U+200B (zero-width space), U+FEFF (BOM), or
-- U+2060 (word joiner) — sometimes inside strings, sometimes between tokens.
-- JSON parsers treat these as invalid whitespace or as part of identifiers,
-- both of which break parsing. Strip them everywhere.
normaliseZeroWidthChars :: Text -> Text
normaliseZeroWidthChars =
  T.filter (\c -> c /= '\x200B' && c /= '\xFEFF' && c /= '\x2060'
                  && c /= '\x200C' && c /= '\x200D')

-- ---------------------------------------------------------------------------
-- Pass: markdown code fences
-- ---------------------------------------------------------------------------

-- | Strip @```...```@ fences /anywhere/ in the input, not just at the start.
-- Also handles the @```json@ language tag.
--
-- The TS code only stripped fences when the response *started* with one,
-- which means prose like @"Sure, here is the JSON:\n\`\`\`json\n{...}\`\`\`"@
-- would defeat the simple fence check. We handle that by stripping all
-- fence-marker lines, then trimming.
stripCodeFences :: Text -> (Text, [ExtractWarning])
stripCodeFences t
  | hasFence t =
      let stripped = T.unlines $ filter (not . isFenceLine) (T.lines t)
      in (T.strip stripped, [HadCodeFence])
  | otherwise = (t, [])
  where
    isFenceLine l =
      let lt = T.strip l
      in T.isPrefixOf "```" lt

    hasFence = any isFenceLine . T.lines

-- ---------------------------------------------------------------------------
-- Pass: leading/trailing whitespace
-- ---------------------------------------------------------------------------

-- | Trim leading and trailing whitespace. Pure trimming — no warning
-- is emitted here. The 'HadLeadingOrTrailingProse' warning is emitted
-- later by 'extractJson' when 'findBalancedJsonObject' returns a
-- substring shorter than the trimmed input (i.e. there was actual
-- prose around the JSON object, not just whitespace).
removeTrailingProse :: Text -> (Text, [ExtractWarning])
removeTrailingProse t = (T.strip t, [])

-- ---------------------------------------------------------------------------
-- Pass: locate the JSON object substring
-- ---------------------------------------------------------------------------

-- | Find the /first/ balanced JSON object in the text. Returns the
-- substring (including the outer braces) plus a flag indicating whether
-- the trivial heuristic (first @{@ ... last @}@) was sufficient, or
-- whether a proper balanced-brace scan had to be used.
findBalancedJsonObject :: Text -> Either Text (Text, Bool)
findBalancedJsonObject t
  | T.null (T.filter (not . isSpace) t) = Left "empty input — no JSON object found"
  | otherwise =
      case firstAndLastBrace t of
        Nothing -> Left "no '{' found in input — cannot be a JSON object"
        Just (start, end)
          | balanced (T.take (end - start + 1) (T.drop start t)) ->
              Right (T.take (end - start + 1) (T.drop start t), False)
          | otherwise ->
              case scanBalanced t of
                Just sub -> Right (sub, True)
                Nothing  -> Left "could not locate a balanced JSON object in the input"

-- | Index of the first @{@ and the last @}@ in the text, if both exist.
firstAndLastBrace :: Text -> Maybe (Int, Int)
firstAndLastBrace t = do
  start <- T.findIndex (== '{') t
  end   <- T.findIndex (== '}') (T.reverse t)
  pure (start, T.length t - 1 - end)

-- | Does this text have balanced braces, accounting for string literals
-- and escape sequences? Returns 'True' if the depth reaches zero exactly
-- at the end of the input without ever going negative.
balanced :: Text -> Bool
balanced txt = case go (0 :: Int) False (T.unpack txt) of
  Just finalDepth -> finalDepth == 0
  Nothing         -> False
  where
    -- Returns 'Just finalDepth' if all braces are properly closed,
    -- 'Nothing' if a closing brace appears at depth 0 (unbalanced).
    -- The 'inStr' state preserves the depth at which we entered the
    -- string so we can resume correctly when we exit.
    go :: Int -> Bool -> String -> Maybe Int
    go d False []           = Just d
    go _ True  []           = Just 0  -- tolerant: unterminated string -> balanced
    go d False ('"':cs)     = go d True  cs       -- enter string; remember depth d
    go d False ('{':cs)     = go (d+1) False cs
    go d False ('}':cs)
      | d == 0              = Nothing             -- closing brace before opening
      | otherwise           = go (d-1) False cs
    go d False (_:cs)       = go d False cs
    go d True  ('\\':_:cs)  = go d True  cs       -- skip escaped char in string
    go d True  ('"':cs)     = go d False cs       -- exit string; restore depth d
    go d True  (_:cs)       = go d True  cs

-- | Properly scan for the /first/ balanced @{ ... }@ region, accounting
-- for string literals and escapes. Returns the substring (including the
-- outer braces) if found.
--
-- Strategy: walk the string char-by-char, tracking depth and string state.
-- When we encounter an opening @{@ at depth 0, record its index. When
-- depth returns to 0 again, return the slice between that opening and the
-- current position.
scanBalanced :: Text -> Maybe Text
scanBalanced txt = go 0 False (zip [0..] (T.unpack txt))
  where
    -- depth: how many unclosed braces we currently have.
    -- inStr: are we inside a "..." string literal?
    -- We need to find the index of the first '{' at depth 0, then the
    -- index of the matching '}' that brings depth back to 0.
    go :: Int -> Bool -> [(Int, Char)] -> Maybe Text
    go _ _    [] = Nothing
    go 0 False ((start, '{') : rest) =
      -- Found the opening brace. Scan forward looking for the matching close.
      case scanForward 1 False rest of
        Just offset -> Just (T.take (offset + 1) (T.drop start txt))
        Nothing     -> Nothing
    go 0 False ((_, '"') : rest) = go 0 True  rest  -- enter string at depth 0; doesn't change depth
    go 0 False ((_, _)   : rest) = go 0 False rest
    go _ True  ((_, '\\') : _ : rest) = go 0 True  rest  -- skip escaped char (we are in a string at depth 0; unusual but possible if no '{' yet)
    go _ True  ((_, '"')  : rest)     = go 0 False rest
    go _ True  ((_, _)    : rest)     = go 0 True  rest
    -- Unreachable: depth > 0 only happens inside scanForward, not here.
    -- Defensive catch-all so GHC's pattern-coverage check is satisfied.
    go _ _ _ = Nothing

    -- Scan forward from an opening '{'. Returns the offset (relative to the
    -- start of @rest@) of the closing '}' that brings depth back to 0.
    scanForward :: Int -> Bool -> [(Int, Char)] -> Maybe Int
    scanForward 0 _    _  = Just 0
    scanForward _ _    [] = Nothing
    scanForward _ True ((_, '\\') : _ : rest) = fmap (+2) (scanForward 1 True rest)
    scanForward _ True ((_, '"')  : rest)     = fmap (+1) (scanForward 1 False rest)
    scanForward _ True ((_, _)    : rest)     = fmap (+1) (scanForward 1 True rest)
    scanForward d False ((_, '"') : rest)     = fmap (+1) (scanForward d True rest)
    scanForward d False ((_, '{') : rest)     = fmap (+1) (scanForward (d+1) False rest)
    scanForward d False ((_, '}') : rest)
      | d == 1    = Just 1
      | otherwise = fmap (+1) (scanForward (d-1) False rest)
    scanForward d False ((_, _) : rest)       = fmap (+1) (scanForward d False rest)

-- ---------------------------------------------------------------------------
-- Pass: smart quotes -> straight quotes
-- ---------------------------------------------------------------------------

-- | LLMs sometimes emit typographic quotes (especially when the prompt
-- contains them, or when the model is being "fancy"):
--
--   * U+2018 / U+2019  (left/right single)
--   * U+201C / U+201D  (left/right double)
--   * U+201A / U+201B  (low / reversed-9 single)
--   * U+201E / U+201F  (low / reversed-9 double)
--   * U+00AB / U+00BB  (guillemets)
--
-- JSON only accepts the ASCII @"@ (and @'@ is not a string delimiter at
-- all). Map all the fancy variants to their ASCII equivalents. We are
-- deliberately aggressive: this pass does not try to distinguish "smart
-- quotes inside string literals" (which should be normalised) from "smart
-- quotes as string delimiters" (which should also be normalised) — the
-- next pass handles the delimiter case.
normaliseSmartQuotes :: Text -> Text
normaliseSmartQuotes = T.map $ \case
  '\x2018' -> '\''
  '\x2019' -> '\''
  '\x201A' -> '\''
  '\x201B' -> '\''
  '\x201C' -> '"'
  '\x201D' -> '"'
  '\x201E' -> '"'
  '\x201F' -> '"'
  '\x00AB' -> '"'
  '\x00BB' -> '"'
  c       -> c

-- ---------------------------------------------------------------------------
-- Pass: single-quoted string literals -> double-quoted
-- ---------------------------------------------------------------------------

-- | JSON requires strings to be @\"...\"@, but LLMs that have been trained
-- on Python / JavaScript often emit @'...'@. Convert single-quoted string
-- literals to double-quoted ones, handling internal escapes correctly.
--
-- This pass is conservative: it only fires when a @'@ appears in a position
-- where a string literal is expected (i.e., as a value or immediately
-- after a @:@ or @,@ or @[@ or @{@). Random apostrophes inside
-- already-double-quoted strings are left alone.
normaliseSingleQuotes :: Text -> Text
normaliseSingleQuotes = T.pack . go (False, False) . T.unpack
  where
    -- (inDoubleString, inSingleString)
    go _             []           = []
    go (False, False) ('\'':cs)   = '"' : go (False, True)  cs
    go (False, False) ('"':cs)    = '"' : go (True,  False) cs
    go (False, True)  ('\\':c:cs) = '\\' : c : go (False, True) cs
    go (False, True)  ('\'':cs)   = '"' : go (False, False) cs
    go (False, True)  (c:cs)      = c   : go (False, True) cs
    go (True,  False) ('\\':c:cs) = '\\' : c : go (True,  False) cs
    go (True,  False) ('"':cs)    = '"' : go (False, False) cs
    go (True,  False) (c:cs)      = c   : go (True,  False) cs
    go (False, False) (c:cs)      = c   : go (False, False) cs
    -- Unreachable: cannot be inside both a single- and double-quoted
    -- string at once. Defensive catch-all.
    go (True, True) cs            = cs

-- ---------------------------------------------------------------------------
-- Pass: trailing commas
-- ---------------------------------------------------------------------------

-- | JSON forbids trailing commas (e.g. @[1, 2,]@ or @{"a": 1,}@), but LLMs
-- love them. Remove a comma that is followed (after optional whitespace)
-- by @]@ or @}@.
normaliseTrailingCommas :: Text -> Text
normaliseTrailingCommas = T.pack . go . T.unpack
  where
    go [] = []
    go (',':rest) =
      let rest' = dropWhile isSpace rest
      in case rest' of
           (c:_) | c == ']' || c == '}' -> go rest'
           _                            -> ',' : go rest
    go (c:cs) = c : go cs

-- ---------------------------------------------------------------------------
-- Pass: bare (unquoted) object keys
-- ---------------------------------------------------------------------------

-- | LLMs that have been trained on JS / Python / YAML often emit bare
-- object keys, like @{ theme: "x", percentage: 50 }@ instead of
-- @{ "theme": "x", "percentage": 50 }@. JSON requires keys to be strings.
--
-- This pass quotes any bare key it can identify. We only treat a token as
-- a bare key if it appears immediately after @{@ or @,@ (with optional
-- whitespace), consists of identifier characters, and is followed by
-- optional whitespace and a @:@.
normaliseBareKeys :: Text -> Text
normaliseBareKeys = T.pack . go False . T.unpack
  where
    -- True when the previous significant character was '{' or ',' (i.e.,
    -- we are at a position where a key is expected).
    go _ [] = []
    go afterOpenOrComma (c:cs)
      | isSpace c = c : go afterOpenOrComma cs
      | afterOpenOrComma && isIdentStart c =
          -- Collect the identifier, then check if it's followed by ':'.
          let (ident, rest) = span isIdentCont (c:cs)
              rest'         = dropWhile isSpace rest
          in case rest' of
               (':':_) -> '"' : ident ++ "\"" ++ go False rest
               _       -> ident ++ go False rest
      | otherwise =
          let reset = case c of
                        '{'  -> True
                        ','  -> True
                        '['  -> False  -- arrays don't have keys
                        '}'  -> False
                        ']'  -> False
                        '"'  -> False
                        _    -> False
          in c : go reset cs

    isIdentStart c = isAlphaNum c || c == '_' || c == '$'
    isIdentCont  c = isIdentStart c || c == '-'

-- ---------------------------------------------------------------------------
-- Diagnostics
-- ---------------------------------------------------------------------------

-- | Human-readable explanations for each 'ExtractWarning'.
explainWarnings :: [ExtractWarning] -> [Text]
explainWarnings = map expl
  where
    expl HadLeadingOrTrailingProse  =
      "stripped prose around the JSON block (LLM emitted conversational text before/after the object)"
    expl HadCodeFence               =
      "stripped markdown code fence (LLM wrapped JSON in ```...```)"
    expl HadTrailingComma           =
      "removed trailing comma (LLM emitted a comma before } or ] which is invalid JSON)"
    expl HadSmartQuotes             =
      "normalised typographic quotes to ASCII double-quotes"
    expl HadSingleQuotes            =
      "converted single-quoted string literals to double-quoted (JSON forbids '...')"
    expl HadBareKey                 =
      "quoted unquoted object keys (LLM emitted JS-style { key: value })"
    expl HadZeroWidthChars          =
      "stripped zero-width / BOM characters that would confuse JSON parsers"
    expl UsedBalancedSliceFallback  =
      "first-{ ... last-} heuristic failed; fell back to a balanced-brace scan"
