const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");
const assert = require("node:assert/strict");
const routeManifest = require("../config/routes.cjs");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const siteOrigin = "https://www.networksandnodes.org";
const attributeValue = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return match?.[1] ?? match?.[2];
};

test("route manifest keeps build, indexability, canonicals, and sitemap in parity", async () => {
  const ids = routeManifest.map((route) => route.id);
  const sourcePaths = routeManifest.map((route) => route.sourcePath);
  const publicPaths = routeManifest.map((route) => route.publicPath);

  assert.equal(new Set(ids).size, ids.length, "route IDs must be unique");
  assert.equal(new Set(sourcePaths).size, sourcePaths.length, "route source paths must be unique");
  assert.equal(new Set(publicPaths).size, publicPaths.length, "route public paths must be unique");

  for (const route of routeManifest) {
    assert.ok(fs.existsSync(path.join(root, route.sourcePath)), `${route.sourcePath} does not exist`);
    assert.ok(["self", "none"].includes(route.canonicalIntent), `${route.id} has an invalid canonical intent`);
    assert.equal(typeof route.indexable, "boolean", `${route.id} indexable must be boolean`);
    assert.equal(typeof route.sitemap, "boolean", `${route.id} sitemap must be boolean`);
    assert.equal(
      route.publicPath,
      route.sourcePath === "index.html" ? "/" : `/${route.sourcePath}`,
      `${route.id} public path must match Vite's emitted path`,
    );
    assert.equal(route.sitemap, route.indexable, `${route.id} sitemap inclusion must match indexability`);

    const html = read(route.sourcePath);
    const robots = [...html.matchAll(/<meta\b[^>]*>/gi)]
      .map((match) => match[0])
      .filter((tag) => attributeValue(tag, "name")?.toLowerCase() === "robots")
      .map((tag) => attributeValue(tag, "content") || "")
      .join(",");
    assert.equal(!robots.toLowerCase().includes("noindex"), route.indexable, `${route.id} indexability drifted`);

    const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)]
      .map((match) => match[0])
      .filter((tag) => (attributeValue(tag, "rel") || "").toLowerCase().split(/\s+/).includes("canonical"))
      .map((tag) => attributeValue(tag, "href"));
    if (route.canonicalIntent === "self") {
      assert.deepEqual(
        canonicals,
        [new URL(route.publicPath, siteOrigin).href],
        `${route.id} must have one absolute self-canonical`,
      );
    } else {
      assert.deepEqual(canonicals, [], `${route.id} must not declare a canonical`);
    }
  }

  const viteConfigUrl = pathToFileURL(path.join(root, "vite.config.mjs")).href;
  const viteConfig = (await import(viteConfigUrl)).default;
  const actualInputs = Object.fromEntries(
    Object.entries(viteConfig.build.rollupOptions.input).map(([id, sourcePath]) => [
      id,
      path.relative(root, sourcePath),
    ]),
  );
  const expectedInputs = Object.fromEntries(routeManifest.map((route) => [route.id, route.sourcePath]));
  assert.deepEqual(actualInputs, expectedInputs, "Vite inputs must be derived from the route manifest");

  const sitemapUrls = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expectedSitemapUrls = routeManifest
    .filter((route) => route.sitemap)
    .map((route) => new URL(route.publicPath, siteOrigin).href);
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "sitemap URLs must not be duplicated");
  assert.deepEqual([...sitemapUrls].sort(), [...expectedSitemapUrls].sort(), "sitemap and route manifest drifted");
});

test("homepage exposes the approved commercial vocabulary in semantic HTML", () => {
  const html = read("index.html");

  assert.match(html, /Websites · Custom software · Automation · Connected workflows/);
  assert.match(html, /custom software/i);
  assert.match(html, /CRM/i);
  assert.match(html, /lead generation/i);
  assert.match(html, /U\.S\. market adaptation/i);
  assert.match(html, /replace disconnected tools/);
  assert.match(html, /reduce manual work/);
  assert.match(html, /established businesses, founder-led teams/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test("homepage has clear conversion paths and complete service intents", () => {
  const html = read("index.html");

  assert.match(html, />\s*Request a project review\s*</);
  assert.match(html, /href="\/#contact" data-scroll-target="contact"/);
  assert.match(html, /No sales presentation\./);
  assert.match(html, /Transportation Solutions &amp; Lighting,[\s\S]*?approximately 10 hours per week in reported manual dispatch/);
  assert.match(html, /Request a discovery call/);
  for (const intent of [
    "Website / digital experience",
    "Automation / AI workflow",
    "Custom software / CRM",
    "Marketing / lead generation",
    "U.S. market adaptation",
    "Not sure yet",
  ]) {
    assert.ok(html.includes(`value="${intent}"`), `missing service intent: ${intent}`);
  }
});

test("homepage preserves the four-stage process with tangible artifacts", () => {
  const html = read("index.html");

  for (const stage of ["Review", "Define", "Build", "Improve"]) {
    assert.match(html, new RegExp(`<h3>${stage}</h3>`));
  }
  assert.match(html, /audit or system map/);
  assert.match(html, /scope and priority brief/);
  assert.match(html, /working product/);
  assert.match(html, /analytics or iteration report/);
});

test("the flagship project uses an owned case-study route", () => {
  const homepage = read("index.html");
  const caseStudy = read("work/transportation-solutions-lighting.html");
  const sitemap = read("sitemap.xml");

  assert.match(homepage, /href="\/work\/transportation-solutions-lighting\.html"/);
  assert.equal((caseStudy.match(/<h1\b/g) || []).length, 1);
  assert.match(caseStudy, /Reported outcome/);
  assert.match(caseStudy, /Approximately 10 hours per week in reported manual dispatch work reduced\./);
  assert.match(caseStudy, /Visit the client website/);
  assert.match(sitemap, /work\/transportation-solutions-lighting\.html/);
});

test("Phase 2 gives every featured project consistent, defensible proof", () => {
  const homepage = read("index.html");
  const workSection = homepage.match(/<section class="section work"[\s\S]*?<\/section>/)?.[0] || "";

  assert.equal((workSection.match(/<article class="project">/g) || []).length, 3);
  for (const label of ["Business problem", "What we built", "Systems connected"]) {
    assert.equal((workSection.match(new RegExp(`<dt>${label}<\\/dt>`, "g")) || []).length, 3);
  }
  assert.equal((workSection.match(/<dt>(?:Reported outcome|Current status)<\/dt>/g) || []).length, 3);
  assert.match(workSection, /Approximately 10 hours per week in reported manual dispatch work reduced\./);
  assert.doesNotMatch(workSection, /~10|MVP → market|Clearer path/);
  assert.match(workSection, /Three featured projects showing work across strategy, design, and implementation/);
});

test("project cards lead to internal details before explicit external actions", () => {
  const homepage = read("index.html");
  const tsl = homepage.match(/<article class="project">[\s\S]*?<\/article>/)?.[0] || "";
  const codeLink = homepage.match(/<article class="project">[\s\S]*?CodeLink[\s\S]*?<\/article>/)?.[0] || "";
  const redeemed = homepage.match(/<article class="project">[\s\S]*?Redeemed Hands[\s\S]*?<\/article>/)?.[0] || "";

  assert.ok(tsl.indexOf('/work/transportation-solutions-lighting.html') < tsl.indexOf('https://www.tsandl.us/'));
  assert.ok(codeLink.indexOf('/work/codelink.html') < codeLink.indexOf('https://www.codelink.live/waitlist'));
  assert.match(redeemed, /href="\/work\/redeemed-hands\.html"/);
  assert.doesNotMatch(redeemed, /redeemedhands\.com/);
  assert.match(tsl, /Visit the client website/);
  assert.match(codeLink, /View the product page/);
});

test("all featured projects have reusable detail pages and indexed routes", () => {
  const sitemap = read("sitemap.xml");
  const cases = [
    ["work/transportation-solutions-lighting.html", "Reported project outcome"],
    ["work/codelink.html", "Public product page available. No quantitative outcome published."],
    ["work/redeemed-hands.html", "Completed homepage preview documented in the repository."],
  ];

  for (const [file, proof] of cases) {
    const html = read(file);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file} should have one h1`);
    assert.match(html, /Business|Problem/i);
    assert.ok(html.includes(proof), `${file} missing its proof/status statement`);
    assert.ok(sitemap.includes(file), `${file} missing from sitemap`);
    assert.ok(
      routeManifest.some((route) => route.sourcePath === file && route.sitemap),
      `${file} missing from the production route manifest`,
    );
  }
});

test("owner proof requests stay in an internal repository checklist", () => {
  const homepage = read("index.html");
  const inventory = read("PROJECT-PROOF-INVENTORY.md");

  for (const item of [
    "Client approved testimonial",
    "Baseline and after state metric",
    "Project timeline",
    "Public launch URL",
    "Permission to name the client",
  ]) {
    assert.match(inventory, new RegExp(item));
  }
  assert.doesNotMatch(homepage, /Owner supplied proof checklist/);
  assert.doesNotMatch(homepage, /Client approved testimonial|Baseline and after state metric|Permission to name the client/);
});

test("section navigation has real fragment fallbacks and case studies preserve the portfolio tab", () => {
  const homepage = read("index.html");
  const caseStudy = read("work/transportation-solutions-lighting.html");
  const navigation = read("js/in-page-navigation.js");
  const homepageHeader = homepage.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0] || "";
  const caseStudyHeader = caseStudy.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0] || "";

  assert.match(homepageHeader, /href="\/#services"/);
  assert.match(homepageHeader, /href="\/#contact"/);
  assert.match(caseStudyHeader, /href="\/#services"/);
  assert.match(caseStudyHeader, /href="\/#contact"/);
  assert.match(homepage, /data-scroll-target="work"/);
  assert.match(navigation, /event\.preventDefault\(\)/);
  assert.match(homepage, /codelink\.live\/waitlist"[\s\S]*?target="_blank"[\s\S]*?rel="noopener noreferrer"/);
  assert.match(caseStudy, /www\.tsandl\.us\/" target="_blank" rel="noopener noreferrer"/);
});

test("Phase 3 navigation uses durable fragment URLs with focus-safe enhancement", () => {
  const files = [
    "index.html",
    "work/transportation-solutions-lighting.html",
    "work/codelink.html",
    "work/redeemed-hands.html",
    "privacy.html",
    "terms.html",
    "404.html",
  ];
  const css = read("css/site.css");
  const navigation = read("js/in-page-navigation.js");

  for (const file of files) {
    const header = read(file).match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0] || "";
    for (const target of ["services", "work", "process", "contact"]) {
      assert.match(header, new RegExp(`href="\\/#${target}"`), `${file} missing /#${target}`);
    }
    assert.doesNotMatch(header, /href="\/" data-scroll-target=/, `${file} has a homepage-only navigation link`);
  }

  assert.match(css, /scroll-padding-top: 7rem/);
  assert.match(css, /:where\(main\[id\], section\[id\]\)[\s\S]*?scroll-margin-top: 7rem/);
  assert.match(css, /\.site-header\s*\{[\s\S]*?position: sticky/);
  assert.match(navigation, /new URL\(link\.href, window\.location\.href\)/);
  assert.match(navigation, /window\.history\.pushState/);
  assert.match(navigation, /target\.focus\(\{ preventScroll: true \}\)/);
  assert.doesNotMatch(navigation, /sessionStorage/);
});

test("Phase 3 FAQ answers all eight buying questions without invented terms", () => {
  const homepage = read("index.html");
  const faq = homepage.match(/<section class="section faq"[\s\S]*?<\/section>/)?.[0] || "";
  const questions = [
    "What kinds of businesses do you work with?",
    "Can you improve an existing website or internal system?",
    "Do you build more than websites?",
    "Can you connect our website, CRM, email, reporting, or other tools?",
    "How long does a project take?",
    "What does a typical engagement cost?",
    "Do you provide ongoing support?",
    "Who owns the finished work?",
  ];

  assert.equal((faq.match(/<details>/g) || []).length, 8);
  for (const question of questions) assert.ok(faq.includes(question), `missing FAQ question: ${question}`);
  assert.doesNotMatch(faq, /\$\s?\d|\d[\d,]*\s+dollars?|\d+\s+(?:business\s+)?(?:days?|weeks?|months?)/i);
  assert.match(faq, /must be defined in the proposal rather than assumed/);
  assert.match(faq, /must be stated in the written project agreement before work begins/);
  assert.doesNotMatch(homepage, /"@type": "FAQPage"/);
});

test("homepage has complete large-image social metadata and verified Organization schema", () => {
  const homepage = read("index.html");
  const socialCard = fs.readFileSync(path.join(root, "images/social-card.png"));
  const schemaSource = homepage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || "";
  const schema = JSON.parse(schemaSource);

  for (const pattern of [
    /property="og:title"/,
    /property="og:description"/,
    /property="og:url" content="https:\/\/www\.networksandnodes\.org\/"/,
    /property="og:image" content="https:\/\/www\.networksandnodes\.org\/images\/social-card\.png"/,
    /property="og:image:width" content="1200"/,
    /property="og:image:height" content="630"/,
    /property="og:image:alt"/,
    /name="twitter:card" content="summary_large_image"/,
    /name="twitter:image"/,
    /name="twitter:image:alt"/,
  ]) {
    assert.match(homepage, pattern);
  }

  assert.equal(socialCard.readUInt32BE(16), 1200);
  assert.equal(socialCard.readUInt32BE(20), 630);
  assert.equal(schema["@type"], "Organization");
  assert.equal(schema.name, "Networks & Nodes");
  assert.equal(schema.url, "https://www.networksandnodes.org/");
  assert.equal(schema.email, "david@networksandnodes.org");
  for (const unsupported of ["address", "areaServed", "aggregateRating", "foundingDate", "sameAs"]) {
    assert.equal(schema[unsupported], undefined, `schema should not invent ${unsupported}`);
  }
});

test("draft legal pages and the branded 404 are visible, cautious, and built", () => {
  const homepage = read("index.html");
  const privacy = read("privacy.html");
  const terms = read("terms.html");
  const notFound = read("404.html");
  const legalNotes = read("LEGAL-REVIEW-NOTES.md");

  assert.match(homepage, /href="\/privacy\.html">Privacy</);
  assert.match(homepage, /href="\/terms\.html">Terms</);
  for (const page of [privacy, terms]) {
    assert.match(page, /name="robots" content="noindex, follow"/);
    assert.match(page, /requires owner confirmation and review by qualified legal counsel/);
    assert.match(page, /It is not legal advice/);
  }
  assert.match(privacy, /Cloudflare Turnstile/);
  assert.match(privacy, /configured\s+SMTP provider/);
  assert.match(terms, /separate written agreement accepted by both parties/);
  assert.match(notFound, /Page not found\./);
  assert.match(notFound, /href="\/#top"/);
  assert.match(notFound, /href="\/#work"/);
  assert.match(notFound, /href="\/#contact"/);
  for (const file of ["privacy.html", "terms.html", "404.html"]) {
    assert.ok(routeManifest.some((route) => route.sourcePath === file));
  }
  assert.match(legalNotes, /ownership and licensing policy/i);
  assert.match(legalNotes, /retention period/i);
});

test("raw contact links remain valid without Cloudflare decoder JavaScript", () => {
  const contactPages = [
    ["index.html", 2],
    ["privacy.html", 1],
    ["terms.html", 1],
  ];

  for (const [file, expectedCount] of contactPages) {
    const html = read(file);
    const mailtoAnchors = [
      ...html.matchAll(/<a\b[^>]*href="mailto:david@networksandnodes\.org(?:\?[^\"]*)?"[^>]*>/gi),
    ];

    assert.equal(mailtoAnchors.length, expectedCount, `${file} has an unexpected raw contact destination`);
    for (const anchor of mailtoAnchors) {
      const protectionStart = html.lastIndexOf("<!--email_off-->", anchor.index);
      const previousProtectionEnd = html.lastIndexOf("<!--/email_off-->", anchor.index);
      const protectionEnd = html.indexOf("<!--/email_off-->", anchor.index);
      assert.ok(
        protectionStart > previousProtectionEnd && protectionEnd > anchor.index,
        `${file} mailto must opt out of Cloudflare email rewriting`,
      );
    }
    assert.doesNotMatch(html, /\/cdn-cgi\/l\/email-protection|data-cfemail/i);
  }
});

test("raw page footers contain the current year before JavaScript runs", () => {
  const currentYear = String(new Date().getFullYear());
  const footerPages = [
    "index.html",
    "privacy.html",
    "terms.html",
    "404.html",
    "work/transportation-solutions-lighting.html",
    "work/codelink.html",
    "work/redeemed-hands.html",
  ];

  for (const file of footerPages) {
    const html = read(file);
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] || "";
    assert.ok(footer, `${file} is missing its footer`);
    assert.ok(footer.includes(currentYear), `${file} footer year is stale in raw HTML`);
  }
  assert.match(read("index.html"), new RegExp(`<span data-year>${currentYear}<\\/span>`));
});

test("homepage and switchboard form one combined capabilities section", () => {
  const homepage = read("index.html");
  const switchboard = read("switchboard.html");

  assert.doesNotMatch(homepage, /Connected capabilities/i);
  assert.doesNotMatch(switchboard, /Connected capabilities/i);
  assert.match(homepage, /<h2 id="services-title">What we build\.<\/h2>/);
  assert.match(homepage, /Websites and digital experiences/);
  assert.match(homepage, /Custom software and internal tools/);
  assert.match(homepage, /Automation, AI, and connected workflows/);
  assert.match(homepage, /Explore the detailed capabilities below/);
  assert.doesNotMatch(homepage, /capability-rail/);
  assert.equal((switchboard.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(switchboard, /System Selector/i);
});

test("Phase 1 keeps the hero compact and the project review accessible", () => {
  const html = read("index.html");
  const css = read("css/site.css");

  assert.match(html, /<section class="contact" id="contact">/);
  assert.match(html, /Start with the problem, not a commitment\./);
  assert.match(html, /What happens after you submit/);
  assert.match(html, /Send review request/);
  assert.doesNotMatch(html, /usually within one business day/);
  assert.match(css, /\.hero-title\s*\{[\s\S]*?max-width: min\(100%, 680px\)/);
  assert.match(css, /\.solution-groups\s*\{[\s\S]*?grid-template-columns: repeat\(3/);
  assert.match(css, /:where\(a, button, summary, input, textarea\):focus-visible/);
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 640px\)/);
});

test("project labels meet WCAG AA contrast on paper and the highlighted outcome state", () => {
  const css = read("css/site.css");
  const token = (name) => css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
  const toRgb = (hex) => hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16));
  const relativeLuminance = (rgb) => {
    const channels = rgb.map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (foreground, background) => {
    const foregroundLuminance = relativeLuminance(foreground);
    const backgroundLuminance = relativeLuminance(background);
    return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
      / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
  };
  const composite = (foreground, background, alpha) =>
    foreground.map((value, index) => value * alpha + background[index] * (1 - alpha));

  const paper = toRgb(token("paper"));
  const paperAccent = toRgb(token("paper-accent"));
  const outcomeColor = css.match(
    /\.project-outcome\s*\{[^}]*background:\s*rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/,
  );
  assert.ok(outcomeColor, "project outcome background must be measurable");
  const outcomeBackground = composite(
    outcomeColor.slice(1, 4).map(Number),
    paper,
    Number(outcomeColor[4]),
  );

  assert.match(css, /\.project-meta\s*\{[^}]*color:\s*var\(--paper-accent\)/);
  assert.match(css, /\.project-details dt\s*\{[^}]*color:\s*var\(--paper-accent\)/);
  for (const [state, background] of [["paper", paper], ["highlighted outcome", outcomeBackground]]) {
    const ratio = contrast(paperAccent, background);
    assert.ok(ratio >= 4.5, `${state} project-label contrast is ${ratio.toFixed(4)}:1`);
  }
});

test("switchboard exposes six connected capability states with proof and outcomes", () => {
  const html = read("switchboard.html");
  const capabilities = ["website", "automation", "software", "growth", "market", "experience"];

  for (const capability of capabilities) {
    assert.match(html, new RegExp(`data-service="${capability}"`));
    assert.match(html, new RegExp(`data-demo="${capability}"`));
  }
  assert.equal((html.match(/data-service="/g) || []).length, 6);
  assert.equal((html.match(/<section class="demo"[^>]*data-demo="/g) || []).length, 6);
  assert.match(html, /What it can include/);
  assert.match(html, /View related work/);
  assert.match(html, /Less manual handoff\. Faster response\. Better visibility\./);
  assert.deepEqual(
    [...html.matchAll(/data-service="([^"]+)"/g)].map((match) => match[1]),
    ["experience", "website", "growth", "market", "software", "automation"],
  );
  assert.match(html, /\.prototype-note\s*\{\s*display: none;/);
  assert.doesNotMatch(html.match(/data-demo="automation"[\s\S]*?data-demo="software"/)?.[0] || "", /Ads \/ Marketing/);
  assert.match(html.match(/data-demo="growth"[\s\S]*?data-demo="experience"/)?.[0] || "", /id="marketing-app-carousel"/);
  assert.match(html, /--information-label-size: clamp\(0\.75rem, 0\.9vw, 0\.82rem\)/);
});

test("switchboard opens on Digital Experiences", () => {
  const html = read("switchboard.html");
  const experienceDemo = html.match(/<section class="demo"[^>]*data-demo="experience"[^>]*>/)?.[0] || "";
  const websiteDemo = html.match(/<section class="demo"[^>]*data-demo="website"[^>]*>/)?.[0] || "";
  const experienceKey = html.match(/<button[\s\S]*?data-service="experience"[\s\S]*?<\/button>/)?.[0] || "";

  assert.doesNotMatch(experienceDemo, /\shidden/);
  assert.match(websiteDemo, /\shidden/);
  assert.match(experienceKey, /aria-pressed="true"/);
  assert.match(html, /id="system-count">01 \/ 06</);
  assert.match(html, /aria-labelledby="key-experience"/);
  assert.match(html, /selectService\("experience"\)/);
  assert.match(html, /servicePanel\.hidden = id === "experience"/);
});

test("switchboard service controls use grouped toggle semantics and scoped keyboard behavior", () => {
  const html = read("switchboard.html");
  const keys = [
    ...html.matchAll(/<button\s+class="service-key"[\s\S]*?<\/button>/g),
  ].map((match) => match[0]);
  const services = ["experience", "website", "growth", "market", "software", "automation"];

  assert.match(html, /<div class="key-grid" role="group" aria-label="Choose a Networks &amp; Nodes service">/);
  assert.equal(keys.length, services.length);
  assert.equal(keys.filter((key) => /aria-pressed="true"/.test(key)).length, 1);
  assert.doesNotMatch(html, /role="(?:tab|tablist|tabpanel)"|aria-selected=|tabindex="-1"/);

  for (const service of services) {
    const key = keys.find((candidate) => candidate.includes(`data-service="${service}"`)) || "";
    const expectedControls = service === "experience"
      ? `demo-${service}`
      : `demo-${service} service-explanation`;
    assert.match(key, new RegExp(`aria-controls="${expectedControls}"`));
    assert.match(html, new RegExp(`id="demo-${service}"[^>]*data-demo="${service}"`));
  }

  for (const keyName of ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"]) {
    assert.ok(html.includes(`event.key === "${keyName}"`), `missing ${keyName} navigation`);
  }
  assert.doesNotMatch(html, /window\.addEventListener\("keydown"|shortcutServices/);
  assert.match(html, /\.system-node\s*\{[\s\S]*?width: 24px;[\s\S]*?height: 24px;/);
  assert.match(html, /\.service-key\s*\{[\s\S]*?min-height: clamp\(108px, 11vw, 148px\);/);
  const keyNameRules = [...html.matchAll(/(?:^|\n)\s*\.key-name\s*\{([^}]*)\}/g)].map((match) => match[1]);
  assert.ok(keyNameRules.length >= 2, "desktop and mobile key-name rules must be checked");
  for (const rule of keyNameRules) {
    assert.match(rule, /font-size: var\(--information-label-size\);/);
  }
});

test("switchboard identifies illustrative data in persistent raw content", () => {
  const html = read("switchboard.html");
  const disclosure = "Names, records, dates, and metrics shown in this switchboard are illustrative examples, not client results.";
  const disclosureRule = html.match(/\.example-data-note\s*\{([^}]*)\}/)?.[1] || "";
  const systemShellIndex = html.indexOf('<section class="system-shell"');
  const disclosureIndex = html.indexOf(disclosure);
  const firstDemoIndex = html.indexOf('<section class="demo"');

  assert.ok(systemShellIndex >= 0 && disclosureIndex > systemShellIndex && firstDemoIndex > disclosureIndex);
  assert.doesNotMatch(disclosureRule, /display:\s*none|visibility:\s*hidden|opacity:\s*0/);
  assert.doesNotMatch(html, /\.is-embedded[^{}]*\.example-data-note/);
});

test("mobile growth prioritizes connected channels over the full funnel", () => {
  const html = read("switchboard.html");

  assert.match(html, /class="capability-flow growth-flow"/);
  assert.match(html, /class="growth-mobile-summary"/);
  assert.match(html, /Search \+ social/);
  assert.match(html, /Message matched to intent/);
  assert.match(html, /Form qualification/);
  assert.match(html, /\.growth-demo-header,[\s\S]*?\.growth-flow\s*\{\s*display: none;/);
});

test("rich media is progressively initialized", () => {
  const homepage = read("index.html");
  const main = read("src/main.js");
  const switchboard = read("switchboard.html");
  const frameMarkup = homepage.match(/<iframe\s+data-video-frame[\s\S]*?<\/iframe>/)?.[0] || "";

  assert.doesNotMatch(frameMarkup, /\ssrc=/);
  assert.match(homepage, /data-video-poster/);
  assert.match(main, /IntersectionObserver/);
  assert.match(main, /deactivateMedia/);
  assert.match(main, /document\.hidden/);
  assert.doesNotMatch(
    switchboard,
    /<script[^>]+src="https:\/\/ajax\.googleapis\.com\/ajax\/libs\/model-viewer/i,
  );
  assert.match(switchboard, /function loadModelViewer/);
});

test("the construction model is excluded and unloaded on mobile", () => {
  const switchboard = read("switchboard.html");

  assert.match(switchboard, /mobileProductQuery = window\.matchMedia\("\(max-width: 700px\)"\)/);
  assert.match(switchboard, /if \(!mobileProductQuery\.matches\)/);
  assert.match(switchboard, /productModel\.removeAttribute\("src"\)/);
  assert.match(switchboard, /renderProduct\(0, !productDemo\.hidden\)/);
});

test("large 3D assets and the available carousel videos use the public R2 CDN", () => {
  const homepage = read("index.html");
  const main = read("src/main.js");
  const helper = read("src/asset-url.js");
  const switchboard = read("switchboard.html");

  assert.match(helper, /import\.meta\.env\.VITE_ASSET_URL/);
  assert.match(helper, /https:\/\/assets\.networksandnodes\.org/);
  assert.match(homepage, /data-video-native/);

  for (const asset of [
    "Immersive-designs.MP4",
    "Language-translation.MOV",
    "Realtor-redesign.mp4",
  ]) {
    assert.match(main, new RegExp(`assetUrl\\("${asset.replace(".", "\\.")}\\"\\)`));
  }

  for (const asset of [
    "Chicago_Air_Jordan1_Compress-v1.glb",
    "Building_Under_Cons_Compress-v1.glb",
    "Midnight_Sentinel_Compress-v1.glb",
    "Stock-shirt-compressed-v1.glb",
  ]) {
    assert.match(switchboard, new RegExp(`assetUrl\\("${asset.replace(".", "\\.")}\\"\\)`));
    assert.doesNotMatch(switchboard, new RegExp(`/images/${asset.replace(".", "\\.")}`));
  }

  assert.match(main, /type: "mux"[\s\S]*label: "Measured outcomes"/);
});

test("hero carousel keeps the approved video order", () => {
  const main = read("src/main.js");
  const immersive = main.indexOf('label: "Immersive experiences"');
  const market = main.indexOf('label: "U.S. market readiness"');
  const brand = main.indexOf('label: "Brand systems"');
  const measured = main.indexOf('label: "Measured outcomes"');

  assert.ok(immersive < market && market < brand && brand < measured);
  assert.match(
    main,
    /Language-translation\.MOV"\),[\s\S]*?fit: "contain"[\s\S]*?Realtor-redesign\.mp4"\),[\s\S]*?fit: "contain"/,
  );
});

test("Phase 4 provides bounded, explicit 3D fallback states", () => {
  const switchboard = read("switchboard.html");
  const fallback = read("images/3d-experience-fallback.svg");
  const packageJson = read("package.json");

  assert.match(fallback, /width="1200" height="800" viewBox="0 0 1200 800"/);
  assert.match(switchboard, /data-model-shell data-model-state="static"/);
  assert.match(switchboard, /src="\/images\/3d-experience-fallback\.svg"/);
  assert.match(switchboard, /role="status" aria-live="polite"/);
  assert.match(switchboard, /get\("webgl"\) === "off"/);
  assert.match(switchboard, /canvas\.getContext\("webgl2"\) \|\| canvas\.getContext\("webgl"\)/);
  assert.match(switchboard, /timed out while loading/);
  assert.match(switchboard, /model-viewer:not\(:defined\)\s*\{\s*display: none;/);
  assert.equal((switchboard.match(/modelViewerPromise = new Promise/g) || []).length, 1);
  assert.match(packageJson, /cp images\/\*\.svg/);
});

test("Phase 4 keeps reveal content visible if JavaScript or animation fails", () => {
  const main = read("src/main.js");
  const css = read("css/site.css");
  const observeIndex = main.indexOf("targets.forEach((element) => observer.observe(element))");
  const readyIndex = main.indexOf('document.documentElement.classList.add("motion-ready")');

  assert.ok(observeIndex >= 0 && readyIndex > observeIndex, "motion-ready must follow observer setup");
  assert.match(main, /window\.setTimeout\(\(\) => \{\s*targets\.forEach\(\(element\) => element\.classList\.add\("is-in-view"\)\);\s*\}, 2500\)/);
  assert.match(css, /html\.motion-ready \[data-reveal="rise"\]/);
  assert.doesNotMatch(css, /(?<!motion-ready )\[data-reveal="rise"\]\s*\{\s*opacity:\s*0/);
});

test("Phase 4 reduced-motion paths avoid automatic media and decorative sequencing", () => {
  const main = read("src/main.js");
  const switchboard = read("switchboard.html");

  assert.match(main, /if \(reduceMotion\) return;[\s\S]*?requestIdleCallback/);
  assert.match(main, /playback\.hidden = reduceMotion/);
  assert.match(switchboard, /productModel\.removeAttribute\("auto-rotate"\)/);
  assert.match(switchboard, /websiteProductModel\.removeAttribute\("auto-rotate"\)/);
  assert.match(switchboard, /showNode\(nodeButtons\.length - 1\)/);
  assert.match(switchboard, /@media \(prefers-reduced-motion: reduce\)/);
});

test("Phase 4 preserves native validation, focus targets, and stable media sizing", () => {
  const homepage = read("index.html");
  const main = read("src/main.js");
  const switchboard = read("switchboard.html");

  assert.match(homepage, /<main id="main" tabindex="-1">/);
  assert.doesNotMatch(homepage, /data-contact-form novalidate/);
  assert.match(main, /form\.querySelector\(":invalid"\)\?\.focus\(\)/);
  assert.match(main, /form\.addEventListener\(\s*"invalid"/);
  assert.match(main, /Please complete the required fields before sending\./);
  assert.match(homepage, /data-video-poster[\s\S]*?loading="eager"[\s\S]*?width="1200"[\s\S]*?height="675"/);
  assert.match(homepage, /data-video-poster[\s\S]*?srcset="[^"]+640w,[^"]+960w,[^"]+1200w"[\s\S]*?sizes="/);
  assert.match(main, /poster\.srcset = responsivePosterSources/);
  assert.equal((switchboard.match(/<img\b/g) || []).length, (switchboard.match(/<img\b[\s\S]*?\bwidth="/g) || []).length);
  assert.match(switchboard, /if \("ResizeObserver" in window\)/);
});
