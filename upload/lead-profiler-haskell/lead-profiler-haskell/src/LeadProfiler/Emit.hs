{-# LANGUAGE OverloadedStrings #-}

-- |
-- Module      : LeadProfiler.Emit
-- Description : Umbrella module re-exporting all code generators.
module LeadProfiler.Emit
  ( module LeadProfiler.Emit.TypeScript
  , module LeadProfiler.Emit.JsonSchema
  , module LeadProfiler.Emit.Fixtures
  , emitAll
  ) where

import           LeadProfiler.Prelude
import           LeadProfiler.Emit.TypeScript
import           LeadProfiler.Emit.JsonSchema
import           LeadProfiler.Emit.Fixtures

import qualified Data.Aeson           as A
import qualified Data.Aeson.Encode.Pretty as AEP

-- | A single JSON object containing all generated artefacts except the
-- TypeScript file (which is plain text, not JSON).
emitAll :: Value
emitAll = A.object
  [ "json_schemas" A..= emitJsonSchemas
  , "fixtures"     A..= emitAllFixtures
  ]
