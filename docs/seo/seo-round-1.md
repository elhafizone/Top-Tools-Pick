# SEO round 1 — baseline, changes, measurement plan

Branch: `seo/round-1` (local only, uncommitted, not pushed, not deployed). No DB writes.

## Baseline (VERIFIED against code / live site, 2026-10-16)
- Tool pages: `force-dynamic`; live TTFB ~3.5 s (tool pages) vs ~1.6 s (home). Single curl sample, not a benchmark.
- Every indexable route builds canonicals through `buildMetadata` (or an explicit `alternates`); the homepage canonical in the root layout is not inherited by any page checked.
- `/compare` and filtered `/tools` states are `noindex`; alternatives pages `noindex` below 3 entries (unchanged).
- Sitemap was 586 URLs (545 tools). `/sitemap.xml` is prerendered at build time (`○ Static`), so its content only refreshes on deploy. UNKNOWN whether that is intended.
- JSON-LD on tool pages: BreadcrumbList + SoftwareApplication (with a self-derived AggregateRating, ratingCount 1).
- Analytics: bare GA4 gtag; no events. `/go/[slug]` records nothing (by design).

## Changes
| File | Change |
|---|---|
| `lib/seo.ts` | Removed `aggregateRating` (only source was the site's own review). |
| `lib/products.ts` | `getProductBySlug` wrapped in React `cache` (page + generateMetadata previously ran the heavy include twice per request). Added `getProductSlugsByNames` (looks up only the integration names shown, instead of loading all 545 products). |
| `app/tools/[slug]/page.tsx` | Uses the narrower name lookup. |
| `app/sitemap.ts` | Dropped `lastModified: now` on static and facet entries (no reliable date). `/comparisons` and `/stories` added only when published content exists. |
| `components/affiliate/TrackedOutboundLink.tsx` (new), `AffiliateCta.tsx` | GA4 `affiliate_click` (product_slug, placement, source_path) via beacon; href and navigation untouched; errors swallowed. `/go` route unchanged. |
| `tests/seo.test.ts`, `package.json` | 4 node:test tests; `npm test`. No new dependencies. |

## Results
- `tsc --noEmit`: pass. ESLint on changed files: clean. `npm test`: 4/4 pass.
- `next build --webpack`: pass. Note `npm run build` fails on Windows cmd (`NODE_OPTIONS=` prefix) — pre-existing, not touched.
- TTFB before/after: NOT measured. The query dedupe is expected to help but is unproven; measure on a deployed preview.

## Needs owner decision / data
- Consent: no cookie banner exists; decide before relying on `affiliate_click` for EU visitors.
- `affiliate_click` counts clicks only, not conversions. Mark it as a key event in GA4 yourself if wanted.
- Metadata rewrites and content audit need a Search Console export (Page + Query, both date windows).
- Review-date report needs read-only DB access (not run).
- `product_view` event not added (GA pageviews already cover it).

## Measure after deploy (7 / 14 / 28 days)
Tool-page TTFB; Search Console CTR/impressions for the four example pages; indexed count vs 586; `affiliate_click` counts per placement; rich-result report shows no AggregateRating.

## Rollback
`git checkout main` (nothing committed). Each change is independent and revertible per file.

## Metadata scan (read-only, run 2026-10-16 via `scripts/seo-audit-stale-metadata.mjs`)
Published products in DB: 595 (all created after 2026-09-01).
- Stale year in seoTitle/seoDescription: **394** (398 mentions of "2025", 6 of "2026").
- Hard-coded price/limit in meta: **89** (unverified; volatile).
- Stored "| TopToolsPick" suffix in seoTitle: 71. Titles > 65 chars: 150.
- No seoTitle and no seoDescription: 95 each (fall back to the generated title + template suffix).
- Mojibake ("â€“") in titles/descriptions: 15 (e.g. anthropic-api, bun, evernote, groq).
- Sitemap: live sitemap listed ~516 product URLs vs 595 published. Cause (LIKELY): the sitemap was prerendered at build. Fixed on this branch with `export const dynamic = "force-dynamic"` in `app/sitemap.ts` (needs deploy to take effect).
- `lastReviewedAt` count: see script output (not shown above); none of the 13 sampled pages displayed it.
Full list: re-run `node --env-file=.env.local scripts/seo-audit-stale-metadata.mjs`.
