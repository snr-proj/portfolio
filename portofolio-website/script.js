/* ============================================================
   SHAIRA NICOLE RAMOS — Portfolio Script
   ============================================================ */

console.log("✦ Portfolio loaded — Shaira Nicole Ramos");

/* --- HERO LOAD TRIGGER --- */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

/* --- NAV SCROLL EFFECT --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveNav();
}, { passive: true });

/* --- MOBILE HAMBURGER --- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

/* Close menu on link click */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* --- ACTIVE NAV LINK --- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* --- SCROLL REVEAL --- */
const revealElements = document.querySelectorAll('.reveal');

/* Assign stagger indices */
document.querySelectorAll('.skills-grid .skill-card').forEach((el, i) => {
  el.style.setProperty('--i', i);
  el.classList.add('reveal');
});
document.querySelectorAll('.projects-grid .project-card').forEach((el, i) => {
  el.style.setProperty('--i', i);
  el.classList.add('reveal');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -48px 0px'
});

/* Re-query after adding classes */
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* --- CURSOR GLOW (desktop only) --- */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.classList.add('cursor-glow');
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

/* --- CONTACT FORM --- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✦ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #b5e8c8, #5cc88c)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

/* --- FLIP CARDS (tap to flip on mobile/touch) --- */
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

/* --- SMOOTH HERO PARALLAX --- */
window.addEventListener('scroll', () => {
  const blobs = document.querySelectorAll('.blob');
  const scrolled = window.scrollY;
  blobs.forEach((blob, i) => {
    const speed = 0.08 + i * 0.04;
    blob.style.transform = `translateY(${scrolled * speed}px)`;
  });
}, { passive: true });
