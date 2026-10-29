import { useEffect, useRef, useState } from "react";
import BrushButton from "./BrushButton"; // toothbrush hover button
import "./Home.css"; // shared .section, .eyebrow, .section__head styles
import "./About.css";

/* =====================================================
   EDIT YOUR CLINIC DETAILS HERE
   (same as Home.jsx - later you can move this into
   one shared file like clinic.js and import in both)
   ===================================================== */
const CLINIC = {
  name: "Neo Smiles",
  city: "Salem",
  whatsapp: "919876543210", // country code + number, no + or spaces
  phone: "+91 98765 43210",
};

/* =====================================================
   ABOUT DATA  (change the text / numbers to real ones)
   ===================================================== */
const STATS = [
  { value: "6+", label: "Years of experience" },
  { value: "6000+", label: "Happy patients" },
  { value: "4.9", label: "Average Google rating" },
  { value: "6", label: "Treatment specialities" },
];

const VALUES = [
  {
    icon: "smile",
    title: "Gentle, painless care",
    text: "We explain every step before we start and numb well, so you stay relaxed from the chair to the checkout.",
  },
  {
    icon: "check",
    title: "Honest treatment plans",
    text: "You get only the treatment you need. We show you the X-ray or scan and explain why, with no pressure.",
  },
  {
    icon: "shield",
    title: "Hospital-grade hygiene",
    text: "Every instrument is sterilised in an autoclave and sealed before use. Single-use items are opened in front of you.",
  },
  {
    icon: "rupee",
    title: "Clear pricing",
    text: "You know the cost of each stage before treatment begins, and nothing is added later without telling you first.",
  },
];

/* Journey content (from the design image).
   `img` is optional - when you add the photo files in /public,
   put the path here, e.g. img: "/journey-1.jpg" */
const JOURNEY = [
  {
    label: "August 2026",
    title: "Where Our Story Began",
    tagline: "A vision to care for every smile.",
    text: "Neo Smiles was established in Salem with a vision to provide dental care for children and families in a welcoming, patient-friendly environment. Our goal is to make every visit comfortable and every patient feel cared for.",
    img: null,
  },
  {
    label: "Growing with our community",
    title: "Every Patient Matters",
    tagline: "Built around trust, one visit at a time.",
    text: "We believe good dentistry begins with listening. Understanding your concerns and explaining treatment options clearly help you make informed decisions about your oral health.",
    img: null,
  },
  {
    label: "Our commitment",
    title: "Care With Clarity and Compassion",
    tagline: "Your comfort is part of your care.",
    text: "From routine dental check-ups to treatment for dental problems, we strive to make your experience informative, respectful and as comfortable as possible.",
    img: null,
  },
  {
    label: "Today & beyond",
    title: "Your Smile Is Our Motivation",
    tagline: "One smile at a time.",
    text: "As we begin this journey in Salem, we look forward to building lasting relationships with our patients, encouraging preventive dental care and helping families work towards healthier smiles.",
    img: null,
  },
];

/* =====================================================
   ICONS
   ===================================================== */
const ICONS = {
  smile: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3.500 7.500a1.200 1.200 0 110 2.400 1.200 1.200 0 010-2.400zm7 0a1.200 1.200 0 110 2.400 1.200 1.200 0 010-2.400zM12 18c-2.300 0-4.200-1.300-5-3h10c-.8 1.700-2.700 3-5 3z" />,
  shield: <path d="M12 3l7 3v5c0 4.500-3 8.200-7 10-4-1.800-7-5.500-7-10V6l7-3zm-1 11l5-5-1.400-1.400L11 11.200 9.400 9.600 8 11l3 3z" />,
  check: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.200 14.200L6.500 12l1.400-1.400 2.900 2.900 5.300-5.300 1.400 1.400-6.700 6.600z" />,
  rupee: <path d="M7 4h11v2.200h-3.300c.5.600.8 1.300.9 2.100H18v2.200h-2.400c-.4 2.300-2.200 3.800-5 3.800H9.800l6.700 5.700h-3L7 14.300v-2h3.600c1.500 0 2.500-.7 2.800-1.800H7V8.300h6.200C12.900 7.300 12 6.700 10.600 6.700H7V4z" />,
};

function Icon({ name, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* =====================================================
   HELPERS
   ===================================================== */

/* becomes true (once) when the element scrolls into view.
   We add the class "is-in" and the CSS animates the cards. */
function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, ...options }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, inView];
}

/* "15,000+" counts up from 0 when it scrolls into view */
function CountUp({ value }) {
  const match = String(value).match(/^([\d,]*\.?\d+)(.*)$/);
  const target = match ? parseFloat(match[1].replace(/,/g, "")) : null;
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;
  const suffix = match ? match[2] : "";

  const [ref, inView] = useInView({ threshold: 0.6 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || target === null) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return undefined;
    }

    let raf;
    const start = performance.now();
    const duration = 1600;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setN(target * (1 - Math.pow(1 - p, 3))); // ease-out
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  if (target === null) return <strong>{value}</strong>;

  return (
    <strong ref={ref}>
      {n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </strong>
  );
}

/* =====================================================
   SECTIONS
   ===================================================== */
function AboutHero() {
  return (
    <section className="about-hero">
      <div className="about-hero__text">
        <span className="eyebrow"><i /> About us</span>
        <h2>
          A dental clinic that feels <em>less like a clinic</em>
        </h2>
        <p>
          {CLINIC.name} was started in {CLINIC.city} with one simple idea: going to the dentist should not
          be something you fear or put off. We keep things calm, explain everything in simple
          words, and treat every patient like family.
        </p>
        <div className="about-hero__btns">
          <BrushButton
            variant="solid"
            href={`https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent("Hello, I would like to book an appointment.")}`}
            target="_blank"
            rel="noreferrer"
          >
            Book on WhatsApp
          </BrushButton>
          <BrushButton variant="light" href="/#treatments">
            See treatments
          </BrushButton>
        </div>
      </div>

      {/* image comes from  public/Neo.webp  (file name is case-sensitive) */}
      <div className="about-hero__visual">
        <div className="about-hero__photo">
          <img className="about-hero__img" src="/Neo.jpeg" alt="Our dental clinic" />
        </div>
      </div>
    </section>
  );
}

function Story() {
  const [statsRef, statsIn] = useInView();

  return (
    <section className="section">
      <div className="about-story reveal">
        <div className="about-story__text">
          <h2>Our story</h2>
          <p>
            Many people avoid the dentist until the pain becomes too much. By then, a simple filling has
            turned into a root canal. We wanted to change that by making check-ups easy and friendly.
          </p>
          <p>
            Today we look after patients of all ages, from a child's first visit to full smile makeovers
            and implants. Our approach has not changed: listen first, explain clearly, and treat gently.
          </p>
          <p>
            Every plan starts with a proper check-up, and you always decide what happens next.
          </p>
        </div>

        <div ref={statsRef} className={`about-stats ${statsIn ? "is-in" : ""}`}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ "--i": i }}>
              <CountUp value={s.value} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Values() {
  const [ref, inView] = useInView();

  return (
    <section className="section section--tint">
      <div className="section__head reveal">
        <span className="eyebrow"><i /> Why choose us</span>
        <h2>What you can <em>expect</em> from us</h2>
        <p>Four promises we keep with every patient, on every visit.</p>
      </div>

      <div ref={ref} className={`about-values ${inView ? "is-in" : ""}`}>
        {VALUES.map((v, i) => (
          <article key={v.title} className="about-value" style={{ "--i": i }}>
            <span className="about-value__ico"><Icon name={v.icon} size={26} /></span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Journey() {
  const [ref, inView] = useInView();

  return (
    <section className="section">
      <div className="section__head reveal">
        <span className="eyebrow"><i /> Our journey</span>
        <h2>Our <em>Journey</em></h2>
        <p>Every smile has a story. Ours began with a simple belief — everyone deserves to smile with confidence.</p>
      </div>

      <ol ref={ref} className={`about-journey ${inView ? "is-in" : ""}`}>
        {JOURNEY.map((j, i) => (
          <li key={j.title} style={{ "--i": i }}>
            <span className="about-journey__year">{j.label}</span>
            <h3>{j.title}</h3>
            <p><strong>{j.tagline}</strong></p>
            <p>{j.text}</p>
            {j.img && (
              <img
                className="about-journey__img"
                src={j.img}
                alt={j.title}
                loading="lazy"
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function AboutCta() {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className={`about-cta ${inView ? "is-in" : ""}`}>
      <h2>You Deserve Your Neo Smile.</h2>
      <p>
        Thank you for being a part of our journey. We look forward to caring for you and your
        family's smiles. Message us on WhatsApp or call {CLINIC.phone} to book a check-up.
      </p>
      <div className="about-cta__btns">
        <BrushButton
          variant="light"
          href={`https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent("Hello, I would like to book an appointment.")}`}
          target="_blank"
          rel="noreferrer"
        >
          Book an appointment
        </BrushButton>
        <BrushButton variant="light" href={`tel:${CLINIC.phone.replace(/\s/g, "")}`}>
          Call now
        </BrushButton>
      </div>
    </section>
  );
}

/* =====================================================
   ABOUT PAGE
   (Nav and Footer come from App.jsx, same as Home)
   ===================================================== */
export default function About() {
  return (
    <div className="about" id="about">
      <AboutHero />
      <Story />
      <Values />
      <Journey />
      <AboutCta />
    </div>
  );
}