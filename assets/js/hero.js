// assets/js/hero.js
// Full-page rotating featured background + footer reveal on scroll

document.addEventListener("DOMContentLoaded", () => {
  const bgElement = document.getElementById("full-hero-bg");
  const heroActions = document.getElementById("hero-actions");
  const footer = document.querySelector(".site-footer");

  if (!bgElement || !heroActions) return;

  const featured = window.allProperties?.filter(p => p.featured === true) || [];

  if (featured.length === 0) {
    bgElement.style.backgroundImage = `url('${window.utils?.FALLBACK_IMG || ''}')`;
    heroActions.innerHTML = `<a class="btn" href="#properties">Browse Properties</a>`;
    return;
  }

  let currentIndex = 0;
  let interval;

  function updateHero() {
    const prop = featured[currentIndex];

    bgElement.style.backgroundImage = `url('${window.utils?.getCoverImage(prop) || ''}')`;
    bgElement.classList.add("active");

    heroActions.innerHTML = `
      <a class="btn" href="#properties?property=${prop.slug}">Book Now</a>
      <a class="btn btn-ghost" href="#properties">Explore</a>
    `;

    currentIndex = (currentIndex + 1) % featured.length;
  }

  updateHero();

  interval = setInterval(updateHero, 2000);

  // Pause on hover
  document.querySelector(".hero-overlay")?.addEventListener("mouseenter", () => clearInterval(interval));
  document.querySelector(".hero-overlay")?.addEventListener("mouseleave", () => {
    interval = setInterval(updateHero, 2000);
  });

  // Reveal footer after scrolling past hero (approx 80vh)
  window.addEventListener("scroll", () => {
    const scrolledPastHero = window.scrollY > window.innerHeight * 0.8;
    footer?.classList.toggle("visible", scrolledPastHero);
  });

  // Initial check
  if (window.scrollY > window.innerHeight * 0.8) {
    footer?.classList.add("visible");
  }

  console.log(`Full-page hero started with ${featured.length} properties`);
});