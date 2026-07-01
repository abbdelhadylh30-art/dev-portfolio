{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

-- |
-- Module      : LeadProfiler.Emit.JsonSchema
-- Description : Emit JSON Schema (Draft 2020-12) documents from the ADTs.
--
-- JSON Schema is useful for runtime validation in JavaScript land (via
-- @ajv@, @zod@, etc.) and for documenting the contract in a
-- language-agnostic way. Like the TypeScript types, these schemas are
-- generated from the Haskell ADTs so there is no drift.
module LeadProfiler.Emit.JsonSchema
  ( emitJsonSchemas
  , jsonSchemaLeadObservation
  , jsonSchemaProspectAudit
  , jsonSchemaUserServices
  ) where

import           LeadProfiler.Prelude
import           LeadProfiler.Schemas.LeadObservation  (CallToAction(..))
import           LeadProfiler.Schemas.ProspectAudit
import           LeadProfiler.Schemas.Common          (TriBool(..), Confidence(..))

import qualified Data.Aeson           as A
import qualified Data.Aeson.Key       as AK
import qualified Data.Aeson.KeyMap    as KM
import qualified Data.Text            as T

-- | The combined output: three named JSON Schemas in a single JSON object.
emitJsonSchemas :: Value
emitJsonSchemas = A.object
  [ "lead_observation"      A..= jsonSchemaLeadObservation
  , "prospect_audit"        A..= jsonSchemaProspectAudit
  , "user_services"         A..= jsonSchemaUserServices
  ]

-- $schema helper.
schema2020 :: Value
schema2020 = String "https://json-schema.org/draft/2020-12/schema"

-- | Build a JSON Schema object type.
objType :: Maybe Text -> [(Text, Value)] -> Value
objType description fields = A.object $
  [ "type"       A..= String "object"
  , "additionalProperties" A..= Bool False
  ]
  ++ maybe [] (\d -> ["description" A..= String d]) description
  ++ [ "properties" A..= A.object
       [ (AK.fromString (T.unpack k), v) | (k, v) <- fields ]
     , "required" A..= map (String . fst) fields
     ]

-- | A string field with optional description.
strField :: Maybe Text -> Value
strField d = A.object $ maybe [] (\desc -> ["description" A..= String desc]) d
                  ++ [ "type" A..= String "string" ]

-- | An integer field.
intField :: Maybe Text -> Value
intField d = A.object $ maybe [] (\desc -> ["description" A..= String desc]) d
                  ++ [ "type" A..= String "integer"
                     , "minimum" A..= Number 0
                     , "maximum" A..= Number 100
                     ]

-- | An array-of-strings field.
strArrayField :: Maybe Text -> Value
strArrayField d = A.object $
  maybe [] (\desc -> ["description" A..= String desc]) d
  ++ [ "type" A..= String "array"
     , "items" A..= A.object [ "type" A..= String "string" ]
     ]

-- | A string-enum field.
enumField :: [Text] -> Maybe Text -> Value
enumField vals d = A.object $
  maybe [] (\desc -> ["description" A..= String desc]) d
  ++ [ "type" A..= String "string"
     , "enum" A..= map String vals
     ]

-- | JSON Schema for @analyze-lead-images@ output.
jsonSchemaLeadObservation :: Value
jsonSchemaLeadObservation = A.object
  [ "$schema"    A..= schema2020
  , "title"      A..= String "LeadObservation"
  , "description" A..= String "Output of the analyze-lead-images route."
  , "type"       A..= String "object"
  , "additionalProperties" A..= Bool False
  , "properties" A..= A.object
      [ "extraction_confidence" A..= enumField ["high","medium","low"] (Just "Confidence level reported by the LLM.")
      , "observation_notes" A..= objType (Just "Free-text observation notes per category.")
          [ ("pace",              strField (Just "Visible posting frequency, reply speed, story frequency."))
          , ("people_orientation", strField (Just "Tone of captions and replies, visible warmth/formality."))
          , ("content_shape",      strField (Just "Types of posts, production quality, content mix."))
          , ("engagement",         strField (Just "Comment patterns, reply behavior, visible complaints."))
          , ("self_presentation",  strField (Just "Face visible? professional/casual? brand/personality?"))
          , ("pressure_tells",     strField (Just "Visible stress signals, rants, inconsistencies."))
          ]
      , "digital_presence_audit" A..= objType (Just "Audit of the bio / link-in-bio.")
          [ ("has_website",                  enumField ["yes","no","cannot_determine"] (Just "Bio link present?"))
          , ("has_booking_or_payment_link",  enumField ["yes","no","cannot_determine"] (Just "Booking or payment link present?"))
          , ("has_google_reviews",           enumField ["yes","no","cannot_determine"] (Just "Google reviews visible?"))
          , ("primary_call_to_action",       enumField ["dm","call","link","none","cannot_determine"] (Just "Primary CTA in bio."))
          , ("bio_text",                     strField (Just "Transcribed bio text."))
          , ("follower_count",               strField (Just "Follower count if visible, else 'not visible'."))
          ]
      , "screenshot_summary" A..= strField (Just "One sentence per screenshot describing what it showed.")
      , "what_i_could_not_determine" A..= strArrayField (Just "List of things the LLM couldn't see in the screenshots.")
      ]
  , "required" A..= map String [ "extraction_confidence"
                    , "observation_notes"
                    , "digital_presence_audit"
                    , "screenshot_summary"
                    , "what_i_could_not_determine"
                    ]
  ]

-- | JSON Schema for @prospect-content-audit@ output.
jsonSchemaProspectAudit :: Value
jsonSchemaProspectAudit = A.object
  [ "$schema"    A..= schema2020
  , "title"      A..= String "ProspectAudit"
  , "description" A..= String "Output of the prospect-content-audit route."
  , "type"       A..= String "object"
  , "additionalProperties" A..= Bool False
  , "properties" A..= A.object
      [ "audit_confidence" A..= enumField ["high","medium","low"] Nothing
      , "content_themes" A..= A.object
          [ "type" A..= String "array"
          , "items" A..= objType Nothing
              [ ("theme",               strField Nothing)
              , ("estimated_percentage", intField Nothing)
              , ("example_post",        strField Nothing)
              ]
          ]
      , "visual_style" A..= objType Nothing
          [ ("description",            strField Nothing)
          , ("polish_level",           enumField ["polished","semi-polished","raw"] Nothing)
          , ("consistency",            enumField ["consistent","inconsistent"] Nothing)
          , ("colors_or_design_notes", strField Nothing)
          ]
      , "posting_strategy" A..= objType Nothing
          [ ("formats_used",     strArrayField Nothing)
          , ("pattern",          enumField ["consistent","sporadic","campaign-based"] Nothing)
          , ("recurring_series", strArrayField Nothing)
          ]
      , "engagement_patterns" A..= objType Nothing
          [ ("comment_volume",            enumField ["low","medium","high","cannot_determine"] Nothing)
          , ("reply_behavior",            strField Nothing)
          , ("negative_comments_visible", enumField ["yes","no","cannot_determine"] Nothing)
          , ("user_generated_content",    enumField ["yes","no","cannot_determine"] Nothing)
          ]
      , "brand_voice" A..= objType Nothing
          [ ("tone",              strField Nothing)
          , ("language_register", strField Nothing)
          , ("signature_phrases", strArrayField Nothing)
          , ("audience_address",  strField Nothing)
          ]
      , "gaps_and_opportunities" A..= objType Nothing
          [ ("missing_content",         strArrayField Nothing)
          , ("operational_pain_points", strArrayField Nothing)
          , ("digital_presence_gaps",   strArrayField Nothing)
          , ("services_to_pitch",       strArrayField Nothing)
          ]
      , "sales_recommendation" A..= objType Nothing
          [ ("should_pitch",         enumField ["yes","no","maybe"] Nothing)
          , ("why",                  strField Nothing)
          , ("pitch_angle",          strField Nothing)
          , ("likely_pain_point",    strField Nothing)
          , ("rough_disc_style",     enumField ["D","i","S","C","Di","iD","iS","Si","SC","CS","DC","CD","unknown"] Nothing)
          , ("recommended_register", strField Nothing)
          ]
      , "what_i_could_not_determine" A..= strArrayField Nothing
      ]
  , "required" A..= map String [ "audit_confidence"
                    , "content_themes"
                    , "visual_style"
                    , "posting_strategy"
                    , "engagement_patterns"
                    , "brand_voice"
                    , "gaps_and_opportunities"
                    , "sales_recommendation"
                    , "what_i_could_not_determine"
                    ]
  ]

-- | JSON Schema for @read-portfolio@ output.
jsonSchemaUserServices :: Value
jsonSchemaUserServices = A.object
  [ "$schema"    A..= schema2020
  , "title"      A..= String "UserServices"
  , "description" A..= String "Output of the read-portfolio route."
  , "type"       A..= String "object"
  , "additionalProperties" A..= Bool False
  , "properties" A..= A.object
      [ "primary"            A..= strField (Just "One sentence: what they sell.")
      , "secondary"          A..= strField (Just "Secondary service line, if any.")
      , "past_work_examples" A..= strArrayField (Just "Concrete, verifiable past work items.")
      , "track_record"       A..= strField (Just "Years of experience, # clients, etc. — only if explicitly stated.")
      , "service_depth"      A..= strField (Just "What makes their work different.")
      , "extraction_notes"   A..= strField (Just "One-sentence note on what was found.")
      ]
  , "required" A..= map String [ "primary"
                    , "secondary"
                    , "past_work_examples"
                    , "track_record"
                    , "service_depth"
                    , "extraction_notes"
                    ]
  ]
