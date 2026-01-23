// script.js - High Altitude Property Management site
// Base data from properties-data.js + Lodgify API extras (amenities, rules, policies, calendar embed)

document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // Load base properties from data file
  // =============================
  const properties = window.allProperties || [];
  if (properties.length === 0) {
    console.warn("No properties loaded – check properties-data.js");
  }

  // =============================
  // Page elements (defined early for use in render functions)
  // =============================
  const pickerEl = document.getElementById("property-picker");
  const detailEl = document.getElementById("property-detail");

  // =============================
  // Constants
  // =============================
  const FALLBACK_IMG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
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
  `)}`;

  const IMG_BASE = "assets/images";
  const IMG_EXTS = ["jpg", "jpeg", "png", "webp"];

  const LODGIFY_API_KEY = 'eUV4fcJ1zkJ79JiYrSbimlutV5O0FNIbIigvu8waNKxnlcPrdtbevOEINga9lUns';

  // Cache Lodgify extras per slug
  const lodgifyCache = new Map();

  // Slug → Lodgify ID mapping (update with real IDs from your dashboard/URLs)
  const slugToIdMap = {
    "Rustic-Roots": 720956,
    "Bright-Mountain-Retreat": 609125,
    "whisperingpinesaboveparkcity": 720955,
    "bearnecessitiesparkcity": 609126,
    "sunflowerlodgeparkcity": 568064,
    "wasatachfamilyretreat": 742776,
    "quietsummitretreat": null,
    "timberhavenaboveparkcity": 612193,
    "hilltophideoutaboveparkcity": null,
    "aspenlogcabin": 501596,
    "winterridgeretreat": 748550,
    "wasatchgetaway": 560589,
    "reddoorlodgenearparkcity": 609969,
    "panoramapinesaboveparkcity": 625687,
    "olliespost": 729439,
    "notrereveparkcity": null,
    "meanderingmoose": 720957,
    "cozycabingetawayaboveparkcity": 743531,
    "porcupineloop": 625686,
    "moosemountainlodgeaboveparkcity": 729437,
    "nativeretreat": 729437,
    "willowwayparkcity": 720954,
    "tollgatetower": 493461,
    "wasatchadventurecabin": null,
    "tollgatehavenparkcity": 560588,
    "themoosemanorlodge": 539990,
    "iroquoisloopaboveparkcity": 669102,
    "littlehideawayaboveparkcity": 743532,
    "80acreprivatemountainresort": 494366,
    "parkcitycondominsfromslope": 729438,
    "elkhavenaboveparkcity": null
  };

  // =============================
  // Helpers (defined early to avoid "not defined" errors)
  // =============================
  const ensureHttps = (url) => {
    const u = String(url ?? "").trim();
    if (!u) return "";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    return `https://${u}`;
  };

  const clampText = (text, max = 220) => {
    const t = String(text ?? "").replace(/\s+/g, " ").trim();
    return t.length <= max ? t : t.slice(0, max).trimEnd() + "…";
  };

  const safeAmenities = (prop) => {
    const list = Array.isArray(prop?.amenities) ? prop.amenities.filter(Boolean) : [];
    return list.length ? list : ["See listing for amenities"];
  };

  const getCoverImage = (prop) =>
    prop?.slug ? `${IMG_BASE}/${prop.slug}-1.jpg` : FALLBACK_IMG;

  const uniqueImages = (list) => {
    const seen = new Set();
    return list.filter((u) => {
      const key = String(u || "");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const setImgFallback = (imgEl) => {
    imgEl?.addEventListener("error", () => {
      imgEl.src = FALLBACK_IMG;
    });
  };

  const getShareUrlForSlug = (slug) => {
    const u = new URL(window.location.href);
    u.hash = 'properties';
    u.searchParams.set("property", slug);
    return u.toString();
  };

  const copyShareLink = async (slug) => {
    const shareUrl = getShareUrlForSlug(slug);

    if (navigator.share) {
      try {
        await navigator.share({ title: "Property Link", url: shareUrl });
        return;
      } catch { }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("✅ Link copied!");
    } catch {
      prompt("Copy this link:", shareUrl);
    }
  };

  const getPrimaryBookingLink = (prop) => {
    const links = Array.isArray(prop?.links) ? prop.links : [];
    const primary = links.find((l) => l?.style === "primary" && l?.url);
    if (primary) return ensureHttps(primary.url);

    const any = links.find((l) => l?.url);
    return any ? ensureHttps(any.url) : "";
  };

  // Image auto-detection
  const imageCache = new Map();

  const imageLoads = (url, timeoutMs = 2500) =>
    new Promise((resolve) => {
      const img = new Image();
      let done = false;
      const finish = (ok) => { if (!done) { done = true; resolve(ok); } };
      const timer = setTimeout(() => finish(false), timeoutMs);
      img.onload = () => { clearTimeout(timer); finish(true); };
      img.onerror = () => { clearTimeout(timer); finish(false); };
      const bust = `cb=${Date.now()}_${Math.random().toString(16).slice(2)}`;
      img.src = url.includes("?") ? `${url}&${bust}` : `${url}?${bust}`;
    });

  const findFirstWorking = async (urls) => {
    for (const u of urls) if (await imageLoads(u)) return u;
    return null;
  };

  const detectImagesForSlug = async (slug, { max = 120, missLimit = 3 } = {}) => {
    const s = String(slug || "").trim();
    if (!s) return [FALLBACK_IMG];
    if (imageCache.has(s)) return imageCache.get(s);

    const found = [];
    let misses = 0;

    for (let i = 1; i <= max; i++) {
      const candidates = IMG_EXTS.map(ext => `${IMG_BASE}/${s}-${i}.${ext}`);
      const hit = await findFirstWorking(candidates);
      if (hit) {
        found.push(hit);
        misses = 0;
      } else {
        misses++;
        if (found.length > 0 && misses >= missLimit) break;
      }
    }

    const final = found.length ? found : [FALLBACK_IMG];
    imageCache.set(s, final);
    return final;
  };

  const getPropertyImages = async (prop) => {
    if (Array.isArray(prop?.images) && prop.images.length) return prop.images;
    if (prop?.slug) return detectImagesForSlug(prop.slug);
    return [FALLBACK_IMG];
  };

  // =============================
  // Lodgify Fetch
  // =============================
  async function fetchLodgifyExtras(slug) {
    if (lodgifyCache.has(slug)) return lodgifyCache.get(slug);

    try {
      const propertyId = slugToIdMap[slug];

      if (!propertyId) {
        console.warn(`No Lodgify ID mapped for slug "${slug}"`);
        return getFallbackExtras();
      }

      const res = await fetch(`https://api.lodgify.com/v2/properties/${propertyId}`, {
        headers: {
          'X-ApiKey': LODGIFY_API_KEY,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        console.error(`Lodgify fetch failed for ID ${propertyId}: ${res.status}`);
        return getFallbackExtras();
      }

      const data = await res.json();

      const extras = {
        amenities: data.amenities || [],
        house_rules: data.house_rules || data.guest_rules || data.rules || 'House rules not specified.',
        cancellation_policy: data.cancellation_policy || data.policies?.cancellation || 'Cancellation policy not available.',
        payment_policy: data.payment_policy || data.policies?.payment || 'Payment terms not available.',
        calendar_embed_url: data.booking_url || `https://checkout.lodgify.com/summitcountyrentals/${propertyId}/reservation?currency=USD&adults=1`
      };

      lodgifyCache.set(slug, extras);
      return extras;

    } catch (err) {
      console.error('Lodgify fetch error:', err);
      return getFallbackExtras();
    }
  }

  function getFallbackExtras() {
    return {
      amenities: [],
      house_rules: 'Not available.',
      cancellation_policy: 'Not available.',
      payment_policy: 'Not available.',
      calendar_embed_url: ''
    };
  }

  // =============================
  // Header + basic UI
  // =============================
  document.getElementById("year")?.replaceChildren(String(new Date().getFullYear()));

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");
  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav?.classList.toggle("open");
  });

  document.getElementById("back-to-top")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // =============================
  // Properties page logic
  // =============================
  const setActiveChip = (slug) => {
    document.querySelectorAll(".property-chip").forEach(btn =>
      btn.classList.toggle("active", btn.dataset.slug === slug)
    );
  };

  const updateUrl = (slug) => {
    const url = new URL(window.location.href);
    url.searchParams.set("property", slug);
    window.history.replaceState(null, "", url);
  };

  // Async detail render with Lodgify extras
  const renderPropertyDetail = (prop) => {
    if (!detailEl || !prop) return;

    const cover = getCoverImage(prop);
    const primaryBooking = getPrimaryBookingLink(prop);

    // Construct Lodgify booking embed URL using ID mapping
    const propertyId = slugToIdMap[prop.slug];
    const lodgifyBookingUrl = propertyId
      ? `https://checkout.lodgify.com/summitcountyrentals/${propertyId}/reservation?currency=USD&adults=1`
      : primaryBooking || '';

    // Embedded calendar/booking iframe (direct on site)
    const bookingEmbed = lodgifyBookingUrl ? `
      <div class="mt-8 border-t pt-6">
        <h3 class="text-xl font-bold mb-4">Book Directly – Check Availability & Reserve</h3>
        <div class="bg-gray-100 rounded-lg overflow-hidden">
          <iframe 
            src="${ensureHttps(lodgifyBookingUrl)}" 
            style="width:100%; height:800px; border:none;" 
            title="Booking Calendar & Form"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
        <p class="text-sm text-gray-600 mt-4">
          Complete your booking right here – no leaving the site! Real-time availability and secure payment.
        </p>
      </div>
    ` : `
      <div class="mt-8 border-t pt-6">
        <h3 class="text-xl font-bold mb-4">Booking</h3>
        <p class="text-gray-700">Direct booking not available – contact us for reservations.</p>
      </div>
    `;

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
              <button class="btn btn-ghost btn-small" id="sharePropertyBtn">🔗 Share</button>
            </div>
          </div>

          <p class="property-desc">${clampText(prop.description ?? "", 9999)}</p>

          <!-- Amenities -->
          <div class="property-tags mt-8">
            <h3 class="text-lg font-bold mb-3">Amenities</h3>
            <div class="flex flex-wrap gap-2">
              ${safeAmenities(prop).map(a => `<span class="tag">${a}</span>`).join('')}
            </div>
          </div>

          <!-- Embedded Booking Calendar/Form -->
          ${bookingEmbed}

          <!-- Links (fallback if needed) -->
          <div class="property-links mt-8">
            ${(prop.links || []).filter(l => l?.url).map(link => {
      const href = ensureHttps(link.url);
      const cls = link.style === "primary" ? " btn-primary" : " btn-ghost";
      return `<a class="btn btn-small${cls}" href="${href}" target="_blank" rel="noopener">${link.text}</a>`;
    }).join("")}
          </div>
        </div>
      </div>
    `;

    setImgFallback(detailEl.querySelector("img"));

    document.getElementById("sharePropertyBtn")?.addEventListener("click", () => copyShareLink(prop.slug));

    document.getElementById("openPhotosBtn")?.addEventListener("click", () => {
      const idx = properties.findIndex(p => p.slug === prop.slug);
      if (idx !== -1) openPropertyModal(idx);
    });
  };

  const renderPropertyPicker = () => {
    if (!pickerEl) return;

    if (properties.length === 0) {
      pickerEl.innerHTML = '<p class="muted">No properties available.</p>';
      return;
    }

    pickerEl.innerHTML = "";

    properties.forEach(prop => {
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

    document.getElementById("pickerTitle")?.addEventListener("click", () => {
      pickerEl.scrollTo({ left: 0, behavior: "smooth" });
    });

    // Auto-select from URL param
    const params = new URLSearchParams(location.search);
    let slug = params.get("property")?.trim();
    let prop = properties.find(p => p.slug === slug) ||
      properties.find(p => p.slug.toLowerCase() === slug?.toLowerCase()) ||
      properties[0];

    if (prop) {
      updateUrl(prop.slug);
      setActiveChip(prop.slug);
      renderPropertyDetail(prop);
    }
  };

  // =============================
  // Landing gallery
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
      window.location.hash = 'properties';
      window.location.search = '?property=' + encodeURIComponent(slug);

      setTimeout(() => {
        renderPropertyPicker();
      }, 100);
    });
  }

  renderGalleryLinks();

  // =============================
  // Modal slider
  // =============================
  const modal = document.getElementById("property-modal");
  if (!modal) return;

  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const modalDesc = document.getElementById("modal-description");
  const modalAmenities = document.getElementById("modal-amenities");
  const modalActions = document.getElementById("modal-actions");
  const modalMedia = modal.querySelector(".modal-media");

  let sliderIndex = 0;
  let sliderImages = [];
  let currentPropIndex = -1;

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

    // Swipe support
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

    viewport.addEventListener("pointermove", (e) => onMove(e.clientX, e.clientY, e), { passive: false });
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
  };

  const openPropertyModal = async (index) => {
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
  };

  modal?.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();

    if (e.target.closest("[data-share]")) {
      const prop = properties[currentPropIndex];
      if (prop) copyShareLink(prop.slug);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // =============================
  // Contact form (demo)
  // =============================
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!formStatus) return;

    formStatus.textContent = "Sending...";
    formStatus.className = "form-status";

    setTimeout(() => {
      formStatus.textContent = "Message sent! We'll reply soon.";
      formStatus.className = "form-status success";
      contactForm.reset();
    }, 800);
  });

  console.log(`Loaded ${properties.length} properties from properties-data.js`);
});