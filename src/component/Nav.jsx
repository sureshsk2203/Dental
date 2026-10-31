
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import BrushButton from "./BrushButton";
import "./Nav.css";
import "./Navpage.css";

// Navigation links
const LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Our Doctors", to: "/doctors" },
  { label: "Treatments", to: "/#treatments" },
  { label: "Facilities", to: "/facilities" },
  { label: "Results", to: "/results" },
  { label: "Contact", to: "/contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { pathname, hash } = useLocation();

  // Detect scroll position
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Highlight active navigation link
  const isActive = (to) => {
    const [path, h] = to.split("#");

    if (h) {
      return pathname === "/" && hash === `#${h}`;
    }

    if (path === "/") {
      return pathname === "/" && !hash;
    }

    return pathname === path;
  };

  return (
    <header
      className={`nav ${open ? "is-open" : ""} ${
        scrolled ? "is-scrolled" : ""
      } ${pathname === "/" ? "" : "nav--page"}`}
    >
      {/* Brand Logo - Neo Smiles Dental Care */}
      <Link
        className="nav__logo"
        to="/"
        aria-label="Neo Smiles Dental Care - home"
        onClick={() => setOpen(false)}
      >
        <svg
          viewBox="222 238 1448 296"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="neo-stem"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0" stopColor="#e2557f" />
              <stop offset="1" stopColor="#cf3466" />
            </linearGradient>

            <linearGradient
              id="neo-ribbon"
              gradientUnits="userSpaceOnUse"
              x1="150"
              y1="60"
              x2="720"
              y2="690"
            >
              <stop offset="0" stopColor="#f391b2" />
              <stop offset="0.45" stopColor="#e8688f" />
              <stop offset="1" stopColor="#c92d5f" />
            </linearGradient>

            <linearGradient
              id="neo-right"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0" stopColor="#ea7a9f" />
              <stop offset="0.4" stopColor="#de5784" />
              <stop offset="1" stopColor="#ef86a7" />
            </linearGradient>

            <linearGradient
              id="neo-eo"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0" stopColor="#ee7399" />
              <stop offset="1" stopColor="#d0345f" />
            </linearGradient>

            <linearGradient
              id="neo-smiles-text"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0" stopColor="#8a1d55" />
              <stop offset="1" stopColor="#4a0828" />
            </linearGradient>

            <linearGradient
              id="neo-swoosh"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0" stopColor="#f6a8c0" />
              <stop offset="0.55" stopColor="#e8688f" />
              <stop offset="1" stopColor="#c92d5f" />
            </linearGradient>

            {/* Tooth shape inside N */}
            <mask
              id="neo-tooth"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="808"
              height="752"
            >
              <rect width="808" height="752" fill="#fff" />
              <path
                fill="#000"
                d="M118 205C118 182 142 168 172 172C190 175 198 184 212 184C228 172 262 166 280 182C292 196 286 222 274 248C268 262 266 276 264 292L216 300Q200 288 185 306L182 356Q160 352 145 322C135 300 135 275 126 245C121 230 118 218 118 205Z"
              />
            </mask>
          </defs>

          {/* Ribbon N */}
          <g
            transform="translate(218 236) scale(0.25)"
            mask="url(#neo-tooth)"
          >
            <path
              fill="url(#neo-right)"
              d="M515 40H775V700H700L590 560V200Q555 150 515 40Z"
            />

            <path
              fill="#c93a6c"
              opacity="0.55"
              d="M515 40H590V200Q555 150 515 40Z"
            />

            <path
              fill="url(#neo-stem)"
              d="M40 40H110C170 60 212 150 218 260V700H40Z"
            />

            <path
              fill="url(#neo-ribbon)"
              d="M110 40H250C430 70 480 260 560 400C650 540 710 640 775 700H715C600 690 500 600 400 480C340 410 295 330 265 285L218 260C212 150 170 60 110 40Z"
            />
          </g>

          {/* eo text */}
          <text
            className="nav__logo-text"
            x="419"
            y="411"
            fontSize="262"
            letterSpacing="-9"
            fill="url(#neo-eo)"
            textLength="298"
            lengthAdjust="spacingAndGlyphs"
          >
            eo
          </text>

          {/* Smiles text */}
          <text
            className="nav__logo-text"
            x="760"
            y="412"
            fontSize="180"
            fontWeight="800"
            fill="url(#neo-smiles-text)"
            textLength="640"
            lengthAdjust="spacing"
          >
            Smiles
          </text>

          {/* Pink swoosh */}
          <path
            transform="translate(760 452)"
            fill="url(#neo-swoosh)"
            d="M0 0Q320 82 640 0Q320 116 0 0Z"
          />

          {/* Animated sparkle */}
          <g transform="translate(1440 290) scale(1.7)">
            <path
              className="nav__sparkle"
              fill="url(#neo-swoosh)"
              d="M0 -30Q4 -5 30 0Q4 5 0 30Q-4 5 -30 0Q-4 -5 0 -30Z"
            />
          </g>

          <g transform="translate(1385 250) scale(1.7)">
            <path
              className="nav__sparkle nav__sparkle--sm"
              fill="#f391b0"
              d="M0 -14Q2 -2 14 0Q2 2 0 14Q-2 2 -14 0Q-2 -2 0 -14Z"
            />
          </g>
        </svg>
      </Link>

      {/* Navigation Links */}
      <nav className="nav__links" aria-label="Main">
        {LINKS.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            className={isActive(l.to) ? "is-active" : ""}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}

        {/* Mobile Appointment Button */}
        <BrushButton
          as={Link}
          variant="solid"
          className="nav__mobile-cta"
          to="/contact"
          onClick={() => setOpen(false)}
        >
          Book Appointment
        </BrushButton>
      </nav>

      {/* Desktop Appointment Button */}
      <BrushButton
        as={Link}
        variant="solid"
        className="nav__cta"
        to="/contact"
      >
        Book Appointment
      </BrushButton>

      {/* Mobile Menu Toggle */}
      <button
        className="nav__burger"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
