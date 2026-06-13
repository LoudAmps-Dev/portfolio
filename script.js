const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');

// Navbar — se oscurece al hacer scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
});


// Reinicia el glitch del título cada vez que la sección Wildside entra en pantalla
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const title = entry.target.querySelector('.transicion-title');
    title.style.animation = 'none';
    title.offsetHeight;
    title.style.animation = '';
  });
}, { threshold: 0.15 }).observe(document.querySelector('.transicion'));

// ── HERO — typewriter + staggered entrance ──
(function () {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  // Tokenize HTML preservando etiquetas (ej. <br>)
  const html = 'Dani<br>Meseguer';
  const tokens = [];
  for (let i = 0; i < html.length; ) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      tokens.push({ tag: true, v: html.slice(i, end + 1) });
      i = end + 1;
    } else {
      tokens.push({ tag: false, v: html[i] });
      i++;
    }
  }

  title.innerHTML = '';
  title.classList.add('typing');

  let idx = 0;
  function type() {
    if (idx >= tokens.length) {
      title.classList.add('typing-done');
      setTimeout(() => {
        title.style.opacity = '1';
        title.classList.remove('typing');
      }, 1000);
      document.querySelectorAll('.hero-tag, .hero-subtitle, .hero-ctas')
        .forEach(el => el.classList.add('reveal'));
      return;
    }
    const t = tokens[idx++];
    title.innerHTML += t.v;
    setTimeout(type, t.tag ? 0 : 90);
  }

  setTimeout(type, 300);
}());

// ── CARDS — entrada escalonada con IntersectionObserver ──
const cards = document.querySelectorAll('.proyecto-card');
const slider = document.getElementById('proyectosSlider');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('card-visible');
    cardObserver.unobserve(entry.target);
  });
}, { root: slider, threshold: 0.12 });
cards.forEach(card => cardObserver.observe(card));

// ── STUDIO SYSTEM — entrada escalonada ──
const studioCards = document.querySelectorAll('.studio-card');
if (studioCards.length) {
  const studioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.revealDelay || 0);
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
      studioObserver.unobserve(entry.target);
    });
  }, { threshold: 0.22 });
  studioCards.forEach((card, idx) => {
    card.dataset.revealDelay = String(idx * 120);
    studioObserver.observe(card);
  });
}

// ── SLIDER DE PROYECTOS ──
(function () {
  const slider = document.getElementById('proyectosSlider');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  const dots = document.querySelectorAll('#sliderDots .dot');
  if (!slider) return;

  function cardWidth() {
    const card = slider.querySelector('.proyecto-card');
    return card ? card.offsetWidth + 24 : 444; // 24 = gap 1.5rem
  }

  function activeIdx() {
    return Math.round(slider.scrollLeft / cardWidth());
  }

  function updateControls() {
    const idx = activeIdx();
    prevBtn.disabled = slider.scrollLeft < 4;
    nextBtn.disabled = slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 4;
    dots.forEach((dot, i) => dot.classList.toggle('dot--active', i === idx));
  }

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      slider.scrollTo({ left: i * cardWidth(), behavior: 'smooth' });
    });
  });

  slider.addEventListener('scroll', updateControls, { passive: true });
  updateControls();
}());

// ── SLIDERS DE DISEÑO ──
(function () {
  const sliders = [
    { slider: document.getElementById('vinylSlider'), dots: document.querySelectorAll('#vinylDots .dot') },
    { slider: document.getElementById('posterSlider'), dots: document.querySelectorAll('#posterDots .dot') },
    { slider: document.getElementById('merchSlider'), dots: document.querySelectorAll('#merchDots .dot') },
    { slider: document.getElementById('reelsSlider'), dots: document.querySelectorAll('#reelsDots .dot') },
  ];

  function itemWidth(slider) {
    const item = slider.querySelector('.design-item');
    if (!item) return 0;
    const gap = parseFloat(getComputedStyle(slider).gap) || 16;
    return item.offsetWidth + gap;
  }

  sliders.forEach(({ slider, dots }) => {
    if (!slider || !dots.length) return;

    function updateDots() {
      const width = itemWidth(slider);
      if (!width) return;
      const idx = Math.round(slider.scrollLeft / width);
      const activeIdx = Math.max(0, Math.min(idx, dots.length - 1));
      dots.forEach((dot, i) => dot.classList.toggle('dot--active', i === activeIdx));
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        slider.scrollTo({ left: i * itemWidth(slider), behavior: 'smooth' });
      });
    });

    slider.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
  });
}());

// ── VÍDEOS — autoplay al entrar en viewport ──
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(min-width: 901px)').matches) return;
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.isIntersecting ? entry.target.play() : entry.target.pause();
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.design-img--video video').forEach(v => videoObserver.observe(v));
}());

// ── MENÚ MÓVIL ──
navToggle.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('is-open');
  navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Cerrar el menú al hacer clic en cualquier link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ── IDIOMA ──
const translations = {
  es: {
    navAbout: 'De Dónde Vengo',
    navProjects: 'Proyectos Web',
    navVisual: 'Trabajo Visual',
    navContact: 'Contacto',
    langToggleLabel: 'Switch to English',
    heroTag: 'Diseñador Gráfico · Frontend Dev · Marketing Digital y RRSS',
    heroSubtitle: 'Once años construyendo identidades visuales para música independiente. Ahora frontend developer — con el criterio de diseño ya incluido.',
    heroCtaWeb: 'Proyectos Web',
    heroCtaVisual: 'Trabajo Visual',
    heroCtaContact: 'Contacto',
    sectionLabelAbout: 'De Donde Vengo',
    sectionTitleAbout: 'Diseño y desarrollo frontend.<br>Una sola forma de pensar la interfaz.',
    aboutText1: 'Desde 2015 diseño para bandas y proyectos musicales — carteles, logos, portadas de vinilo, booklets, reels y lyric videos. Una trayectoria construida proyecto a proyecto, donde el resultado final ha pesado siempre más que la titulación.',
    aboutText2: 'En 2026 incorporo el desarrollo web a mi perfil. Trabajo con HTML, CSS y JavaScript, y aplico mi criterio visual desde el primer momento del proyecto. Diseñar antes de programar cambia la forma de construir una interfaz.',
    studioLabel: 'Sistema de trabajo',
    studioTitle: 'La parte visual no va al final.<br>Entra desde el primer boceto.',
    studioCard1Title: 'Dirección visual',
    studioCard1Text: 'Antes del código: tono, jerarquía, ritmo y una idea clara de cómo debe sentirse la interfaz.',
    studioCard2Title: 'Frontend limpio',
    studioCard2Text: 'HTML, CSS y JavaScript con estructura simple, responsive y fácil de mantener.',
    studioCard3Title: 'Pulido final',
    studioCard3Text: 'Microinteracciones, accesibilidad básica, detalle visual y despliegue sin ruido innecesario.',
    sectionLabelProjects: 'Trabajo web',
    sectionTitleProjects: 'Lo que he construido',
    card1Title: 'Riffs on Time',
    card1Desc: 'Herramienta para músicos que permite crear setlists de concierto con duración exacta. Búsqueda de canciones en Spotify, suma automática de tiempos y exportación a Word y PDF.',
    card2Title: 'Best Nutrition',
    card2Desc: 'Web multi-página para una clínica de nutrición con sistema de reserva de citas funcional. Selección de servicio, fecha y franja horaria con validación en cliente, gestión de disponibilidad y confirmación de cita en tiempo real.',
    card3Title: 'Clínica Animals',
    card3Desc: 'Web informativa para una clínica veterinaria con bilingüismo catalán/español, estado de apertura en tiempo real y carrusel automático de reseñas. Animaciones con IntersectionObserver, tarjetas de veterinarios con flip 3D en CSS y CTA directo a WhatsApp.',
    card4Title: 'Esta web',
    card4Desc: 'Sistema i18n propio, IntersectionObserver para animaciones de entrada, doble paleta temática, efectos glitch en CSS puro. Cero dependencias.',
    card5Title: 'Hitten — Web oficial',
    card5Desc: 'Web oficial de la banda de rock duro Hitten (High Roller Records). Identidad visual completa, diseño y desarrollo. Dos páginas: sitio principal y EPK para promotores. Integración con Bandcamp y Bands in Town.',
    badgeReal: 'Cliente real',
    badgePractice: 'Proyecto de prácticas',
    cardDemo: 'Ver demo →',
    cardCode: 'Ver código →',
    ariaDemo1: 'Ver demo de Riffs on Time',
    ariaCode1: 'Ver código de Riffs on Time',
    ariaDemo2: 'Ver demo de Best Nutrition',
    ariaCode2: 'Ver código de Best Nutrition',
    ariaDemo3: 'Ver demo de Clínica Animals',
    ariaCode3: 'Ver código de Clínica Animals',
    ariaCode4: 'Ver código de esta web',
    ariaDemo5: 'Ver web de Hitten',
    ariaCode5: 'Ver código de Hitten',
    transicionArchive: 'Visual Archive',

    transicionSubtitle: 'Aquí tienes algunos trabajos de diseño gráfico que he realizado.',
    designKicker: '02 / Trabajo Visual',
    designEyebrow: 'Desde 2015',
    designTitle: 'Diseño gráfico para<br>bandas de rock duro.',
    designBody: 'Cartelería, identidades y maquetación completa para imprenta. Portadas, inserts y booklets de vinilo y CD. Reels, lyric videos y montaje de videoclips a partir de los brutos.',
    statLabel1: 'Discos compuestos',
    statLabel2: 'Países rockeados',
    statLabel3: 'Km en furgoneta',
    statLabel4: 'Experiencia de vida',
    designCatVinyl: 'Vinilo &amp; Print',
    designCatPosters: 'Cartelería de Gira',
    designCatIdentity: 'Identidad Visual',
    designCatMerch: 'Merchandising',
    designCatReels: 'Reels Publicitarios',
    sublabelComplete: 'Diseño y maquetación completa',
    sublabelConcertPoster: 'Cartel de Concierto',
    sublabelTourPoster: 'Cartel de gira',
    sublabelIdentity: 'Rediseño, tratamiento 3D y sistema de aplicaciones',
    sublabelMerch: 'Diseño de merchandising',
    sublabelLargePrint: 'Diseño e impresión a gran escala',
    sublabelTshirt: 'Diseño de camiseta',
    sublabelConcept: 'Prueba de concepto',
    identityVioletDesc: 'Evolución de un logotipo plano hacia una marca con presencia escénica: chrome 3D, biseles afilados, reflejos controlados y glow violeta para convertir la identidad en una pieza de impacto, lista para merchandising, soportes promocionales y comunicación musical.',
    identityHittenDesc: 'Relectura del logotipo original sin suavizar su carácter: se mantienen las puntas, la tensión horizontal y el peso de banda clásica, pero se reconstruyen los planos con biseles cromados, reflejos cyan y cortes ámbar. El estudio baja el logo a aplicaciones reales —pin metálico, backdrop negro y camiseta vintage— para comprobar contraste, escala y presencia antes de cerrar la versión final.',
    labelRollUp: 'Hitten - Roll Up publicitario',
    labelTshirtDesign: 'Diseño Camiseta',
    designCatWeb: 'Web',
    designLabelHitten: 'Hitten — Web oficial',
    designTagWeb: 'Diseño web',
    sectionSoon: 'MÁS PRÓXIMAMENTE',
    contactoTitle: 'Hablamos',
    contactoDesc: 'Busco mi primera oportunidad profesional como desarrollador frontend. Once años de criterio visual aplicados desde el primer commit. ¿Hablamos?',
    contactoFinalDesc: 'Diseñador que aprendió a programar. O programador que nunca dejó de diseñar.',
    backToTop: '↑ Volver arriba',
    footer: '© 2026 Dani Meseguer. Hecho en Murcia 🍋',
    skillsCatSoft: 'Soft Skills',
    skillSoft1: 'Criterio visual',
    skillSoft2: 'Autonomía',
    skillSoft3: 'Comunicación',
    skillSoft4: 'Precisión',
  },
  en: {
    navAbout: 'My Background',
    navProjects: 'Web Projects',
    navVisual: 'Visual Work',
    navContact: 'Contact',
    langToggleLabel: 'Cambiar a español',
    heroTag: 'Graphic Designer · Frontend Dev · Digital Marketing & Social Media',
    heroSubtitle: 'Eleven years building visual identities for independent music. Now a frontend developer — with design thinking already built in.',
    heroCtaWeb: 'Web Projects',
    heroCtaVisual: 'Visual Work',
    heroCtaContact: 'Contact',
    sectionLabelAbout: 'My Background',
    sectionTitleAbout: 'Design and frontend development.<br>One way of thinking about interfaces.',
    aboutText1: "Since 2015 I've been designing for bands and music projects — posters, logos, vinyl covers, booklets, reels and lyric videos. A career built project by project, where the final result has always mattered more than the degree.",
    aboutText2: "In 2026 I added web development to my profile. I work with HTML, CSS and JavaScript, applying my visual judgment from the very first moment of a project. Designing before coding changes the way you build an interface.",
    studioLabel: 'Working system',
    studioTitle: 'The visual layer is not an afterthought.<br>It starts with the first sketch.',
    studioCard1Title: 'Visual direction',
    studioCard1Text: 'Before code: tone, hierarchy, rhythm and a clear idea of how the interface should feel.',
    studioCard2Title: 'Clean frontend',
    studioCard2Text: 'HTML, CSS and JavaScript with a simple, responsive and maintainable structure.',
    studioCard3Title: 'Final polish',
    studioCard3Text: 'Microinteractions, basic accessibility, visual detail and deployment without unnecessary noise.',
    sectionLabelProjects: 'Web work',
    sectionTitleProjects: "What I've built",
    card1Title: 'Riffs on Time',
    card1Desc: 'A tool for musicians to build concert setlists with exact durations. Spotify song search, automatic time totals, and export to Word and PDF.',
    card2Title: 'Best Nutrition',
    card2Desc: 'Multi-page website for a nutrition clinic with a fully functional appointment booking system. Service selection, date and time slots, client-side validation, availability management and real-time confirmation.',
    card3Title: 'Clínica Animals',
    card3Desc: 'Informational website for a veterinary clinic with Catalan/Spanish language toggle, real-time open/closed status based on live schedule, and an automatic reviews carousel. IntersectionObserver animations, 3D CSS flip cards for vet profiles, and a direct WhatsApp CTA.',
    card4Title: 'This website',
    card4Desc: 'Custom i18n system, IntersectionObserver for entrance animations, dual theme palette, pure CSS glitch effects. Zero dependencies.',
    card5Title: 'Hitten — Official Website',
    card5Desc: 'Official website for hard rock band Hitten (High Roller Records). Full visual identity, design and development. Two pages: main site and EPK for promoters. Bandcamp store and Bands in Town tour dates integrations.',
    badgeReal: 'Real client',
    badgePractice: 'Practice project',
    cardDemo: 'View demo →',
    cardCode: 'View code →',
    ariaDemo1: 'View Riffs on Time demo',
    ariaCode1: 'View Riffs on Time code',
    ariaDemo2: 'View Best Nutrition demo',
    ariaCode2: 'View Best Nutrition code',
    ariaDemo3: 'View Clínica Animals demo',
    ariaCode3: 'View Clínica Animals code',
    ariaCode4: "View this website's code",
    ariaDemo5: 'View Hitten website',
    ariaCode5: 'View Hitten code',
    transicionArchive: 'Visual Archive',

    transicionSubtitle: "Here are some graphic design works I've done.",
    designKicker: '02 / Visual Work',
    designEyebrow: 'Since 2015',
    designTitle: 'Graphic design for<br>hard rock bands.',
    designBody: 'Posters, identities and complete print-ready layouts. Vinyl and CD covers, inserts and booklets. Reels, lyric videos and music video editing from raw footage.',
    statLabel1: 'Albums recorded',
    statLabel2: 'Countries rocked',
    statLabel3: 'Km in the van',
    statLabel4: 'Life experience',
    designCatVinyl: 'Vinyl &amp; Print',
    designCatPosters: 'Tour Posters',
    designCatIdentity: 'Visual Identity',
    designCatMerch: 'Merchandising',
    designCatReels: 'Promotional Reels',
    sublabelComplete: 'Design and full layout',
    sublabelConcertPoster: 'Concert Poster',
    sublabelTourPoster: 'Tour Poster',
    sublabelIdentity: 'Redesign, 3D treatment and application system',
    sublabelMerch: 'Merchandise design',
    sublabelLargePrint: 'Design and large-format printing',
    sublabelTshirt: 'T-shirt design',
    sublabelConcept: 'Concept mock-up',
    identityVioletDesc: 'A flat logo evolved into a stage-ready visual identity: chrome 3D, sharp bevels, controlled reflections and violet glow, turning the mark into a high-impact asset built for merchandise, promotional formats and music communication.',
    identityHittenDesc: 'A reread of the original mark without sanding down its attitude: the spikes, horizontal tension and classic band weight stay intact, while the planes are rebuilt with chrome bevels, cyan reflections and amber cuts. The study tests the logo on real uses —metal pin, black live backdrop and vintage T-shirt— to check contrast, scale and presence before locking the final version.',
    labelRollUp: 'Hitten - Advertising Roll Up',
    labelTshirtDesign: 'T-Shirt Design',
    designCatWeb: 'Web',
    designLabelHitten: 'Hitten — Official website',
    designTagWeb: 'Web design',
    sectionSoon: 'MORE COMING SOON',
    contactoTitle: "Let's talk",
    contactoDesc: "I'm looking for my first professional opportunity as a frontend developer. Eleven years of visual judgment applied from the first commit. Shall we talk?",
    contactoFinalDesc: 'A designer who learned to code. Or a developer who never stopped designing.',
    backToTop: '↑ Back to top',
    footer: '© 2026 Dani Meseguer. Made in Murcia 🍋',
    skillsCatSoft: 'Soft Skills',
    skillSoft1: 'Visual judgment',
    skillSoft2: 'Autonomy',
    skillSoft3: 'Communication',
    skillSoft4: 'Precision',
  }
};

let currentLang = localStorage.getItem('lang') || 'es';

function applyTranslations(lang) {
  const t = translations[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  const toggle = document.getElementById('langToggle');
  toggle.textContent = lang === 'es' ? 'EN' : 'ES';
  toggle.setAttribute('aria-label', t.langToggleLabel);

  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
  currentLang = lang;
}

document.getElementById('langToggle').addEventListener('click', () => {
  applyTranslations(currentLang === 'es' ? 'en' : 'es');
});

applyTranslations(currentLang);

// ── LIGHTBOX DE DISEÑO (solo escritorio) ──
(function () {
  const desktopQuery = window.matchMedia('(min-width: 901px)');
  const lightbox = document.getElementById('designLightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.design-lightbox__img');
  const variantGrid = lightbox.querySelector('.design-lightbox__variants');
  const variantImgs = lightbox.querySelectorAll('.design-lightbox__variant-img');
  const variantLabels = lightbox.querySelectorAll('.design-lightbox__variant-label');
  const lightboxCaption = lightbox.querySelector('.design-lightbox__caption');
  const closeBtn = lightbox.querySelector('.design-lightbox__close');
  const items = document.querySelectorAll(
    '.design-img--vinyl img, .design-img--poster img, .design-img--identity img, .design-img--merch:not(.design-img--variant) img'
  );
  const variantButtons = document.querySelectorAll('.design-img--variant');
  let activeTrigger = null;

  function captionFor(element, fallback = '') {
    const item = element.closest('.design-item');
    const title = item?.querySelector('.design-label')?.textContent.trim() || fallback;
    const subtitle = item?.querySelector('.design-sublabel')?.textContent.trim();
    return subtitle ? `${title}<span>${subtitle}</span>` : title;
  }

  function showSingleImage() {
    lightboxImg.hidden = false;
    variantGrid.hidden = true;
    lightbox.classList.remove('design-lightbox--variants');
  }

  function showVariantImages() {
    lightboxImg.hidden = true;
    variantGrid.hidden = false;
    lightbox.classList.add('design-lightbox--variants');
  }

  function openLightbox(img) {
    if (!desktopQuery.matches) return;
    activeTrigger = img.closest('.design-img') || img;
    showSingleImage();
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.innerHTML = captionFor(img, img.alt);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeBtn.focus({ preventScroll: true });
  }

  function openVariantLightbox(button) {
    if (!desktopQuery.matches) return;
    const img = button.querySelector('img');
    if (!img || variantImgs.length < 2 || variantLabels.length < 2) return;

    activeTrigger = button;
    showVariantImages();
    variantImgs[0].src = img.currentSrc || img.src;
    variantImgs[0].alt = img.alt;
    variantLabels[0].textContent = button.dataset.originalLabel || 'Actual';
    variantImgs[1].src = button.dataset.altSrc;
    variantImgs[1].alt = button.dataset.altAlt || '';
    variantLabels[1].textContent = button.dataset.altLabel || 'Variante';
    lightboxCaption.innerHTML = captionFor(button, img.alt);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeBtn.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    setTimeout(() => {
      lightboxImg.removeAttribute('src');
      lightboxImg.alt = '';
      variantImgs.forEach(img => {
        img.removeAttribute('src');
        img.alt = '';
      });
      variantLabels.forEach(label => {
        label.textContent = '';
      });
      lightboxCaption.textContent = '';
      showSingleImage();
    }, 220);
    activeTrigger?.focus?.({ preventScroll: true });
  }

  function setTriggerState() {
    items.forEach(img => {
      const trigger = img.closest('.design-img');
      if (!trigger) return;
      if (desktopQuery.matches) {
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('aria-label', `Ampliar ${img.alt}`);
      } else {
        trigger.removeAttribute('role');
        trigger.removeAttribute('tabindex');
        trigger.removeAttribute('aria-label');
      }
    });
  }

  items.forEach(img => {
    const trigger = img.closest('.design-img');
    if (!trigger) return;
    trigger.addEventListener('click', () => openLightbox(img));
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(img);
      }
    });
  });
  setTriggerState();

  variantButtons.forEach(button => {
    button.addEventListener('click', () => openVariantLightbox(button));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
  desktopQuery.addEventListener('change', () => {
    if (!desktopQuery.matches) closeLightbox();
    setTriggerState();
  });
}());

// ── NAV ACTIVO AL HACER SCROLL ──
const navSections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const setActiveNavLink = (id) => {
  navLinksAll.forEach(link => {
    if (link.getAttribute('href') === '#' + id) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

const activeNavObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveNavLink(entry.target.id);
  });
}, { threshold: 0.4 });

navSections.forEach(section => activeNavObserver.observe(section));

// ── PARALLAX — sección Wildside ──
(function () {
  const transicion = document.querySelector('.transicion');
  if (!transicion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const parallaxTransicion = () => {
    const rect = transicion.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const progress = rect.top / window.innerHeight;
    const offset = 50 + progress * 20;
    transicion.style.backgroundPosition = `center center, center ${offset}%`;
  };
  let rafId;
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(parallaxTransicion);
  }, { passive: true });
  parallaxTransicion();
}());

// ── TIMELINE — animación al entrar en viewport ──
const timeline = document.querySelector('.timeline');
if (timeline) {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('tl-animated');
      }
    });
  }, { threshold: 0.6 }).observe(timeline);
}
