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

// ── WILDSIDE — contador de experiencia visual ──
(function () {
  const counters = document.querySelectorAll('[data-count-up]');
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(counter) {
    const target = Number(counter.dataset.countUp || 0);
    if (!target) return;

    if (prefersReducedMotion) {
      counter.textContent = String(target);
      return;
    }

    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.55 });

  counters.forEach(counter => countObserver.observe(counter));
}());

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

    function pageCount() {
      const width = itemWidth(slider);
      if (!width) return dots.length;
      return Math.max(1, Math.min(dots.length, Math.round((slider.scrollWidth - slider.offsetWidth) / width) + 1));
    }

    function updateDots() {
      const width = itemWidth(slider);
      if (!width) return;
      const pages = pageCount();
      const idx = Math.round(slider.scrollLeft / width);
      const activeIdx = Math.max(0, Math.min(idx, pages - 1));
      dots.forEach((dot, i) => {
        dot.hidden = i >= pages;
        dot.classList.toggle('dot--active', i === activeIdx);
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (dot.hidden) return;
        slider.scrollTo({ left: i * itemWidth(slider), behavior: 'smooth' });
      });
    });

    slider.addEventListener('scroll', updateDots, { passive: true });
    window.addEventListener('resize', updateDots);
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
  const t = translations[currentLang] || translations.es;
  navToggle.setAttribute('aria-label', isOpen ? t.ariaCloseMenu : t.ariaOpenMenu);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Cerrar el menú al hacer clic en cualquier link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-label', (translations[currentLang] || translations.es).ariaOpenMenu);
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ── IDIOMA ──
const translations = {
  es: {
    skipLink: 'Saltar al contenido',
    navAbout: 'De Dónde Vengo',
    navProjects: 'Proyectos Web',
    navVisual: 'Trabajo Visual',
    navContact: 'Contacto',
    langToggleLabel: 'Switch to English',
    ariaOpenMenu: 'Abrir menú',
    ariaCloseMenu: 'Cerrar menú',
    heroTag: 'Desarrollador frontend con criterio visual de diseñador',
    heroSubtitle: 'Construyo interfaces web responsive con HTML, CSS y JavaScript, respaldado por once años de trabajo visual para lanzamientos, imprenta y campañas digitales.',
    heroCtaWeb: 'Proyectos Web',
    heroCtaVisual: 'Trabajo Visual',
    heroCtaContact: 'Contacto',
    heroCtaCv: 'Descargar CV',
    sectionLabelAbout: 'De Donde Vengo',
    sectionTitleAbout: 'Diseño y desarrollo frontend.<br>Una sola forma de pensar la interfaz.',
    aboutText1: 'Mi base es el diseño gráfico: desde 2015 he trabajado en identidad visual, portadas, vinilos, cartelería, merchandising, reels y piezas promocionales para proyectos musicales reales.',
    aboutText2: 'En 2026 incorporé HTML, CSS y JavaScript para convertir ese criterio visual en interfaces funcionales. Actualmente estoy enfocado en construir proyectos completos con estructura clara, responsive cuidado, interacción medida y código fácil de evolucionar.',
    timelineDesign: 'Diseño',
    timelineMarketing: 'Mkt &amp; RRSS',
    timelineFrontend: 'Frontend',
    skillsCatDevelopment: 'Desarrollo',
    skillsCatDesign: 'Diseño',
    skillsCatAi: 'Herramientas',
    skillsCatSoft: 'Habilidades blandas',
    skillBranding: 'Branding',
    studioLabel: 'Sistema de trabajo',
    studioTitle: 'La parte visual no va al final.<br>Entra desde el primer boceto.',
    studioCard1Title: 'Dirección visual',
    studioCard1Text: 'Antes del código: tono, jerarquía, ritmo y una idea clara de cómo debe sentirse la interfaz.',
    studioCard2Title: 'Frontend limpio',
    studioCard2Text: 'HTML, CSS y JavaScript con estructura simple, responsive y fácil de mantener.',
    studioCard3Title: 'Pulido final',
    studioCard3Text: 'Microinteracciones, accesibilidad básica, detalle visual y despliegue sin ruido innecesario.',
    sectionLabelProjects: 'Trabajo web',
    sectionTitleProjects: 'Interfaces web construidas con criterio visual',
    card1Title: 'Riffs on Time',
    card1Desc: 'Herramienta para músicos que resuelve un problema real de directo: crear setlists con duración exacta, buscar canciones en Spotify, calcular tiempos automáticamente y exportar el resultado a Word y PDF.',
    card2Title: 'Best Nutrition',
    card2Desc: 'Web multi-página para una clínica de nutrición con sistema de reserva de citas funcional. Selección de servicio, fecha y franja horaria con validación en cliente, gestión de disponibilidad y confirmación de cita en tiempo real.',
    card3Title: 'Clínica Animals',
    card3Desc: 'Web informativa para una clínica veterinaria con bilingüismo catalán/español, estado de apertura en tiempo real y carrusel automático de reseñas. Animaciones con IntersectionObserver, tarjetas de veterinarios con flip 3D en CSS y CTA directo a WhatsApp.',
    card4Title: 'Esta web',
    card4Desc: 'Portfolio propio desarrollado sin dependencias: sistema i18n, animaciones con IntersectionObserver, doble universo visual, efectos CSS y estructura responsive pensada para contar un perfil híbrido sin perder foco frontend.',
    card5Title: 'Hitten — Web oficial',
    card5Desc: 'Sitio oficial para una banda internacional de hard rock: web principal, EPK para promotores, identidad visual, integración con Bandcamp y Bandsintown, datos estructurados y una presencia online preparada para contratación, gira y comunicación musical.',
    card6Title: 'Clínica Pepe Soler',
    card6Desc: 'Rediseño y desarrollo de una web responsive para una clínica de osteopatía y fisioterapia, incorporando un flujo de solicitud de cita por WhatsApp sin backend y sin alterar su sistema manual de agenda.',
    card7Title: 'Piedad Studio',
    card7Desc: 'Identidad visual y web para un centro de fisioterapia en Águilas: navegación mediante dock flotante, contacto de doble vía (llamada directa o formulario) con selector de motivo de consulta, y una estética inspirada en apps sociales.',
    badgeReal: 'Cliente real',
    badgeOwn: 'Portfolio personal',
    badgePractice: 'Caso práctico',
    cardDemo: 'Ver demo →',
    cardWeb: 'Ver web →',
    cardCaseStudy: 'Ver case study →',
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
    ariaWeb6: 'Ver web de Clínica Pepe Soler',
    ariaCase6: 'Ver case study de Clínica Pepe Soler',
    ariaWeb7: 'Ver web de Piedad Studio',
    valueLabel: 'Qué aporto',
    valueTitle: 'Frontend con sensibilidad visual y entrega cuidada.',
    valueLead: 'Puedo moverme entre diseño e implementación: traducir una intención visual a una interfaz responsive, mantener jerarquía, cuidar detalle y entregar código claro para evolucionar.',
    valueCard1Title: 'Maquetación responsive',
    valueCard1Text: 'HTML semántico, CSS mantenible, estructura adaptable y componentes que respetan contenido real.',
    valueCard2Title: 'Implementación de interfaces',
    valueCard2Text: 'Interacciones, estados, animaciones medidas, accesibilidad básica y atención al comportamiento en móvil.',
    valueCard3Title: 'Criterio de diseño',
    valueCard3Text: 'Jerarquía, composición, consistencia visual, tratamiento de marca y pulido final sin depender siempre de instrucciones cerradas.',
    valueCard4Title: 'Producción digital',
    valueCard4Text: 'Integraciones ligeras, SEO técnico básico, assets optimizados, GitHub y documentación clara del trabajo.',
    transicionArchive: 'Visual Archive',

    transicionSubtitle: 'La parte visual de mi perfil: criterio, producción y dirección de arte aplicados a proyectos reales.',
    designKicker: '02 / Trabajo Visual',
    designEyebrow: 'Desde 2015',
    designTitle: 'Diseño gráfico como base<br>para construir mejores interfaces.',
    designBody: 'Antes de escribir interfaces, aprendí a resolver problemas visuales en soportes reales: identidad, composición, producción, legibilidad, adaptación y detalle final. Esa base es la que llevo al frontend cuando traduzco una intención visual a código.',
    designMetricLabel: 'años de dirección visual y producción gráfica',
    designMetricAria: 'Más de 11 años de dirección visual y producción gráfica',
    designPortfolioLink: 'Ver portfolio gráfico completo',
    designTeaserNote: 'Esta selección no intenta ser el portfolio gráfico completo: funciona como prueba del perfil híbrido. Muestra cómo pienso sistemas visuales, adapto una pieza a distintos soportes y cuido el resultado hasta producción.',
    designTeaserCta: 'La landing independiente reúne más categorías, piezas impresas, cartelería, reels y trabajos de dirección de arte.',
    statLabel1: 'Discos compuestos',
    statLabel2: 'Países rockeados',
    statLabel3: 'Km en furgoneta',
    statLabel4: 'Experiencia de vida',
    designCatVinyl: 'Vinilo &amp; Print',
    designCatArtwork: 'Dirección de Arte',
    designCatPosters: 'Cartelería de Gira',
    designCatIdentity: 'Identidad Visual',
    designCatMerch: 'Merchandising',
    designCatLargeFormat: 'Producción Impresa &amp; Gran Formato',
    designCatReels: 'Reels Publicitarios',
    sublabelComplete: 'Diseño y maquetación completa',
    sublabelPrintProduction: 'Contraportada, interiores y arte final para imprenta',
    sublabelArtwork: 'Concepto, ilustración, color y dirección de arte',
    sublabelConcertPoster: 'Cartel de Concierto',
    sublabelTourPoster: 'Cartel de gira',
    sublabelIdentity: 'Rediseño, tratamiento 3D y sistema de aplicaciones',
    sublabelMerch: 'Diseño de merchandising',
    sublabelLargePrint: 'Diseño e impresión a gran escala',
    sublabelTshirt: 'Diseño de camiseta',
    sublabelConcept: 'Prueba de concepto',
    vinylSectionNote: 'Diseño artístico y producción gráfica para ediciones físicas reales: back covers, layouts interiores, labels de vinilo, CDs y, en algunos lanzamientos, cinta cassette. Cada pieza se adapta al lenguaje visual de la portada original para mantener una identidad coherente en todo el objeto musical, preparada para distribución internacional a través de sellos europeos como High Roller Records.',
    vinylFeaturedSublabel: 'Estudio completo de edición física: portada, contraportada, label, insert y arte final',
    vinylFeaturedDesc: 'Caso principal de la sección: una lámina completa que muestra el proceso aplicado a este tipo de lanzamientos, desde la adaptación visual de la portada hasta las piezas interiores, especificaciones de imprenta y mockup final.',
    vinylRelatedNote: 'El mismo proceso de adaptación, maquetación y arte final para imprenta se aplicó a otros lanzamientos, manteniendo la identidad de cada portada y resolviendo las piezas físicas necesarias para cada edición.',
    posterSectionNote: 'La comunicación visual de un concierto también debe respetar el universo del artista. Cada cartel parte del concepto del evento, la jerarquía de la información y el lenguaje gráfico de la banda para crear una pieza promocional con presencia, legibilidad y coherencia visual.',
    reelsSectionNote: 'También he desarrollado reels para campañas de promoción musical: lanzamientos de singles, anuncios orientados a ampliar la base de seguidores, llamadas a seguir perfiles sociales y piezas breves adaptadas al ritmo, tono e identidad de cada artista.',
    artworkAlacranDesc: 'Trabajo desarrollado desde la idea inicial hasta el arte final: composición, ilustración principal, tensión simbólica y acabado gráfico pensado para funcionar como portada, pieza impresa y objeto musical.',
    artworkShekenDesc: 'Sistema visual construido alrededor de una arquitectura gótica, negro profundo, púrpura ocultista y oro envejecido. Cada elemento —castillo, luna, estrellas, cruz y textura— está planteado para sostener una narrativa de misterio, poder antiguo y rebelión.',
    identityVioletDesc: 'Evolución de un logotipo plano hacia una marca con presencia escénica: chrome 3D, biseles afilados, reflejos controlados y glow violeta para convertir la identidad en una pieza de impacto, lista para merchandising, soportes promocionales y comunicación musical.',
    identityHittenDesc: 'Relectura del logotipo original sin suavizar su carácter: se mantienen las puntas, la tensión horizontal y el peso de banda clásica, pero se reconstruyen los planos con biseles cromados, reflejos cyan y cortes ámbar. El estudio baja el logo a aplicaciones reales —pin metálico, backdrop negro y camiseta vintage— para comprobar contraste, escala y presencia antes de cerrar la versión final.',
    merchCiclonSublabel: 'Adaptación de artwork a gráfica textil',
    merchCiclonDesc: 'Estudio comparativo que muestra la traducción del artwork original a camiseta: selección de figura, reducción cromática, contraste, textura de tinta, efecto vintage, interacción con la tela, mockup final y pieza promocional para redes. Más que un diseño aislado, enseña criterio de producción y adaptación visual a un soporte real.',
    merchHittenSublabel: 'Sistema de adaptación textil multiformato',
    merchHittenDesc: 'Análisis de adaptación gráfica desde el artwork original hacia dos soportes textiles: raglan 3/4 y camiseta negra básica. El estudio conserva composición, jerarquía, iconografía y lenguaje visual de la pieza madre, optimizando la lectura en impresión mediante reducción tonal, reencuadre, protagonismo del logotipo, control tipográfico y pruebas de acabado sobre prenda.',
    largeFormatRollupTitle: 'Hitten — Roll-up promocional',
    largeFormatRollupSublabel: 'Diseño digital, preprensa y producción final instalada',
    largeFormatRollupDesc: 'Estudio de producción para roll-up de 850 x 2000 mm, desde el arte final hasta la pieza instalada. La lámina documenta adaptación a escala, legibilidad a distancia, jerarquía tipográfica, preparación de archivo maestro en InDesign, modo CMYK, perfil Coated FOGRA39, resolución efectiva, sangrados, separación de tintas y exportación PDF/X-1a:2001 para imprenta.',
    labelRollUp: 'Hitten - Roll Up publicitario',
    labelTshirtDesign: 'Diseño Camiseta',
    designCatWeb: 'Web',
    designLabelHitten: 'Hitten — Web oficial',
    designTagWeb: 'Diseño web',
    sectionSoon: 'MÁS PRÓXIMAMENTE',
    contactoTitle: 'Hablamos',
    contactoDesc: 'Busco una oportunidad frontend donde importen el criterio visual, una implementación limpia y la atención al detalle.',
    contactoFinalDesc: 'Diseñador de base. Frontend developer con foco en interfaces visuales.',
    contactoLocation: 'Murcia / Barcelona · Remoto / híbrido · Disponibilidad inmediata',
    backToTop: '↑ Volver arriba',
    footer: '© 2026 Dani Meseguer. Hecho en Murcia 🍋',
    skillSoft1: 'Criterio visual',
    skillSoft2: 'Autonomía',
    skillSoft3: 'Comunicación',
    skillSoft4: 'Precisión',
  },
  en: {
    skipLink: 'Skip to content',
    navAbout: 'My Background',
    navProjects: 'Web Projects',
    navVisual: 'Visual Work',
    navContact: 'Contact',
    langToggleLabel: 'Cambiar a español',
    ariaOpenMenu: 'Open menu',
    ariaCloseMenu: 'Close menu',
    heroTag: "Frontend developer with a designer's eye",
    heroSubtitle: 'I build responsive web interfaces with HTML, CSS and JavaScript, backed by eleven years of visual work for releases, print and digital campaigns.',
    heroCtaWeb: 'Web Projects',
    heroCtaVisual: 'Visual Work',
    heroCtaContact: 'Contact',
    heroCtaCv: 'Download CV',
    sectionLabelAbout: 'My Background',
    sectionTitleAbout: 'Design and frontend development.<br>One way of thinking about interfaces.',
    aboutText1: "My background is graphic design: since 2015 I have worked on visual identity, cover artwork, vinyl layouts, posters, merchandise, reels and promotional assets for real music projects.",
    aboutText2: "In 2026 I added HTML, CSS and JavaScript to turn that visual judgment into working interfaces. I am now focused on building complete projects with clear structure, careful responsive behaviour, measured interaction and code that can evolve.",
    timelineDesign: 'Design',
    timelineMarketing: 'Mkt &amp; Social',
    timelineFrontend: 'Frontend',
    skillsCatDevelopment: 'Development',
    skillsCatDesign: 'Design',
    skillsCatAi: 'Tools',
    skillsCatSoft: 'Soft Skills',
    skillBranding: 'Branding',
    studioLabel: 'Working system',
    studioTitle: 'The visual layer is not an afterthought.<br>It starts with the first sketch.',
    studioCard1Title: 'Visual direction',
    studioCard1Text: 'Before code: tone, hierarchy, rhythm and a clear idea of how the interface should feel.',
    studioCard2Title: 'Clean frontend',
    studioCard2Text: 'HTML, CSS and JavaScript with a simple, responsive and maintainable structure.',
    studioCard3Title: 'Final polish',
    studioCard3Text: 'Microinteractions, basic accessibility, visual detail and deployment without unnecessary noise.',
    sectionLabelProjects: 'Web work',
    sectionTitleProjects: 'Web interfaces built with visual judgment',
    card1Title: 'Riffs on Time',
    card1Desc: 'A tool for musicians that solves a real live-performance problem: building exact-duration setlists, searching songs in Spotify, calculating totals automatically and exporting the result to Word and PDF.',
    card2Title: 'Best Nutrition',
    card2Desc: 'Multi-page website for a nutrition clinic with a fully functional appointment booking system. Service selection, date and time slots, client-side validation, availability management and real-time confirmation.',
    card3Title: 'Clínica Animals',
    card3Desc: 'Informational website for a veterinary clinic with Catalan/Spanish language toggle, real-time open/closed status based on live schedule, and an automatic reviews carousel. IntersectionObserver animations, 3D CSS flip cards for vet profiles, and a direct WhatsApp CTA.',
    card4Title: 'This website',
    card4Desc: 'Self-built portfolio with zero dependencies: custom i18n system, IntersectionObserver animations, dual visual universe, CSS effects and a responsive structure designed to present a hybrid profile without losing frontend focus.',
    card5Title: 'Hitten — Official Website',
    card5Desc: 'Official site for an international hard rock band: main website, promoter EPK, visual identity, Bandcamp and Bandsintown integrations, structured data and an online presence built for booking, touring and music communication.',
    card6Title: 'Clínica Pepe Soler',
    card6Desc: 'Redesign and development of a responsive website for an osteopathy and physiotherapy clinic, with a WhatsApp appointment request flow that avoids backend complexity and preserves the clinic’s manual scheduling system.',
    card7Title: 'Piedad Studio',
    card7Desc: 'Visual identity and website for a physiotherapy studio in Águilas: floating dock navigation, dual-path contact (direct call or form) with a consultation-reason selector, and an aesthetic inspired by social apps.',
    badgeReal: 'Real client',
    badgeOwn: 'Personal portfolio',
    badgePractice: 'Case study',
    cardDemo: 'View demo →',
    cardWeb: 'View website →',
    cardCaseStudy: 'View case study →',
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
    ariaWeb6: 'View Clínica Pepe Soler website',
    ariaCase6: 'View Clínica Pepe Soler case study',
    ariaWeb7: 'View Piedad Studio website',
    valueLabel: 'What I bring',
    valueTitle: 'Frontend with visual sensitivity and careful delivery.',
    valueLead: 'I can move between design and implementation: translating a visual intention into a responsive interface, preserving hierarchy, caring for detail and delivering clear code that can evolve.',
    valueCard1Title: 'Responsive layout',
    valueCard1Text: 'Semantic HTML, maintainable CSS, adaptive structure and components that respect real content.',
    valueCard2Title: 'Interface implementation',
    valueCard2Text: 'Interactions, states, measured animations, basic accessibility and attention to mobile behaviour.',
    valueCard3Title: 'Design judgment',
    valueCard3Text: 'Hierarchy, composition, visual consistency, brand treatment and final polish without always needing fully closed instructions.',
    valueCard4Title: 'Digital production',
    valueCard4Text: 'Light integrations, basic technical SEO, optimised assets, GitHub and clear documentation of the work.',
    transicionArchive: 'Visual Archive',

    transicionSubtitle: 'The visual side of my profile: judgment, production and art direction applied to real projects.',
    designKicker: '02 / Visual Work',
    designEyebrow: 'Since 2015',
    designTitle: 'Graphic design as a base<br>for building better interfaces.',
    designBody: 'Before writing interfaces, I learned to solve visual problems in real formats: identity, composition, production, readability, adaptation and final detail. That background is what I bring to frontend when translating a visual intention into code.',
    designMetricLabel: 'years of visual direction and graphic production',
    designMetricAria: 'More than 11 years of visual direction and graphic production',
    designPortfolioLink: 'View full graphic portfolio',
    designTeaserNote: 'This selection is not trying to be the complete graphic portfolio: it works as proof of the hybrid profile. It shows how I think through visual systems, adapt a piece to different formats and care for the result through production.',
    designTeaserCta: 'The standalone landing gathers more categories, printed pieces, posters, reels and art-direction work.',
    statLabel1: 'Albums recorded',
    statLabel2: 'Countries rocked',
    statLabel3: 'Km in the van',
    statLabel4: 'Life experience',
    designCatVinyl: 'Vinyl &amp; Print',
    designCatArtwork: 'Art Direction',
    designCatPosters: 'Tour Posters',
    designCatIdentity: 'Visual Identity',
    designCatMerch: 'Merchandising',
    designCatLargeFormat: 'Print Production &amp; Large Format',
    designCatReels: 'Promotional Reels',
    sublabelComplete: 'Design and full layout',
    sublabelPrintProduction: 'Back cover, inner layout and print-ready artwork',
    sublabelArtwork: 'Concept, illustration, colour and art direction',
    sublabelConcertPoster: 'Concert Poster',
    sublabelTourPoster: 'Tour Poster',
    sublabelIdentity: 'Redesign, 3D treatment and application system',
    sublabelMerch: 'Merchandise design',
    sublabelLargePrint: 'Design and large-format printing',
    sublabelTshirt: 'T-shirt design',
    sublabelConcept: 'Concept mock-up',
    vinylSectionNote: 'Art direction and graphic production for real physical releases: back covers, inner layouts, vinyl labels, CDs and, on selected releases, cassette editions. Each piece is adapted from the visual language of the original cover artwork to keep a coherent identity across the whole musical object, prepared for international distribution through European labels such as High Roller Records.',
    vinylFeaturedSublabel: 'Complete physical-edition study: front cover, back cover, label, insert and final artwork',
    vinylFeaturedDesc: 'Main case study for the section: a full presentation board showing the process applied to this kind of release, from cover-art adaptation to inner pieces, print specifications and final mock-up.',
    vinylRelatedNote: 'The same adaptation, layout and print-ready artwork process was applied to other releases, preserving each cover identity while solving the physical pieces required for each edition.',
    posterSectionNote: "A concert's visual communication also needs to respect the artist's universe. Each poster starts from the event concept, information hierarchy and the band's graphic language to create a promotional piece with presence, readability and visual coherence.",
    reelsSectionNote: 'I have also developed reels for music promotion campaigns: single releases, audience-growth ads, social-follow calls and short-form pieces adapted to the rhythm, tone and identity of each artist.',
    artworkAlacranDesc: 'Developed from the initial idea through to final artwork: composition, main illustration, symbolic tension and a graphic finish built to work as a cover, printed piece and musical object.',
    artworkShekenDesc: 'A visual system built around gothic architecture, deep black, occult purple and aged gold. Each element —castle, moon, stars, cross and texture— is there to carry a narrative of mystery, ancient power and rebellion.',
    identityVioletDesc: 'A flat logo evolved into a stage-ready visual identity: chrome 3D, sharp bevels, controlled reflections and violet glow, turning the mark into a high-impact asset built for merchandise, promotional formats and music communication.',
    identityHittenDesc: 'A reread of the original mark without sanding down its attitude: the spikes, horizontal tension and classic band weight stay intact, while the planes are rebuilt with chrome bevels, cyan reflections and amber cuts. The study tests the logo on real uses —metal pin, black live backdrop and vintage T-shirt— to check contrast, scale and presence before locking the final version.',
    merchCiclonSublabel: 'Artwork adaptation for textile graphics',
    merchCiclonDesc: 'A comparative study showing how the original artwork was translated into a T-shirt graphic: figure selection, colour reduction, contrast, ink texture, vintage treatment, interaction with fabric, final mock-up and promotional social post. More than an isolated design, it shows production judgment and visual adaptation to a real format.',
    merchHittenSublabel: 'Multi-format textile adaptation system',
    merchHittenDesc: 'A graphic adaptation analysis from the original artwork into two textile formats: 3/4 raglan and standard black T-shirt. The study preserves composition, hierarchy, iconography and the source artwork’s visual language, while improving print readability through tonal reduction, reframing, logo prominence, typographic control and garment-finish testing.',
    largeFormatRollupTitle: 'Hitten — Promotional roll-up',
    largeFormatRollupSublabel: 'Digital design, prepress and installed final production',
    largeFormatRollupDesc: 'Production study for an 850 x 2000 mm roll-up, from final artwork to the installed piece. The layout documents scale adaptation, distance readability, typographic hierarchy, InDesign master-file setup, CMYK mode, Coated FOGRA39 profile, effective resolution, bleed, ink separations and PDF/X-1a:2001 export for print.',
    labelRollUp: 'Hitten - Advertising Roll Up',
    labelTshirtDesign: 'T-Shirt Design',
    designCatWeb: 'Web',
    designLabelHitten: 'Hitten — Official website',
    designTagWeb: 'Web design',
    sectionSoon: 'MORE COMING SOON',
    contactoTitle: "Let's talk",
    contactoDesc: "I'm looking for a frontend role where visual judgment, clean implementation and attention to detail matter.",
    contactoFinalDesc: 'Designer by background. Frontend developer focused on visual interfaces.',
    contactoLocation: 'Murcia / Barcelona · Remote / hybrid · Immediate availability',
    backToTop: '↑ Back to top',
    footer: '© 2026 Dani Meseguer. Made in Murcia 🍋',
    skillSoft1: 'Visual judgment',
    skillSoft2: 'Autonomy',
    skillSoft3: 'Communication',
    skillSoft4: 'Precision',
  }
};

let currentLang = localStorage.getItem('lang') || 'es';

function applyTranslations(lang) {
  const t = translations[lang];
  const cvHref = lang === 'es'
    ? 'img/CV%20Daniel%20Meseguer%202026%20ES.pdf'
    : 'img/CV%20Daniel%20Meseguer%202026%20EN.pdf';

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

  const toggle = document.getElementById('langToggle');
  toggle.textContent = lang === 'es' ? 'EN' : 'ES';
  toggle.setAttribute('aria-label', t.langToggleLabel);
  navToggle.setAttribute('aria-label', navbar.classList.contains('is-open') ? t.ariaCloseMenu : t.ariaOpenMenu);

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
    '.design-img--vinyl img, .design-img--vinyl-study img, .design-img--poster img, .design-img--identity img, .design-img--large-format img, .design-img--merch:not(.design-img--variant) img'
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
    const offset = 50 + progress * 7;
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
