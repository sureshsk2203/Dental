
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const seoData = {
  "/": {
    title: "NEO SMILES Dental Care | Dental Clinic in Fairlands, Salem",
    description:
      "Visit NEO SMILES Dental Care in Fairlands, Salem, near Soodamani Hospital. Explore dental treatments and book your appointment.",
  },
  "/doctors": {
    title: "Best Dentists in Fairlands, Salem | NEO SMILES",
    description:
      "Meet the dental team at NEO SMILES Dental Care in Fairlands, Salem. Explore our doctors and dental care services.",
  },
  "/facilities": {
    title: "Dental Clinic Facilities in Salem | NEO SMILES",
    description:
      "Explore the facilities at NEO SMILES Dental Care, Fairlands, Salem, and learn about our dental care environment.",
  },
  "/results": {
    title: "Dental Treatment Results in Salem | NEO SMILES",
    description:
      "Explore dental treatment before-and-after results from NEO SMILES Dental Care in Fairlands, Salem.",
  },
  "/contact": {
    title: "Contact Dentist in Fairlands, Salem | NEO SMILES",
    description:
      "Contact NEO SMILES Dental Care at Fairlands, Salem, near Soodamani Hospital, to enquire about appointments.",
  },
};

export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const data = seoData[pathname] || seoData["/"];

    document.title = data.title;

    let description = document.querySelector(
      'meta[name="description"]'
    );

    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }

    description.setAttribute("content", data.description);

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
      `https://neosmilesdentalcare.in${pathname === "/" ? "/" : pathname}`
    );
  }, [pathname]);

  return null;
}
