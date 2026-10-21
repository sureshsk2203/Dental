import "./Hero.css";
import BrushButton from "./BrushButton";

/* Image is loaded from the /public folder:
   public/tooth.png  -> tooth + implant + scaffold + workers */

/* Positions are in % of tooth.png (left, top). */

// sparks at the tool contact points
const SPARKS = [
  { left: 37.9, top: 30, delay: 0.0, size: 12 }, // brush
  { left: 56.5, top: 25, delay: 0.35, size: 12 }, // top vacuum nozzle
  { left: 70.3, top: 25.8, delay: 0.7, size: 11 }, // wiping cloth
  { left: 75.1, top: 39.3, delay: 0.15, size: 22 }, // mirror shine
  { left: 50.1, top: 62, delay: 0.5, size: 12 }, // bottom vacuum nozzle
];

// foam bubbles / water floating around the tooth: left, top, size(px), delay, duration
const DROPS = [
  [31, 45, 6, 0.0, 3.2],
  [33, 52, 4, 0.8, 2.8],
  [36, 38, 5, 1.4, 3.6],
  [29, 60, 4, 0.4, 2.6],
  [58, 63, 4, 1.1, 3.0],
  [52, 66, 3, 0.2, 3.4],
  [85, 35, 3, 0.6, 2.5],
  [88, 50, 4, 1.9, 3.1],
  [80, 27, 3, 0.9, 3.3],
  [45, 28, 3, 1.5, 2.7],
  [62, 21, 3, 0.3, 3.5],
  [92, 70, 3, 1.7, 2.9],
];

/* Heading: three different type styles (change the 3 texts below to change the words).
   Every letter is its own span, so it can fade in one by one,
   catch a travelling shine, and jump when you hover it. */

/* A little tooth rolls across the heading, pops into sparkles and vanishes.
   The letters start to appear right after it is gone. */
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

  // plain = true -> small solid-colour letters (no metal gradient)
  const letters = (text, plain = false) =>
    text.split("").map((ch) => {
      const i = n++;
      return (
        <span
          key={`${text}-${i}`}
          className={plain ? "ch ch--plain" : "ch"}
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
      <span className="t-row t-row--1">{letters("Healthy Teeth")}</span>

      <span className="t-sub" aria-hidden="true">
        <span className="t-sub__text">{letters("for a lifetime of", true)}</span>
      </span>

      <span className="t-row t-row--3">
        {letters("Smiles")}
        {/* a smile that draws itself under the word */}
        <svg className="t-smile" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="smileGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ec8fb0" />
              <stop offset="1" stopColor="#c4527f" />
            </linearGradient>
          </defs>
          <path d="M8 8 Q150 50 292 8" />
        </svg>
      </span>
    </h1>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="home">
      {/* ---------- LEFT: text (slides in from the left) ---------- */}
      <div className="hero__content">
        <Title />

        <p className="hero__text">
          Using <b>advanced technology</b>, we deliver comprehensive treatments
          for a healthy, <b>confident</b> smile.
        </p>

        <BrushButton className="hero__btn hero__btn--desktop" href="#treatments">
          Explore Treatments
        </BrushButton>
      </div>

      {/* ---------- RIGHT: tooth scene (slides in from the right) ---------- */}
      <div className="scene">
        <div className="tooth">
          {/* base image */}
          <img src="/tooth.png" alt="Workers polishing a giant tooth" className="tooth__img" />

          {/* the same image, clipped to each tool area so only the tools move */}
          {/* soft body-sway for each of the 5 workers (smooth, no jitter) */}
          <img src="/tooth.png" alt="" aria-hidden="true" className="tooth__layer layer--w1" />
          <img src="/tooth.png" alt="" aria-hidden="true" className="tooth__layer layer--w2" />
          <img src="/tooth.png" alt="" aria-hidden="true" className="tooth__layer layer--w3" />
          <img src="/tooth.png" alt="" aria-hidden="true" className="tooth__layer layer--w4" />
          <img src="/tooth.png" alt="" aria-hidden="true" className="tooth__layer layer--w5" />
          <img src="/tooth.png" alt="" aria-hidden="true" className="tooth__layer layer--brush" />
          <img src="/tooth.png" alt="" aria-hidden="true" className="tooth__layer layer--vac-top" />
          <img src="/tooth.png" alt="" aria-hidden="true" className="tooth__layer layer--cloth" />
          <img src="/tooth.png" alt="" aria-hidden="true" className="tooth__layer layer--mirror" />
          <img src="/tooth.png" alt="" aria-hidden="true" className="tooth__layer layer--vac-bottom" />

          {/* moving shine, masked to the shape of the image */}
          <span className="tooth__shine" aria-hidden="true" />

          {/* sparks */}
          {SPARKS.map((s, i) => (
            <svg
              key={i}
              className="spark"
              viewBox="-10 -10 20 20"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
              }}
              aria-hidden="true"
            >
              <path d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z" fill="#fff" />
            </svg>
          ))}

          {/* droplets */}
          {DROPS.map(([l, t, s, d, dur], i) => (
            <span
              key={i}
              className="drop"
              style={{
                left: `${l}%`,
                top: `${t}%`,
                width: s,
                height: s,
                animationDelay: `${d}s`,
                animationDuration: `${dur}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* same button again, shown only on mobile: it comes AFTER the picture */}
      <BrushButton className="hero__btn hero__btn--mobile" href="#treatments">
        Explore Treatments
      </BrushButton>
    </section>
  );
}