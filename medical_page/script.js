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
   Dynamic Check: Desactiva completamente en móviles/tablets
   ============================= */
;(() => {
  const heroImg = document.getElementById("heroPhoto")
  const aboutImg = document.getElementById("aboutPhoto")
  if (!heroImg || !aboutImg) return

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduceMotion) return

  // Elemento flotante
  const float = document.createElement("img")
  float.className = "photo-float"
  float.alt = heroImg.alt || ""
  float.src = heroImg.currentSrc || heroImg.src
  float.decoding = "async"
  float.loading = "eager"
  float.hidden = true
  document.body.appendChild(float)

  // Configuración
  let active = false
  let raf = 0

  function isMobile() {
    // Detecta pantallas menores a 1024px (Tablets y Móviles) O dispositivos táctiles
    return window.matchMedia("(max-width: 1024px)").matches || 
           window.matchMedia("(hover: none) and (pointer: coarse)").matches
  }

  function resetStyles() {
    // Apaga el efecto y muestra las fotos originales
    float.hidden = true
    heroImg.style.opacity = ""
    aboutImg.style.opacity = ""
    active = false
  }

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

    // 1. Si es móvil, abortar inmediatamente y resetear
    if (isMobile()) {
      if (active) resetStyles() // Solo resetea si estaba activo para no gastar recursos
      return
    }

    const heroSection = document.getElementById("hero")
    const aboutSection = document.getElementById("about")
    if (!heroSection || !aboutSection) return

    const start = heroSection.offsetTop + heroSection.offsetHeight * 0.10
    const end = aboutSection.offsetTop + 7

    const p = clamp01((window.scrollY - start) / Math.max(1, end - start))

    // Caso: antes de empezar o después de terminar
    if (p <= 0 || p >= 1) {
      if (active) {
         // Transición final: ocultar float, mostrar estáticas
         float.hidden = true
         if (p <= 0) {
            heroImg.style.opacity = ""
            aboutImg.style.opacity = "0"
         } else {
            heroImg.style.opacity = "0"
            aboutImg.style.opacity = ""
         }
         active = false
      }
      return
    }

    // Caso: Durante la animación (0 < p < 1)
    if (!active) {
      active = true
      heroImg.style.opacity = "0"
      aboutImg.style.opacity = "0"
      float.hidden = false
    }

    // Cálculos de posición (solo ocurren en Desktop)
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
  window.addEventListener("load", () => {
     // Actualizar src por si cambió (responsive images)
     float.src = heroImg.currentSrc || heroImg.src
     request()
  })
})()

/* =============================
   Credenciales: desktop preview panel (v2)
   - search + keyboard nav + loading + open link + modal zoom
   ============================= */
;(() => {
  const section = document.getElementById("credentials")
  if (!section) return

  const list = section.querySelector(".cred-ui__list")
  const items = Array.from(section.querySelectorAll(".cred-ui__item"))
  if (!items.length) return

  const img = section.querySelector("#credPreviewImg")
  const titleEl = section.querySelector("#credPreviewTitle")
  const metaEl = section.querySelector("#credPreviewMeta")
  const ph = section.querySelector("#credPreviewPlaceholder")
  const phMsg = section.querySelector("#credPreviewMsg") || ph?.querySelector("p") || null
  const loading = section.querySelector("#credPreviewLoading")
  const openLink = section.querySelector("#credPreviewOpen")

  const search = section.querySelector("#credSearch")
  const clearBtn = section.querySelector("#credSearchClear")
  const countEl = section.querySelector("#credSearchCount")

  const modal = document.getElementById("credModal")
  const modalImg = document.getElementById("credModalImg")
  const modalTitle = document.getElementById("credModalTitle")
  const modalMeta = document.getElementById("credModalMeta")
  const modalOpen = document.getElementById("credModalOpen")
  const modalClose = document.getElementById("credModalClose")

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  let activeBtn = null
  let loadToken = 0
  const loadedSrc = new Set()

  const MSG = {
    select: {
      es: "Selecciona una credencial para ver su documento aquí.",
      en: "Select a credential to preview its document here.",
    },
    nodoc: {
      es: "Documento no disponible para esta credencial.",
      en: "Document not available for this credential.",
    },
    error: {
      es: "No se pudo cargar el documento. Intenta abrirlo en una pestaña.",
      en: "Could not load the document. Try opening it in a new tab.",
    },
    noresults: {
      es: "No hay resultados con esa búsqueda.",
      en: "No results for that search.",
    },
  }

  function getLang() {
    return typeof currentLang !== "undefined" ? currentLang : (document.documentElement.lang || "es")
  }

  function setPhMessage(key) {
    if (!phMsg || !MSG[key]) return
    phMsg.setAttribute("data-es", MSG[key].es)
    phMsg.setAttribute("data-en", MSG[key].en)
    phMsg.textContent = getLang() === "en" ? MSG[key].en : MSG[key].es
  }

  function pickText(btn, key) {
    const lang = getLang()
    const ds = btn.dataset
    if (key === "title") return lang === "en" ? ds.titleEn || ds.titleEs || "" : ds.titleEs || ds.titleEn || ""
    if (key === "meta") return lang === "en" ? ds.metaEn || ds.metaEs || "" : ds.metaEs || ds.metaEn || ""
    return ""
  }

  function setOpenLink(src) {
    if (!openLink) return
    if (src) {
      openLink.hidden = false
      openLink.href = src
    } else {
      openLink.hidden = true
      openLink.removeAttribute("href")
    }
  }

  function showPlaceholder(kind) {
    if (img) {
      img.hidden = true
      img.classList.remove("is-loaded")
      img.removeAttribute("src")
    }
    if (ph) ph.hidden = false
    if (loading) loading.hidden = true
    setOpenLink("")
    setPhMessage(kind)
  }

  function showPreview(src, altText) {
    if (!img || !ph) return

    if (!src) {
      showPlaceholder("nodoc")
      return
    }

    setOpenLink(src)

    ph.hidden = true
    img.hidden = false
    img.alt = altText || ""
    img.classList.remove("is-loaded")

    if (loadedSrc.has(src)) {
      img.src = src
      if (loading) loading.hidden = true
      if (reduceMotion) img.classList.add("is-loaded")
      else requestAnimationFrame(() => img.classList.add("is-loaded"))
      return
    }

    if (loading) loading.hidden = false
    const token = ++loadToken

    const pre = new Image()
    pre.decoding = "async"
    pre.onload = () => {
      if (token !== loadToken) return
      loadedSrc.add(src)
      img.src = src
      if (loading) loading.hidden = true
      if (reduceMotion) img.classList.add("is-loaded")
      else requestAnimationFrame(() => img.classList.add("is-loaded"))
    }
    pre.onerror = () => {
      if (token !== loadToken) return
      showPlaceholder("error")
    }
    pre.src = src
  }

  function syncAria(btn) {
    const t = pickText(btn, "title")
    const m = pickText(btn, "meta")
    const label = [t, m].filter(Boolean).join(" — ")
    btn.setAttribute("aria-label", label || btn.textContent.trim())
  }

  function setActive(btn, opts = {}) {
    if (!btn || btn.hidden) return
    const { scrollIntoView = false, focus = false } = opts

    activeBtn = btn

    items.forEach((b) => {
      const on = b === btn
      b.classList.toggle("is-active", on)
      b.setAttribute("aria-selected", on ? "true" : "false")
      b.tabIndex = on ? 0 : -1
    })

    items.forEach(syncAria)

    const t = pickText(btn, "title")
    const m = pickText(btn, "meta")
    if (titleEl) titleEl.textContent = t
    if (metaEl) metaEl.textContent = m

    const src = (btn.dataset.preview || "").trim()
    showPreview(src, t)

    if (scrollIntoView) {
      btn.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" })
    }
    if (focus) {
      btn.focus({ preventScroll: true })
    }
  }

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  }

  function updateCount() {
    if (!countEl || !search) return
    const q = normalize(search.value)
    if (!q) {
      countEl.textContent = ""
      return
    }
    const visible = items.filter((b) => !b.hidden).length
    const lang = getLang()
    countEl.textContent =
      lang === "en"
        ? `${visible} result${visible === 1 ? "" : "s"}`
        : `${visible} resultado${visible === 1 ? "" : "s"}`
  }

  function applyFilter() {
    if (!search) return
    const q = normalize(search.value)

    items.forEach((btn) => {
      const ds = btn.dataset
      const hay = normalize(
        `${ds.titleEs || ""} ${ds.titleEn || ""} ${ds.metaEs || ""} ${ds.metaEn || ""} ${btn.textContent || ""}`
      )
      btn.hidden = q ? !hay.includes(q) : false
    })

    // Oculta grupos vacíos
    section.querySelectorAll(".cred-ui__group").forEach((g) => {
      const any = g.querySelector(".cred-ui__item:not([hidden])")
      g.hidden = !any
    })

    updateCount()

    const visibleItems = items.filter((b) => !b.hidden)
    if (!visibleItems.length) {
      activeBtn = null
      if (titleEl) titleEl.textContent = ""
      if (metaEl) metaEl.textContent = ""
      showPlaceholder("noresults")
      return
    }

    if (!activeBtn || activeBtn.hidden) {
      setActive(visibleItems[0])
    } else {
      // reafirma roving tabindex
      items.forEach((b) => (b.tabIndex = b === activeBtn ? 0 : -1))
    }
  }

  // Init ARIA roles + roving tabindex base
  items.forEach((btn) => {
    btn.setAttribute("role", "option")
    btn.setAttribute("aria-selected", "false")
    btn.setAttribute("aria-controls", "credPreviewFigure")
    btn.tabIndex = -1
    syncAria(btn)
  })
  // deja el primero accesible por tab si aún no hay activo
  items[0].tabIndex = 0

  // Hover con micro-delay para evitar “parpadeo” al pasar rápido el mouse
  const hoverDelay = 70
  const hoverTimers = new WeakMap()

  function clearHover(btn) {
    const id = hoverTimers.get(btn)
    if (id) clearTimeout(id)
    hoverTimers.delete(btn)
  }

  items.forEach((btn) => {
    btn.addEventListener("mouseleave", () => clearHover(btn))
    btn.addEventListener("mouseenter", () => {
      clearHover(btn)
      const id = window.setTimeout(() => setActive(btn), hoverDelay)
      hoverTimers.set(btn, id)
    })
    btn.addEventListener("focus", () => setActive(btn))
    btn.addEventListener("click", () => setActive(btn))
  })

  // Keyboard nav (↑ ↓ Home End Enter Space)
  function visibleItems() {
    return items.filter((b) => !b.hidden)
  }

  function moveFocus(delta) {
    const vis = visibleItems()
    if (!vis.length) return
    const current = document.activeElement
    const i = Math.max(0, vis.indexOf(current))
    const next = vis[Math.max(0, Math.min(vis.length - 1, i + delta))]
    if (next) setActive(next, { focus: true, scrollIntoView: true })
  }

  list?.addEventListener("keydown", (e) => {
    const key = e.key
    if (key === "ArrowDown") {
      e.preventDefault()
      moveFocus(1)
    } else if (key === "ArrowUp") {
      e.preventDefault()
      moveFocus(-1)
    } else if (key === "Home") {
      e.preventDefault()
      const vis = visibleItems()
      if (vis[0]) setActive(vis[0], { focus: true, scrollIntoView: true })
    } else if (key === "End") {
      e.preventDefault()
      const vis = visibleItems()
      if (vis[vis.length - 1]) setActive(vis[vis.length - 1], { focus: true, scrollIntoView: true })
    } else if (key === "Enter" || key === " ") {
      // focus ya activa preview; no hace falta más aquí
    }
  })

  // Search handlers
  search?.addEventListener("input", () => {
    if (clearBtn) clearBtn.hidden = !String(search.value || "").length
    applyFilter()
  })

  clearBtn?.addEventListener("click", () => {
    if (!search) return
    search.value = ""
    clearBtn.hidden = true
    applyFilter()
    search.focus()
  })

  // Preview image error fallback
  img?.addEventListener("error", () => showPlaceholder("error"))

  // Modal zoom
  function openModal() {
    if (!activeBtn) return
    const src = (activeBtn.dataset.preview || "").trim()
    if (!src) return

    // Fallback si <dialog> no está disponible
    if (!modal || typeof modal.showModal !== "function" || !modalImg) {
      window.open(src, "_blank", "noopener")
      return
    }

    const t = pickText(activeBtn, "title")
    const m = pickText(activeBtn, "meta")

    if (modalTitle) modalTitle.textContent = t
    if (modalMeta) modalMeta.textContent = m

    modalImg.src = src
    modalImg.alt = t || ""

    if (modalOpen) {
      modalOpen.hidden = false
      modalOpen.href = src
    }

    modal.showModal()
  }

  img?.addEventListener("click", openModal)

  modalClose?.addEventListener("click", () => modal?.close())
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.close()
  })
  modal?.addEventListener("close", () => {
    activeBtn?.focus({ preventScroll: true })
  })

  // Inicial: preferir el primero con preview (como ya tenías, pero con loading/aria)
  const firstWithPreview = items.find((b) => (b.dataset.preview || "").trim().length > 0) || items[0]
  setActive(firstWithPreview)

  // Re-sync cuando cambie idioma (tu botón ya existe)
  const langBtn = document.getElementById("langToggle")
  langBtn?.addEventListener("click", () => {
    items.forEach(syncAria)
    if (activeBtn) setActive(activeBtn)
    updateCount()
  })
})()