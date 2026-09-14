/**
 * Award slot labels offered in the admin.
 *
 * Stored as free text on EditorialListItem.award, so adding a slot here never needs a
 * schema change. Awards are curated only: an audience claim like "best for small teams"
 * cannot be derived from stored data without inventing it, so nothing fills these
 * automatically - an empty award block simply hides.
 */
export const AWARD_SLOTS = [
  "Best overall",
  "Best free option",
  "Best value",
  "Best for beginners",
  "Best for small teams",
  "Best for agencies",
  "Best for enterprise",
] as const;

export type AwardSlot = (typeof AWARD_SLOTS)[number];
