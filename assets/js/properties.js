// assets/js/properties.js

document.addEventListener("DOMContentLoaded", () => {
  const properties = window.allProperties || [];
  if (properties.length === 0) {
    console.warn("No properties loaded – check properties-data.js");
    return;
  }

  // ── Shared utilities ────────────────────────────────────────────────────────
  const utils = window.utils || {};
  const {
    FALLBACK_IMG,
    ensureHttps,
    setImgFallback,
    getCoverImage,
    copyShareLink
  } = utils;

  if (!getCoverImage || !copyShareLink) {
    console.error("Shared utils not loaded properly");
  }

  // ── Lodgify Configuration ──────────────────────────────────────────────────
  const LODGIFY_API_KEY = "eUV4fcJ1zkJ79JiYrSbimlutV5O0FNIbIigvu8waNKxnlcPrdtbevOEINga9lUns";

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

  const lodgifyCache = new Map();

  async function fetchLodgifyExtras(slug) {
    if (lodgifyCache.has(slug)) return lodgifyCache.get(slug);

    const propertyId = slugToIdMap[slug];
    if (!propertyId) {
      console.warn(`No Lodgify ID for slug: ${slug}`);
      return getFallbackExtras();
    }

    try {
      const res = await fetch(`https://api.lodgify.com/v2/properties/${propertyId}`, {
        headers: {
          "X-ApiKey": LODGIFY_API_KEY,
          "Accept": "application/json"
        }
      });

      if (!res.ok) throw new Error(`Lodgify API error: ${res.status}`);

      const data = await res.json();

      const extras = {
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        house_rules: data.house_rules || data.guest_rules || "House rules not specified.",
        cancellation_policy: data.cancellation_policy || "Not available.",
        payment_policy: data.payment_policy || "Not available.",
        calendar_embed_url: data.booking_url ||
          `https://checkout.lodgify.com/summitcountyrentals/${propertyId}/reservation?currency=USD&adults=1`
      };

      lodgifyCache.set(slug, extras);
      return extras;
    } catch (err) {
      console.error(`Lodgify fetch failed for ${slug}:`, err);
      return getFallbackExtras();
    }
  }

  function getFallbackExtras() {
    return {
      amenities: [],
      house_rules: "Not available.",
      cancellation_policy: "Not available.",
      payment_policy: "Not available.",
      calendar_embed_url: ""
    };
  }

  // ── DOM Elements ───────────────────────────────────────────────────────────
  const galleryView   = document.getElementById("gallery-view");
  const detailView    = document.getElementById("detail-view");
  const galleryGrid   = document.getElementById("gallery-grid");
  const detailEl      = document.getElementById("property-detail");

  // ── View Switching Helpers ─────────────────────────────────────────────────
function showGallery() {
  if (galleryView) galleryView.style.display = "block";
  if (detailView)  detailView.style.display = "none";

  // Clear detail to free memory
  if (detailEl) detailEl.innerHTML = "";

  // Clear active slug/chip
  clearActiveChip();

  // Remove property from hash (keep #properties if you want)
  const url = new URL(window.location);
  url.hash = "properties";
  window.history.pushState(null, "", url);
}


  function showDetail() {
    if (galleryView) galleryView.style.display = "none";
    if (detailView)  detailView.style.display = "block";
  }

  // ── Render Gallery Grid (thumbnails only) ──────────────────────────────────
  window.renderPropertyGrid = () => {
    if (!galleryGrid) {
      console.error("Gallery grid #gallery-grid not found");
      return;
    }

    galleryGrid.innerHTML = "";

    properties.forEach(prop => {
      if (!prop?.slug) return;
      const cover = getCoverImage(prop);

      const block = document.createElement("div");
      block.className = "gallery-block";
      block.innerHTML = `
        <button type="button" class="gallery-item" data-slug="${prop.slug}" aria-label="View ${prop.title || "property"}">
          <img 
            src="${cover}" 
            alt="${prop.title || "Property"}" 
            loading="lazy" 
            decoding="async" 
            width="400" 
            height="300" 
          />
        </button>
      `;

      const img = block.querySelector("img");

      // Force earlier loading with Intersection Observer
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                img.loading = "eager";
                observer.unobserve(img);
              }
            });
          },
          { rootMargin: "400px 0px", threshold: 0.01 }
        );
        observer.observe(img);
      }

      img.onload = () => img.classList.add("loaded");
      img.onerror = () => {
        img.src = FALLBACK_IMG;
        img.classList.add("loaded");
      };
      if (img.complete) img.classList.add("loaded");

      setImgFallback(img);
      galleryGrid.appendChild(block);
    });

    // Click → show selected property detail
    galleryGrid.addEventListener("click", e => {
      const btn = e.target.closest("[data-slug]");
      if (!btn) return;

      const slug = btn.dataset.slug;
      const prop = properties.find(p => p.slug === slug);
      if (!prop) return;

      // Set param INSIDE hash
      const url = new URL(window.location);
      url.hash = `properties?property=${encodeURIComponent(slug)}`;
      window.history.pushState(null, "", url);

      showDetail();
      setActiveChip(slug);
      renderPropertyDetail(prop);
    });
  };

  // ── Render Property Detail ─────────────────────────────────────────────────
  const renderPropertyDetail = async prop => {
    if (!detailEl || !prop?.slug) return;

    const cover = getCoverImage(prop);
    const extras = await fetchLodgifyExtras(prop.slug);
    const bookingUrl = ensureHttps(extras.calendar_embed_url);

    const bookingEmbed = bookingUrl ? `
      <div class="mt-8 border-t pt-6">
        <div class="bg-gray-100 rounded-lg overflow-hidden">
          <iframe 
            src="${bookingUrl}" 
            style="width:100%; height:800px; border:none;" 
            title="Booking Calendar & Form"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    ` : `
      <div class="mt-8 border-t pt-6">
        <h3 class="text-xl font-bold mb-4">Booking</h3>
        <p class="text-gray-700">Direct booking not available – contact us for reservations.</p>
      </div>
    `;

    detailEl.innerHTML = `
      <div class="property-hero">
        <button class="property-hero-media" type="button" id="openPhotosBtn" aria-label="View full photo gallery">
          <img src="${cover}" alt="${prop.title || "Property"}" loading="eager" width="800" height="600" />
          <div class="property-hero-badge">View Photos</div>
        </button>

        <div class="property-hero-body">
          <div class="property-hero-top">
            <div>
              <h1 class="property-title">${prop.title || "Untitled Property"}</h1>
              <p class="property-subtitle">${prop.subtitle || ""}</p>
            </div>
            <div class="property-hero-actions">
              <button class="btn btn-ghost btn-small" id="sharePropertyBtn">🔗 Share</button>
            </div>
          </div>

          <p class="property-desc">${(prop.description || "").replace(/\n/g, "<br>")}</p>

          ${bookingEmbed}

          <div class="property-links mt-8 flex flex-wrap gap-3">
            ${(prop.links || []).filter(l => l?.url && l.text).map(link => {
              const href = ensureHttps(link.url);
              const cls = link.style === "primary" ? " btn-primary" : " btn-ghost";
              return `<a class="btn btn-small${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${link.text}</a>`;
            }).join("")}
          </div>
        </div>
      </div>
    `;

    setImgFallback(detailEl.querySelector("img"));

    const shareBtn = document.getElementById("sharePropertyBtn");
    shareBtn?.addEventListener("click", () => copyShareLink(prop.slug));

    const photosBtn = document.getElementById("openPhotosBtn");
    photosBtn?.addEventListener("click", () => {
      const idx = properties.findIndex(p => p.slug === prop.slug);
      if (idx !== -1 && window.openPropertyModal) window.openPropertyModal(idx);
    });
  };

  const setActiveChip = slug => {
    document.querySelectorAll(".property-chip").forEach(btn =>
      btn.classList.toggle("active", btn.dataset.slug === slug)
    );
  };

  const clearActiveChip = () => {
  document.querySelectorAll(".property-chip.active").forEach(btn =>
    btn.classList.remove("active")
  );
};


  // ── Expose detail opener for navigation.js ────────────────────────────────
  window.showPropertyDetail = slug => {
    if (!slug) {
      showGallery();
      return;
    }

    const prop =
      properties.find(p => p.slug === slug) ||
      properties.find(p => p.slug?.toLowerCase() === slug?.toLowerCase());

    if (prop) {
      setActiveChip(slug);
      renderPropertyDetail(prop);
      showDetail();
    } else {
      console.warn(`Property slug not found: ${slug}`);
      showGallery();
    }
  };

  // ── Initialize ─────────────────────────────────────────────────────────────
  window.renderPropertyGrid(); 
});