import { teamMascots } from "./teamMascots";

const GEORGETOWN_PREP_CREST =
  "/mascots/generated/georgetown-prep-crest.png?v=exact-team-profile-7";

// Use the exact generated Georgetown Prep crest through the normal TeamMascot
// lookup. The PNG is a verified native PNG and avoids recovery/fallback swaps.
teamMascots["Georgetown Prep"] = GEORGETOWN_PREP_CREST;
teamMascots["Georgetown Preparatory School"] = GEORGETOWN_PREP_CREST;
