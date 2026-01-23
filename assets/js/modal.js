document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("property-modal");
  if (!modal) return;

  const modalTitle     = document.getElementById("modal-title");
  const modalSubtitle  = document.getElementById("modal-subtitle");
  const modalDesc      = document.getElementById("modal-description");
  const modalAmenities = document.getElementById("modal-amenities");
  const modalActions   = document.getElementById("modal-actions");
  const modalMedia     = modal.querySelector(".modal-media");

  let sliderIndex      = 0;
  let sliderImages     = [];
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

  const closeModal = () => {
    modal?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const buildSlider = (images, title) => {
    if (!modalMedia) return;

    sliderImages = Array.isArray(images) && images.length ? images : [FALLBACK_IMG];
    sliderIndex = 0;

    modalMedia.innerHTML = `
      <div class="slider">
        <button class="slider-share" type="button" aria-label="Share link" data-share="true">🔗</button>
        <button class="slider-close" type="button" aria-label="Close" data-close="true">✕</button>
        <button class="slider-btn prev" type="button" aria-label="Previous photo">‹</button>
        <div class="slider-viewport">
          <div class="slider-track"></div>
        </div>
        <button class="slider-btn next" type="button" aria-label="Next photo">›</button>
        <div class="slider-dots" aria-label="Slide navigation"></div>
      </div>
    `;

    const track    = modalMedia.querySelector(".slider-track");
    const dots     = modalMedia.querySelector(".slider-dots");
    const prevBtn  = modalMedia.querySelector(".slider-btn.prev");
    const nextBtn  = modalMedia.querySelector(".slider-btn.next");
    const viewport = modalMedia.querySelector(".slider-viewport");

    track.innerHTML = sliderImages.map((src, i) => `
      <div class="slide-wrap">
        <img class="slide" draggable="false" src="${src}" alt="${title} photo ${i+1}" loading="lazy" />
      </div>
    `).join("");

    track.querySelectorAll("img").forEach(img => {
      img.onerror = () => { img.src = FALLBACK_IMG; };
    });

    dots.innerHTML = sliderImages.map((_, i) => `
      <button class="slider-dot ${i === 0 ? "active" : ""}" type="button" data-dot="${i}"></button>
    `).join("");

    const update = () => {
      track.style.transform = `translate3d(${-sliderIndex * 100}%, 0, 0)`;
      dots.querySelectorAll(".slider-dot").forEach((d, i) =>
        d.classList.toggle("active", i === sliderIndex)
      );

      const showControls = sliderImages.length > 1;
      prevBtn.style.display = showControls ? "flex" : "none";
      nextBtn.style.display = showControls ? "flex" : "none";
      dots.style.display    = showControls ? "flex" : "none";
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

    dots.addEventListener("click", e => {
      const dot = e.target.closest("[data-dot]");
      if (!dot) return;
      sliderIndex = Number(dot.dataset.dot);
      update();
    });

    // Swipe support (omitted for brevity – copy from original if needed)

    update();
  };

  window.openPropertyModal = async index => {
    const prop = properties[index];
    if (!prop || !modal) return;

    currentPropIndex = index;

    modalTitle.textContent     = prop.title || "";
    modalSubtitle.textContent  = prop.subtitle || "";
    modalDesc.textContent      = prop.description || "";
    modalDesc.style.whiteSpace = "pre-line";

    modalAmenities.innerHTML = (prop.amenities || ["No amenities listed"]).map(a =>
      `<span class="pill">${a}</span>`
    ).join("");

    modalActions.innerHTML = (prop.links || []).filter(l => l?.url).map(link => {
      const extra = link.style === "primary" ? " btn-primary" : "";
      const href  = link.url.startsWith("http") ? link.url : `https://${link.url}`;
      return `<a href="${href}" target="_blank" rel="noopener" class="btn${extra}">${link.text}</a>`;
    }).join("");

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const cover = `${IMG_BASE}/${prop.slug}-1.jpg` || FALLBACK_IMG;
    buildSlider([cover], prop.title || "Property");

    // Optional: enhance with more images if you expose getPropertyImages
  };

  modal?.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) closeModal();

    if (e.target.closest("[data-share]") && currentPropIndex >= 0) {
      const prop = properties[currentPropIndex];
      if (prop && window.copyShareLink) window.copyShareLink(prop.slug);
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
});