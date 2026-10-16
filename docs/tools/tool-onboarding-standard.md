# Tool onboarding standard

The reference for adding a tool to TopToolsPick. A tool is only imported when every
**required** item below is satisfied from a real source. Unknown = leave empty, never guess.

## 1. Sources (required for every tool)
- Official site, official pricing page, and official docs/features page. Record each URL and the date checked in the batch file (`sources`). Minimum 2, one of them the pricing page.
- Third-party review sites (G2, Capterra, AlternativeTo) may point you to a tool but are **not** a source for prices, limits or features.
- No claim without a source: no "best", "#1", user counts, awards, or percentages unless the vendor states it and you cite it.
- Logo: official brand/press-kit asset or the site's own icon, saved to `public/tool-logos/{slug}.png|svg` and referenced via the jsDelivr URL (existing workflow). Do not use `logo.clearbit.com` (service discontinued).

## 2. Fields
| Field | Rule |
|---|---|
| name, slug | Official product name; slug lowercase-hyphen, unique, no year |
| websiteUrl | Official https URL, no tracking/affiliate params |
| shortDescription | 12-25 words, says what it is and for whom, no price |
| description | >= 150 words, 3+ paragraphs separated by a blank line: what it is, who uses it and how, how pricing works, one honest limitation |
| bestFor / notFor | Both required; concrete audiences, not adjectives |
| pros / cons | 3-6 each, specific and checkable, one per line; cons must be real |
| keyFeatures | 5-8 lines in `Title: detail` form |
| integrations | Only integrations the vendor lists; omit if unknown |
| pricingModel, hasFreePlan, hasFreeTrial | Must match the pricing plans below |
| pricingPlans | Every public plan: name, priceLabel, priceAmount+currency (when numeric), billingPeriod, short description. Custom/quote plans get no amount |
| verdict | 2-4 sentences, a clear recommendation and who should skip it |
| seoTitle | <= 60 chars, no year, no price, no "Best"; unique |
| seoDescription | 120-155 chars, unique, no price unless verified that day |
| taxonomy | >= 1 use case, audience and platform |
| alternatives | >= 3 curated, each with a written reason (or add none; a 1-2 entry set stays noindex) |
| lastReviewedAt | Set to the real date the sources were checked; never backfilled |
| rating, editorialScore | **Owner decision pending**: /methodology documents no scoring rubric. Do not invent numbers; import with the rubric result only once defined |

## 3. Affiliate
Independent of listing. No program is attached until its terms are verified; create the
`AffiliateProgram` as `PENDING_VERIFICATION`. Until then the CTA correctly falls back to the
official site.

## 4. Process
1. Research and fill one JSON per tool (`docs/tools/tool-template.json`) with sources.
2. `node scripts/validate-tool-batch.mjs <file.json>` (no DB access) must pass.
3. Owner reviews the facts.
4. Import as `DRAFT`/`REVIEW` through an approved import script, then publish after a page check.
5. After publish: confirm the page renders, appears in the sitemap, and re-check prices every 90 days.
