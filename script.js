// script.js - High Altitude Property Management site
// ✅ Properties page: horizontal selector + deep links (?property=slug)
// ✅ Share link button (copies URL)
// ✅ Availability button (opens your booking calendar link)
// ✅ Modal slider: swipe, arrows, dots, X close, share icon
// ✅ Cover ALWAYS slug-1.jpg and NEVER gets replaced by fallback
// ✅ Missing images fallback
// ✅ Booking links auto-fix https://
// ✅ Landing page Gallery thumbnails link to properties.html?property=slug

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

  // ✅ Image folder base (relative paths work on Netlify)
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

  // ✅ Used when an <img> errors — falls back cleanly
  function setImgFallback(imgEl) {
    if (!imgEl) return;
    imgEl.addEventListener("error", () => {
      imgEl.src = FALLBACK_IMG;
    });
  }

  // ✅ Share URL always goes to properties.html
  function getShareUrlForSlug(slug) {
    const u = new URL("properties.html", window.location.href);
    u.searchParams.set("property", slug);
    return u.toString();
  }

  async function copyShareLink(slug) {
    const shareUrl = getShareUrlForSlug(slug);

    // Native share (mobile)
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
      prompt("Copy this link:", shareUrl);
    }
  }

  function getPrimaryBookingLink(prop) {
    const links = Array.isArray(prop?.links) ? prop.links : [];
    const direct = links.find((l) => l?.style === "primary" && l?.url);
    if (direct) return ensureHttps(direct.url);

    const first = links.find((l) => l?.url);
    return first ? ensureHttps(first.url) : "";
  }

  // =============================
  // ✅ AUTO-DETECT IMAGES (NO COUNTING)
  // ✅ Uses Image() probe (MORE RELIABLE than fetch HEAD)
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

      // Bust cache a bit so probing stays accurate
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
  // ✅ PROPERTY DATA (ALL PROPERTIES)
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
      amenities: ["Hot tub", "Fireplace", "Game room", "WiFi", "Full kitchen", "Double decks"],
      links: [
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/720956/reservation?currency=USD&adults=1", style: "primary" },
        { text: "Book on Airbnb", url: "https://www.airbnb.com/h/rusticrootsretreatparkcity" },
        { text: "Book on VRBO", url: "https://www.vrbo.com/EXAMPLE1" },
      ],
    },

    {
      slug: "Bright-Mountain-Retreat",
      title: "Bright Mountain Retreat near Park City + Hot Tub!",
      subtitle: "Sleeps 4 • 2 bedrooms • 1 1/2 baths",
      description:
        "Step into the modern and bright 2BR 1.5BA cabin in the secluded community in the heart of the scenic Summit County. It promises a relaxing retreat surrounded by dreamy aspen trees, just a short drive away from Park City and local restaurants, shops, exciting attractions, and natural landmarks.",
      amenities: ["Hot tub", "Fireplace", "WiFi", "Full kitchen"],
      links: [
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/609125/reservation?currency=USD&adults=1", style: "primary" },
        { text: "Book on Airbnb", url: "airbnb.com/h/aspengrovecabinaboveparkcity" },
        { text: "Book on VRBO", url: "https://www.vrbo.com/EXAMPLE1" },
      ],
    },

    {
      slug: "whisperingpinesaboveparkcity",
      title: "Whispering Pines",
      subtitle: "Sleeps 4 • 2 beds • 1 bath",
      description:
        "Escape to this detached 1-bedroom mountain condo, just 20 minutes from Park City. Enjoy your own private heated garage, private entrance, and private hot tub under the stars. Breathe in crisp alpine air, relax among towering trees, and soak in peaceful mountain views after days spent skiing, hiking, or exploring town. A cozy, secluded retreat with all the comforts you need, where wildlife wanders by and the stars feel close enough to touch.",
      amenities: ["Hot tub", "Heated garage parking", "Pool table", "Pinball machine", "Fast WiFi", "Basketball hoop"],
      links: [
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/720955/reservation?currency=USD&adults=1", style: "primary" },
        { text: "Book on Airbnb", url: "airbnb.com/h/whisperingpinesaboveparkcity" },
      ],
    },

    {
      slug: "bearnecessitiesparkcity",
      title: "Bear Necessities",
      subtitle: "Sleeps 8 • 4 beds • 2.5 baths",
      description:
        "Park City Mountain views! Bear Necessities Cabin nestled high in the mountains at 8,000 feet boasts breathtaking views of Park City ski runs. Perched amidst the rugged beauty of the alpine landscape, this cozy retreat offers a perfect blend of luxurious comfort and rustic charm.",
      amenities: ["Hot tub", "Fireplace", "Deck w/ Park City Mountain views", "Fire pit + seating", "Pellet grill", "Gourmet kitchen"],
      links: [
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/609126/reservation?currency=USD&adults=1", style: "primary" },
        { text: "Book on Airbnb", url: "airbnb.com/h/bearnecessitiesparkcity" },
      ],
    },

    {
      slug: "sunflowerlodgeparkcity",
      title: "Sunflower Lodge With Hot Tub Above Park City",
      subtitle: "Sleeps 4 • 2 beds • 1 bath",
      description:
        "Take a break and unwind at this peaceful oasis 20 minutes outside of Park City. Winter wonderland, summer tranquility—enjoy all the beauty of the mountains with the convenience of Park City skiing, dining, shopping, and mountain-town amenities. Relax in the hot tub or cuddle up with a movie and fire—where luxury meets wilderness.",
      amenities: ["Hot tub", "Outdoor fire pit", "Outdoor shower", "Hammocks", "Grill", "Beautiful landscape"],
      links: [
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/568064/reservation?currency=USD&adults=1", style: "primary" },
        { text: "Book on Airbnb", url: "airbnb.com/h/sunflowerlodgeparkcity" },
      ],
    },

    {
      slug: "wasatachfamilyretreat",
      title: "Wasatch Family Retreat",
      subtitle: "Sleeps 8 • 4 bedrooms • 3.5 baths • 5 beds",
      description:
        "Discover the perfect blend of convenience and adventure at this end-unit townhome in the Wasatch Springs community, just outside Park City, Utah. Designed for guests who want to experience Park City’s four-season lifestyle, this modern retreat puts you minutes from multiple world-class ski resorts, Jordanelle Reservoir’s waterfront fun, and endless hiking and mountain biking trails—all with easy access to Salt Lake City International Airport for smooth travel days.",
      amenities: ["Air conditioning", "Easy access to ski resorts", "Free bus stop nearby", "WiFi", "Garage"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/wasatachfamilyretreat" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/742776/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "quietsummitretreat",
      title: "The Quiet Summit Retreat Above Park City",
      subtitle: "Sleeps 6 • 3 beds • 1.5 baths",
      description:
        "⚠️ WINTER ACCESS NOTICE (VERY IMPORTANT): This cabin is off the plow route in winter. You cannot drive to the cabin in the wintertime—you will need to snowshoe in.\n\nEscape to the mountains in this cozy 3-bedroom, 1.5-bath cabin perched at 8,000 feet, just minutes from Park City, Utah. Surrounded by towering pines and fresh alpine air, this retreat offers the perfect balance of rustic charm and modern comfort.",
      amenities: ["Hot tub", "Secluded mountain escape", "20 mins to Park City Ski Resort", "WiFi"],
      links: [{ text: "Book on Airbnb", url: "airbnb.com/h/quietsummitretreat" }],
    },

    {
      slug: "timberhavenaboveparkcity",
      title: "Timber Haven With Hot Tub Above Park City",
      subtitle: "Sleeps 15 • 11 beds • 2 baths",
      description:
        "Escape the hustle and bustle of the city and immerse yourself in the serene beauty of the mountains at our spacious rental property, nestled at an elevation of 8,000 feet. This charming retreat is the perfect getaway for multiple families, with ample space and excellent sleeping arrangements to ensure a comfortable stay for all. Located just 15 miles from the renowned Park City Ski Resort, this property is a dream destination for outdoor adventures.",
      amenities: ["Hot tub", "Secluded", "Game table", "Spacious", "Fully stocked", "WiFi"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/timberhavenaboveparkcity" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/612193/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "hilltophideoutaboveparkcity",
      title: "Modern Cabin With Panoramic Views Above Park City",
      subtitle: "Sleeps 11 • 5 beds • 3 baths",
      description:
        "Welcome to Hill Top Hideout—your perfect mountain retreat perched above Park City and nestled between the Wasatch and Uinta mountains. This secluded getaway offers a serene escape from city life, where you and your family can create unforgettable memories surrounded by nature’s beauty.",
      amenities: ["Park City ski run views", "Air conditioning", "Luxury", "Grill", "Open deck", "WiFi"],
      links: [{ text: "Book on Airbnb", url: "airbnb.com/h/hilltophideoutaboveparkcity" }],
    },

    {
      slug: "aspenlogcabin",
      title: "Aspen-Modern Log Cabin W/ Hot Tub Above Park City",
      subtitle: "Sleeps 10 • 8 beds • 3 baths",
      description:
        "Escape to the perfect mountain getaway at this beautiful cabin built in 2018, just 15 miles from Park City Ski Resort. Enjoy stunning mountain views, modern amenities with rustic charm, and unwind in the relaxing hot tub as the seasons change. Whether you’re hitting the slopes or simply recharging in a peaceful setting, this cabin is an ideal home base for a memorable vacation.",
      amenities: ["Hot tub", "Covered parking", "WiFi", "Arcade games", "Expansive deck", "Peaceful getaway"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/aspenlogcabin" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/501596/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "winterridgeretreat",
      title: "Winter Ridge Retreat Above Park City W/ Hot Tub",
      subtitle: "Sleeps 8 • 5 beds • 3 baths",
      description:
        "Mountain-view escape with a private theater, hot tub, and incredible Park City ski run views. Unwind in the hot tub under the stars, melt into the massage chair, and choose your vibe—cozy nights in the living room or a full-on movie marathon in the private theater room.",
      amenities: ["Hot tub", "Stunning Park City ski run views", "3 decks", "Theater room", "Massage chair", "Secluded"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/winterridgeretreat" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/748550/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "wasatchgetaway",
      title: "Wasatch Getaway With Hot Tub Near Park City",
      subtitle: "Sleeps 6 • 3 beds • 3 baths",
      description:
        "Nestled in the tranquility of the mountains at 8,000 feet, this charming 3-bed, 3-bath cabin offers an idyllic retreat with breathtaking Wasatch Mountain views. Secluded and peaceful, yet minutes from the ski resort—soak in the hot tub on the expansive deck or watch the kids play on the swing for the perfect blend of relaxation and adventure.",
      amenities: ["Hot tub", "Expansive deck", "Open concept", "Garage parking", "Kid loft", "Amazing views"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/wasatchgetaway" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/560589/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "reddoorlodgenearparkcity",
      title: "Red Door Cabin Near Park City",
      subtitle: "Sleeps 10 • 9 beds • 2.5 baths",
      description:
        "Perched at an impressive 8,000 feet in Tollgate Canyon, Red Door Mountain Retreat is an unforgettable escape just a short drive from Park City. This newly remodeled cabin blends modern comfort with the raw beauty of the mountains—offering peaceful seclusion, year-round serenity, and stunning wilderness views.",
      amenities: ["Family friendly", "Fully stocked", "Comfortable", "Relaxing getaway"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/reddoorlodgenearparkcity" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/609969/reservation?currency=USD&adults=1", style: "primary" },
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

    {
      slug: "olliespost",
      title: "Ollies Outpost Above Park City",
      subtitle: "Sleeps 8 • 6 beds • 1.5 baths",
      description:
        "Welcome to Ollie’s Outpost, your mountain escape perched at 8,000 feet in the quiet forested hills just minutes from Park City, Utah. This inviting three-bedroom, one-and-a-half-bath cabin blends rustic charm with modern comfort—perfect for families, couples, or friends looking for a true alpine retreat.",
      amenities: ["Hot tub", "Kids playground", "Deck w/ seating + mountain views", "Fully stocked", "WiFi"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/olliespost" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/729439/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "notrereveparkcity",
      title: "Notre Rêve W/ 8-seat Hot tub And A/C By Park City",
      subtitle: "Sleeps 9 • 7 beds • 3 baths",
      description:
        'Nestled at 8,000 feet in the picturesque mountains, Notre Rêve (meaning "our dream") is a charming short-term rental that promises a tranquil escape. The stunning scenery, enveloping peace, and crisp mountain air set the stage for a rejuvenating retreat just minutes from Park City’s world-class ski resort—perfect for outdoor adventures or cozy relaxation.',
      amenities: ["Hot tub (8-seat)", "Family friendly", "Wood fireplace on deck", "Secluded", "Air conditioning", "Spacious"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/notrereveparkcity" },
        { text: "Book Direct Lowest Price", url: "https://summitcountydirectrentals.com/en/notre-reve-near-park-city-utah", style: "primary" },
      ],
    },

    {
      slug: "meanderingmoose",
      title: "Meandering Moose Cabin Above Park City",
      subtitle: "Sleeps 8 • 4 beds • 2.5 baths",
      description:
        "Meandering Moose is a welcoming escape nestled in the serene beauty of the mountains, featuring four spacious bedrooms and two-and-a-half bathrooms—perfect for families or groups. Just a short drive from world-renowned Park City Ski Resort, it’s an ideal base for exploring Park City’s year-round activities, dining, and mountain-town charm.",
      amenities: ["Deck with seating", "WiFi", "Fully stocked", "Spacious", "Cozy", "20 mins from Park City", "Mountain getaway"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/meanderingmoose" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/720957/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "cozycabingetawayaboveparkcity",
      title: "Cozy Cabin Getaway Above Park City With Hot Tub",
      subtitle: "Sleeps 10 • 11 beds • 3 baths",
      description:
        "Welcome to your private mountain escape—an inviting modern cabin set on 3 wooded acres of peaceful alpine landscape. With easy access from the bottom of Tollgate Canyon and only 20 minutes from Deer Valley and Park City Mountain Resort, it’s perfect for families, groups, and dog lovers who want luxury comforts with classic cabin charm.",
      amenities: ["Pet friendly", "Hot tub", "Spacious", "Family friendly", "Theater room", "Kids play area", "WiFi"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/cozycabingetawayaboveparkcity" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/743531/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "porcupineloop",
      title: "Spacious Family Haven: Hot Tub - Spectacular Views",
      subtitle: "Sleeps 10 • 6 beds • 2 baths",
      description:
        "Escape to this spacious 4BR, 2BA mountain getaway at 8,000 feet. Soak up the sun on the wraparound deck while taking in spectacular views, fire up the BBQ for an outdoor feast, unwind in the hot tub, and enjoy a high-end interior—then head into Park City for skiing, dining, shopping, and year-round adventure.",
      amenities: ["4 comfortable bedrooms + loft", "Open design living", "Full kitchen", "Hot tub", "Fire pit", "BBQ + outdoor seating", "Smart TVs", "High-speed WiFi", "Office", "Laundry", "Free parking"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/porcupineloop" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/625686/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "moosemountainlodgeaboveparkcity",
      title: "Moose Mountain Lodge Above Park City",
      subtitle: "Sleeps 10 • 7 beds • 2.5 baths",
      description:
        "Welcome to Moose Mountain Lodge, your private escape perched high in the Wasatch Mountains at 8,000 feet. This cozy yet refined mountain cabin blends rustic charm with modern comfort—perfect for both adventure and tranquility. Just minutes from Park City Mountain Resort and Deer Valley, it puts you right in the heart of Utah’s alpine playground.",
      amenities: ["Hot tub", "Cozy", "Secluded", "Mountain cabin", "Family friendly", "Fully stocked"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/moosemountainlodgeaboveparkcity" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/729437/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "nativeretreat",
      title: "Native Retreat Cabin Mins To Park City w/ hot tub!",
      subtitle: "Sleeps 9 • 6 beds • 2 baths",
      description:
        "Escape to the Native Retreat: a peaceful, relaxing cabin nestled in the majestic Tollgate Canyon mountains with breathtaking views. Soak in the new hot tub after a day of adventure, and take in the scenery from the deck by the fire pit. Just 11 miles from Park City and Deer Valley, it’s an ideal four-season basecamp for skiing, snowboarding, hiking, and more.",
      amenities: ["Hot tub", "Native American decor", "Deck with fire pit", "Pool table", "Mountain retreat", "Family friendly", "Fully stocked"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/nativeretreat" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/729437/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "willowwayparkcity",
      title: "The Den | Luxurious Escape above Park City | Views",
      subtitle: "Sleeps 8 • 4 beds • 2.5 baths",
      description:
        "Bring your family to the gorgeous 3BR 2.5BA cabin in a secluded mountain community just a short drive from Park City. Explore nearby natural landmarks and attractions, then come home to relax in this amenity-packed retreat with open living space, multiple outdoor areas, and everything you need for a comfortable stay.",
      amenities: ["Luxury retreat", "Multiple decks", "Spacious", "Fully stocked", "WiFi"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/willowwayparkcity" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/720954/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "tollgatetower",
      title: "Scenic Stay w/ Hot Tub by Park City",
      subtitle: "Sleeps 8 • 4 beds • 3.5 baths",
      description:
        "Welcome to Tollgate Tower—our stunning mountain retreat nestled in a scenic location that feels worlds away, yet only 15 minutes from Park City. Take in breathtaking views, soak in the hot tub, and enjoy the tranquility of nature at 8,000 feet with fresh mountain air and natural cooling through open windows.",
      amenities: ["Hot tub", "Wraparound deck", "Grill", "WiFi", "Spacious", "Open concept", "Ski run views", "Unique"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/tollgatetower" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/493461/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "wasatchadventurecabin",
      title: "Wasatch Adventure Cabin W/ Hot Tub Above Park City",
      subtitle: "Sleeps 8 • 7 beds • 4.5 baths",
      description:
        "Mountain Log Cabin Retreat—just 20 minutes from Park City. Enjoy a true mountain escape at 8,000 ft with crisp alpine air, star-filled skies, and sweeping views. Secluded yet convenient, you’re a quick drive to world-class skiing, dining, shopping, and nightlife.",
      amenities: ["Hot tub", "Expansive deck", "Mountain views", "3 master suites", "Family friendly", "Air conditioning", "Spacious", "Log cabin"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/wasatachadventurecabin" },
        { text: "Book Direct Lowest Price", url: "https://summitcountydirectrentals.com/en/wasatch-adventure-cabin-w-hot-tub-above-park-city", style: "primary" },
      ],
    },

    {
      slug: "tollgatehavenparkcity",
      title: "Tollgate Haven by Park City w/ 3 Master Bed Suites",
      subtitle: "Sleeps 12 • 7 beds • 4.5 baths",
      description:
        "Nestled in the breathtaking beauty of Tollgate Canyon near Park City, this cabin sits at 8,000 ft with amazing mountain views. Wake up to moose and elk wandering by, then after a day of adventure, unwind in the hot tub (and steam room) for the ultimate cozy retreat—just a short drive to Park City’s world-class skiing.",
      amenities: ["Hot tub", "In-ground fireplace", "Dry bar (basement)", "Relaxing deck", "Mountain views", "Fully stocked", "WiFi", "Arcade game"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/tollgatehavenparkcity" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/560588/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "themoosemanorlodge",
      title: "The Moose Manor Lodge With Hot Tub Above Park City",
      subtitle: "Sleeps 9 • 6 beds • 2.5 baths",
      description:
        "Perched at 8,000 feet on 2 acres in lower Tollgate Canyon, Moose Manor offers a true mountain escape with quick, easy year-round access. Just minutes from the highway and downtown Park City—yet it feels a world away—this meticulously moose-themed cabin sleeps up to 9 in 3 bedrooms and 2.5 baths, and you may even spot a family of moose nearby.",
      amenities: ["Hot tub", "Wrap-around deck", "Pellet grill / smoker", "Propane grill", "Putt-putt course", "Outdoor ping pong", "Outdoor seating + fire pit", "Pool table", "Arcade games", "WiFi", "Fully stocked"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/themoosemanorlodge" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/539990/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "iroquoisloopaboveparkcity",
      title: "Iroquois Loop With Hot Tub Above Park City",
      subtitle: "Sleeps 6 • 6 beds • 2 baths",
      description:
        "Welcome to Iroquois Loop, a charming cabin retreat above Park City where rustic meets modern. This cozy 2BR/2BA home keeps classic mountain-cabin curb appeal while offering a beautifully updated interior for comfort and style. Tucked away for peace and privacy, it’s still just a short drive to Kimball Junction for dining, shopping, and easy access to Park City adventures.",
      amenities: ["Hot tub", "Rustic", "Fully stocked", "WiFi", "Mountain retreat"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/iroquoisloopaboveparkcity" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/669102/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "littlehideawayaboveparkcity",
      title: "Little Hideaway: Cozy Family Haven Above Park City",
      subtitle: "Sleeps 6 • 3 beds • 2 baths",
      description:
        "Experience the best of Summit County from this charming 1BR/2BA cabin—peacefully tucked away in a scenic, secluded setting, yet just a short drive to Park City. Spend your days skiing, dining, and exploring nearby attractions, then come home to unwind with cozy comforts, big views, and the kind of quiet where elk herds often wander through.",
      amenities: ["Arcade games", "Secluded", "Amazing views", "Frequent elk herd", "Cozy", "Fully stocked", "WiFi"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/littlehideawayaboveparkcity" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/743532/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "80acreprivatemountainresort",
      title: "80 Acre Private Mountain Resort In Park City",
      subtitle: "Sleeps 11 • 7 beds • 4.5 baths",
      description:
        "Nestled on an 80-acre mountain property, this one-of-a-kind retreat offers incredible views, a gated private driveway, and total seclusion. Unwind in the hot tub or indoor steam shower after exploring nearby biking, hiking, snowmobiling, and snowshoe trails. With frequent wildlife sightings, a spring-fed pond, and a heated garage, this unforgettable cabin blends luxury comfort with true mountain adventure.",
      amenities: ["Hot tub", "80-acre private retreat", "Spring-fed pond", "Heated garage parking", "Luxury inside & out", "Massive kitchen", "Fully stocked", "WiFi", "Cozy", "One of a kind"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/80acreprivatemountainresort" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/494366/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "parkcitycondominsfromslope",
      title: "Canyons Condo Mins From Canyons Lift",
      subtitle: "Sleeps 4 • 3 beds • 1 bath",
      description:
        "Welcome to your ultimate mountain getaway — a stylish condo at the base of Canyons Resort in Park City. With quick access to the gondola and lifts connecting to the full Park City Mountain network, you’ll be on the slopes within minutes. Perfect for winter ski days or summer hiking, biking, and alpine fun, this condo keeps you right in the center of it all.",
      amenities: ["Hot tub", "Heated pool (year-round)", "Ski concierge service", "Arcade room", "Pool tables", "Steam room", "Walk to ski run", "Amazing location"],
      links: [
        { text: "Book on Airbnb", url: "airbnb.com/h/parkcitycondominsfromslope" },
        { text: "Book Direct Lowest Price", url: "https://checkout.lodgify.com/summitcountyrentals/729438/reservation?currency=USD&adults=1", style: "primary" },
      ],
    },

    {
      slug: "elkhavenaboveparkcity",
      title: "Elk Haven Above Park City",
      subtitle: "Sleeps 10 • 6 beds • 2.5 baths",
      description:
        "Nestled at a breathtaking altitude of 8,000 feet, this enchanting cabin offers an unforgettable mountain escape. With five spacious bedrooms and 2.5 bathrooms, it’s ideal for family gatherings or friend getaways. Inside, rustic charm blends with modern comforts to create a warm, inviting retreat after your Park City adventures.",
      amenities: ["Large deck", "Family friendly", "Spacious", "Log cabin", "Mountain views", "WiFi"],
      links: [{ text: "Book on Airbnb", url: "airbnb.com/h/elkhavenaboveparkcity" }],
    },
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

    setImgFallback(detailEl.querySelector("img"));

    document.getElementById("sharePropertyBtn")?.addEventListener("click", () => {
      copyShareLink(prop.slug);
    });

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

    // ✅ Auto load from URL param (case-insensitive support)
    const params = new URLSearchParams(window.location.search);
    const slugRaw = params.get("property");
    const slug = slugRaw ? String(slugRaw).trim() : "";

    const prop =
      properties.find((p) => p.slug === slug) ||
      properties.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) ||
      properties[0];

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
  // ✅ Landing Page Gallery
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

    // ✅ SWIPE (Pointer events + Touch fallback)
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

  // ✅ close + share inside modal
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




