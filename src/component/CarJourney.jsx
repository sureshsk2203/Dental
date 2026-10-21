import { useEffect, useRef, useState } from "react";
import "./CarJourney.css";

const SAMPLES = 700;
const COLORS = ["#e45a9f", "#9d6be0", "#ffd166", "#29c98a", "#6ec6ff", "#ff8fab"];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = () => COLORS[(Math.random() * COLORS.length) | 0];
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/*
 * Route in the page's own coordinate space (relative to the root element).
 *
 * Laptop / desktop (>= 961px): the car does a full lap of the page. It
 * sweeps edge to edge across the hero, the contact cards, the form and the
 * map, making a rounded hairpin at each margin, then glides into the clinic
 * marker. Smaller screens keep a gentler winding route.
 */
function buildRoute(root, title, map) {
  const r = root.getBoundingClientRect();
  const t = title.getBoundingClientRect();
  const m = map.getBoundingClientRect();
  const grid = root.querySelector(".ct-grid");
  const g = grid ? grid.getBoundingClientRect() : null;

  const w = root.clientWidth;
  const h = root.clientHeight;
  const desktop = w >= 961;

  const lane = Math.max(26, g ? (g.left - r.left) / 2 : 40);
  const startX = desktop ? lane : clamp((t.left - r.left) * 0.2, 28, 90);
  const startY = t.top - r.top + t.height * 0.55;
  // Google's embed places its marker at the centre of the iframe.
  const endX = m.left - r.left + m.width * 0.5;
  const endY = m.top - r.top + m.height * 0.5 - 12;

  const amp = desktop ? (w - lane * 2) / 2 : Math.min(170, w * 0.19);
  const sweeps = 2; // full left-right-left cycles
  const edge = 1.7; // higher = flatter edges, tighter hairpins

  let d = "";
  for (let i = 0; i <= SAMPLES; i++) {
    const u = i / SAMPLES;
    let x;
    let y;

    if (desktop) {
      const raw = -Math.cos(u * Math.PI * 2 * sweeps);
      const shaped = Math.tanh(edge * raw) / Math.tanh(edge);
      const settle = smoothstep(0.8, 1, u);
      const mid = w / 2 + (endX - w / 2) * settle;
      x = mid + amp * (1 - settle) * shaped;
      y = startY + (endY - startY) * u;
    } else {
      const wave = Math.sin(u * Math.PI * 6) * Math.sin(u * Math.PI);
      x = startX + (endX - startX) * u + amp * wave;
      y = startY + (endY - startY) * u + 38 * wave;
    }

    x = clamp(x, 16, w - 16);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }

  return { w, h, d, startX, startY, endX, endY };
}

/* Soft puff sprite, drawn once and reused for every smoke particle. */
function makePuff() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const x = c.getContext("2d");
  const grad = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(190, 150, 205, 0.95)");
  grad.addColorStop(0.45, "rgba(205, 175, 215, 0.45)");
  grad.addColorStop(1, "rgba(215, 190, 225, 0)");
  x.fillStyle = grad;
  x.fillRect(0, 0, 64, 64);
  return c;
}

export default function CarJourney({ rootRef, titleRef, mapRef }) {
  const [geo, setGeo] = useState(null);
  const layerRef = useRef(null);
  const pathRef = useRef(null);
  const trailRef = useRef(null);
  const carRef = useRef(null);
  const smokeRef = useRef(null);
  const motion = useRef({
    cur: 0,
    heading: null,
    hdiff: 0,
    raf: 0,
    last: 0,
    lastAt: null,
    puffs: [],
    fx: [],
    arrived: false,
  });

  // Measure the page and rebuild the route on resize / layout change.
  useEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    const map = mapRef.current;
    if (!root || !title || !map) return undefined;

    const measure = () => setGeo(buildRoute(root, title, map));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    // Entrance animations shift boxes slightly; re-measure once they settle.
    const settle = setTimeout(measure, 1000);
    document.fonts?.ready.then(measure);

    return () => {
      observer.disconnect();
      clearTimeout(settle);
    };
  }, [rootRef, titleRef, mapRef]);

  // Drive the car: eased progress, smoothed heading, exhaust smoke.
  useEffect(() => {
    if (!geo) return undefined;

    const root = rootRef.current;
    const layer = layerRef.current;
    const path = pathRef.current;
    const trail = trailRef.current;
    const car = carRef.current;
    const canvas = smokeRef.current;
    const ctx = canvas.getContext("2d");
    const puff = makePuff();
    const s = motion.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const len = path.getTotalLength();
    trail.style.strokeDasharray = `${len} ${len}`;
    s.lastAt = null;

    const targetProgress = () => {
      const vh = window.innerHeight;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - vh
      );
      const travel = Math.min(
        Math.max(1, geo.endY - geo.startY - vh * 0.35),
        maxScroll * 0.9
      );
      return clamp(window.scrollY / travel);
    };

    /* Arrival party: balloons rise and pop, bubbles float, confetti bursts. */
    const celebrate = () => {
      const ox = geo.endX;
      const oy = geo.endY;
      const fx = s.fx;

      for (let i = 0; i < 9; i++) {
        fx.push({
          k: "balloon",
          x: ox + rand(-70, 70),
          y: oy + rand(-6, 14),
          vx: rand(-14, 14),
          vy: -rand(95, 165),
          r: rand(15, 21),
          color: pick(),
          age: -rand(0, 0.45),
          life: rand(1.5, 2.3),
          ph: rand(0, 6.28),
        });
      }
      for (let i = 0; i < 22; i++) {
        fx.push({
          k: "bubble",
          x: ox + rand(-90, 90),
          y: oy + rand(-10, 20),
          vx: rand(-10, 10),
          vy: -rand(45, 110),
          r: rand(5, 11),
          age: -rand(0, 0.7),
          life: rand(1.3, 2.6),
          ph: rand(0, 6.28),
        });
      }
      for (let i = 0; i < 70; i++) {
        const a = rand(-Math.PI * 0.95, -Math.PI * 0.05);
        const sp = rand(180, 460);
        fx.push({
          k: "confetti",
          x: ox,
          y: oy - 10,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          rot: rand(0, 6.28),
          vr: rand(-9, 9),
          w: rand(5, 9),
          h: rand(3, 6),
          color: pick(),
          age: 0,
          life: rand(1.8, 2.8),
        });
      }
    };

    const burst = (x, y, r, color, pieces) => {
      s.fx.push({ k: "ring", x, y, r, color, age: 0, life: 0.4 });
      for (let i = 0; i < pieces; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(120, 300);
        s.fx.push({
          k: "confetti",
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          rot: rand(0, 6.28),
          vr: rand(-9, 9),
          w: rand(4, 7),
          h: rand(3, 5),
          color,
          age: 0,
          life: rand(0.9, 1.5),
        });
      }
    };

    const drawFx = (dt, rect) => {
      for (let i = s.fx.length - 1; i >= 0; i--) {
        const f = s.fx[i];
        f.age += dt;
        if (f.age < 0) continue;

        if (f.age >= f.life) {
          s.fx.splice(i, 1);
          if (f.k === "balloon") burst(f.x, f.y, f.r + 6, f.color, 9);
          if (f.k === "bubble") burst(f.x, f.y, f.r + 3, "#c98be0", 0);
          continue;
        }

        const k = f.age / f.life;
        const dx = rect.left;
        const dy = rect.top;

        if (f.k === "confetti") {
          const drag = Math.pow(0.35, dt);
          f.vx *= drag;
          f.vy = f.vy * drag + 380 * dt;
          f.x += f.vx * dt;
          f.y += f.vy * dt;
          f.rot += f.vr * dt;
          ctx.globalAlpha = Math.min(1, (f.life - f.age) / 0.5);
          ctx.save();
          ctx.translate(f.x + dx, f.y + dy);
          ctx.rotate(f.rot);
          ctx.scale(1, Math.cos(f.rot * 1.7));
          ctx.fillStyle = f.color;
          ctx.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
          ctx.restore();
        } else if (f.k === "balloon") {
          f.x += (f.vx + Math.sin(f.age * 3 + f.ph) * 18) * dt;
          f.y += f.vy * dt;
          const sx = f.x + dx;
          const sy = f.y + dy;
          ctx.globalAlpha = Math.min(1, f.age / 0.15);
          // string
          ctx.strokeStyle = "rgba(120, 90, 130, 0.5)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx, sy + f.r + 4);
          ctx.quadraticCurveTo(
            sx + Math.sin(f.age * 5) * 6,
            sy + f.r + 16,
            sx + Math.sin(f.age * 4) * 4,
            sy + f.r + 28
          );
          ctx.stroke();
          // knot
          ctx.fillStyle = f.color;
          ctx.beginPath();
          ctx.moveTo(sx, sy + f.r - 1);
          ctx.lineTo(sx - 3.5, sy + f.r + 5);
          ctx.lineTo(sx + 3.5, sy + f.r + 5);
          ctx.fill();
          // body + shine
          ctx.beginPath();
          ctx.ellipse(sx, sy, f.r * 0.8, f.r, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
          ctx.beginPath();
          ctx.ellipse(sx - f.r * 0.3, sy - f.r * 0.35, f.r * 0.17, f.r * 0.3, -0.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (f.k === "bubble") {
          f.x += (f.vx + Math.sin(f.age * 4 + f.ph) * 14) * dt;
          f.y += f.vy * dt;
          const sx = f.x + dx;
          const sy = f.y + dy;
          const r = f.r * (1 + Math.sin(f.age * 6 + f.ph) * 0.05);
          ctx.globalAlpha = Math.min(1, f.age / 0.15);
          ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
          ctx.strokeStyle = "rgba(190, 110, 220, 0.65)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.beginPath();
          ctx.arc(sx - r * 0.35, sy - r * 0.35, r * 0.22, 0, Math.PI * 2);
          ctx.fill();
        } else if (f.k === "spark") {
          f.x += f.vx * dt;
          f.y += f.vy * dt;
          const sx = f.x + dx;
          const sy = f.y + dy;
          const z = f.size * (1 - k * 0.4);
          ctx.globalAlpha = (1 - k) * (0.6 + 0.4 * Math.sin(f.age * 28 + f.x));
          ctx.fillStyle = f.color;
          ctx.beginPath();
          ctx.moveTo(sx, sy - z * 1.8);
          ctx.lineTo(sx + z * 0.45, sy - z * 0.45);
          ctx.lineTo(sx + z * 1.8, sy);
          ctx.lineTo(sx + z * 0.45, sy + z * 0.45);
          ctx.lineTo(sx, sy + z * 1.8);
          ctx.lineTo(sx - z * 0.45, sy + z * 0.45);
          ctx.lineTo(sx - z * 1.8, sy);
          ctx.lineTo(sx - z * 0.45, sy - z * 0.45);
          ctx.closePath();
          ctx.fill();
        } else if (f.k === "ring") {
          ctx.globalAlpha = 1 - k;
          ctx.strokeStyle = f.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(f.x + dx, f.y + dy, f.r + 26 * k, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      if (s.fx.length > 400) s.fx.splice(0, s.fx.length - 400);
    };

    const emitSmoke = (at) => {
      if (reduce) return;
      if (s.lastAt === null || at < s.lastAt) {
        s.lastAt = at;
        return;
      }
      const gap = 5;
      let from = s.lastAt;
      if (at - from > gap * 24) from = at - gap * 24;

      for (let a = from; a < at; a += gap) {
        const p = path.getPointAtLength(a);
        const q = path.getPointAtLength(Math.min(len, a + 4));
        const ang = Math.atan2(q.y - p.y, q.x - p.x);
        const dx = Math.cos(ang);
        const dy = Math.sin(ang);
        s.puffs.push({
          x: p.x - dx * 26 + (Math.random() - 0.5) * 5,
          y: p.y - dy * 26 + (Math.random() - 0.5) * 5,
          vx: -dx * 10 + (Math.random() - 0.5) * 12,
          vy: -dy * 10 + (Math.random() - 0.5) * 12 - 8,
          age: 0,
          life: 1.2 + Math.random() * 0.9,
          size: 7 + Math.random() * 4,
        });
      }
      const sp = path.getPointAtLength(Math.max(0, at - 20));
      for (let n = 0; n < 2; n++) {
        s.fx.push({
          k: "spark",
          x: sp.x + rand(-14, 14),
          y: sp.y + rand(-14, 14),
          vx: rand(-20, 20),
          vy: rand(-30, -5),
          size: rand(2.5, 5),
          color: Math.random() < 0.5 ? "#ffd166" : "#ff8fd0",
          age: 0,
          life: rand(0.5, 1),
        });
      }
      s.lastAt = at;
      if (s.puffs.length > 320) s.puffs.splice(0, s.puffs.length - 320);
    };

    const drawSmoke = (dt) => {
      const dpr = window.devicePixelRatio || 1;
      const cw = Math.round(window.innerWidth * dpr);
      const ch = Math.round(window.innerHeight * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const rect = root.getBoundingClientRect();
      for (let i = s.puffs.length - 1; i >= 0; i--) {
        const p = s.puffs[i];
        p.age += dt;
        if (p.age >= p.life) {
          s.puffs.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = p.age / p.life;
        const radius = p.size + 22 * k;
        ctx.globalAlpha = 0.7 * Math.pow(1 - k, 1.3);
        ctx.drawImage(
          puff,
          p.x + rect.left - radius,
          p.y + rect.top - radius,
          radius * 2,
          radius * 2
        );
      }
      drawFx(dt, rect);
      ctx.globalAlpha = 1;
    };

    const place = (p, speed) => {
      const at = p * len;
      const pt = path.getPointAtLength(at);
      const a = path.getPointAtLength(Math.max(0, at - 4));
      const b = path.getPointAtLength(Math.min(len, at + 4));
      const desired = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;

      if (s.heading === null) s.heading = desired;
      s.hdiff = ((desired - s.heading + 540) % 360) - 180;
      s.heading += reduce ? s.hdiff : s.hdiff * 0.16;

      car.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
      car.style.setProperty("--h", `${s.heading}deg`);
      car.style.setProperty("--speed", speed.toFixed(3));
      trail.style.strokeDashoffset = String(len * (1 - p));
      const arrivedNow = p >= 0.995;
      layer.classList.toggle("is-arrived", arrivedNow);
      if (arrivedNow && !s.arrived) {
        s.arrived = true;
        if (!reduce) celebrate();
      } else if (!arrivedNow && p < 0.97) {
        s.arrived = false;
      }

      if (p < 0.995) emitSmoke(at);
      else s.lastAt = at;
    };

    const tick = (now) => {
      s.raf = 0;
      const dt = Math.min(0.064, s.last ? (now - s.last) / 1000 : 0.016);
      s.last = now;

      const target = targetProgress();
      const diff = target - s.cur;
      const ease = 1 - Math.pow(0.91, dt * 60);
      s.cur =
        reduce || Math.abs(diff) < 0.0003 ? target : s.cur + diff * ease;
      place(s.cur, clamp(Math.abs(diff) * 45));
      drawSmoke(dt);

      if (s.cur !== target || Math.abs(s.hdiff) > 0.2 || s.puffs.length || s.fx.length) {
        s.raf = requestAnimationFrame(tick);
      } else {
        s.last = 0;
      }
    };

    const kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };

    s.cur = targetProgress();
    place(s.cur, 0);
    car.classList.add("is-ready");

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);

    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.last = 0;
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, [geo, rootRef]);

  if (!geo) return null;

  return (
    <div className="ct-journey" ref={layerRef} aria-hidden="true">
      <canvas className="ct-smoke" ref={smokeRef} />

      <svg
        className="ct-journey-svg"
        width={geo.w}
        height={geo.h}
        viewBox={`0 0 ${geo.w} ${geo.h}`}
      >
        <defs>
          <linearGradient
            id="ctTrail"
            gradientUnits="userSpaceOnUse"
            x1={geo.startX}
            y1={geo.startY}
            x2={geo.endX}
            y2={geo.endY}
          >
            <stop offset="0" stopColor="#e45a9f" />
            <stop offset="1" stopColor="#9d6be0" />
          </linearGradient>
        </defs>
        <path className="ct-road-bed" d={geo.d} />
        <path className="ct-road-dash" d={geo.d} ref={pathRef} />
        <path
          className="ct-road-trail"
          d={geo.d}
          ref={trailRef}
          stroke="url(#ctTrail)"
        />
      </svg>

      <div className="ct-dest" style={{ left: geo.endX, top: geo.endY }}>
        <i />
        <i />
        <span className="ct-dest-chip">
          <b>You&rsquo;ve arrived! 🎉</b>
          <small>Welcome to Neo Smiles. See you soon 😁</small>
        </span>
      </div>

      <div className="ct-car" ref={carRef}>
        <div className="ct-car-shadow">
          <div className="ct-car-shadow-rot" />
        </div>

        <div className="ct-car-rot">
          <svg className="ct-car-svg" width="60" height="30" viewBox="0 0 60 30">
            <defs>
              <linearGradient id="ctBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f270b0" />
                <stop offset="1" stopColor="#8d58d8" />
              </linearGradient>
              <linearGradient id="ctRoof" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffc9e2" />
                <stop offset="1" stopColor="#e873b5" />
              </linearGradient>
              <linearGradient id="ctGlass" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#2b1838" />
                <stop offset="1" stopColor="#53326e" />
              </linearGradient>
              <linearGradient id="ctBeam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ffd678" stopOpacity="0.9" />
                <stop offset="1" stopColor="#ffd678" stopOpacity="0" />
              </linearGradient>
              <filter id="ctGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2.2" />
              </filter>
            </defs>

            <g className="ct-car-beam">
              <polygon points="55,8 150,-16 150,46 55,22" fill="url(#ctBeam)" />
            </g>

            {/* wheels */}
            <g fill="#1d1020">
              <rect x="10" y="3" width="9" height="4" rx="1.6" />
              <rect x="10" y="23" width="9" height="4" rx="1.6" />
              <rect x="38" y="3" width="9" height="4" rx="1.6" />
              <rect x="38" y="23" width="9" height="4" rx="1.6" />
            </g>

            {/* body */}
            <path
              d="M12 5 H40 C48 5 55 9 56 15 C55 21 48 25 40 25 H12 C7 25 4 21 4 15 C4 9 7 5 12 5Z"
              fill="url(#ctBody)"
            />
            <rect x="9" y="6.4" width="38" height="1.6" rx="0.8" fill="#fff" opacity="0.38" />

            {/* mirrors */}
            <rect x="36" y="3.4" width="4.2" height="2.4" rx="1.1" fill="#c34a8f" />
            <rect x="36" y="24.2" width="4.2" height="2.4" rx="1.1" fill="#c34a8f" />

            {/* glass + roof */}
            <path d="M38 9.4 C42.5 10.4 45.5 12.4 45.5 15 C45.5 17.6 42.5 19.6 38 20.6Z" fill="url(#ctGlass)" />
            <path d="M17 10.2 L12.5 11.6 Q11.5 15 12.5 18.4 L17 19.8Z" fill="url(#ctGlass)" />
            <rect x="17" y="9.4" width="21" height="11.2" rx="4" fill="url(#ctRoof)" />

            {/* lights */}
            <g className="ct-car-tail">
              <circle cx="4.6" cy="9.6" r="4.2" fill="#ff3b5c" filter="url(#ctGlow)" />
              <circle cx="4.6" cy="20.4" r="4.2" fill="#ff3b5c" filter="url(#ctGlow)" />
            </g>
            <rect x="4" y="8" width="2.2" height="3.8" rx="1" fill="#ff4d6d" />
            <rect x="4" y="18.2" width="2.2" height="3.8" rx="1" fill="#ff4d6d" />
            <ellipse cx="54.2" cy="9" rx="2.1" ry="1.7" fill="#fff8dc" />
            <ellipse cx="54.2" cy="21" rx="2.1" ry="1.7" fill="#fff8dc" />
          </svg>
        </div>
      </div>
    </div>
  );
}