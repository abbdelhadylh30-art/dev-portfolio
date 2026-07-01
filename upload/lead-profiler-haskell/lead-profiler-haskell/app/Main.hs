{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

-- |
-- Main entry point for the @lead-profiler-haskell@ CLI.
--
-- Usage:
--
-- @
-- lead-profiler-haskell emit-ts        # write TypeScript types to stdout
-- lead-profiler-haskell emit-schema    # write JSON Schemas to stdout
-- lead-profiler-haskell emit-fixtures  # write sample fixtures to stdout
-- lead-profiler-haskell validate ROUTE # read raw LLM text from stdin, validate
-- @
--
-- where @ROUTE@ is one of:
--
--   * @analyze-lead-images@
--   * @prospect-content-audit@
--   * @read-portfolio@
module Main (main) where

import           LeadProfiler.Prelude
import           LeadProfiler.Emit
import           LeadProfiler.Validate

import qualified Data.Aeson           as A
import qualified Data.Aeson.Encode.Pretty as AEP
import qualified Data.ByteString.Lazy  as BL
import qualified Data.Text             as T
import qualified Data.Text.IO          as TIO
import           System.Environment    (getArgs)
import           System.Exit           (exitFailure, exitSuccess)

main :: IO ()
main = do
  args <- getArgs
  case args of
    ["emit-ts"]       -> TIO.putStrLn emitTypeScript
    ["emit-schema"]   -> BL.putStr (AEP.encodePretty emitJsonSchemas)
    ["emit-fixtures"] -> BL.putStr (AEP.encodePretty emitAllFixtures)
    ["emit-all"]      -> do
      TIO.putStrLn emitTypeScript
      TIO.putStrLn ""
      BL.putStr (AEP.encodePretty emitAll)
    ["validate", route] -> do
      raw <- TIO.getContents
      case validateRouteText (T.pack route) raw of
        Right vr -> do
          BL.putStr (AEP.encodePretty (A.object
            [ "ok"        A..= Bool True
            , "route"     A..= routeKey (vrRoute vr)
            , "value"     A..= vrValue vr
            , "warnings"  A..= map (T.pack . show) (vrWarnings vr)
            , "explanations" A..= vrWarningExplanations vr
            , "bytes_dropped" A..= vrBytesDropped vr
            ]))
          exitSuccess
        Left err -> do
          BL.putStr (AEP.encodePretty (A.object
            [ "ok"    A..= Bool False
            , "error" A..= renderValidationError err
            ]))
          exitFailure
    _ -> do
      TIO.putStrLn "usage: lead-profiler-haskell <command> [args]"
      TIO.putStrLn "commands:"
      TIO.putStrLn "  emit-ts         Emit TypeScript types to stdout"
      TIO.putStrLn "  emit-schema     Emit JSON Schemas to stdout"
      TIO.putStrLn "  emit-fixtures   Emit sample fixtures to stdout"
      TIO.putStrLn "  emit-all        Emit all of the above"
      TIO.putStrLn "  validate ROUTE  Read raw LLM text from stdin and validate against ROUTE"
      TIO.putStrLn ""
      TIO.putStrLn "ROUTE is one of: analyze-lead-images, prospect-content-audit, read-portfolio"
      exitFailure
