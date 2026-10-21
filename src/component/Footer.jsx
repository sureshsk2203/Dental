import { Link } from "react-router-dom";
import BrushButton from "./BrushButton";
import "./Footer.css";

/* =====================================================
   EDIT YOUR CLINIC DETAILS HERE
   ===================================================== */
const CLINIC = {
  name: "Neo Dental Care",
  about: "Gentle, honest dental care for the whole family in Salem.",
  address: "93, Greenways Rd, near Soodamani Hospital, Sinthampalayam, Fairlands, Alagapuram Pudur, Salem, Tamil Nadu 636016",
  phone: "+91 97505 05044",
  whatsapp: "919750505044", // country code + number, no + or spaces
  email: "neosmilessalem@gmail.com",
  // each day: a label + one line per time slot
  hours: [
    ["Mon – Sat", ["10:30 AM – 2:00 PM", "5:00 PM – 8:30 PM"]],
    ["Sunday", ["Morning: only on appointment", "Evening: 5:30 PM – 8:30 PM"]],
  ],
};

// same links as the Nav  ("/#about" = a section on the Home page)
const LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Our Doctor", to: "/doctors" },
  { label: "Treatments", to: "/#treatments" },
  { label: "Facilities", to: "/facilities" },
  { label: "Results", to: "/results" },
  { label: "Contact", to: "/contact" },
];

const query = encodeURIComponent(CLINIC.address);
const MAP_EMBED = `https://www.google.com/maps?q=${query}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${query}`;

const ICONS = {
  pin: <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.500A2.500 2.500 0 1112 6.500a2.500 2.500 0 010 5z" />,
  phone: <path d="M6.600 10.800a15 15 0 006.600 6.600l2.200-2.200a1 1 0 011-.25 11 11 0 003.500.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.500a1 1 0 011 1c0 1.200.2 2.400.56 3.500a1 1 0 01-.25 1l-2.200 2.300z" />,
  mail: <path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7.500L4.500 7h15L12 12.500z" />,
  clock: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5.400l4 2.300-.8 1.300L11 13V7h2z" />,
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__inner reveal">
        {/* brand */}
        <div className="footer__brand">
          <Link className="footer__logo" to="/">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 21s-6.500-6.200-6.500-11A6.500 6.500 0 0 1 12 3.500 6.500 6.500 0 0 1 18.500 10c0 4.800-6.500 11-6.500 11Z" />
              <circle cx="12" cy="10" r="2.300" />
            </svg>
            {CLINIC.name}
          </Link>
          <p>{CLINIC.about}</p>

          <BrushButton
            variant="light"
            href={`https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent("Hello, I would like to book an appointment.")}`}
            target="_blank"
            rel="noreferrer"
          >
            Book on WhatsApp
          </BrushButton>
        </div>

        {/* links */}
        <nav className="footer__col" aria-label="Footer">
          <h4>Explore</h4>
          <ul>
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link className="footer__link" to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* contact + address */}
        <div className="footer__col footer__contact">
          <h4>Visit us</h4>
          <ul>
            <li>
              <span className="footer__ico footer__ico--pin"><Icon name="pin" /></span>
              <a href={MAP_LINK} target="_blank" rel="noreferrer">
                <address>{CLINIC.address}</address>
              </a>
            </li>
            <li>
              <span className="footer__ico"><Icon name="phone" /></span>
              <a href={`tel:${CLINIC.phone.replace(/\s/g, "")}`}>{CLINIC.phone}</a>
            </li>
            <li>
              <span className="footer__ico"><Icon name="mail" /></span>
              <a href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a>
            </li>
            <li>
              <span className="footer__ico"><Icon name="clock" /></span>
              <div className="footer__hours">
                {CLINIC.hours.map(([day, slots]) => (
                  <p key={day}>
                    <b>{day}</b>
                    <span>
                      {slots.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </span>
                  </p>
                ))}
              </div>
            </li>
          </ul>
        </div>

        {/* map */}
        <div className="footer__map">
          <iframe
            title="Clinic location on Google Maps"
            src={MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <BrushButton className="footer__btn--map" variant="light" href={MAP_LINK} target="_blank" rel="noreferrer">
            Get directions
          </BrushButton>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</p>
        <p>Salem, Tamil Nadu</p>
      </div>
    </footer>
  );
}