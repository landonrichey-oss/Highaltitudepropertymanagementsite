// script.js - Vanilla JavaScript for High Altitude Property Management site
// ✅ Copy/paste safe (ONE DOMContentLoaded wrapper)
// ✅ Properties render correctly
// ✅ Modal + slider works
// ✅ Gallery lightbox works
// ✅ Missing images fall back to a built-in placeholder
// ✅ Booking links auto-fix missing https://
// ✅ Supports slug-based auto image paths: assets/images/<slug>-1.jpg ...

document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // Built-in placeholder (no file needed)
  // =============================
  const FALLBACK_IMG =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0b1220"/>
            <stop offset="1" stop-color="#13213f"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <text x="50%" y="48%" fill="#ffffff" opacity="0.85" font-size="44" font-family="Arial" text-anchor="middle">
          Photos coming soon
        </text>
        <text x="50%" y="56%" fill="#ffffff" opacity="0.65" font-size="22" font-family="Arial" text-anchor="middle">
          Add images to assets/images/
        </text>
      </svg>
    `);

  // =============================
  // Header + basic UI
  // =============================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      siteNav.classList.toggle("open");
    });
  }

  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =============================
  // Helpers
  // =============================

  // Fixes urls like "airbnb.com/h/xxx" (adds https://)
  function ensureHttps(url) {
    const u = String(url || "").trim();
    if (!u) return "";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    return `https://${u}`;
  }

  // Generates: assets/images/<slug>-1.jpg, -2.jpg, -3.jpg, ...
  function imagesFromSlug(slug, count = 3) {
    const s = String(slug || "").trim();
    if (!s) return [FALLBACK_IMG];
    return Array.from({ length: count }, (_, i) => `assets/images/${s}-${i + 1}.jpg`);
  }

  function getCoverImage(prop) {
    if (Array.isArray(prop?.images) && prop.images.length) return prop.images[0];
    if (typeof prop?.image === "string" && prop.image) return prop.image;
    if (prop?.slug) return `assets/images/${prop.slug}-1.jpg`;
    return FALLBACK_IMG;
  }

  function clampText(text, max = 220) {
    const t = String(text ?? "").replace(/\s+/g, " ").trim();
    if (!t) return "";
    if (t.length <= max) return t;
    return t.slice(0, max).trimEnd() + "…";
  }

  function safeAmenities(prop) {
    const list = Array.isArray(prop?.amenities) ? prop.amenities.filter(Boolean) : [];
    return list.length ? list : ["See listing for amenities"];
  }

  // =============================
  // PROPERTY DATA
  // =============================
  const properties = [
    {
  slug: "Rustic-Roots",
  title: "Rustic Roots",
  subtitle: "Sleeps 10 • 3 bedrooms • 3 baths",
  description: [
    "Nestled on a stunning mountain property just above Park City, this 3BR, 3BA getaway is surrounded by dreamy natural surroundings that you'll be able to enjoy from two decks and a luxurious hot tub!",
    "",
    "This home is ideally situated in a tranquil community, yet close to the vibrant town, offering the best of both worlds.",
    "",
    "✔ 3 Comfy BRs + Loft Bunks",
    "✔ 2 Living Areas (Arcade Machines, Loft Net)",
    "✔ Full Kitchen",
    "✔ Smart TV",
    "✔ Outdoors (Hot Tub, Fire Pit, BBQ)",
    "✔ Wi-Fi",
    "✔ Laundry",
    "✔ Parking",
  ].join("\n"),
  images: imagesFromSlug("Rustic-Roots", 42),
  amenities: ["Hot tub", "Fireplace", "Game room", "WiFi", "Full kitchen", "Double decks"],
  links: [
    { text: "Book on Airbnb", url: "https://www.airbnb.com/h/rusticrootsretreatparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/720956/reservation?currency=USD&adults=1",
      style: "primary"
    },
    { text: "Book on VRBO", url: "https://www.vrbo.com/EXAMPLE1" }
  ]
},

     
    
    // SLUG-BASED TEMPLATE EXAMPLE (Bright Mountain Retreat)
   {
    slug: "BrightMountainRetreat", 
    title: "Bright Mountain Retreat near Park City + Hot Tub!",
    subtitle: "Sleeps 4 • 2 bedrooms • 1 1/2 baths",
    description:
        "Step into the modern and bright 2BR 1.5BA cabin in the secluded community in the heart of the scenic Summit County. It promises a relaxing retreat surrounded by dreamy aspen trees, just a short drive away from Park City and local restaurants, shops, exciting attractions, and natural landmarks.",
  images: imagesFromSlug("Bright-Mountain-Retreat", 49),
  amenities: ["Hot tub", "Fireplace", "WiFi", "Full kitchen"],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/aspengrovecabinaboveparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/609125/reservation?currency=USD&adults=1",
      style: "primary",
    },
    { text: "Book on VRBO", url: "https://www.vrbo.com/EXAMPLE1" },
  ],
},


    // SLUG-BASED TEMPLATE EXAMPLE (Whispering Pines)
    {
      slug: "whisperingpinesaboveparkcity",
      title: "Whispering Pines",
      subtitle: "Sleeps 4 • 2 beds • 1 bath",
      description:
        "Escape to this detached 1-bedroom mountain condo, just 20 minutes from Park City. Enjoy your own private heated garage, private entrance, and private hot tub under the stars. Breathe in crisp alpine air, relax among towering trees, and soak in peaceful mountain views after days spent skiing, hiking, or exploring town. A cozy, secluded retreat with all the comforts you need, where wildlife wanders by and the stars feel close enough to touch.",
      images: imagesFromSlug("whisperingpinesaboveparkcity", 53), // assets/images/<slug>-1.jpg, -2.jpg, -3.jpg
      amenities: ["Hot tub", "Heated garage parking", "Pool table", "Pinball machine", "Fast WiFi", "Basketball hoop"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/whisperingpinesaboveparkcity" },
        {
          text: "Book Direct Lowest Price",
          url: "https://checkout.lodgify.com/summitcountyrentals/720955/reservation?currency=USD&adults=1",
          style: "primary",
        },
      ],
    },
    // Bear Necessities (slug-based images: assets/images/bearnecessitiesparkcity-1.jpg, -2.jpg, -3.jpg ...)
{
  slug: "bearnecessitiesparkcity",
  title: "Bear Necessities",
  subtitle: "Sleeps 8 • 4 beds • 2.5 baths",
  description:
    "Park City Mountain views! Bear Necessities Cabin nestled high in the mountains at 8,000 feet boasts breathtaking views of Park City ski runs. Perched amidst the rugged beauty of the alpine landscape, this cozy retreat offers a perfect blend of luxurious comfort and rustic charm.",
  images: imagesFromSlug("bearnecessitiesparkcity", 3), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Fireplace",
    "Deck w/ Park City Mountain views",
    "Fire pit + seating",
    "Pellet grill",
    "Gourmet kitchen"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/bearnecessitiesparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/609126/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
// Sunflower Lodge (slug-based images: assets/images/sunflowerlodgeparkcity-1.jpg, -2.jpg, -3.jpg ...)
{
  slug: "sunflowerlodgeparkcity",
  title: "Sunflower Lodge With Hot Tub Above Park City",
  subtitle: "Sleeps 4 • 2 beds • 1 bath",
  description:
    "Take a break and unwind at this peaceful oasis 20 minutes outside of Park City. Winter wonderland, summer tranquility—enjoy all the beauty of the mountains with the convenience of Park City skiing, dining, shopping, and mountain-town amenities. Relax in the hot tub or cuddle up with a movie and fire—where luxury meets wilderness.",
  images: imagesFromSlug("sunflowerlodgeparkcity", 3), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Outdoor fire pit",
    "Outdoor shower",
    "Hammocks",
    "Grill",
    "Beautiful landscape"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/sunflowerlodgeparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/568064/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},

  ];

  // =============================
  // Render Properties (cards)
  // =============================
  const propertyGrid = document.getElementById("property-grid");

  function renderPropertyCards() {
    if (!propertyGrid) return;

    propertyGrid.innerHTML = "";

    if (!Array.isArray(properties) || !properties.length) {
      propertyGrid.innerHTML = '<p class="muted">No properties listed yet. Add them in script.js!</p>';
      return;
    }

    properties.forEach((prop, index) => {
      const coverImg = getCoverImage(prop);

      const bookingButtons = (prop.links || [])
        .filter((l) => l && l.url)
        .map((link) => {
          const href = ensureHttps(link.url);
          const extraClass = link.style === "primary" ? " btn-primary" : "";
          return `
            <a href="${href}" target="_blank" rel="noopener" class="btn btn-small btn-ghost${extraClass}">
              ${link.text}
            </a>
          `;
        })
        .join("");

      const card = document.createElement("article");
      card.className = "card";

      card.innerHTML = `
        <img src="${coverImg}" alt="${prop.title || "Property"}" loading="lazy" />
        <div class="card-body">
          <h3>${prop.title || ""}</h3>
          <p class="muted">${prop.subtitle || ""}</p>
          <p>${clampText(prop.description || "", 220)}</p>

          <div class="card-meta">
            ${safeAmenities(prop)
              .slice(0, 4)
              .map((a) => `<span class="tag">${a}</span>`)
              .join("")}
          </div>

          <div class="card-actions">
            <button class="btn btn-small" data-property="${index}">View details</button>
            ${bookingButtons}
          </div>
        </div>
      `;

      // Card image fallback
      const img = card.querySelector("img");
      img?.addEventListener("error", () => {
        img.src = FALLBACK_IMG;
      });

      propertyGrid.appendChild(card);
    });
  }

  renderPropertyCards();

  // =============================
  // Modal + Slider
  // =============================
  const modal = document.getElementById("property-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const modalDesc = document.getElementById("modal-description");
  const modalAmenities = document.getElementById("modal-amenities");
  const modalActions = document.getElementById("modal-actions");

  let sliderIndex = 0;
  let sliderImages = [];
  let sliderTrackEl = null;
  let sliderDotsEl = null;
  let sliderPrevBtn = null;
  let sliderNextBtn = null;

  function ensureSliderExists() {
    if (sliderTrackEl && sliderDotsEl) return;

    const imgEl = document.getElementById("modal-img");
    if (!imgEl) return;

    const wrapper = document.createElement("div");
    wrapper.className = "slider";
    wrapper.innerHTML = `
      <button class="slider-btn prev" type="button" aria-label="Previous photo">‹</button>
      <div class="slider-viewport">
        <div class="slider-track"></div>
      </div>
      <button class="slider-btn next" type="button" aria-label="Next photo">›</button>
      <div class="slider-dots" aria-label="Slide navigation"></div>
    `;

    imgEl.replaceWith(wrapper);

    sliderTrackEl = wrapper.querySelector(".slider-track");
    sliderDotsEl = wrapper.querySelector(".slider-dots");
    sliderPrevBtn = wrapper.querySelector(".slider-btn.prev");
    sliderNextBtn = wrapper.querySelector(".slider-btn.next");

    sliderPrevBtn?.addEventListener("click", () => {
      if (sliderImages.length < 2) return;
      sliderIndex = (sliderIndex - 1 + sliderImages.length) % sliderImages.length;
      updateSlider();
    });

    sliderNextBtn?.addEventListener("click", () => {
      if (sliderImages.length < 2) return;
      sliderIndex = (sliderIndex + 1) % sliderImages.length;
      updateSlider();
    });

    sliderDotsEl?.addEventListener("click", (e) => {
      const dot = e.target.closest("[data-dot]");
      if (!dot) return;
      sliderIndex = Number(dot.getAttribute("data-dot"));
      updateSlider();
    });
  }

  function renderSlider(images, title) {
    ensureSliderExists();
    if (!sliderTrackEl || !sliderDotsEl) return;

    sliderImages = Array.isArray(images) && images.length ? images : [FALLBACK_IMG];
    sliderIndex = 0;

    sliderTrackEl.innerHTML = sliderImages
      .map((src, i) => `<img class="slide" src="${src}" alt="${title} photo ${i + 1}" loading="lazy" />`)
      .join("");

    sliderTrackEl.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => (img.src = FALLBACK_IMG));
    });

    sliderDotsEl.innerHTML = sliderImages
      .map(
        (_, i) =>
          `<button class="slider-dot ${i === 0 ? "active" : ""}" type="button" data-dot="${i}" aria-label="Go to photo ${
            i + 1
          }"></button>`
      )
      .join("");

    updateSlider();
  }

  function updateSlider() {
    if (!sliderTrackEl || !sliderDotsEl) return;

    sliderTrackEl.style.transform = `translateX(${-sliderIndex * 100}%)`;
    sliderDotsEl.querySelectorAll(".slider-dot").forEach((d, i) => d.classList.toggle("active", i === sliderIndex));

    const showControls = sliderImages.length > 1;
    if (sliderPrevBtn) sliderPrevBtn.style.display = showControls ? "" : "none";
    if (sliderNextBtn) sliderNextBtn.style.display = showControls ? "" : "none";
    sliderDotsEl.style.display = showControls ? "flex" : "none";
  }

  function openPropertyModal(index) {
    const prop = properties[index];
    if (!prop || !modal) return;

    const images =
      Array.isArray(prop.images) && prop.images.length
        ? prop.images
        : prop.slug
        ? imagesFromSlug(prop.slug, 3)
        : [FALLBACK_IMG];

    renderSlider(images, prop.title || "Property");

    if (modalTitle) modalTitle.textContent = prop.title || "";
    if (modalSubtitle) modalSubtitle.textContent = prop.subtitle || "";

    if (modalDesc) {
      modalDesc.textContent = prop.description || "";
      modalDesc.style.whiteSpace = "pre-line"; // shows \n line breaks
    }

    if (modalAmenities) {
      modalAmenities.innerHTML = safeAmenities(prop).map((a) => `<span class="pill">${a}</span>`).join("");
    }

    if (modalActions) {
      modalActions.innerHTML = (prop.links || [])
        .filter((l) => l && l.url)
        .map((link) => {
          const extra = link.style === "primary" ? " btn-primary" : "";
          return `<a href="${ensureHttps(link.url)}" target="_blank" rel="noopener" class="btn${extra}">${link.text}</a>`;
        })
        .join("");
    }

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close")?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  propertyGrid?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-property]");
    if (!btn) return;
    openPropertyModal(Number(btn.dataset.property));
  });

  modal?.addEventListener("click", (e) => {
    if (e.target && e.target.hasAttribute("data-close")) closeModal();
  });

  // =============================
  // Gallery lightbox
  // =============================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Gallery image";
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  document.getElementById("gallery-grid")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery-item");
    if (!btn) return;
    const imgSrc = btn.dataset.img;
    const imgAlt = btn.querySelector("img")?.alt || "Gallery image";
    openLightbox(imgSrc, imgAlt);
  });

  lightbox?.addEventListener("click", (e) => {
    if (e.target && e.target.hasAttribute("data-lightbox-close")) closeLightbox();
  });

  // Escape closes modal or lightbox
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (modal && modal.getAttribute("aria-hidden") === "false") closeModal();
    if (lightbox && lightbox.getAttribute("aria-hidden") === "false") closeLightbox();
  });

  // =============================
  // Contact form demo
  // =============================
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formStatus.textContent = "Sending...";
      formStatus.className = "form-status";

      setTimeout(() => {
        formStatus.textContent = "Message sent! We'll reply soon.";
        formStatus.className = "form-status success";
        contactForm.reset();
      }, 800);
    });
  }
});


