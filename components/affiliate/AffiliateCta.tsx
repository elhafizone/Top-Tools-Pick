import type { PricingModel } from "@prisma/client";
import { ctaLabel } from "@/lib/affiliate/cta";
import { resolveOutboundLink } from "@/lib/affiliate/links";

type CtaProduct = {
  name: string;
  slug: string;
  pricingModel: PricingModel;
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  websiteUrl: string;
  affiliatePrograms: Array<{
    status: string;
    disclosure?: string | null;
    links: Array<{ url: string; region: string | null; enabled: boolean; priority: number; campaignKey?: string | null }>;
  }>;
};

type Props = {
  product: CtaProduct;
  /** Where on the site this CTA sits, carried through to /go as ?p= for later attribution. */
  placement: string;
  variant?: "primary" | "secondary";
  className?: string;
  /** Show the "opens in a new tab" caption. Off inside dense tables. */
  showCaption?: boolean;
};

/**
 * The single outbound CTA for the whole site.
 *
 * Every affiliate link on every page goes through here and out via /go/[slug], so the
 * destination, campaign parameters and any future measurement live in one place
 * instead of being duplicated across pages.
 */
export function AffiliateCta({ product, placement, variant = "primary", className, showCaption = false }: Props) {
  const resolved = resolveOutboundLink(product);
  // No safe URL on file: render nothing rather than a dead button.
  if (!resolved.url) return null;

  const label = ctaLabel(product);
  const href = `/go/${encodeURIComponent(product.slug)}?p=${encodeURIComponent(placement)}`;

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className={`${variant === "primary" ? "button-primary" : "button-secondary"} ${className ?? ""}`}
      >
        {label} <span aria-hidden="true">↗</span>
      </a>
      {showCaption && (
        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          Opens the {resolved.isAffiliate ? "partner" : "official"} website in a new tab.
        </p>
      )}
    </>
  );
}
