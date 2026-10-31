import { useEffect, useRef, useState } from "react";
import BrushButton from "./BrushButton";
import "./Results.css";

/*
 * HOW THE PHOTOS ARE LOADED
 *
 * A) public/results/
 * B) src/assets/results/
 *
 * Pair the photos by file name:
 *
 *   01-before.jpg   01-after.jpg
 *   02-before.jpg   02-after.jpg
 *   ...
 *
 * Any number of pairs works (jpg, jpeg, png, webp, avif). Cases are
 * sorted by the number in the file name.
 * Gaps are allowed (for example 05 then 07): the PUBLIC way only stops
 * after 3 missing numbers in a row.
 * For the PUBLIC way the folder can be  public/results/ , public/Results/
 * or directly inside public/ , and the number can be 01 or 1.
 */

const FILES = import.meta.glob("../assets/results/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

/* Case information */

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

  7: {
    title: "Fixed teeth replacement",
    treatment: "Crowns & Bridges",
  },
};

/* Patient reviews - replace placeholders with approved real reviews */

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

/* Add title and treatment information */

function withInfo(item) {
  const info = CASE_INFO[Number(item.id)] || {};

  return {
    ...item,
    title: info.title || `Smile case ${item.id}`,
    treatment: info.treatment || DEFAULT_TREATMENT,
    note: info.note || "",
  };
}

/* Load photos from src/assets/results */

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
    .sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true })
    )
    .map(withInfo);
}

const ASSET_CASES = buildAssetCases();

/* Load photos from public folder */

const PUBLIC_DIRS = ["/results", "/Results", ""];
const EXTS = ["webp", "jpg", "jpeg", "png", "avif", "JPG", "JPEG", "PNG"];
const SEPS = ["-", "_"];
const MAX_CASES = 40;
const MAX_GAP = 3; // stop after this many missing numbers in a row

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

let publicPromise = null;

function discoverPublicCases() {
  if (publicPromise) return publicPromise;

  publicPromise = (async () => {
    const guesses = [];

    PUBLIC_DIRS.forEach((dir) =>
      [true, false].forEach((padded) =>
        SEPS.forEach((sep) =>
          EXTS.forEach((ext) =>
            guesses.push({
              dir,
              padded,
              sep,
              url: `${dir}/${padded ? "01" : "1"}${sep}before.${ext}`,
            })
          )
        )
      )
    );

    const found = await Promise.all(guesses.map((g) => probe(g.url)));
    const style = guesses[found.indexOf(true)];

    if (!style) return [];

    // go through 1, 2, 3 ... skip gaps, stop after MAX_GAP missing in a row
    const out = [];
    let misses = 0;
    for (let n = 1; n <= MAX_CASES; n += 1) {
      const id = style.padded ? String(n).padStart(2, "0") : String(n);
      const find = (side) =>
        firstFound(
          EXTS.map((ext) => `${style.dir}/${id}${style.sep}${side}.${ext}`)
        );

      // eslint-disable-next-line no-await-in-loop
      const [before, after] = await Promise.all([find("before"), find("after")]);

      if (!before && !after) {
        misses += 1;
        if (misses >= MAX_GAP) break;
        continue;
      }

      misses = 0;
      if (before && after) out.push(withInfo({ id, before, after }));
    }

    return out;
  })();

  return publicPromise;
}

const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

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

/* ---------------------------------------------------------------
 * REALISTIC TOOTHBRUSH (drawn sideways, bristles point DOWN).
 * The contact point (bristle tips) is x=34, y=48 in the 200x60 box.
 * Bristles are a dense row of thin tufts with uneven (trimmed) lengths,
 * a few coloured indicator tufts, a tapered neck and a contoured handle
 * with a thumb rest and rubber grip.
 * ------------------------------------------------------------- */
const TUFT_COLORS = [
  "#ffffff",
  "#a77cf0",
  "#ffffff",
  "#ff7fba",
  "#ffffff",
  "#a77cf0",
  "#ffffff",
  "#ff7fba",
  "#ffffff",
];

const BRISTLES = Array.from({ length: 27 }, (_, i) => {
  const x = 10.8 + i * 1.78;
  const mid = 1 - Math.abs(i - 13) / 13; // 0 at the edges, 1 in the middle
  const tip = 46.6 + mid * 1.6 + (i % 3 === 1 ? 0.7 : 0) + (i % 2) * 0.3;
  return { x, tip, color: TUFT_COLORS[Math.floor(i / 3)] };
});

const BrushIcon = () => (
  <svg
    viewBox="0 0 200 60"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="rsHandleGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffa8d4" />
        <stop offset="0.42" stopColor="#e0569f" />
        <stop offset="1" stopColor="#a82b72" />
      </linearGradient>
      <linearGradient id="rsGripGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cf4a92" />
        <stop offset="1" stopColor="#7d2158" />
      </linearGradient>
      <linearGradient id="rsHeadGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#efd3e3" />
      </linearGradient>
    </defs>

    {/* bristles (they bend while scrubbing) */}
    <g className="rs-bristles">
      {/* soft outline so white bristles stay visible on light photos */}
      {BRISTLES.map((b) => (
        <line
          key={`o-${b.x}`}
          x1={b.x}
          y1="35"
          x2={b.x}
          y2={b.tip}
          stroke="#d99bbd"
          strokeWidth="2.7"
          opacity="0.55"
        />
      ))}
      {BRISTLES.map((b) => (
        <line
          key={`b-${b.x}`}
          x1={b.x}
          y1="35"
          x2={b.x}
          y2={b.tip}
          stroke={b.color}
          strokeWidth="1.45"
        />
      ))}
    </g>

    {/* head */}
    <rect
      x="8"
      y="21"
      width="57"
      height="15.5"
      rx="7.7"
      fill="url(#rsHeadGrad)"
      stroke="#e0569f"
      strokeWidth="1.3"
    />
    <line x1="15" y1="25" x2="56" y2="25" stroke="#fff" strokeWidth="2" opacity="0.85" />
    {/* tiny tuft holes along the base of the head */}
    <g fill="#e0569f" opacity="0.3">
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={13.5 + i * 5.2} cy="32.6" r="0.9" />
      ))}
    </g>

    {/* tapered neck */}
    <path
      d="M58 23.4 C69 23.4 77 21.6 91 21 L91 32.8 C77 32.4 69 34 58 33.6 Z"
      fill="url(#rsHandleGrad)"
    />

    {/* contoured handle: slim waist + thumb-rest bump */}
    <path
      d="M88 21.2 C100 20 112 19.4 124 19.8 C140 20.3 150 22.6 168 20.4 C182 18.7 193 21.6 193 27 C193 32.4 182 35.2 168 33.6 C150 31.8 140 34.4 124 34.6 C112 34.8 100 33.6 88 32.6 Z"
      fill="url(#rsHandleGrad)"
    />

    {/* rubber grip with dimples */}
    <path
      d="M120 22.6 C134 22 150 24 166 22.6 C174 22 178 24.6 178 27 C178 29.6 174 32 166 31.4 C150 30 134 32.2 120 31.6 C116 31.4 116 22.8 120 22.6 Z"
      fill="url(#rsGripGrad)"
    />
    <g fill="#fff" opacity="0.3">
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={125 + i * 6} cy="27" r="1.15" />
      ))}
    </g>

    {/* thumb rest ridges */}
    <g stroke="#fff" strokeWidth="1" opacity="0.35">
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={100 + i * 4} y1="24.2" x2={100 + i * 4} y2="29.8" />
      ))}
    </g>

    {/* gloss + hang hole */}
    <path
      d="M94 22.4 C112 21.6 130 22 150 23.6"
      stroke="#fff"
      strokeWidth="1.8"
      opacity="0.6"
    />
    <circle cx="186" cy="27" r="2.3" fill="#fff" opacity="0.85" />

    {/* toothpaste foam clump at the contact point */}
    <g className="rs-paste">
      <circle cx="34" cy="48" r="5.5" fill="#fff" stroke="#f7a8d4" strokeWidth="1.1" />
      <circle cx="24" cy="47" r="3.8" fill="#fff" stroke="#f7a8d4" strokeWidth="1.1" />
      <circle cx="45" cy="47.5" r="4.4" fill="#fff" stroke="#f7a8d4" strokeWidth="1.1" />
      <circle cx="54" cy="46.5" r="3" fill="#fff" stroke="#f7a8d4" strokeWidth="1" />
      <circle cx="31" cy="45.4" r="1.6" fill="#fff" />
    </g>
  </svg>
);

/* ---------------------------------------------------------------
 * Drag-to-compare slider. Owns its own state so dragging never
 * re-renders the other sliders. Every slider plays its own
 * hint sweep once, when it scrolls into view.
 *
 * BRUSH PHYSICS (all in one requestAnimationFrame loop, no React renders):
 *  - the brush sits on the handle line, its height follows the pointer
 *    with a little lag (like a hand)
 *  - short quick strokes (~5 per second) along the teeth, plus a tiny
 *    up / down bob, rocking and bristle bend in step with each stroke
 *  - pressing harder = bristles squash a little
 *  - a canvas leaves a trail of foam bubbles and sparkles that fade out
 * Tweak the numbers in the "BRUSH" block below.
 * ------------------------------------------------------------- */
const BRUSH = {
  baseAngle: -38, // holding angle (deg)
  strokesPerSec: 5.2, // scrub speed
  strokeLength: 12, // how far the brush travels each way (px)
  bend: 13, // bristle bend (deg)
  foamPerSec: 110, // foam bubbles created per second
  maxParticles: 170,
};

function Compare({ before, after, label }) {
  const [pos, setPos] = useState(50);
  const [brushing, setBrushing] = useState(false);
  const boxRef = useRef(null);
  const brushRef = useRef(null);
  const tiltRef = useRef(null);
  const canvasRef = useRef(null);
  const kickRef = useRef(() => {});
  const brushingRef = useRef(false);
  const dragging = useRef(false);
  const touched = useRef(false);
  const played = useRef(false);
  const frame = useRef(0);
  const lastX = useRef(null);
  const vel = useRef(0);
  const idle = useRef(0);

  /* live brush state (never causes a re-render) */
  const fx = useRef({
    px: 0, // pointer x inside the box (px)
    ty: 0, // target y
    y: 0, // smoothed y
    amp: 0, // 0..1 stroke strength
    phase: 0,
    tilt: 0,
    tiltTarget: 0,
    spawn: 0,
    parts: [],
    raf: 0,
    last: 0,
    running: false,
    w: 0,
    h: 0,
    dpr: 1,
    scale: 1,
  });

  const setBrush = (value) => {
    brushingRef.current = value;
    setBrushing(value);
    if (value) kickRef.current();
  };

  /* ---------- brush + foam animation loop ---------- */
  useEffect(() => {
    const s = fx.current;
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const brush = brushRef.current;
    const tiltEl = tiltRef.current;
    if (!box || !canvas || !brush || !tiltEl) return undefined;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const r = box.getBoundingClientRect();
      s.dpr = Math.min(2, window.devicePixelRatio || 1);
      s.w = r.width;
      s.h = r.height;
      // brush is smaller on phones AND on laptop (3 sliders per row = small cards)
      s.scale = window.innerWidth <= 760 || window.innerWidth >= 1024 ? 0.7 : 1;
      canvas.width = Math.round(r.width * s.dpr);
      canvas.height = Math.round(r.height * s.dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    const addFoam = (cx, cy, angle) => {
      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      const along = (Math.random() * 38 - 14) * s.scale; // spread along the head
      const r = (2.4 + Math.random() * 6.6) * s.scale;
      s.parts.push({
        k: 0,
        x: cx + dirX * along + (Math.random() - 0.5) * 6,
        y: cy + dirY * along + 2 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 30,
        vy: -8 + (Math.random() - 0.4) * 22,
        r,
        life: 0,
        max: 0.55 + Math.random() * 0.75,
      });
    };

    const addSpark = (cy) => {
      s.parts.push({
        k: 1,
        x: s.px + 6 + Math.random() * 56 * s.scale, // on the freshly cleaned side
        y: cy + (Math.random() - 0.5) * 90 * s.scale,
        vx: 0,
        vy: 0,
        r: (6 + Math.random() * 7) * s.scale,
        life: 0,
        max: 0.45 + Math.random() * 0.4,
      });
    };

    const drawFoam = (p, t) => {
      const rad = p.r * (1 + t * 0.28);
      const fadeIn = t < 0.08 ? t / 0.08 : 1;
      ctx.globalAlpha = (1 - t) * fadeIn;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.84)";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(247,150,205,0.9)";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x - rad * 0.3, p.y - rad * 0.3, Math.max(0.8, rad * 0.26), 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    };

    const drawSpark = (p, t) => {
      const size = p.r * Math.sin(t * Math.PI);
      if (size < 0.5) return;
      const inner = size * 0.28;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const a = (i * Math.PI) / 4 - Math.PI / 2 + t * 0.9;
        const d = i % 2 === 0 ? size : inner;
        const x = p.x + Math.cos(a) * d;
        const y = p.y + Math.sin(a) * d;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.shadowColor = "#ff6fb1";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - s.last) / 1000 || 0.016);
      s.last = now;
      const on = brushingRef.current;

      // brush height follows the pointer with a little lag
      s.y += (s.ty - s.y) * (1 - Math.exp(-dt * 20));

      // stroke strength eases in / out
      s.amp += ((on ? 1 : 0) - s.amp) * (1 - Math.exp(-dt * (on ? 14 : 9)));
      s.phase += dt * Math.PI * 2 * BRUSH.strokesPerSec;

      const sw = Math.sin(s.phase);
      const cw = Math.cos(s.phase);
      const off = sw * BRUSH.strokeLength * s.scale * s.amp;
      const bob = Math.sin(s.phase * 2) * 1.5 * s.amp;

      // lean follows the drag direction, then settles
      s.tiltTarget *= 0.92;
      s.tilt += (s.tiltTarget - s.tilt) * (1 - Math.exp(-dt * 12));

      brush.style.transform = `translate3d(${off.toFixed(2)}px, ${(s.y + bob).toFixed(2)}px, 0)`;
      const angle = BRUSH.baseAngle + s.tilt + sw * 2.5 * s.amp;
      tiltEl.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      brush.style.setProperty("--bend", (cw * BRUSH.bend * s.amp).toFixed(2));
      brush.style.setProperty("--press", (1 - 0.08 * s.amp).toFixed(3));

      // foam + sparkles while scrubbing
      if (s.amp > 0.2) {
        const cx = s.px + off;
        const cy = s.y + bob;
        const rad = (angle * Math.PI) / 180;
        s.spawn += dt * BRUSH.foamPerSec * s.amp;
        while (s.spawn >= 1) {
          s.spawn -= 1;
          addFoam(cx, cy, rad);
        }
        if (Math.random() < dt * 8) addSpark(cy);
        if (s.parts.length > BRUSH.maxParticles) {
          s.parts.splice(0, s.parts.length - BRUSH.maxParticles);
        }
      }

      // update + draw particles
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      ctx.clearRect(0, 0, s.w, s.h);
      for (let i = s.parts.length - 1; i >= 0; i -= 1) {
        const p = s.parts[i];
        p.life += dt;
        if (p.life >= p.max) {
          s.parts.splice(i, 1);
        } else {
          const t = p.life / p.max;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 26 * dt; // foam slowly sinks
          p.vx *= 0.98;
          if (p.k === 0) drawFoam(p, t);
          else drawSpark(p, t);
        }
      }
      ctx.globalAlpha = 1;

      if (dragging.current || s.parts.length > 0 || s.amp > 0.01) {
        s.raf = requestAnimationFrame(tick);
      } else {
        s.running = false;
        ctx.clearRect(0, 0, s.w, s.h);
      }
    };

    kickRef.current = () => {
      if (s.running) return;
      s.running = true;
      s.last = performance.now();
      s.raf = requestAnimationFrame(tick);
    };

    return () => {
      ro.disconnect();
      cancelAnimationFrame(s.raf);
      s.running = false;
    };
  }, []);

  const moveTo = (clientX, clientY) => {
    const box = boxRef.current;
    const rect = box.getBoundingClientRect();
    const s = fx.current;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100, 3, 97));
    s.px = clamp(clientX - rect.left, rect.width * 0.03, rect.width * 0.97);

    // brush follows the pointer up / down too
    if (clientY !== undefined) {
      const y = clamp(clientY - rect.top, 40, rect.height - 40);
      s.ty = y;
      if (lastX.current === null) s.y = y; // first touch: start right under the finger
    }

    if (lastX.current !== null) {
      const dx = clientX - lastX.current;
      s.tiltTarget = clamp(dx * 0.6, -10, 10);

      // brush only shows while moving LEFT (that reveals the "After" photo)
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      vel.current = vel.current * 0.6 + dx * 0.4;
      if (!reduce && vel.current < -0.6) setBrush(true);
      else if (vel.current > 0.6) setBrush(false);

      // pointer stopped moving -> brush stops too
      window.clearTimeout(idle.current);
      idle.current = window.setTimeout(() => setBrush(false), 140);
    }
    lastX.current = clientX;
  };

  const takeControl = () => {
    touched.current = true;
    cancelAnimationFrame(frame.current);
  };

  // One gentle sweep the first time this slider scrolls into view.
  useEffect(() => {
    const box = boxRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!box || reduce) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played.current || touched.current) return;
        played.current = true;
        observer.disconnect();

        const keys = [50, 24, 76, 50];
        const segment = 560;
        const start = performance.now();

        const step = (now) => {
          if (touched.current) return;

          const elapsed = now - start;

          const i = Math.min(
            keys.length - 2,
            Math.floor(elapsed / segment)
          );

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

  useEffect(() => () => window.clearTimeout(idle.current), []);

  const onKeyDown = (event) => {
    const keys = {
      ArrowLeft: -5,
      ArrowRight: 5,
    };

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

  const stopDrag = () => {
    dragging.current = false;
    lastX.current = null;
    vel.current = 0;
    fx.current.tiltTarget = 0;
    window.clearTimeout(idle.current);
    setBrush(false);
  };

  return (
    <div
      ref={boxRef}
      className={`rs-compare ${brushing ? "is-brushing" : ""}`}
      style={{ "--pos": `${pos}%` }}
      onPointerDown={(event) => {
        takeControl();

        dragging.current = true;
        lastX.current = null;
        vel.current = 0;
        if (navigator.vibrate) navigator.vibrate(12); // tiny buzz on phones
        event.currentTarget.setPointerCapture(event.pointerId);
        kickRef.current();
        moveTo(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (dragging.current) moveTo(event.clientX, event.clientY);
      }}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      <img
        className="rs-img"
        src={before}
        alt={`${label}, before treatment`}
        draggable={false}
        decoding="async"
        loading="lazy"
      />

      <img
        className="rs-img rs-img--after"
        src={after}
        alt={`${label}, after treatment`}
        draggable={false}
        decoding="async"
        loading="lazy"
      />

      <span className="rs-tag">Before</span>
      <span className="rs-tag rs-tag--after">After</span>

      {/* foam bubbles + sparkles are painted here (under the brush) */}
      <canvas ref={canvasRef} className="rs-foam" aria-hidden="true" />

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
          <span className="rs-swap">
            <SwapIcon />
          </span>
        </span>

        {/* real toothbrush: position / angle / bristle bend are driven by the loop above */}
        <span ref={brushRef} className="rs-brush" aria-hidden="true">
          <span ref={tiltRef} className="rs-brush-tilt">
            <BrushIcon />
          </span>
        </span>
      </div>
    </div>
  );
}

/* =====================================================
   AUTO-SCROLLING PATIENT REVIEWS
   ===================================================== */

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

  const half = Math.ceil(REVIEWS.length / 2);

  const rowA =
    REVIEWS.length >= 6 ? REVIEWS.slice(0, half) : REVIEWS;

  const rowB =
    REVIEWS.length >= 6 ? REVIEWS.slice(half) : REVIEWS;

  return (
    <section className="rs-reviews" aria-label="Patient reviews">
      <div className="rs-rev-head">
        <span className="rs-pill">★ Patient reviews</span>

        <h2>Loved by our patients</h2>

        <p>
          Kind words from the people we&rsquo;ve had the joy of treating.
        </p>
      </div>

      <div className="rs-marquee-wrap">
        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB} reverse />
      </div>
    </section>
  );
}

/* =====================================================
   RESULTS PAGE
   ===================================================== */

export default function Results({ contactHref = "/contact" }) {
  const [cases, setCases] = useState(ASSET_CASES);
  const [loading, setLoading] = useState(ASSET_CASES.length === 0);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // If there are no photos in src/assets/results,
  // search the public folder.

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
              No photo pairs found yet. Add files to <code>public/results/</code>{" "}
              named like <code>01-before.jpg</code> and{" "}
              <code>01-after.jpg</code>.
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="rs">
      <div className="rs-orb rs-orb--a" aria-hidden="true" />
      <div className="rs-orb rs-orb--b" aria-hidden="true" />

      {/* Hero */}

      <header className="rs-hero">
        <h1 className="rs-title">
          Real smiles. <span>Real results.</span>
        </h1>

        <p className="rs-lead">
          Drag the handle to compare each smile before and after treatment.
          Photos are shared with the patient&rsquo;s consent.
        </p>
      </header>

      {/* Every case gets its own before / after slider.
          Mobile / tablet: 1 per row. Laptop (1024px+): 3 per row. */}
      <div className="rs-grid">
        {cases.slice(0, visible).map((item) => (
          <section className="rs-case" key={item.id}>
            <Compare before={item.before} after={item.after} label={item.title} />

            <div className="rs-caption">
              <div className="rs-caption-text">
                <h2>{item.title}</h2>
                <p>
                  {item.treatment}
                  {item.note ? ` · ${item.note}` : ""}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      {visible < cases.length && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 28 }}
        >
          <BrushButton
            as="button"
            type="button"
            variant="light"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Show more cases ({cases.length - visible} left)
          </BrushButton>
        </div>
      )}

      {/* Reviews (auto-scrolling) */}
      <Reviews />

      {/* Call to action */}

      <section className="rs-cta">
        <div>
          <h3>Ready for your own before and after?</h3>

          <p>
            Book a consultation and we&rsquo;ll plan your smile together.
          </p>
        </div>

        <BrushButton href={contactHref} variant="light">
          Book a consultation
        </BrushButton>
      </section>
    </main>
  );
}