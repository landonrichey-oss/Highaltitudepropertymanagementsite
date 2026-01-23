// assets/js/navigation.js
// Handles site navigation, mobile menu, section switching, back-to-top, year update, and hero visibility

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

  function showSection(sectionId) {
    // 1. Toggle main sections
    sections.forEach(sec => {
      if (sec.id === sectionId) {
        sec.classList.add("active-section");
        sec.style.display = "flex";           // match your CSS
      } else {
        sec.classList.remove("active-section");
        sec.style.display = "none";
      }
    });

    // 2. Toggle hero overlay (only show on home)
    if (heroOverlay) {
      if (sectionId === "home") {
        heroOverlay.style.display = "block";  // or "flex" if your hero uses flex
        // Optional: fade in if you added transition in CSS
        // heroOverlay.style.opacity = "1";
      } else {
        heroOverlay.style.display = "none";
        // heroOverlay.style.opacity = "0";
      }
    }

    // 3. Optional: toggle full-hero-bg active class (if it's hero-specific)
    if (fullHeroBg) {
      if (sectionId === "home") {
        fullHeroBg.classList.add("active");
      } else {
        fullHeroBg.classList.remove("active");
      }
    }

    // 4. Scroll to top (cleaner UX when switching sections)
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 5. Update active navigation link
    document.querySelectorAll(".nav-link").forEach(el => {
      el.classList.remove("active");
    });

    if (sectionId === "home") {
      document.querySelector('.nav-link[data-section="home"]')?.classList.add("active");
    } else {
      document.querySelector(`.nav-link[data-section="${sectionId}"]`)?.classList.add("active");
    }

    // 6. Properties-specific logic
    if (sectionId === "properties" && typeof window.renderPropertyPicker === "function") {
      // Clear ?property= param when navigating via menu
      const url = new URL(window.location);
      if (url.searchParams.has("property")) {
        url.searchParams.delete("property");
        window.history.replaceState(null, "", url);
      }

      window.renderPropertyPicker();  // show gallery by default
    }
  }

  // Handle navigation link clicks
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

  // Determine initial section from hash or default to home
  let initialSection = location.hash ? location.hash.substring(1).split("?")[0] : "home";
  if (initialSection === "") initialSection = "home";

  // If ?property= exists → force properties section
  const params = new URLSearchParams(location.search);
  if (params.has("property") && initialSection !== "properties") {
    initialSection = "properties";
    const url = new URL(window.location);
    url.hash = "properties";
    window.history.replaceState(null, "", url);
  }

  showSection(initialSection);

  // Browser back/forward support
  window.addEventListener("hashchange", () => {
    let newSection = location.hash ? location.hash.substring(1).split("?")[0] : "home";
    if (newSection === "") newSection = "home";
    showSection(newSection);
  });

  // Expose for other scripts
  window.showSection = showSection;
});