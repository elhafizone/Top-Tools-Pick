import type { PricingModel } from "@prisma/client";

type CtaProduct = {
  name: string;
  pricingModel: PricingModel;
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
};

/**
 * Outbound CTA wording, derived strictly from stored columns.
 *
 * Every branch maps to a boolean or enum an editor actually set, so the button can
 * never promise a trial, discount or free tier the data does not claim. When nothing
 * is set the label falls back to the neutral "Visit X".
 */
export function ctaLabel(product: CtaProduct) {
  if (product.hasFreeTrial) return "Start free trial";
  if (product.hasFreePlan) return "Get started free";
  if (product.pricingModel === "FREE") return `Get ${product.name}`;
  return `Visit ${product.name}`;
}

/** The entry price line under the CTA. Null when no plan carries a usable label. */
export function ctaSubline(plans: Array<{ priceLabel: string; sortOrder?: number }> | undefined) {
  if (!plans?.length) return null;
  const first = [...plans].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];
  return first?.priceLabel?.trim() || null;
}
