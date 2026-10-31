<<<<<<< HEAD

import { lazy, Suspense, useEffect } from "react";
=======
import { lazy, Suspense } from "react";
>>>>>>> dad1141 (new)
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";

import Nav from "./component/Nav";
import Home from "./component/Home";
import Footer from "./component/Footer";
import FloatingContact from "./component/FloatingContact";

const Doctors = lazy(() => import("./component/Doctors"));
const Facilities = lazy(() => import("./component/Facilities"));
const Results = lazy(() => import("./component/Results"));
const Contact = lazy(() => import("./component/Contact"));
<<<<<<< HEAD

// Scroll manager for page navigation and section links
=======
import Footer from "./component/Footer";
import FloatingContact from "./component/FloatingContact";

>>>>>>> dad1141 (new)
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));

      const timer = setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, hash]);

  return null;
}

<<<<<<< HEAD
// Handle internal links using React Router
=======
>>>>>>> dad1141 (new)
function SpaLinks() {
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event.target.closest?.("a");

      if (
        !link ||
        (link.target && link.target !== "_self") ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const href = link.getAttribute("href");

      if (!href || !href.startsWith("/") || href.startsWith("//")) {
        return;
      }

      event.preventDefault();
      navigate(href);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [navigate]);

  return null;
}

// Main application content
function AppContent() {
  return (
    <>
      <ScrollManager />
      <SpaLinks />

      <Nav />

      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            style={{
              minHeight: "65vh",
              display: "grid",
              placeItems: "center",
              color: "#a54571",
            }}
          >
            Loading page...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/results" element={<Results />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>

      <Footer />
<<<<<<< HEAD

      {/* Floating WhatsApp / Contact button */}
=======
>>>>>>> dad1141 (new)
      <FloatingContact />
    </>
  );
}

// Application entry component
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
