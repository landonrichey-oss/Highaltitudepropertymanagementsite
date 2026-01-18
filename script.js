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
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/720956/reservation?currency=USD&adults=1",
      style: "primary"
    },
    { text: "Book on Airbnb", url: "https://www.airbnb.com/h/rusticrootsretreatparkcity" },
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
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/609125/reservation?currency=USD&adults=1",
      style: "primary",
    },
    { text: "Book on Airbnb", url: "airbnb.com/h/aspengrovecabinaboveparkcity" },
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
        {
          text: "Book Direct Lowest Price",
          url: "https://checkout.lodgify.com/summitcountyrentals/720955/reservation?currency=USD&adults=1",
          style: "primary",
        },
        { text: "Book on Airbnb", url: "airbnb.com/h/whisperingpinesaboveparkcity" },
      ],
    },
    // Bear Necessities (slug-based images: assets/images/bearnecessitiesparkcity-1.jpg, -2.jpg, -3.jpg ...)
{
  slug: "bearnecessitiesparkcity",
  title: "Bear Necessities",
  subtitle: "Sleeps 8 • 4 beds • 2.5 baths",
  description:
    "Park City Mountain views! Bear Necessities Cabin nestled high in the mountains at 8,000 feet boasts breathtaking views of Park City ski runs. Perched amidst the rugged beauty of the alpine landscape, this cozy retreat offers a perfect blend of luxurious comfort and rustic charm.",
  images: imagesFromSlug("bearnecessitiesparkcity", 20), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Fireplace",
    "Deck w/ Park City Mountain views",
    "Fire pit + seating",
    "Pellet grill",
    "Gourmet kitchen"
  ],
  links: [
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/609126/reservation?currency=USD&adults=1",
      style: "primary"
    },
    { text: "Book on Airbnb", url: "airbnb.com/h/bearnecessitiesparkcity" }
  ]
},
// Sunflower Lodge (slug-based images: assets/images/sunflowerlodgeparkcity-1.jpg, -2.jpg, -3.jpg ...)
{
  slug: "sunflowerlodgeparkcity",
  title: "Sunflower Lodge With Hot Tub Above Park City",
  subtitle: "Sleeps 4 • 2 beds • 1 bath",
  description:
    "Take a break and unwind at this peaceful oasis 20 minutes outside of Park City. Winter wonderland, summer tranquility—enjoy all the beauty of the mountains with the convenience of Park City skiing, dining, shopping, and mountain-town amenities. Relax in the hot tub or cuddle up with a movie and fire—where luxury meets wilderness.",
  images: imagesFromSlug("sunflowerlodgeparkcity", 51), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Outdoor fire pit",
    "Outdoor shower",
    "Hammocks",
    "Grill",
    "Beautiful landscape"
  ],
  links: [
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/568064/reservation?currency=USD&adults=1",
      style: "primary"
    },
    { text: "Book on Airbnb", url: "airbnb.com/h/sunflowerlodgeparkcity" }
  ]
},
{
  slug: "wasatachfamilyretreat",
  title: "Wasatch Family Retreat",
  subtitle: "Sleeps 8 • 4 bedrooms • 3.5 baths • 5 beds",
  description:
    "Discover the perfect blend of convenience and adventure at this end-unit townhome in the Wasatch Springs community, just outside Park City, Utah. Designed for guests who want to experience Park City’s four-season lifestyle, this modern retreat puts you minutes from multiple world-class ski resorts, Jordanelle Reservoir’s waterfront fun, and endless hiking and mountain biking trails—all with easy access to Salt Lake City International Airport for smooth travel days.",
  images: imagesFromSlug("wasatachfamilyretreat", 20),
  amenities: [
    "Air conditioning",
    "Easy access to ski resorts",
    "Free bus stop nearby",
    "WiFi",
    "Garage"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/wasatachfamilyretreat" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/742776/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "quietsummitretreat",
  title: "The Quiet Summit Retreat Above Park City",
  subtitle: "Sleeps 6 • 3 beds • 1.5 baths",
  description:
    "⚠️ WINTER ACCESS NOTICE (VERY IMPORTANT): This cabin is off the plow route in winter. You cannot drive to the cabin in the wintertime—you will need to snowshoe in.\n\nEscape to the mountains in this cozy 3-bedroom, 1.5-bath cabin perched at 8,000 feet, just minutes from Park City, Utah. Surrounded by towering pines and fresh alpine air, this retreat offers the perfect balance of rustic charm and modern comfort.",
  images: imagesFromSlug("quietsummitretreat", 3), // change 3 to how many photos you add
  amenities: [
    "Hot tub",
    "Secluded mountain escape",
    "20 mins to Park City Ski Resort",
    "WiFi"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/quietsummitretreat" }
  ]
},
{
  slug: "timberhavenaboveparkcity",
  title: "Timber Haven With Hot Tub Above Park City",
  subtitle: "Sleeps 15 • 11 beds • 2 baths",
  description:
    "Escape the hustle and bustle of the city and immerse yourself in the serene beauty of the mountains at our spacious rental property, nestled at an elevation of 8,000 feet. This charming retreat is the perfect getaway for multiple families, with ample space and excellent sleeping arrangements to ensure a comfortable stay for all. Located just 15 miles from the renowned Park City Ski Resort, this property is a dream destination for outdoor adventures.",
  images: imagesFromSlug("timberhavenaboveparkcity", 29), // change 3 to how many photos you add
  amenities: [
    "Hot tub",
    "Secluded",
    "Game table",
    "Spacious",
    "Fully stocked",
    "WiFi"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/timberhavenaboveparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/612193/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "hilltophideoutaboveparkcity",
  title: "Modern Cabin With Panoramic Views Above Park City",
  subtitle: "Sleeps 11 • 5 beds • 3 baths",
  description:
    "Welcome to Hill Top Hideout—your perfect mountain retreat perched above Park City and nestled between the Wasatch and Uinta mountains. This secluded getaway offers a serene escape from city life, where you and your family can create unforgettable memories surrounded by nature’s beauty.",
  images: imagesFromSlug("hilltophideoutaboveparkcity", 34), // change 3 to how many photos you add
  amenities: [
    "Park City ski run views",
    "Air conditioning",
    "Luxury",
    "Grill",
    "Open deck",
    "WiFi"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/hilltophideoutaboveparkcity" }
  ]
},
{
  slug: "aspenlogcabin",
  title: "Aspen-Modern Log Cabin W/ Hot Tub Above Park City",
  subtitle: "Sleeps 10 • 8 beds • 3 baths",
  description:
    "Escape to the perfect mountain getaway at this beautiful cabin built in 2018, just 15 miles from Park City Ski Resort. Enjoy stunning mountain views, modern amenities with rustic charm, and unwind in the relaxing hot tub as the seasons change. Whether you’re hitting the slopes or simply recharging in a peaceful setting, this cabin is an ideal home base for a memorable vacation.",
  images: imagesFromSlug("aspenlogcabin", 3), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Covered parking",
    "WiFi",
    "Arcade games",
    "Expansive deck",
    "Peaceful getaway"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/aspenlogcabin" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/501596/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "winterridgeretreat",
  title: "Winter Ridge Retreat Above Park City W/ Hot Tub",
  subtitle: "Sleeps 8 • 5 beds • 3 baths",
  description:
    "Mountain-view escape with a private theater, hot tub, and incredible Park City ski run views. Unwind in the hot tub under the stars, melt into the massage chair, and choose your vibe—cozy nights in the living room or a full-on movie marathon in the private theater room.",
  images: imagesFromSlug("winterridgeretreat", 38), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Stunning Park City ski run views",
    "3 decks",
    "Private master bedroom deck",
    "Mud room",
    "Theater room",
    "Massage chair",
    "Secluded"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/winterridgeretreat" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/748550/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "wasatchgetaway",
  title: "Wasatch Getaway With Hot Tub Near Park City",
  subtitle: "Sleeps 6 • 3 beds • 3 baths",
  description:
    "Nestled in the tranquility of the mountains at 8,000 feet, this charming 3-bed, 3-bath cabin offers an idyllic retreat with breathtaking Wasatch Mountain views. Secluded and peaceful, yet minutes from the ski resort—soak in the hot tub on the expansive deck or watch the kids play on the swing for the perfect blend of relaxation and adventure.",
  images: imagesFromSlug("wasatchgetaway", 46), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Expansive deck",
    "Open concept",
    "Garage parking",
    "Kid loft",
    "Amazing views"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/wasatchgetaway" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/560589/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "reddoorlodgenearparkcity",
  title: "Red Door Cabin Near Park City",
  subtitle: "Sleeps 10 • 9 beds • 2.5 baths",
  description:
    "Perched at an impressive 8,000 feet in Tollgate Canyon, Red Door Mountain Retreat is an unforgettable escape just a short drive from Park City. This newly remodeled cabin blends modern comfort with the raw beauty of the mountains—offering peaceful seclusion, year-round serenity, and stunning wilderness views.",
  images: imagesFromSlug("reddoorlodgenearparkcity", 3), // change 3 to however many photos you add
  amenities: [
    "Family friendly",
    "Fully stocked",
    "Comfortable",
    "Relaxing getaway"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/reddoorlodgenearparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/609969/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "panoramapinesaboveparkcity",
  title: "Panorama Pines With Hot Tub Above Park City",
  subtitle: "Sleeps 10 • 6 beds • 2 baths",
  description:
    "Welcome to Panorama Pines, your gateway to a tranquil mountain retreat nestled among majestic peaks at 8,000 feet. Escape the bustle of the city and settle into crisp mountain air, cozy comfort, and peaceful seclusion—surrounded by stunning natural beauty while still within easy reach of Park City adventures.",
  images: imagesFromSlug("panoramapinesaboveparkcity", 40), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Fire pit",
    "Fully stocked",
    "Large deck w/ mountain views",
    "WiFi",
    "Spacious",
    "Comfortable"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/panoramapinesaboveparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/625687/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "olliespost",
  title: "Ollies Outpost Above Park City",
  subtitle: "Sleeps 8 • 6 beds • 1.5 baths",
  description:
    "Welcome to Ollie’s Outpost, your mountain escape perched at 8,000 feet in the quiet forested hills just minutes from Park City, Utah. This inviting three-bedroom, one-and-a-half-bath cabin blends rustic charm with modern comfort—perfect for families, couples, or friends looking for a true alpine retreat.",
  images: imagesFromSlug("olliespost", 40), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Kids playground",
    "Deck w/ seating + mountain views",
    "Fully stocked",
    "WiFi"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/olliespost" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/729439/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "notrereveparkcity",
  title: "Notre Rêve W/ 8-seat Hot tub And A/C By Park City",
  subtitle: "Sleeps 9 • 7 beds • 3 baths",
  description:
    'Nestled at 8,000 feet in the picturesque mountains, Notre Rêve (meaning "our dream") is a charming short-term rental that promises a tranquil escape. The stunning scenery, enveloping peace, and crisp mountain air set the stage for a rejuvenating retreat just minutes from Park City’s world-class ski resort—perfect for outdoor adventures or cozy relaxation.',
  images: imagesFromSlug("notrereveparkcity", 32), // change 3 to however many photos you add
  amenities: [
    "Hot tub (8-seat)",
    "Family friendly",
    "Wood fireplace on deck",
    "Secluded",
    "Air conditioning",
    "Spacious"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/notrereveparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://summitcountydirectrentals.com/en/notre-reve-near-park-city-utah",
      style: "primary"
    }
  ]
},
{
  slug: "meanderingmoose",
  title: "Meandering Moose Cabin Above Park City",
  subtitle: "Sleeps 8 • 4 beds • 2.5 baths",
  description:
    "Meandering Moose is a welcoming escape nestled in the serene beauty of the mountains, featuring four spacious bedrooms and two-and-a-half bathrooms—perfect for families or groups. Just a short drive from world-renowned Park City Ski Resort, it’s an ideal base for exploring Park City’s year-round activities, dining, and mountain-town charm.",
  images: imagesFromSlug("meanderingmoose", 39), // change 3 to however many photos you add
  amenities: [
    "Deck with seating",
    "WiFi",
    "Fully stocked",
    "Spacious",
    "Cozy",
    "20 mins from Park City",
    "Mountain getaway"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/meanderingmoose" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/720957/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "cozycabingetawayaboveparkcity",
  title: "Cozy Cabin Getaway Above Park City With Hot Tub",
  subtitle: "Sleeps 10 • 11 beds • 3 baths",
  description:
    "Welcome to your private mountain escape—an inviting modern cabin set on 3 wooded acres of peaceful alpine landscape. With easy access from the bottom of Tollgate Canyon and only 20 minutes from Deer Valley and Park City Mountain Resort, it’s perfect for families, groups, and dog lovers who want luxury comforts with classic cabin charm.",
  images: imagesFromSlug("cozycabingetawayaboveparkcity", 44), // change 3 to however many photos you add
  amenities: [
    "Pet friendly",
    "Hot tub",
    "Spacious",
    "Family friendly",
    "Theater room",
    "Kids play area",
    "WiFi"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/cozycabingetawayaboveparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/743531/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "porcupineloop",
  title: "Spacious Family Haven: Hot Tub - Spectacular Views",
  subtitle: "Sleeps 10 • 6 beds • 2 baths",
  description:
    "Escape to this spacious 4BR, 2BA mountain getaway at 8,000 feet. Soak up the sun on the wraparound deck while taking in spectacular views, fire up the BBQ for an outdoor feast, unwind in the hot tub, and enjoy a high-end interior—then head into Park City for skiing, dining, shopping, and year-round adventure.",
  images: imagesFromSlug("porcupineloop", 48), // change 3 to however many photos you add
  amenities: [
    "4 comfortable bedrooms + loft",
    "Open design living",
    "Full kitchen",
    "Hot tub",
    "Fire pit",
    "BBQ + outdoor seating",
    "Smart TVs",
    "High-speed WiFi",
    "Office",
    "Laundry",
    "Free parking"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/porcupineloop" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/625686/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "moosemountainlodgeaboveparkcity",
  title: "Moose Mountain Lodge Above Park City",
  subtitle: "Sleeps 10 • 7 beds • 2.5 baths",
  description:
    "Welcome to Moose Mountain Lodge, your private escape perched high in the Wasatch Mountains at 8,000 feet. This cozy yet refined mountain cabin blends rustic charm with modern comfort—perfect for both adventure and tranquility. Just minutes from Park City Mountain Resort and Deer Valley, it puts you right in the heart of Utah’s alpine playground.",
  images: imagesFromSlug("moosemountainlodgeaboveparkcity", 38), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Cozy",
    "Secluded",
    "Mountain cabin",
    "Family friendly",
    "Fully stocked"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/moosemountainlodgeaboveparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/729437/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "nativeretreat",
  title: "Native Retreat Cabin Mins To Park City w/ hot tub!",
  subtitle: "Sleeps 9 • 6 beds • 2 baths",
  description:
    "Escape to the Native Retreat: a peaceful, relaxing cabin nestled in the majestic Tollgate Canyon mountains with breathtaking views. Soak in the new hot tub after a day of adventure, and take in the scenery from the deck by the fire pit. Just 11 miles from Park City and Deer Valley, it’s an ideal four-season basecamp for skiing, snowboarding, hiking, and more.",
  images: imagesFromSlug("nativeretreat", 44), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Native American decor",
    "Deck with fire pit",
    "Pool table",
    "Mountain retreat",
    "Family friendly",
    "Fully stocked"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/nativeretreat" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/729437/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "willowwayparkcity",
  title: "The Den | Luxurious Escape above Park City | Views",
  subtitle: "Sleeps 8 • 4 beds • 2.5 baths",
  description:
    "Bring your family to the gorgeous 3BR 2.5BA cabin in a secluded mountain community just a short drive from Park City. Explore nearby natural landmarks and attractions, then come home to relax in this amenity-packed retreat with open living space, multiple outdoor areas, and everything you need for a comfortable stay.",
  images: imagesFromSlug("willowwayparkcity", 37), // change 3 to however many photos you add
  amenities: [
    "Luxury retreat",
    "Multiple decks",
    "Spacious",
    "Fully stocked",
    "WiFi"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/willowwayparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/720954/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "tollgatetower",
  title: "Scenic Stay w/ Hot Tub by Park City",
  subtitle: "Sleeps 8 • 4 beds • 3.5 baths",
  description:
    "Welcome to Tollgate Tower—our stunning mountain retreat nestled in a scenic location that feels worlds away, yet only 15 minutes from Park City. Take in breathtaking views, soak in the hot tub, and enjoy the tranquility of nature at 8,000 feet with fresh mountain air and natural cooling through open windows.",
  images: imagesFromSlug("tollgatetower", 3), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Wraparound deck",
    "Grill",
    "WiFi",
    "Spacious",
    "Open concept",
    "Ski run views",
    "Unique"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/tollgatetower" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/493461/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "wasatchadventurecabin",
  title: "Wasatch Adventure Cabin W/ Hot Tub Above Park City",
  subtitle: "Sleeps 8 • 7 beds • 4.5 baths",
  description:
    "Mountain Log Cabin Retreat—just 20 minutes from Park City. Enjoy a true mountain escape at 8,000 ft with crisp alpine air, star-filled skies, and sweeping views. Secluded yet convenient, you’re a quick drive to world-class skiing, dining, shopping, and nightlife.",
  images: imagesFromSlug("wasatchadventurecabin", 47), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Expansive deck",
    "Mountain views",
    "3 master suites",
    "Family friendly",
    "Air conditioning",
    "Spacious",
    "Log cabin"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/wasatachadventurecabin" },
    {
      text: "Book Direct Lowest Price",
      url: "https://summitcountydirectrentals.com/en/wasatch-adventure-cabin-w-hot-tub-above-park-city",
      style: "primary"
    }
  ]
},
{
  slug: "tollgatehavenparkcity",
  title: "Tollgate Haven by Park City w/ 3 Master Bed Suites",
  subtitle: "Sleeps 12 • 7 beds • 4.5 baths",
  description:
    "Nestled in the breathtaking beauty of Tollgate Canyon near Park City, this cabin sits at 8,000 ft with amazing mountain views. Wake up to moose and elk wandering by, then after a day of adventure, unwind in the hot tub (and steam room) for the ultimate cozy retreat—just a short drive to Park City’s world-class skiing.",
  images: imagesFromSlug("tollgatehavenparkcity", 41), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "In-ground fireplace",
    "Dry bar (basement)",
    "Relaxing deck",
    "Mountain views",
    "Fully stocked",
    "WiFi",
    "Arcade game"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/tollgatehavenparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/560588/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "themoosemanorlodge",
  title: "The Moose Manor Lodge With Hot Tub Above Park City",
  subtitle: "Sleeps 9 • 6 beds • 2.5 baths",
  description:
    "Perched at 8,000 feet on 2 acres in lower Tollgate Canyon, Moose Manor offers a true mountain escape with quick, easy year-round access. Just minutes from the highway and downtown Park City—yet it feels a world away—this meticulously moose-themed cabin sleeps up to 9 in 3 bedrooms and 2.5 baths, and you may even spot a family of moose nearby.",
  images: imagesFromSlug("themoosemanorlodge", 44), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Wrap-around deck",
    "Pellet grill / smoker",
    "Propane grill",
    "Putt-putt course",
    "Outdoor ping pong",
    "Outdoor seating + fire pit",
    "Pool table",
    "Arcade games",
    "WiFi",
    "Fully stocked"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/themoosemanorlodge" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/539990/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "iroquoisloopaboveparkcity",
  title: "Iroquois Loop With Hot Tub Above Park City",
  subtitle: "Sleeps 6 • 6 beds • 2 baths",
  description:
    "Welcome to Iroquois Loop, a charming cabin retreat above Park City where rustic meets modern. This cozy 2BR/2BA home keeps classic mountain-cabin curb appeal while offering a beautifully updated interior for comfort and style. Tucked away for peace and privacy, it’s still just a short drive to Kimball Junction for dining, shopping, and easy access to Park City adventures.",
  images: imagesFromSlug("iroquoisloopaboveparkcity", 3), // change 3 to however many photos you add
  amenities: ["Hot tub", "Rustic", "Fully stocked", "WiFi", "Mountain retreat"],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/iroquoisloopaboveparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/669102/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "littlehideawayaboveparkcity",
  title: "Little Hideaway: Cozy Family Haven Above Park City",
  subtitle: "Sleeps 6 • 3 beds • 2 baths",
  description:
    "Experience the best of Summit County from this charming 1BR/2BA cabin—peacefully tucked away in a scenic, secluded setting, yet just a short drive to Park City. Spend your days skiing, dining, and exploring nearby attractions, then come home to unwind with cozy comforts, big views, and the kind of quiet where elk herds often wander through.",
  images: imagesFromSlug("littlehideawayaboveparkcity", 3), // change 3 to however many photos you add
  amenities: [
    "Arcade games",
    "Secluded",
    "Amazing views",
    "Frequent elk herd",
    "Cozy",
    "Fully stocked",
    "WiFi"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/littlehideawayaboveparkcity" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/743532/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "80acreprivatemountainresort",
  title: "80 Acre Private Mountain Resort In Park City",
  subtitle: "Sleeps 11 • 7 beds • 4.5 baths",
  description:
    "Nestled on an 80-acre mountain property, this one-of-a-kind retreat offers incredible views, a gated private driveway, and total seclusion. Unwind in the hot tub or indoor steam shower after exploring nearby biking, hiking, snowmobiling, and snowshoe trails. With frequent wildlife sightings, a spring-fed pond, and a heated garage, this unforgettable cabin blends luxury comfort with true mountain adventure.",
  images: imagesFromSlug("80acreprivatemountainresort", 3), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "80-acre private retreat",
    "Spring-fed pond",
    "Heated garage parking",
    "Luxury inside & out",
    "Massive kitchen",
    "Fully stocked",
    "WiFi",
    "Cozy",
    "One of a kind"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/80acreprivatemountainresort" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/494366/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "parkcitycondominsfromslope",
  title: "Canyons Condo Mins From Canyons Lift",
  subtitle: "Sleeps 4 • 3 beds • 1 bath",
  description:
    "Welcome to your ultimate mountain getaway — a stylish condo at the base of Canyons Resort in Park City. With quick access to the gondola and lifts connecting to the full Park City Mountain network, you’ll be on the slopes within minutes. Perfect for winter ski days or summer hiking, biking, and alpine fun, this condo keeps you right in the center of it all.",
  images: imagesFromSlug("parkcitycondominsfromslope", 3), // change 3 to however many photos you add
  amenities: [
    "Hot tub",
    "Heated pool (year-round)",
    "Ski concierge service",
    "Arcade room",
    "Pool tables",
    "Steam room",
    "Walk to ski run",
    "Amazing location"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/parkcitycondominsfromslope" },
    {
      text: "Book Direct Lowest Price",
      url: "https://checkout.lodgify.com/summitcountyrentals/729438/reservation?currency=USD&adults=1",
      style: "primary"
    }
  ]
},
{
  slug: "elkhavenaboveparkcity",
  title: "Elk Haven Above Park City",
  subtitle: "Sleeps 10 • 6 beds • 2.5 baths",
  description:
    "Nestled at a breathtaking altitude of 8,000 feet, this enchanting cabin offers an unforgettable mountain escape. With five spacious bedrooms and 2.5 bathrooms, it’s ideal for family gatherings or friend getaways. Inside, rustic charm blends with modern comforts to create a warm, inviting retreat after your Park City adventures.",
  images: imagesFromSlug("elkhavenaboveparkcity", 3), // change 3 to however many photos you add
  amenities: [
    "Large deck",
    "Family friendly",
    "Spacious",
    "Log cabin",
    "Mountain views",
    "WiFi"
  ],
  links: [
    { text: "Book on Airbnb", url: "airbnb.com/h/elkhavenaboveparkcity" }
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


