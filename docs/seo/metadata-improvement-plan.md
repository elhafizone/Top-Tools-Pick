# Metadata improvement plan — 13 pages

Branch `seo/round-1`. Proposal only: nothing here has been applied, no DB writes.

## Evidence
- Source: Search Console export "Last 3 months" (2026-09-21 to 2026-10-13) — 4,463 impressions, 2 clicks. Current titles/descriptions fetched live from toptoolspick.com on 2026-10-16.
- The export is per page and per query separately (no page→query join), so the "dominant query" column is inferred from query text + page topic: **LIKELY, not confirmed**.
- Caveats: much of the impression volume looks automated (site: operators, very long question-style queries, 86% desktop). Navigational head terms ("google analytics", "anchor.fm") are excluded as unwinnable.
- Average position is mostly 40–55, so CTR is limited by ranking first. Titles can only help pages already near page 1.

## Defects found while fetching (technical, not editorial)
1. **Stale year, VERIFIED:** Tabnine, Poe, Cloudflare R2, Bunny.net, Mercury still say "2025" in the title (today is 2026-10-16). The root cause is hard-coded years in stored `seoTitle` values.
2. **Doubled brand suffix, VERIFIED:** Neon, Klaviyo, Sentry, ServiceNow store "| TopToolsPick" inside `seoTitle` itself (used as `absolute`, so it is intentional but inconsistent, and eats ~14 characters).
3. **Unverified hard numbers in descriptions, VERIFIED text / UNKNOWN truth:** Klaviyo ("free up to 250 contacts… $20/month"), Sentry ("5,000 errors… $26/month"), ServiceNow ("$30,000+/year"). Vendors change these; none of the 13 pages shows "Last reviewed". Verify against vendor pages before keeping, or drop the numbers.
4. **Possible content error, LIKELY:** `/best/best-password-managers` description lists NordVPN, which is a VPN, not a password manager (NordPass is). Check the list items.
5. **Intent mismatch, LIKELY:** query "servicenow erp pricing" lands on an ITSM page; "google drive pricing/plans" is partly consumer (Google One) while the page covers Workspace business plans. Do not retitle for these; decide whether the content should cover them.

## Principles for the proposed copy
Evergreen (no year) unless the review date is real; no prices or limits in titles; ≤ ~60 characters so nothing truncates; brand suffix left to the template for non-`absolute` titles.

## Proposals (ordered by position × impressions)
| # | URL | Evidence (page level) | Current title | Proposed title | Proposed description | Why | Confidence |
|---|---|---|---|---|---|---|---|
| 1 | /tools/supabase | 346 imp, pos 7.1, 0 clicks | Supabase Review 2026 — Pricing, Features & Firebase Alternatives | Supabase Pricing & Review: Free Plan Limits and Pro Tier | What Supabase's free and Pro plans include, how it compares with Firebase, and who it suits. Plan limits, features and alternatives. | Pricing-style queries appear for this tool; current title is long (~70) and leads with "Review". Pos 7 is where a title change can matter. | Medium |
| 2 | /tools/tabnine | 30 imp, pos 7.6 | Tabnine Review 2025 – Private On-Premise AI Code Completion | Tabnine Review: Pricing, Privacy and On-Prem AI Coding | Tabnine reviewed: plans, private and on-prem deployment, and how it compares with GitHub Copilot for teams that can't send code to the cloud. | Fixes stale 2025; keeps the distinctive privacy angle. | Medium |
| 3 | /tools/neon | 11 imp, pos 5.6 | Neon Review 2026 — Pricing, Features & Alternatives \| TopToolsPick | Neon Pricing and Review: Serverless Postgres with Branching | Serverless Postgres with branching: what Neon's free and paid plans include, who it suits, and how it compares with Supabase. | Specific description (current is 6 words); drops duplicated suffix. Small sample. | Low–Medium |
| 4 | /tools/poe | 24 imp, pos 7.8 (+ /tools/poe-ai 21 imp, pos 10.7) | Poe AI Review 2025 – Multi-Model Access in One App | Poe Review: Pricing and What You Get in One AI App | Poe reviewed: access several AI models in one app, how subscription pricing works, and whether it is worth paying for. | Fixes stale 2025. **Cannibalization:** /tools/poe and /tools/poe-ai both rank; decide which is canonical before editing either. | Low |
| 5 | /tools/klaviyo | 56 imp, pos 18.5 | Klaviyo: Pricing, Plans & E-commerce Email Features \| TopToolsPick | Klaviyo Pricing and Plans: Email and SMS for Online Stores | Klaviyo's email and SMS plans, free tier, and who it suits, especially Shopify and WooCommerce stores. Features and alternatives. | Removes unverified numbers; drops suffix. Verify prices before restoring any figure. | Medium |
| 6 | /tools/sentry | 30 imp, pos 16 | Sentry: Pricing, Plans & Error Monitoring Features \| TopToolsPick | Sentry Pricing and Plans: Error Monitoring Compared | Sentry's free and paid plans, error and performance monitoring, Session Replay, and who each plan suits. | Same pattern as Klaviyo. | Medium |
| 7 | /tools/cloudflare-r2 | 23 imp, pos 16 | Cloudflare R2 Review 2025 – Best S3 Alternative with Zero Egress Fees? | Cloudflare R2 Review: Zero-Egress Storage vs AWS S3 | Cloudflare R2 reviewed: S3 compatibility, how its zero-egress pricing works, and how it compares with AWS S3. | Fixes stale 2025; removes the unsupported "Best". | Medium |
| 8 | /tools/google-drive | 330 imp, pos 27 | Google Drive Review 2026 — Pricing, Storage Plans & Alternatives | Google Drive Pricing: Free Storage and Paid Plans Explained | Google Drive's free storage, paid plans and limits explained, with who each plan suits and the best alternatives. | Queries are "google drive pricing/plans/storage pricing" (pos 10–23). **Hold until you confirm the page covers consumer plans**, otherwise the title over-promises. | Low |
| 9 | /tools/servicenow | 68 imp, pos 23.5 | ServiceNow: Pricing, Plans & ITSM Features \| TopToolsPick | ServiceNow Pricing and Plans: ITSM Cost Explained | How ServiceNow ITSM is priced, what drives cost, and how it compares with Jira Service Management. | Drops the unverified "$30,000+" claim. Do not target "ERP" without content for it. | Low–Medium |
| 10 | /tools/bunny-net | 38 imp, pos 19.6 | Bunny.net Review 2025 – Best Affordable CDN for Developers? | Bunny.net Review: Pricing, CDN Performance and Stream | Bunny.net reviewed: CDN performance, pricing model, Bunny Stream, and how it compares with Cloudflare. | Fixes stale 2025; removes "Best". | Medium |
| 11 | /tools/mercury | 37 imp, pos 19.5 (+ /tools/mercury-bank 4 imp, pos 8) | Mercury Review 2025 – Best Business Bank Account for Startups? | Mercury Review: Startup Business Banking, Fees and API | Mercury reviewed: startup banking features, fees, API access, and how it compares with Brex. Verify "no-fee" wording before reuse. | Fixes stale 2025. **Cannibalization:** /tools/mercury vs /tools/mercury-bank. | Low |
| 12 | /best/best-web-hosting | 70 imp, pos 43.7 page; query "best web hosting" pos 11.3 | Best Web Hosting in 2026 \| TopToolsPick | Best Web Hosting for 2026: Providers Compared | Compare Kinsta, Hostinger, Cloudways and more on speed, price and support. Includes who each host suits. | The query ranks 11 but the page averages 44, so it is a broad-intent page; copy gain is small, depth and links matter more. Netlify is not classic hosting: check the list fits the intent. | Low |
| 13 | /best/best-password-managers | 5 imp, pos 13.6 | Best Password Managers in 2026 \| TopToolsPick | Best Password Managers: 1Password, Bitwarden and More Compared | Compared: the best password managers for individuals and teams, with pricing, security features and who each suits. | **Fix the NordVPN entry first** (content accuracy), then retitle. | Low |

## Rollout and rollback
1. Apply one page at a time through `/admin/products` (or `/admin/editorial-lists`) so the old `seoTitle`/`seoDescription` can be copied back. Record old values (above) before each edit.
2. Start with the Medium-confidence rows (1, 2, 5, 6, 7, 10). Leave Low rows until the open questions are answered.
3. Wait at least 14 days between batches; compare CTR and position per page in Search Console, never total clicks alone.
4. Verify any price/limit against the vendor page and set `lastReviewedAt` only after a real review.

## Open questions for the owner
- Which of /tools/poe vs /tools/poe-ai and /tools/mercury vs /tools/mercury-bank is the canonical page?
- Does the Google Drive page cover Google One consumer plans?
- Should the 2025 titles be fixed in bulk for all products (a read-only DB query can list every `seoTitle` containing "2025")?
