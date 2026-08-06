"use client";

import { FormEvent, useEffect, useState } from "react";

const tagline =
  "We turn the details people remember into the stories everyone talks about.";

const clients = [
  { name: "Farmhouse Inn", slug: "farmhouse-inn" },
  { name: "Fort Ross Vineyard & Winery", slug: "fort-ross-vineyard-winery" },
  { name: "Grange Restaurant & Bar", slug: "grange-restaurant-bar" },
  { name: "Hotel Kabuki", slug: "hotel-kabuki" },
  { name: "HotelTonight", slug: "hotel-tonight" },
  { name: "Hotel Vitale", slug: "hotel-vitale" },
  { name: "Juniper Books", slug: "juniper-books" },
  { name: "Kimpton Hotel Enso", slug: "kimpton-hotel-enso" },
  {
    name: "Kimpton Sir Francis Drake",
    slug: "kimpton-sir-francis-drake",
  },
  { name: "Lazy Bear", slug: "lazy-bear" },
];

const features = [
  {
    publication: "The Wall Street Journal",
    date: "July 26, 2025",
    image: "/features/wall-street-journal.webp",
    href: "https://www.lgprinc.com/s/The-Wall-Street-Journal-July-26-2025.pdf",
  },
  {
    publication: "Forbes",
    date: "July 26, 2025",
    image: "/features/forbes.webp",
    href: "https://www.lgprinc.com/s/Forbes-July-26-2025.pdf",
  },
  {
    publication: "Phoenix Magazine",
    date: "July 2025",
    image: "/features/phoenix-magazine.webp",
    href: "https://www.lgprinc.com/s/Phoenix-Magazine-July-2025-g48k.pdf",
  },
  {
    publication: "AFAR",
    date: "November 7, 2025",
    image: "/features/afar.webp",
    href: "https://www.lgprinc.com/s/afarcom-November-7-2025.pdf",
  },
  {
    publication: "FOUND SF",
    date: "July 25, 2025",
    image: "/features/found-sf.webp",
    href: "https://www.lgprinc.com/s/FOUND-SF-July-25-2025.pdf",
  },
  {
    publication: "Fresno Bee",
    date: "August 23, 2025",
    image: "/features/fresno-bee.webp",
    href: "https://www.lgprinc.com/s/Fresno-Bee-August-23-2025.pdf",
  },
  {
    publication: "National Geographic Traveler",
    date: "November 11, 2025",
    image: "/features/national-geographic-traveler.webp",
    href: "https://www.lgprinc.com/s/NationalGeographicTravelercom-November-11-2025.pdf",
  },
  {
    publication: "SF Eater",
    date: "July 21, 2025",
    image: "/features/sf-eater.webp",
    href: "https://www.lgprinc.com/s/SFEatercom-July-21-2025.pdf",
  },
];

const work = [
  {
    number: "01",
    client: "Farmhouse Inn",
    category: "Luxury hospitality",
    image: "/images/hospitality.webp",
    title: "Keeping a beloved property in the conversation.",
    challenge:
      "Turn an exceptional guest experience into fresh, timely reasons for travelers and editors to pay attention.",
    approach:
      "Property positioning, culinary storytelling and a steady calendar of editorial angles that extend beyond one news cycle.",
  },
  {
    number: "02",
    client: "Grange",
    category: "Culinary",
    image: "/images/culinary.webp",
    title: "Making the story as memorable as the meal.",
    challenge:
      "Give a chef-driven restaurant a clear point of view in a crowded and fast-moving dining landscape.",
    approach:
      "Chef storytelling, seasonal hooks and media outreach designed around what makes the experience genuinely distinct.",
  },
  {
    number: "03",
    client: "Fort Ross",
    category: "Wine & destination",
    image: "/images/lifestyle.webp",
    title: "Turning a sense of place into a reason to visit.",
    challenge:
      "Connect a destination winery’s setting, craft and character into one compelling narrative.",
    approach:
      "Place-led positioning, thoughtful press experiences and stories built to travel across food, wine and lifestyle media.",
  },
];

function ClientLogo({
  client,
}: {
  client: (typeof clients)[number];
}) {
  return (
    <li className="client-logo" aria-label={client.name}>
      <img
        className="client-logo__grey"
        src={`/logos/${client.slug}-grey.png`}
        alt={client.name}
      />
      <img
        className="client-logo__color"
        src={`/logos/${client.slug}-color.png`}
        alt=""
        aria-hidden="true"
      />
    </li>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const visibleFeatures = Array.from({ length: 3 }, (_, index) => {
    return features[(currentFeature + index) % features.length];
  });

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    const wordObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            wordObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.72, rootMargin: "0px 0px -16% 0px" },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });
    document.querySelectorAll(".tagline-word").forEach((element) => {
      wordObserver.observe(element);
    });

    return () => {
      revealObserver.disconnect();
      wordObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  function handleInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = [
      `Name: ${form.get("name")}`,
      `Company: ${form.get("company")}`,
      `Website: ${form.get("website")}`,
      `Email: ${form.get("email")}`,
      `Project type: ${form.get("projectType")}`,
      `Launch date: ${form.get("launchDate") || "Not specified"}`,
      "",
      "What they are looking to accomplish:",
      `${form.get("goals")}`,
    ].join("\n");

    window.location.href = `mailto:leah@lgprinc.com?subject=${encodeURIComponent(
      `New LGPR inquiry from ${form.get("company") || form.get("name")}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="shell nav-wrap">
          <a className="wordmark" href="#top" aria-label="LGPR home">
            LGPR
          </a>
          <nav
            className={`nav-links ${menuOpen ? "is-open" : ""}`}
            aria-label="Primary navigation"
          >
            <a href="#expertise" onClick={() => setMenuOpen(false)}>
              Expertise
            </a>
            <a href="#work" onClick={() => setMenuOpen(false)}>
              Work
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </nav>
          <a className="button button--small nav-cta" href="#contact">
            Start a conversation
          </a>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
        <div
          id="mobile-navigation"
          className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
        >
          <a href="#expertise" onClick={() => setMenuOpen(false)}>
            Expertise
          </a>
          <a href="#work" onClick={() => setMenuOpen(false)}>
            Work
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Start a conversation
          </a>
        </div>
      </header>

      <main id="main-content">
        <section id="top" className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow">Hospitality · Culinary · Lifestyle</p>
            <h1>
              Get the kind of <span>attention</span>
              <br /> your brand deserves.
            </h1>
            <p className="hero-intro">
              You&apos;ve built something worth knowing about. LGPR helps the
              right editors, travelers, diners and tastemakers notice it, with
              senior led PR shaped by smart strategy and relationships that
              matter.
            </p>
            <div className="hero-actions">
              <a className="button button--dark" href="#contact">
                Start a conversation <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="#work">
                See selected work <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="hero-note">
              Los Angeles · San Francisco Bay Area · San Diego
            </p>
          </div>

          <div className="hero-visual" aria-label="LGPR hospitality experience">
            <img
              className="hero-image"
              src="/images/hospitality.webp"
              alt="Warm, design-led hotel guest room"
            />
            <div className="hero-caption">
              <span>Senior led PR</span>
              <span>Since 2012</span>
            </div>
            <div className="hero-inset">
              <img
                src="/images/culinary.webp"
                alt="Restaurant dish styled for a culinary story"
              />
              <span>Stories worth repeating</span>
            </div>
            <div className="hero-seal" aria-hidden="true">
              <span>LGPR</span>
              <small>Strategy · Story · Reach</small>
            </div>
          </div>
        </section>

        <section
          className="credibility shell reveal"
          aria-label="LGPR credentials"
          data-reveal
        >
          <div>
            <strong>20+ years</strong>
            <span>Experience per principal</span>
          </div>
          <div>
            <strong>Senior led</strong>
            <span>Your account stays senior</span>
          </div>
          <div>
            <strong>National reach</strong>
            <span>Local, regional & national media</span>
          </div>
        </section>

        <section
          className="client-proof reveal"
          aria-labelledby="client-proof-title"
          data-reveal
        >
          <div className="shell client-proof__head">
            <p id="client-proof-title" className="eyebrow">
              Selected client experience
            </p>
            <p>Hover a name to see it in color</p>
          </div>
          <div className="client-window">
            <div className="client-track">
              <ul className="client-group">
                {clients.map((client) => (
                  <ClientLogo key={client.slug} client={client} />
                ))}
              </ul>
              <ul className="client-group" aria-hidden="true">
                {clients.map((client) => (
                  <ClientLogo key={`repeat-${client.slug}`} client={client} />
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="tagline-section" aria-label="Our approach">
          <div className="shell tagline-wrap">
            <p className="eyebrow">The story is the strategy</p>
            <p className="tagline-copy">
              {tagline.split(" ").map((word, index) => (
                <span
                  className="tagline-word"
                  style={{ transitionDelay: `${index * 34}ms` }}
                  key={`${word}-${index}`}
                >
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>
        </section>

        <section id="expertise" className="expertise-section reveal" data-reveal>
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">Where we work</p>
              <h2>
                Built for brands with a <em>point of view.</em>
              </h2>
              <p>
                Deep category fluency lets us move quickly, speak credibly and
                spot the story before it becomes obvious.
              </p>
            </div>

            <div className="expertise-grid">
              <article className="expertise-card">
                <img
                  src="/images/hospitality.webp"
                  alt="Luxury hotel interior"
                />
                <div className="expertise-card__content">
                  <span>01</span>
                  <h3>Hospitality</h3>
                  <p>
                    Openings, renovations and rebrands that stay relevant long
                    after the first announcement.
                  </p>
                </div>
              </article>
              <article className="expertise-card">
                <img
                  src="/images/culinary.webp"
                  alt="Restaurant burger and beer"
                />
                <div className="expertise-card__content">
                  <span>02</span>
                  <h3>Culinary</h3>
                  <p>
                    Chefs and restaurants positioned through stories diners
                    want to experience and editors want to cover.
                  </p>
                </div>
              </article>
              <article className="expertise-card">
                <img src="/images/lifestyle.webp" alt="Lifestyle food product" />
                <div className="expertise-card__content">
                  <span>03</span>
                  <h3>Lifestyle</h3>
                  <p>
                    Distinctive brands translated into timely ideas, cultural
                    relevance and meaningful visibility.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="work" className="work-section reveal" data-reveal>
          <div className="shell">
            <div className="section-heading section-heading--light">
              <p className="eyebrow">Selected experience</p>
              <h2>
                Work that earns <em>attention.</em>
              </h2>
              <p>
                A closer look at how LGPR turns a brand&apos;s strongest
                qualities into stories with staying power.
              </p>
            </div>

            <div className="work-list">
              {work.map((item) => (
                <article className="work-card" key={item.client}>
                  <div className="work-card__image">
                    <img src={item.image} alt="" />
                    <span>{item.number}</span>
                  </div>
                  <div className="work-card__content">
                    <p className="eyebrow">{item.category}</p>
                    <h3>{item.client}</h3>
                    <p className="work-card__title">{item.title}</p>
                    <dl>
                      <div>
                        <dt>Challenge</dt>
                        <dd>{item.challenge}</dd>
                      </div>
                      <div>
                        <dt>Approach</dt>
                        <dd>{item.approach}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>

            <div className="work-cta">
              <p>
                Need a launch, repositioning or long term PR partner with
                category experience?
              </p>
              <a className="button button--light" href="#contact">
                Start a conversation <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className="features-section reveal"
          aria-labelledby="features-title"
          data-reveal
        >
          <div className="shell">
            <div className="features-heading">
              <div>
                <p className="eyebrow">Press in the wild</p>
                <h2 id="features-title">Recent Client Features</h2>
              </div>
              <p>
                A glimpse at the stories, destinations and culinary talent LGPR
                clients are bringing to a wider audience.
              </p>
              <div className="feature-count" aria-live="polite">
                <span>{String(currentFeature + 1).padStart(2, "0")}</span>
                <span>/</span>
                <span>{String(features.length).padStart(2, "0")}</span>
              </div>
            </div>

            <div className="feature-gallery">
              <button
                className="feature-arrow feature-arrow--previous"
                type="button"
                aria-label="Show previous client features"
                onClick={() =>
                  setCurrentFeature(
                    (currentFeature - 1 + features.length) % features.length,
                  )
                }
              >
                <span aria-hidden="true">←</span>
              </button>

              <div className="feature-grid">
                {visibleFeatures.map((feature, index) => (
                  <a
                    className="feature-card"
                    href={feature.href}
                    target="_blank"
                    rel="noreferrer"
                    key={`${currentFeature}-${feature.publication}`}
                    aria-label={`View ${feature.publication} client feature from ${feature.date}`}
                  >
                    <div className="feature-card__art">
                      <img src={feature.image} alt="" />
                      <span className="feature-card__number">
                        {String(
                          ((currentFeature + index) % features.length) + 1,
                        ).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="feature-card__meta">
                      <strong>{feature.publication}</strong>
                      <span>{feature.date}</span>
                      <span aria-hidden="true">↗</span>
                    </div>
                  </a>
                ))}
              </div>

              <button
                className="feature-arrow feature-arrow--next"
                type="button"
                aria-label="Show next client features"
                onClick={() =>
                  setCurrentFeature((currentFeature + 1) % features.length)
                }
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>

        <section className="testimonial-section reveal" data-reveal>
          <div className="shell">
            <div className="quote-mark" aria-hidden="true">
              “
            </div>
            <blockquote>
              I can confidently say there are no public relations experts more
              effective than Leah Goldstein.
            </blockquote>
            <div className="testimonial-meta">
              <span>Chip Conley</span>
              <span>
                Founder & former CEO, Joie de Vivre Hospitality
                <br />
                Former head of global hospitality & strategy, Airbnb
              </span>
            </div>
          </div>
        </section>

        <section id="about" className="team-section reveal" data-reveal>
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">The senior team</p>
              <h2>
                Experience you actually <em>work with.</em>
              </h2>
            </div>
            <div className="team-grid">
              <article className="team-member">
                <img src="/images/leah.webp" alt="Leah Goldstein" />
                <div>
                  <p className="eyebrow">Founder · 20+ years</p>
                  <h3>Leah Goldstein</h3>
                  <p>
                    Culinary, luxury hospitality and lifestyle PR experience
                    across New York, Los Angeles and San Francisco agency
                    markets.
                  </p>
                </div>
              </article>
              <article className="team-member">
                <img src="/images/tory.webp" alt="Tory Weiss" />
                <div>
                  <p className="eyebrow">Principal · 20+ years</p>
                  <h3>Tory Weiss</h3>
                  <p>
                    Travel, hospitality, destination, luxury hotel and high end
                    real estate expertise focused on awareness and demand.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section reveal" data-reveal>
          <div className="shell contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">Start here</p>
              <h2>
                You&apos;ve built something worth talking about.
                <em> Let&apos;s make sure people hear about it.</em>
              </h2>
              <p>
                Tell us what you&apos;re building, changing or launching. We&apos;ll
                start with the opportunity and take it from there.
              </p>
              <a href="mailto:leah@lgprinc.com">leah@lgprinc.com ↗</a>
            </div>

            <form className="inquiry-form" onSubmit={handleInquiry}>
              <div className="form-row">
                <label>
                  <span>Name</span>
                  <input name="name" type="text" autoComplete="name" required />
                </label>
                <label>
                  <span>Company</span>
                  <input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </label>
                <label>
                  <span>Website</span>
                  <input
                    name="website"
                    type="url"
                    inputMode="url"
                    placeholder="https://"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  <span>Project type</span>
                  <select name="projectType" defaultValue="" required>
                    <option value="" disabled>
                      Select one
                    </option>
                    <option>Hotel or restaurant launch</option>
                    <option>Brand repositioning</option>
                    <option>Ongoing brand PR</option>
                    <option>Chef or executive PR</option>
                    <option>Media event or experience</option>
                    <option>Something else</option>
                  </select>
                </label>
                <label>
                  <span>Launch date</span>
                  <input name="launchDate" type="date" />
                </label>
              </div>
              <label>
                <span>What are you looking to accomplish?</span>
                <textarea name="goals" rows={4} required />
              </label>
              <button className="button button--dark" type="submit">
                Start a conversation <span aria-hidden="true">→</span>
              </button>
              <p className="form-note">
                Submitting opens your email app with these details ready to
                send.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-top">
          <a className="wordmark wordmark--footer" href="#main-content">
            LGPR
          </a>
          <p>Hospitality · Culinary · Lifestyle PR</p>
          <a href="mailto:leah@lgprinc.com">leah@lgprinc.com</a>
        </div>
        <div className="shell footer-bottom">
          <span>© {new Date().getFullYear()} LGPR, Inc.</span>
          <span>Los Angeles · San Francisco Bay Area · San Diego</span>
          <span className="footer-legal">
            <a href="mailto:leah@lgprinc.com?subject=Privacy%20inquiry">
              Privacy
            </a>
            <a href="mailto:leah@lgprinc.com?subject=Terms%20inquiry">Terms</a>
          </span>
        </div>
      </footer>
    </>
  );
}
