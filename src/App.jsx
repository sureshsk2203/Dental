
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Loader from "./component/Loader";
import Nav from "./component/Nav";
import Home from "./component/Home";
import Doctors from "./component/Doctors";
import Facilities from "./component/Facilities";
import Results from "./component/Results";
import Contact from "./component/Contact";
import Footer from "./component/Footer";

/* Handle scroll position after loading and route changes. */
function ScrollManager({ loading }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (loading) return;

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
  }, [pathname, hash, loading]);

  return null;
}

/* Handle internal navigation without reloading the website. */
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

      const link =
        event.target.closest &&
        event.target.closest("a");

      if (
        !link ||
        (link.target && link.target !== "_self") ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const href = link.getAttribute("href");

      if (
        !href ||
        !href.startsWith("/") ||
        href.startsWith("//")
      ) {
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

function AppContent() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  return (
    <>
      {loading && (
        <Loader
          logo="/Neo_logo.png"
          onFinish={() => setLoading(false)}
        />
      )}

      <ScrollManager loading={loading} />
      <SpaLinks />

      {!loading && (
        <>
          <Nav />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/results" element={<Results />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>

          <Footer />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}