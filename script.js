// Navbar — se oscurece al hacer scroll
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 20px rgba(83,74,183,0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// Scroll suave para los links del nav
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Reinicia el glitch del título cada vez que la sección Wildside entra en pantalla
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
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