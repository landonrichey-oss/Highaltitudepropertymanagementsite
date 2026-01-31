// properties-data.js

window.allProperties = [
    {
        slug: "Rustic-Roots",
        title: "Rustic Roots",
        subtitle: "Mountain Retreat • Sleeps 10 • 3 Bedrooms + Loft • 3 Bathrooms",
        sleeps: 10,
        bedrooms: 3,
        bathrooms: 3,
        maxGuests: 10,
        checkIn: "4:00 PM",
        checkOut: "10:00 AM",
        petFriendly: false, 
        description: [
            "Escape to **Rustic Roots**, a charming mountain getaway perched above Park City with breathtaking views and ultimate tranquility. This inviting 3-bedroom + loft home sleeps 10 comfortably and offers the perfect blend of rustic warmth and modern convenience.",
            "Unwind on two expansive decks with a private hot tub under the stars, gather around the fire pit for s'mores, or challenge friends to arcade games in the loft. Whether you're here for world-class skiing, summer hiking, or simply relaxing in nature, this home delivers the best of mountain living — close to Park City's vibrant dining and shops, yet peacefully secluded.",
        ].join("\n\n"),
        highlights: [
            "Private hot tub with mountain views",
            "Arcade games & loft fun zone",
            "Double decks + fire pit + BBQ",
            "Full kitchen & smart TV",
            "High-speed Wi-Fi & laundry",
            "Tranquil location near Park City"
        ],
        amenities: [
            "Private hot tub",
            "Outdoor fire pit",
            "Gas BBQ grill",
            "Two spacious decks",
            "Game room with arcade machines",
            "Loft with bunk beds & net hangout",
            "Full kitchen with modern appliances",
            "Smart TV with streaming",
            "High-speed Wi-Fi",
            "Washer & dryer",
            "Stone fireplace (seasonal)",
            "Ample parking",
            "Mountain views"
        ],
        rules: [
            "No smoking indoors or on decks",
            "No parties or events — quiet enjoyment only",
            "Check-in: 4:00 PM | Check-out: 10:00 AM",
            "Maximum occupancy: 10 guests (including children)",
            "No pets allowed (please inquire for exceptions)",
            "Quiet hours: 10:00 PM – 8:00 AM",
            "Respect neighbors — no excessive noise",
            "Remove shoes indoors to protect floors",
            "All guests must sign rental agreement"
        ],
        location: "2421 Navajo Road, Summit County, Utah, United States",
        paymentSchedule: "100% due at time of reservation. Final balance automatically charged 30 days prior to arrival.",
        securityDeposit: "$500 refundable security deposit required (held on card, returned within 7 days post-stay if no damages).",
        cancellationPolicy: "50% refund if canceled 14+ days before arrival. No refund for cancellations within 14 days. Travel insurance recommended.",
        featured: true,
        // ── Reviews ───────────────────────────────────────
        overallRating: 4.96,
        reviewCount: 68,
        airbnbUrl: "https://www.airbnb.com/rooms/720956", // Optional – replace with real Airbnb room ID/URL if cross-listed; omit if not needed
        reviews: [
            {
                name: "Emily R.",
                date: "December 2025",
                rating: 5,
                text: "Rustic Roots was the perfect mountain escape! The views from the deck and hot tub are absolutely breathtaking — we spent every evening soaking under the stars. The house was spotless, cozy, and had everything we needed. Highly recommend for anyone wanting peace and proximity to Park City!"
            },
            {
                name: "The Thompson Family",
                date: "November 2025",
                rating: 5,
                text: "Amazing family getaway! The kids were obsessed with the arcade games and loft hangout area — it kept them entertained for hours. Evenings around the fire pit making s'mores were magical. Great location: quiet and private but just a short drive to town. We’ll definitely be back!"
            },
            {
                name: "Michael & Sarah",
                date: "October 2025",
                rating: 5,
                text: "This home exceeded all expectations. Beautiful rustic decor, incredible mountain views, and the private hot tub was the highlight of our trip. Everything was clean, well-stocked, and the hosts were super responsive. Perfect blend of seclusion and convenience — 10/10!"
            }
        ]
    },
    {
        slug: "Bright-Mountain-Retreat",
        title: "Bright Mountain Retreat near Park City + Hot Tub!",
        subtitle: "Sleeps 4 • 2 bedrooms • 1 1/2 baths",
        description:
            "Step into the modern and bright 2BR 1.5BA cabin in the secluded community in the heart of the scenic Summit County. It promises a relaxing retreat surrounded by dreamy aspen trees, just a short drive away from Park City and local restaurants, shops, exciting attractions, and natural landmarks.",
        amenities: ["Hot tub", "Fireplace", "WiFi", "Full kitchen"],
        featured: true,
    },

    {
        slug: "whisperingpinesaboveparkcity",
        title: "Whispering Pines",
        subtitle: "Sleeps 4 • 2 beds • 1 bath",
        description:
            "Escape to this detached 1-bedroom mountain condo, just 20 minutes from Park City. Enjoy your own private heated garage, private entrance, and private hot tub under the stars. Breathe in crisp alpine air, relax among towering trees, and soak in peaceful mountain views after days spent skiing, hiking, or exploring town. A cozy, secluded retreat with all the comforts you need, where wildlife wanders by and the stars feel close enough to touch.",
        amenities: ["Hot tub", "Heated garage parking", "Pool table", "Pinball machine", "Fast WiFi", "Basketball hoop"],
        featured: true,
    },

    {
        slug: "bearnecessitiesparkcity",
        title: "Bear Necessities",
        subtitle: "Sleeps 8 • 4 beds • 2.5 baths",
        description:
            "Park City Mountain views! Bear Necessities Cabin nestled high in the mountains at 8,000 feet boasts breathtaking views of Park City ski runs. Perched amidst the rugged beauty of the alpine landscape, this cozy retreat offers a perfect blend of luxurious comfort and rustic charm.",
        amenities: ["Hot tub", "Fireplace", "Deck w/ Park City Mountain views", "Fire pit + seating", "Pellet grill", "Gourmet kitchen"],
    },

    {
        slug: "sunflowerlodgeparkcity",
        title: "Sunflower Lodge With Hot Tub Above Park City",
        subtitle: "Sleeps 4 • 2 beds • 1 bath",
        description:
            "Take a break and unwind at this peaceful oasis 20 minutes outside of Park City. Winter wonderland, summer tranquility—enjoy all the beauty of the mountains with the convenience of Park City skiing, dining, shopping, and mountain-town amenities. Relax in the hot tub or cuddle up with a movie and fire—where luxury meets wilderness.",
        amenities: ["Hot tub", "Outdoor fire pit", "Outdoor shower", "Hammocks", "Grill", "Beautiful landscape"],
    },

    {
        slug: "wasatachfamilyretreat",
        title: "Wasatch Family Retreat",
        subtitle: "Sleeps 8 • 4 bedrooms • 3.5 baths • 5 beds",
        description:
            "Discover the perfect blend of convenience and adventure at this end-unit townhome in the Wasatch Springs community, just outside Park City, Utah. Designed for guests who want to experience Park City’s four-season lifestyle, this modern retreat puts you minutes from multiple world-class ski resorts, Jordanelle Reservoir’s waterfront fun, and endless hiking and mountain biking trails—all with easy access to Salt Lake City International Airport for smooth travel days.",
        amenities: ["Air conditioning", "Easy access to ski resorts", "Free bus stop nearby", "WiFi", "Garage"],
    },

    {
        slug: "quietsummitretreat",
        title: "The Quiet Summit Retreat Above Park City",
        subtitle: "Sleeps 6 • 3 beds • 1.5 baths",
        description:
            "⚠️ WINTER ACCESS NOTICE (VERY IMPORTANT): This cabin is off the plow route in winter. You cannot drive to the cabin in the wintertime—you will need to snowshoe in.\n\nEscape to the mountains in this cozy 3-bedroom, 1.5-bath cabin perched at 8,000 feet, just minutes from Park City, Utah. Surrounded by towering pines and fresh alpine air, this retreat offers the perfect balance of rustic charm and modern comfort.",
        amenities: ["Hot tub", "Secluded mountain escape", "20 mins to Park City Ski Resort", "WiFi"],
    },

    {
        slug: "timberhavenaboveparkcity",
        title: "Timber Haven With Hot Tub Above Park City",
        subtitle: "Sleeps 15 • 11 beds • 2 baths",
        description:
            "Escape the hustle and bustle of the city and immerse yourself in the serene beauty of the mountains at our spacious rental property, nestled at an elevation of 8,000 feet. This charming retreat is the perfect getaway for multiple families, with ample space and excellent sleeping arrangements to ensure a comfortable stay for all. Located just 15 miles from the renowned Park City Ski Resort, this property is a dream destination for outdoor adventures.",
        amenities: ["Hot tub", "Secluded", "Game table", "Spacious", "Fully stocked", "WiFi"],
    },

    {
        slug: "hilltophideoutaboveparkcity",
        title: "Modern Cabin With Panoramic Views Above Park City",
        subtitle: "Sleeps 11 • 5 beds • 3 baths",
        description:
            "Welcome to Hill Top Hideout—your perfect mountain retreat perched above Park City and nestled between the Wasatch and Uinta mountains. This secluded getaway offers a serene escape from city life, where you and your family can create unforgettable memories surrounded by nature’s beauty.",
        amenities: ["Park City ski run views", "Air conditioning", "Luxury", "Grill", "Open deck", "WiFi"],
    },

    {
        slug: "aspenlogcabin",
        title: "Aspen-Modern Log Cabin W/ Hot Tub Above Park City",
        subtitle: "Sleeps 10 • 8 beds • 3 baths",
        description:
            "Escape to the perfect mountain getaway at this beautiful cabin built in 2018, just 15 miles from Park City Ski Resort. Enjoy stunning mountain views, modern amenities with rustic charm, and unwind in the relaxing hot tub as the seasons change. Whether you’re hitting the slopes or simply recharging in a peaceful setting, this cabin is an ideal home base for a memorable vacation.",
        amenities: ["Hot tub", "Covered parking", "WiFi", "Arcade games", "Expansive deck", "Peaceful getaway"],
    },

    {
        slug: "winterridgeretreat",
        title: "Winter Ridge Retreat Above Park City W/ Hot Tub",
        subtitle: "Sleeps 8 • 5 beds • 3 baths",
        description:
            "Mountain-view escape with a private theater, hot tub, and incredible Park City ski run views. Unwind in the hot tub under the stars, melt into the massage chair, and choose your vibe—cozy nights in the living room or a full-on movie marathon in the private theater room.",
        amenities: ["Hot tub", "Stunning Park City ski run views", "3 decks", "Theater room", "Massage chair", "Secluded"],
    },

    {
        slug: "wasatchgetaway",
        title: "Wasatch Getaway With Hot Tub Near Park City",
        subtitle: "Sleeps 6 • 3 beds • 3 baths",
        description:
            "Nestled in the tranquility of the mountains at 8,000 feet, this charming 3-bed, 3-bath cabin offers an idyllic retreat with breathtaking Wasatch Mountain views. Secluded and peaceful, yet minutes from the ski resort—soak in the hot tub on the expansive deck or watch the kids play on the swing for the perfect blend of relaxation and adventure.",
        amenities: ["Hot tub", "Expansive deck", "Open concept", "Garage parking", "Kid loft", "Amazing views"],
    },

    {
        slug: "reddoorlodgenearparkcity",
        title: "Red Door Cabin Near Park City",
        subtitle: "Sleeps 10 • 9 beds • 2.5 baths",
        description:
            "Perched at an impressive 8,000 feet in Tollgate Canyon, Red Door Mountain Retreat is an unforgettable escape just a short drive from Park City. This newly remodeled cabin blends modern comfort with the raw beauty of the mountains—offering peaceful seclusion, year-round serenity, and stunning wilderness views.",
        amenities: ["Family friendly", "Fully stocked", "Comfortable", "Relaxing getaway"],
    },

    {
        slug: "panoramapinesaboveparkcity",
        title: "Panorama Pines With Hot Tub Above Park City",
        subtitle: "Sleeps 10 • 6 beds • 2 baths",
        description:
            "Welcome to Panorama Pines, your gateway to a tranquil mountain retreat nestled among majestic peaks at 8,000 feet. Escape the bustle of the city and settle into crisp mountain air, cozy comfort, and peaceful seclusion—surrounded by stunning natural beauty while still within easy reach of Park City adventures.",
        amenities: ["Hot tub", "Fire pit", "Fully stocked", "Large deck w/ mountain views", "WiFi", "Spacious"],
    },

    {
        slug: "olliespost",
        title: "Ollies Outpost Above Park City",
        subtitle: "Sleeps 8 • 6 beds • 1.5 baths",
        description:
            "Welcome to Ollie’s Outpost, your mountain escape perched at 8,000 feet in the quiet forested hills just minutes from Park City, Utah. This inviting three-bedroom, one-and-a-half-bath cabin blends rustic charm with modern comfort—perfect for families, couples, or friends looking for a true alpine retreat.",
        amenities: ["Hot tub", "Kids playground", "Deck w/ seating + mountain views", "Fully stocked", "WiFi"],
    },

    {
        slug: "notrereveparkcity",
        title: "Notre Rêve W/ 8-seat Hot tub And A/C By Park City",
        subtitle: "Sleeps 9 • 7 beds • 3 baths",
        description:
            'Nestled at 8,000 feet in the picturesque mountains, Notre Rêve (meaning "our dream") is a charming short-term rental that promises a tranquil escape. The stunning scenery, enveloping peace, and crisp mountain air set the stage for a rejuvenating retreat just minutes from Park City’s world-class ski resort—perfect for outdoor adventures or cozy relaxation.',
        amenities: ["Hot tub (8-seat)", "Family friendly", "Wood fireplace on deck", "Secluded", "Air conditioning", "Spacious"],
    },

    {
        slug: "meanderingmoose",
        title: "Meandering Moose Cabin Above Park City",
        subtitle: "Sleeps 8 • 4 beds • 2.5 baths",
        description:
            "Meandering Moose is a welcoming escape nestled in the serene beauty of the mountains, featuring four spacious bedrooms and two-and-a-half bathrooms—perfect for families or groups. Just a short drive from world-renowned Park City Ski Resort, it’s an ideal base for exploring Park City’s year-round activities, dining, and mountain-town charm.",
        amenities: ["Deck with seating", "WiFi", "Fully stocked", "Spacious", "Cozy", "20 mins from Park City", "Mountain getaway"],
    },

    {
        slug: "cozycabingetawayaboveparkcity",
        title: "Cozy Cabin Getaway Above Park City With Hot Tub",
        subtitle: "Sleeps 10 • 11 beds • 3 baths",
        description:
            "Welcome to your private mountain escape—an inviting modern cabin set on 3 wooded acres of peaceful alpine landscape. With easy access from the bottom of Tollgate Canyon and only 20 minutes from Deer Valley and Park City Mountain Resort, it’s perfect for families, groups, and dog lovers who want luxury comforts with classic cabin charm.",
        amenities: ["Pet friendly", "Hot tub", "Spacious", "Family friendly", "Theater room", "Kids play area", "WiFi"],
    },

    {
        slug: "porcupineloop",
        title: "Spacious Family Haven: Hot Tub - Spectacular Views",
        subtitle: "Sleeps 10 • 6 beds • 2 baths",
        description:
            "Escape to this spacious 4BR, 2BA mountain getaway at 8,000 feet. Soak up the sun on the wraparound deck while taking in spectacular views, fire up the BBQ for an outdoor feast, unwind in the hot tub, and enjoy a high-end interior—then head into Park City for skiing, dining, shopping, and year-round adventure.",
        amenities: ["4 comfortable bedrooms + loft", "Open design living", "Full kitchen", "Hot tub", "Fire pit", "BBQ + outdoor seating", "Smart TVs", "High-speed WiFi", "Office", "Laundry", "Free parking"],
    },

    {
        slug: "moosemountainlodgeaboveparkcity",
        title: "Moose Mountain Lodge Above Park City",
        subtitle: "Sleeps 10 • 7 beds • 2.5 baths",
        description:
            "Welcome to Moose Mountain Lodge, your private escape perched high in the Wasatch Mountains at 8,000 feet. This cozy yet refined mountain cabin blends rustic charm with modern comfort—perfect for both adventure and tranquility. Just minutes from Park City Mountain Resort and Deer Valley, it puts you right in the heart of Utah’s alpine playground.",
        amenities: ["Hot tub", "Cozy", "Secluded", "Mountain cabin", "Family friendly", "Fully stocked"],
    },

    {
        slug: "nativeretreat",
        title: "Native Retreat Cabin Mins To Park City w/ hot tub!",
        subtitle: "Sleeps 9 • 6 beds • 2 baths",
        description:
            "Escape to the Native Retreat: a peaceful, relaxing cabin nestled in the majestic Tollgate Canyon mountains with breathtaking views. Soak in the new hot tub after a day of adventure, and take in the scenery from the deck by the fire pit. Just 11 miles from Park City and Deer Valley, it’s an ideal four-season basecamp for skiing, snowboarding, hiking, and more.",
        amenities: ["Hot tub", "Native American decor", "Deck with fire pit", "Pool table", "Mountain retreat", "Family friendly", "Fully stocked"],
    },

    {
        slug: "willowwayparkcity",
        title: "The Den | Luxurious Escape above Park City | Views",
        subtitle: "Sleeps 8 • 4 beds • 2.5 baths",
        description:
            "Bring your family to the gorgeous 3BR 2.5BA cabin in a secluded mountain community just a short drive from Park City. Explore nearby natural landmarks and attractions, then come home to relax in this amenity-packed retreat with open living space, multiple outdoor areas, and everything you need for a comfortable stay.",
        amenities: ["Luxury retreat", "Multiple decks", "Spacious", "Fully stocked", "WiFi"],
    },

    {
        slug: "tollgatetower",
        title: "Scenic Stay w/ Hot Tub by Park City",
        subtitle: "Sleeps 8 • 4 beds • 3.5 baths",
        description:
            "Welcome to Tollgate Tower—our stunning mountain retreat nestled in a scenic location that feels worlds away, yet only 15 minutes from Park City. Take in breathtaking views, soak in the hot tub, and enjoy the tranquility of nature at 8,000 feet with fresh mountain air and natural cooling through open windows.",
        amenities: ["Hot tub", "Wraparound deck", "Grill", "WiFi", "Spacious", "Open concept", "Ski run views", "Unique"],
    },

    {
        slug: "wasatchadventurecabin",
        title: "Wasatch Adventure Cabin W/ Hot Tub Above Park City",
        subtitle: "Sleeps 8 • 7 beds • 4.5 baths",
        description:
            "Mountain Log Cabin Retreat—just 20 minutes from Park City. Enjoy a true mountain escape at 8,000 ft with crisp alpine air, star-filled skies, and sweeping views. Secluded yet convenient, you’re a quick drive to world-class skiing, dining, shopping, and nightlife.",
        amenities: ["Hot tub", "Expansive deck", "Mountain views", "3 master suites", "Family friendly", "Air conditioning", "Spacious", "Log cabin"],
    },

    {
        slug: "tollgatehavenparkcity",
        title: "Tollgate Haven by Park City w/ 3 Master Bed Suites",
        subtitle: "Sleeps 12 • 7 beds • 4.5 baths",
        description:
            "Nestled in the breathtaking beauty of Tollgate Canyon near Park City, this cabin sits at 8,000 ft with amazing mountain views. Wake up to moose and elk wandering by, then after a day of adventure, unwind in the hot tub (and steam room) for the ultimate cozy retreat—just a short drive to Park City’s world-class skiing.",
        amenities: ["Hot tub", "In-ground fireplace", "Dry bar (basement)", "Relaxing deck", "Mountain views", "Fully stocked", "WiFi", "Arcade game"],
    },

    {
        slug: "themoosemanorlodge",
        title: "The Moose Manor Lodge With Hot Tub Above Park City",
        subtitle: "Sleeps 9 • 6 beds • 2.5 baths",
        description:
            "Perched at 8,000 feet on 2 acres in lower Tollgate Canyon, Moose Manor offers a true mountain escape with quick, easy year-round access. Just minutes from the highway and downtown Park City—yet it feels a world away—this meticulously moose-themed cabin sleeps up to 9 in 3 bedrooms and 2.5 baths, and you may even spot a family of moose nearby.",
        amenities: ["Hot tub", "Wrap-around deck", "Pellet grill / smoker", "Propane grill", "Putt-putt course", "Outdoor ping pong", "Outdoor seating + fire pit", "Pool table", "Arcade games", "WiFi", "Fully stocked"],
    },

    {
        slug: "iroquoisloopaboveparkcity",
        title: "Iroquois Loop With Hot Tub Above Park City",
        subtitle: "Sleeps 6 • 6 beds • 2 baths",
        description:
            "Welcome to Iroquois Loop, a charming cabin retreat above Park City where rustic meets modern. This cozy 2BR/2BA home keeps classic mountain-cabin curb appeal while offering a beautifully updated interior for comfort and style. Tucked away for peace and privacy, it’s still just a short drive to Kimball Junction for dining, shopping, and easy access to Park City adventures.",
        amenities: ["Hot tub", "Rustic", "Fully stocked", "WiFi", "Mountain retreat"],
    },

    {
        slug: "littlehideawayaboveparkcity",
        title: "Little Hideaway: Cozy Family Haven Above Park City",
        subtitle: "Sleeps 6 • 3 beds • 2 baths",
        description:
            "Experience the best of Summit County from this charming 1BR/2BA cabin—peacefully tucked away in a scenic, secluded setting, yet just a short drive to Park City. Spend your days skiing, dining, and exploring nearby attractions, then come home to unwind with cozy comforts, big views, and the kind of quiet where elk herds often wander through.",
        amenities: ["Arcade games", "Secluded", "Amazing views", "Frequent elk herd", "Cozy", "Fully stocked", "WiFi"],
    },

    {
        slug: "80acreprivatemountainresort",
        title: "80 Acre Private Mountain Resort In Park City",
        subtitle: "Sleeps 11 • 7 beds • 4.5 baths",
        description:
            "Nestled on an 80-acre mountain property, this one-of-a-kind retreat offers incredible views, a gated private driveway, and total seclusion. Unwind in the hot tub or indoor steam shower after exploring nearby biking, hiking, snowmobiling, and snowshoe trails. With frequent wildlife sightings, a spring-fed pond, and a heated garage, this unforgettable cabin blends luxury comfort with true mountain adventure.",
        amenities: ["Hot tub", "80-acre private retreat", "Spring-fed pond", "Heated garage parking", "Luxury inside & out", "Massive kitchen", "Fully stocked", "WiFi", "Cozy", "One of a kind"],
    },

    {
        slug: "parkcitycondominsfromslope",
        title: "Canyons Condo Mins From Canyons Lift",
        subtitle: "Sleeps 4 • 3 beds • 1 bath",
        description:
            "Welcome to your ultimate mountain getaway — a stylish condo at the base of Canyons Resort in Park City. With quick access to the gondola and lifts connecting to the full Park City Mountain network, you’ll be on the slopes within minutes. Perfect for winter ski days or summer hiking, biking, and alpine fun, this condo keeps you right in the center of it all.",
        amenities: ["Hot tub", "Heated pool (year-round)", "Ski concierge service", "Arcade room", "Pool tables", "Steam room", "Walk to ski run", "Amazing location"],
    },

    {
        slug: "elkhavenaboveparkcity",
        title: "Elk Haven Above Park City",
        subtitle: "Sleeps 10 • 6 beds • 2.5 baths",
        description:
            "Nestled at a breathtaking altitude of 8,000 feet, this enchanting cabin offers an unforgettable mountain escape. With five spacious bedrooms and 2.5 bathrooms, it’s ideal for family gatherings or friend getaways. Inside, rustic charm blends with modern comforts to create a warm, inviting retreat after your Park City adventures.",
        amenities: ["Large deck", "Family friendly", "Spacious", "Log cabin", "Mountain views", "WiFi"],
    },
];