# SEO Guidance Research Standard
## Evidence-Backed SOP for Search Rankings, Technical SEO, AI-Built Websites, and Vibe-Coded Site Audits

**Version:** 1.0  
**Research date:** 2026-08-04  
**Document status:** Research foundation for a future `/SEO-GUIDELINES.md`  
**Primary search engines:** Google and Bing  
**Default audience:** Business owners, developers, marketers, SEO professionals, and AI coding agents  
**Default website types:** Service businesses, local businesses, SaaS, ecommerce, blogs, and portfolios  
**Default technology coverage:** Next.js, React, Vite, CMS platforms, static sites, server-rendered sites, and client-rendered applications  

---

## 0. Purpose

This document defines a repeatable method for researching, verifying, testing, and converting SEO information into enforceable website-development rules.

It is not a list of guaranteed ranking tactics. It is a research and implementation standard designed to prevent an AI coding agent, developer, marketer, or business owner from:

- Treating SEO myths as facts
- Confusing crawling, indexing, ranking, search presentation, user experience, and conversion
- Publishing large volumes of low-value generated pages
- Repeating unsupported claims from SEO vendors or social posts
- Assuming a technically valid page is automatically useful or competitive
- Assuming every best practice is a direct ranking factor
- Replacing human review with automated generation
- Treating proprietary metrics such as Domain Authority or Domain Rating as Google metrics
- Assuming Google penalizes a site merely because AI helped build it

The intended workflow is:

1. Define the site and business context.
2. Research official policies and platform documentation.
3. Inspect current search results.
4. Evaluate secondary research and practitioner evidence.
5. Classify every claim.
6. Test framework-specific implementation.
7. Record evidence and limitations.
8. Convert only adequately supported findings into `/SEO-GUIDELINES.md`.

---

# 1. Executive Research Conclusions

## 1.1 The development method is not the primary SEO issue

“Vibe-coded site” is industry shorthand, not an official search-engine classification. Current Google guidance focuses on the resulting content and implementation rather than whether AI, a visual builder, a CMS, or manually written code created the site.

The measurable risks are:

- Low-value scaled content
- Duplicate or near-duplicate pages
- Incorrect metadata
- Weak internal linking
- Broken route generation
- Client-rendering failures
- Accidental blocking or `noindex`
- Invalid canonicals
- Inaccurate structured data
- Placeholder or fabricated content
- Poor performance
- Inaccessible interfaces
- Missing measurement
- No maintenance process

**Research position:** Do not claim that Google penalizes “vibe coding.” Audit the outputs.

## 1.2 AI-generated content is not automatically disallowed

Google’s current guidance permits the use of generative AI when the result is accurate, useful, relevant, and compliant with Search Essentials. Generating many pages primarily to manipulate rankings, with little original value, can qualify as scaled content abuse.

**Research position:** Evaluate purpose, originality, accuracy, usefulness, and scale—not authorship method alone.

## 1.3 Discovery, crawling, rendering, indexing, ranking, and conversion are separate

A page can be:

- Live but not discoverable
- Discoverable but blocked from crawling
- Crawlable but not renderable
- Renderable but excluded from indexing
- Indexed but not competitive
- Ranking but producing poor click-through
- Receiving traffic but failing to convert

Every audit finding must name the stage it affects.

## 1.4 Several popular SEO rules are unsupported as absolutes

The research does **not** support treating the following as universal requirements:

- Exactly one H1 on every page
- At least five internal links on every new page
- Exact-match anchor text for all links
- Manual indexing requests for every publication
- A maximum of one page published per day
- A fixed publishing cadence as a confirmed ranking factor
- Structured data on every page
- Breadcrumbs on every site
- `hreflang` on sites without language or regional variants
- A preferred Google word count
- Schema markup as a direct ranking boost
- Meta descriptions as a direct ranking factor
- Accessibility conformance as a confirmed direct ranking factor
- Domain Authority as a Google metric

These may become internal conventions, conditional practices, or quality controls, but they must not be represented as confirmed universal ranking requirements.

## 1.5 Initial HTML reduces the failure surface for JavaScript sites

Google can crawl, render, and index JavaScript. However, JavaScript sites add a rendering stage and can introduce delayed content, missing links, metadata conflicts, soft 404s, blocked resources, and hydration failures.

**Research position:** For public SEO landing pages, articles, service pages, product pages, and location pages, prefer static generation or server-rendered initial HTML when practical. This is a reliability recommendation, not a claim that all client-rendered pages fail.

## 1.6 Sitemaps help discovery but do not guarantee indexing

Google describes sitemap submission as a hint. Important pages should also be reachable through crawlable internal links. A sitemap should contain canonical, indexable URLs that the site actually intends to surface.

## 1.7 Structured data is primarily an eligibility and interpretation mechanism

Correct structured data can make a page eligible for supported rich-result features. It must match visible content and meet both general and feature-specific policies.

**Research position:** Do not claim structured data guarantees a rich result or directly improves ordinary rankings.

## 1.8 Core Web Vitals matter, but content relevance still matters more than passing a speed test

Google recommends good Core Web Vitals and uses page-experience-related signals within broader ranking systems. Passing thresholds does not make weak content competitive, and failing one metric does not automatically remove a page from search.

## 1.9 Accessibility should be enforced independently of ranking claims

Descriptive headings, labels, alternative text, keyboard access, focus behavior, and semantic relationships improve accessibility and usability. They may indirectly improve engagement and content comprehension, but direct ranking claims require evidence.

## 1.10 SEO automation should enforce process, not manufacture authority

A coding agent is well suited to:

- Generating and validating metadata
- Updating sitemaps
- Checking canonical consistency
- Finding orphan routes
- Adding relevant internal-link opportunities
- Producing valid structured data
- Comparing raw and rendered HTML
- Testing status codes
- Running performance and accessibility checks
- Flagging unsupported claims
- Maintaining evidence and review dates

It is not a substitute for:

- Firsthand experience
- Original research
- Subject expertise
- Customer knowledge
- Real citations
- Earned links
- Editorial judgment
- Competitive positioning
- Human quality review

---

# 2. Research Configuration

Complete this block before each research run.

```yaml
research_project:
  project_name:
  research_date:
  researcher_or_agent:
  target_audience:
  website_type:
  website_domain:
  geographic_focus:
  industry_or_niche:
  technical_depth:
  search_engines:
    - Google
    - Bing
  research_time_range:
  business_objective:
  website_technology:
  rendering_model:
    - static
    - server_rendered
    - client_rendered
    - hybrid
    - unknown
  primary_conversion:
  known_website_problems:
  priority_page_types:
  competitors:
  analytics_available:
  search_console_available:
  bing_webmaster_tools_available:
  client_or_owner_access:
  legal_or_regulatory_constraints:
```

A recommendation that cannot be mapped to this context should be labeled **general** or **not yet applicable**.

---

# 3. Scope

## 3.1 Included by default

- Organic search visibility
- Crawling and URL discovery
- Rendering
- Indexability
- Canonicalization
- Search ranking and relevance
- Search-result presentation
- Internal linking
- Information architecture
- URL structure
- Metadata
- Structured data
- XML sitemaps
- Robots directives
- HTTP status codes and redirects
- JavaScript SEO
- Mobile usability
- Core Web Vitals
- Content quality
- Search intent
- Keyword and topic research
- Programmatic page generation
- AI-generated content risks
- Vibe-coded implementation risks
- Accessibility
- Local SEO
- Backlinks and link analysis
- Analytics
- Search Console
- Bing Webmaster Tools
- Conversion tracking
- Content maintenance
- Search-system and policy updates

## 3.2 Excluded unless explicitly requested

- Paid search campaign management
- Paid social advertising
- Email marketing
- Influencer marketing
- General brand strategy
- Affiliate monetization strategy
- Reputation-management campaigns
- Black-hat SEO tactics
- Link schemes
- Cloaking
- Review manipulation
- Scraped-content operations
- Parasite SEO execution
- Guaranteed ranking forecasts

---

# 4. Terminology Classification

| Term | Classification | Working definition | Important limitation |
|---|---|---|---|
| SEO | Official/common industry term | Improving a site so search engines can crawl, index, understand, and surface useful content | Does not guarantee rankings |
| SERP | Industry shorthand | Search engine results page | SERP layouts vary by query, device, location, and time |
| Crawl | Official search-engine term | Fetching a URL or resource | Crawling does not guarantee indexing |
| Index | Official search-engine term | Processing and storing eligible content | Indexing does not guarantee ranking |
| Render | Official technical/search term | Executing page resources to obtain rendered HTML and content | Rendering can be delayed or fail |
| Rank | Official/common term | Ordering results for a query | Uses many systems and signals |
| Search intent | Industry term aligned with information retrieval | The task the searcher is trying to complete | Intent must be inferred from actual results and user context |
| Keyword | Marketing/SEO term | A target phrase or concept used in research | Google ranks pages for queries, not a single manually assigned keyword |
| Query | Official information-retrieval term | What a user submits to a search engine | One page may satisfy many query variations |
| Topical authority | Industry shorthand | Perceived depth and reliability across a topic | Not a single published Google score |
| Domain Authority | Proprietary Moz metric | Third-party link-based comparative score | Not used by Google as a named metric |
| Domain Rating | Proprietary Ahrefs metric | Third-party backlink profile score | Not a Google metric |
| Page authority | Third-party metric/category | Estimated strength of an individual page | Method varies by vendor |
| Link equity | Industry shorthand | Value or signals passed through links | Exact calculation is not public |
| Backlink | Common industry term | A link from another website | Quality, relevance, context, and spam policies matter |
| Internal link | Official/common term | A link between pages on the same site | No official universal minimum count |
| Canonical | Official search term | Preferred representative URL among duplicates or near-duplicates | Usually a signal/hint, not an absolute directive |
| Duplicate content | Common technical term | Same or substantially similar content at multiple URLs | Not automatically a penalty; can create selection and efficiency issues |
| Thin content | Industry/policy shorthand | Content offering little substantive value | No universal word-count threshold |
| Structured data | Official technical term | Machine-readable markup describing page entities and content | Eligibility does not guarantee rich results |
| Schema markup | Industry shorthand | Structured data using Schema.org vocabulary | Schema.org vocabulary is broader than Google-supported rich results |
| Core Web Vitals | Official web-performance term | LCP, INP, and CLS field metrics | Good scores do not replace relevance or quality |
| Search Console | Official Google product | Google site-performance and indexing tool | Data is sampled/processed and not a complete ranking explanation |
| Sitemap | Official protocol/search term | File listing important site URLs and metadata | Submission is a hint, not an indexing guarantee |
| robots.txt | Official protocol term | Crawl-access rules for bots | Does not reliably prevent a URL from appearing in search |
| noindex | Official robots directive | Prevents an accessible page from being indexed | The crawler must access the directive |
| hreflang | Official Google/international SEO term | Declares language or regional page alternatives | Only relevant where alternate versions exist |
| Programmatic SEO | Industry term | Template- and data-driven creation of search-targeted pages | Can become scaled content abuse or doorway content |
| Parasite SEO | Industry shorthand | Publishing on another domain to exploit its authority | Often associated with policy and reputation-abuse risks |
| Local pack | Industry term | Map-based local search result block | Appearance varies by query and location |
| Entity SEO | Industry term | Optimizing clarity around people, organizations, products, places, and relationships | Not a separate official ranking system |
| Semantic search | Technical/industry term | Matching based on meaning and concepts, not only exact wording | Does not eliminate the need for clear terminology |
| AI Overviews | Official Google feature name | Generative summaries in Google Search | Visibility and reporting can change |
| Generative engine optimization | Emerging/speculative marketing term | Attempts to improve visibility in generative answers | No stable cross-platform standard or guaranteed method |
| Conversion rate optimization | Marketing discipline | Improving the percentage of visitors who complete desired actions | Conversion improvements are not automatically SEO ranking improvements |
| Vibe-coded site | Emerging industry shorthand | A site built rapidly through AI prompting or generated components without deliberate architecture | Not an official search-engine category |
| Crawl budget | Official Google concept for very large sites | Resources Google allocates to crawling | Usually not a concern for ordinary small sites |
| E-E-A-T | Google quality concept | Experience, expertise, authoritativeness, and trustworthiness | Not one specific ranking factor or score |
| Search quality rater guidelines | Official evaluation framework | Guidance used by human raters to assess result quality | Raters do not directly rank pages |
| Search visibility | Industry metric/category | Estimated or observed presence in search | Vendor visibility scores are proprietary |
| IndexNow | Open submission protocol | Notifies participating engines of URL changes | Notification does not guarantee indexing or ranking |

---

# 5. Claim Classification

Every claim must receive one classification before it is placed in a guideline.

| Classification | Meaning | Required evidence |
|---|---|---|
| Official requirement | Explicit policy, standard, or eligibility condition | Current primary documentation |
| Documented search behavior | Search engine explains how it crawls, renders, indexes, or serves | Current search-engine documentation |
| Ranking-system statement | Search engine confirms a system or signal category | Official ranking-system documentation |
| Eligibility requirement | Needed for a specific search feature | Official feature documentation |
| Technical best practice | Reduces implementation risk or improves machine/user access | Standards or platform docs, plus testing where possible |
| Accessibility requirement | WCAG or legal/project requirement | W3C or applicable legal/contract standard |
| Conversion best practice | Improves usability or business outcomes | Analytics, UX evidence, or controlled testing |
| Observed correlation | Variables appear together in a dataset | Transparent methodology and caution against causality |
| Controlled experiment | A change was isolated and measured | Reproducible method, adequate sample, limitations |
| Practitioner observation | Experienced operator reports a recurring pattern | Supporting evidence preferred; never treated as universal |
| Tool-specific recommendation | Advice required to operate a tool | Official tool documentation |
| Framework-specific instruction | Required by the selected stack | Current official framework documentation |
| Hypothesis | Plausible but unproven | Clearly labeled and testable |
| Unverified claim | Lacks adequate evidence | Exclude from enforceable rules |
| Rejected claim | Contradicted or materially misleading | Record reason for rejection |

---

# 6. Guideline Strength Labels

The future `/SEO-GUIDELINES.md` should use these labels.

- **REQUIRED:** Failure creates a clear policy, accessibility, security, indexability, data-integrity, or project-compliance problem.
- **STRONG RECOMMENDATION:** Supported by primary guidance and generally useful, but exceptions exist.
- **CONDITIONAL:** Applies only to certain page types, technologies, languages, markets, or site sizes.
- **EXPERIMENTAL:** Plausible and testable, but not sufficiently established.
- **AVOID:** Creates material risk, low user value, policy exposure, or unreliable implementation.
- **HUMAN REVIEW REQUIRED:** Automation may assist, but a qualified person must approve the result.

---

# 7. Source Hierarchy

## Tier 1 — Primary and normative sources

Use for policy, standards, platform behavior, eligibility, and implementation requirements.

1. Google Search Central documentation
2. Google Search Console documentation
3. Google Search Status Dashboard
4. Google Business Profile documentation
5. Bing Webmaster Guidelines and documentation
6. IndexNow protocol documentation
7. Schema.org
8. W3C and WCAG
9. Web standards and HTTP specifications
10. web.dev and Chrome documentation
11. Official framework documentation
12. Official analytics documentation
13. Government publications
14. Peer-reviewed research and original technical papers

## Tier 2 — Strong independent technical research

Use for prevalence, observed implementation patterns, large-scale technical data, and reproducible tests.

- HTTP Archive / Web Almanac
- Transparent academic studies
- Independent performance research
- Reputable technical SEO experiments
- Public case studies with methodology and data
- Browser-based and crawler-based comparative testing

## Tier 3 — SEO platforms and industry publications

Use for workflows, tool operation, proprietary datasets, and practitioner interpretation.

- Ahrefs
- Semrush
- Moz
- Screaming Frog
- Sitebulb
- Search Engine Land
- Search Engine Journal
- Similarweb

A vendor’s proprietary metric or dataset must be labeled as such.

## Tier 4 — Agencies, personal blogs, videos, communities, forums, and social posts

Use for:

- Troubleshooting leads
- Emerging terminology
- Example failures
- Hypothesis generation
- Potential case studies
- Practitioner perspectives

Do not use Tier 4 as the sole evidence for a major ranking claim.

---

# 8. Source Quality Scoring

Score each dimension from 1 to 5.

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| Authority | Unknown or unrelated | Recognized industry source | Normative owner, official platform, or leading primary researcher |
| Relevant expertise | No demonstrated expertise | General industry experience | Direct subject-matter responsibility |
| Evidence quality | Assertions only | Examples or limited data | Primary data, documentation, or reproducible evidence |
| Recency | Materially outdated | Still applicable but aging | Current and recently verified |
| Transparency | No author/method | Partial disclosure | Full author, method, definitions, and limitations |
| Independence | Direct sales pitch | Mixed commercial interest | Independent or clearly separated analysis |
| Relevance | Tangential | Generally applicable | Directly answers the claim |
| Originality | Repeats another source | Adds interpretation | Original policy, data, or experiment |
| Citation quality | No citations | Some useful citations | Direct primary citations |
| Reproducibility | Cannot be checked | Partially repeatable | Fully testable or inspectable |
| Commercial bias | Hidden or severe | Disclosed | Minimal or explicitly controlled |

## Classification thresholds

Calculate the mean score, but do not let a high average override a critical defect such as fabrication.

- **4.5–5.0:** Primary / exceptionally strong
- **3.8–4.49:** Strong secondary
- **3.0–3.79:** Acceptable with verification
- **2.0–2.99:** Weak
- **Below 2.0:** Unusable

## Mandatory flags

- Affiliate relationship
- Vendor-funded study
- Agency lead-generation content
- Undisclosed sample
- Undisclosed methodology
- Small sample
- Selection bias
- Correlation presented as causation
- Outdated algorithm claim
- Search-result screenshot without reproducible query context
- Anecdote presented as universal
- Unsupported traffic or ranking claim
- Changed product documentation
- Content generated or summarized without source links

---

# 9. Verification Rules

## 9.1 Required

- Use primary documentation for official search-engine policies.
- Verify causal, ranking, performance, and business-impact claims independently.
- Locate the original source behind statistics.
- Record publication, update, event, and access dates separately.
- Label the search engine and market to which advice applies.
- Label framework applicability.
- Separate raw HTML from rendered HTML.
- Test mobile and desktop.
- Inspect canonical, robots, status codes, and response headers directly.
- Validate structured data with official tools.
- Confirm visible content matches structured data.
- Distinguish Search Console measurement from ranking causes.
- Record conflicts instead of forcing consensus.
- Recheck time-sensitive documentation before publication.
- Use the Google Search Status Dashboard when investigating sudden broad changes.
- Record exact test conditions for SERP observations: date, location, device, language, and personalization state.

## 9.2 Two-source rule

Use at least two independent sources for:

- Causal ranking claims
- Industry-wide prevalence claims
- Performance-impact claims
- Conversion claims
- Algorithm interpretation
- Vendor comparisons
- Broad claims about AI content
- Claims based on case studies

One current primary source may be sufficient for:

- An official policy
- A documented API behavior
- A framework syntax requirement
- A standards requirement
- A product feature definition

## 9.3 Never

- Cite a search snippet as evidence.
- Invent a source, update, statistic, quote, or representative.
- Claim an unannounced algorithm update occurred.
- Treat a vendor authority score as a Google metric.
- Guarantee rankings.
- Guarantee indexing.
- Describe all best practices as ranking factors.
- Treat correlation as causation.
- Use a case study without disclosing its limitations.
- Use AI-generated citations without opening the source.
- Publish fabricated testimonials, customers, certifications, project counts, or performance statistics.
- Create false authors, reviewers, or update dates.
- Mark up content in structured data that is not visible or true.
- Claim a site was penalized without evidence of a manual action, policy issue, or reliable diagnosis.

---

# 10. Search Intent Map

| Intent | Searcher goal | Evidence that satisfies the query |
|---|---|---|
| Informational | Understand how search works or what a term means | Official explanation, definitions, diagrams, examples |
| Diagnostic | Determine why a page or site is underperforming | Search Console data, crawl evidence, rendered-page inspection, logs, status codes |
| Technical | Implement or repair a feature | Current framework docs, code, validation, deployment test |
| Commercial investigation | Compare tools, agencies, or workflows | Transparent feature comparison, pricing date, limitations, independent tests |
| Comparison | Decide between approaches | Shared criteria, tradeoffs, implementation constraints, real use cases |
| Local | Improve local visibility | Google Business Profile guidance, local SERP inspection, location and eligibility context |
| Content strategy | Choose topics and page structures | SERP intent analysis, demand evidence, content inventory, business relevance |
| Algorithm/update | Determine whether systems changed | Official status dashboard, official release history, dated third-party analysis |
| Transactional | Purchase or contact | Accurate service/product details, trust evidence, pricing context, clear conversion path |
| Navigational | Reach a known brand or resource | Correct entity, brand, and page routing |
| Research/verification | Prove or reject an SEO claim | Primary documentation, reproducible tests, independent data |
| Maintenance | Decide what to update, merge, redirect, or delete | Search Console trends, crawl inventory, content accuracy, link and conversion data |

---

# 11. SEO Search Query Library

The following library contains more than 75 reusable searches. Replace bracketed variables.

## 11.1 Official Google documentation

1. `site:developers.google.com/search/docs how Google Search works crawling indexing serving`
2. `site:developers.google.com/search/docs Search Essentials technical requirements`
3. `site:developers.google.com/search/docs JavaScript SEO crawling rendering indexing`
4. `site:developers.google.com/search/docs fix JavaScript SEO problems soft 404`
5. `site:developers.google.com/search/docs canonical duplicate URLs`
6. `site:developers.google.com/search/docs XML sitemap build submit`
7. `site:developers.google.com/search/docs robots.txt Googlebot`
8. `site:developers.google.com/search/docs noindex X-Robots-Tag`
9. `site:developers.google.com/search/docs crawlable links anchor text`
10. `site:developers.google.com/search/docs title links best practices`
11. `site:developers.google.com/search/docs meta description snippets`
12. `site:developers.google.com/search/docs structured data general guidelines`
13. `site:developers.google.com/search/docs structured data [PAGE TYPE]`
14. `site:developers.google.com/search/docs localized versions hreflang`
15. `site:developers.google.com/search/docs URL structure best practices`
16. `site:developers.google.com/search/docs mobile-first indexing`
17. `site:developers.google.com/search/docs Core Web Vitals search results`
18. `site:developers.google.com/search/docs ranking systems guide`
19. `site:developers.google.com/search/docs creating helpful reliable people-first content`
20. `site:developers.google.com/search/docs generative AI content website guidance`
21. `site:developers.google.com/search/docs spam policies scaled content abuse`
22. `site:developers.google.com/search/docs AI Overviews optimization guide`
23. `site:developers.google.com/search/docs site migration redirects`
24. `site:developers.google.com/search/docs soft 404 troubleshooting`
25. `site:developers.google.com/search/docs crawl budget large sites`

**Why useful:** These searches establish current official policy and documented Google behavior before third-party interpretation.

## 11.2 Google Search Console and status

26. `site:support.google.com/webmasters URL Inspection tool`
27. `site:support.google.com/webmasters page indexing report`
28. `site:support.google.com/webmasters performance report Search Console`
29. `site:support.google.com/webmasters sitemap report`
30. `site:status.search.google.com [MONTH YEAR] ranking update`
31. `site:status.search.google.com crawling indexing incident [DATE]`

**Why useful:** These searches support diagnosis, measurement, and date-specific update verification.

## 11.3 Bing and IndexNow

32. `site:bing.com/webmasters/help webmaster guidelines crawling indexing`
33. `site:bing.com/webmasters/help URL submission sitemap`
34. `site:bing.com/webmasters/help why site not in index`
35. `site:bing.com/webmasters/help robots.txt redirects 404`
36. `site:indexnow.org documentation URL submission`
37. `site:indexnow.org FAQ implementation errors`

**Why useful:** Google-specific guidance must not automatically be presented as universal. These searches establish Bing-specific processes.

## 11.4 Standards and structured data

38. `site:schema.org [TYPE] properties`
39. `site:schema.org/docs JSON-LD getting started`
40. `site:w3.org/WAI/WCAG22 headings labels`
41. `site:w3.org/WAI/WCAG22 text alternatives images`
42. `site:w3.org/WAI/WCAG22 keyboard focus navigation`
43. `site:web.dev Core Web Vitals thresholds LCP INP CLS`
44. `site:web.dev optimize LCP hero image`
45. `site:web.dev optimize CLS image dimensions`
46. `site:web.dev lazy loading images LCP`

**Why useful:** These sources distinguish search-engine feature rules from broader web, accessibility, and performance standards.

## 11.5 Framework-specific implementation

47. `site:nextjs.org/docs generateMetadata canonical alternates`
48. `site:nextjs.org/docs app sitemap robots metadata files`
49. `site:nextjs.org/docs structured data JSON-LD`
50. `site:vite.dev guide SSR React`
51. `site:react.dev hydrateRoot server rendered HTML`
52. `[FRAMEWORK] official documentation metadata sitemap robots`
53. `[FRAMEWORK] official documentation static generation SSR`
54. `[FRAMEWORK] official documentation redirect status code`

**Why useful:** Generic SEO advice is insufficient when the failure is caused by framework behavior.

## 11.6 Vibe-coded and AI-built site diagnostics

55. `"AI built website" SEO audit`
56. `"vibe-coded site" SEO`
57. `"AI-generated website" duplicate metadata`
58. `"AI-generated landing page" thin content`
59. `React SPA content missing rendered HTML SEO`
60. `Vite SPA page not indexed`
61. `generated routes duplicate canonical`
62. `AI coding agent robots.txt noindex mistake`
63. `AI generated structured data hallucinated reviews`
64. `AI website placeholder content production`
65. `AI generated location pages duplicate content`
66. `hydration error metadata SEO`
67. `client-side routing soft 404 SEO`
68. `AI generated website accessibility audit`
69. `AI website oversized images Core Web Vitals`
70. `generated sitemap missing dynamic routes`

**Why useful:** These searches identify recurring practitioner failures. They are hypothesis-generating searches, not primary evidence.

## 11.7 Ranking and myth verification

71. `"one H1" SEO Google official`
72. `"five internal links" SEO evidence`
73. `"publishing frequency" Google ranking factor`
74. `"meta description" ranking factor Google`
75. `"structured data" ranking factor Google`
76. `"domain authority" Google metric`
77. `"word count" Google preferred SEO`
78. `"brand searches" ranking factor Google`
79. `"request indexing" every new page`
80. `"Core Web Vitals" ranking impact Google`
81. `"accessibility" direct ranking factor Google`
82. `"AI content" automatic penalty Google`

**Why useful:** These queries test common statements before they are converted into rules.

## 11.8 Search-pattern and content-opportunity research

83. `[PRODUCT A] vs [PRODUCT B]`
84. `best [SERVICE] for [INDUSTRY]`
85. `[SERVICE PROVIDER] in [CITY]`
86. `[SOFTWARE] alternatives`
87. `how to solve [SPECIFIC PROBLEM]`
88. `[SERVICE] cost for [CUSTOMER TYPE]`
89. `[SERVICE] checklist`
90. `[SERVICE] mistakes`
91. `[SERVICE] requirements [LOCATION]`
92. `[PROBLEM] troubleshooting`
93. `[PRODUCT] compatibility with [SYSTEM]`
94. `[INDUSTRY] compliance guide`
95. `[SERVICE] case study [INDUSTRY]`
96. `[KEYWORD] statistics original source`
97. `[KEYWORD] site:.gov`
98. `[KEYWORD] site:.edu`
99. `[KEYWORD] filetype:pdf`
100. `[KEYWORD] site:developers.google.com`
101. `[KEYWORD] site:w3.org`
102. `[KEYWORD] site:github.com issue`
103. `[KEYWORD] before after test`
104. `[KEYWORD] methodology dataset`

**Why useful:** These searches identify recurring intent patterns, original sources, implementation evidence, and content gaps.

---

# 12. SERP and Competitor Research Procedure

For every target keyword or pattern:

1. Record query, date, location, language, device, and signed-in state.
2. Capture the result types:
   - Organic listings
   - Local pack
   - AI Overview
   - Featured snippet
   - People Also Ask
   - Images
   - Video
   - Forums
   - Shopping/product results
   - Tools/calculators
3. Classify dominant intent.
4. Record the page types ranking.
5. Identify recurring entities and subtopics.
6. Review titles and snippets without copying them.
7. Open the highest-relevance results.
8. Record evidence quality and source types.
9. Note author identity, update dates, citations, and firsthand evidence.
10. Inspect content format and conversion path.
11. Inspect raw and rendered HTML where technically relevant.
12. Review page performance and mobile behavior.
13. Record gaps that can be filled honestly.
14. Decide whether the keyword deserves:
   - A new page
   - An update to an existing page
   - A merged page
   - A tool
   - A comparison
   - A local page
   - No page

## SERP analysis table

| Result | Page type | Dominant intent | Main topics | Evidence quality | Strengths | Weaknesses | Content gap |
|---|---|---|---|---|---|---|---|
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |

Do not copy competitor wording or heading structures. Use the analysis to create a more accurate, current, sourced, usable, and original answer.

---

# 13. Keyword Pattern Evaluation

A search pattern is a repeatable query structure. It is not automatically permission to generate every possible variation.

## Candidate patterns

- `[Product A] vs [Product B]`
- `Best [service] for [industry]`
- `[service provider] in [city]`
- `[software] alternatives`
- `How to solve [specific problem]`
- `[service] cost for [customer type]`
- `[product] compatibility with [system]`
- `[service] requirements in [jurisdiction]`
- `[problem] troubleshooting by [device or framework]`

## Pattern approval test

A pattern may be approved only when:

- The intent genuinely repeats.
- Each entity or location changes the answer materially.
- Search demand or business demand is demonstrated.
- The business has relevant expertise.
- The page can contain unique data, examples, constraints, or recommendations.
- The pages will not function only as search-entry doorways.
- The pages can be internally linked through a logical hierarchy.
- The page set can be maintained.
- The first page has been built and reviewed manually.
- The generation system prevents unsupported claims and duplication.

## Pattern rejection conditions

Reject or consolidate when:

- Only the keyword changes.
- The answer is substantially identical.
- The location has no meaningful local information.
- The business does not actually serve the location or audience.
- The page exists only to capture a query and route users elsewhere.
- The content is generated from competitors without original value.
- There is no maintenance owner.
- The data source is unreliable.
- The generated output invents prices, laws, availability, reviews, or statistics.

---

# 14. Vibe-Coded Website Failure Taxonomy

## 14.1 Discovery, crawling, and indexability

| Failure | Why it happens | Primary impact | Detection | Repair | Evidence level |
|---|---|---|---|---|---|
| Important page absent from internal links | Agent creates route but not navigation or contextual links | Discovery, internal signals, UX | Crawl from homepage; compare routes, sitemap, analytics, GSC | Add relevant crawlable links from logical hubs and related pages | Official + tool-supported |
| Missing sitemap | CMS feature was lost in code migration | Discovery/monitoring | Request `/sitemap.xml`; inspect robots; GSC/Bing reports | Generate canonical indexable URL list automatically | Official |
| Stale sitemap | Publishing flow does not update generated files | Discovery/monitoring | Compare live routes and last modified data | Generate at build or request time from source of truth | Official + framework-specific |
| Noncanonical URLs in sitemap | Agent dumps all routes or parameters | Canonical confusion, crawl inefficiency | Compare sitemap with canonicals and status codes | Include only preferred, indexable, 200 URLs | Official |
| Accidental robots block | Copied staging rules or generated broad disallow | Crawling/rendering | Test robots; GSC live test; server logs | Narrow rules and retest | Official |
| Accidental `noindex` | Staging tag persists in production | Indexing | Inspect raw HTML and headers | Remove directive and request recrawl where appropriate | Official |
| `noindex` hidden behind robots block | Agent uses both controls without understanding | Directive may not be seen | Inspect robots and page headers | Permit crawl if crawler must process `noindex` | Official |
| Client-side-only links | Click handlers or non-anchor elements | Discovery and accessibility | Inspect DOM and raw HTML; disable JS | Use crawlable `<a href>` links | Official |
| Soft 404 routes | SPA returns 200 shell for nonexistent content | Index quality and UX | Test random route; inspect status and rendered content | Return real 404/410 or appropriate redirect | Official |
| Duplicate route generation | Dynamic parameters create multiple URL forms | Duplicate inventory, crawl waste | Full crawl, route inventory, logs | Normalize routing, redirect duplicates, canonicalize valid variants | Official + technical |
| Broken redirects | Generated config loops, chains, or targets missing pages | Crawling, signals, UX | Crawl redirects; test headers | Use direct permanent redirects for permanent moves | Official |
| Orphan legacy pages | Redesign removes links but leaves URLs live | Discovery, stale content, poor internal flow | Combine crawl with sitemap, GSC, analytics | Link, redirect, merge, update, or remove | Strong secondary + official principles |

## 14.2 Rendering and JavaScript

| Failure | Why it happens | Primary impact | Detection | Repair | Evidence level |
|---|---|---|---|---|---|
| Empty initial HTML | SPA shell contains no meaningful content | Rendering dependency and delayed processing | View source; compare rendered DOM | Pre-render or server-render important public pages | Official behavior + risk inference |
| Content loaded after failed API call | Agent assumes API always succeeds | Missing main content, soft 404 | Rendered crawl, network errors, logs | Server fallback, error status, resilient data fetching | Technical |
| Blocked JS/CSS resources | Robots or CDN rules block required files | Rendering and UX | URL Inspection rendered output; network panel | Unblock required public resources | Official |
| Metadata inserted inconsistently by JS | Route state or hydration changes head values | Search presentation/canonical conflict | Compare raw/rendered title, canonical, robots | Generate stable metadata server-side or at build time | Official + framework |
| Hydration mismatch | Server and client output differ | Broken UI, overwritten content | Console, framework logs, DOM comparison | Make server/client output deterministic | Framework-specific |
| Client-side soft 404 | Missing item renders “not found” with 200 | Index quality | Test deleted IDs and invalid routes | Return 404 server response or proper noindex/error handling | Official |
| JavaScript redirect misuse | Agent uses location changes instead of server redirects | Slower processing and inconsistent signals | Header inspection and rendered behavior | Use server-side 3xx where possible | Official |
| Infinite route/facet generation | Generated filters produce crawlable combinations | Crawl inventory explosion | Crawl parameters; logs; GSC pages | Restrict crawl paths, canonicalize, noindex or redesign facets | Official/conditional |

## 14.3 On-page metadata and structure

| Failure | Why it happens | Primary impact | Detection | Repair | Evidence level |
|---|---|---|---|---|---|
| Missing title | Component omits metadata | Search presentation and understanding | Crawl `<title>` | Generate descriptive title | Official |
| Duplicate titles | Shared template uses static value | Search presentation and ambiguity | Site crawl duplicate report | Generate route-specific title from validated data | Official |
| Inaccurate title | Keyword template does not match page | Search presentation and trust | Compare title with visible main topic | Rewrite accurately | Official |
| Missing meta description | No metadata system | Snippet influence/CTR opportunity | Crawl head | Add concise page-specific description when useful | Strong recommendation |
| Duplicate meta descriptions | Global template | Weak snippet differentiation | Crawl duplicate report | Generate truthful page-specific descriptions | Strong recommendation |
| Competing prominent headings | Generated hero and section titles share equal prominence | Ambiguous visual hierarchy and accessibility | Visual/DOM review | Establish one clear primary page title and logical sections | Official title guidance + WCAG |
| Heading levels used for styling | Component library chooses tags visually | Accessibility and content structure | Accessibility tree and DOM audit | Separate semantic level from CSS styling | W3C |
| Placeholder text | Agent leaves lorem ipsum, TODOs, generic copy | Trust, quality, conversion | Text scan and human review | Block deployment on placeholder patterns | Direct quality control |
| Unsupported claims | AI invents metrics or credentials | Trust, legal, content quality | Claim-source audit | Require citations or remove | Official AI-content guidance + governance |
| Fabricated update dates | Agent marks content fresh without substantive update | Trust and policy risk | Git/content diff | Update dates only after meaningful revision | Official people-first guidance |
| Keyword stuffing | Agent repeats target phrase mechanically | Readability and spam risk | Human review and term distribution | Write naturally around user task and entities | Official Search Essentials |
| Generic image alt text | Agent outputs filenames or keyword lists | Accessibility and image understanding | Accessibility crawl | Describe meaningful image purpose; empty alt for decoration | W3C + Google Images |
| Incorrect Open Graph data | Shared metadata points to wrong title/image | Social presentation | Social debugger/head crawl | Generate route-specific OG fields | Platform/social; not direct ordinary ranking rule |

## 14.4 Canonicalization, language, and structured data

| Failure | Why it happens | Primary impact | Detection | Repair | Evidence level |
|---|---|---|---|---|---|
| Canonical points to wrong page | Copied template or bad base URL | Canonical selection and indexing | Inspect raw/rendered canonical | Generate absolute correct canonical | Official |
| Canonical changes after hydration | Client state overwrites server head | Conflicting signals | Raw/rendered comparison | Keep canonical stable in initial HTML | Official |
| Every location page canonicalized to one page | Agent treats unique service pages as duplicates | Pages excluded or consolidated | Crawl canonicals and GSC | Self-canonicalize genuinely distinct pages; merge duplicates | Official + content judgment |
| `hreflang` missing on real alternates | Translation pipeline omits annotations | Wrong regional/language result | International crawl | Add reciprocal fully qualified annotations | Official/conditional |
| Broken reciprocal `hreflang` | Agent creates one-way mappings | Annotation ignored or weakened | Hreflang validator/crawl | Generate from shared locale map | Official |
| Schema type does not match page | Agent chooses popular rich-result type | Eligibility/policy | Rich Results Test + visible content check | Use only applicable supported type | Official |
| Fabricated reviews or ratings in schema | AI fills required-looking fields | Spam/manual-action risk | Compare markup with visible verified data | Remove fabricated fields | Official |
| Schema only exists client-side and fails | Runtime script error | Lost eligibility | Rendered structured-data test | Include stable JSON-LD in server/static output | Official + reliability |
| Valid Schema.org type unsupported by Google | Vocabulary confused with search feature support | No expected search enhancement | Compare Schema.org and Google gallery | Keep only if useful; do not promise rich result | Official |

## 14.5 Content and programmatic generation

| Failure | Why it happens | Primary impact | Detection | Repair | Evidence level |
|---|---|---|---|---|---|
| Thin service pages | Agent uses short generic blurbs | Weak intent satisfaction | SERP/content comparison | Add scope, process, evidence, exclusions, FAQs, next steps | Official quality guidance |
| Duplicate city pages | Template swaps city names | Low originality/doorway risk | Similarity scan | Add real local service details or consolidate | Official spam principles |
| Comparison pages without firsthand analysis | Agent paraphrases vendor sites | Commodity content | Source and originality review | Add testing, criteria, screenshots, limitations | Official people-first guidance |
| Scaled pages with no demand | Pattern generation precedes research | Index bloat and low value | Search demand/SERP/business review | Approve pattern and first page before scale | Policy + strategy |
| Translation without localization | Machine translation preserves irrelevant context | Poor usefulness and regional targeting | Native review and locale checks | Localize examples, terms, contact and legal details | Official international guidance + human review |
| AI hallucinations | Model fills missing facts | Trust, legal, accuracy | Claim-level verification | Require source-backed fields and human review | Official AI-content guidance |
| No update process | Generated pages become stale | Accuracy and trust | Content inventory and review dates | Assign review triggers and owners | Official quality guidance |
| Search-first content with no audience fit | Pages target keywords unrelated to real business expertise | Weak trust and relevance | Business alignment review | Require direct audience and service connection | Official people-first guidance |

## 14.6 Performance, accessibility, and conversion

| Failure | Why it happens | Primary impact | Detection | Repair | Evidence level |
|---|---|---|---|---|---|
| Oversized hero image/video | Visual prompt prioritizes appearance | LCP, bandwidth, conversion | PSI, Lighthouse, network trace, CrUX | Compress, resize, preload carefully, poster image, adaptive delivery | web.dev |
| Lazy-loaded LCP image | Generic component lazy-loads all images | LCP | Lighthouse and markup | Load likely LCP image eagerly; prioritize appropriately | web.dev |
| Missing media dimensions | Generated components omit width/height | CLS | Lighthouse/layout-shift trace | Reserve aspect ratio/size | web.dev |
| Excessive client JavaScript | Agent installs unnecessary libraries | INP, load, reliability | Bundle analyzer, performance trace | Remove/defer/split noncritical code | web.dev/technical |
| Web fonts block rendering | Generated design loads many variants | LCP/CLS | Network and performance trace | Subset, preload selectively, use fallback metrics | web.dev |
| Animation blocks interaction | Prompt adds scroll effects everywhere | UX, accessibility, INP | Device testing, performance trace | Reduce, defer, respect reduced motion | W3C/UX |
| Buttons lack accessible names | Icon-only generated UI | Accessibility/conversion | Accessibility tree | Add programmatic and visible labels where appropriate | W3C |
| Forms not tested | Agent builds UI but no end-to-end delivery | Conversion/data loss | Submit tests and logs | Validate success, errors, notifications, storage | Conversion requirement |
| Missing analytics | Deployment focuses only on visuals | No measurement | Network/debug view | Install consent-compliant analytics | Measurement, not ranking |
| Missing conversion events | Pageviews tracked but leads are not | No business evaluation | Analytics event audit | Track validated form, call, booking, purchase actions | Measurement |
| Search Console not connected | Launch checklist omitted | Limited diagnosis | Ownership check | Verify property and submit sitemap | Measurement, not ranking |
| Bing Webmaster Tools not connected | Google-only workflow | Limited Bing diagnosis | Ownership check | Verify and configure sitemap/IndexNow as appropriate | Measurement |

---

# 15. Evidence Findings Table

| Claim | Classification | Finding | Status | Implementation consequence | Primary sources |
|---|---|---|---|---|---|
| Google Search operates through crawling, indexing, and serving stages | Documented search behavior | Officially documented | Verified | Diagnose stages separately | S1 |
| Following requirements does not guarantee crawl, index, or ranking | Official statement | Google explicitly does not guarantee inclusion | Verified | Never promise indexing or rankings | S1 |
| Important links should be crawlable anchors with descriptive text | Technical best practice | Official Google guidance | Verified | Use `<a href>` and descriptive concise anchors | S2, S9 |
| Every page should have a descriptive title | Strong recommendation | Google says every page should specify a title | Verified | Block deployment for missing titles | S10 |
| Every page must have a unique meta description | Strong recommendation, not universal requirement | Unique descriptions help result identification; Google may generate snippets | Partially verified | Require where useful; do not call direct ranking factor | S4, S3 |
| Every page must contain exactly one H1 | Internal convention, not official universal rule | Clear primary heading is useful; no confirmed one-H1 ranking rule | Unverified as absolute | Use one clear primary title by convention, allow justified exceptions | S10, S18 |
| Every new page needs five internal links | Unsupported fixed rule | Official guidance supports relevant internal links but no fixed count | Rejected as absolute | Link based on user journey and architecture | S9, S6 |
| Exact-match anchors should always be used | Overstated practice | Anchors should be descriptive, concise, relevant, and natural | Rejected as absolute | Avoid mechanical repetition and stuffing | S9 |
| Sitemap submission guarantees indexing | False claim | Google states sitemap submission is a hint | Rejected | Use sitemap plus crawlable links and quality | S7 |
| Sitemap should be updated when canonical indexable URLs change | Technical best practice | Sitemaps communicate important new/updated URLs | Verified | Automate generation from source of truth | S7, S22 |
| Canonicals are mandatory on every page | Overstated | Canonicals are useful for duplicates; Google can select without declared canonical | Conditional | Use consistent canonical strategy, especially for duplicates | S6 |
| A declared canonical is always obeyed | False claim | Canonical is a preference signal; Google may select another | Rejected | Inspect Google-selected canonical and conflicting signals | S6, S33 |
| `noindex` in robots.txt is valid for Google | False claim | Google does not support `noindex` in robots.txt | Rejected | Use meta robots or X-Robots-Tag | S8 |
| A robots block prevents a URL from ever appearing in search | False claim | Blocking crawling does not necessarily prevent URL-only appearance | Rejected | Use `noindex` on crawlable page or access control | S8 |
| Google can render JavaScript | Documented behavior | Google uses Chromium rendering and a rendering queue | Verified | JS sites can be indexed but require rendering tests | S4 |
| Empty initial HTML always prevents indexing | Overstated | Google can render JS; failure is not automatic | Rejected as absolute | Prefer SSR/SSG for reliability, but test actual output | S4, S28, S29 |
| Initial HTML is safer for critical metadata and content | Technical reliability recommendation | Google advises clarity for canonicals; JS adds rendering risk | Strongly supported inference | Generate stable critical content/metadata in initial output | S4, S6, S30 |
| Structured data directly raises rankings | Unsupported causal claim | Official docs describe eligibility for rich results, not a general ranking boost | Unverified/rejected as direct claim | Implement only applicable accurate markup | S11 |
| Structured data must match visible content | Eligibility/policy requirement | Official quality guideline | Verified | Validate data against rendered page | S11 |
| `hreflang` is required for every site | False universal claim | Applies to language or regional alternatives | Rejected as universal | Implement only when alternate versions exist | S20 |
| AI-generated content is automatically penalized | False claim | Google evaluates value and policy compliance, not AI use alone | Rejected | Require accuracy, originality, purpose, and review | S14, S13 |
| Scaled low-value AI pages can violate spam policy | Official policy | Explicitly documented | Verified | Prevent mass generation without added value | S12, S14 |
| Google has a preferred word count | False claim | Google explicitly says it does not | Rejected | Write to satisfy the task, not a number | S13 |
| Publishing one page per day is a confirmed safe ranking cadence | Unsupported claim | No primary evidence found | Unverified | Set cadence by quality and operations, not claimed ranking signal | S13, S12 |
| Publishing volatility is a confirmed negative signal | Unsupported causal claim | No direct primary confirmation found | Unverified | Avoid operationally reckless bursts, but do not claim penalty | S12 |
| Request indexing after every publish is required | Unsupported workflow rule | URL Inspection supports requests, but ordinary discovery is automated | Rejected as mandatory | Use sitemaps/internal links; request selectively for diagnostics or priority updates | S1, S33 |
| Links remain part of Google ranking systems | Ranking-system statement | PageRank and link analysis remain part of core systems | Verified | Earn relevant links; avoid schemes | S15 |
| Domain Authority is a Google ranking metric | False claim | It is a third-party proprietary metric | Rejected | Label vendor metrics and use comparatively only | Vendor definitions + absence from official systems |
| Core Web Vitals have recommended thresholds | Official performance guidance | LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at 75th percentile | Verified | Measure field and lab data; prioritize user impact | S16, S17 |
| Passing Core Web Vitals guarantees higher rankings | False claim | Page experience is one part of broader systems | Rejected | Improve performance without promising rank movement | S16 |
| Accessibility is a confirmed direct ranking factor | Unsupported direct claim | Accessibility is a web and usability requirement; direct ranking claim not established | Unverified as direct factor | Enforce accessibility independently | S18, S19 |
| Open Graph tags are required for Google ranking | Unsupported | Primarily control social/web-share presentation | Rejected | Implement for sharing quality, not as ordinary ranking claim | Framework/platform docs |
| Search Console installation improves rankings | False causal claim | It provides measurement and diagnostics | Rejected | Connect for monitoring, not ranking credit | S33 |
| Local results use relevance, distance, and popularity/prominence | Official local ranking statement | Official Google Business Profile guidance | Verified | Optimize accurate profile, relevance, reputation, and location reality | S21 |
| IndexNow guarantees Bing indexing | False claim | It notifies participating engines of changes | Rejected | Use as discovery notification, not guarantee | S23 |
| Schema.org and Google rich-result support are identical | False claim | Schema.org vocabulary is broader | Rejected | Check both Schema.org validity and Google feature support | S11, S24 |
| Vite is inherently bad for SEO | False universal claim | Vite supports static builds and SSR; implementation determines output | Rejected | Choose rendering based on page need and test it | S28 |
| Server rendering automatically creates high rankings | False causal claim | It improves initial delivery but does not create relevance or authority | Rejected | Use for reliability, then address content and competition | S4, S15 |

---

# 16. Candidate Rules for the Future `/SEO-GUIDELINES.md`

These are research-backed candidate rules. They should be tailored to the project before becoming enforceable.

## 16.1 Indexability and deployment

### REQUIRED — Production pages must not inherit staging controls

- No unintended `noindex`
- No production-wide robots disallow
- No password or firewall block on intended public pages
- Canonical hostname and protocol must resolve consistently
- Intended public pages must return appropriate HTTP status codes

**Verification:** Crawl production, inspect raw headers and HTML, run URL Inspection, test random invalid routes.

### REQUIRED — Missing pages must not return a successful content response

Invalid or deleted routes must return:

- `404` when not found
- `410` when intentionally gone and appropriate
- A direct redirect when a clear replacement exists

Do not render a “not found” message with `200`.

### STRONG RECOMMENDATION — Maintain an automatically generated sitemap

The sitemap should:

- Use absolute URLs
- Contain canonical URLs
- Contain intended indexable pages
- Exclude redirects, errors, private pages, and duplicates
- Update when the URL inventory changes
- Be referenced in robots.txt where appropriate
- Be submitted to Google Search Console and Bing Webmaster Tools

### STRONG RECOMMENDATION — Important pages must be internally discoverable

Important pages must be reachable through crawlable links from:

- Navigation
- Category/hub pages
- Related content
- Relevant service or product pages

No fixed link count is required.

## 16.2 Metadata

### REQUIRED — Every indexable HTML page must have a nonempty descriptive title

The title must:

- Match the visible page topic
- Avoid placeholders
- Avoid duplicate route templates
- Avoid unsupported superlatives or claims
- Use a stable route-specific value

### STRONG RECOMMENDATION — Important pages should have unique useful meta descriptions

Descriptions should:

- Accurately summarize the page
- Support click decisions
- Avoid repeating one global template
- Avoid fabricated claims
- Accept that search engines may generate a different snippet

### STRONG RECOMMENDATION — Use one clear primary visible page title

One H1 is the default internal convention because it simplifies design, accessibility, and content review. It is not described as a universal Google ranking requirement.

## 16.3 Canonicals and duplicate control

### CONDITIONAL — Use canonicals when duplicate or near-duplicate URLs exist

- Use absolute canonical URLs.
- Keep canonical values stable between raw and rendered HTML.
- Link internally to preferred canonical URLs.
- Include preferred URLs in the sitemap.
- Do not canonicalize genuinely distinct local or language pages to a generic page solely to simplify management.

## 16.4 JavaScript and rendering

### STRONG RECOMMENDATION — Deliver critical public content in initial HTML

For high-value search pages, initial output should preferably contain:

- Page title
- Main heading
- Primary copy
- Crawlable internal links
- Canonical
- Robots directives
- Applicable structured data

Client rendering is permitted, but the release must be tested using rendered crawling and search-engine inspection tools.

### REQUIRED — Route errors and API failures must produce accurate page states

An API failure must not produce:

- Empty “successful” pages
- Generic placeholder text
- Incorrect canonical
- Fabricated fallback data
- Indexable error states

## 16.5 Content and AI

### REQUIRED — Claims must be source-backed or demonstrably firsthand

The system must not invent:

- Statistics
- Customers
- Projects
- Reviews
- Certifications
- Prices
- Laws
- Quotes
- Performance results
- Author credentials
- Dates
- Locations served

### AVOID — Scaled generation without distinct value

Do not generate a page set until:

- The search pattern is approved.
- The first page is manually completed.
- Distinct data requirements are defined.
- Similarity thresholds are established.
- Human review depth is assigned.
- A maintenance owner exists.

### HUMAN REVIEW REQUIRED — High-impact pages

Require review for:

- Homepage
- Main service pages
- Pricing
- Product pages
- Paid landing pages
- Location pages
- Comparison pages
- Legal, financial, medical, safety, or regulated claims
- Pages containing statistics
- Pages generated from external datasets

## 16.6 Internal linking

### STRONG RECOMMENDATION — Use descriptive and natural anchors

Anchor text should indicate destination context. Do not enforce exact-match repetition or a fixed number of links.

### STRONG RECOMMENDATION — Add links in both directions where useful

When publishing a new page:

- Link from the new page to supporting pages.
- Identify older related pages that should link to the new page.
- Avoid forcing irrelevant links.
- Preserve user flow and topical architecture.

## 16.7 Structured data

### CONDITIONAL — Add structured data only when an applicable type exists

- Use a supported type appropriate to visible content.
- Include only true data.
- Validate syntax.
- Validate feature eligibility.
- Do not promise a rich result.
- Do not add fake ratings, reviews, prices, availability, or FAQs.

## 16.8 International

### CONDITIONAL — Use `hreflang` only for alternate language or regional URLs

- Use separate URLs.
- Use reciprocal annotations.
- Include self-reference.
- Use fully qualified URLs.
- Keep canonicals language-consistent.
- Require native or qualified language review for important pages.

## 16.9 Performance

### STRONG RECOMMENDATION — Measure real user performance

Target at the 75th percentile:

- LCP ≤ 2.5 seconds
- INP ≤ 200 milliseconds
- CLS ≤ 0.1

These are user-experience targets, not ranking guarantees.

### REQUIRED — Prevent avoidable media regressions

- Do not lazy-load the likely LCP image.
- Reserve image and video dimensions.
- Compress and resize media.
- Use appropriate formats.
- Do not autoplay heavy background video without performance review.
- Defer noncritical scripts.
- Test mobile network and device conditions.

## 16.10 Accessibility and conversion

### REQUIRED — Interactive controls need accessible names and keyboard operation

### REQUIRED — Forms must be tested end to end

### REQUIRED — Analytics and conversion events must be validated when measurement is in scope

These are project quality requirements. Do not label them direct ranking factors without evidence.

---

# 17. Framework Implementation Notes

## 17.1 Next.js

Use current official Metadata APIs and metadata file conventions.

Verify:

- Route-specific `metadata` or `generateMetadata`
- `metadataBase`
- Canonical and language alternates
- Open Graph and social metadata
- `app/sitemap.ts` or appropriate sitemap files
- `app/robots.ts`
- Correct `not-found` behavior
- Redirect status and target
- Static versus dynamic rendering behavior
- JSON-LD output
- Cache behavior for metadata routes
- Production base URLs

Do not copy framework examples without replacing placeholder domains.

## 17.2 React with Vite

Vite is a build tool and can support static client applications or SSR integrations. A default SPA can produce one HTML shell and client-rendered routes.

For public search pages:

- Decide whether to prerender, use SSR, or retain CSR based on page importance and data behavior.
- Test direct navigation to every route.
- Ensure hosting rewrites do not turn missing URLs into indexable 200 pages.
- Compare raw and rendered HTML.
- Generate route-specific metadata reliably.
- Verify canonical and robots output.
- Ensure crawlable links exist without click-handler-only navigation.
- Test hydration and API-failure states.
- Generate sitemap from the route/content source of truth.

## 17.3 CMS migrations

Before replacing a CMS, inventory the functions it handled:

- Sitemap generation
- Canonicals
- Metadata
- Redirects
- RSS feeds
- Author data
- Structured data
- Pagination
- Category archives
- Image optimization
- Scheduled publishing
- Revision history
- Search Console verification
- Analytics
- Forms
- Broken-link handling

The migration is incomplete until equivalent functions are intentionally retained, replaced, or rejected.

---

# 18. Content Gap Analysis

Score each gap from 1–5 on:

- Search demand
- Audience value
- Business value
- Evidence availability
- Competition opportunity
- Difficulty
- Originality
- Firsthand-experience potential
- Maintenance cost
- Conversion relevance

## Common high-value gaps

- Outdated guidance that ignores current policies
- Claims without primary citations
- No distinction between crawling, indexing, and ranking
- No framework-specific repair steps
- No raw-versus-rendered comparison
- No diagnostic workflow
- No examples of incorrect and corrected code
- No local or industry context
- No accessibility review
- No conversion measurement
- No risk disclosure
- No maintenance process
- No firsthand audit data
- No screenshots, diagrams, or validation outputs
- No explanation for why a tactic may not apply

## Gap decision

- **Create:** Strong demand and distinct value
- **Update:** Existing page can satisfy intent
- **Merge:** Multiple weak pages overlap
- **Tool:** Query is better answered interactively
- **Case study:** Firsthand evidence is the primary gap
- **Reject:** No useful distinct answer or business relevance

---

# 19. Original Research Opportunities

## 19.1 Low-cost research

- Audit 25–100 publicly accessible AI-built sites.
- Compare raw and rendered titles, canonicals, robots, links, and word counts.
- Measure status-code accuracy for invalid SPA routes.
- Test sitemap completeness against crawl-discovered URLs.
- Count duplicate titles and descriptions.
- Validate structured data and visible-content alignment.
- Record Core Web Vitals lab results.
- Test keyboard navigation and accessible names.
- Compare generated page similarity.
- Catalog placeholder and unsupported claim patterns.

## 19.2 Requires client or site-owner access

- Review Search Console indexing and performance.
- Compare crawl inventory with analytics landing pages.
- Inspect server logs for crawler behavior.
- Review manual actions and security issues.
- Compare conversion events before and after repairs.
- Validate lead quality from programmatic pages.
- Review content maintenance history.
- Inspect backlinks and lost links.

## 19.3 Requires analytics data

- Measure click-through changes after title revisions.
- Measure lead conversion after page-speed improvements.
- Compare organic landing-page engagement by rendering model.
- Track indexed-to-submitted URL ratios.
- Track impressions for manually edited versus unreviewed AI pages.
- Compare branded and nonbranded demand over time.

## 19.4 Requires developer resources

- Implement SSR or prerendering test branches.
- Build automated metadata tests.
- Build route/sitemap consistency checks.
- Build structured-data snapshot tests.
- Build link-graph analysis.
- Build content-similarity gates.
- Build deployment checks for robots and `noindex`.
- Build Lighthouse/CrUX monitoring.
- Build screenshot and rendered-DOM diffs.

## 19.5 Requires long-term measurement

- Indexation rate by page cohort
- Ranking and traffic by content-review depth
- Link acquisition by original-research format
- Conversion by page template
- Performance stability by release
- Decay and recovery after content updates
- Effect of merging duplicate location pages
- Effect of adding relevant internal links to orphan pages

---

# 20. Research Outline Template

For each planned research section:

```md
## [Section title]

**Objective:**  
**Primary search intent:**  
**Audience:**  
**Questions to answer:**  
**Claims requiring verification:**  
**Primary evidence required:**  
**Secondary evidence allowed:**  
**Framework applicability:**  
**Examples needed:**  
**Visuals needed:**  
**Technical checks:**  
**Known limitations:**  
**Suggested internal links:**  
**Suggested external citations:**  
**Human reviewer:**  
**Verification status:**  
```

---

# 21. Evidence Table Template

| Claim or question | Source | Source type | Publication date | Last updated | Accessed | Evidence | Reliability score | Claim class | Search engine | Framework | SEO stage | Verification status | Limitations | Notes |
|---|---|---|---|---|---|---|---:|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  | Unverified |  |  |

Allowed statuses:

- Verified
- Partially verified
- Conflicting evidence
- Outdated
- Unverified
- Rejected

---

# 22. Vibe-Coded Website Audit Checklist

## Search accessibility

- [ ] Intended public pages return `200`
- [ ] Removed pages return `404`, `410`, or a justified redirect
- [ ] No indexable soft 404 routes
- [ ] Production robots.txt is reviewed
- [ ] No unintended `noindex`
- [ ] X-Robots-Tag headers are reviewed
- [ ] Canonical tags are correct
- [ ] Canonicals are stable before and after rendering
- [ ] XML sitemap exists where useful
- [ ] Sitemap contains canonical indexable URLs
- [ ] Sitemap excludes redirects and errors
- [ ] Important pages are internally linked
- [ ] Links use crawlable anchors
- [ ] JavaScript and CSS required for rendering are accessible
- [ ] Raw and rendered HTML have been compared
- [ ] Invalid routes have been tested
- [ ] Redirect chains and loops are absent
- [ ] Duplicate parameter routes are controlled
- [ ] Pagination and facets are intentionally handled

## Page structure

- [ ] Each indexable page has a descriptive title
- [ ] Important pages have useful meta descriptions
- [ ] No duplicate metadata caused by templates
- [ ] One clear primary visible page title
- [ ] Logical heading hierarchy
- [ ] Descriptive URLs
- [ ] Breadcrumbs where hierarchy benefits users
- [ ] Relevant internal links
- [ ] Natural descriptive anchor text
- [ ] Meaningful images have appropriate alt text
- [ ] Decorative images use empty alt where appropriate
- [ ] Navigation is keyboard accessible
- [ ] Icon buttons have accessible names

## Content quality

- [ ] Content matches search intent
- [ ] Content serves the real business audience
- [ ] Claims are supported
- [ ] Statistics trace to original sources
- [ ] No invented projects, clients, awards, reviews, or certifications
- [ ] No placeholder copy
- [ ] No duplicated generated sections
- [ ] No keyword stuffing
- [ ] No arbitrary word-count target
- [ ] Location pages contain real local value
- [ ] Comparison pages include original criteria or testing
- [ ] Author/reviewer information is accurate where expected
- [ ] AI or automation disclosure is considered where readers would reasonably expect it
- [ ] Update dates reflect substantive revisions
- [ ] Maintenance owner and review trigger are assigned

## Technical performance

- [ ] Field data checked where available
- [ ] LCP reviewed
- [ ] INP reviewed
- [ ] CLS reviewed
- [ ] LCP image is not unnecessarily lazy-loaded
- [ ] Images and videos reserve dimensions
- [ ] Media is compressed and responsively delivered
- [ ] Background video has a performance fallback
- [ ] Font loading is reviewed
- [ ] JavaScript bundle size is reviewed
- [ ] Third-party scripts are justified
- [ ] Mobile layout is tested
- [ ] Reduced-motion behavior is tested
- [ ] HTTPS is enforced
- [ ] Security headers are reviewed separately from SEO claims

## Structured data

- [ ] Schema type matches visible content
- [ ] Google supports the intended search feature
- [ ] JSON-LD is syntactically valid
- [ ] Required and recommended fields are reviewed
- [ ] URLs are absolute and correct
- [ ] Dates are real
- [ ] Prices and availability are real
- [ ] Reviews and ratings are real and visible
- [ ] No misleading markup
- [ ] Rich Results Test completed
- [ ] Search Console enhancement reports reviewed where applicable

## International

- [ ] Separate URLs exist for language/region variants
- [ ] `hreflang` is reciprocal
- [ ] Self-references exist
- [ ] Canonicals point to same-language preferred URLs
- [ ] Locale codes are valid
- [ ] Native or qualified review completed
- [ ] Auto-redirect behavior does not hide variants from crawlers

## Local SEO

- [ ] Business is eligible for Google Business Profile
- [ ] Name, address/service area, phone, hours, and categories are accurate
- [ ] Location pages reflect actual service and local details
- [ ] No fabricated offices or addresses
- [ ] Reviews follow platform policy
- [ ] Local structured data matches visible business information
- [ ] Local rank claims account for relevance, distance, and prominence/popularity
- [ ] Tracking separates organic, local, call, form, and direction actions where possible

## Measurement

- [ ] Google Search Console verified
- [ ] Bing Webmaster Tools verified
- [ ] Sitemap submitted and processed
- [ ] IndexNow considered for supported engines
- [ ] Analytics installed and consent requirements reviewed
- [ ] Conversion events configured
- [ ] Forms tested
- [ ] Phone and email links tested
- [ ] UTM conventions documented
- [ ] Reporting cadence documented
- [ ] Search update/status checks included in anomaly diagnosis
- [ ] Baseline captured before major changes

---

# 23. Research Completion Checklist

- [ ] Audience and business objective defined
- [ ] Website technology and rendering model identified
- [ ] Search intent mapped
- [ ] Primary documentation reviewed
- [ ] Search-engine-specific claims separated
- [ ] Ranking claims classified
- [ ] Crawling, rendering, indexing, ranking, presentation, and conversion separated
- [ ] Current SERPs reviewed with date/location/device
- [ ] Competitors analyzed without copying
- [ ] Content gaps ranked
- [ ] Vibe-coded risks tested
- [ ] Framework implementation verified
- [ ] Technical recommendations tested
- [ ] Unsupported claims removed
- [ ] Conflicting evidence documented
- [ ] Sources saved with title, author, URL, and dates
- [ ] Evidence table completed
- [ ] Human-review requirements assigned
- [ ] Maintenance and re-verification date assigned
- [ ] Minimum evidence threshold met

---

# 24. Source Registry

All sources below were accessed on **2026-08-04** unless another access date is recorded.

**S1. Google Search Central — In-depth guide to how Google Search works**  
https://developers.google.com/search/docs/fundamentals/how-search-works

**S2. Google Search Central — Google Search Essentials**  
https://developers.google.com/search/docs/essentials

**S3. Google Search Central — SEO Starter Guide**  
https://developers.google.com/search/docs/fundamentals/seo-starter-guide

**S4. Google Search Central — Understand JavaScript SEO basics**  
https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

**S5. Google Search Central — Fix search-related JavaScript problems**  
https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript

**S6. Google Search Central — Canonical URL and duplicate URL guidance**  
https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

**S7. Google Search Central — Build and submit a sitemap**  
https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

**S8. Google Search Central — Block indexing with noindex**  
https://developers.google.com/search/docs/crawling-indexing/block-indexing

**S9. Google Search Central — SEO link best practices**  
https://developers.google.com/search/docs/crawling-indexing/links-crawlable

**S10. Google Search Central — Influencing title links**  
https://developers.google.com/search/docs/appearance/title-link

**S11. Google Search Central — General structured data guidelines**  
https://developers.google.com/search/docs/appearance/structured-data/sd-policies

**S12. Google Search Central — Spam policies for Google Web Search**  
https://developers.google.com/search/docs/essentials/spam-policies

**S13. Google Search Central — Creating helpful, reliable, people-first content**  
https://developers.google.com/search/docs/fundamentals/creating-helpful-content  
Last updated shown by source: 2025-12-10

**S14. Google Search Central — Guidance on using generative AI content**  
https://developers.google.com/search/docs/fundamentals/using-gen-ai-content  
Last updated shown by source: 2025-12-10

**S15. Google Search Central — Guide to Google Search ranking systems**  
https://developers.google.com/search/docs/appearance/ranking-systems-guide

**S16. Google Search Central — Core Web Vitals and Google Search**  
https://developers.google.com/search/docs/appearance/core-web-vitals

**S17. web.dev — Web Vitals**  
https://web.dev/articles/vitals

**S18. W3C WAI — Understanding headings and labels**  
https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html

**S19. W3C WAI — WCAG 2.2 Quick Reference**  
https://www.w3.org/WAI/WCAG22/quickref/

**S20. Google Search Central — Localized versions and hreflang**  
https://developers.google.com/search/docs/specialty/international/localized-versions

**S21. Google Business Profile Help — Tips to improve local ranking**  
https://support.google.com/business/answer/7091

**S22. Bing Webmaster Guidelines**  
https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a

**S23. IndexNow — Protocol documentation**  
https://www.indexnow.org/documentation

**S24. Schema.org — Documentation**  
https://schema.org/docs/documents.html

**S25. Next.js — generateMetadata**  
https://nextjs.org/docs/app/api-reference/functions/generate-metadata

**S26. Next.js — sitemap.xml metadata convention**  
https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap  
Last updated shown by source: 2026-03-25

**S27. Next.js — robots.txt metadata convention**  
https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots  
Last updated shown by source: 2026-02-27

**S28. Vite — Server-Side Rendering guide**  
https://vite.dev/guide/ssr.html

**S29. React — hydrateRoot**  
https://react.dev/reference/react-dom/client/hydrateRoot

**S30. HTTP Archive — 2025 Web Almanac SEO chapter**  
https://almanac.httparchive.org/en/2025/seo  
Published: 2026-01-15  
Last updated shown by source: 2026-06-09  
Source type: Independent large-scale technical dataset; correlations and prevalence, not Google policy

**S31. Screaming Frog — Find orphan pages**  
https://www.screamingfrog.co.uk/seo-spider/tutorials/find-orphan-pages/  
Source type: Tool workflow and practitioner guidance

**S32. Google Search Status Dashboard**  
https://status.search.google.com/

**S33. Google Search Console Help — URL Inspection tool**  
https://support.google.com/webmasters/answer/9012289

**S34. Google Search Central — AI optimization guide**  
https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

**S35. web.dev — Optimize Largest Contentful Paint**  
https://web.dev/articles/optimize-lcp

**S36. web.dev — Optimize Cumulative Layout Shift**  
https://web.dev/articles/optimize-cls  
Last updated shown by source: 2025-02-07

**S37. Google Search Central — URL structure best practices**  
https://developers.google.com/search/docs/crawling-indexing/url-structure

**S38. Google Search Central — Troubleshoot crawling errors and soft 404s**  
https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors

**S39. Google Search Central — Image SEO best practices**  
https://developers.google.com/search/docs/appearance/google-images

**S40. Google Search Central — Search Central blog and update history**  
https://developers.google.com/search/blog

---

# 25. Fifteen Highest-Priority Searches to Run First

1. `site:developers.google.com/search/docs how Google Search works crawling indexing serving`
2. `site:developers.google.com/search/docs Search Essentials technical requirements`
3. `site:developers.google.com/search/docs JavaScript SEO crawling rendering indexing`
4. `site:developers.google.com/search/docs spam policies scaled content abuse`
5. `site:developers.google.com/search/docs generative AI content website guidance`
6. `site:developers.google.com/search/docs creating helpful reliable people-first content`
7. `site:developers.google.com/search/docs canonical duplicate URLs`
8. `site:developers.google.com/search/docs XML sitemap build submit`
9. `site:developers.google.com/search/docs noindex robots.txt`
10. `site:developers.google.com/search/docs crawlable links anchor text`
11. `site:developers.google.com/search/docs structured data general guidelines`
12. `site:developers.google.com/search/docs Core Web Vitals search`
13. `site:bing.com/webmasters/help webmaster guidelines crawling indexing`
14. `[FRAMEWORK] official documentation metadata sitemap robots SSR`
15. `[TARGET KEYWORD]` with the exact project location, device, and language context

---

# 26. Ten Most Authoritative SEO Source Categories

1. Google Search Central documentation
2. Google Search Console documentation and live inspection data
3. Google Search Status Dashboard and official update history
4. Bing Webmaster Guidelines and Bing Webmaster Tools documentation
5. W3C/WCAG and web standards
6. Schema.org and search-engine structured-data feature documentation
7. Official framework and browser documentation
8. web.dev, Chrome UX Report, and performance standards
9. Peer-reviewed or transparent original research
10. Large-scale independent technical datasets such as HTTP Archive

---

# 27. Ten Most Common Vibe-Coded Website SEO Failures

1. Production pages retain staging `noindex` or robots blocks.
2. Dynamic routes are missing from sitemaps and internal links.
3. Every route shares the same title, description, canonical, or social metadata.
4. Client-rendered pages expose empty or incomplete initial HTML and fail under rendering or API errors.
5. Invalid routes return `200` and create soft 404s.
6. Location or service pages repeat the same generated text with only a keyword changed.
7. Structured data contains invented or nonvisible claims, reviews, prices, or FAQs.
8. Oversized hero media and excessive JavaScript damage mobile performance.
9. AI-generated copy includes placeholders, unsupported claims, fake statistics, or inaccurate service details.
10. The site launches without Search Console, Bing Webmaster Tools, analytics, conversion testing, or a maintenance process.

---

# 28. Five Largest Likely Content Gaps

1. **Evidence-backed framework repair guides:** Exact Next.js, React, Vite, CMS, and hosting fixes rather than generic checklists.
2. **Raw-versus-rendered audit examples:** Screenshots and code showing what crawlers initially receive and what appears after JavaScript.
3. **Original audits of AI-built sites:** Transparent datasets showing repeated technical and content failures.
4. **Separation of SEO stages:** Clear diagnosis of discovery, crawling, rendering, indexing, ranking, search presentation, and conversion.
5. **Post-launch maintenance:** Processes for sitemap integrity, stale content, internal links, analytics, indexing, and regression testing.

---

# 29. Minimum Evidence Required Before Writing

Do not begin a final SEO article, recommendation set, or `/SEO-GUIDELINES.md` rule until the following exists:

1. A completed project configuration.
2. At least one current primary source for every official policy or platform behavior.
3. Two independent sources for material causal, ranking, or performance claims.
4. A current SERP sample for each major intent or keyword pattern.
5. A claim classification and verification status.
6. Framework-specific implementation documentation.
7. A direct technical test where the recommendation concerns rendering, status codes, metadata, canonicals, robots, sitemaps, or schema.
8. Explicit limitations and exceptions.
9. A source registry with titles, URLs, publication/update dates, and access dates.
10. Human review for high-impact or factual content.

---

# 30. Step-by-Step Research Workflow

1. Complete the project configuration.
2. Inventory existing pages, routes, content sources, and measurement access.
3. Separate known problems by SEO stage.
4. Run the 15 priority searches.
5. Save current primary documentation.
6. Build the terminology and claim-classification table.
7. Inspect the site’s raw HTML, rendered HTML, headers, status codes, robots, canonicals, and sitemap.
8. Crawl the site from the homepage and compare the crawl with sitemap, Search Console, analytics, and route inventory.
9. Map search intent for target queries.
10. Inspect current SERPs using recorded location, date, device, and language.
11. Analyze competitors without copying.
12. Identify content and implementation gaps.
13. Review secondary studies and practitioner posts for testable leads.
14. Score each source.
15. Populate the evidence table.
16. Reject unsupported absolutes.
17. Run framework-specific tests.
18. Conduct original research where documentation is insufficient.
19. Convert only supported findings into labeled candidate rules.
20. Assign human-review depth, maintenance owner, and re-verification date.
21. Generate `/SEO-GUIDELINES.md`.
22. Add automated deployment checks.
23. Monitor Search Console, Bing Webmaster Tools, field performance, and conversions.
24. Reverify time-sensitive rules after major framework, policy, or search-system changes.

---

# 31. Claims That Must Not Be Made Without Direct Evidence

- “Google penalized this site because it was vibe coded.”
- “Google can detect that this website was generated by AI.”
- “AI content is automatically penalized.”
- “Publishing one page per day improves rankings.”
- “Publishing ten pages at once triggers a penalty.”
- “Brand searches are a confirmed direct ranking factor for this site.”
- “Domain Authority is a Google metric.”
- “Schema markup directly increases rankings.”
- “A sitemap guarantees indexing.”
- “Submitting a URL guarantees indexing.”
- “Server-side rendering automatically improves rankings.”
- “One H1 is a confirmed ranking requirement.”
- “Every page needs at least five internal links.”
- “Exact-match internal anchors always perform better.”
- “Meta descriptions are a direct ranking factor.”
- “Accessibility compliance directly improves rankings.”
- “Passing Core Web Vitals guarantees ranking gains.”
- “A specific word count is required.”
- “This algorithm update caused the traffic loss” without date-aligned evidence and competing-cause review.
- “This backlink caused the ranking increase” without controlled or strong supporting evidence.
- “This technical repair will definitely increase traffic.”
- “This page will rank.”
- “This content is original” without provenance or review.
- “This statistic is accurate” without the original source.
- “This location page is locally relevant” without real service, data, or local context.
- “This structured data is valid” without validation and visible-content comparison.
- “This page is indexed” based only on a `site:` query.
- “This page is not indexed” based only on not seeing it in a normal search.
- “Google ignored the canonical” without checking the selected canonical and competing signals.
- “The site has a crawl-budget problem” without site scale and crawl evidence.
- “Search Console caused rankings to improve.”
- “Open Graph tags improve Google rankings.”
- “More content always produces more traffic.”
- “Fresh dates improve rankings” when the content was not substantively updated.

---

## End State

The final `/SEO-GUIDELINES.md` should be shorter than this research document. It should contain only project-relevant rules, implementation instructions, automated checks, exceptions, and verification steps.

This research document remains the evidence and methodology layer. It should be reviewed whenever:

- Google or Bing changes relevant documentation
- A major framework version changes metadata or rendering behavior
- The site changes hosting, routing, CMS, language structure, or domain
- Search Console reports a material indexing change
- A major search update coincides with performance changes
- Programmatic or AI-assisted publishing is expanded
- New structured-data features are implemented
- The business enters a new market, location, or regulated industry
