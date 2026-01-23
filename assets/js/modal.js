document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("property-modal");
  if (!modal) return;

  const modalMedia = modal.querySelector(".modal-media");

  let sliderIndex = 0;
  let sliderImages = [];
  let currentPropIndex = -1;

  const properties = window.allProperties || [];

  const FALLBACK_IMG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1220"/><stop offset="1" stop-color="#13213f"/></linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="48%" fill="#ffffff" opacity="0.85" font-size="44" font-family="Arial" text-anchor="middle">Photos coming soon</text>
    </svg>
  `)}`;

  const IMG_BASE = "assets/images";

  function getPropertyImages(prop) {
    if (!prop || !prop.slug) return [FALLBACK_IMG];

    const images = [];
    let i = 1;
    while (true) {
      const imgPath = `${IMG_BASE}/${prop.slug}-${i}.jpg`;
      if (i > 30) break;
      images.push(imgPath);
      i++;
    }

    return images.length > 0 ? images : [FALLBACK_IMG];
  }

  const closeModal = () => {
    modal?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    sliderImages = [];
    sliderIndex = 0;
    currentPropIndex = -1;
  };

  const buildSlider = (images, title) => {
    if (!modalMedia) return;

    sliderImages = Array.isArray(images) && images.length ? images : [FALLBACK_IMG];
    sliderIndex = 0;

    modalMedia.innerHTML = `
      <div class="slider fullscreen-slider">
        <button class="slider-close top-right" type="button" aria-label="Close gallery" data-close="true">✕</button>
        <button class="slider-btn prev" type="button" aria-label="Previous photo">‹</button>
        <div class="slider-viewport">
          <div class="slider-track"></div>
        </div>
        <button class="slider-btn next" type="button" aria-label="Next photo">›</button>
      </div>
    `;

    const track = modalMedia.querySelector(".slider-track");
    const prevBtn = modalMedia.querySelector(".slider-btn.prev");
    const nextBtn = modalMedia.querySelector(".slider-btn.next");

    track.innerHTML = sliderImages.map((src, i) => `
      <div class="slide-wrap">
        <img class="slide" draggable="false" src="${src}" alt="${title || "Property"} photo ${i + 1}" loading="${i < 3 ? "eager" : "lazy"}" />
      </div>
    `).join("");

    track.querySelectorAll("img").forEach(img => {
      img.onerror = () => { img.src = FALLBACK_IMG; };
    });

    const update = () => {
      track.style.transform = `translate3d(${-sliderIndex * 100}%, 0, 0)`;

      const showControls = sliderImages.length > 1;
      prevBtn.style.display = showControls ? "flex" : "none";
      nextBtn.style.display = showControls ? "flex" : "none";
    };

    const prev = () => {
      if (sliderImages.length < 2) return;
      sliderIndex = (sliderIndex - 1 + sliderImages.length) % sliderImages.length;
      update();
    };

    const next = () => {
      if (sliderImages.length < 2) return;
      sliderIndex = (sliderIndex + 1) % sliderImages.length;
      update();
    };

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    // Keyboard navigation
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    modal.addEventListener("keydown", handleKey);

    update();
  };

  window.openPropertyModal = index => {
    const prop = properties[index];
    if (!prop || !modal) return;

    currentPropIndex = index;

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const allImages = getPropertyImages(prop);
    buildSlider(allImages, prop.title || "Property");
  };

  // Robust close handlers
  modal?.addEventListener("click", e => {
    if (e.target === modal || e.target.closest("[data-close]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
});