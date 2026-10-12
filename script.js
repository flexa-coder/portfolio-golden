
/* =============================================
   FLEXA TECH LOOP
   Website JavaScript
   =============================================

   Features:
   1. Mobile navigation
   2. Scroll reveal animations
   3. Automatic copyright year
   4. Email and WhatsApp contact links
   5. Lead enquiry form

   ============================================= */


/* 1. WEBSITE CONTACT SETTINGS
   ---------------------------------------------
   Add your real contact details here.
*/

const SITE_CONFIG = {
  email: "YOUR_EMAIL@example.com",

  // India: 91 followed by your 10-digit number.
  // Use digits only, without +, spaces, or hyphens.
  whatsapp: "91XXXXXXXXXX",

  // Phone number displayed on your website.
  phoneDisplay: "+91 XXXXX XXXXX"
};


/* 2. MOBILE NAVIGATION
   --------------------------------------------- */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");

  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  if (!navLinks) return;

  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );

  document.body.classList.toggle("menu-open", isOpen);
});

// Close the mobile menu when a navigation link is clicked.
navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Close the menu when switching back to desktop layout.
window.addEventListener("resize", () => {
  if (window.innerWidth > 780) {
    closeMenu();
  }
});


/* 3. SCROLL REVEAL ANIMATIONS
   --------------------------------------------- */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

} else {
  // Ensure content remains visible in older browsers.
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}


/* 4. AUTOMATIC COPYRIGHT YEAR
   --------------------------------------------- */

const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* 5. EMAIL AND WHATSAPP CONTACT LINKS
   --------------------------------------------- */

// Validate the configured email address.
const normalizedEmail = SITE_CONFIG.email.trim();

const emailIsConfigured =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) &&
  !normalizedEmail.includes("YOUR_EMAIL");

// Remove anything except digits from the WhatsApp number.
const normalizedWhatsApp =
  SITE_CONFIG.whatsapp.replace(/\D/g, "");

const whatsappIsConfigured =
  /^\d{10,15}$/.test(normalizedWhatsApp) &&
  !SITE_CONFIG.whatsapp.includes("X");

// Update email links across the website.
const emailLinks =
  document.querySelectorAll("[data-email-link]");

emailLinks.forEach((link) => {
  if (emailIsConfigured) {
    link.href = `mailto:${normalizedEmail}`;
    link.textContent = normalizedEmail;
  } else {
    link.href = "#contact";
    link.textContent = "Add your email in script.js";
  }
});

// Update phone / WhatsApp links across the website.
const phoneLinks =
  document.querySelectorAll("[data-phone-link]");

phoneLinks.forEach((link) => {
  if (whatsappIsConfigured) {
    link.href = `https://wa.me/${normalizedWhatsApp}`;

    link.target = "_blank";
    link.rel = "noopener noreferrer";

    link.textContent = SITE_CONFIG.phoneDisplay;
  } else {
    link.href = "#contact";
    link.removeAttribute("target");

    link.textContent =
      "Add your WhatsApp number in script.js";
  }
});


/* 6. LEAD ENQUIRY FORM
   --------------------------------------------- */

// This form prepares an email or WhatsApp message.
// It does not automatically save data to a database.

const leadForm = document.querySelector("#leadForm");
const formStatus = document.querySelector("#formStatus");

leadForm?.addEventListener("submit", (event) => {
  // Stop the browser from reloading the page.
  event.preventDefault();

  // Check all required form fields.
  if (!leadForm.reportValidity()) {
    return;
  }

  // Read the form information.
  const data = new FormData(leadForm);

  const getValue = (key, fallback = "Not provided") => {
    const value = data.get(key)?.toString().trim();

    return value || fallback;
  };

  const name = getValue("name", "");
  const business = getValue("business");
  const phone = getValue("phone", "");
  const service = getValue("service", "Not selected");
  const message = getValue("message");

  // Prepare the enquiry message.
  const subject =
    `Flexa Tech Loop enquiry from ${name}`;

  const body = [
    "NEW ENQUIRY - FLEXA TECH LOOP",
    "",
    `Name: ${name}`,
    `Business: ${business}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Goal: ${message}`
  ].join("\n");


  // OPTION A: Open the visitor's email application.
  if (emailIsConfigured) {
    const mailto =
      `mailto:${normalizedEmail}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    if (formStatus) {
      formStatus.textContent =
        "Opening your email app. Review the enquiry and send it.";
    }

    window.location.href = mailto;

    return;
  }


  // OPTION B: Open WhatsApp with the enquiry prepared.
  if (whatsappIsConfigured) {
    const whatsappMessage = encodeURIComponent(
      `${subject}\n\n${body}`
    );

    const whatsappUrl =
      `https://wa.me/${normalizedWhatsApp}` +
      `?text=${whatsappMessage}`;

    if (formStatus) {
      formStatus.textContent =
        "WhatsApp is opening. Review your message and press Send.";
    }

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    return;
  }


  // OPTION C: Neither contact method is configured.
  if (formStatus) {
    formStatus.textContent =
      "Please add your business email or WhatsApp number " +
      "in the SITE_CONFIG section at the top of script.js.";
  }
});
