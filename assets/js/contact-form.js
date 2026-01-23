document.addEventListener("DOMContentLoaded", () => {
  const form       = document.getElementById("contact-form");
  const statusEl   = document.getElementById("form-status");

  if (!form || !statusEl) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    statusEl.textContent = "Sending message...";
    statusEl.className   = "form-status";

    // Placeholder – replace with real fetch() to Formspree, EmailJS, etc.
    setTimeout(() => {
      statusEl.textContent = "Message sent! We'll get back to you soon.";
      statusEl.className   = "form-status success";
      form.reset();
    }, 1200);
  });
});