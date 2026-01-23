// script.js - High Altitude Property Management site
// ✅ Landing page gallery can link to properties page
// ✅ Properties page: horizontal selector + deep links (?property=slug)
// ✅ Share link button (copies URL)
// ✅ Availability button (opens booking calendar link)
// ✅ Modal slider: swipe, arrows, dots, X close
// ✅ Cover ALWAYS slug-1.jpg and NEVER gets replaced by fallback
// ✅ Missing images fallback
// ✅ Booking links auto-fix https://

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

  const IMG_BASE = "assets/images";

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
  function ensureHttps(url) {
    const u = String(url || "").trim();
    if (!u) return "";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    return `https://${u}`;
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

  // ✅ Cover ALWAYS slug-1.jpg
  function getCoverImage(prop) {
    if (typeof prop?.slug === "string" && prop.slug) return `${IMG_BASE}/${prop.slug}-1.jpg`;
    return FALLBACK_IMG;
  }

  function uniqueImages(list) {
    const out = [];
    const seen = new Set();
    for (const u of list) {
      const key = String(u || "");
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(u);
    }
    return out;
  }

  function setImgFallback(imgEl) {
    if (!imgEl) return;
    imgEl.addEventListener("error", () => {
      imgEl.src = FALLBACK_IMG;
    });
  }

  function getShareUrlForSlug(slug) {
    const url = new URL(window.location.href);
    url.searchParams.set("property", slug);
    return url.toString();
  }

  async function copyShareLink(slug) {
    const shareUrl = getShareUrlForSlug(slug);

    // native share (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title: "Property Link", url: shareUrl });
        return;
      } catch (_) {
        // fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("✅ Link copied!");
    } catch (e) {
      // last fallback
      prompt("Copy this link:", shareUrl);
    }
  }

  function getPrimaryBookingLink(prop) {
    // prefer your "Book Direct" button (style: primary)
    const links = Array.isArray(prop?.links) ? prop.links : [];
    const direct = links.find((l) => l?.style === "primary" && l?.url);
    if (direct) return ensureHttps(direct.url);

    // fallback to first link
    const first = links.find((l) => l?.url);
    return first ? ensureHttps(first.url) : "";
  }

  // =============================
  // ✅ AUTO-DETECT IMAGES (NO COUNTING)
  // =============================
  const IMG_EXTS = ["jpg", "jpeg", "png", "webp"];
  const imageCache = new Map(); // slug -> [urls]

  function imageLoads(url, timeoutMs = 2500) {
    return new Promise((resolve) => {
      const img = new Image();
      let done = false;

      const finish = (ok) => {
        if (done) return;
        done = true;
        resolve(ok);
      };

      const timer = setTimeout(() => finish(false), timeoutMs);

      img.onload = () => {
        clearTimeout(timer);
        finish(true);
      };

      img.onerror = () => {
        clearTimeout(timer);
        finish(false);
      };

      const bust = `cb=${Date.now()}_${Math.random().toString(16).slice(2)}`;
      img.src = url.includes("?") ? `${url}&${bust}` : `${url}?${bust}`;
    });
  }

  async function findFirstWorking(urls) {
    for (const u of urls) {
      // eslint-disable-next-line no-await-in-loop
      const ok = await imageLoads(u);
      if (ok) return u;
    }
    return null;
  }

  async function detectImagesForSlug(slug, options = {}) {
    const { max = 120, missLimit = 3 } = options;

    const s = String(slug || "").trim();
    if (!s) return [FALLBACK_IMG];

    if (imageCache.has(s)) return imageCache.get(s);

    const found = [];
    let misses = 0;

    for (let i = 1; i <= max; i++) {
      const candidates = IMG_EXTS.map((ext) => `${IMG_BASE}/${s}-${i}.${ext}`);
      // eslint-disable-next-line no-await-in-loop
      const hit = await findFirstWorking(candidates);

      if (hit) {
        found.push(hit);
        misses = 0;
      } else {
        misses++;
        if (found.length > 0 && misses >= missLimit) break;
      }
    }

    const finalList = found.length ? found : [FALLBACK_IMG];
    imageCache.set(s, finalList);
    return finalList;
  }

  async function getPropertyImages(prop) {
    if (Array.isArray(prop?.images) && prop.images.length) return prop.images;
    if (prop?.slug) return detectImagesForSlug(prop.slug, { max: 120, missLimit: 3 });
    return [FALLBACK_IMG];
  }

  // =============================
  // PROPERTY DATA ✅ (ALL PROPERTIES)
  // =============================
  const properties = [
    {
      slug: "Rustic-Roots",
      title: "Rustic Roots",
      subtitle: "Sleeps 10 • 3 bedrooms • 3 baths",
      description: [
        "Nestled on a stunning mountain property just above Park City, this 3BR, 3BA getaway is surrounded by dreamy natural surroundings that you'll be able to enjoy from two decks and a luxurious hot tub!",
        "",
        "✔ 3 Comfy BRs + Loft Bunks",
        "✔ 2 Living Areas (Arcade Machines, Loft Net)",
        "✔ Outdoors (Hot Tub, Fire Pit, BBQ)",
        "✔ Wi-Fi + Laundry + Parking",
      ].join("\n"),
      amenities: ["Hot tub", "Fireplace", "Game room", "WiFi", "Full kitchen", "Double decks"],
      links: [
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/720956/reservation?currency=USD&adults=1", style: "primary" },
        { text: "Book on Airbnb", url: "https://www.airbnb.com/h/rusticrootsretreatparkcity" },
      ],
    },

    {
      slug: "panoramapinesaboveparkcity",
      title: "Panorama Pines With Hot Tub Above Park City",
      subtitle: "Sleeps 10 • 6 beds • 2 baths",
      description:
        "Welcome to Panorama Pines, your gateway to a tranquil mountain retreat nestled among majestic peaks at 8,000 feet. Escape the bustle of the city and settle into crisp mountain air, cozy comfort, and peaceful seclusion—surrounded by stunning natural beauty while still within easy reach of Park City adventures.",
      amenities: ["Hot tub", "Fire pit", "Fully stocked", "Large deck w/ mountain views", "WiFi", "Spacious"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/panoramapinesaboveparkcity" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/625687/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    // 🔥 keep the rest of your properties exactly how you had them…
    // (I left them out here for message size)
  ];

  // =============================
  // ✅ PAGE DETECTION
  // =============================
  const pickerEl = document.getElementById("property-picker");
  const detailEl = document.getElementById("property-detail");
  const isPropertiesPage = Boolean(pickerEl && detailEl);

  // =============================
  // ✅ PROPERTIES PAGE RENDER
  // =============================
  function setActiveChip(slug) {
    document.querySelectorAll(".property-chip").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.slug === slug);
    });
  }

  function updateUrl(slug) {
    const url = new URL(window.location.href);
    url.searchParams.set("property", slug);
    window.history.replaceState({}, "", url.toString());
  }

  function renderPropertyDetail(prop) {
    if (!detailEl || !prop) return;

    const cover = getCoverImage(prop);
    const primaryBooking = getPrimaryBookingLink(prop);

    detailEl.innerHTML = `
      <div class="property-hero">
        <button class="property-hero-media" type="button" id="openPhotosBtn" aria-label="Open photos">
          <img src="${cover}" alt="${prop.title || "Property"}" loading="eager" />
          <div class="property-hero-badge">View Photos</div>
        </button>

        <div class="property-hero-body">
          <div class="property-hero-top">
            <div>
              <h1 class="property-title">${prop.title || ""}</h1>
              <p class="property-subtitle">${prop.subtitle || ""}</p>
            </div>

            <div class="property-hero-actions">
              <button class="btn btn-ghost btn-small" type="button" id="sharePropertyBtn">🔗 Share</button>
              ${
                primaryBooking
                  ? `<a class="btn btn-small btn-primary" href="${primaryBooking}" target="_blank" rel="noopener">📅 Availability</a>`
                  : ""
              }
            </div>
          </div>

          <p class="property-desc">${clampText(prop.description || "", 9999)}</p>

          <div class="property-tags">
            ${safeAmenities(prop)
              .map((a) => `<span class="tag">${a}</span>`)
              .join("")}
          </div>

          <div class="property-links">
            ${(prop.links || [])
              .filter((l) => l?.url)
              .map((link) => {
                const href = ensureHttps(link.url);
                const extraClass = link.style === "primary" ? " btn-primary" : " btn-ghost";
                return `<a class="btn btn-small${extraClass}" href="${href}" target="_blank" rel="noopener">${link.text}</a>`;
              })
              .join("")}
          </div>
        </div>
      </div>
    `;

    // fallback image safety
    setImgFallback(detailEl.querySelector("img"));

    // Share button copies deep link
    document.getElementById("sharePropertyBtn")?.addEventListener("click", () => {
      copyShareLink(prop.slug);
    });

    // clicking the hero image opens modal photos
    document.getElementById("openPhotosBtn")?.addEventListener("click", () => {
      const index = properties.findIndex((p) => p.slug === prop.slug);
      if (index >= 0) openPropertyModal(index);
    });
  }

  function renderPropertyPicker() {
    if (!pickerEl) return;

    pickerEl.innerHTML = "";

    properties.forEach((prop) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "property-chip";
      chip.dataset.slug = prop.slug;
      chip.textContent = prop.title || prop.slug;

      chip.addEventListener("click", () => {
        updateUrl(prop.slug);
        setActiveChip(prop.slug);
        renderPropertyDetail(prop);
      });

      pickerEl.appendChild(chip);
    });

    // "Properties" title button scrolls chips back to start
    document.getElementById("pickerTitle")?.addEventListener("click", () => {
      pickerEl.scrollTo({ left: 0, behavior: "smooth" });
    });

    // Auto load property from URL param
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("property");

    const prop = properties.find((p) => p.slug === slug) || properties[0];
    if (prop) {
      updateUrl(prop.slug);
      setActiveChip(prop.slug);
      renderPropertyDetail(prop);
    }
  }

  if (isPropertiesPage) {
    renderPropertyPicker();
  }

  // =============================
  // ✅ Landing Page Gallery (if you keep it on index.html)
  // Clicking goes to properties.html?property=slug
  // =============================
  function renderGalleryLinks() {
    const galleryGrid = document.getElementById("gallery-grid");
    if (!galleryGrid) return;

    galleryGrid.innerHTML = "";

    properties.forEach((prop) => {
      const cover = getCoverImage(prop);

      const block = document.createElement("div");
      block.className = "gallery-block";
      block.innerHTML = `
        <button type="button" class="gallery-item" data-go="${prop.slug}" aria-label="Open ${prop.title || "property"}">
          <img src="${cover}" alt="${prop.title || "Property"}" loading="lazy" />
        </button>
        <button type="button" class="gallery-overlay-link" data-go="${prop.slug}">View Details</button>
      `;

      setImgFallback(block.querySelector("img"));
      galleryGrid.appendChild(block);
    });

    galleryGrid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-go]");
      if (!btn) return;

      const slug = btn.dataset.go;
      window.location.href = `properties.html?property=${encodeURIComponent(slug)}`;
    });
  }

  renderGalleryLinks();

  // =============================
  // Modal + Slider (Photos)
  // =============================
  const modal = document.getElementById("property-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const modalDesc = document.getElementById("modal-description");
  const modalAmenities = document.getElementById("modal-amenities");
  const modalActions = document.getElementById("modal-actions");
  const modalMedia = modal?.querySelector(".modal-media");

  let sliderIndex = 0;
  let sliderImages = [];
  let currentPropIndex = -1;

  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function buildSlider(images, title) {
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

    const track = modalMedia.querySelector(".slider-track");
    const dots = modalMedia.querySelector(".slider-dots");
    const prevBtn = modalMedia.querySelector(".slider-btn.prev");
    const nextBtn = modalMedia.querySelector(".slider-btn.next");
    const viewport = modalMedia.querySelector(".slider-viewport");

    track.innerHTML = sliderImages
      .map(
        (src, i) => `
          <div class="slide-wrap">
            <img class="slide" draggable="false" src="${src}" alt="${title} photo ${i + 1}" loading="lazy" />
          </div>
        `
      )
      .join("");

    track.querySelectorAll("img").forEach((img) => setImgFallback(img));

    dots.innerHTML = sliderImages
      .map((_, i) => `<button class="slider-dot ${i === 0 ? "active" : ""}" type="button" data-dot="${i}"></button>`)
      .join("");

    function update() {
      track.style.transform = `translate3d(${-sliderIndex * 100}%, 0, 0)`;

      dots.querySelectorAll(".slider-dot").forEach((d, i) => {
        d.classList.toggle("active", i === sliderIndex);
      });

      const showControls = sliderImages.length > 1;
      prevBtn.style.display = showControls ? "flex" : "none";
      nextBtn.style.display = showControls ? "flex" : "none";
      dots.style.display = showControls ? "flex" : "none";
    }

    function prev() {
      if (sliderImages.length < 2) return;
      sliderIndex = (sliderIndex - 1 + sliderImages.length) % sliderImages.length;
      update();
    }

    function next() {
      if (sliderImages.length < 2) return;
      sliderIndex = (sliderIndex + 1) % sliderImages.length;
      update();
    }

    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);

    dots.addEventListener("click", (e) => {
      const dot = e.target.closest("[data-dot]");
      if (!dot) return;
      sliderIndex = Number(dot.dataset.dot);
      update();
    });

    // ✅ Swipe events
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let dy = 0;
    let locked = null;
    let dragging = false;
    const SWIPE_THRESHOLD = 50;

    function onStart(x, y) {
      startX = x;
      startY = y;
      dx = 0;
      dy = 0;
      locked = null;
      dragging = true;
    }

    function onMove(x, y, e) {
      if (!dragging) return;
      dx = x - startX;
      dy = y - startY;

      if (locked === null) locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (locked === "x") e.preventDefault();
    }

    function onEnd() {
      if (!dragging) return;
      dragging = false;
      if (locked !== "x") return;

      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) next();
        else prev();
      }
    }

    viewport.addEventListener(
      "pointerdown",
      (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        viewport.setPointerCapture(e.pointerId);
        onStart(e.clientX, e.clientY);
      },
      { passive: true }
    );

    viewport.addEventListener(
      "pointermove",
      (e) => onMove(e.clientX, e.clientY, e),
      { passive: false }
    );

    viewport.addEventListener("pointerup", onEnd, { passive: true });
    viewport.addEventListener("pointercancel", onEnd, { passive: true });

    viewport.addEventListener(
      "touchstart",
      (e) => {
        const t = e.touches[0];
        onStart(t.clientX, t.clientY);
      },
      { passive: true }
    );

    viewport.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches[0];
        onMove(t.clientX, t.clientY, e);
      },
      { passive: false }
    );

    viewport.addEventListener("touchend", onEnd, { passive: true });

    update();
  }

  async function openPropertyModal(index) {
    const prop = properties[index];
    if (!prop || !modal) return;

    currentPropIndex = index;

    modalTitle.textContent = prop.title || "";
    modalSubtitle.textContent = prop.subtitle || "";
    modalDesc.textContent = prop.description || "";
    modalDesc.style.whiteSpace = "pre-line";

    modalAmenities.innerHTML = safeAmenities(prop).map((a) => `<span class="pill">${a}</span>`).join("");

    modalActions.innerHTML = (prop.links || [])
      .filter((l) => l?.url)
      .map((link) => {
        const extra = link.style === "primary" ? " btn-primary" : "";
        return `<a href="${ensureHttps(link.url)}" target="_blank" rel="noopener" class="btn${extra}">${link.text}</a>`;
      })
      .join("");

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const cover = getCoverImage(prop);
    buildSlider([cover], prop.title || "Property");

    const detected = await getPropertyImages(prop);
    const merged = uniqueImages([cover, ...(detected || []).filter((u) => u && u !== FALLBACK_IMG)]);

    buildSlider(merged.length ? merged : [cover], prop.title || "Property");
  }

  modal?.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();

    // Share icon inside modal slider
    if (e.target.closest("[data-share]")) {
      const prop = properties[currentPropIndex];
      if (prop) copyShareLink(prop.slug);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // =============================
  // Contact form demo (only if exists)
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



