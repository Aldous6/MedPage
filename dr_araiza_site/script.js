// Theme Toggle
const themeToggle = document.getElementById("themeToggle")
const html = document.documentElement

// Check for saved theme preference or default to light
const savedTheme = localStorage.getItem("theme") || "light"
html.setAttribute("data-theme", savedTheme)

themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme")
  const newTheme = currentTheme === "light" ? "dark" : "light"
  html.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
})

// Language Toggle
const langToggle = document.getElementById("langToggle")
let currentLang = "es"


// Initialize placeholders for default language
document.querySelectorAll("[data-es-placeholder][data-en-placeholder]").forEach((el) => {
  el.setAttribute("placeholder", el.getAttribute(`data-${currentLang}-placeholder`))
})

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "es" ? "en" : "es"
  langToggle.textContent = currentLang === "es" ? "EN" : "ES"

  // Update all translatable elements
  document.querySelectorAll("[data-es][data-en]").forEach((el) => {
    el.textContent = el.getAttribute(`data-${currentLang}`)
  })


  // Update translatable placeholders (optional)
  document.querySelectorAll("[data-es-placeholder][data-en-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", el.getAttribute(`data-${currentLang}-placeholder`))
  })

  // Update HTML lang attribute
  document.documentElement.lang = currentLang
})

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle")
const nav = document.getElementById("nav")

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active")
  nav.classList.toggle("mobile-open")
})

// Close mobile menu when clicking a link
nav.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active")
    nav.classList.remove("mobile-open")
  })
})

// FAQ Accordion
const faqItems = document.querySelectorAll(".faq-item")

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question")

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active")

    // Close all FAQ items
    faqItems.forEach((faq) => faq.classList.remove("active"))

    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add("active")
    }
  })
})

// Fade-in Animation on Scroll
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el)
})

// Header scroll effect
const header = document.getElementById("header")

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})

// Set current year in footer
document.getElementById("currentYear").textContent = new Date().getFullYear()



// Contact form (demo): prevents reload and shows a small message
const contactForm = document.getElementById("contactForm")
if (contactForm) {
  const contactNote = document.getElementById("contactFormNote")
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const required = contactForm.querySelectorAll("[required]")
    let ok = true
    required.forEach((el) => {
      if (!String(el.value || "").trim()) ok = false
    })

    if (!ok) {
      if (contactNote) {
        contactNote.textContent = currentLang === "es"
          ? "Por favor completa los campos obligatorios."
          : "Please fill in all required fields."
      }
      return
    }

    if (contactNote) {
      contactNote.textContent = currentLang === "es"
        ? "¡Listo! Tu solicitud fue registrada (demo). Podemos conectarlo a Formspree/EmailJS/tu backend."
        : "Done! Your request was captured (demo). We can connect it to Formspree/EmailJS/your backend."
    }

    contactForm.reset()

    // restore placeholders according to current language after reset
    document.querySelectorAll("[data-es-placeholder][data-en-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", el.getAttribute(`data-${currentLang}-placeholder`))
    })
  })

  contactForm.addEventListener("reset", () => {
    if (contactNote) {
      contactNote.textContent = contactNote.getAttribute(`data-${currentLang}`) || contactNote.textContent
    }
  })
}
