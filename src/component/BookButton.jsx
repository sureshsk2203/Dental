import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import './BookButton.css'

const WHATSAPP_NUMBER = '919750505044' // clinic number: 91 + 10 digits, + illama

// ⏱️ Speed idhula maathunga (milliseconds)
const SENDING_MS = 2000 // brush panni tooth clean aagura neram
const SENT_MS = 2600    // mascot + "Opening WhatsApp" kaattura neram

const TOOTH_PATH =
  'M12 5.5c-1.074-.586-2.583-1.5-4-1.5c-2.1 0-4 1.247-4 5c0 4.899 1.056 8.41 2.671 10.537c.573.756 1.97.521 2.567-.236c.398-.505.819-1.439 1.262-2.801c.292-.771.892-1.504 1.5-1.5c.607-.004 1.208.729 1.5 1.5c.443 1.362.864 2.296 1.262 2.801c.597.757 1.994.992 2.567.236c1.615-2.127 2.671-5.638 2.671-10.537c0-3.753-1.9-5-4-5c-1.417 0-2.926.914-4 1.5z'

const STAR_PATH = 'M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z'

function Tooth({ className = '', size = 24, filled = false }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={TOOTH_PATH} />
    </svg>
  )
}

function Star({ className = '', size = 12 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={STAR_PATH} />
    </svg>
  )
}

/* 🦷 Brushing scene: stains-oda dull tooth -> clean tooth */
function ToothScene() {
  return (
    <svg className="scene" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id="sceneClip">
          <path d={TOOTH_PATH} />
        </clipPath>
      </defs>
      <path className="scene-tooth" d={TOOTH_PATH} />
      <g clipPath="url(#sceneClip)">
        <circle className="stain s1" cx="8.5" cy="9" r="1.7" />
        <circle className="stain s2" cx="15" cy="11" r="1.4" />
        <circle className="stain s3" cx="11.5" cy="13.5" r="1.2" />
        <circle className="stain s4" cx="7.5" cy="13" r="1" />
      </g>
      <path className="scene-edge" d={TOOTH_PATH} />
    </svg>
  )
}

function Brush() {
  return (
    <svg width="44" height="16" viewBox="0 0 44 16" aria-hidden="true">
      <defs>
        <linearGradient id="bkHandle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3fe0ae" />
          <stop offset="1" stopColor="#12a67a" />
        </linearGradient>
      </defs>
      <rect x="12" y="5.2" width="30" height="5.6" rx="2.8" fill="url(#bkHandle)" />
      <rect x="0.8" y="1.5" width="17" height="10" rx="3" fill="#fff" stroke="#9fd4ff" strokeWidth="1.2" />
      <path d="M4 11v3.5M7.5 11v3.5M11 11v3.5M14.5 11v3.5" stroke="#3b9cf0" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/* 😁 Premium tooth mascot: smile + toothbrush + wink */
function Mascot() {
  return (
    <div className="book-mascot">
      <svg className="mascot-svg" width="132" height="110" viewBox="0 -4 120 100" aria-hidden="true">
        <defs>
          <radialGradient id="mBody" cx="38%" cy="28%" r="85%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.6" stopColor="#f7f3ff" />
            <stop offset="1" stopColor="#e3d9fa" />
          </radialGradient>
          <linearGradient id="mEdge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9ccf5" />
            <stop offset="1" stopColor="#b9a2e8" />
          </linearGradient>
          <linearGradient id="mShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.55" stopColor="#a97cf0" stopOpacity="0" />
            <stop offset="1" stopColor="#a97cf0" stopOpacity="0.22" />
          </linearGradient>
          <radialGradient id="mCheek" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ff7fab" stopOpacity="0.75" />
            <stop offset="1" stopColor="#ff7fab" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mEye" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a3290" />
            <stop offset="1" stopColor="#1f1245" />
          </linearGradient>
          <linearGradient id="mHandle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3fe0ae" />
            <stop offset="1" stopColor="#12a67a" />
          </linearGradient>
          <linearGradient id="mBristle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fd3ff" />
            <stop offset="1" stopColor="#3b9cf0" />
          </linearGradient>
          <linearGradient id="mGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff2a8" />
            <stop offset="1" stopColor="#ffb800" />
          </linearGradient>
          <clipPath id="mClip">
            <path transform="translate(12 6) scale(4)" d={TOOTH_PATH} />
          </clipPath>
        </defs>

        {/* arm */}
        <path d="M86 62 Q99 62 101 49" fill="none" stroke="#b9a2e8" strokeWidth="10.5" strokeLinecap="round" />
        <path d="M86 62 Q99 62 101 49" fill="none" stroke="url(#mBody)" strokeWidth="7" strokeLinecap="round" />

        {/* body */}
        <g transform="translate(12 6) scale(4)">
          <path d={TOOTH_PATH} fill="url(#mBody)" stroke="url(#mEdge)" strokeWidth="0.7" strokeLinejoin="round" />
        </g>
        <rect x="12" y="20" width="80" height="72" fill="url(#mShade)" clipPath="url(#mClip)" />

        {/* gloss */}
        <ellipse cx="34" cy="31" rx="9" ry="4.2" fill="#fff" opacity="0.85" transform="rotate(-28 34 31)" />
        <circle cx="25" cy="42" r="1.6" fill="#fff" opacity="0.8" />

        {/* cheeks */}
        <circle cx="38" cy="56" r="7" fill="url(#mCheek)" />
        <circle cx="82" cy="56" r="7" fill="url(#mCheek)" />

        {/* left eye */}
        <ellipse cx="48" cy="45" rx="4.4" ry="5" fill="url(#mEye)" />
        <circle cx="49.6" cy="43" r="1.7" fill="#fff" />
        <circle cx="46.8" cy="47" r="0.8" fill="#fff" opacity="0.8" />

        {/* right eye (wink) */}
        <g className="eye-open">
          <ellipse cx="72" cy="45" rx="4.4" ry="5" fill="url(#mEye)" />
          <circle cx="73.6" cy="43" r="1.7" fill="#fff" />
          <circle cx="70.8" cy="47" r="0.8" fill="#fff" opacity="0.8" />
        </g>
        <path
          className="eye-wink"
          d="M67 46 Q72 40 77 46"
          fill="none"
          stroke="#1f1245"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* mouth */}
        <path d="M50.5 53.5 Q60 69 69.5 53.5Z" fill="#7a2a52" stroke="#7a2a52" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M54 53.8 Q60 56.2 66 53.8 L65 55.6 Q60 57.6 55 55.6Z" fill="#fff" />
        <ellipse cx="60" cy="61.6" rx="4.2" ry="2.3" fill="#f58cb2" />

        {/* brush + hand */}
        <g className="brush">
          <rect x="98.2" y="16" width="5.6" height="46" rx="2.8" fill="url(#mHandle)" />
          <rect x="99.2" y="20" width="1.4" height="34" rx="0.7" fill="#fff" opacity="0.45" />
          <rect x="93.5" y="1" width="15" height="18" rx="4.5" fill="#fff" stroke="#9fd4ff" strokeWidth="1.6" />
          <g stroke="url(#mBristle)" strokeWidth="2" strokeLinecap="round">
            <path d="M97.2 5v10M101 5v10M104.8 5v10" />
          </g>
          <circle className="foam" cx="96" cy="-1" r="2.6" fill="#fff" stroke="#bfe6ff" strokeWidth="0.8" />
          <circle className="foam f2" cx="104" cy="-3" r="1.8" fill="#fff" stroke="#bfe6ff" strokeWidth="0.8" />
          <circle cx="101" cy="49" r="6.4" fill="url(#mBody)" stroke="#b9a2e8" strokeWidth="2" />
        </g>

        {/* glints */}
        <g transform="translate(15 14) scale(0.6)">
          <path className="glint" d={STAR_PATH} fill="url(#mGold)" />
        </g>
        <g transform="translate(33 4) scale(0.36)">
          <path className="glint g2" d={STAR_PATH} fill="url(#mGold)" />
        </g>
      </svg>
    </div>
  )
}

const COLORS = ['#e0709a', '#a97cf0', '#1fc58e', '#f5b301']

// sparkle burst
const PIECES = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2
  const dist = 45 + (i % 3) * 14
  return {
    x: Math.round(Math.cos(angle) * dist),
    y: Math.round(Math.sin(angle) * dist * 0.85 - 6),
    c: COLORS[i % COLORS.length],
  }
})

export default function BookButton({ doctor }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const handleClick = () => {
    if (status !== 'idle') return
    setStatus('sending')

    timers.current.push(
      setTimeout(() => setStatus('sent'), SENDING_MS),
      setTimeout(() => {
        const text = encodeURIComponent(
          `Hi, I'd like to book an appointment with ${doctor}.`
        )
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
      }, SENDING_MS + SENT_MS),
      setTimeout(() => setStatus('idle'), SENDING_MS + SENT_MS + 900)
    )
  }

  return (
    <div className="book-wrap">
      <button
        className={`book-btn ${status}`}
        style={{ '--clean': `${SENDING_MS}ms`, '--sent': `${SENT_MS}ms` }}
        onClick={handleClick}
      >
        <span className="book-mint" />
        <span className="book-shine" />

        {/* idle */}
        <span className="book-content">
          <span className="book-chip book-chip-tooth">
            <Tooth size={18} />
          </span>
          <span className="book-text">Book Appointment</span>
          <span className="book-chip book-chip-arrow">
            <ArrowRight size={18} strokeWidth={2.4} />
          </span>
        </span>

        {/* sent */}
        <span className="book-done">
          <Tooth size={18} filled />
          Opening WhatsApp
          <span className="book-dots">
            <i /><i /><i />
          </span>
        </span>

        {/* sending: brushing scene */}
        <span className="tooth-stack">
          <ToothScene />
          <Star className="t-spark" size={14} />
          <span className="suds">
            <i /><i /><i /><i /><i />
          </span>
        </span>

        <span className="brush-pos">
          <span className="brush-move">
            <Brush />
          </span>
        </span>

        {status === 'sent' && (
          <>
            <Mascot />
            <div className="book-confetti">
              {PIECES.map((p, i) => (
                <span key={i} style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, '--c': p.c }}>
                  <Star size={11} />
                </span>
              ))}
            </div>
          </>
        )}
      </button>
    </div>
  )
}