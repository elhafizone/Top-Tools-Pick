import type { PricingModel } from "@prisma/client";

type Props = {
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  pricingModel?: PricingModel;
  /** Entry plan price label. Only pass it where there is room for a longer pill. */
  entryPriceLabel?: string | null;
  className?: string;
};

/**
 * The single vocabulary for "what does this cost me to start?", shared by the product
 * card, the product row, the review page, the comparison table and category award slots.
 *
 * Every pill maps to a stored column. Nothing is inferred, so a tool with no free plan
 * and no trial simply shows fewer pills rather than a fabricated offer. Returns null
 * when there is nothing truthful to show.
 *
 * Offers are accented, because "free plan" is a reason to click. A price is neutral -
 * it is information, not an incentive, and colouring it would overstate it.
 */
export function DecisionBadges({ hasFreePlan, hasFreeTrial, pricingModel, entryPriceLabel, className }: Props) {
  const badges: Array<{ label: string; tone: "accent" | "neutral" }> = [];
  if (hasFreePlan) badges.push({ label: "Free plan", tone: "accent" });
  if (hasFreeTrial) badges.push({ label: "Free trial", tone: "accent" });
  if (!hasFreePlan && !hasFreeTrial && pricingModel === "FREE") badges.push({ label: "Free", tone: "accent" });
  // A stored label already reads as a phrase ("Free plan available", "$8/user/mo"), so it
  // is printed verbatim. It is skipped when it would only repeat the pill beside it.
  const duplicatesFreePill = (hasFreePlan || hasFreeTrial) && /free/i.test(entryPriceLabel ?? "");
  if (entryPriceLabel && !duplicatesFreePill) badges.push({ label: entryPriceLabel, tone: "neutral" });

  if (badges.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {badges.map((badge) => (
        <li key={badge.label} className={`badge ${badge.tone === "accent" ? "badge-accent" : ""}`}>
          {badge.label}
        </li>
      ))}
    </ul>
  );
}
