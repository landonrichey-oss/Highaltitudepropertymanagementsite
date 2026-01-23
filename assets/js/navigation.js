// assets/js/navigation.js
// Handles site navigation, mobile menu, section switching, back-to-top, and year update

document.addEventListener("DOMContentLoaded", () => {
  const sections   = document.querySelectorAll(".section");
  const navLinks   = document.querySelectorAll(".nav-link, .brand");
  const navToggle  = document.querySelector(".nav-toggle");
  const siteNav    = document.getElementById("site-nav");

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
    // Show/hide sections
    sections.forEach(sec => {
      sec.classList.toggle("active-section", sec.id === sectionId);
    });

    // Smooth scroll to the section
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    // Update active navigation styling
    document.querySelectorAll(".nav-link, .brand").forEach(el => {
      el.classList.remove("active");
    });

    if (sectionId === "home") {
      document.querySelector(".brand")?.classList.add("active");
      document.querySelector('.nav-link[data-section="home"]')?.classList.add("active");
    } else {
      document.querySelector(`.nav-link[data-section="${sectionId}"]`)?.classList.add("active");
    }

    // Trigger dynamic content re-render when needed
    if (sectionId === "properties" && typeof window.renderPropertyPicker === "function") {
      // Clear any ?property= param when navigating via menu
      const url = new URL(window.location);
      if (url.searchParams.has("property")) {
        url.searchParams.delete("property");
        window.history.replaceState(null, "", url);
      }

      window.renderPropertyPicker();  // This will now show gallery by default
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
      url.hash = target === "home" ? "" : target;
      window.history.pushState(null, "", url);

      showSection(target);
    });
  });

  // Determine initial section
  let initialSection = location.hash ? location.hash.substring(1).split("?")[0] : "home";
  if (initialSection === "") initialSection = "home";

  // If ?property= exists AND we're not already in properties → force properties section
  // But do NOT auto-open detail if coming from menu/brand — only if direct link or back/forward
  const params = new URLSearchParams(location.search);
  if (params.has("property") && initialSection !== "properties") {
    initialSection = "properties";
    const url = new URL(window.location);
    url.hash = "properties";
    window.history.replaceState(null, "", url);
  }

  showSection(initialSection);

  // Support browser back/forward buttons
  window.addEventListener("hashchange", () => {
    let newSection = location.hash ? location.hash.substring(1).split("?")[0] : "home";
    if (newSection === "") newSection = "home";
    showSection(newSection);
  });

  // Expose showSection so other scripts can use it
  window.showSection = showSection;
});