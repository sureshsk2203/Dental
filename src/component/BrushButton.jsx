import { useEffect, useRef, useState } from "react";
import "./BrushButton.css";

/* Toothbrush hover animation for contact-page actions. */
const BUBBLES = [
  [10, 64, 7], [22, 28, 5], [36, 68, 8], [50, 26, 6],
  [64, 66, 7], [78, 30, 5], [90, 62, 6],
];

const SPARKS = [
  [54, 14, 12, 0.78],
  [74, 80, 10, 0.88],
  [90, 20, 14, 0.98],
];

function Toothbrush() {
  return (
    <svg viewBox="0 0 64 28" aria-hidden="true">
      <path d="M2 15 Q2 11 6 11 H34 L40 13 V19 L34 21 H6 Q2 21 2 17 Z" fill="#4aa8e8" />
      <path d="M6 13 H32" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      {[10, 16, 22].map((x) => (
        <circle key={x} cx={x} cy="16.5" r="1.2" fill="#fff" opacity="0.7" />
      ))}
      <rect x="38" y="12" width="23" height="8" rx="3" fill="#2f8fd6" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={40 + i * 3.4} y="3.5" width="2.4" height="9" rx="1.2" fill="#fff" stroke="#f4b3cd" strokeWidth="0.8" />
      ))}
    </svg>
  );
}

function RollingTooth() {
  return (
    <svg viewBox="0 0 32 36" aria-hidden="true">
      <path d="M16 4c-2.8-2.4-9-2.2-10 3.6-.5 3.8 1.8 6 2.3 9.6.7 4.4.7 12.3 3.1 12.3 1.8 0 1.8-5.1 3.1-7.6.7-1.4 2.5-1.4 3.2 0 1.3 2.5 1.3 7.6 3.1 7.6 2.4 0 2.4-7.9 3.1-12.3.5-3.6 2.8-5.8 2.3-9.6C25 1.8 18.8 1.6 16 4z" fill="#fff" stroke="#e46a98" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 8.5c.6-1.4 2-2 3.4-1.8" stroke="#f4b3cd" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="12.5" cy="14" r="1.2" fill="#c4527f" />
      <circle cx="19.5" cy="14" r="1.2" fill="#c4527f" />
      <path d="M13 17.5q3 2.6 6 0" stroke="#c4527f" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function BrushButton({
  as: Tag = "a",
  variant = "light",
  className = "",
  icon = null,
  arrow = "↗",
  children,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(0);
  const enteredAt = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleEnter = (event) => {
    clearTimeout(timer.current);
    setLeaving(false);
    enteredAt.current = Date.now();
    onMouseEnter?.(event);
  };

  const handleLeave = (event) => {
    clearTimeout(timer.current);
    if (Date.now() - enteredAt.current > 700) {
      setLeaving(true);
      timer.current = setTimeout(() => setLeaving(false), 2100);
    }
    onMouseLeave?.(event);
  };

  const row = (
    <>
      {icon && <span className="brush-btn__icon">{icon}</span>}
      <span className="brush-btn__text">{children}</span>
      {arrow && <span className="brush-btn__arrow">{arrow}</span>}
    </>
  );

  return (
    <Tag
      className={`brush-btn brush-btn--${variant} ${leaving ? "is-leaving" : ""} ${className}`.replace(/\s+/g, " ").trim()}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...rest}
    >
      <span className="brush-btn__row">{row}</span>
      <span className="brush-btn__fill" aria-hidden="true">
        <span className="brush-btn__row brush-btn__row--on">{row}</span>
      </span>
      {BUBBLES.map(([x, y, size]) => (
        <i key={x} className="brush-btn__bubble" aria-hidden="true"
          style={{ "--x": `${x}%`, "--y": `${y}%`, "--s": `${size}px`, "--d": `${((x / 100) * 0.8).toFixed(2)}s` }} />
      ))}
      {SPARKS.map(([x, y, size, delay]) => (
        <i key={x} className="brush-btn__spark" aria-hidden="true"
          style={{ "--x": `${x}%`, "--y": `${y}%`, "--s": `${size}px`, "--d": `${delay}s` }} />
      ))}
      <span className="brush-btn__brush" aria-hidden="true"><Toothbrush /></span>
      <span className="brush-btn__tooth" aria-hidden="true"><RollingTooth /></span>
    </Tag>
  );
}
