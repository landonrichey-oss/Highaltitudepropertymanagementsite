document.addEventListener("DOMContentLoaded", () => {
  const bgElement = document.getElementById("full-hero-bg");
  const heroActions = document.getElementById("hero-actions");
  const footer = document.querySelector(".site-footer");

  if (!bgElement || !heroActions) return;

  const featured = window.allProperties?.filter(p => p?.featured === true && p?.slug) || [];

  if (featured.length === 0) {
    bgElement.style.backgroundImage = `url('${window.utils?.FALLBACK_IMG || ''}')`;
    heroActions.innerHTML = `<a class="btn" href="#properties">Browse Properties</a>`;
    return;
  }

  // Preload
  featured.forEach(prop => {
    const img = new Image();
    img.src = window.utils?.getCoverImage(prop) || window.utils?.FALLBACK_IMG || '';
    img.decoding = "async";
    img.loading = "eager";
  });

  // Second layer
  let bgLayer1 = bgElement;
  let bgLayer2 = document.getElementById("full-hero-bg-layer2");

  if (!bgLayer2) {
    bgLayer2 = document.createElement("div");
    bgLayer2.id = "full-hero-bg-layer2";
    bgLayer2.style.cssText = `
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transition: opacity 1.6s ease-in-out;
      opacity: 0;
      z-index: 1;
      pointer-events: none;
    `;
    bgElement.parentNode.insertBefore(bgLayer2, bgElement.nextSibling);
  }

  const parent = bgElement.parentNode;
  parent.style.position = "relative";

  let currentIndex = 0;
  let timeoutId = null;
  let activeLayer = bgLayer1;
  let inactiveLayer = bgLayer2;

  // Buttons
  let bookNowBtn;
  function initButtons() {
    if (bookNowBtn) return;
    heroActions.innerHTML = `
      <a id="book-now-btn" class="btn" href="#properties">Book Now</a>
      <a class="btn btn-ghost" href="#properties">Explore</a>
    `;
    bookNowBtn = document.getElementById("book-now-btn");
  }
  initButtons();

  function setImage(layer, url) {
    layer.style.backgroundImage = `url('${url || window.utils?.FALLBACK_IMG || ''}')`;
  }

  function performCrossfade() {
    const prop = featured[currentIndex];
    if (!prop) return;

    const nextUrl = window.utils?.getCoverImage(prop) || '';

    setImage(inactiveLayer, nextUrl);
    inactiveLayer.style.opacity = "1";
    activeLayer.style.opacity = "0";

    const handleTransitionEnd = () => {
      [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
      inactiveLayer.style.opacity = "0";
      activeLayer.removeEventListener("transitionend", handleTransitionEnd);
    };

    activeLayer.addEventListener("transitionend", handleTransitionEnd, { once: true });

    if (bookNowBtn) {
      bookNowBtn.href = `#properties?property=${encodeURIComponent(prop.slug)}`;
    }

    currentIndex = (currentIndex + 1) % featured.length;
  }

  function scheduleNextAttempt() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => tryAdvance(), 5000);
  }

  function tryAdvance() {
    const nextIndex = (currentIndex + 1) % featured.length;
    const nextProp = featured[nextIndex];
    if (!nextProp) {
      scheduleNextAttempt();
      return;
    }

    const nextUrl = window.utils?.getCoverImage(nextProp) || '';

    const testImg = new Image();
    testImg.src = nextUrl;

    const isReady = testImg.complete && testImg.naturalWidth !== 0;

    if (isReady) {
      performCrossfade();
      scheduleNextAttempt();
    } else {
      testImg.onload = () => {
        performCrossfade();
        scheduleNextAttempt();
      };
      testImg.onerror = () => {
        console.warn("Failed to load hero image:", nextUrl);
        currentIndex = nextIndex;
        scheduleNextAttempt();
      };
    }
  }

  // ── Force scroll to top when starting the carousel ───────────────────────
  // This runs early, right after initial setup, to guarantee top position
  window.scrollTo({ top: 0, behavior: "instant" });
  // Optional extra safety (some browsers ignore instant on load)
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 0);

  // Initial image setup
  setImage(bgLayer1, window.utils?.getCoverImage(featured[0]) || '');
  bgLayer1.style.opacity = "1";
  bgLayer1.classList.add("active");

  if (bookNowBtn) {
    bookNowBtn.href = `#properties?property=${encodeURIComponent(featured[0].slug)}`;
  }

  setTimeout(() => {
    tryAdvance();
  }, 1200);

  // Visibility handling (unchanged)
  const heroSection = document.querySelector("#home") || bgElement.closest(".section") || parent;

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!timeoutId) scheduleNextAttempt();
      } else {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
    { threshold: 0.4 }
  );

  if (heroSection) visibilityObserver.observe(heroSection);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearTimeout(timeoutId);
      timeoutId = null;
    } else if (heroSection && heroSection.getBoundingClientRect().top < window.innerHeight) {
      scheduleNextAttempt();
    }
  });

  // Footer – only visible after scrolling down
  const onScroll = () => {
    const pastHero = window.scrollY > window.innerHeight * 0.75;
    footer?.classList.toggle("visible", pastHero);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // initial check

  // Cleanup
  window.addEventListener("beforeunload", () => {
    clearTimeout(timeoutId);
    visibilityObserver.disconnect();
  });
});