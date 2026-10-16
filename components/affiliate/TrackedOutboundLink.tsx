"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> & {
  productSlug: string;
  placement: string;
  children: ReactNode;
};

type Gtag = (command: "event", name: string, params: Record<string, unknown>) => void;

/**
 * Anchor for outbound CTAs that reports `affiliate_click` to GA4.
 *
 * Never blocks or alters navigation: the href is untouched, the handler does not call
 * preventDefault, and the beacon transport lets the request finish after the page
 * leaves. Any analytics failure (gtag missing, blocked, throwing) is swallowed.
 * No conversion is implied - this only records that the CTA was clicked.
 */
export function TrackedOutboundLink({ productSlug, placement, children, ...anchorProps }: Props) {
  function report() {
    try {
      const gtag = (window as unknown as { gtag?: Gtag }).gtag;
      gtag?.("event", "affiliate_click", {
        product_slug: productSlug,
        placement,
        source_path: window.location.pathname,
        transport_type: "beacon",
      });
    } catch {
      /* analytics must never affect navigation */
    }
  }

  return (
    <a {...anchorProps} onClick={report}>
      {children}
    </a>
  );
}
