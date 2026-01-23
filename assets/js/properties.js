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

  // Booking section – header now moved outside the card
  const bookingSection = bookingUrl ? `
    <div class="mt-10 border-t border-gray-700 pt-8">
      <!-- Standalone header -->
      <div class="booking-header mb-6">
        <h3 class="text-2xl md:text-3xl font-bold text-white">Check Availability & Book Direct</h3>
        <p class="mt-2 text-slate-300 text-base">
          Best rates guaranteed • No hidden fees • Instant confirmation
        </p>
      </div>

      <!-- Clean iframe container -->
      <div class="booking-iframe-container rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900/30">
        <iframe
          src="${bookingUrl}"
          title="Booking Calendar & Form"
          loading="lazy"
          allowfullscreen
          class="w-full min-h-[700px] md:min-h-[800px] lg:min-h-[850px]"
        ></iframe>
      </div>
    </div>
  ` : `
    <div class="mt-10 border-t border-gray-700 pt-8">
      <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">Booking Information</h3>
      <p class="text-slate-300 text-base">
        Direct online booking not available at this time — please contact us for current availability and reservations.
      </p>
    </div>
  `;

  detailEl.innerHTML = `
    <div class="property-hero max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <button
        class="property-hero-media w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl relative group"
        type="button"
        id="openPhotosBtn"
        aria-label="View full photo gallery"
      >
        <img
          src="${cover}"
          alt="${prop.title || "Property"} hero view"
          loading="eager"
          width="1200"
          height="675"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div class="property-hero-badge absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg">
          <span>📸 View All Photos</span>
        </div>
      </button>

      <div class="property-hero-body mt-8 md:mt-10">
        <div class="property-hero-top flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 class="property-title text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">${prop.title || "Untitled Property"}</h1>
            <p class="property-subtitle mt-3 text-lg md:text-xl text-slate-300 font-medium">${prop.subtitle || ""}</p>
          </div>
          <div class="property-hero-actions flex items-center gap-4">
            <button class="btn btn-ghost btn-small px-5 py-2.5 text-sm font-semibold" id="sharePropertyBtn">
              🔗 Share this property
            </button>
          </div>
        </div>

        <!-- Quick Highlights -->
        ${prop.highlights?.length ? `
          <div class="property-highlights mt-6 flex flex-wrap gap-2.5">
            ${prop.highlights.map(h => `
              <span class="highlight-badge px-4 py-1.5 bg-blue-950/40 border border-blue-800/50 text-blue-200 rounded-full text-sm font-medium">
                ${h}
              </span>
            `).join('')}
          </div>
        ` : ''}

        <!-- Description -->
        <div class="property-desc mt-8 text-slate-300 leading-relaxed text-base">
          ${(prop.description || "").replace(/\n/g, "<br>")}
        </div>

        <!-- Amenities -->
        ${prop.amenities?.length ? `
          <div class="amenities-section mt-10 pt-8 border-t border-gray-700">
            <h3 class="text-2xl font-bold text-white mb-5">Amenities & Features</h3>
            <ul class="amenities-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              ${prop.amenities.map(a => `
                <li class="amenity-item bg-slate-900/40 border border-slate-700 rounded-xl p-4 text-slate-200">
                  ${a}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- House Rules -->
        ${prop.rules?.length ? `
          <div class="rules-section mt-10 pt-8 border-t border-gray-700">
            <h3 class="text-2xl font-bold text-white mb-5">House Rules</h3>
            <ul class="rules-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              ${prop.rules.map(r => `
                <li class="rule-item bg-slate-900/40 border border-slate-700 rounded-xl p-4 text-slate-300">
                  ${r}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Booking section (header now separate) -->
        ${bookingSection}

        <!-- Links -->
        <div class="property-links mt-10 flex flex-wrap gap-4">
          ${(prop.links || [])
            .filter(l => l?.url && l.text)
            .map(link => {
              const href = ensureHttps(link.url);
              const cls = link.style === "primary" 
                ? "bg-blue-600 hover:bg-blue-500 text-white" 
                : "bg-slate-700 hover:bg-slate-600 text-white";
              return `
                <a
                  class="btn px-6 py-3 rounded-lg font-semibold transition-colors ${cls}"
                  href="${href}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ${link.text}
                </a>
              `;
            }).join("")}
        </div>
      </div>
    </div>
  `;

  // Event listeners (unchanged)
  setImgFallback(detailEl.querySelector("img"));

  document
    .getElementById("sharePropertyBtn")
    ?.addEventListener("click", () => copyShareLink(prop.slug));

  document
    .getElementById("openPhotosBtn")
    ?.addEventListener("click", () => {
      const idx = properties.findIndex(p => p.slug === prop.slug);
      if (idx !== -1 && window.openPropertyModal) {
        window.openPropertyModal(idx);
      }
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