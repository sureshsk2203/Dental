import { useState } from "react";
import "./Contact.css";
import BrushButton from "./BrushButton";

const CLINIC = {
  name: "Neo Smiles Dental Care",
  phone: "+91 97505 05044",
  tel: "+919750505044",
  whatsapp: "919750505044",
  address: "Salem, Tamil Nadu",
  mapQuery: "Neo Smiles Dental Care, Salem, Tamil Nadu",
};

const SERVICES = [
  "General Check-up",
  "Teeth Cleaning & Polishing",
  "Root Canal Treatment",
  "Braces & Aligners",
  "Dental Implants",
  "Teeth Whitening",
  "Kids Dentistry",
  "Other",
];

function Icon({ children, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const PhoneIcon = () => (
  <Icon>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </Icon>
);

const ChatIcon = () => (
  <Icon>
    <path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.3L3 20.5l1.7-5A8.4 8.4 0 1 1 21 11.5z" />
  </Icon>
);

const PinIcon = () => (
  <Icon>
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

const ClockIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

const ArrowIcon = () => (
  <Icon size={18}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Icon>
);

const CheckIcon = () => (
  <Icon size={17}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
};

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const updateField = (key) => (event) => {
    const value = event.target.value;
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
    setSent(false);
  };

  const submitForm = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = "Please enter your name.";
    }
    if (form.phone.replace(/\D/g, "").length !== 10) {
      nextErrors.phone = "Enter a valid 10-digit phone number.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const message = [
      `Hello ${CLINIC.name}! I'd like to book an appointment.`,
      "",
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.service ? `Service: ${form.service}` : "",
      form.date ? `Preferred date: ${form.date}` : "",
      form.message.trim() ? `Message: ${form.message.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const url =
      `https://wa.me/${CLINIC.whatsapp}?text=` +
      encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <main className="ct">
      <div className="ct-orb ct-orb--a" aria-hidden="true" />
      <div className="ct-orb ct-orb--b" aria-hidden="true" />

      {/* Hero */}
      <section className="ct-hero">
        <span className="ct-pill ct-rise" style={{ "--d": "0s" }}>
          <i className="ct-dot" /> CONTACT · SALEM
        </span>

        <h1 className="ct-title ct-rise" style={{ "--d": "0.08s" }}>
          Let&rsquo;s talk about your <span>smile.</span>
        </h1>

        <p className="ct-lead ct-rise" style={{ "--d": "0.16s" }}>
          Book a visit, ask a question or just say hello. Our team
          replies quickly and will find a time that suits you.
        </p>

        <div className="ct-actions ct-rise" style={{ "--d": "0.24s" }}>
          <BrushButton href={`tel:${CLINIC.tel}`} variant="light" arrow={false}>
            <PhoneIcon /> Call now
          </BrushButton>
          <BrushButton
            href={`https://wa.me/${CLINIC.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="solid"
            arrow={false}
          >
            <ChatIcon /> WhatsApp us
          </BrushButton>
        </div>
      </section>

      {/* Contact details */}
      <section className="ct-grid">
        <div className="ct-info">
          <a className="ct-card ct-rise" href={`tel:${CLINIC.tel}`}>
            <span className="ct-ico"><PhoneIcon /></span>
            <span className="ct-card-body">
              <small>Call us</small>
              <strong>{CLINIC.phone}</strong>
              <em>Tap to call the clinic</em>
            </span>
            <span className="ct-go"><ArrowIcon /></span>
          </a>

          <a
            className="ct-card ct-rise"
            href={`https://wa.me/${CLINIC.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ct-ico"><ChatIcon /></span>
            <span className="ct-card-body">
              <small>WhatsApp</small>
              <strong>Chat with us</strong>
              <em>Quick replies during clinic hours</em>
            </span>
            <span className="ct-go"><ArrowIcon /></span>
          </a>

          <a
            className="ct-card ct-rise"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ct-ico"><PinIcon /></span>
            <span className="ct-card-body">
              <small>Visit us</small>
              <strong>{CLINIC.name}</strong>
              <em>{CLINIC.address} · Get directions</em>
            </span>
            <span className="ct-go"><ArrowIcon /></span>
          </a>

          <div className="ct-card ct-card--static ct-rise">
            <span className="ct-ico"><ClockIcon /></span>
            <span className="ct-card-body">
              <small>Opening hours</small>
              <ul className="ct-hours">
                <li>
                  <span>Monday – Saturday</span>
                  <b>9:30 AM – 8:00 PM</b>
                </li>
                <li>
                  <span>Sunday</span>
                  <b>By appointment</b>
                </li>
              </ul>
            </span>
          </div>
        </div>

        {/* Appointment form */}
        <form className="ct-form ct-rise" onSubmit={submitForm} noValidate>
          <div className="ct-form-head">
            <h2>Book an appointment</h2>
            <p>
              Fill this in and we&rsquo;ll continue on WhatsApp to confirm
              your slot.
            </p>
          </div>

          <div className="ct-row">
            <label className={`ct-field ${errors.name ? "has-error" : ""}`}>
              <span>Full name</span>
              <input
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={form.name}
                onChange={updateField("name")}
              />
              {errors.name && <em>{errors.name}</em>}
            </label>

            <label className={`ct-field ${errors.phone ? "has-error" : ""}`}>
              <span>Phone number</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="98765 43210"
                value={form.phone}
                onChange={updateField("phone")}
              />
              {errors.phone && <em>{errors.phone}</em>}
            </label>
          </div>

          <div className="ct-row">
            <label className="ct-field">
              <span>Service</span>
              <select
                value={form.service}
                onChange={updateField("service")}
              >
                <option value="">Select a service</option>
                {SERVICES.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </label>

            <label className="ct-field">
              <span>Preferred date</span>
              <input
                type="date"
                min={today()}
                value={form.date}
                onChange={updateField("date")}
              />
            </label>
          </div>

          <label className="ct-field">
            <span>Message (optional)</span>
            <textarea
              rows="4"
              placeholder="Tell us how we can help..."
              value={form.message}
              onChange={updateField("message")}
            />
          </label>

          <BrushButton as="button" className="ct-brush-submit" variant="solid" type="submit">
            Book appointment <ArrowIcon />
          </BrushButton>

          {sent && (
            <p className="ct-sent" role="status">
              <CheckIcon /> Opening WhatsApp with your details...
            </p>
          )}
        </form>
      </section>

      {/* Map */}
      <section className="ct-map ct-rise">
        <iframe
          title="Neo Smiles Dental Care location"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(CLINIC.mapQuery)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div className="ct-map-card">
          <span className="ct-ico ct-ico--sm"><PinIcon /></span>
          <div>
            <strong>{CLINIC.name}</strong>
            <small>{CLINIC.address}</small>
          </div>
          <BrushButton
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            className="ct-brush-small"
          >
            Directions
          </BrushButton>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="ct-cta ct-rise">
        <div>
          <h3>Dental emergency?</h3>
          <p>Severe pain, a broken tooth or swelling? Call our clinic.</p>
        </div>
        <BrushButton href={`tel:${CLINIC.tel}`} variant="light" arrow={false}>
          <PhoneIcon /> {CLINIC.phone}
        </BrushButton>
      </section>
    </main>
  );
}