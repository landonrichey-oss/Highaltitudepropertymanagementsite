document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-link, .brand");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");

  // Mobile menu toggle
  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav?.classList.toggle("open");
  });

  // Close mobile menu when any nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navToggle?.setAttribute("aria-expanded", "false");
      siteNav?.classList.remove("open");
    });
  });

  // Back to top
  document.getElementById("back-to-top")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Copyright year
  document.getElementById("year")?.replaceChildren(String(new Date().getFullYear()));

  // Safe access to properties array (used only for existence check if needed)
  const properties = Array.isArray(window.allProperties) ? window.allProperties : [];

  function showSection(sectionId) {
    // Normalize legacy "gallery" → "properties-gallery"
    if (sectionId === "gallery") {
      sectionId = "properties-gallery";
    }

    sections.forEach(sec => {
      sec.classList.toggle("active-section", sec.id === sectionId);
    });

    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Update active nav states
    document.querySelectorAll(".nav-link, .brand").forEach(l => l.classList.remove("active"));

    if (sectionId === "home") {
      document.querySelector(".brand")?.classList.add("active");
      document.querySelector('.nav-link[data-section="home"]')?.classList.add("active");
    } else {
      const matchingLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
      if (matchingLink) {
        matchingLink.classList.add("active");
      }
    }

    // Re-render dynamic content for visible sections
    if (sectionId === "properties" && typeof renderPropertyPicker === "function") {
      renderPropertyPicker();
    }

    if (sectionId === "properties-gallery" && typeof renderGalleryLinks === "function") {
      renderGalleryLinks();
    }
  }

  // Navigation click handling
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;

      e.preventDefault();
      let target = href.substring(1) || "home";

      // Normalize legacy gallery link
      if (target === "gallery") {
        target = "properties-gallery";
      }

      // Update URL (remove hash for home, otherwise set it)
      const url = new URL(window.location);
      url.hash = target === "home" ? "" : target;
      window.history.pushState(null, "", url);

      showSection(target);
    });
  });

  // Determine initial section
  let initialSection = location.hash ? location.hash.substring(1).split('?')[0] : "home";
  if (initialSection === "") initialSection = "home";

  // Handle legacy #gallery hash
  if (initialSection === "gallery") {
    initialSection = "properties-gallery";
  }

  // If ?property= is present without hash → force properties section
  const params = new URLSearchParams(location.search);
  if (params.has("property") && initialSection !== "properties") {
    initialSection = "properties";
    const url = new URL(window.location);
    url.hash = "properties";
    window.history.replaceState(null, "", url);
  }

  showSection(initialSection);

  // Handle browser back/forward (hashchange)
  window.addEventListener("hashchange", () => {
    let newSection = location.hash ? location.hash.substring(1).split('?')[0] : "home";

    // Legacy support
    if (newSection === "gallery") {
      newSection = "properties-gallery";
    }

    if (newSection === "") newSection = "home";

    showSection(newSection);
  });

  // Expose showSection globally so script.js (gallery clicks, etc.) can use it
  window.showSection = showSection;
});