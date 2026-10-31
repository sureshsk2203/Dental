import React from "react";

const PHONE_NUMBER = "+919750505044";   // inga unga call number podunga
const WHATSAPP_NUMBER = "919750505044"; // inga WhatsApp number (91 + number, + illama)
const WHATSAPP_MESSAGE = "Hello Neo Smiles, I would like to book an appointment.";

const FloatingContact = () => {
  return (
    <>
      <style>{`
        .fc-btn {
          position: fixed;
          bottom: 28px;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          text-decoration: none;
          transition: transform 0.25s ease;
        }
        .fc-btn:hover {
          transform: scale(1.12);
        }
        .fc-btn svg {
          width: 40px;
          height: 40px;
          fill: #fff;
        }

        /* LEFT - CALL */
        .fc-call {
          left: 28px;
          background: linear-gradient(135deg, #c2336f, #8a1c4a);
          animation: fc-float 2.4s ease-in-out infinite, fc-pulse-call 2s infinite;
        }
        .fc-call svg {
          animation: fc-ring 2.4s ease-in-out infinite;
          transform-origin: 50% 50%;
        }

        /* RIGHT - WHATSAPP */
        .fc-whatsapp {
          right: 28px;
          background: #25d366;
          animation: fc-float 2.4s ease-in-out infinite 0.4s, fc-pulse-wa 2s infinite;
        }

        @keyframes fc-float {
          0%, 100% { margin-bottom: 0; }
          50%      { margin-bottom: 10px; }
        }

        @keyframes fc-pulse-call {
          0%   { box-shadow: 0 0 0 0 rgba(194, 51, 111, 0.6), 0 8px 24px rgba(0,0,0,0.25); }
          70%  { box-shadow: 0 0 0 24px rgba(194, 51, 111, 0), 0 8px 24px rgba(0,0,0,0.25); }
          100% { box-shadow: 0 0 0 0 rgba(194, 51, 111, 0), 0 8px 24px rgba(0,0,0,0.25); }
        }

        @keyframes fc-pulse-wa {
          0%   { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6), 0 8px 24px rgba(0,0,0,0.25); }
          70%  { box-shadow: 0 0 0 24px rgba(37, 211, 102, 0), 0 8px 24px rgba(0,0,0,0.25); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0), 0 8px 24px rgba(0,0,0,0.25); }
        }

        @keyframes fc-ring {
          0%, 60%, 100% { transform: rotate(0deg); }
          10%  { transform: rotate(-18deg); }
          20%  { transform: rotate(18deg); }
          30%  { transform: rotate(-14deg); }
          40%  { transform: rotate(14deg); }
          50%  { transform: rotate(-8deg); }
        }

        @media (max-width: 640px) {
          .fc-btn { width: 64px; height: 64px; bottom: 20px; }
          .fc-btn svg { width: 34px; height: 34px; }
          .fc-call { left: 16px; }
          .fc-whatsapp { right: 16px; }
        }
      `}</style>

      {/* LEFT - CALL */}
      <a href={`tel:${PHONE_NUMBER}`} className="fc-btn fc-call" aria-label="Call us">
        <svg viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
        </svg>
      </a>

      {/* RIGHT - WHATSAPP */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fc-btn fc-whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29z" />
        </svg>
      </a>
    </>
  );
};

export default FloatingContact;