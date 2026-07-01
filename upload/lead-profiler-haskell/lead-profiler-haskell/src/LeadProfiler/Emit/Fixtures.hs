{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE LambdaCase #-}

-- |
-- Module      : LeadProfiler.Emit.Fixtures
-- Description : Emit sample fixtures (golden examples) for each route.
--
-- The fixtures serve two purposes:
--
-- 1. They document the expected shape of a "good" LLM response.
-- 2. They are the canonical "happy path" inputs for the test suite.
--
-- Each fixture is a 'Text' containing a JSON document that the lenient
-- pre-processor should be able to digest (i.e., it is /strictly/ valid
-- JSON — no fences, no trailing commas). For broken-LLM-output fixtures,
-- see the @corpus/@ directory.
module LeadProfiler.Emit.Fixtures
  ( fixtureLeadObservation
  , fixtureProspectAudit
  , fixtureUserServices
  , emitAllFixtures
  ) where

import           LeadProfiler.Prelude
import           LeadProfiler.Schemas.LeadObservation
import           LeadProfiler.Schemas.ProspectAudit
import           LeadProfiler.Schemas.UserServices
import           LeadProfiler.Schemas.Common         (Confidence(..), TriBool(..))

import qualified Data.Aeson          as A

-- | A realistic happy-path fixture for @analyze-lead-images@.
fixtureLeadObservation :: LeadObservation
fixtureLeadObservation = LeadObservation
  { loExtractionConfidence   = ConfMedium
  , loObservationNotes       = ObservationNotes
      { onPace              = "Feed shows ~12 posts in the last 30 days, suggesting roughly 3 posts/week."
      , onPeopleOrientation = "Captions are warm and use first-person plural (\"we\", \"our team\"). Replies to comments thank the commenter by name."
      , onContentShape      = "Mix of single-photo posts (~60%) and reels (~40%). Production is polished, with consistent typography overlays."
      , onEngagement        = "Average ~30 comments per post. Lead replies to ~half of comments, mostly with a heart emoji or short thanks."
      , onSelfPresentation  = "Lead's face appears in ~70% of posts, in professional but approachable settings (office, casual headshots)."
      , onPressureTells     = "One post from last week is a caption apologising for slow DM replies — visible scaling pain."
      }
  , loDigitalPresenceAudit   = DigitalPresenceAudit
      { dpaHasWebsite              = TriYes
      , dpaHasBookingOrPaymentLink = TriNo
      , dpaHasGoogleReviews        = TriCannotDetermine
      , dpaPrimaryCallToAction     = CtaDm
      , dpaBioText                = "Helping small businesses grow with content. DM for collabs."
      , dpaFollowerCount           = "8,432"
      }
  , loScreenshotSummary      = "Screenshot 1: profile header with bio and follower count. Screenshot 2: grid of 9 recent posts. Screenshot 3: comments on a recent post."
  , loWhatICouldNotDetermine = [ "Whether the lead has a separate business email"
                               , "Whether the website has a booking system"
                               ]
  }

-- | A realistic happy-path fixture for @prospect-content-audit@.
fixtureProspectAudit :: ProspectAudit
fixtureProspectAudit = ProspectAudit
  { paAuditConfidence = ConfMedium
  , paContentThemes =
      [ ContentTheme { ctTheme = "Educational tips", ctEstimatedPct = 40
                     , ctExamplePost = "Carousel: \"5 ways to write a hook that stops the scroll.\"" }
      , ContentTheme { ctTheme = "Behind-the-scenes", ctEstimatedPct = 25
                     , ctExamplePost = "Reel: filming setup for an upcoming client launch." }
      , ContentTheme { ctTheme = "Promotional", ctEstimatedPct = 20
                     , ctExamplePost = "Single image: \"Booking 2 more clients for August — DM to apply.\"" }
      , ContentTheme { ctTheme = "Personal stories", ctEstimatedPct = 15
                     , ctExamplePost = "Photo with caption: \"3 years ago today I quit my job...\"" }
      ]
  , paVisualStyle = VisualStyle
      { vsDescription         = "Warm earth tones (terracotta, cream, sage). Consistent serif typography. Photography is bright and natural-lit."
      , vsPolishLevel         = PolishPolished
      , vsConsistency         = Consistent
      , vsColorsOrDesignNotes = "Signature terracotta-to-cream gradient on carousel covers."
      }
  , paPostingStrategy = PostingStrategy
      { psFormatsUsed     = ["carousel", "single image", "reel/video"]
      , psPattern         = PatternConsistent
      , psRecurringSeries = ["Tip Tuesday", "Client Spotlight Friday"]
      }
  , paEngagementPatterns = EngagementPatterns
      { epCommentVolume           = VolMedium
      , epReplyBehavior           = "Replies to ~50% of comments, warmly but briefly."
      , epNegativeCommentsVisible = TYNNo
      , epUserGeneratedContent    = TYNYes
      }
  , paBrandVoice = BrandVoice
      { bvTone             = "warm, educational"
      , bvLanguageRegister = "english"
      , bvSignaturePhrases = ["DM to apply", "screenshot this", "save for later"]
      , bvAudienceAddress  = "friends"
      }
  , paGapsAndOpportunities = GapsAndOpportunities
      { goMissingContent        = ["No testimonials page", "No case studies"]
      , goOperationalPainPoints = ["Slow DM replies (apologised in a post)"]
      , goDigitalPresenceGaps   = ["No booking link in bio", "No email list"]
      , goServicesToPitch       = ["Booking dashboard", "Testimonial collection form"]
      }
  , paSalesRecommendation = SalesRecommendation
      { srShouldPitch         = PitchYes
      , srWhy                 = "Visible scaling pain (slow DMs) and clear service gaps (no booking link)."
      , srPitchAngle          = "Position the booking dashboard as a DM-reply-time-saver."
      , srLikelyPainPoint     = "Manual DM management is eating content production time."
      , srRoughDiscStyle      = DiscI
      , srRecommendedRegister = "Warm, first-person, mirror their use of \"friends\"."
      }
  , paWhatICouldNotDetermine = ["Exact follower count", "Monthly revenue"]
  }

-- | A realistic happy-path fixture for @read-portfolio@.
fixtureUserServices :: UserServices
fixtureUserServices = UserServices
  { usPrimary          = "Custom web tools \8212 landing pages, dashboards, functional apps."
  , usSecondary        = "Brand identity design (logos, colour systems)."
  , usPastWorkExamples =
      [ "Booking dashboard for a Riyadh dental clinic"
      , "Landing page for a Jeddah-based fitness coach"
      , "Internal inventory tracker for a Dammam restaurant chain"
      ]
  , usTrackRecord      = "8 years of experience, 60+ shipped projects across MENA."
  , usServiceDepth     = "We build real functional tools, not just landing pages."
  , usExtractionNotes  = "Extracted 3 case studies from the portfolio page."
  }

-- | All three fixtures as a JSON object, useful for dumping to disk.
emitAllFixtures :: Value
emitAllFixtures = A.object
  [ "lead_observation" A..= leadObservationToJson fixtureLeadObservation
  , "prospect_audit"   A..= prospectAuditToJson   fixtureProspectAudit
  , "user_services"    A..= userServicesToJson    fixtureUserServices
  ]
