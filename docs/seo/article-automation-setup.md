# Automated article generation + SEO performance tracking

What this adds, and the external setup it needs (none of it can be done from inside this repo).

## 1. Article generation

- `lib/articles/generate.ts` picks what to write about from real data only: an
  uncovered curated `ProductAlternative` pair (-> `topic: "comparisons"`) first, then
  a published `Product` with no `topic: "guides"` article yet. It feeds the model only
  that product's own DB fields (pricing plan labels, pros/cons, verdict, etc.) and
  forbids inventing facts, prices, or links outside the given product slugs.
- **Model: free by default.** `GEMINI_API_KEY` is tried first - Google AI Studio
  (https://aistudio.google.com/apikey) gives a free key in about a minute, no card,
  no billing setup, and the free tier comfortably covers far more than one article a
  day. `ANTHROPIC_API_KEY` is only used as a fallback if `GEMINI_API_KEY` is not set
  (needs a funded Anthropic account - console.anthropic.com/settings/billing).
- The result is validated against the exact same contract as
  `scripts/import-article-batch.mjs` (word count, SEO field lengths, Quick-answer +
  H2 structure, Sources section, valid `/tools/` links only). A failed validation
  gets one retry with the errors fed back to the model; if it still fails, nothing
  is written.
- Run manually: `npm run articles:generate` (1 article, DRAFT). Flags: `--count=3`,
  `--publish`.
- Scheduling: `GET /api/cron/generate-articles?secret=...&count=1`, protected by
  `CRON_SECRET`. There is no cron runtime inside this Node app, so scheduling it is
  an external step:
  1. In Hostinger hPanel, open **Advanced -> Cron Jobs** for this site.
  2. Add a job that runs e.g. daily and requests
     `https://toptoolspick.com/api/cron/generate-articles?secret=YOUR_CRON_SECRET`
     (hPanel's cron UI can usually call a URL directly - if it only offers to run a
     shell command instead, use `curl` with that same URL).
  3. Set `GEMINI_API_KEY`, `CRON_SECRET` and `ARTICLE_AUTO_PUBLISH=true` as
     environment variables on the Node.js app in hPanel (Website -> Environment
     variables). These three are the only ones this feature needs there - no admin
     login is used for it (see below).
- **Featured image (optional, free):** set `UNSPLASH_ACCESS_KEY` to attach a real,
  licensed photo to each generated article instead of none. Get a free key at
  unsplash.com/developers -> New Application -> pick the Demo tier (no card, 50
  requests/hour - plenty for one article a day). Leave it unset to skip images.

### Draft vs. auto-publish

`ARTICLE_AUTO_PUBLISH=true` on this site: generated articles publish immediately,
no manual review step. (Default without that env var is `DRAFT`, for anyone who
does want to review in `/admin/articles` before articles go live - not used here
since this site's admin login isn't configured on Hostinger.)

## 2. SEO performance tracking

No `/admin/seo` page is used here (it needs the admin login, which this site
doesn't have configured on Hostinger - see "What was NOT built" below if that
changes later). Instead, run `npm run seo:check` from this repo - no Hostinger env
vars needed, only `GOOGLE_SEARCH_CONSOLE_*` in `.env.local` (below) - whenever you
want the numbers: clicks, impressions, CTR, average position, top queries, top
pages (last 28 days). This needs a Google Cloud service account with read access
to the property; there is no way to grant that from this repo.

1. In the [Google Cloud Console](https://console.cloud.google.com/), create (or
   reuse) a project, then enable the **Google Search Console API**.
2. Create a **service account** in that project, and create a JSON key for it.
3. In [Search Console](https://search.google.com/search-console), open the
   `toptoolspick.com` property -> **Settings -> Users and permissions -> Add user**,
   and add the service account's email as a **Restricted** (read-only) user.
4. From the downloaded JSON key, set these as environment variables (hPanel, same
   place as the others):
   - `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL` = the key's `client_email`
   - `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY` = the key's `private_key` (keep the
     `\n` line breaks as-is - the code un-escapes them)
   - `GOOGLE_SEARCH_CONSOLE_SITE_URL` = how the property is verified in Search
     Console - usually `sc-domain:toptoolspick.com` for a domain property, or
     `https://toptoolspick.com/` for a URL-prefix property
5. Run `npm run seo:check`. Ahrefs-style Domain Rating is a paid third-party
   metric (Ahrefs API) and is out of scope here - this only covers what Search
   Console itself reports for free.

## What was NOT built, on purpose

- **The `/admin` web panel is not set up on Hostinger** (only `DATABASE_URL` is
  configured there - `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET`/
  `NEXT_PUBLIC_SITE_URL` are not, so `/admin/login` cannot actually succeed right
  now). That's fine for this feature - generation, publishing and SEO checks all
  work without it - but it also means the existing manual single-article admin
  form and `/admin/seo` page are both currently unreachable on the live site. Add
  those four env vars in hPanel (same values as `.env.local`) if that panel is
  ever wanted again.

- **Automated backlink building** (the way Outrank's "backlink exchange" works)
  needs a network of other sites to place links on - that is not something a
  script in this repo can create. Building it would mean either joining a real
  third-party backlink-exchange service, or manual outreach/guest posting.
- **Real keyword search-volume research.** There is no good free API for this -
  Ahrefs/SEMrush are paid, and Google Keyword Planner's actual volume numbers are
  only shown to Google Ads accounts with real ad spend history. Topic selection
  here is DB-driven instead (an uncovered product or curated comparison), which
  needs no external data and cannot show a made-up search-volume number. If you
  later get one of those paid keys, topic selection could be re-ranked by it.
