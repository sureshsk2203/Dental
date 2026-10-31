import { lazy, Suspense, useEffect, useState } from "react";
import Hero from "./Hero";
import About from "./About";
import BrushButton from "./BrushButton"; // toothbrush hover button (BrushButton.jsx + BrushButton.css)
import "./Home.css";
const Doctors = lazy(() => import("./Doctors"));
const Facilities = lazy(() => import("./Facilities"));
const Results = lazy(() => import("./Results"));
const Contact = lazy(() => import("./Contact"));
/* =====================================================
   EDIT YOUR CLINIC DETAILS HERE
   ===================================================== */
const CLINIC = {
  city: "Salem",
  phone: "+91 98765 43210",
  whatsapp: "919876543210", // country code + number, no + or spaces
  email: "hello@yourclinic.com",
  address: "93, Greenways Rd, near Soodamani Hospital, Sinthampalayam, Fairlands, Alagapuram Pudur, Salem, Tamil Nadu 636016",
  hours: [
    ["Mon – Sat", "9:30 AM – 8:30 PM"],
    ["Sunday", "10:00 AM – 1:00 PM"],
  ],
};


/* =====================================================
   TREATMENT DATA
   ===================================================== */
const TREATMENTS = [
  {
    id: "whitening",
    image: "Teethwhitening.webp",
    name: "Teeth Whitening",
    icon: "sparkle",
    text: "Professional scaling and polishing removes plaque, tartar and stains. Whitening then brightens your smile several shades in a single sitting.",
    duration: "45 – 60 min",
    visits: "1 visit",
    best: "Stains, bad breath, dull teeth",
    steps: ["Check-up and shade analysis", "Ultrasonic scaling and polishing", "Whitening gel and light activation", "Care tips to keep the shine"],
  },
  {
    id: "veneers",
    image: "SmileDesigningVeneers.webp",
    name: "Smile Designing & Veneers",
    icon: "star",
    text: "Veneers, bonding and smile design reshape the colour, size and shape of your teeth for a natural, confident smile.",
    duration: "30-45 min",
    visits: "2 – 3 visits",
    best: "Chipped, discoloured or uneven teeth",
    steps: ["Smile consultation", "Digital smile design preview", "Preparation and fitting", "Final polish and review"],
  },
  {
    id: "fillings",
    image: "Tooth-ColouredFillings.webp",
    name: "Tooth-Coloured Fillings",
    icon: "tooth",
    text: "Cavities are repaired with tooth-coloured composite that blends with your natural teeth and bonds firmly to the tooth.",
    duration: "30 – 45 min",
    visits: "1 visit",
    best: "Cavities, small chips, worn edges",
    steps: ["Check-up and X-ray", "Numbing and removing the decay", "Placing and shaping the filling", "Bite check and polish"],
  },
  {
    id: "rootcanal",
    image: "RootCanalTreatment.webp",
    name: "Root Canal Treatment",
    icon: "shield",
    text: "Saves a badly infected or decayed tooth. With modern rotary tools and good anaesthesia, it feels like getting a normal filling.",
    duration: "60 – 90 min",
    visits: "1 – 2 visits",
    best: "Severe toothache, sensitivity, deep decay",
    steps: ["X-ray and diagnosis", "Numbing the tooth", "Cleaning and sealing the canals", "Crown to protect the tooth"],
  },
  {
    id: "crowns",
    image: "CrownsBridges.webp",
    name: "Crowns & Bridges",
    icon: "crown",
    text: "Crowns cover and strengthen a damaged tooth. Bridges replace one or more missing teeth using the neighbouring teeth for support.",
    duration: "30-40 min",
    visits: "2 visits",
    best: "Broken teeth, large fillings, missing teeth",
    steps: ["Examination and planning", "Tooth preparation and impression", "Temporary crown or bridge", "Final fitting and bite check"],
  },
  {
    id: "kids",
    image: "KidsDentistry.webp",
    name: "Kids Dentistry",
    icon: "smile",
    text: "Gentle, friendly care for children: check-ups, fluoride, sealants and fillings in a calm, play-friendly environment.",
    duration: "20 – 30 min",
    visits: "Every 6 months",
    best: "Kids from age 2 and up",
    steps: ["Meet and greet", "Gentle examination", "Fluoride / sealant if needed", "Fun tips for brushing at home"],
  },
  {
    id: "aligners",
    image: "InvisibleAligners.webp",
    name: "Invisible Aligners",
    icon: "align",
    text: "Clear, removable aligners gradually straighten crowded, gapped or crooked teeth without metal wires, so treatment is almost unnoticeable.",
    duration: "6 – 18 months",
    visits: "Check-ups every 4 – 6 weeks",
    best: "Crooked teeth, gaps, mild bite problems",
    steps: ["Digital scan and records", "Treatment plan preview", "Receiving your set of aligners", "Retainer to hold the result"],
  },
  {
    id: "implants",
    image: "DentalImplants.webp",
    name: "Dental Implants",
    icon: "implant",
    text: "A permanent replacement for a missing tooth. A titanium post is placed in the jaw and topped with a natural-looking crown.",
    duration: "1 – 2 hrs surgery",
    visits: "2 – 3 visits",
    best: "Missing teeth, loose dentures",
    steps: ["3D scan and planning", "Implant placement", "Healing period", "Final crown fitting"],
  },
  {
    id: "extraction",
    image: "PainlessToothRemoval.webp",
    name: "Painless Tooth Removal",
    icon: "extract",
    text: "When a tooth cannot be saved, it is removed gently with good anaesthesia, so you feel pressure but no pain, and heal quickly.",
    duration: "20 – 40 min",
    visits: "1 visit",
    best: "Badly damaged teeth, wisdom teeth, crowding",
    steps: ["X-ray and check-up", "Numbing the area", "Gentle removal of the tooth", "Aftercare and healing advice"],
  },
  {
    id: "emergency",
    image: "EmergencyPainManagement.webp",
    name: "Emergency Pain Management",
    icon: "bolt",
    text: "Sudden toothache, swelling or a broken tooth? We see you quickly, find the cause and relieve the pain on the same day.",
    duration: "30 – 60 min",
    visits: "Same-day visit",
    best: "Severe pain, swelling, broken or knocked-out tooth",
    steps: ["Quick assessment and X-ray", "Pain relief and numbing", "Treating the cause", "Follow-up plan"],
  },
  {
    id: "scanning",
    image: "Advanced3DDigitalIntra-oralScanningX-rays.webp",
    name: "Advanced 3D Digital Intra-oral Scanning & X-rays",
    icon: "scan",
    text: "A small digital camera scans your teeth in 3D, with no messy impression trays. Low-dose digital X-rays give a clear picture in seconds for accurate diagnosis.",
    duration: "10 – 20 min",
    visits: "1 visit",
    best: "Planning implants, aligners and crowns, or a detailed check-up",
    steps: ["Quick intra-oral 3D scan", "Low-dose digital X-ray", "Result shown to you on screen", "Findings explained and treatment planned"],
  },
];

/* =====================================================
   ICONS
   ===================================================== */
const ICONS = {
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />,
  shield: <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3zm-1 11l5-5-1.4-1.4L11 11.2 9.4 9.6 8 11l3 3z" />,
  tooth: <path d="M12 5c-1.5-1.3-5-1.2-5.5 2-.3 2.200 1 3.300 1.300 5.200.4 2.400.4 6.800 1.700 6.800 1 0 1-2.800 1.700-4.200.4-.8 1.400-.8 1.800 0 .7 1.400.7 4.200 1.700 4.200 1.300 0 1.300-4.400 1.700-6.800.3-1.900 1.600-3 1.300-5.200C17 3.800 13.500 3.700 12 5z" />,
  align: <path d="M4 7h16v3H4V7zm2 5h12v3H6v-3zm3 5h6v3H9v-3z" />,
  heart: <path d="M12 21s-8-5.200-8-11a4.500 4.500 0 0 1 8-2.800A4.500 4.500 0 0 1 20 10c0 5.800-8 11-8 11z" />,
  smile: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3.500 7.500a1.200 1.200 0 110 2.400 1.200 1.200 0 010-2.400zm7 0a1.200 1.200 0 110 2.400 1.200 1.200 0 010-2.400zM12 18c-2.300 0-4.200-1.300-5-3h10c-.8 1.700-2.700 3-5 3z" />,
  star: <path d="M12 2l3 6.500 7 .9-5.200 4.800 1.400 7L12 17.800 5.800 21.200l1.400-7L2 9.400l7-.9L12 2z" />,
  crown: <path d="M3 8l4.500 4L12 5l4.500 7L21 8l-2 11H5L3 8z" />,
  implant: <path d="M8 2h8v3H8V2zm1 4h6l-1 3H10L9 6zm1 4h4v2h-4v-2zm0 3h4v2h-4v-2zm1 3h2v5h-2v-5z" />,
  extract: <path d="M12 2l5 5h-3.500v4h-3V7H7l5-5zM8 13h8v2.500a4 4 0 01-8 0V13z" />,
  bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
  scan: <path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4zM8 11h8v2H8v-2z" />,
  pin: <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.500A2.500 2.500 0 1112 6.500a2.500 2.500 0 010 5z" />,
  phone: <path d="M6.600 10.800a15 15 0 006.600 6.600l2.200-2.200a1 1 0 011-.25 11 11 0 003.500.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.500a1 1 0 011 1c0 1.200.2 2.400.56 3.500a1 1 0 01-.25 1l-2.200 2.300z" />,
  mail: <path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7.500L4.500 7h15L12 12.500z" />,
  clock: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5.400l4 2.300-.8 1.300L11 13V7h2z" />,
};

function Icon({ name, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* =====================================================
   INDIVIDUAL TREATMENT DETAILS
   ===================================================== */
/* "Braces&Aligners.png" has an & in the name, so it must be URL-encoded */
const imgSrc = (file) => `/${encodeURIComponent(file)}`;

function Treatments() {
  const [activeId, setActiveId] = useState(TREATMENTS[0].id);
  const t = TREATMENTS.find((x) => x.id === activeId);

  /* load all treatment photos once, so switching tabs never flickers */
  useEffect(() => {
    TREATMENTS.forEach((x) => {
      const img = new Image();
      img.src = imgSrc(x.image);
    });
  }, []);

  return (
    <section className="section section--tint" id="treatments">
      <div className="section__head reveal">
        <span className="eyebrow"><i /> Treatments</span>
        <h2>Care for every <em>smile</em></h2>
        <p>Choose a treatment to see what it involves, how long it takes and what to expect.</p>
      </div>

      <div className="treat reveal">
        <div className="treat__tabs" role="tablist">
          {TREATMENTS.map((x) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={x.id === activeId}
              className={x.id === activeId ? "is-active" : ""}
              onClick={() => setActiveId(x.id)}
            >
              <span className="treat__ico"><Icon name={x.icon} size={22} /></span>
              {x.name}
              <b>→</b>
            </button>
          ))}
        </div>

        {/* key = re-triggers the animation on every change */}
        <div className="treat__panel" key={t.id}>
          {/* photo with the treatment name on top of it */}
          <figure className="treat__media">
            <img
              className="treat__img"
              src={imgSrc(t.image)}
              alt={t.name}
              decoding="async"
              onError={(e) => e.currentTarget.closest(".treat__media").classList.add("is-empty")}
            />
            <span className="treat__badge">{t.duration}</span>
            <figcaption className="treat__caption">
              <span className="treat__big"><Icon name={t.icon} size={30} /></span>
              <h3>{t.name}</h3>
            </figcaption>
          </figure>

          <p className="treat__text">{t.text}</p>

          <div className="treat__info">
            <div><small>Duration</small><strong>{t.duration}</strong></div>
            <div><small>Visits</small><strong>{t.visits}</strong></div>
            <div><small>Best for</small><strong>{t.best}</strong></div>
          </div>

          <h4>What to expect</h4>
          <ol className="treat__steps">
            {t.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>

          <BrushButton
            variant="solid"
            href={`https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(
              `Hello, I would like to book an appointment for ${t.name}.`
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            Book this treatment
          </BrushButton>
          <p className="treat__note">Duration and visits vary from case to case. Your dentist will confirm the plan after the check-up.</p>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   HOME  =  Hero + About + Individual Treatment Details
   (Nav and Footer are added in App.jsx. Doctor, Clinic, Reviews = separate pages later)
   ===================================================== */
export default function Home() {
  return (
    <main className="home">
      <div id="home">
        <Hero />
      </div>

      <div id="about">
        <About />
      </div>

      <Suspense fallback={null}>
        <div id="doctors">
          <Doctors />
        </div>
      </Suspense>

      <Treatments />

      <Suspense fallback={null}>
        <div id="facilities">
          <Facilities />
        </div>
        <div id="results">
          <Results />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </Suspense>
    </main>
  );
}