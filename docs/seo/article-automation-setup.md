# Automated article generation + SEO performance tracking

What this adds, and the external setup it needs (none of it can be done from inside this repo).

## 1. Article generation

- `lib/articles/generate.ts` picks what to write about from real data only: an
  uncovered curated `ProductAlternative` pair (-> `topic: "comparisons"`) first, then
  a published `Product` with no `topic: "guides"` article yet. It feeds Claude only
  that product's own DB fields (pricing plan labels, pros/cons, verdict, etc.) and
  forbids inventing facts, prices, or links outside the given product slugs.
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
  3. Set `ANTHROPIC_API_KEY` and `CRON_SECRET` as environment variables on the
     Node.js app in hPanel (Node.js -> your app -> Environment variables), the same
     way `ADMIN_PASSWORD` etc. are already set there.

### Draft vs. auto-publish

Generated articles are created as `DRAFT` by default - review them in
`/admin/articles` before they go live. Set `ARTICLE_AUTO_PUBLISH=true` (or pass
`--publish` to the CLI) once you trust the output, to publish immediately instead.

## 2. SEO performance tracking (`/admin/seo`)

Reads Google Search Console's Search Analytics API (clicks, impressions, CTR,
average position, top queries, top pages - last 28 days). This needs a Google
Cloud service account with read access to the property; there is no way to grant
that from this repo.

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
5. Open `/admin/seo`. Ahrefs-style Domain Rating is a paid third-party metric
   (Ahrefs API) and is out of scope here - this page only covers what Search
   Console itself reports for free.

## What was NOT built, on purpose

Automated backlink building (the way Outrank's "backlink exchange" works) needs a
network of other sites to place links on - that is not something a script in this
repo can create. Building it would mean either joining a real third-party
backlink-exchange service, or manual outreach/guest posting.
