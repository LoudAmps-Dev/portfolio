// Navbar — se oscurece al hacer scroll
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 20px rgba(83,74,183,0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
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
    heroTag: 'Frontend Developer · Murcia · 2026',
    heroSubtitle: 'Once años construyendo identidades visuales para música independiente. Ahora frontend developer — con el criterio de diseño ya incluido.',
    heroCta1: 'Ver proyectos',
    heroCta2: 'Contacto',
    sectionLabelAbout: 'De Donde Vengo',
    sectionTitleAbout: 'Diseño y desarrollo frontend.<br>Una sola forma de pensar la interfaz.',
    aboutText1: 'Desde 2015 diseño para bandas y proyectos musicales — carteles, logos, portadas de vinilo, booklets, reels y lyric videos. Una trayectoria construida proyecto a proyecto, donde el resultado final ha pesado siempre más que la titulación.',
    aboutText2: 'En 2026 incorporo el desarrollo frontend a mi perfil. Trabajo con HTML, CSS y JavaScript, y aplico mi criterio visual desde el primer momento del proyecto. Diseñar antes de programar cambia la forma de construir una interfaz.',
    sectionLabelProjects: 'Trabajo web',
    sectionTitleProjects: 'Lo que he construido',
    card1Title: 'Riffs on Time',
    card1Desc: 'Herramienta para músicos que permite crear setlists de concierto con duración exacta. Búsqueda de canciones en Spotify, suma automática de tiempos y exportación a Word y PDF.',
    card2Title: 'Best Nutrition',
    card2Desc: 'Web multi-página para una clínica de nutrición con sistema de reserva de citas funcional. Selección de servicio, fecha y franja horaria con validación en cliente, gestión de disponibilidad y confirmación de cita en tiempo real.',
    card3Title: 'Esta web',
    card3Desc: 'La página que estás mirando. Sin frameworks, sin librerías. Dos paletas porque son dos trabajos distintos.',
    cardDemo: 'Ver demo →',
    cardCode: 'Ver código →',
    ariaDemo1: 'Ver demo de Riffs on Time',
    ariaCode1: 'Ver código de Riffs on Time',
    ariaDemo2: 'Ver demo de Best Nutrition',
    ariaCode2: 'Ver código de Best Nutrition',
    ariaCode3: 'Ver código de esta web',
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
    footer: '© 2026 Dani Meseguer. Hecho en Murcia 🍋',
  },
  en: {
    navAbout: 'My Background',
    navProjects: 'Projects',
    navContact: 'Contact',
    langToggleLabel: 'Cambiar a español',
    heroTag: 'Frontend Developer · Murcia · 2026',
    heroSubtitle: 'Eleven years building visual identities for independent music. Now a frontend developer — with design thinking already built in.',
    heroCta1: 'View projects',
    heroCta2: 'Contact',
    sectionLabelAbout: 'My Background',
    sectionTitleAbout: 'Design and frontend development.<br>One way of thinking about interfaces.',
    aboutText1: "Since 2015 I've been designing for bands and music projects — posters, logos, vinyl covers, booklets, reels and lyric videos. A career built project by project, where the final result has always mattered more than the degree.",
    aboutText2: "In 2026 I added frontend development to my profile. I work with HTML, CSS and JavaScript, applying my visual judgment from the very first moment of a project. Designing before coding changes the way you build an interface.",
    sectionLabelProjects: 'Web work',
    sectionTitleProjects: "What I've built",
    card1Title: 'Riffs on Time',
    card1Desc: 'A tool for musicians to build concert setlists with exact durations. Spotify song search, automatic time totals, and export to Word and PDF.',
    card2Title: 'Best Nutrition',
    card2Desc: 'Multi-page website for a nutrition clinic with a fully functional appointment booking system. Service selection, date and time slots, client-side validation, availability management and real-time confirmation.',
    card3Title: 'This website',
    card3Desc: "The page you're looking at. No frameworks, no libraries. Two palettes because they're two different kinds of work.",
    cardDemo: 'View demo →',
    cardCode: 'View code →',
    ariaDemo1: 'View Riffs on Time demo',
    ariaCode1: 'View Riffs on Time code',
    ariaDemo2: 'View Best Nutrition demo',
    ariaCode2: 'View Best Nutrition code',
    ariaCode3: "View this website's code",
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
