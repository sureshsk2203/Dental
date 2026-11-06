
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://neosmilesdentalcare.in";

const seoData = {
  "/": {
    title: "NEO SMILES Dental Care | Dental Clinic in Fairlands, Salem",
    description:
      "Visit NEO SMILES Dental Care in Fairlands, Salem, near Soodamani Hospital. Explore dental treatments, meet our dentists and book your appointment.",
  },

  "/doctors": {
    title: "Dentists in Fairlands, Salem | NEO SMILES Dental Care",
    description:
      "Meet the dental team at NEO SMILES Dental Care in Fairlands, Salem. Explore our doctors and dental care services.",
  },

  "/facilities": {
    title: "Dental Clinic Facilities in Salem | NEO SMILES",
    description:
      "Explore the dental clinic facilities at NEO SMILES Dental Care in Fairlands, Salem.",
  },

  "/results": {
    title: "Dental Treatment Results in Salem | NEO SMILES",
    description:
      "Explore dental treatment results at NEO SMILES Dental Care in Fairlands, Salem.",
  },

  "/contact": {
    title: "Contact NEO SMILES Dental Care | Fairlands, Salem",
    description:
      "Contact NEO SMILES Dental Care in Fairlands, Salem, near Soodamani Hospital, for appointment enquiries and dental care information.",
  },

  "/treatments": {
    title: "Dental Treatments in Fairlands, Salem | NEO SMILES",
    description:
      "Explore dental treatments at NEO SMILES Dental Care in Fairlands, Salem. Contact our clinic for appointment enquiries.",
  },
};

export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const currentPath =
      pathname === "/" ? "/" : pathname.replace(/\/+$/, "");

    const data = seoData[currentPath] || {
      title: "NEO SMILES Dental Care | Fairlands, Salem",
      description:
        "Visit NEO SMILES Dental Care in Fairlands, Salem for dental care and appointment enquiries.",
    };

    // Update page title
    document.title = data.title;

    // Update meta description
    let description = document.querySelector(
      'meta[name="description"]'
    );

    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }

    description.setAttribute("content", data.description);

    // Update canonical URL
    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute(
      "href",
      `${BASE_URL}${currentPath}`
    );

    // Update Open Graph tags
    const updateMeta = (property, content) => {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    updateMeta("og:title", data.title);
    updateMeta("og:description", data.description);
    updateMeta("og:url", `${BASE_URL}${currentPath}`);
    updateMeta("og:type", "website");
    updateMeta("og:site_name", "NEO SMILES Dental Care");

  }, [pathname]);

  return null;
}
