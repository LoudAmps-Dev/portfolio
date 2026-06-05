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

// ── STATS — contadores con IntersectionObserver ──
const stats = document.querySelectorAll('.stat');

const animateNumber = (el, target, duration, finalText) => {
  const numEl = el.querySelector('.stat-number');
  const suffix = el.dataset.suffix || '';
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    // easing: arranca rápido, frena al final (easeOutQuad)
    const eased = 1 - (1 - progress) * (1 - progress);
    const value = Math.floor(eased * target);
    numEl.textContent = value + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else if (finalText) {
      numEl.textContent = finalText;
    }
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (entry.target.dataset.animated === 'true') return;

    entry.target.dataset.animated = 'true';
    const target = parseInt(entry.target.dataset.target, 10);

    if (entry.target.dataset.static) return;
    if (target === 0) return;

    const finalText = entry.target.dataset.final || null;
    const duration = finalText ? 1800 : 1400;

    animateNumber(entry.target, target, duration, finalText);
  });
}, { threshold: 0.4 });

stats.forEach(stat => observer.observe(stat));

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

// ── SLIDER DE VINILOS (mobile) ──
(function () {
  const slider = document.getElementById('vinylSlider');
  const dots = document.querySelectorAll('#vinylDots .dot');
  if (!slider) return;

  function itemWidth() {
    const item = slider.querySelector('.design-item');
    if (!item) return 0;
    const gap = parseFloat(getComputedStyle(slider).gap) || 16;
    return item.offsetWidth + gap;
  }

  function updateDots() {
    const idx = Math.round(slider.scrollLeft / itemWidth());
    dots.forEach((dot, i) => dot.classList.toggle('dot--active', i === idx));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      slider.scrollTo({ left: i * itemWidth(), behavior: 'smooth' });
    });
  });

  slider.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
}());

// ── MENÚ MÓVIL ──
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');

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
    navProjects: 'Proyectos',
    navContact: 'Contacto',
    langToggleLabel: 'Switch to English',
    heroTag: 'Frontend Dev · Diseñador Gráfico · Marketing Digital y RRSS',
    heroSubtitle: 'Once años construyendo identidades visuales para música independiente. Ahora frontend developer — con el criterio de diseño ya incluido.',
    heroCta1: 'Ver proyectos',
    heroCta2: 'Contacto',
    sectionLabelAbout: 'De Donde Vengo',
    sectionTitleAbout: 'Diseño y desarrollo frontend.<br>Una sola forma de pensar la interfaz.',
    aboutText1: 'Desde 2015 diseño para bandas y proyectos musicales — carteles, logos, portadas de vinilo, booklets, reels y lyric videos. Una trayectoria construida proyecto a proyecto, donde el resultado final ha pesado siempre más que la titulación.',
    aboutText2: 'En 2026 incorporo el desarrollo web a mi perfil. Trabajo con HTML, CSS y JavaScript, y aplico mi criterio visual desde el primer momento del proyecto. Diseñar antes de programar cambia la forma de construir una interfaz.',
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
    transicionDesc: 'Veo que fuiste directo. A esto me dedicaba antes del front-end.',
    designEyebrow: 'Desde 2015',
    designTitle: 'Diseño gráfico para<br>bandas de rock duro.',
    designBody: 'Cartelería, identidades y maquetación completa para imprenta. Portadas, inserts y booklets de vinilo y CD. Reels, lyric videos y montaje de videoclips a partir de los brutos.',
    statLabel1: 'Discos compuestos',
    statLabel2: 'Países rockeados',
    statLabel3: 'Km en furgoneta',
    statLabel4: 'Experiencia de vida',
    designCatVinyl: 'Vinilo &amp; Print',
    sublabelComplete: 'Maquetación completa',
    designCatWeb: 'Web',
    designLabelHitten: 'Hitten — Web oficial',
    designTagWeb: 'Diseño web',
    sectionSoon: 'MÁS PRÓXIMAMENTE',
    contactoTitle: 'Hablamos',
    contactoDesc: 'Busco mi primera oportunidad profesional como desarrollador frontend. Once años de criterio visual aplicados desde el primer commit. ¿Hablamos?',
    contactoFinalDesc: 'Diseñador que aprendió a programar. O programador que nunca dejó de diseñar.',
    backToTop: '↑ Volver arriba',
    wildsideTeaser: 'Hay más historia aquí',
    footer: '© 2026 Dani Meseguer. Hecho en Murcia 🍋',
  },
  en: {
    navAbout: 'My Background',
    navProjects: 'Projects',
    navContact: 'Contact',
    langToggleLabel: 'Cambiar a español',
    heroTag: 'Frontend Dev · Graphic Designer · Digital Marketing & Social Media',
    heroSubtitle: 'Eleven years building visual identities for independent music. Now a frontend developer — with design thinking already built in.',
    heroCta1: 'View projects',
    heroCta2: 'Contact',
    sectionLabelAbout: 'My Background',
    sectionTitleAbout: 'Design and frontend development.<br>One way of thinking about interfaces.',
    aboutText1: "Since 2015 I've been designing for bands and music projects — posters, logos, vinyl covers, booklets, reels and lyric videos. A career built project by project, where the final result has always mattered more than the degree.",
    aboutText2: "In 2026 I added web development to my profile. I work with HTML, CSS and JavaScript, applying my visual judgment from the very first moment of a project. Designing before coding changes the way you build an interface.",
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
    transicionDesc: "I see you went straight for it. This is what I did before frontend.",
    designEyebrow: 'Since 2015',
    designTitle: 'Graphic design for<br>hard rock bands.',
    designBody: 'Posters, identities and complete print-ready layouts. Vinyl and CD covers, inserts and booklets. Reels, lyric videos and music video editing from raw footage.',
    statLabel1: 'Albums recorded',
    statLabel2: 'Countries rocked',
    statLabel3: 'Km in the van',
    statLabel4: 'Life experience',
    designCatVinyl: 'Vinyl &amp; Print',
    sublabelComplete: 'Full layout design',
    designCatWeb: 'Web',
    designLabelHitten: 'Hitten — Official website',
    designTagWeb: 'Web design',
    sectionSoon: 'MORE COMING SOON',
    contactoTitle: "Let's talk",
    contactoDesc: "I'm looking for my first professional opportunity as a frontend developer. Eleven years of visual judgment applied from the first commit. Shall we talk?",
    contactoFinalDesc: 'A designer who learned to code. Or a developer who never stopped designing.',
    backToTop: '↑ Back to top',
    wildsideTeaser: 'There is more story here',
    footer: '© 2026 Dani Meseguer. Made in Murcia 🍋',
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
const transicion = document.querySelector('.transicion');
if (transicion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
}

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

// ── CURSOR ROJO — zona oscura ──
const cursor = document.querySelector('.custom-cursor');
let darkCount = 0;

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('.transicion, .loudamps-design, .contacto').forEach(section => {
  section.addEventListener('mouseenter', () => {
    darkCount++;
    cursor.classList.add('is-active');
    document.body.style.cursor = 'none';
  });
  section.addEventListener('mouseleave', () => {
    darkCount = Math.max(0, darkCount - 1);
    if (darkCount === 0) {
      cursor.classList.remove('is-active');
      document.body.style.cursor = '';
    }
  });
});
