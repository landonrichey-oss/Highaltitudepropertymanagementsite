// assets/js/hero.js
// Auto-rotating featured properties carousel in hero (click image → go to property)

document.addEventListener("DOMContentLoaded", () => {
  const carouselContainer = document.getElementById("featured-carousel");
  if (!carouselContainer) {
    console.warn("Hero carousel container not found");
    return;
  }

  // Filter featured properties
  const featured = window.allProperties?.filter(p => p.featured === true) || [];

  if (featured.length === 0) {
    console.warn("No featured properties defined");
    carouselContainer.innerHTML = `<div class="carousel-slide active">
      <img src="${window.utils?.FALLBACK_IMG || ''}" alt="No featured properties" />
      <div class="carousel-slide-content">
        <h3>No Featured Properties</h3>
        <p>Check back soon for our latest highlights.</p>
      </div>
    </div>`;
    return;
  }

  let currentIndex = 0;
  let autoRotateInterval;

  function createSlide(prop) {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    if (currentIndex === 0) slide.classList.add("active"); // first one active

    slide.innerHTML = `
      <img 
        src="${window.utils?.getCoverImage(prop) || ''}" 
        alt="${prop.title || "Featured property"}" 
        loading="eager" 
        decoding="async"
      />
      <div class="carousel-slide-content">
        <h3>${prop.title || "Featured Stay"}</h3>
        <p>${prop.subtitle || "Luxury mountain getaway near Park City"}</p>
      </div>
    `;

    // Make whole slide clickable
    slide.addEventListener("click", () => {
      const url = new URL(window.location);
      url.hash = "properties";
      url.searchParams.set("property", prop.slug);
      window.history.pushState(null, "", url);

      // Trigger section switch + detail load
      if (window.showSection) window.showSection("properties");
    });

    return slide;
  }

  // Render all slides
  featured.forEach(prop => {
    const slide = createSlide(prop);
    carouselContainer.appendChild(slide);
  });

  const slides = carouselContainer.querySelectorAll(".carousel-slide");

  function goToSlide(index) {
    currentIndex = (index + featured.length) % featured.length;

    slides.forEach((s, i) => {
      s.classList.toggle("active", i === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  // Auto-rotate every 2 seconds
  autoRotateInterval = setInterval(nextSlide, 2000);

  // Pause on hover (better UX)
  carouselContainer.addEventListener("mouseenter", () => {
    clearInterval(autoRotateInterval);
  });

  carouselContainer.addEventListener("mouseleave", () => {
    autoRotateInterval = setInterval(nextSlide, 2000);
  });

  console.log(`Hero carousel initialized with ${featured.length} featured properties`);
});