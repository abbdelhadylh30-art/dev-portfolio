-- |
-- Module      : LeadProfiler.Prelude
-- Description : Shared imports and small utilities for the lead-profiler-haskell package.
--
-- This is intentionally a "anti-prelude" — it only re-exports the things
-- every other module in the package needs. Keeping it tiny avoids pulling
-- in heavy dependencies and makes the import lists in other modules short.
module LeadProfiler.Prelude
  ( -- * Standard containers
    Map
  , HashMap
  , Vector
  , Set
    -- * Text & bytestring
  , Text
  , ByteString
  , tshow
    -- * Aeson
  , Value(..)
  , KeyValue(..)
  , object
  , (.:)
  , (.:?)
  , withObject
  , withText
  , withArray
  , withScientific
  , withBool
  , (.!=)
  , encode
  , encodePretty
  , Key
  , KeyMap
  , fromString
  , fromText
  , toText
  , Parser
  , Object
    -- * Common helpers
  , (<=<)
  , (>=>)
  , void
  , when
  , unless
  , foldMap'
  , first
  , second
  , bimap
  , Alternative(..)
  , MonadIO(..)
  ) where

import           Control.Applicative    (Alternative(..))
import           Control.Monad          (void, when, unless, (<=<), (>=>))
import           Control.Monad.IO.Class (MonadIO(..))
import           Data.Aeson             (KeyValue(..), Value(..), encode, object,
                                         withObject, withText, withArray,
                                         withScientific, withBool, (.:), (.:?), (.!=))
import           Data.Aeson.Key         (Key, fromString, fromText, toText)
import           Data.Aeson.KeyMap      (KeyMap)
import           Data.Aeson.Encode.Pretty (encodePretty)
import           Data.Aeson.Types       (Parser, Object)
import           Data.Bifunctor         (bimap, first, second)
import           Data.ByteString        (ByteString)
import           Data.Foldable          (foldMap')
import           Data.HashMap.Strict    (HashMap)
import           Data.Map.Strict        (Map)
import           Data.Set               (Set)
import           Data.Text              (Text)
import qualified Data.Text              as T
-- Data.Text.Lazy not needed in this package
import           Data.Vector            (Vector)

-- | Show any 'Show'-able value to strict 'Text'.
tshow :: Show a => a -> Text
tshow = T.pack . show
