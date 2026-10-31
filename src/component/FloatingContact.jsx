
import React from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaPhoneAlt,
} from "react-icons/fa";

const PHONE_NUMBER = "+919750505044";
const WHATSAPP_NUMBER = "919750505044";
const WHATSAPP_MESSAGE =
  "Hello Neo Smiles, I would like to book an appointment.";

const INSTAGRAM_URL =
  "https://www.instagram.com/neosmiles_dentalcaresalem/";

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
          color: #fff;
          transition: transform 0.25s ease;
        }

        .fc-btn:hover {
          transform: scale(1.12);
        }

        .fc-btn svg {
          width: 38px;
          height: 38px;
          fill: #fff;
        }

        .fc-whatsapp svg,
        .fc-insta svg {
          width: 46px;
          height: 46px;
        }

        .fc-call {
          left: 28px;
          background: linear-gradient(135deg, #c2336f, #8a1c4a);
          animation: fc-float 2.4s ease-in-out infinite,
                     fc-pulse-call 2s infinite;
        }

        .fc-call svg {
          animation: fc-ring 2.4s ease-in-out infinite;
          transform-origin: 50% 50%;
        }

        .fc-whatsapp {
          right: 28px;
          background: #25d366;
          animation: fc-float 2.4s ease-in-out infinite 0.4s,
                     fc-pulse-wa 2s infinite;
        }

        .fc-insta {
          right: 28px;
          bottom: calc(28px + 76px + 16px);
          background: radial-gradient(
            circle at 30% 107%,
            #fdf497 0%,
            #fdf497 5%,
            #fd5949 45%,
            #d6249f 60%,
            #285aeb 90%
          );
          animation: fc-float 2.4s ease-in-out infinite 0.2s,
                     fc-pulse-ig 2s infinite;
        }

        @keyframes fc-float {
          0%, 100% { margin-bottom: 0; }
          50% { margin-bottom: 10px; }
        }

        @keyframes fc-pulse-call {
          0% {
            box-shadow: 0 0 0 0 rgba(194, 51, 111, 0.6),
                        0 8px 24px rgba(0,0,0,0.25);
          }
          70% {
            box-shadow: 0 0 0 24px rgba(194, 51, 111, 0),
                        0 8px 24px rgba(0,0,0,0.25);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(194, 51, 111, 0),
                        0 8px 24px rgba(0,0,0,0.25);
          }
        }

        @keyframes fc-pulse-wa {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6),
                        0 8px 24px rgba(0,0,0,0.25);
          }
          70% {
            box-shadow: 0 0 0 24px rgba(37, 211, 102, 0),
                        0 8px 24px rgba(0,0,0,0.25);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0),
                        0 8px 24px rgba(0,0,0,0.25);
          }
        }

        @keyframes fc-pulse-ig {
          0% {
            box-shadow: 0 0 0 0 rgba(214, 36, 159, 0.6),
                        0 8px 24px rgba(0,0,0,0.25);
          }
          70% {
            box-shadow: 0 0 0 24px rgba(214, 36, 159, 0),
                        0 8px 24px rgba(0,0,0,0.25);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(214, 36, 159, 0),
                        0 8px 24px rgba(0,0,0,0.25);
          }
        }

        @keyframes fc-ring {
          0%, 60%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-18deg); }
          20% { transform: rotate(18deg); }
          30% { transform: rotate(-14deg); }
          40% { transform: rotate(14deg); }
          50% { transform: rotate(-8deg); }
        }

        @media (max-width: 640px) {
          .fc-btn {
            width: 64px;
            height: 64px;
            bottom: 20px;
          }

          .fc-btn svg {
            width: 30px;
            height: 30px;
          }

          .fc-whatsapp svg,
          .fc-insta svg {
            width: 38px;
            height: 38px;
          }

          .fc-call {
            left: 16px;
          }

          .fc-whatsapp {
            right: 16px;
          }

          .fc-insta {
            right: 16px;
            bottom: calc(20px + 64px + 14px);
          }
        }
      `}</style>

      {/* LEFT - CALL */}
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="fc-btn fc-call"
        aria-label="Call us"
      >
        <FaPhoneAlt />
      </a>

      {/* RIGHT - INSTAGRAM */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fc-btn fc-insta"
        aria-label="Follow us on Instagram"
      >
        <FaInstagram />
      </a>

      {/* RIGHT - WHATSAPP */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          WHATSAPP_MESSAGE
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fc-btn fc-whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </>
  );
};

export default FloatingContact;
