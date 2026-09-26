import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  CirclePlay,
  Instagram,
  Menu,
  MessageCircle,
  Pause,
  PartyPopper,
  Play,
  Send,
  Share2,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';

const eventDeck = [
  {
    title: 'Love Island: Sapphic Edition',
    detail: 'Bombshell entrances. Live votes. One finale.',
    label: 'Live competition',
    className: 'deck-love-island',
    fileName: 'love-island-01.webp',
  },
  {
    title: 'Pop the Balloon',
    detail: 'Matchmaking with a very public pop.',
    label: 'Live matchmaking',
    className: 'deck-balloon',
    fileName: 'pop-the-balloon-01.webp',
  },
  {
    title: 'Ask A Masc',
    detail: 'Audience questions. Unfiltered answers.',
    label: 'Comedy panel',
    className: 'deck-ask-a-masc',
    fileName: 'ask-a-masc-01.webp',
  },
];

const caseStudies = {
  'love-island': {
    title: 'Love Island: Sapphic Edition',
    type: 'Live reality dating competition',
    location: 'Three Dollar Bill, Brooklyn',
    date: 'August 2026',
    moment: 'Bombshell entrances and live audience voting into a finale.',
    summary:
      'A familiar reality-TV format rebuilt for a live queer audience, complete with casting, challenges, audience decisions and a final couple.',
    produced: ['Casting flow', 'Run-of-show', 'Cue cards', 'Contractor agreements', 'Sponsorship deck'],
    className: 'deck-love-island',
  },
  'pop-the-balloon': {
    title: 'Pop the Balloon',
    type: 'Live matchmaking show',
    location: 'New York City',
    date: 'Portfolio archive',
    moment: 'Contestants pop to reject, live, in front of the room.',
    summary:
      'A fast, funny matchmaking format where every choice is immediate, visible and built for the audience reaction shot.',
    produced: ['Format design', 'Casting flow', 'Host beats', 'Run-of-show', 'Audience experience'],
    className: 'deck-balloon',
  },
  'ask-a-masc': {
    title: 'Ask A Masc',
    type: 'Comedy panel',
    location: 'New York City',
    date: 'Portfolio archive',
    moment: 'Audience questions, unfiltered answers, live.',
    summary:
      'A direct-to-audience comedy panel designed around candid questions, sharp personalities and highly clippable answers.',
    produced: ['Panel format', 'Question flow', 'Host beats', 'Stage management', 'Content moments'],
    className: 'deck-ask-a-masc',
  },
};

const services = [
  {
    title: 'Live shows',
    copy: 'Interactive events pulled from trending TV and media formats.',
    icon: CirclePlay,
  },
  {
    title: 'Parties',
    copy: 'Celebrations with a plot, not just a playlist.',
    icon: PartyPopper,
  },
  {
    title: 'Pop-ups',
    copy: 'Surprise, one-day-only signature offerings.',
    icon: ShoppingBag,
  },
  {
    title: 'Brand activations',
    copy: 'Interactive product placements with clippable moments.',
    icon: Star,
  },
];

const ideaCards = [
  {
    industry: 'Influencer',
    title: 'Creator brand launch',
    moment: 'Followers vote live on the finale reveal, streamed from the room.',
    number: '01',
  },
  {
    industry: 'Consumer products',
    title: 'Game-show pop-up',
    moment: 'Guests play to win product; the grand prize lands on camera.',
    number: '02',
  },
  {
    industry: 'Tech + media',
    title: 'Launch or live podcast',
    moment: 'The audience decides the twist; the demo becomes the final round.',
    number: '03',
  },
  {
    industry: 'Fashion',
    title: 'Collection launch',
    moment: 'The crowd casts the runway live, or the sale becomes an auction show.',
    number: '04',
  },
];

function App() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(
    () =>
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !sessionStorage.getItem('fyp-intro-seen'),
  );

  useEffect(() => {
    if (!showIntro) return undefined;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem('fyp-intro-seen', 'true');
      setShowIntro(false);
      window.setTimeout(() => document.querySelector('.wordmark')?.focus(), 0);
    }, 2700);
    return () => window.clearTimeout(timer);
  }, [showIntro]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const section = new URLSearchParams(location.search).get('section');
    if (section) {
      window.setTimeout(() => document.getElementById(section)?.scrollIntoView(), 0);
    }
    const title = location.pathname.startsWith('/work/')
      ? `${caseStudies[location.pathname.split('/').pop()]?.title || 'Work'} | FYP Events`
      : location.pathname === '/work'
        ? 'Selected Work | FYP Events'
        : location.pathname === '/quote'
          ? 'Book a Consultation | FYP Events'
          : 'FYP Events | Made for your page. Built to go viral.';
    document.title = title;
  }, [location.pathname, location.search]);

  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.14 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {showIntro && (
        <Intro
          onSkip={() => {
            sessionStorage.setItem('fyp-intro-seen', 'true');
            setShowIntro(false);
            window.setTimeout(() => document.querySelector('.wordmark')?.focus(), 0);
          }}
        />
      )}
      <SiteHeader />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}

function Intro({ onSkip }) {
  const skipRef = useRef(null);

  useEffect(() => {
    skipRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onSkip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

  return (
    <div className="intro" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <button ref={skipRef} className="intro-skip" type="button" onClick={onSkip}>
        Skip intro
      </button>
      <div className="intro-stage" aria-hidden="true">
        <span className="intro-kicker">A Makayla production</span>
        <div className="intro-word" id="intro-title">
          <span>F</span>
          <span>Y</span>
          <span>P</span>
        </div>
        <p>Made for your page.</p>
        <div className="intro-flash" />
      </div>
    </div>
  );
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const links = [
    { to: '/', label: 'Home' },
    { to: '/work', label: 'Work' },
    { to: '/?section=services', label: 'Services' },
    { to: '/?section=about', label: 'About' },
  ];

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="wordmark" to="/" aria-label="FYP Events home">
          <span className="chrome-text">FYP</span>
          <span>EVENTS</span>
          <small>NYC</small>
        </Link>
        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.label} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <Link className="button button-primary nav-cta" to="/quote" onClick={() => setOpen(false)}>
            Book a consultation
          </Link>
        </nav>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <ServiceSection />
      <SocialProof />
      <IdeaSection />
      <OfferSection />
      <ProcessSection />
      <AboutSection />
      <PortfolioPreview />
      <QuoteSection compact />
    </>
  );
}

function Hero() {
  return (
    <section className="hero page-shell">
      <div className="hero-copy" data-reveal>
        <div className="eyebrow"><span className="live-dot" /> NYC event production</div>
        <h1>
          <span className="chrome-text">Made for your page.</span>
          <br />
          Built to go <span className="signal-text">viral.</span>
        </h1>
        <p className="hero-lede">
          NYC-based event production for influencers and brands that want to stay trendy.
        </p>
        <div className="button-row">
          <Link className="button button-primary" to="/quote">
            Book a consultation <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link className="button button-secondary" to="/work">
            See the work
          </Link>
        </div>
        <p className="byline">By Makayla · Full service, concept to finale</p>
      </div>
      <EventDeck />
      <div className="hero-marquee" aria-hidden="true">
        <span>LIVE SHOWS</span><i>✦</i><span>POP-UPS</span><i>✦</i><span>PARTIES</span><i>✦</i>
        <span>BRAND ACTIVATIONS</span><i>✦</i><span>LIVE SHOWS</span><i>✦</i>
      </div>
    </section>
  );
}

function EventDeck() {
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const hoverPaused = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!hoverPaused.current && !userPaused) {
        setActive((current) => (current + 1) % eventDeck.length);
      }
    }, 4000);
    return () => window.clearInterval(timer);
  }, [userPaused]);

  const move = (direction) => {
    setActive((current) => (current + direction + eventDeck.length) % eventDeck.length);
  };

  return (
    <div
      className="event-deck-wrap"
      data-reveal
      onMouseEnter={() => { hoverPaused.current = true; }}
      onMouseLeave={() => { hoverPaused.current = false; }}
      onFocus={() => { hoverPaused.current = true; }}
      onBlur={() => { hoverPaused.current = false; }}
    >
      <div className="event-deck">
        {eventDeck.map((event, index) => {
          const offset = (index - active + eventDeck.length) % eventDeck.length;
          return (
            <article
              className={`deck-card ${event.className}`}
              data-position={offset}
              key={event.title}
              aria-hidden={offset !== 0}
            >
              <div className="deck-noise" />
              <span className="deck-label">{event.label}</span>
              <div className="deck-content">
                <span className="deck-file">PHOTO SLOT · {event.fileName}</span>
                <h2>{event.title}</h2>
                <p>{event.detail}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="deck-controls">
        <button type="button" aria-label="Previous event" onClick={() => move(-1)}>
          <ArrowLeft aria-hidden="true" />
        </button>
        <span>{String(active + 1).padStart(2, '0')} / {String(eventDeck.length).padStart(2, '0')}</span>
        <button
          type="button"
          aria-label={userPaused ? 'Resume rotating event photos' : 'Pause rotating event photos'}
          aria-pressed={userPaused}
          onClick={() => setUserPaused((current) => !current)}
        >
          {userPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
        <button type="button" aria-label="Next event" onClick={() => move(1)}>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="section-heading" data-reveal>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function ServiceSection() {
  return (
    <section className="section page-shell" id="services">
      <SectionHeading
        eyebrow="What we make"
        title="Four formats. One rule."
        copy="Every event is built around one signature moment: the thing everyone films and posts."
      />
      <div className="service-grid">
        {services.map(({ title, copy, icon: Icon }, index) => (
          <article className="service-card" key={title} data-reveal style={{ '--delay': `${index * 80}ms` }}>
            <div className="service-icon chrome-fill"><Icon aria-hidden="true" /></div>
            <span className="card-number">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <div className="manifesto" data-reveal>
        <strong>No boring events.</strong>
        <span>No stuffy corporate mixers. No moment, no event.</span>
      </div>
    </section>
  );
}

function SocialProof() {
  const stats = [
    ['90%', 'of Gen Z say social content inspired a recent purchase', 'Sprout Social, Q2 2025'],
    ['72%', 'of Gen Z have bought a product directly in a social app', 'Hootsuite, citing Grin'],
    ['61%', 'of consumers are more inclined to buy after a brand event', 'EventTrack 2026'],
  ];
  return (
    <section className="section page-shell">
      <SectionHeading
        eyebrow="Why social-first"
        title="The event is the content."
        copy="We build around what your audience is already watching, so the night keeps working after the lights come up."
      />
      <div className="stats-grid" data-reveal>
        {stats.map(([value, copy, source]) => (
          <article className="stat-card" key={value}>
            <strong className="chrome-text">{value}</strong>
            <p>{copy}</p>
            <cite>{source}</cite>
          </article>
        ))}
      </div>
      <p className="source-note">Industry benchmarks, not FYP Events performance results.</p>
    </section>
  );
}

function IdeaSection() {
  return (
    <section className="section page-shell">
      <SectionHeading
        eyebrow="What this could look like"
        title="Big-agency ideas, without the agency."
        copy="Built for small and mid-sized brands and influencers in NYC."
      />
      <div className="idea-grid">
        {ideaCards.map((idea) => (
          <article className="idea-card" key={idea.industry} data-reveal>
            <span className="idea-number">{idea.number}</span>
            <span className="idea-tag">Idea · {idea.industry}</span>
            <h3>{idea.title}</h3>
            <p>{idea.moment}</p>
            <Sparkles aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}

function OfferSection() {
  const inclusions = [
    'Concept, signature moment and creative direction',
    'Venue sourcing and budget management',
    'Graphics and visual design',
    'Contractor and vendor management',
    'Run-of-show and day-of production',
    'Media coverage and content delivery',
  ];
  return (
    <section className="section page-shell">
      <div className="offer-layout">
        <div data-reveal>
          <div className="eyebrow">The offer</div>
          <h2>One package: start to finale.</h2>
          <p className="section-copy">A flat fee, quoted after a 30-minute consultation.</p>
        </div>
        <div className="offer-card chrome-border" data-reveal>
          <div>
            <span className="offer-label">Full service</span>
            <ul>
              {inclusions.map((item) => (
                <li key={item}><Check aria-hidden="true" /> {item}</li>
              ))}
            </ul>
            <Link className="button button-primary" to="/quote">
              Book the consult <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="why-grid">
          {[
            ['You work with me.', 'No account team, no handoffs. I take one event at a time.'],
            ['One number, up front.', 'Flat fee. No percentage creep or agency markup.'],
            ['Trend-driven, not trend-chasing.', 'The concept starts with what your audience is already watching.'],
            ['Your target audience is in the room.', 'Gen Z instincts, backed by serious production planning.'],
          ].map(([title, copy]) => (
            <article key={title} data-reveal>
              <Zap aria-hidden="true" />
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    ['Consult', 'Goal, crowd and budget. Thirty minutes, free.'],
    ['Trend scan', 'What is moving in your audience’s feeds right now.'],
    ['The pitch', 'A concept deck built around your signature moment.'],
    ['Planning', 'Venue, vendors, budget and run-of-show.'],
    ['Execution', 'I run the night on site, cue to cue.'],
    ['Afterglow', 'Photos, video and content ready to post.'],
  ];
  return (
    <section className="section page-shell">
      <SectionHeading eyebrow="How it works" title="From DM to finale." />
      <ol className="process-list">
        {steps.map(([title, copy], index) => (
          <li key={title} data-reveal>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="section page-shell" id="about">
      <div className="about-card" data-reveal>
        <div className="portrait chrome-border" aria-label="Photo placeholder for Makayla">
          <div className="portrait-inner">
            <span>HEADSHOT</span>
            <strong>M</strong>
          </div>
        </div>
        <div>
          <span className="handle">@fypevents · founder</span>
          <h2>Meet Makayla.</h2>
          <p>
            I love building event concepts nobody’s done before, from the first wild idea to the
            last cue card. Years as a product manager in tech mean the chaos you see on the night
            runs on a very serious spreadsheet.
          </p>
          <div className="tag-row">
            <span>Event host</span><span>Social butterfly</span><span>Thrill seeker</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortfolioPreview() {
  return (
    <section className="section page-shell">
      <SectionHeading
        eyebrow="The work"
        title="Formats, proven live."
        copy="Super Sapphic is where Makayla built and tested live reality-TV formats with an audience in the room."
      />
      <div className="work-grid">
        {Object.entries(caseStudies).map(([slug, item]) => (
          <Link className={`work-card ${item.className}`} to={`/work/${slug}`} key={slug} data-reveal>
            <span>{item.type}</span>
            <div><h3>{item.title}</h3><p>{item.moment}</p></div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        ))}
      </div>
      <Link className="text-link" to="/work">Explore all work <ArrowRight aria-hidden="true" /></Link>
    </section>
  );
}

function QuoteSection({ compact = false }) {
  const [status, setStatus] = useState('');
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!endpoint) {
      setStatus('Your form is ready. Add a Formspree endpoint before launch to receive submissions.');
      return;
    }
    setStatus('Sending...');
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(event.currentTarget),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      setStatus('That did not send. Please try again or contact FYP Events directly.');
      return;
    }
    event.currentTarget.reset();
    setStatus('Got it. Makayla reads every one herself and replies within 2 business days.');
  }

  return (
    <section className={`section page-shell quote-section ${compact ? 'is-compact' : ''}`}>
      <SectionHeading
        eyebrow="Get a quote"
        title="Slide into the DMs."
        copy="Got an idea that’s too weird for everyone else? Perfect."
      />
      <form className="quote-form" onSubmit={handleSubmit}>
        <div className="dm-header">
          <div className="dm-avatar chrome-fill">FYP</div>
          <div><strong>FYP Events</strong><span>Typically replies within 2 business days</span></div>
        </div>
        <p className="dm-bubble">What should everyone be talking about the next morning?</p>
        <div className="form-grid">
          <Field label="Name" name="name" required placeholder="Jordan Lee" />
          <Field label="Email" name="email" required type="email" placeholder="jordan@brand.com" />
          <Field label="Company" name="company" placeholder="Brand or creator name" />
          <label>
            <span>Event type</span>
            <select name="eventType" defaultValue="Brand activation">
              <option>Brand activation</option><option>Pop-up</option><option>Live show</option><option>Party</option>
            </select>
            <ChevronDown aria-hidden="true" />
          </label>
          <Field label="Date or season" name="date" placeholder="Spring 2027" />
          <Field label="Guest count" name="guests" inputMode="numeric" placeholder="150" />
          <label className="full-field">
            <span>Budget range *</span>
            <select name="budget" required defaultValue="">
              <option value="" disabled>Select a range</option>
              <option>Under $5k</option><option>$5–15k</option><option>$15–30k</option>
              <option>$30–50k</option><option>$50k+</option>
            </select>
            <ChevronDown aria-hidden="true" />
          </label>
          <label className="full-field">
            <span>The signature moment</span>
            <textarea
              name="moment"
              rows="4"
              placeholder="The CEO walks out as the surprise final contestant..."
            />
          </label>
        </div>
        <div className="form-footer">
          <p role="status" aria-live="polite">{status || 'No spam. No account team. Just Makayla.'}</p>
          <button className="button button-primary" type="submit">
            Send inquiry <Send aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <label>
      <span>{label}{inputProps.required ? ' *' : ''}</span>
      <input {...inputProps} />
    </label>
  );
}

function WorkPage() {
  return (
    <div className="subpage page-shell">
      <div className="page-hero" data-reveal>
        <div className="eyebrow">Selected work</div>
        <h1>Built in public.<br /><span className="chrome-text">Tested live.</span></h1>
        <p>
          Super Sapphic is Makayla’s queer entertainment production company, specializing in
          reality-TV formats with live audiences. It is where the formats were built and tested.
        </p>
      </div>
      <div className="case-list">
        {Object.entries(caseStudies).map(([slug, item], index) => (
          <Link to={`/work/${slug}`} className="case-row" key={slug} data-reveal>
            <span className="case-index">0{index + 1}</span>
            <div className={`case-image ${item.className}`}>
              <Camera aria-hidden="true" /><span>{eventDeck[index].fileName}</span>
            </div>
            <div className="case-copy">
              <span>{item.type}</span>
              <h2>{item.title}</h2>
              <p>{item.moment}</p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        ))}
      </div>
      <QuoteBanner />
    </div>
  );
}

function CaseStudyPage() {
  const { slug } = useParams();
  const item = caseStudies[slug];
  if (!item) return <WorkPage />;
  return (
    <div className="subpage page-shell">
      <Link className="back-link" to="/work"><ArrowLeft aria-hidden="true" /> All work</Link>
      <div className="case-hero" data-reveal>
        <div>
          <span className="eyebrow">{item.type}</span>
          <h1>{item.title}</h1>
          <p>{item.summary}</p>
        </div>
        <div className={`case-visual ${item.className}`}>
          <Camera aria-hidden="true" />
          <span>Replace with event photography</span>
        </div>
      </div>
      <section className="case-details" data-reveal>
        <div>
          <span className="detail-label">The signature moment</span>
          <h2>{item.moment}</h2>
        </div>
        <dl>
          <div><dt>Location</dt><dd>{item.location}</dd></div>
          <div><dt>Date</dt><dd>{item.date}</dd></div>
        </dl>
      </section>
      <section className="production-section" data-reveal>
        <div>
          <span className="eyebrow">What Makayla produced</span>
          <h2>Fun in front.<br />Buttoned up backstage.</h2>
        </div>
        <ul>
          {item.produced.map((piece) => <li key={piece}><Check aria-hidden="true" />{piece}</li>)}
        </ul>
      </section>
      <div className="photo-strip" aria-label="Event photo placeholders">
        {[1, 2, 3].map((number) => (
          <div className={item.className} key={number} data-reveal>
            <Camera aria-hidden="true" /><span>PHOTO {number}</span>
          </div>
        ))}
      </div>
      <QuoteBanner />
    </div>
  );
}

function QuoteBanner() {
  return (
    <section className="quote-banner" data-reveal>
      <div><span className="eyebrow">Your turn</span><h2>Let’s make the moment.</h2></div>
      <Link className="button button-primary" to="/quote">Book a consultation <ArrowUpRight aria-hidden="true" /></Link>
    </section>
  );
}

function QuotePage() {
  return (
    <div className="subpage">
      <QuoteSection />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <Link className="wordmark" to="/"><span className="chrome-text">FYP</span><span>EVENTS</span></Link>
        <p>New York City · Made for your page. Built to go viral.</p>
        <div className="social-links">
          <span className="social-placeholder">
            <Instagram aria-hidden="true" /><span className="sr-only">Instagram link coming soon</span>
          </span>
          <span className="social-placeholder">
            <Share2 aria-hidden="true" /><span className="sr-only">TikTok link coming soon</span>
          </span>
        </div>
        <small>© 2026 FYP Events. All rights reserved.</small>
      </div>
    </footer>
  );
}

export default App;
