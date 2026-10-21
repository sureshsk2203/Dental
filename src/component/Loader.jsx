import { useEffect, useRef, useState } from "react";
import "./Loader.css";

const LOGO = "/neo-smiles-logo.png";
const TITLE = "Neo Smiles";

const INTRO_MS = 700; // logo reveal mudinjadhum progress start aagum
const TAIL_MS = 450;  // 100% la konja neram nikkum, appuram exit
const EXIT_MS = 1400; // curtain open aagura neram (CSS-oda match aaganum)

/* ---------- title animation (video-la irundhu measure pannadhu) ---------- */
const TITLE_DELAY = 0.25; // seconds — logo-oda sernthu start aagum
const TITLE_SPEED = 1.35; // 1 = video speed (6 letters). 9 letters-ku 1.35 comfortable. Innum slow-na 1.6
const BIG = 1.985;        // start-la text evlo periya (CSS --big-oda match aaganum)

/* letter cycle boundaries (video seconds): 6 letters. Vera letter count-ku auto stretch aagum */
const VIDEO_T = [0.3, 0.68, 1.15, 1.65, 2.2, 2.72, 3.2];

/* camera zoom-out (1 = final size) */
const SCALE_KF = [[0, BIG], [0.5, 1.985], [0.7, 1.94], [1.0, 1.88], [1.3, 1.75], [1.6, 1.55], [2.0, 1.27], [2.4, 1.1], [2.8, 1.03], [3.2, 1], [3.5, 1]];
/* camera pan: text-oda left edge, final width-la fraction (right-la irundhu left-ku nadakkum) */
const PAN_KF = [[0, 0.536], [0.5, 0.532], [0.6, 0.525], [0.7, 0.518], [0.8, 0.507], [0.9, 0.493], [1.0, 0.475], [1.1, 0.464], [1.2, 0.432], [1.3, 0.405], [1.4, 0.374], [1.5, 0.336], [1.6, 0.295], [1.7, 0.255], [1.8, 0.214], [1.9, 0.178], [2.0, 0.146], [2.1, 0.119], [2.2, 0.097], [2.3, 0.077], [2.4, 0.061], [2.5, 0.047], [2.6, 0.036], [2.7, 0.027], [2.8, 0.023], [2.9, 0.014], [3.0, 0.009], [3.2, 0.005], [3.4, 0], [3.5, 0]];

/* letter pinnaadi / munnadi banana — (x%, y%, width, rotate, front?) */
const NANAS = [
  { dx: 0.62, dy: 0.74, w: 0.95, r: -8, f: 0 },
  { dx: 0.4, dy: 0.8, w: 0.95, r: 10, f: 0 },
  { dx: 0.5, dy: 0.35, w: 0.9, r: -16, f: 1 },
  { dx: 0.55, dy: 0.6, w: 0.9, r: 14, f: 0 },
  { dx: 0.3, dy: 0.2, w: 0.8, r: -6, f: 0 },
  { dx: 0.5, dy: 0.5, w: 1.4, r: -30, f: 0 },
  { dx: 0.55, dy: 0.75, w: 1.4, r: 12, f: 0 },
  { dx: 0.35, dy: 0.55, w: 0.95, r: -12, f: 1 },
  { dx: 0.5, dy: 0.7, w: 0.9, r: 8, f: 0 },
];

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeBack = (t) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const kf = (arr, t) => {
  if (t <= arr[0][0]) return arr[0][1];
  for (let i = 1; i < arr.length; i++) {
    if (t <= arr[i][0]) {
      const [t0, v0] = arr[i - 1], [t1, v1] = arr[i];
      return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
    }
  }
  return arr[arr.length - 1][1];
};
const boundsFor = (n) =>
  Array.from({ length: n + 1 }, (_, k) => {
    const u = (k * 6) / n;
    const i = Math.min(5, Math.floor(u));
    return VIDEO_T[i] + (VIDEO_T[i + 1] - VIDEO_T[i]) * (u - i);
  });

const SPARKLES = [
  { x: 4, y: 14, s: 1, d: 0 },
  { x: 94, y: 22, s: 0.7, d: 0.7 },
  { x: 90, y: 78, s: 0.85, d: 1.3 },
  { x: 8, y: 74, s: 0.6, d: 0.4 },
];

const BUBBLES = [
  { l: 90, w: 6, d: 0 },
  { l: 96, w: 4, d: 0.22 },
  { l: 84, w: 5, d: 0.44 },
  { l: 100, w: 7, d: 0.1 },
];

/* title letters: plum-rose -> violet gradient (letter by letter) */
const lerp = (a, b, t) => Math.round(a + (b - a) * t);
const letterRGB = (t) => [lerp(196, 118, t), lerp(38, 74, t), lerp(122, 208, t)];
const mix = (c, to, k) => c.map((v, i) => Math.round(v + (to[i] - v) * k));
const letterGradient = (t) => {
  const c = letterRGB(t);
  const hi = mix(c, [255, 235, 248], 0.32);
  const lo = mix(c, [70, 20, 80], 0.28);
  return `linear-gradient(180deg, rgb(${hi}) 0%, rgb(${c}) 48%, rgb(${lo}) 100%)`;
};
const letterColor = (t) =>
  `rgb(${lerp(196, 118, t)}, ${lerp(38, 74, t)}, ${lerp(122, 208, t)})`;

/* soft start, soft end, but never stalls */
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const progressAt = (t) => 0.3 * t + 0.7 * easeInOutCubic(t);

function Brush() {
  return (
    <svg className="loader__brush-svg" viewBox="0 0 140 42" aria-hidden="true">
      <defs>
        <linearGradient id="lbHandle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f6a4cd" />
          <stop offset="55%" stopColor="#e0489d" />
          <stop offset="100%" stopColor="#9a5be0" />
        </linearGradient>
        <linearGradient id="lbHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#efe0fb" />
        </linearGradient>
      </defs>

      {/* bristles */}
      {Array.from({ length: 8 }).map((_, k) => (
        <g key={k}>
          <rect x={103 + k * 4.2} y="24" width="2.8" height="18" rx="1.4" fill="#ffffff" />
          <rect x={103 + k * 4.2} y="35" width="2.8" height="7" rx="1.4" fill="#e0489d" />
        </g>
      ))}

      {/* handle + neck */}
      <path d="M4 17 Q4 12 9 12.5 L100 15.5 L100 25 L9 28 Q4 28.5 4 23 Z" fill="url(#lbHandle)" />
      <path d="M12 16.4 L88 18.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <circle cx="13" cy="20.5" r="2.6" fill="#fff" opacity="0.85" />

      {/* head */}
      <rect x="98" y="6" width="42" height="21" rx="10.5" fill="url(#lbHead)" stroke="#d9bff0" strokeWidth="1" />
      <path d="M106 11 L130 11" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* yellow lead + white letters + bananas + zoom-out/pan — ellam oru rAF loop-la */
function LetterTitle({ text }) {
  const rowRef = useRef(null);
  const leadSvgRef = useRef(null);
  const leadPathRef = useRef(null);
  const chars = text.split("");
  const last = chars.length - 1;
  const glyphCount = chars.filter((c) => c !== " ").length;

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const letters = Array.from(row.querySelectorAll("[data-ch]"));
    const mains = letters.map((l) => l.querySelector(".loader__ch-main"));
    const nanas = Array.from(row.querySelectorAll(".loader__nana"));
    const sparks = Array.from(row.querySelectorAll(".loader__spark"));
    const outline = row.querySelector(".loader__ch-ol");
    const shine = row.querySelector(".loader__shine");
    const lead = leadPathRef.current;
    const leadSvg = leadSvgRef.current;
    const n = letters.length;
    const b = boundsFor(n);
    let geo = null;
    let raf;

    const measure = () => {
      const cs = getComputedStyle(row);
      const fs = parseFloat(cs.fontSize);
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      const asc = (ch) => ctx.measureText(ch).actualBoundingBoxAscent || fs * 0.7;
      const baseY = row.querySelector(".loader__probe").offsetTop;
      const W = row.offsetWidth;
      const H = row.offsetHeight;
      const capH = asc("H");
      const s = 0.16 * capH;
      const L = letters.map((el, k) => {
        const ch = el.textContent;
        const xl = el.offsetLeft;
        return { xl, xr: xl + el.offsetWidth, h: asc(ch), ch, k };
      });
      geo = { baseY, W, H, s, capH, L };
      leadSvg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      leadSvg.style.width = W + "px";
      leadSvg.style.height = H + "px";
      row.style.transformOrigin = `50% ${baseY - capH / 2}px`;
      sparks.forEach((el, k) => {
        const g = L[k];
        el.style.left = g.xr - 0.12 * (g.xr - g.xl) + "px";
        el.style.top = baseY - g.h + "px";
        el.style.width = 0.34 * capH + "px";
      });
      nanas.forEach((el, k) => {
        const g = L[k], nn = NANAS[k % NANAS.length];
        const bw = Math.max(nn.w * (g.xr - g.xl), 0.8 * g.h);
        el.style.width = bw + "px";
        el.style.left = g.xl + nn.dx * (g.xr - g.xl) + "px";
        el.style.top = baseY - g.h * (1 - nn.dy) + "px";
      });
    };

    const render = (vt) => {
      if (!geo) return;
      const { baseY, W, s, capH, L } = geo;
      /* camera */
      const S = kf(SCALE_KF, vt);
      const f = kf(PAN_KF, vt);
      const Wf = W / BIG;
      const tx = Wf * (f + (S - 1) / 2);
      const ycap = baseY - capH / 2;
      row.style.transform = `translate(-50%, ${-ycap}px) translate3d(${tx.toFixed(2)}px,0,0) scale(${(S / BIG).toFixed(4)})`;

      /* letters + bananas */
      L.forEach((g, k) => {
        const t0 = b[k], t1 = b[k + 1], d = t1 - t0, tm = t0 + 0.55 * d;
        const rv = easeOut(clamp01((vt - t0 - 0.06 * d) / (0.5 * d)));
        mains[k].style.clipPath = rv >= 1 ? "none" : `inset(-30% ${((1 - rv) * 100).toFixed(2)}% -30% -10%)`;
        const nn = NANAS[k % NANAS.length];
        const c = easeBack(clamp01((vt - tm) / 0.3));
        const wob = Math.sin(vt * 4.2 + k * 1.7) * 3.5 * clamp01((vt - tm) / 0.5);
        nanas[k].style.transform = `translate(-50%,-50%) rotate(${(nn.r + wob).toFixed(2)}deg) scale(${c.toFixed(3)})`;
        const sp = clamp01((vt - tm) / 0.45);
        const ss = Math.sin(Math.PI * sp);
        sparks[k].style.transform = `translate(-50%,-50%) rotate(${(sp * 90).toFixed(1)}deg) scale(${ss.toFixed(3)})`;
        sparks[k].style.opacity = ss.toFixed(3);
        if (k === n - 1) {
          /* last letter: yellow outline -> white fill (video-la maari) */
          const fill = clamp01((vt - (tm + 0.18)) / 0.32);
          mains[k].style.opacity = vt < tm ? 1 : fill.toFixed(3);
          if (outline) outline.style.opacity = (clamp01((vt - tm) / 0.12) * (1 - clamp01((vt - tm - 0.3) / 0.3))).toFixed(3);
        }
      });

      /* yellow lead: bar -> Λ -> bar, letter-ku letter munnadi pogum */
      let a, bb, H, op = 1;
      if (vt < b[0]) {
        const st = L[0].xl - 1.25 * s;
        a = bb = st; H = L[0].h; op = clamp01(vt / 0.1);
      } else {
        let k = -1;
        for (let i = 0; i < n; i++) if (vt >= b[i] && vt < b[i + 1]) k = i;
        if (k < 0 && vt >= b[n]) k = n - 1;
        if (k < 0) { op = 0; a = bb = 0; H = capH; }
        else {
          const g = L[k], nx = L[k + 1];
          const t0 = b[k], t1 = b[k + 1], tm = t0 + 0.55 * (t1 - t0);
          const st = k === 0 ? L[0].xl - 1.25 * s : g.xl;
          if (vt < tm) {
            const e = easeIO(clamp01((vt - t0) / (tm - t0)));
            a = st + (g.xl - st) * e;
            bb = st + (g.xr - s - st) * e;
            H = g.h;
          } else if (nx) {
            const c = easeIO(clamp01((vt - tm) / (t1 - tm)));
            a = g.xl + (nx.xl - g.xl) * c;
            bb = g.xr - s + (nx.xl - (g.xr - s)) * c;
            H = g.h + (nx.h - g.h) * c;
          } else {
            a = g.xl; bb = g.xr - s; H = g.h;
            op = 1 - clamp01((vt - (tm + 0.05)) / 0.3);
          }
        }
      }
      bb = Math.max(bb, a);
      const m = (a + bb + s) / 2, yb = baseY, yt = baseY - H;
      lead.setAttribute(
        "d",
        `M${a} ${yb}L${a + s} ${yb}L${m + s / 2} ${yt}L${m - s / 2} ${yt}ZM${bb} ${yb}L${bb + s} ${yb}L${m + s / 2} ${yt}L${m - s / 2} ${yt}Z`
      );
      leadSvg.style.opacity = op.toFixed(3);

      /* final sheen sweep */
      if (shine) {
        const p = clamp01((vt - 3.25) / 0.9);
        shine.style.opacity = p > 0 && p < 1 ? "1" : "0";
        shine.style.transform = `translateX(${(-70 + p * 190).toFixed(1)}%) skewX(-18deg)`;
      }
    };

    measure();
    if (document.fonts && document.fonts.load) {
      Promise.all([
        document.fonts.load('700 100px "Playfair Display"'),
        document.fonts.ready,
      ]).then(measure);
    }
    window.addEventListener("resize", measure);

    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      render(99);
    } else {
      const t0 = performance.now();
      const frame = (now) => {
        const vt = ((now - t0) / 1000 - TITLE_DELAY) / TITLE_SPEED;
        render(Math.max(0, vt));
        if (vt < 4) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [text]);

  return (
    <div ref={rowRef} className="loader__row" aria-hidden="true">
      {chars.map((ch, i) =>
        ch === " " ? (
          <span key={i} className="loader__sp">{"\u00A0"}</span>
        ) : (
          <span key={i} className="loader__ch" data-ch>
            <span className="loader__ch-main" style={{ backgroundImage: letterGradient(i / last) }}>{ch}</span>
            {i === last && <span className="loader__ch-ol">{ch}</span>}
          </span>
        )
      )}
      <span className="loader__probe" />
      {Array.from({ length: glyphCount }).map((_, k) => (
        <svg
          key={k}
          className={`loader__nana ${NANAS[k % NANAS.length].f ? "loader__nana--front" : ""}`}
          viewBox="0 0 60 24"
        >
          <path d="M2 5 C12 21 40 25 58 3 C52 12 38 15 26 14 C16 13 8 10 2 5 Z" fill="url(#ldNanaG)" />
          <path d="M6 7 C16 17 38 19 54 6" fill="none" stroke="#fff6cf" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
          <path d="M5 6.2 C14 12 30 15 48 11" fill="none" stroke="#c98a14" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
          <circle cx="22" cy="12" r="0.9" fill="#8a5a12" opacity="0.55" />
          <circle cx="34" cy="12.4" r="0.8" fill="#8a5a12" opacity="0.5" />
          <path d="M56 4 L59 0.5 L60.8 6 Z" fill="#6e4310" />
          <path d="M1.5 4.6 L3.8 3.4 L4 6.4 Z" fill="#6e4310" />
        </svg>
      ))}
      {Array.from({ length: glyphCount }).map((_, k) => (
        <svg key={`s${k}`} className="loader__spark" viewBox="-16 -16 32 32">
          <path d="M0 -14 C2 -4 4 -2 14 0 C4 2 2 4 0 14 C-2 4 -4 2 -14 0 C-4 -2 -2 -4 0 -14 Z" />
        </svg>
      ))}
      <span className="loader__shine" />
      <svg ref={leadSvgRef} className="loader__lead">
        <defs>
          <linearGradient id="ldLeadG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe07a" />
            <stop offset="55%" stopColor="#f4b63f" />
            <stop offset="100%" stopColor="#df9418" />
          </linearGradient>
          <linearGradient id="ldNanaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe98a" />
            <stop offset="60%" stopColor="#f6bd3c" />
            <stop offset="100%" stopColor="#d9941c" />
          </linearGradient>
        </defs>
        <path ref={leadPathRef} fill="url(#ldLeadG)" />
      </svg>
    </div>
  );
}

export default function Loader({ onFinish, duration = 5800, logo = LOGO }) {
  const [hide, setHide] = useState(false);
  const [done, setDone] = useState(false);
  const rootRef = useRef(null);
  const pctRef = useRef(null);
  const finishRef = useRef(onFinish);

  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  /* page scroll lock while loading */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* progress: bar + brush + % number, ellam oru value-la (--p) irundhu */
  useEffect(() => {
    const end = Math.max(1500, duration - TAIL_MS);
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const raw = (now - t0 - INTRO_MS) / (end - INTRO_MS);
      const t = Math.min(1, Math.max(0, raw));
      const p = progressAt(t) * 100;
      if (rootRef.current) rootRef.current.style.setProperty("--p", p.toFixed(2));
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  /* exit */
  useEffect(() => {
    const t1 = setTimeout(() => setHide(true), duration);
    const t2 = setTimeout(() => finishRef.current && finishRef.current(), duration + EXIT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration]);

  return (
    <div
      ref={rootRef}
      className={`loader ${hide ? "loader--hide" : ""} ${done ? "loader--done" : ""}`}
      role="status"
      aria-label="Loading Neo Smiles Dental Care"
      style={{ "--logo": `url(${logo})` }}
    >
      {/* background = 2 curtains, exit-la rendu pakkam thirakkum */}
      <div className="loader__curtain loader__curtain--top" />
      <div className="loader__curtain loader__curtain--bottom" />

      <div className="loader__content">
        <div className="loader__orbs" aria-hidden="true">
          <span className="loader__orb loader__orb--a" />
          <span className="loader__orb loader__orb--b" />
          <span className="loader__orb loader__orb--c" />
        </div>
        <div className="loader__grain" aria-hidden="true" />

        <div className="loader__stage">
          <div className="loader__emblem" aria-hidden="true">
            <span className="loader__ring r1" />
            <span className="loader__ring r2" />
            <span className="loader__ring r3" />
            <span className="loader__halo" />

            <div className="loader__mark">
              <img src={logo} alt="" />
              {SPARKLES.map((p, i) => (
                <svg
                  key={i}
                  className="loader__sparkle"
                  viewBox="-16 -16 32 32"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: `calc(var(--u) * ${0.045 * p.s})`,
                    animationDelay: `${1.9 + p.d}s`,
                  }}
                >
                  <path d="M0 -14 C2 -4 4 -2 14 0 C4 2 2 4 0 14 C-2 4 -4 2 -14 0 C-4 -2 -2 -4 0 -14 Z" />
                </svg>
              ))}
            </div>
          </div>

          {/* title: yellow bar -> Λ -> letters, zoom-out + pan (banana reel style) */}
          <div className="loader__title" role="img" aria-label="Neo Smiles">
            <LetterTitle text={TITLE} />
          </div>

          <div className="loader__sub">
            <span>DENTAL CARE</span>
          </div>
        </div>

        <div className="loader__progress">
          <div className="loader__rail">
            <div className="loader__fill" />
            <div className="loader__brush" aria-hidden="true">
              <div className="loader__brush-in">
                <Brush />
                {BUBBLES.map((b, i) => (
                  <span
                    key={i}
                    className="loader__bubble"
                    style={{ left: `${b.l}%`, width: b.w, height: b.w, animationDelay: `${b.d}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="loader__meta">
            <span className="loader__hint" key={done ? "ready" : "busy"}>
              {done ? "Your smile awaits" : "Brushing up your smile"}
            </span>
            <span className="loader__pct">
              <b ref={pctRef}>0</b>
              <i>%</i>
            </span>
          </div>

          <div className="loader__foot">Fairlands · Salem</div>
        </div>
      </div>
    </div>
  );
}