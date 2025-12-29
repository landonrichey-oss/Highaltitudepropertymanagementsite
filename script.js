// script.js - Vanilla JavaScript for Landon's Stays site

document.addEventListener('DOMContentLoaded', () => {
    // Update copyright year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.getElementById('site-nav');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            siteNav.classList.toggle('open'); // You'll need to add .open styles in CSS for mobile nav
        });
    }

    // Back to top smooth scroll
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Property data - EDIT THIS ARRAY with your actual properties
    const properties = [
        {
            title: "Tollgate Canyon Retreat",
            subtitle: "Sleeps 12 • 4 bedrooms • 3 baths",
            description: "Spacious mountain cabin with stunning views, private hot tub, and game room.",
            image: "assets/images/ParkCity.webp",
            amenities: ["Hot tub", "Fireplace", "Game room", "WiFi", "Full kitchen", "Pet-friendly"],
            links: [
                { text: "Book on Airbnb", url: "https://www.airbnb.com/rooms/EXAMPLE1" },
                { text: "Book on VRBO", url: "https://www.vrbo.com/EXAMPLE1" }
            ]
        },
        {
            title: "Park City Cozy Condo",
            subtitle: "Sleeps 8 • 3 bedrooms • 2 baths",
            description: "Modern condo minutes from Main Street and resorts. Perfect for ski trips.",
            image: "https://a0.muscache.com/pictures/hosting/Hosting-11335924/original/6a535be0-416e-4523-9d0b-37a06105d749.jpeg",
            amenities: ["Hot tub (community)", "Fireplace", "WiFi", "Underground parking", "Full kitchen"],
            links: [
                { text: "Book on Airbnb", url: "https://www.airbnb.com/rooms/EXAMPLE2" }
            ]
        },
        // Add more as needed...
    ];

    // Render property grid
    const propertyGrid = document.getElementById('property-grid');
    if (propertyGrid && properties.length > 0) {
        properties.forEach((prop, index) => {
            const card = document.createElement('article');
            card.className = 'property-card';
            card.innerHTML = `
        <img src="${prop.image}" alt="${prop.title}" loading="lazy" />
        <div class="property-body">
          <h3>${prop.title}</h3>
          <p class="muted">${prop.subtitle}</p>
          <p>${prop.description}</p>
          <button class="btn btn-small" data-property="${index}">View Details</button>
        </div>
      `;
            propertyGrid.appendChild(card);
        });
    } else if (propertyGrid) {
        propertyGrid.innerHTML = '<p class="muted">No properties listed yet. Add them in script.js!</p>';
    }

    // Property modal
    const modal = document.getElementById('property-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalDesc = document.getElementById('modal-description');
    const modalAmenities = document.getElementById('modal-amenities');
    const modalActions = document.getElementById('modal-actions');

    function openPropertyModal(index) {
        const prop = properties[index];
        if (!prop) return;

        modalImg.src = prop.image;
        modalImg.alt = prop.title;
        modalTitle.textContent = prop.title;
        modalSubtitle.textContent = prop.subtitle;
        modalDesc.textContent = prop.description;

        // Amenities
        modalAmenities.innerHTML = prop.amenities.map(a => `<span class="pill">${a}</span>`).join('');

        // Booking links
        modalActions.innerHTML = prop.links.map(link =>
            `<a href="${link.url}" target="_blank" rel="noopener" class="btn">${link.text}</a>`
        ).join('');

        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal-close').focus();
    }

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Event delegation for property buttons
    propertyGrid?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-property]');
        if (btn) openPropertyModal(btn.dataset.property);
    });

    // Modal close handlers
    modal?.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-close')) closeModal();
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });

    // Gallery lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    document.getElementById('gallery-grid')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.gallery-item');
        if (btn) {
            const imgSrc = btn.dataset.img;
            const imgAlt = btn.querySelector('img').alt;
            openLightbox(imgSrc, imgAlt);
        }
    });

    lightbox?.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-lightbox-close')) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox();
    });

    // Contact form (basic client-side example - replace with Formspree or similar)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = 'Sending...';
            formStatus.className = 'form-status';

            // Example: Replace with your Formspree (or other) endpoint
            // const response = await fetch('https://formspree.io/f/your-endpoint', {
            //   method: 'POST',
            //   body: new FormData(contactForm),
            //   headers: { 'Accept': 'application/json' }
            // });

            // Simulate success (remove in production)
            setTimeout(() => {
                formStatus.textContent = 'Message sent! We\'ll reply soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            }, 800);

            // Real implementation:
            // if (response.ok) { ... success ... } else { ... error ... }
        });
    }
});