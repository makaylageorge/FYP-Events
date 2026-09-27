import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  Instagram,
  Menu,
  Pause,
  Play,
  Send,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';

const galleryImages = Array.from({ length: 12 }, (_, index) => {
  const fileName = `gallery-${String(index + 1).padStart(2, '0')}.webp`;
  return {
    fileName,
    image: `${import.meta.env.BASE_URL}images/${fileName}`,
    alt: `Guests enjoying an FYP Events production, photo ${index + 1}`,
  };
});

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function formatCurrency(amount) {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

function calculateQuoteRange(guestCount, budgetAmount) {
  const maximumFee = Math.max(1, Math.floor(budgetAmount / 2));
  const useLargerEventRange = budgetAmount >= 2000 && (guestCount > 500 || budgetAmount > 15000);
  const baseMinimum = useLargerEventRange ? 2000 : 500;
  const baseMaximum = useLargerEventRange ? 4000 : 1000;
  const minimum = Math.min(baseMinimum, maximumFee);
  const maximum = Math.min(baseMaximum, maximumFee);

  if (minimum === maximum) return `Up to ${formatCurrency(maximum)}`;
  return `${formatCurrency(minimum)}–${formatCurrency(maximum)}`;
}

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
    const title = location.pathname === '/quote'
      ? 'Get a Quote | FYP Events'
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
      if (event.key === 'Tab') {
        event.preventDefault();
        skipRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

  return (
    <div className="intro" role="dialog" aria-modal="true" aria-label="FYP Events introduction">
      <button ref={skipRef} className="intro-skip" type="button" onClick={onSkip}>
        Skip intro
      </button>
      <div className="intro-stage" aria-hidden="true">
        <span className="intro-kicker">A Makayla production</span>
        <div className="intro-word"><span>FYP</span></div>
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

  const closeMenu = () => {
    if (!open) return;
    setOpen(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 0);
  };

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="wordmark" to="/" aria-label="FYP Events home">
          <span className="chrome-text">FYP</span>
          <span>EVENTS</span>
          <small>NYC</small>
        </Link>
        <nav id="main-navigation" className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.label} to={link.to} end={link.to === '/'} onClick={closeMenu}>
              {link.label}
            </NavLink>
          ))}
          <Link className="button button-primary nav-cta" to="/quote" onClick={closeMenu}>
            Book a consultation
          </Link>
        </nav>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="main-navigation"
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
      <WhyFypSection />
      <OfferSection />
      <QuoteCalculator />
      <AboutSection />
      <PortfolioPreview />
      <InquirySection />
    </>
  );
}

function WhyFypSection() {
  const process = [
    {
      key: 'Ideate',
      title: 'Start from the feed.',
      copy: 'We turn the content, media and trends your audience already loves into dynamic event themes and interactions.',
      stat: '#1',
      proof: 'search destination for Gen Z is social media, including TikTok and Instagram',
      source: 'Sprout Social, 2025',
    },
    {
      key: 'Implement',
      title: 'Bring the concept to life.',
      copy: 'We plan the event from start to finish, including on-site operations, contractors, vendors and media coverage.',
      stat: '61%',
      proof: 'of consumers are more inclined to buy after a brand event',
      source: 'EventTrack 2026',
    },
    {
      key: 'Influence',
      title: 'Generate buzz.',
      copy: 'Generate organic, user-created content that keeps engagement going after the event, plus polished recap content from our content team.',
      stat: '90%',
      proof: 'of Gen Z say social content influenced them to make a purchase',
      source: 'Sprout Social, 2025',
    },
  ];
  const audiences = [
    ['Influencers', 'Launch party, birthday party, brand activation, fan meet-up'],
    ['Consumer products', 'Brand launch, product giveaway, sampling pop-up, retail pop-up'],
    ['Tech & media', 'Product launch, app launch party, live podcast taping, premiere'],
    ['Fashion', 'Collection launch, runway show, sample sale, store opening'],
  ];

  return (
    <section className="why-fyp page-shell" id="services">
      <div className="why-fyp-intro" data-reveal>
        <div className="eyebrow">Why FYP Events</div>
        <h2>We don't do <span>dull</span> or <span>basic.</span></h2>
      </div>

      <h3 className="process-label" data-reveal>Our creative process</h3>
      <div className="why-method">
        {process.map((step, index) => (
          <article className="why-step" key={step.key} data-reveal style={{ '--delay': `${index * 90}ms` }}>
            <span className="why-step-key">0{index + 1} · {step.key}</span>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
            <div className={`why-proof ${step.stat ? '' : 'is-text-only'}`}>
              {step.stat && <strong className="chrome-text">{step.stat}</strong>}
              <span>{step.proof}</span>
              <cite>{step.source}</cite>
            </div>
          </article>
        ))}
      </div>
      <p className="benchmark-note">Industry benchmarks, not FYP Events results.</p>

      <div className="tailored-panel" data-reveal>
        <div className="tailored-heading">
          <div className="eyebrow">Who it’s for</div>
          <h2>Tailored events, personally produced.</h2>
          <p>For small and mid-sized brands and influencers in NYC.</p>
        </div>
        <div className="tailored-table">
          <h3>What we make</h3>
          <ul>
            {audiences.map(([audience, examples]) => (
              <li key={audience}>
                <strong>{audience}</strong>
                <span>{examples}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  );
}

function Hero() {
  return (
    <section className="hero page-shell">
      <div className="hero-copy" data-reveal>
        <div className="eyebrow"><span className="live-dot" /> A New York City event production company</div>
        <h1>
          <span className="chrome-text">Made for your page.</span>
          <br />
          Built to go <span className="signal-text">viral.</span>
        </h1>
        <p className="hero-lede">
          We turn what's trending into live events and moments that are meant to go viral.
        </p>
        <div className="button-row">
          <Link className="button button-primary" to="/quote">
            Get a quote
          </Link>
          <Link className="button button-secondary" to="/quote">
            Book a consultation
          </Link>
        </div>
        <div className="producer-credit">
          <div className="producer-mark chrome-border">
            <img
              src={`${import.meta.env.BASE_URL}images/makayla-headshot-square.webp`}
              alt="Makayla, producer of FYP Events"
            />
          </div>
          <div className="producer-copy">
            <strong>Full-service party &amp; event production company</strong>
            <span>Produced by <b>Makayla</b><i aria-label="Verified producer">✦</i></span>
          </div>
        </div>
      </div>
      <EventDeck />
    </section>
  );
}

function EventDeck() {
  const [deckImages] = useState(() => shuffled(galleryImages));
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const hoverPaused = useRef(false);
  const pointerStartY = useRef(null);
  const pageCount = 4;
  const feedPages = Array.from({ length: pageCount }, (_, pageIndex) =>
    deckImages.slice(pageIndex * 3, pageIndex * 3 + 3),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!hoverPaused.current && !userPaused) {
        setActive((current) => (current + 1) % pageCount);
      }
    }, 4500);
    return () => window.clearInterval(timer);
  }, [userPaused]);

  const move = (direction) => {
    setActive((current) => (current + direction + pageCount) % pageCount);
  };

  const handlePointerDown = (event) => {
    pointerStartY.current = event.clientY;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (pointerStartY.current === null) return;
    const distance = pointerStartY.current - event.clientY;
    pointerStartY.current = null;
    if (Math.abs(distance) >= 45) move(distance > 0 ? 1 : -1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') move(1);
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') move(-1);
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
      <div className="phone-shell chrome-border">
        <div
          className="event-deck"
          aria-label="Shuffled photos from FYP Events"
          aria-roledescription="carousel"
          tabIndex="0"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { pointerStartY.current = null; }}
          onKeyDown={handleKeyDown}
        >
          <div className="explore-header">
            <div className="phone-status">
              <span>9:41</span>
              <span className="phone-island" aria-hidden="true" />
              <span className="phone-system" aria-hidden="true">
                <i /><i /><i /><b />
              </span>
            </div>
            <div className="phone-brand">
              <strong><span><Sparkles aria-hidden="true" /></span> FYP <small>EVENTS</small></strong>
              <button
                type="button"
                aria-label={userPaused ? 'Resume automatic event feed' : 'Pause automatic event feed'}
                aria-pressed={userPaused}
                onClick={(event) => {
                  event.stopPropagation();
                  setUserPaused((current) => !current);
                }}
              >
                {userPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              </button>
            </div>
            <div className="explore-tabs" aria-hidden="true">
              <span className="is-active">Explore</span>
              <span>All</span>
              <span>Live shows</span>
            </div>
          </div>
          <div className="explore-scroll" aria-live="off">
            <div className="explore-feed" style={{ '--explore-page': active }}>
              {feedPages.map((images, pageIndex) => (
                <section
                  className="feed-page"
                  key={images[0].fileName}
                  aria-hidden={active !== pageIndex}
                >
                  <figure className="featured-post">
                    <img src={images[0].image} alt={images[0].alt} />
                    <span className="live-badge">● LIVE</span>
                    <span className="watching-badge">Live event</span>
                  </figure>
                  <div className="feed-meta">
                    <img
                      src={`${import.meta.env.BASE_URL}images/makayla-headshot-square.webp`}
                      alt=""
                    />
                    <div>
                      <strong>Inside an FYP Events production</strong>
                      <span>FYP Events · Made for your page</span>
                    </div>
                  </div>
                  <h3 className="moments-heading"><span>✦</span> Event moments</h3>
                  <div className="shorts-grid">
                    {images.slice(1).map((image) => (
                      <figure key={image.fileName}>
                        <img src={image.image} alt={image.alt} />
                        <Camera aria-hidden="true" />
                        <figcaption>A moment made to share</figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
          <span className="swipe-hint">Swipe to explore</span>
        </div>
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
        <div className="offer-heading" data-reveal>
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
            ['You work directly with me.', 'No account team, no handoffs. I manage one event at a time.'],
            ['One number, up front.', 'Flat fee. No percentage creep or agency markup.'],
            ['Young, fun and fluent in what your audience is watching.', 'A Gen Z perspective with a clear read on trends, culture and how people share experiences.'],
            ['I wear all the hats.', 'I dream up the concept, run the budget, manage the vendors and host the night, so nothing gets lost between handoffs.'],
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

function AboutSection() {
  return (
    <section className="section page-shell" id="about">
      <div className="about-card" data-reveal>
        <div className="portrait chrome-border">
          <div className="portrait-inner">
            <img
              src={`${import.meta.env.BASE_URL}images/makayla-headshot-square.webp`}
              alt="Makayla, founder and producer of FYP Events"
            />
          </div>
        </div>
        <div>
          <span className="handle">@fypevents · founder</span>
          <h2>Meet Makayla.</h2>
          <p>
            I love building event concepts nobody's done before, from the first wild idea to the last cue.
            I spent years as a product manager in tech while simultaneously starting my own event production company,
            organizing and operating logistics for numerous events. I love seeing things come together and
            providing jaw-dropping experiences that don't typically have a space in mainstream culture. I love to shake things up,
            highlight local talent, and grow communities through my work.
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
    <section className="section page-shell last-event-section" id="past-work">
      <div className="last-event-heading" data-reveal>
        <span className="eyebrow">Past work</span>
        <h2>My Last Event</h2>
      </div>
      <div className="last-event-layout">
        <div className="last-event-frame chrome-border" data-reveal>
          <article className="last-event-feature">
            <img
              src={`${import.meta.env.BASE_URL}images/last-event-side-04.webp`}
              alt="Love Island: Sapphic Edition live on stage at Three Dollar Bill"
              loading="lazy"
              decoding="async"
            />
            <div className="last-event-overlay">
              <p className="last-event-meta">Three Dollar Bill, Brooklyn · August 9, 2026</p>
              <h3>Love Island: Sapphic Edition</h3>
              <p className="last-event-description">
                <span>The reality-TV event of the summer, brought live and on stage for a queer NYC audience.</span>
                <br />
                <span>Complete with bombshells, live audience voting and a cash prize.</span>
              </p>
              <a
                className="last-event-link"
                href="https://www.instagram.com/supersapphiccc/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram aria-hidden="true" />
                <span>See more from Super Sapphic</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const eventTypeOptions = [
  'Party',
  'Brand activation',
  'Product launch',
  'Creator event',
  'Live show',
  'Pop-up',
  'Launch party',
  'Birthday or celebration',
  'Live podcast',
  'Premiere',
  'Fashion event',
  'Other',
];

function QuoteExperience() {
  return (
    <>
      <QuoteCalculator />
      <InquirySection />
    </>
  );
}

function QuoteCalculator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    eventName: '',
    eventTypes: [],
    budget: '',
    revenueShareInterested: false,
    guests: '',
    date: '',
    venue: '',
    description: '',
    audience: '',
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const stepHeadingRef = useRef(null);
  const hasNavigated = useRef(false);
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
  const questionCount = 6;
  const isResult = step === questionCount;
  const isQuoteContact = step === questionCount + 1;
  const guestCount = Number(answers.guests);
  const budgetAmount = Number(answers.budget);
  const quoteRange = calculateQuoteRange(guestCount, budgetAmount);
  const today = useMemo(() => {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
    return localDate.toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    if (hasNavigated.current) stepHeadingRef.current?.focus();
  }, [step]);

  function updateAnswer(name, value) {
    setAnswers((current) => ({ ...current, [name]: value }));
  }

  function advance(event) {
    event.preventDefault();
    hasNavigated.current = true;
    setStep((current) => Math.min(current + 1, questionCount));
  }

  function goBack() {
    hasNavigated.current = true;
    setStep((current) => Math.max(current - 1, 0));
  }

  function toggleEventType(option) {
    setAnswers((current) => ({
      ...current,
      eventTypes: current.eventTypes.includes(option)
        ? current.eventTypes.filter((item) => item !== option)
        : [...current.eventTypes, option],
    }));
  }

  async function handleQuoteSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!endpoint) {
      setSubmitStatus('Your form is ready. Add a Formspree endpoint before launch to receive submissions.');
      return;
    }
    setSubmitting(true);
    setSubmitStatus('Sending...');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        setSubmitStatus('That did not send. Please check your details and try again.');
        return;
      }
      setSubmitted(true);
      setSubmitStatus('Inquiry sent. I’ll get back to you within 24 hours.');
    } catch {
      setSubmitStatus('The form could not connect. Please check your internet connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section page-shell quote-builder" id="quote">
      <SectionHeading
        title="Get a Quote"
        copy="Answer a few quick questions and get an estimated production range instantly."
      />
      <div className="quote-wizard" data-reveal>
        <div className="quote-progress">
          <span>
            {isResult
              ? 'Your estimate'
              : isQuoteContact
                ? 'Submit inquiry'
                : `Question ${step + 1} of ${questionCount}`}
          </span>
          <progress
            aria-label="Quote questionnaire progress"
            max={questionCount}
            value={isResult || isQuoteContact ? questionCount : step + 1}
          />
        </div>

        {!isResult && !isQuoteContact && (
          <form className="quote-step" onSubmit={advance}>
            {step === 0 && (
              <>
                <div>
                  <span className="quote-step-number">01</span>
                  <h3 ref={stepHeadingRef} tabIndex="-1">Get a Quote</h3>
                  <p className="quote-primary-prompt">What are we creating?</p>
                  <p>Give the event a working name and choose every format that applies.</p>
                </div>
                <Field
                  label="Event name or concept"
                  name="eventName"
                  required
                  value={answers.eventName}
                  onChange={(event) => updateAnswer('eventName', event.target.value)}
                  placeholder="Summer product launch"
                />
                <MultiChoiceGroup
                  label="Event type — select all that apply"
                  options={eventTypeOptions}
                  values={answers.eventTypes}
                  onChange={toggleEventType}
                />
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <span className="quote-step-number">02</span>
                  <h3 ref={stepHeadingRef} tabIndex="-1">What budget are you working with?</h3>
                  <p>Enter the total event budget you expect to work within.</p>
                </div>
                <Field
                  label="Event budget (USD)"
                  name="budget"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={answers.budget}
                  onChange={(event) => updateAnswer('budget', event.target.value)}
                  placeholder="15000"
                />
                <div className="revenue-share-option">
                  <div>
                    <span className="revenue-share-label">Small-business pricing</span>
                    <strong>Working with a smaller budget?</strong>
                    <p>
                      Small businesses and creators can choose a revenue-share plan. Limited budget?
                      Let&apos;s split the ticket sales. Our revenue-share plan is built for small
                      businesses and creators.
                    </p>
                  </div>
                  <label className="revenue-share-checkbox">
                    <input
                      name="revenueShareInterested"
                      type="checkbox"
                      checked={answers.revenueShareInterested}
                      onChange={(event) => updateAnswer('revenueShareInterested', event.target.checked)}
                    />
                    <span>
                      I&apos;m a small business or creator and I&apos;m interested in the revenue-share
                      plan (a percentage of ticket sales).
                    </span>
                  </label>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <span className="quote-step-number">03</span>
                  <h3 ref={stepHeadingRef} tabIndex="-1">How many people are coming?</h3>
                  <p>Your estimated guest count determines the starting production range.</p>
                </div>
                <Field
                  label="Estimated guest count"
                  name="guests"
                  type="number"
                  min="1"
                  required
                  value={answers.guests}
                  onChange={(event) => updateAnswer('guests', event.target.value)}
                  placeholder="150"
                />
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <span className="quote-step-number">04</span>
                  <h3 ref={stepHeadingRef} tabIndex="-1">When is the event?</h3>
                  <p>Choose the closest date if the final timing is not locked yet.</p>
                </div>
                <Field
                  label="Event date"
                  name="date"
                  type="date"
                  min={today}
                  required
                  value={answers.date}
                  onChange={(event) => updateAnswer('date', event.target.value)}
                />
              </>
            )}

            {step === 4 && (
              <>
                <div>
                  <span className="quote-step-number">05</span>
                  <h3 ref={stepHeadingRef} tabIndex="-1">Do you have a venue in mind?</h3>
                  <p>Share a venue, neighborhood or simply tell us you need recommendations.</p>
                </div>
                <Field
                  label="Venue of interest"
                  name="venue"
                  required
                  value={answers.venue}
                  onChange={(event) => updateAnswer('venue', event.target.value)}
                  placeholder="Rooftop, outdoor space or nightlife venue"
                />
              </>
            )}

            {step === 5 && (
              <>
                <div>
                  <span className="quote-step-number">06</span>
                  <h3 ref={stepHeadingRef} tabIndex="-1">Tell us about the experience.</h3>
                  <p>What should happen, who is it for and what should guests remember?</p>
                </div>
                <label className="quote-textarea">
                  <span>Event description *</span>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={answers.description}
                    onChange={(event) => updateAnswer('description', event.target.value)}
                    placeholder="Describe the event format, goals and key moments."
                  />
                </label>
                <label className="quote-textarea">
                  <span>Target audience *</span>
                  <textarea
                    name="audience"
                    required
                    rows="3"
                    value={answers.audience}
                    onChange={(event) => updateAnswer('audience', event.target.value)}
                    placeholder="Creators, customers, press, local community or another audience."
                  />
                </label>
              </>
            )}

            <div className="quote-actions">
              {step > 0 && (
                <button className="button quote-back" type="button" onClick={goBack}>
                  <ArrowLeft aria-hidden="true" /> Back
                </button>
              )}
              <button
                className="button button-primary quote-next"
                type="submit"
                disabled={step === 0 && answers.eventTypes.length === 0}
              >
                {step === questionCount - 1 ? 'See my quote' : 'Next'}
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </form>
        )}

        {isResult && (
          <div
            className={`quote-result ${answers.revenueShareInterested ? 'revenue-share-quote-result' : ''}`}
            aria-live="polite"
          >
            {answers.revenueShareInterested ? (
              <>
                <span className="quote-step-number">Small-business pricing</span>
                <h3 ref={stepHeadingRef} tabIndex="-1">Choose your plan.</h3>
                <div className="revenue-share-pricing">
                  <div>
                    <span>Flat production fee</span>
                    <strong>{quoteRange}</strong>
                  </div>
                  <b>or</b>
                  <div>
                    <span>Revenue-share plan</span>
                    <strong>33–40%</strong>
                    <small>of ticket sales</small>
                  </div>
                </div>
                <p>
                  Choose the capped flat-fee quote or share ticket revenue. We&apos;ll confirm the best
                  fit after a 30-minute consultation.
                </p>
              </>
            ) : (
              <>
                <span className="quote-step-number">Estimated production range</span>
                <h3 ref={stepHeadingRef} tabIndex="-1">{quoteRange}</h3>
                <p>
                  Based on {guestCount.toLocaleString()} guests and a ${budgetAmount.toLocaleString()} event
                  budget for {answers.eventName}. This estimate will never exceed half of your event budget.
                  Your final flat fee is confirmed after a 30-minute consultation.
                </p>
              </>
            )}
            <div className="quote-includes">
              <strong>This includes:</strong>
              <ul>
                <li><Check aria-hidden="true" /> Consultation</li>
                <li><Check aria-hidden="true" /> Concept building</li>
                <li><Check aria-hidden="true" /> Prep and planning</li>
                <li><Check aria-hidden="true" /> Day-of execution</li>
              </ul>
            </div>
            <div className="quote-actions">
              <button className="button quote-back" type="button" onClick={goBack}>
                <ArrowLeft aria-hidden="true" /> Edit answers
              </button>
              <button
                className="button button-primary quote-next"
                type="button"
                onClick={() => {
                  hasNavigated.current = true;
                  setStep(questionCount + 1);
                }}
              >
                Submit inquiry <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {isQuoteContact && (
          submitted ? (
            <div className="quote-result quote-confirmation" aria-live="polite">
              <span className="quote-step-number">Inquiry sent</span>
              <h3 ref={stepHeadingRef} tabIndex="-1">You’re on the list.</h3>
              <p>I received your complete event brief and will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form className="quote-step quote-contact-step" onSubmit={handleQuoteSubmit}>
              <div>
                <span className="quote-step-number">Final step</span>
                <h3 ref={stepHeadingRef} tabIndex="-1">Where should we follow up?</h3>
                <p>Your quote answers are saved and will be included automatically.</p>
              </div>
              <input type="hidden" name="_subject" value={`New quote inquiry: ${answers.eventName}`} />
              <input type="hidden" name="estimatedQuote" value={quoteRange} />
              <input type="hidden" name="eventName" value={answers.eventName} />
              <input type="hidden" name="eventTypes" value={answers.eventTypes.join(', ')} />
              <input type="hidden" name="eventBudget" value={`$${budgetAmount.toLocaleString()}`} />
              <input
                type="hidden"
                name="revenueShareInterested"
                value={answers.revenueShareInterested ? 'Yes' : 'No'}
              />
              <input
                type="hidden"
                name="revenueShareOffer"
                value={answers.revenueShareInterested ? `${quoteRange} or 33–40% of ticket sales` : 'Not selected'}
              />
              <input type="hidden" name="guestCount" value={answers.guests} />
              <input type="hidden" name="eventDate" value={answers.date} />
              <input type="hidden" name="venue" value={answers.venue} />
              <input type="hidden" name="eventDescription" value={answers.description} />
              <input type="hidden" name="targetAudience" value={answers.audience} />
              <div className="quote-contact-grid">
                <Field
                  label="Name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Jordan Lee"
                />
                <Field
                  label="Company"
                  name="company"
                  autoComplete="organization"
                  placeholder="Company or creator name"
                />
                <Field
                  label="Email"
                  name="email"
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="jordan@example.com"
                />
                <Field
                  label="Phone"
                  name="phone"
                  required
                  type="tel"
                  autoComplete="tel"
                  placeholder="(212) 555-0123"
                />
              </div>
              <div className="quote-actions quote-submit-actions">
                <button className="button quote-back" type="button" onClick={goBack}>
                  <ArrowLeft aria-hidden="true" /> Back to quote
                </button>
                <button className="button button-primary quote-next" type="submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send full inquiry'} <Send aria-hidden="true" />
                </button>
              </div>
              <p className="quote-submit-status" role="status" aria-live="polite">
                {submitStatus || 'Your information is only used to respond to this event inquiry.'}
              </p>
            </form>
          )
        )}
      </div>
    </section>
  );
}

function MultiChoiceGroup({ label, options, values, onChange }) {
  return (
    <fieldset className="choice-group">
      <legend>{label} *</legend>
      <div className="choice-grid">
        {options.map((option) => (
          <button
            className={values.includes(option) ? 'choice-button is-selected' : 'choice-button'}
            type="button"
            aria-pressed={values.includes(option)}
            onClick={() => onChange(option)}
            key={option}
          >
            {option}
            {values.includes(option) && <Check aria-hidden="true" />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function InquirySection() {
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!endpoint) {
      setStatus('Your form is ready. Add a Formspree endpoint before launch to receive submissions.');
      return;
    }
    setSubmitting(true);
    setStatus('Sending...');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        setStatus('That did not send. Please check your details and try again.');
        return;
      }
      form.reset();
      setStatus('Inquiry sent. I’ll get back to you within 24 hours.');
    } catch {
      setStatus('The form could not connect. Please check your internet connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section page-shell inquiry-section" id="work-together">
      <SectionHeading
        eyebrow="Let’s work together"
        title="Ready to make it real?"
        copy="Already know what you need? Send the concept and I’ll get back to you within 24 hours."
      />
      <form className="inquiry-form" onSubmit={handleSubmit}>
        <input type="hidden" name="_subject" value="New FYP Events inquiry" />
        <div className="contact-grid">
          <Field label="Name" name="name" required autoComplete="name" placeholder="Jordan Lee" />
          <Field label="Company" name="company" autoComplete="organization" placeholder="Brand or creator name" />
          <Field
            className="full-field"
            label="Event name or concept"
            name="eventName"
            required
            placeholder="Summer product launch"
          />
          <Field label="Email" name="email" required type="email" autoComplete="email" placeholder="jordan@brand.com" />
          <Field label="Phone" name="phone" required type="tel" autoComplete="tel" placeholder="(212) 555-0123" />
          <label className="full-field">
            <span>Tell us more *</span>
            <textarea
              name="message"
              rows="6"
              required
              placeholder="Describe the event, goals, audience and preferred timing."
            />
          </label>
        </div>
        <div className="inquiry-footer">
          <p role="status" aria-live="polite">
            {status || 'Your information is only used to respond to this event inquiry.'}
          </p>
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Submit inquiry'} <Send aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, className = '', ...inputProps }) {
  return (
    <label className={className}>
      <span>{label}{inputProps.required ? ' *' : ''}</span>
      <input {...inputProps} />
    </label>
  );
}

function QuotePage() {
  return (
    <div className="subpage">
      <h1 className="sr-only">Get a Quote</h1>
      <QuoteExperience />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <Link className="wordmark" to="/"><span className="chrome-text">FYP</span><span>EVENTS</span></Link>
        <p className="footer-tagline">New York City · Made for your page. Built to go viral.</p>
        <p className="footer-creative"><Sparkles aria-hidden="true" /> Powered by local queer artists and creatives.</p>
        <small>© 2026 FYP Events. All rights reserved.</small>
      </div>
    </footer>
  );
}

export default App;
