{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE ScopedTypeVariables #-}

-- |
-- Main test driver. Loads all sub-specs and runs them with Hspec's
-- default formatter.
module Main (main) where

import           Test.Hspec

import qualified LeadProfiler.LenientSpec
import qualified LeadProfiler.Schemas.LeadObservationSpec
import qualified LeadProfiler.Schemas.ProspectAuditSpec
import qualified LeadProfiler.Schemas.UserServicesSpec
import qualified LeadProfiler.ValidateSpec
import qualified LeadProfiler.DefaultsSpec
import qualified LeadProfiler.EmitSpec

main :: IO ()
main = hspec $ do
  describe "Lenient"           LeadProfiler.LenientSpec.spec
  describe "Schemas.LeadObservation" LeadProfiler.Schemas.LeadObservationSpec.spec
  describe "Schemas.ProspectAudit"  LeadProfiler.Schemas.ProspectAuditSpec.spec
  describe "Schemas.UserServices"   LeadProfiler.Schemas.UserServicesSpec.spec
  describe "Validate"          LeadProfiler.ValidateSpec.spec
  describe "Defaults"          LeadProfiler.DefaultsSpec.spec
  describe "Emit"              LeadProfiler.EmitSpec.spec
