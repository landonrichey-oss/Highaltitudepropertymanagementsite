// assets/js/utils.js
// Shared utilities, constants and helpers for the High Altitude Property Management site

// ── Constants ────────────────────────────────────────────────────────────────

/** Fallback placeholder image when no photo is available */
const FALLBACK_IMG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0b1220"/>
        <stop offset="1" stop-color="#13213f"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="48%" fill="#ffffff" opacity="0.85" font-size="44" font-family="Arial" text-anchor="middle">Photos coming soon</text>
    <text x="50%" y="56%" fill="#ffffff" opacity="0.65" font-size="22" font-family="Arial" text-anchor="middle">Add images to assets/images/</text>
  </svg>
`)}`;

/** Base path for property images */
const IMG_BASE = "assets/images";

/** Supported image extensions (used for auto-detection if needed) */
const IMG_EXTS = ["jpg", "jpeg", "png", "webp"];

// ── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Ensures a URL starts with https:// (or returns empty string)
 * @param {string} url - The URL to normalize
 * @returns {string}
 */
function ensureHttps(url) {
  const u = String(url ?? "").trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return `https://${u}`;
}

/**
 * Sets an onerror handler on an <img> to fall back to placeholder
 * @param {HTMLImageElement} imgEl - The image element
 */
function setImgFallback(imgEl) {
  if (!imgEl) return;
  imgEl.addEventListener("error", () => {
    imgEl.src = FALLBACK_IMG;
  });
}

/**
 * Returns the primary cover image path for a property
 * @param {Object} prop - Property object (must have .slug)
 * @returns {string} Image URL or fallback
 */
function getCoverImage(prop) {
  return prop?.slug ? `${IMG_BASE}/${prop.slug}-1.jpg` : FALLBACK_IMG;
}

/**
 * Generates a shareable deep link to a specific property
 * @param {string} slug - Property slug
 * @returns {string} Full shareable URL
 */
function getShareUrlForSlug(slug) {
  const u = new URL(window.location.href);

  // Put both section AND parameter inside the hash — this matches your parser's primary logic
  u.hash = `properties?property=${encodeURIComponent(slug)}`;

  // Optional: clear any real query string to keep URL clean
  u.search = '';

  return u.toString();
}

/**
 * Copies a property share link to clipboard or uses Web Share API
 * @param {string} slug - Property slug
 */
async function copyShareLink(slug) {
  const shareUrl = getShareUrlForSlug(slug);

  if (navigator.share) {
    try {
      await navigator.share({ title: "Property Link", url: shareUrl });
      return;
    } catch {
      // User cancelled or share not supported → fallback to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  } catch {
    prompt("Copy this link manually:", shareUrl);
  }
}

// ── Expose globally ──────────────────────────────────────────────────────────

// Main namespace (preferred way)
window.utils = {
  FALLBACK_IMG,
  IMG_BASE,
  IMG_EXTS,
  ensureHttps,
  setImgFallback,
  getCoverImage,
  getShareUrlForSlug,
  copyShareLink
};

// Direct globals (convenience for shorter code — optional but useful)
window.FALLBACK_IMG     = FALLBACK_IMG;
window.IMG_BASE         = IMG_BASE;
window.ensureHttps      = ensureHttps;
window.setImgFallback   = setImgFallback;
window.getCoverImage    = getCoverImage;
window.copyShareLink    = copyShareLink;