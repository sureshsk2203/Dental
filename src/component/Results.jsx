import { useEffect, useRef, useState } from "react";
import BrushButton from "../component/BrushButton"; // if this file is inside src/component, write "./BrushButton"
import "./Results.css";

/*
 * HOW THE PHOTOS ARE LOADED  (two ways, both work)
 *
 * A) PUBLIC folder  (easiest):  public/results/
 * B) src/assets/results/        (if this folder has photos it is used first)
 *
 * Pair the photos by file name:
 *
 *   01-before.jpg   01-after.jpg
 *   02-before.jpg   02-after.jpg
 *   ...
 *
 * Any number of pairs works (jpg, jpeg, png, webp, avif). Cases are
 * sorted by the number in the file name. Keep the numbers in a row
 * (01, 02, 03 ...), the page stops at the first missing number.
 * For the PUBLIC way the folder can be  public/results/ , public/Results/
 * or directly inside public/ , and the number can be 01 or 1.
 */
const FILES = import.meta.glob("../assets/results/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

/*
 * OPTIONAL: describe a case by its file-name number.
 * Anything you leave out falls back to a default label.
 * Only add details the patient has agreed to share.
 */
const CASE_INFO = {
  1: {
    title: "Stained & decayed tooth restored",
    treatment: "Tooth Restoration",
  },
  2: {
    title: "Front tooth gap closed",
    treatment: "Cosmetic Bonding",
  },
  3: {
    title: "Broken tooth & gums rebuilt",
    treatment: "Crown & Gum Care",
  },
  4: {
    title: "Missing teeth replaced",
    treatment: "Crowns & Bridges",
  },
  5: {
    title: "Yellow teeth brightened",
    treatment: "Teeth Whitening",
  },
  6: {
    title: "Crowded teeth realigned",
    treatment: "Smile Design",
  },
  7: {
    title: "Worn molars restored",
    treatment: "Crowns & Bridges",
  },
};

/*
 * PATIENT REVIEWS (auto-scrolling)
 * !! These are PLACEHOLDERS. Replace every entry with real reviews
 * (copy from Google Reviews etc.) and get the patient's OK before
 * using their name. Add as many as you like, 6+ looks best.
 */
const REVIEWS = [
  {
    name: "Patient Name",
    treatment: "Teeth Whitening",
    stars: 5,
    text: "Replace this with a real patient review. Keep it to 2–3 lines so the cards stay even.",
  },
  {
    name: "Patient Name",
    treatment: "Crowns & Bridges",
    stars: 5,
    text: "Replace this with a real patient review. Keep it to 2–3 lines so the cards stay even.",
  },
  {
    name: "Patient Name",
    treatment: "Smile Design",
    stars: 5,
    text: "Replace this with a real patient review. Keep it to 2–3 lines so the cards stay even.",
  },
  {
    name: "Patient Name",
    treatment: "Cosmetic Bonding",
    stars: 5,
    text: "Replace this with a real patient review. Keep it to 2–3 lines so the cards stay even.",
  },
  {
    name: "Patient Name",
    treatment: "Tooth Restoration",
    stars: 5,
    text: "Replace this with a real patient review. Keep it to 2–3 lines so the cards stay even.",
  },
  {
    name: "Patient Name",
    treatment: "Crown & Gum Care",
    stars: 5,
    text: "Replace this with a real patient review. Keep it to 2–3 lines so the cards stay even.",
  },
];

const DEFAULT_TREATMENT = "Smile makeover";
const PAGE_SIZE = 12;

/* adds the title / treatment text to a { id, before, after } pair */
function withInfo(item) {
  const info = CASE_INFO[Number(item.id)] || {};
  return {
    ...item,
    title: info.title || `Smile case ${item.id}`,
    treatment: info.treatment || DEFAULT_TREATMENT,
    note: info.note || "",
  };
}

/* ---------- way B: photos inside src/assets/results ---------- */
function buildAssetCases() {
  const byId = {};

  Object.entries(FILES).forEach(([path, url]) => {
    const name = path.split("/").pop();
    const match = name.match(/^(.+?)[-_ ](before|after)\.[a-z0-9]+$/i);
    if (!match) return;

    const id = match[1];
    byId[id] = byId[id] || { id };
    byId[id][match[2].toLowerCase()] = url;
  });

  return Object.values(byId)
    .filter((item) => item.before && item.after)
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
    .map(withInfo);
}

const ASSET_CASES = buildAssetCases();

/* ---------- way A: photos inside the public folder ----------
   The browser cannot list a folder, so the page simply tries the file
   names (01-before.jpg, 02-before.jpg ...) and keeps the ones that exist. */
const PUBLIC_DIRS = ["/results", "/Results", ""];
const EXTS = ["jpg", "jpeg", "png", "webp", "avif", "JPG", "JPEG", "PNG"];
const SEPS = ["-", "_"];
const MAX_CASES = 40;

const probe = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });

const firstFound = async (urls) => {
  const ok = await Promise.all(urls.map(probe));
  return urls[ok.indexOf(true)] || null;
};

let publicPromise = null; // remembered, so the check runs only once

function discoverPublicCases() {
  if (publicPromise) return publicPromise;

  publicPromise = (async () => {
    // 1) find out how the files are named, using case number 1
    const guesses = [];
    PUBLIC_DIRS.forEach((dir) =>
      [true, false].forEach((padded) =>
        SEPS.forEach((sep) =>
          EXTS.forEach((ext) =>
            guesses.push({ dir, padded, sep, url: `${dir}/${padded ? "01" : "1"}${sep}before.${ext}` })
          )
        )
      )
    );

    const found = await Promise.all(guesses.map((g) => probe(g.url)));
    const style = guesses[found.indexOf(true)];
    if (!style) return [];

    // 2) go through 1, 2, 3 ... until the numbers run out
    const out = [];
    for (let n = 1; n <= MAX_CASES; n += 1) {
      const id = style.padded ? String(n).padStart(2, "0") : String(n);
      const find = (side) =>
        firstFound(EXTS.map((ext) => `${style.dir}/${id}${style.sep}${side}.${ext}`));

      // eslint-disable-next-line no-await-in-loop
      const [before, after] = await Promise.all([find("before"), find("after")]);
      if (!before && !after) break;
      if (before && after) out.push(withInfo({ id, before, after }));
    }
    return out;
  })();

  return publicPromise;
}

const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

/* The hint animation plays once per visit, not on every case change. */
let hintPlayed = false;

function Icon({ children, size = 22 }) {
  return (
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
}

const SwapIcon = () => (
  <Icon size={26}>
    <polyline points="8 7 3 12 8 17" />
    <polyline points="16 7 21 12 16 17" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </Icon>
);

const PrevIcon = () => (
  <Icon size={20}>
    <polyline points="15 18 9 12 15 6" />
  </Icon>
);

const NextIcon = () => (
  <Icon size={20}>
    <polyline points="9 18 15 12 9 6" />
  </Icon>
);

/* ---------------------------------------------------------------
 * Drag-to-compare slider. Owns its own state so dragging never
 * re-renders the gallery below it.
 * ------------------------------------------------------------- */
function Compare({ before, after, label }) {
  const [pos, setPos] = useState(50);
  const boxRef = useRef(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const frame = useRef(0);

  const moveTo = (clientX) => {
    const rect = boxRef.current.getBoundingClientRect();
    setPos(clamp(((clientX - rect.left) / rect.width) * 100, 3, 97));
  };

  const takeControl = () => {
    touched.current = true;
    cancelAnimationFrame(frame.current);
  };

  // One gentle sweep the first time the slider scrolls into view.
  useEffect(() => {
    const box = boxRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!box || hintPlayed || reduce) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hintPlayed || touched.current) return;
        hintPlayed = true;
        observer.disconnect();

        const keys = [50, 24, 76, 50];
        const segment = 560;
        const start = performance.now();

        const step = (now) => {
          if (touched.current) return;
          const elapsed = now - start;
          const i = Math.min(keys.length - 2, Math.floor(elapsed / segment));
          const t = Math.min(1, (elapsed - i * segment) / segment);
          const eased = 0.5 - Math.cos(t * Math.PI) / 2;
          setPos(keys[i] + (keys[i + 1] - keys[i]) * eased);
          if (elapsed < segment * (keys.length - 1)) {
            frame.current = requestAnimationFrame(step);
          }
        };

        frame.current = requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );

    observer.observe(box);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const onKeyDown = (event) => {
    const keys = { ArrowLeft: -5, ArrowRight: 5 };
    if (event.key in keys) {
      event.preventDefault();
      takeControl();
      setPos((p) => clamp(p + keys[event.key], 3, 97));
    } else if (event.key === "Home") {
      event.preventDefault();
      takeControl();
      setPos(3);
    } else if (event.key === "End") {
      event.preventDefault();
      takeControl();
      setPos(97);
    }
  };

  return (
    <div
      ref={boxRef}
      className="rs-compare"
      style={{ "--pos": `${pos}%` }}
      onPointerDown={(event) => {
        takeControl();
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        moveTo(event.clientX);
      }}
      onPointerMove={(event) => {
        if (dragging.current) moveTo(event.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <img
        className="rs-img"
        src={before}
        alt={`${label}, before treatment`}
        draggable={false}
        decoding="async"
        fetchPriority="high"
      />
      <img
        className="rs-img rs-img--after"
        src={after}
        alt={`${label}, after treatment`}
        draggable={false}
        decoding="async"
      />

      <span className="rs-tag">Before</span>
      <span className="rs-tag rs-tag--after">After</span>

      <div
        className="rs-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
      >
        <span className="rs-knob">
          <SwapIcon />
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
 * Auto-scrolling reviews. Each row renders the list twice so the
 * CSS loop (translateX 0 → -50%) is seamless. Second row runs in
 * the opposite direction.
 * ------------------------------------------------------------- */
function ReviewCard({ review }) {
  return (
    <article className="rs-review">
      <div
        className="rs-stars"
        role="img"
        aria-label={`${review.stars} out of 5 stars`}
      >
        {"★".repeat(review.stars)}
      </div>
      <blockquote>&ldquo;{review.text}&rdquo;</blockquote>
      <div className="rs-review-who">
        <span className="rs-avatar" aria-hidden="true">
          {review.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <strong>{review.name}</strong>
          <small>{review.treatment}</small>
        </div>
      </div>
    </article>
  );
}

function MarqueeRow({ items, reverse = false }) {
  return (
    <div className="rs-marquee">
      <div className={`rs-track ${reverse ? "rs-track--rev" : ""}`}>
        <div className="rs-group">
          {items.map((r, i) => (
            <ReviewCard key={`a-${i}`} review={r} />
          ))}
        </div>
        <div className="rs-group" aria-hidden="true">
          {items.map((r, i) => (
            <ReviewCard key={`b-${i}`} review={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Reviews() {
  if (REVIEWS.length === 0) return null;

  // Split into two rows. With few reviews, both rows reuse the full list.
  const half = Math.ceil(REVIEWS.length / 2);
  const rowA = REVIEWS.length >= 6 ? REVIEWS.slice(0, half) : REVIEWS;
  const rowB = REVIEWS.length >= 6 ? REVIEWS.slice(half) : REVIEWS;

  return (
    <section className="rs-reviews" aria-label="Patient reviews">
      <div className="rs-rev-head">
        <span className="rs-pill">★ Patient reviews</span>
        <h2>Loved by our patients</h2>
        <p>Kind words from the people we&rsquo;ve had the joy of treating.</p>
      </div>

      <div className="rs-marquee-wrap">
        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB} reverse />
      </div>
    </section>
  );
}

export default function Results({ contactHref = "/contact" }) {
  const stageRef = useRef(null);
  const [filter] = useState("All");
  const [cases, setCases] = useState(ASSET_CASES);
  const [loading, setLoading] = useState(ASSET_CASES.length === 0);
  const [activeId, setActiveId] = useState(ASSET_CASES[0]?.id);
  const [visible, setVisible] = useState(PAGE_SIZE);

  /* nothing in src/assets/results -> look inside the public folder */
  useEffect(() => {
    if (ASSET_CASES.length > 0) return undefined;

    let cancelled = false;
    discoverPublicCases().then((found) => {
      if (cancelled) return;
      setCases(found);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (cases.length === 0) {
    return (
      <main className="rs">
        <section className="rs-empty">
          <h1 className="rs-title">Results gallery</h1>
          {loading ? (
            <p>Loading photos…</p>
          ) : (
            <p>
              No photo pairs found yet. Add files to <code>public/results/</code> named like{" "}
              <code>01-before.jpg</code> and <code>01-after.jpg</code>.
            </p>
          )}
        </section>
      </main>
    );
  }

  const list =
    filter === "All" ? cases : cases.filter((c) => c.treatment === filter);
  const active = list.find((c) => c.id === activeId) || list[0];
  const index = list.indexOf(active);

  const step = (delta) =>
    setActiveId(list[(index + delta + list.length) % list.length].id);

  const openCase = (id) => {
    setActiveId(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stageRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <main className="rs">
      <div className="rs-orb rs-orb--a" aria-hidden="true" />
      <div className="rs-orb rs-orb--b" aria-hidden="true" />

      {/* Hero */}
      <header className="rs-hero">
        <span className="rs-pill">
          <i className="rs-dot" /> {cases.length} patient smiles
        </span>
        <h1 className="rs-title">
          Real smiles. <span>Real results.</span>
        </h1>
        <p className="rs-lead">
          Drag the handle to compare each smile before and after treatment.
          Photos are shared with the patient&rsquo;s consent.
        </p>
      </header>

      {/* Main comparison */}
      <section className="rs-stage" ref={stageRef}>
        <Compare
          key={active.id}
          before={active.before}
          after={active.after}
          label={active.title}
        />

        <div className="rs-caption">
          <div className="rs-caption-text">
            <h2>{active.title}</h2>
            <p>
              {active.treatment}
              {active.note ? ` · ${active.note}` : ""}
            </p>
          </div>

          <div className="rs-nav">
            <button type="button" onClick={() => step(-1)} aria-label="Previous case">
              <PrevIcon />
            </button>
            <span aria-live="polite">
              {index + 1} / {list.length}
            </span>
            <button type="button" onClick={() => step(1)} aria-label="Next case">
              <NextIcon />
            </button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="rs-gallery">
        <div className="rs-grid">
          {list.slice(0, visible).map((item) => (
            <button
              key={item.id}
              type="button"
              className={`rs-card ${item.id === active.id ? "is-active" : ""}`}
              aria-pressed={item.id === active.id}
              aria-label={`Open ${item.title}`}
              onClick={() => openCase(item.id)}
            >
              <span className="rs-card-media">
                <img src={item.before} alt="" loading="lazy" decoding="async" />
                <img
                  className="rs-img--after"
                  src={item.after}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="rs-card-meta">
                <strong>{item.title}</strong>
                <small>{item.treatment}</small>
              </span>
            </button>
          ))}
        </div>

        {visible < list.length && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <BrushButton
              as="button"
              type="button"
              variant="light"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Show more cases ({list.length - visible} left)
            </BrushButton>
          </div>
        )}
      </section>

      {/* Reviews (auto-scrolling) */}
      <Reviews />

      {/* Call to action */}
      <section className="rs-cta">
        <div>
          <h3>Ready for your own before and after?</h3>
          <p>Book a consultation and we&rsquo;ll plan your smile together.</p>
        </div>
        <BrushButton href={contactHref} variant="light">
          Book a consultation
        </BrushButton>
      </section>
    </main>
  );
}