import { useEffect } from "react";
import { SITE_URL } from "../config/business.js";

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function useSeo({ title, description, path }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | El Garage Automóviles` : "El Garage Automóviles";
    document.title = fullTitle;

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
    }
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:type", "website");

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE_URL}${path || ""}`);
    setMeta("property", "og:url", `${SITE_URL}${path || ""}`);
  }, [title, description, path]);
}
