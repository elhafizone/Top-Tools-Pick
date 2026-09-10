# TOPTOOLSPICK.COM — INITIAL ARCHITECTURE & BUILD PROMPT

You are the lead software architect, senior full-stack engineer, SEO architect, UI/UX designer, and technical product engineer responsible for building **TopToolsPick.com** from scratch.

## 1. PROJECT OVERVIEW

Build a premium, modern, high-performance affiliate discovery platform called:

**TopToolsPick**

Domain:
**toptoolspick.com**

Core concept:

TopToolsPick is a global discovery platform for **digital products, software, SaaS tools, online services, courses, platforms, and other digital products that offer affiliate programs**.

The website's primary target audience is:

- United States
- Canada
- United Kingdom
- Europe
- English-speaking international users

The primary business model is:

**SEO traffic → Product discovery → Product comparison/recommendation → Affiliate click → Merchant → Commission**

The website should NOT look like a generic coupon website or a simple affiliate blog.

It should feel like a professional technology/product discovery platform.

Think of the product experience as a combination of:

- Product discovery platform
- Software directory
- Affiliate comparison website
- Editorial review platform
- "Best tools" discovery engine
- Modern technology publication

---

# 2. NON-NEGOTIABLE TECHNOLOGY STACK

Use ONLY the following core stack unless there is a strong technical reason to add something:

- Next.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Tailwind CSS

Use the latest stable versions compatible with each other.

Prefer the Next.js App Router.

Use Server Components by default.

Use Client Components only when interactivity actually requires them.

Do NOT use:

- WordPress
- PHP
- Elementor
- page builders
- unnecessary CMS platforms
- unnecessary frontend frameworks
- jQuery

The architecture must be production-ready and scalable.

---

# 3. DEVELOPMENT PRINCIPLES

Follow these principles throughout the project:

### Performance First

The website must be extremely fast.

Prioritize:

- Server Components
- Static generation where appropriate
- Incremental Static Regeneration where appropriate
- Image optimization
- Minimal JavaScript
- Code splitting
- Lazy loading
- Efficient database queries
- Caching
- CDN-friendly architecture

Avoid unnecessary client-side rendering.

### SEO First

SEO is a core product requirement, not an afterthought.

Every important page must have:

- unique title
- meta description
- canonical URL
- Open Graph metadata
- Twitter/X metadata
- structured data where appropriate
- semantic HTML
- crawlable content
- clean URLs
- internal linking
- breadcrumbs where appropriate

The architecture must support large-scale programmatic SEO without creating thin or duplicate pages.

---

# 4. PRIMARY PRODUCT CATEGORIES

Create the initial taxonomy around these major categories:

1. AI Tools
2. Website & Hosting
3. Marketing & SEO
4. Design & Creative
5. Business & Productivity
6. Development & Coding
7. E-commerce
8. Education & Courses
9. Video & Audio
10. Finance & Business Services
11. Cybersecurity & Privacy
12. Remote Work

The taxonomy must NOT be hard-coded throughout the application.

Categories should be database-driven.

The architecture must support:

- Categories
- Subcategories
- Tags
- Use cases
- Industries
- Target audiences
- Platforms
- Pricing models

These relationships must be extensible.

---

# 5. CORE DATABASE CONCEPT

The central entity is the **Product**.

A Product can represent:

- SaaS
- software
- AI tool
- hosting
- online service
- course
- platform
- API
- developer tool
- design resource
- business service
- productivity tool
- etc.

A product should support information such as:

- name
- slug
- short description
- full description
- logo
- screenshots
- gallery
- website URL
- affiliate URL
- affiliate program status
- affiliate network
- commission information
- pricing
- free plan
- free trial
- lifetime deal
- pricing model
- category
- subcategory
- tags
- use cases
- target audience
- platforms
- features
- pros
- cons
- rating
- editorial score
- featured status
- verified status
- publication status
- SEO metadata
- created date
- updated date

Design the schema so that this can evolve without requiring major database restructuring.

---

# 6. AFFILIATE ARCHITECTURE

Affiliate links are one of the most important parts of the business model.

Do NOT simply store one affiliate URL directly inside arbitrary page content.

Create a proper affiliate relationship architecture.

A product may have:

- direct affiliate program
- affiliate network
- multiple affiliate links
- different tracking URLs
- regional affiliate URLs
- campaign parameters

The system should eventually support:

- affiliate link tracking
- click tracking
- outbound click events
- merchant attribution
- UTM parameters
- link health checking
- affiliate program status

For the initial implementation, create a clean abstraction that can later support these features.

---

# 7. REQUIRED PAGE STRUCTURE

Create the architecture for these primary pages:

## Homepage

/

The homepage should introduce TopToolsPick as a premium digital tools discovery platform.

Include sections such as:

- Hero
- Featured tools
- Trending tools
- Best AI tools
- Best software
- Popular categories
- Latest discoveries
- Editorial recommendations
- Latest stories
- CTA / newsletter area

Do not overload the homepage.

Keep the design editorial, modern, premium and highly scannable.

---

## Categories

/categories

/categories/[category]

/categories/[category]/[subcategory]

Category pages must be dynamically generated from the database.

---

## Products

/tools

/tools/[slug]

The individual product page is one of the most important pages on the website.

It should support:

- product overview
- rating
- key features
- pricing
- pros and cons
- screenshots
- alternatives
- related tools
- category
- use cases
- target audience
- affiliate CTA
- editorial review
- disclosure

The primary CTA should be clear but should NOT feel spammy.

---

# 8. COMPARISON SYSTEM

The architecture must support comparison pages.

Examples:

/compare/canva-vs-adobe-express

/compare/jasper-vs-copy-ai

/compare/hostinger-vs-cloudways

A comparison entity should support:

- Product A
- Product B
- feature comparison
- pricing comparison
- strengths
- weaknesses
- best for
- editorial verdict
- affiliate CTAs

Design this feature into the architecture from the beginning.

---

# 9. LIST / "BEST" CONTENT

The platform must support editorial list pages such as:

/best/ai-writing-tools

/best/seo-tools

/best/web-hosting

/best/video-editing-software

/best/tools-for-youtubers

These pages should be database-driven where possible.

The system must support manually curated rankings.

Do NOT create automatically generated thin pages for every possible combination.

Quality is more important than quantity.

---

# 10. SEARCH

Create a scalable search architecture.

Users should eventually be able to search:

- product names
- categories
- features
- use cases
- tags

For the initial version, implement a clean database-backed search abstraction that can later be upgraded to a dedicated search engine without rebuilding the frontend.

---

# 11. FILTERING

The product discovery interface should support filters such as:

- Category
- Subcategory
- Pricing
- Free plan
- Free trial
- Lifetime deal
- Platform
- Use case
- Audience
- Rating

Filters must be URL-driven where appropriate so filtered pages can be shared.

Do NOT create indexable duplicate pages for every filter combination automatically.

---

# 12. GOOGLE WEB STORIES

Web Stories are an important future traffic channel.

The architecture must support **Google Web Stories as part of the Next.js application**.

Stories should have URLs such as:

/stories/[slug]

Example:

/stories/best-ai-writing-tools

Each story should be a proper Web Story implementation compatible with Google's requirements.

The architecture must allow:

- story title
- publisher
- poster image
- pages
- media
- text
- CTA
- affiliate link
- story metadata
- publication date
- update date

Stories should be independently crawlable and indexable.

Do NOT treat Stories as ordinary video embeds.

Build the architecture so that Web Stories can later be generated and managed from the same database.

---

# 13. SEO ARCHITECTURE

Implement a centralized SEO system.

Create reusable functions/components for:

- metadata
- canonical URLs
- Open Graph
- Twitter cards
- JSON-LD
- breadcrumbs
- sitemap generation
- robots.txt
- pagination metadata where needed

Support structured data types where appropriate, including:

- Organization
- WebSite
- BreadcrumbList
- Product
- SoftwareApplication
- Review
- AggregateRating
- Article
- ItemList

Do NOT add structured data when it does not accurately represent visible page content.

---

# 14. SITEMAPS

Create dynamic sitemap architecture.

The system must eventually support separate sitemaps for:

- products
- categories
- comparisons
- best pages
- stories
- articles

Use Next.js sitemap capabilities.

Do not generate one enormous static sitemap manually.

---

# 15. ROBOTS.TXT

Create a dynamic robots.txt implementation.

Allow search engine crawling of public content.

Prevent crawling/indexing of:

- admin
- internal APIs where appropriate
- private areas
- tracking endpoints
- unnecessary query parameter variations

Do not accidentally block:

- products
- categories
- stories
- comparison pages
- editorial content

---

# 16. URL STRUCTURE

Use clean, permanent, SEO-friendly URLs.

Examples:

/tools/elevenlabs

/categories/ai-tools

/categories/ai-tools/ai-video

/best/ai-video-generators

/compare/elevenlabs-vs-murf

/stories/best-ai-voice-generators

Avoid unnecessary URL parameters.

Avoid IDs in public URLs.

Use slugs.

---

# 17. DESIGN DIRECTION

Create a premium technology/editorial visual identity.

The design should be:

- modern
- minimal
- sophisticated
- highly readable
- premium
- trustworthy
- conversion-focused
- editorial
- responsive

Avoid:

- generic SaaS templates
- excessive gradients
- excessive rounded cards
- clutter
- huge unnecessary animations
- cheap affiliate-site aesthetics
- excessive advertisements

The user should immediately feel:

"These people know which digital tools are worth using."

---

# 18. RESPONSIVE DESIGN

Mobile-first.

Support:

- mobile
- tablet
- desktop
- large desktop screens

Navigation, search, filters and comparison tables must work exceptionally well on mobile.

---

# 19. ACCESSIBILITY

Follow modern accessibility principles:

- semantic HTML
- keyboard navigation
- accessible buttons
- accessible forms
- sufficient contrast
- visible focus states
- alt text
- correct heading hierarchy
- ARIA only when necessary

---

# 20. COMPONENT ARCHITECTURE

Create a reusable component system.

Suggested structure:

components/
  ui/
  layout/
  navigation/
  product/
  category/
  comparison/
  search/
  filters/
  stories/
  seo/
  affiliate/

Do not create giant components.

Keep components focused and reusable.

---

# 21. APPLICATION ARCHITECTURE

Use a clean structure similar to:

app/
components/
lib/
  db/
  seo/
  affiliate/
  search/
  utils/
prisma/
public/
types/

Organize the project logically.

Do not over-engineer.

---

# 22. DATABASE

Use PostgreSQL with Prisma.

Create an initial Prisma schema capable of supporting:

- Product
- Category
- Subcategory
- Tag
- ProductTag
- UseCase
- ProductUseCase
- Audience
- ProductAudience
- Platform
- ProductPlatform
- PricingPlan
- AffiliateProgram
- AffiliateLink
- Comparison
- Story
- StoryPage
- Review

Add timestamps and appropriate indexes.

Pay particular attention to:

- slug uniqueness
- search-related fields
- foreign keys
- many-to-many relationships
- efficient product/category queries

---

# 23. ADMIN ARCHITECTURE

Do not build a full admin dashboard yet.

However, design the data layer so that a future admin interface can manage:

- products
- categories
- affiliate programs
- affiliate links
- pricing
- comparisons
- stories
- reviews
- SEO metadata

Do not use WordPress or another CMS as the admin backend.

The eventual admin panel will be part of the Next.js application.

---

# 24. SAMPLE DATA

Create realistic seed data for development.

Include approximately:

- 12 categories
- 20+ subcategories
- 15–25 sample products
- sample affiliate programs
- sample pricing
- sample tags
- sample use cases
- sample comparisons
- sample story records

Use clearly marked fictional/development data where real commercial information has not been verified.

Never present invented affiliate commission information as real.

---

# 25. AFFILIATE DISCLOSURE

Create a reusable affiliate disclosure component.

Affiliate links must be clearly disclosed.

The architecture should allow disclosure text to appear:

- globally
- on product pages
- on comparison pages
- on editorial pages
- inside Stories when appropriate

Do not hide the affiliate relationship.

---

# 26. ANALYTICS ARCHITECTURE

Prepare the application for analytics without coupling the core application to one provider.

Track events conceptually such as:

- product_view
- affiliate_click
- search
- filter_usage
- comparison_view
- story_view
- story_cta_click

Create a clean analytics abstraction.

Do not add unnecessary analytics providers at this stage.

---

# 27. SECURITY

Follow secure development practices.

Protect:

- database credentials
- environment variables
- API routes
- admin functionality
- affiliate configuration
- tracking endpoints

Never expose secrets to the browser.

Use environment variables.

Create:

.env.example

Do NOT commit real credentials.

---

# 28. CODE QUALITY

Use:

- strict TypeScript
- ESLint
- clean naming
- reusable functions
- clear separation of concerns
- proper error handling

Avoid:

- any unless absolutely necessary
- duplicated logic
- magic strings
- giant files
- unnecessary dependencies
- premature abstractions

---

# 29. FIRST IMPLEMENTATION PHASE

Do NOT attempt to build every feature immediately.

Phase 1 should establish the production-ready foundation:

1. Initialize Next.js
2. Configure TypeScript
3. Configure Tailwind CSS
4. Configure PostgreSQL
5. Configure Prisma
6. Create database schema
7. Create Prisma migrations
8. Create seed data
9. Create application layout
10. Create navigation
11. Create homepage
12. Create category architecture
13. Create product architecture
14. Create basic search architecture
15. Create SEO system
16. Create sitemap
17. Create robots.txt
18. Create affiliate-link abstraction
19. Create Web Stories architecture
20. Add responsive design
21. Add loading/error/not-found states
22. Run lint/type checks/build

---

# 30. IMPORTANT DEVELOPMENT RULE

Before writing a large amount of code:

1. Inspect the existing project directory.
2. Determine whether a project already exists.
3. Do not overwrite existing work blindly.
4. Explain the proposed architecture briefly.
5. Then implement Phase 1.

If the directory is empty, initialize the project.

If an existing Next.js project is present, adapt it instead of recreating it.

---

# 31. DO NOT STOP AT A MOCKUP

The result must be a functioning application.

Do not create only static HTML mockups.

Products, categories, and other entities must be connected to PostgreSQL through Prisma.

The homepage should retrieve real development data from the database.

---

# 32. FINAL REQUIREMENT

At the end of Phase 1:

- run TypeScript checks
- run ESLint
- run production build
- fix all errors
- verify database connectivity
- verify Prisma migrations
- verify seeded data
- verify public routes
- verify metadata
- verify sitemap
- verify robots.txt
- verify responsive layout

Then provide a concise implementation report containing:

1. What was created
2. Database models
3. Routes created
4. Components created
5. Dependencies added
6. Commands used
7. Tests/checks performed
8. Any remaining issues
9. Recommended next development phase

Do not proceed into unrelated features until Phase 1 is stable.