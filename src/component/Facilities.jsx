import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrushButton from "../component/BrushButton"; // if this file is inside src/component, write "./BrushButton"
import "./Facilities.css";

/* ------------------------------------------------------------------
   EDIT YOUR ROOMS HERE
   - put the photos inside  public/facilities/
   - img = "/facilities/<file name>"
   - the extension does not have to match: .jpeg .jpg .png .webp .avif
     (and .JPG .JPEG .PNG) are all tried automatically
   - add / remove rooms as you like
------------------------------------------------------------------- */
const ROOMS = [
  {
    title: "Clinic Entrance",
    tag: "Welcome",
    img: "/facilities/entrance.webp",
    text: "Easy to find and easy to walk into, with a bright, welcoming front that tells you you are in the right place.",
  },
  {
    title: "Waiting Hall",
    tag: "Comfort",
    img: "/facilities/waiting-hall.webp",
    text: "A calm, comfortable space where you can relax before your visit, with seating for the whole family.",
  },
  {
    title: "Surgery Room",
    tag: "Procedures",
    img: "/facilities/surgery-room.webp",
    text: "A clean, well-equipped operatory built for safe and precise treatments, from fillings to surgeries.",
  },
  {
    title: "Consultation Room",
    tag: "Check-ups",
    img: "/facilities/consultation-room.webp",
    text: "A private room where our doctors listen, examine and explain your treatment plan clearly.",
  },
  {
    title: "Reception",
    tag: "Front desk",
    img: "/facilities/reception.webp",
    text: "A friendly front desk to help you with appointments, queries and everything in between.",
  },
];

const pad = (n) => String(n).padStart(2, "0");

/* ---------- photo paths ----------
   If the exact file is not found, the same name is tried with other
   extensions (and with a capital-letter folder name, or no folder). */
const EXTS = ["webp", "jpeg", "jpg", "png", "avif", "JPG", "JPEG", "PNG"];

function buildCandidates(img) {
  const cut = img.lastIndexOf("/");
  const dir = img.slice(0, cut); // "/facilities"
  const file = img.slice(cut + 1).replace(/\.[a-z0-9]+$/i, ""); // "entrance"
  const capDir = dir.replace(/\/(\w)/, (m, c) => `/${c.toUpperCase()}`); // "/Facilities"

  const list = [img];
  [dir, capDir, ""].forEach((d) => {
    EXTS.forEach((e) => list.push(`${d}/${file}.${e}`));
  });
  return [...new Set(list)];
}

const CANDIDATES = ROOMS.map((r) => buildCandidates(r.img));

/* ---------- small inline icons ---------- */
const Svg = ({ children, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ArrowLeft = () => (
  <Svg>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </Svg>
);
const ArrowRight = (p) => (
  <Svg {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Svg>
);
const Expand = () => (
  <Svg size={18}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </Svg>
);
const Close = () => (
  <Svg size={22}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

/* shown if a photo is missing.
   While you run  npm run dev  it also shows the file name it was looking for. */
function Placeholder({ path }) {
  return (
    <div className="fc-ph">
      <svg viewBox="0 0 100 100" width="84" height="84" aria-hidden="true">
        <path
          d="M50 18 C42 8 22 8 18 28 C15 44 26 52 28 70 C30 88 36 94 41 82 C45 72 47 64 50 64 C53 64 55 72 59 82 C64 94 70 88 72 70 C74 52 85 44 82 28 C78 8 58 8 50 18 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
      <span>Photo coming soon</span>
      {import.meta.env.DEV && path && (
        <small style={{ opacity: 0.75, fontSize: 12 }}>looking for: public{path}</small>
      )}
    </div>
  );
}

export default function Facilities() {
  const n = ROOMS.length;
  const [lightbox, setLightbox] = useState(null); // null = closed, otherwise room index
  const [broken, setBroken] = useState({});
  const [tries, setTries] = useState({}); // which candidate path each room is on

  const go = useCallback((i) => setLightbox(((i % n) + n) % n), [n]);

  /* keyboard: arrows + esc inside the lightbox */
  useEffect(() => {
    if (lightbox === null) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") go(lightbox + 1);
      if (e.key === "ArrowLeft") go(lightbox - 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  const srcOf = (i) => CANDIDATES[i][tries[i] || 0];

  /* photo failed: try the next possible path, give up when none are left */
  const nextTry = (i) => {
    const next = (tries[i] || 0) + 1;
    if (next < CANDIDATES[i].length) {
      setTries((t) => ({ ...t, [i]: next }));
    } else {
      setBroken((b) => ({ ...b, [i]: true }));
    }
  };

  const room = lightbox !== null ? ROOMS[lightbox] : null;

  return (
    <main className="fc">
      <div className="fc-orb fc-orb--a" aria-hidden="true" />
      <div className="fc-orb fc-orb--b" aria-hidden="true" />

      {/* ---------- Hero ---------- */}
      <section className="fc-hero">
        <span className="fc-pill fc-rise" style={{ "--d": "0s" }}>
          <i className="fc-dot" /> OUR FACILITIES · SALEM
        </span>
        <h1 className="fc-title fc-rise" style={{ "--d": "0.08s" }}>
          Step inside our <span>clinic.</span>
        </h1>
        <p className="fc-lead fc-rise" style={{ "--d": "0.16s" }}>
          Take a look around our waiting hall, surgery room and more, so you know exactly what to expect before your
          first visit.
        </p>
      </section>

      {/* ---------- Stacked rooms (one below the other) ---------- */}
      <section className="fc-list">
        {ROOMS.map((r, i) => (
          <article key={r.title} className="fc-card fc-rise" style={{ "--d": `${0.1 + i * 0.06}s` }}>
            {broken[i] ? (
              <Placeholder path={r.img} />
            ) : (
              <img
                key={srcOf(i)}
                src={srcOf(i)}
                alt={`${r.title} at Neo Smiles Dental Care`}
                loading="lazy"
                onError={() => nextTry(i)}
              />
            )}

            <div className="fc-shade" aria-hidden="true" />

            <span className="fc-count">
              {pad(i + 1)} <i>/ {pad(n)}</i>
            </span>

            <button
              className="fc-expand"
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={`View ${r.title} full screen`}
            >
              <Expand />
            </button>

            <div className="fc-caption">
              <span className="fc-tag">{r.tag}</span>
              <h2>{r.title}</h2>
              <p>{r.text}</p>
            </div>
          </article>
        ))}
      </section>

      {/* ---------- CTA ---------- */}
      <section className="fc-cta fc-rise" style={{ "--d": "0.1s" }}>
        <div>
          <h3>Come and see it for yourself.</h3>
          <p>Book a visit and meet our team in person.</p>
        </div>
        <BrushButton as={Link} to="/contact" variant="light">
          Book an appointment
        </BrushButton>
      </section>

      {/* ---------- Lightbox ---------- */}
      {room && (
        <div className="fc-lb" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label={room.title}>
          <button className="fc-lb-close" type="button" onClick={() => setLightbox(null)} aria-label="Close">
            <Close />
          </button>

          <button
            className="fc-lb-nav fc-lb-nav--l"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(lightbox - 1);
            }}
            aria-label="Previous room"
          >
            <ArrowLeft />
          </button>

          <figure onClick={(e) => e.stopPropagation()}>
            {broken[lightbox] ? (
              <Placeholder path={room.img} />
            ) : (
              <img key={srcOf(lightbox)} src={srcOf(lightbox)} alt={room.title} onError={() => nextTry(lightbox)} />
            )}
            <figcaption>
              <strong>{room.title}</strong>
              <span>{room.text}</span>
            </figcaption>
          </figure>

          <button
            className="fc-lb-nav fc-lb-nav--r"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(lightbox + 1);
            }}
            aria-label="Next room"
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </main>
  );
}