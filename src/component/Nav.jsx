import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BrushButton from "./BrushButton"; // toothbrush hover button (file name: BrushButton.jsx)
import "./Nav.css";
import "./NavPage.css"; // dark nav text on the light pages

/* Every link goes to a page ("/doctors" ...) or to a section of the Home page ("/#about" ...).
   App.jsx has the routes. */
const LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Our Doctor", to: "/doctors" },
  { label: "Treatments", to: "/#treatments" },
  { label: "Facilities", to: "/facilities" },
  { label: "Results", to: "/results" },
  { label: "Contact", to: "/contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  /* which link is highlighted = decided from the address bar */
  const isActive = (to) => {
    const [path, h] = to.split("#");
    if (h) return pathname === "/" && hash === `#${h}`;
    if (path === "/") return pathname === "/" && !hash;
    return pathname === path;
  };

  return (
    <header className={`nav ${open ? "is-open" : ""} ${pathname === "/" ? "" : "nav--page"}`}>
      {/* logo  (image comes from  public/Neo_logo.png  - file name is case-sensitive) */}
      <Link className="nav__logo" to="/" onClick={() => setOpen(false)}>
        <img className="nav__logo-img" src="/Neo_logo.png" alt="Neo Dental Care logo" />
        Neo Dental Care
      </Link>

      {/* links */}
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
        {/* only visible inside the mobile menu */}
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

      {/* button (desktop) */}
      <BrushButton as={Link} variant="solid" className="nav__cta" to="/contact">
        Book Appointment
      </BrushButton>

      {/* burger (mobile only) */}
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