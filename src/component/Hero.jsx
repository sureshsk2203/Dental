import "./Hero.css";
import BrushButton from "./BrushButton";

const STATS = {
  rating: "4.9",
  patients: "6,000+",
  years: "6+",
};

// Where the "Our Doctors" button goes.
// Same-page section -> "#doctors"
// Separate page     -> "/doctors"
const DOCTORS_LINK = "#doctors";

const Icon = {
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6z" />
      <path d="M8.8 12.3l2.2 2.2 4.2-4.4" />
    </svg>
  ),
  tooth: (
    <svg viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="14" strokeLinejoin="round">
      <path d="M100 20 C70 -2 20 8 18 60 C17 95 40 112 42 150 C44 190 52 232 72 232 C92 232 90 180 100 180 C110 180 108 232 128 232 C148 232 156 190 158 150 C160 112 183 95 182 60 C180 8 130 -2 100 20 Z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  ),
};

/* A little tooth rolls across the heading, pops into sparkles and vanishes. */
function ToothRunner() {
  return (
    <span className="t-runner" aria-hidden="true">
      <span className="t-runner__body">
        <span className="t-runner__hop">
          <span className="t-runner__spin">
            <svg viewBox="0 0 200 240">
              <defs>
                <linearGradient id="runnerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#ffd9e8" />
                </linearGradient>
              </defs>
              <path
                d="M100 20 C70 -2 20 8 18 60 C17 95 40 112 42 150 C44 190 52 232 72 232 C92 232 90 180 100 180 C110 180 108 232 128 232 C148 232 156 190 158 150 C160 112 183 95 182 60 C180 8 130 -2 100 20 Z"
                fill="url(#runnerGrad)"
                stroke="#dc6f9a"
                strokeWidth="9"
                strokeLinejoin="round"
              />
              <ellipse cx="78" cy="96" rx="6" ry="8" fill="#7f2650" />
              <ellipse cx="122" cy="96" rx="6" ry="8" fill="#7f2650" />
              <path d="M80 120 Q100 144 120 120" fill="none" stroke="#7f2650" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </span>
        </span>
      </span>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <i key={a} className="t-spark" style={{ "--a": `${a}deg` }} />
      ))}
    </span>
  );
}

function Title() {
  let n = 0; // running letter index -> stagger delay

  // variant: "" = pink metal gradient, "plain" = small pink, "dark" = dark plum
  const letters = (text, variant = "") =>
    text.split("").map((ch) => {
      const i = n++;
      return (
        <span
          key={`${text}-${i}`}
          className={variant ? `ch ch--${variant}` : "ch"}
          style={{ "--i": i }}
          aria-hidden="true"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      );
    });

  return (
    <h1 className="hero__title" aria-label="Healthy teeth for a lifetime of smiles">
      <ToothRunner />
      <span className="t-row t-row--1">{letters("Healthy Teeth", "dark")}</span>

      <span className="t-sub" aria-hidden="true">
        <span className="t-sub__text">{letters("for a lifetime of", "plain")}</span>
      </span>

      <span className="t-row t-row--3">
        {letters("Smiles")}
        <svg className="t-smile" viewBox="0 0 300 34" aria-hidden="true">
          <defs>
            <linearGradient id="smileGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0">
              <stop offset="0" stopColor="#ec8fb0" />
              <stop offset="1" stopColor="#c4527f" />
            </linearGradient>
          </defs>
          <path className="t-smile__curve" pathLength="100" d="M26 7 C80 34 220 34 274 7" />
          <path className="t-smile__dimple" pathLength="100" d="M15 0.5 Q7 7.5 15 14.5" />
          <path className="t-smile__dimple" pathLength="100" d="M285 0.5 Q293 7.5 285 14.5" />
        </svg>
      </span>
    </h1>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="home">
      <span className="leaf leaf--1" aria-hidden="true" />
      <span className="leaf leaf--2" aria-hidden="true" />

      {/* ---------- LEFT ---------- */}
      <div className="hero__content">
        <div className="hero__pill">
          <span className="hero__pill-icon">{Icon.tooth}</span>
          <span>
            Trusted <b>Dental Care</b> for <b>Every Smile</b>
          </span>
        </div>

        <Title />

        {/* desktop buttons (hidden on tablet/mobile) */}
        <div className="hero__actions">
          <BrushButton className="hero__btn hero__btn--desktop" href="#treatments">
            Explore Treatments
          </BrushButton>

          <BrushButton className="hero__btn hero__btn--desktop" href={DOCTORS_LINK}>
            Our Doctors
          </BrushButton>
        </div>
      </div>

      {/* ---------- RIGHT ---------- */}
      <div className="scene">
        <div className="photo">
          <div className="photo__frame">
            <img
              src="/home1.png"
              alt="A happy family smiling together on the grass"
              className="photo__img"
              width="1100"
              height="1650"
            />
          </div>

          <div className="badge badge--rating">
            <span className="badge__icon" aria-hidden="true">{Icon.star}</span>
            <span className="badge__text">
              <span className="badge__big">{STATS.rating}</span>
              <span className="badge__small">Patient rating</span>
            </span>
          </div>

          <div className="badge badge--years">
            <span className="badge__icon" aria-hidden="true">{Icon.shield}</span>
            <span className="badge__text">
              <span className="badge__big">{STATS.years}</span>
              <span className="badge__small">Years of trusted care</span>
            </span>
          </div>
        </div>
      </div>

      {/* same two buttons again, mobile only: they come AFTER the picture */}
      <div className="hero__actions-mobile">
        <BrushButton className="hero__btn hero__btn--mobile" href="#treatments">
          Explore Treatments
        </BrushButton>

        <BrushButton className="hero__btn hero__btn--mobile" href={DOCTORS_LINK}>
          Our Doctors
        </BrushButton>
      </div>
    </section>
  );
}