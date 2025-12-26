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

/* =============================
   Smooth anchor scroll (with header offset)
   ============================= */
;(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  function getHeaderOffset() {
    const headerEl = document.getElementById("header")
    if (!headerEl) return 0
    const rect = headerEl.getBoundingClientRect()
    return Math.ceil(rect.height)
  }

  function smoothScrollTo(hash) {
    const target = document.querySelector(hash)
    if (!target) return
    const extra = (hash === "#about") ? 100 : 0
    const y = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 12 + extra
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" })
  }

  document.addEventListener("click", (e) => {
    const a = e.target?.closest?.('a[href^="#"]')
    if (!a) return
    const href = a.getAttribute("href")
    if (!href || href === "#") return
    const target = document.querySelector(href)
    if (!target) return
    e.preventDefault()
    history.pushState(null, "", href)
    smoothScrollTo(href)
  })
})()

/* =============================
   Hero photo -> About photo (scroll-linked)
   ============================= */
;(() => {
  const heroImg = document.getElementById("heroPhoto")
  const aboutImg = document.getElementById("aboutPhoto")
  if (!heroImg || !aboutImg) return

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduceMotion) return

  const float = document.createElement("img")
  float.className = "photo-float"
  float.alt = heroImg.alt || ""
  float.src = heroImg.currentSrc || heroImg.src
  float.decoding = "async"
  float.loading = "eager"
  float.hidden = true
  document.body.appendChild(float)

  let raf = 0
  let active = false

  function rectDoc(el) {
    const r = el.getBoundingClientRect()
    return {
      left: r.left + window.scrollX,
      top: r.top + window.scrollY,
      width: r.width,
      height: r.height,
    }
  }

  function clamp01(x) {
    return Math.max(0, Math.min(1, x))
  }

  function onFrame() {
    raf = 0

    const heroSection = document.getElementById("hero")
    const aboutSection = document.getElementById("about")
    if (!heroSection || !aboutSection) return

    // Scroll range for transition (finish earlier so it settles while you still read)
    const start = heroSection.offsetTop + heroSection.offsetHeight * 0.10
    const end = aboutSection.offsetTop + 7


    const p = clamp01((window.scrollY - start) / Math.max(1, end - start))

    if (p <= 0) {
      float.hidden = true
      heroImg.style.opacity = ""
      aboutImg.style.opacity = "0"
      active = false
      return
    }

    if (p >= 1) {
      float.hidden = true
      heroImg.style.opacity = "0"
      aboutImg.style.opacity = ""
      active = false
      return
    }

    if (!active) {
      active = true
      heroImg.style.opacity = "0"
      aboutImg.style.opacity = "0"
      float.hidden = false
    }

    const a = rectDoc(heroImg)
    const b = rectDoc(aboutImg)

    const lerp = (x, y, t) => x + (y - x) * t

    const left = lerp(a.left, b.left, p)
    const top = lerp(a.top, b.top, p)
    const width = lerp(a.width, b.width, p)
    const height = lerp(a.height, b.height, p)

    float.style.left = left - window.scrollX + "px"
    float.style.top = top - window.scrollY + "px"
    float.style.width = width + "px"
    float.style.height = height + "px"

    const scale = 1 - 0.06 * p
    float.style.transform = `scale(${scale})`
  }

  function request() {
    if (raf) return
    raf = requestAnimationFrame(onFrame)
  }

  window.addEventListener("scroll", request, { passive: true })
  window.addEventListener("resize", request)
  window.addEventListener("load", request)

  heroImg.addEventListener("load", () => {
    float.src = heroImg.currentSrc || heroImg.src
  })

  request()
})()

/* =============================
   Credenciales: desktop preview panel
   ============================= */
;(() => {
  const items = Array.from(document.querySelectorAll(".cred-ui__item"))
  if (!items.length) return

  const img = document.getElementById("credPreviewImg")
  const titleEl = document.getElementById("credPreviewTitle")
  const metaEl = document.getElementById("credPreviewMeta")
  const ph = document.getElementById("credPreviewPlaceholder")

  let activeBtn = null

  function getLang() {
    return typeof currentLang !== "undefined" ? currentLang : "es"
  }

  function pickText(btn, key) {
    const lang = getLang()
    const ds = btn.dataset
    if (key === "title") return lang === "en" ? ds.titleEn || ds.titleEs || "" : ds.titleEs || ds.titleEn || ""
    if (key === "meta") return lang === "en" ? ds.metaEn || ds.metaEs || "" : ds.metaEs || ds.metaEn || ""
    return ""
  }

  function setActive(btn) {
    if (!btn) return
    items.forEach((b) => b.classList.toggle("is-active", b === btn))
    activeBtn = btn

    const t = pickText(btn, "title")
    const m = pickText(btn, "meta")
    if (titleEl) titleEl.textContent = t
    if (metaEl) metaEl.textContent = m

    const src = (btn.dataset.preview || "").trim()

    if (img && ph) {
      if (src) {
        img.hidden = false
        ph.hidden = true
        img.alt = t || ""
        img.src = src
      } else {
        img.hidden = true
        ph.hidden = false
      }
    }
  }

  img?.addEventListener("error", () => {
    if (img) img.hidden = true
    if (ph) ph.hidden = false
  })

  items.forEach((btn) => {
    const handler = () => setActive(btn)
    btn.addEventListener("mouseenter", handler)
    btn.addEventListener("focus", handler)
    btn.addEventListener("click", handler)
  })

  const firstWithPreview = items.find((b) => (b.dataset.preview || "").trim().length > 0) || items[0]
  setActive(firstWithPreview)

  const langBtn = document.getElementById("langToggle")
  langBtn?.addEventListener("click", () => {
    if (activeBtn) setActive(activeBtn)
  })
})()
