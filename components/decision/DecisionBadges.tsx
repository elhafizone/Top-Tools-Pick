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
 * card, the tool page, the comparison table and category award slots.
 *
 * Every pill maps to a stored column. Nothing is inferred, so a tool with no free plan
 * and no trial simply shows fewer pills rather than a fabricated offer. Returns null
 * when there is nothing truthful to show.
 */
export function DecisionBadges({ hasFreePlan, hasFreeTrial, pricingModel, entryPriceLabel, className }: Props) {
  const badges: string[] = [];
  if (hasFreePlan) badges.push("Free plan");
  if (hasFreeTrial) badges.push("Free trial");
  if (!hasFreePlan && !hasFreeTrial && pricingModel === "FREE") badges.push("Free");
  if (entryPriceLabel) badges.push(entryPriceLabel);

  if (badges.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {badges.map((badge) => (
        <li key={badge} className="tag border-[var(--accent)] text-[var(--accent-deep)]">
          {badge}
        </li>
      ))}
    </ul>
  );
}
