import { test } from "node:test";
import assert from "node:assert/strict";
import { softwareApplicationJsonLd, breadcrumbJsonLd } from "../lib/seo";

const base = {
  name: "Acme",
  shortDescription: "Does things.",
  websiteUrl: "https://acme.example",
  category: { name: "Productivity" },
  pricingPlans: [] as Array<{ priceAmount: unknown; currency: string | null }>,
};

test("SoftwareApplication never emits aggregateRating", () => {
  const ld = softwareApplicationJsonLd({ ...base, rating: 4.6, reviews: [{}] } as typeof base);
  assert.equal("aggregateRating" in ld, false);
});

test("offers only for plans with numeric price and currency", () => {
  const ld = softwareApplicationJsonLd({
    ...base,
    pricingPlans: [
      { priceAmount: 25, currency: "USD" },
      { priceAmount: null, currency: "USD" },
      { priceAmount: 10, currency: null },
    ],
  }) as { offers?: unknown[] };
  assert.equal(ld.offers?.length, 1);
});

test("no offers key when no plan qualifies", () => {
  assert.equal("offers" in softwareApplicationJsonLd(base), false);
});

test("breadcrumbs use absolute URLs and 1-based positions", () => {
  const ld = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Tools", path: "/tools" }]) as {
    itemListElement: Array<{ position: number; item: string }>;
  };
  assert.equal(ld.itemListElement[1].position, 2);
  assert.match(ld.itemListElement[1].item, /^https?:\/\/.+\/tools$/);
});
