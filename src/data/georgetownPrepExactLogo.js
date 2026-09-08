import { teamMascots } from "./teamMascots";

const GEORGETOWN_PREP_CREST =
  "/mascots/generated/georgetown-prep-crest-fixed.png?v=exact-team-profile-3";

// Force the exact approved Georgetown Prep crest into the normal TeamMascot
// lookup before React renders the team profile. This avoids the fallback GP box.
teamMascots["Georgetown Prep"] = GEORGETOWN_PREP_CREST;
teamMascots["Georgetown Preparatory School"] = GEORGETOWN_PREP_CREST;
