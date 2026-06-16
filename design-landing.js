const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const langToggle = document.getElementById('langToggle');

const translations = {
  es: {
    navSelected: 'Casos seleccionados',
    navArchive: 'Archivo visual',
    navContact: 'Contacto',
    langToggleLabel: 'Switch to English',
    ariaOpenMenu: 'Abrir menú',
    ariaCloseMenu: 'Cerrar menú',
    lightboxClose: 'Cerrar imagen',
    heroKicker: 'Portfolio de diseño gráfico',
    heroTitle: 'Diseño visual para lanzamientos, producto físico y campañas digitales.',
    heroLead: 'Dirección de arte, identidad visual, diseño editorial para vinilo, merchandising, cartelería, reels y piezas promocionales desarrolladas para lanzamientos reales, imprenta y comunicación musical.',
    heroCtaCases: 'Ver casos seleccionados',
    heroVigilhunterLabel: 'Vigilhunter / Edición física',
    heroShekenLabel: 'Sheken / Sistema visual',
    heroVioletLabel: 'Violet / Identidad visual',
    proofYearsNumber: '2015',
    proofYears: 'trabajando en diseño para música independiente',
    proofFormatsNumber: 'Print + digital',
    proofFormats: 'arte final, identidad, social ads y formatos físicos',
    proofLabelsNumber: 'Sellos reales',
    proofLabels: 'material preparado para distribución e imprenta',
    selectedKicker: 'Casos seleccionados',
    selectedTitle: 'Piezas elegidas por criterio, no por volumen.',
    selectedLead: 'Selección de trabajos con salida a imprenta, producción física o comunicación promocional real. Cada caso muestra concepto, adaptación visual, jerarquía, preparación para producción y lectura en soportes concretos.',
    roleNote: 'Trabajo especialmente en sistemas gráficos para música: creación de artwork, adaptación visual, diseño de edición física, arte final, merchandising, cartelería y piezas promocionales.',
    statusPhysical: 'Edición física',
    statusPrintReady: 'Arte final para imprenta',
    statusPublished: 'Publicado',
    statusFullEdition: 'Diseño completo de edición',
    statusDigitalSingle: 'Single digital publicado',
    statusFormatStudy: 'Estudio de formatos físicos',
    statusProduced: 'Producido',
    statusTextilePrint: 'Impresión textil',
    statusPrinted: 'Impreso',
    statusArtworkAdaptation: 'Adaptación de artwork',
    statusLargeFormat: 'Gran formato',
    statusPrepress: 'Preprensa',
    statusTextileSystem: 'Sistema textil',
    statusMultiFormat: 'Multiformato',
    statusPrintedProduced: 'Producido e impreso',
    statusRealEditions: 'Ediciones reales',
    statusPhysicalDistribution: 'Distribución física',
    statusFullArtwork: 'Artwork completo',
    caseVigilEyebrow: 'Vinilo & Print / High Roller Records',
    caseVigilText: 'Estudio completo de edición física: portada, contraportada, label, insert, foto de banda retocada, especificaciones y mockup final. Un caso que resume el flujo completo: adaptar el lenguaje visual del artwork original y convertirlo en un sistema coherente para imprenta.',
    tagFullArtwork: 'Artwork completo',
    tagArtDirection: 'Dirección de arte',
    tagPrintLayout: 'Maquetación para imprenta',
    tagVinylLabel: 'Label de vinilo',
    caseAlacranEyebrow: 'Dirección de arte',
    caseAlacranText: 'Trabajo integral publicado por Steel on Steel Records: creación del artwork de portada, dirección visual, contraportada, interiores, label y arte final para construir una edición física completa con identidad coherente en todo el objeto musical.',
    caseShekenEyebrow: 'Sistema visual',
    caseShekenText: 'Portada publicada como single digital en Spotify. La extensión a vinilo y otros formatos físicos se plantea como estudio de sistema visual: arquitectura gótica, negro profundo, púrpura ocultista y oro envejecido para sostener una narrativa de misterio, poder antiguo y rebelión.',
    caseHittenLogoEyebrow: 'Identidad visual',
    caseHittenLogoText: 'Reconstrucción del logotipo en clave chrome 3D, con biseles, reflejos y pruebas de aplicación en pin, backdrop y camiseta para validar contraste, escala y presencia.',
    caseCiclonEyebrow: 'Merchandising',
    caseCiclonText: 'Adaptación de artwork a gráfica textil: selección de figura, reducción cromática, contraste, textura de tinta, mockup final y pieza promocional para redes.',
    caseRollupEyebrow: 'Producción impresa',
    caseRollupTitle: 'Hitten — Roll-up promocional',
    caseRollupText: 'Adaptación a gran formato con control de legibilidad, jerarquía, CMYK, perfil Coated FOGRA39, resolución efectiva, sangrados y exportación PDF/X-1a.',
    caseVioletEyebrow: 'Identidad visual',
    caseVioletText: 'Evolución de un logotipo plano hacia una marca con presencia escénica: chrome 3D, biseles afilados, reflejos controlados y glow violeta para merchandising, soportes promocionales y comunicación musical.',
    caseHittenMerchEyebrow: 'Sistema textil',
    caseHittenMerchText: 'Adaptación del artwork original de Hitten USA Tour a camiseta raglan 3/4 y camiseta negra básica, conservando jerarquía, iconografía y lenguaje visual con pruebas de lectura sobre prenda.',
    archiveKicker: 'Archivo visual',
    archiveTitle: 'Un sistema de trabajo aplicado a formatos reales.',
    archiveLead: 'Selección complementaria organizada por tipo de entrega: identidad visual, más ediciones físicas, merchandising, cartelería y campañas en redes sin volver a explicar los casos ya desarrollados arriba.',
    groupVinyl: 'Vinilo & Print',
    groupVinylText: 'Adaptación visual, maquetación y arte final para ediciones físicas reales.',
    groupIdentity: 'Identidad visual',
    groupIdentityText: 'Rediseño, tratamiento 3D y comprobación de aplicaciones.',
    groupMerch: 'Merchandising',
    groupMerchText: 'Traducción de artwork a soportes textiles y piezas promocionales.',
    groupPosters: 'Cartelería de gira',
    groupPostersText: 'Concepto, jerarquía informativa y presencia visual para conciertos y tours.',
    groupReels: 'Reels publicitarios',
    groupReelsText: 'Campañas de lanzamiento, social ads y piezas breves para crecimiento de audiencia.',
    capabilitiesKicker: 'Competencias',
    capabilitiesTitle: 'Del concepto al archivo final.',
    capabilitiesLead: 'Trabajo desde la idea visual hasta la entrega preparada para producción: composición, jerarquía, adaptación de formatos, arte final y piezas promocionales.',
    capabilityArtTitle: 'Dirección de arte',
    capabilityArtText: 'Concepto visual, atmósfera, composición, narrativa gráfica y coherencia estética.',
    capabilityPrintTitle: 'Arte final para imprenta',
    capabilityPrintText: 'Maquetación, CMYK, sangrados, resolución efectiva, perfiles de color y exportación final.',
    capabilityIdentityTitle: 'Identidad visual',
    capabilityIdentityText: 'Logo enhancement, sistemas de aplicación, contraste, escala y presencia de marca.',
    capabilityDigitalTitle: 'Campañas digitales',
    capabilityDigitalText: 'Reels, social ads, lanzamientos, piezas promocionales y adaptación a formatos de redes.',
    contactKicker: 'Disponible para diseño gráfico',
    contactRole: 'Diseñador gráfico · Dirección visual · Producción gráfica',
    contactTitle: 'Disponible para proyectos, estudios o equipos que necesiten criterio visual y producción gráfica.',
    contactLead: 'Puedo aportar dirección visual, arte final y adaptación de formatos desde el primer briefing, especialmente cuando identidad, soporte físico y comunicación digital tienen que sentirse como parte del mismo sistema.',
    contactEmail: 'Contactar por email',
    contactDownloadCv: 'Descargar CV',
    contactMainPortfolio: 'Ver portfolio frontend',
  },
  en: {
    navSelected: 'Selected cases',
    navArchive: 'Visual archive',
    navContact: 'Contact',
    langToggleLabel: 'Cambiar a español',
    ariaOpenMenu: 'Open menu',
    ariaCloseMenu: 'Close menu',
    lightboxClose: 'Close image',
    heroKicker: 'Graphic design portfolio',
    heroTitle: 'Visual design for releases, physical product and digital campaigns.',
    heroLead: 'Art direction, visual identity, vinyl editorial design, merchandise, posters, reels and promotional assets developed for real releases, print production and music communication.',
    heroCtaCases: 'View selected cases',
    heroVigilhunterLabel: 'Vigilhunter / Physical edition',
    heroShekenLabel: 'Sheken / Visual system',
    heroVioletLabel: 'Violet / Visual identity',
    proofYearsNumber: '2015',
    proofYears: 'working in design for independent music',
    proofFormatsNumber: 'Print + digital',
    proofFormats: 'final artwork, identity, social ads and physical formats',
    proofLabelsNumber: 'Real labels',
    proofLabels: 'assets prepared for distribution and print production',
    selectedKicker: 'Selected cases',
    selectedTitle: 'Pieces selected for judgment, not volume.',
    selectedLead: 'A selection of works produced for print, physical production or real promotional communication. Each case shows concept, visual adaptation, hierarchy, production preparation and readability across concrete formats.',
    roleNote: 'I work especially on graphic systems for music: artwork creation, visual adaptation, physical-edition design, final artwork, merchandise, posters and promotional assets.',
    statusPhysical: 'Physical edition',
    statusPrintReady: 'Print-ready artwork',
    statusPublished: 'Published',
    statusFullEdition: 'Complete edition design',
    statusDigitalSingle: 'Published digital single',
    statusFormatStudy: 'Physical format study',
    statusProduced: 'Produced',
    statusTextilePrint: 'Textile print',
    statusPrinted: 'Printed',
    statusArtworkAdaptation: 'Artwork adaptation',
    statusLargeFormat: 'Large format',
    statusPrepress: 'Prepress',
    statusTextileSystem: 'Textile system',
    statusMultiFormat: 'Multi-format',
    statusPrintedProduced: 'Produced and printed',
    statusRealEditions: 'Real editions',
    statusPhysicalDistribution: 'Physical distribution',
    statusFullArtwork: 'Full artwork',
    caseVigilEyebrow: 'Vinyl & Print / High Roller Records',
    caseVigilText: 'Complete physical-edition study: front cover, back cover, label, insert, retouched band photo, specifications and final mock-up. A case that shows the full flow: adapting the visual language of the original artwork into a coherent print-ready system.',
    tagFullArtwork: 'Full artwork',
    tagArtDirection: 'Art direction',
    tagPrintLayout: 'Print-ready layout',
    tagVinylLabel: 'Vinyl label',
    caseAlacranEyebrow: 'Art direction',
    caseAlacranText: 'Full project published by Steel on Steel Records: cover artwork creation, visual direction, back cover, inner layout, label and final artwork for a complete physical edition with coherent identity across the whole musical object.',
    caseShekenEyebrow: 'Visual system',
    caseShekenText: 'Cover artwork published as a digital single on Spotify. The extension into vinyl and other physical formats is presented as a visual-system study: gothic architecture, deep black, occult purple and aged gold supporting a narrative of mystery, ancient power and rebellion.',
    caseHittenLogoEyebrow: 'Visual identity',
    caseHittenLogoText: 'A chrome 3D reconstruction of the logo with bevels, reflections and application tests on pin, backdrop and T-shirt to validate contrast, scale and presence.',
    caseCiclonEyebrow: 'Merchandising',
    caseCiclonText: 'Artwork adaptation for textile graphics: figure selection, colour reduction, contrast, ink texture, final mock-up and promotional social asset.',
    caseRollupEyebrow: 'Print production',
    caseRollupTitle: 'Hitten — Promotional roll-up',
    caseRollupText: 'Large-format adaptation with readability control, hierarchy, CMYK setup, Coated FOGRA39 profile, effective resolution, bleed and PDF/X-1a export.',
    caseVioletEyebrow: 'Visual identity',
    caseVioletText: 'A flat logo evolved into a stage-ready visual identity: chrome 3D, sharp bevels, controlled reflections and violet glow for merchandise, promotional formats and music communication.',
    caseHittenMerchEyebrow: 'Textile system',
    caseHittenMerchText: 'Adaptation of the original Hitten USA Tour artwork into a 3/4 raglan and a standard black T-shirt, preserving hierarchy, iconography and visual language with garment readability tests.',
    archiveKicker: 'Visual archive',
    archiveTitle: 'A working system applied to real formats.',
    archiveLead: 'A complementary selection organised by deliverable type: visual identity, more physical editions, merchandise, posters and social campaigns without re-explaining the cases already developed above.',
    groupVinyl: 'Vinyl & Print',
    groupVinylText: 'Visual adaptation, layout and final artwork for real physical editions.',
    groupIdentity: 'Visual identity',
    groupIdentityText: 'Redesign, 3D treatment and application testing.',
    groupMerch: 'Merchandising',
    groupMerchText: 'Artwork translation into textile formats and promotional assets.',
    groupPosters: 'Tour posters',
    groupPostersText: 'Concept, information hierarchy and visual presence for concerts and tours.',
    groupReels: 'Promotional reels',
    groupReelsText: 'Release campaigns, social ads and short-form assets for audience growth.',
    capabilitiesKicker: 'Capabilities',
    capabilitiesTitle: 'From concept to final artwork.',
    capabilitiesLead: 'I work from the visual idea to production-ready delivery: composition, hierarchy, format adaptation, final artwork and promotional assets.',
    capabilityArtTitle: 'Art direction',
    capabilityArtText: 'Visual concept, atmosphere, composition, graphic narrative and aesthetic coherence.',
    capabilityPrintTitle: 'Print-ready artwork',
    capabilityPrintText: 'Layout, CMYK, bleed, effective resolution, colour profiles and final export.',
    capabilityIdentityTitle: 'Visual identity',
    capabilityIdentityText: 'Logo enhancement, application systems, contrast, scale and brand presence.',
    capabilityDigitalTitle: 'Digital campaigns',
    capabilityDigitalText: 'Reels, social ads, releases, promotional assets and adaptation to social formats.',
    contactKicker: 'Available for graphic design',
    contactRole: 'Graphic designer · Visual direction · Graphic production',
    contactTitle: 'Available for projects, studios or teams that need visual judgment and graphic production.',
    contactLead: 'I can bring visual direction, final artwork and format adaptation from the first briefing, especially when identity, physical formats and digital communication need to feel like one coherent system.',
    contactEmail: 'Contact by email',
    contactDownloadCv: 'Download CV',
    contactMainPortfolio: 'View frontend portfolio',
  }
};

let currentLang = localStorage.getItem('lang') || 'es';

function translate(lang) {
  const t = translations[lang] || translations.es;
  const cvHref = lang === 'es'
    ? 'img/diseno-grafico/CV%20Daniel%20Meseguer%202026%20ES.pdf'
    : 'img/diseno-grafico/CV%20Daniel%20Meseguer%202026%20EN.pdf';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });
  document.querySelectorAll('[data-cv-link]').forEach(el => {
    el.setAttribute('href', cvHref);
  });
  langToggle.textContent = lang === 'es' ? 'EN' : 'ES';
  langToggle.setAttribute('aria-label', t.langToggleLabel);
  navToggle.setAttribute('aria-label', navbar.classList.contains('is-open') ? t.ariaCloseMenu : t.ariaOpenMenu);
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
  currentLang = lang;
}

window.addEventListener('scroll', () => {
  navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  const t = translations[currentLang] || translations.es;
  const isOpen = navbar.classList.toggle('is-open');
  navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-label', isOpen ? t.ariaCloseMenu : t.ariaOpenMenu);
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', (translations[currentLang] || translations.es).ariaOpenMenu);
  });
});

langToggle.addEventListener('click', () => {
  translate(currentLang === 'es' ? 'en' : 'es');
});

document.querySelectorAll('.gd-contact-email').forEach(link => {
  link.addEventListener('click', event => {
    const user = link.dataset.mailUser;
    const domain = link.dataset.mailDomain;
    if (!user || !domain) return;
    event.preventDefault();
    window.location.href = `mailto:${user}@${domain}`;
  });
});

const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');
const navSections = document.querySelectorAll('section[id]');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinksAll.forEach(link => {
      link.toggleAttribute('aria-current', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.35 });
navSections.forEach(section => activeObserver.observe(section));

(function setupLightbox() {
  const lightbox = document.getElementById('gdLightbox');
  const lightboxImg = document.getElementById('gdLightboxImg');
  const caption = document.getElementById('gdLightboxCaption');
  const closeBtn = lightbox.querySelector('.gd-lightbox__close');
  const triggers = document.querySelectorAll('.gd-lightbox-trigger');
  let activeTrigger = null;

  function open(trigger) {
    const img = trigger.querySelector('img');
    if (!img) return;
    activeTrigger = trigger;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    caption.textContent = img.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gd-lightbox-open');
    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gd-lightbox-open');
    setTimeout(() => {
      lightboxImg.removeAttribute('src');
      lightboxImg.alt = '';
      caption.textContent = '';
    }, 180);
    activeTrigger?.focus?.({ preventScroll: true });
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => open(trigger));
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });
}());

(function setupVideoAutoplay() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(min-width: 901px)').matches) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.isIntersecting ? entry.target.play() : entry.target.pause();
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('.gd-reel-grid video').forEach(video => observer.observe(video));
}());

translate(currentLang);
