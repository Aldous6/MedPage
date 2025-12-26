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
let currentLang = (localStorage.getItem("lang") || document.documentElement.lang || "es").toLowerCase()
currentLang = currentLang === "en" ? "en" : "es"

// Cinematic language transition (luxury veil)
let isLangSwitching = false

function _parseTimeToMs(value, fallbackMs) {
  const v = String(value || "").trim()
  if (!v) return fallbackMs
  const n = Number.parseFloat(v)
  if (!Number.isFinite(n)) return fallbackMs
  return v.includes("ms") ? n : n * 1000
}

function applyLanguage(lang) {
  currentLang = lang === "en" ? "en" : "es"
  localStorage.setItem("lang", currentLang)

  // Button label shows the *other* language
  langToggle.textContent = currentLang === "es" ? "EN" : "ES"

  // Update all translatable elements
  document.querySelectorAll("[data-es][data-en]").forEach((el) => {
    el.textContent = el.getAttribute(`data-${currentLang}`)
  })

  // Update translatable placeholders
  document.querySelectorAll("[data-es-placeholder][data-en-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", el.getAttribute(`data-${currentLang}-placeholder`))
  })

  // Update HTML lang attribute
  document.documentElement.lang = currentLang
}

function switchLanguageCinematic(nextLang) {
  if (isLangSwitching) return
  isLangSwitching = true
  langToggle.disabled = true

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduceMotion) {
    applyLanguage(nextLang)
    langToggle.disabled = false
    isLangSwitching = false
    return
  }

  const rootStyle = getComputedStyle(document.documentElement)
  const inMs = _parseTimeToMs(rootStyle.getPropertyValue("--lang-in"), 360)
  const outMs = _parseTimeToMs(rootStyle.getPropertyValue("--lang-out"), 520)
  const holdMs = 90

  // 1) Fade veil in
  document.body.classList.add("lang-switching")

  // 2) Swap content while veil is covering (near peak opacity)
  window.setTimeout(() => {
    applyLanguage(nextLang)
  }, Math.round(inMs * 0.72))

  // 3) Fade veil out
  window.setTimeout(() => {
    document.body.classList.remove("lang-switching")
  }, Math.round(inMs + holdMs))

  // 4) Cleanup
  window.setTimeout(() => {
    langToggle.disabled = false
    isLangSwitching = false
  }, Math.round(inMs + holdMs + outMs + 40))
}
// Initialize language on load (supports saved preference)
applyLanguage(currentLang)

langToggle.addEventListener("click", () => {
  const nextLang = currentLang === "es" ? "en" : "es"
  switchLanguageCinematic(nextLang)
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
