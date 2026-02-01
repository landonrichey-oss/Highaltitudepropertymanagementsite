// assets/js/navigation.js
// Handles site navigation, mobile menu, section switching, back-to-top, year update, hero visibility,
// and deep linking to specific properties (#properties?property=slug or ?property=slug)

document.addEventListener("DOMContentLoaded", () => {
  const sections    = document.querySelectorAll(".section");
  const navLinks    = document.querySelectorAll(".nav-link");
  const navToggle   = document.querySelector(".nav-toggle");
  const siteNav     = document.getElementById("site-nav");
  const heroOverlay = document.querySelector(".hero-overlay");
  const fullHeroBg  = document.getElementById("full-hero-bg");

  // Mobile menu toggle
  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav?.classList.toggle("open");
  });

  // Close mobile menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navToggle?.setAttribute("aria-expanded", "false");
      siteNav?.classList.remove("open");
    });
  });

  // Back to top
  document.getElementById("back-to-top")?.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Set current year in footer
  document.getElementById("year")?.replaceChildren(String(new Date().getFullYear()));

  function showSection(sectionId, propertySlug = null) {
    // 1. Toggle main sections
    sections.forEach(sec => {
      if (sec.id === sectionId) {
        sec.classList.add("active-section");
        sec.style.display = "flex";
      } else {
        sec.classList.remove("active-section");
        sec.style.display = "none";
      }
    });

    // 2. Toggle hero overlay (only on home)
    if (heroOverlay) {
      heroOverlay.style.display = (sectionId === "home") ? "block" : "none";
    }

    // 3. Toggle full hero background (only on home)
    if (fullHeroBg) {
      fullHeroBg.style.display = (sectionId === "home") ? "block" : "none";
    }

    // 4. Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 5. Update active nav link
    document.querySelectorAll(".nav-link").forEach(el => {
      el.classList.remove("active");
    });

    if (sectionId === "home") {
      document.querySelector('.nav-link[data-section="home"]')?.classList.add("active");
    } else {
      document.querySelector(`.nav-link[data-section="${sectionId}"]`)?.classList.add("active");
    }

    // 6. Properties-specific logic
    if (sectionId === "properties") {
      const url = new URL(window.location);

      // If NO property slug → force gallery + clear active state
      if (!propertySlug) {
        // Clear query param if present
        if (url.searchParams.has("property")) {
          url.searchParams.delete("property");
          window.history.replaceState(null, "", url);
        }

        // Tell properties.js to reset view
        if (typeof window.showPropertyDetail === "function") {
          // Passing null intentionally triggers gallery state
          window.showPropertyDetail(null);
        }

        return;
      }

      // If we DO have a property slug → open detail
      if (typeof window.showPropertyDetail === "function") {
        window.showPropertyDetail(propertySlug);
      }
    }

  }

  // Helper: parse section + property from current URL (hash or search)
  function getCurrentSectionAndProperty() {
    const url = new URL(window.location);
    let section = "home";
    let property = null;

    // 1. Real query string (people sometimes share without hash)
    if (url.searchParams.has("property")) {
      property = url.searchParams.get("property");
      section = "properties";
    }

    // 2. Hash – primary method
    if (url.hash) {
      const hashContent = url.hash.substring(1);
      const parts = hashContent.split("?");
      const hashSection = parts[0] || "home";
      section = hashSection || section; // hash section wins if present

      if (parts[1]) {
        const hashParams = new URLSearchParams(parts[1]);
        property = property || hashParams.get("property"); // hash param wins if both exist
      }
    }

    // 3. Final clean-up
    if (!section || section === "") section = "home";
    if (property) property = decodeURIComponent(property);

    return { section, property };
  }

  // Handle navigation link clicks (menu / brand)
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;

      e.preventDefault();

      const target = href.substring(1) || "home";

      // Update URL hash (remove for home)
      const url = new URL(window.location);
      url.hash = target === "home" ? "" : `#${target}`;
      window.history.pushState(null, "", url);

      showSection(target);
    });
  });

  // Initial load: determine section + property from URL
  setTimeout(() => {
    const { section, property } = getCurrentSectionAndProperty();
    showSection(section, property);
  }, 0);
  
  // Browser back/forward (popstate is better than hashchange for full control)
  window.addEventListener("popstate", () => {
    const { section, property } = getCurrentSectionAndProperty();
    showSection(section, property);
  });

  // Also keep hashchange for compatibility (some browsers)
  window.addEventListener("hashchange", () => {
    const { section, property } = getCurrentSectionAndProperty();
    showSection(section, property);
  });

  // Expose for other scripts
  window.showSection = showSection;
});