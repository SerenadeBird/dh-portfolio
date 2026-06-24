// ══════════════════════════════════════════════════════════
// ══  Portfolio Dylan Holin - Scripts                     ══
// ══════════════════════════════════════════════════════════

// ── Navigation scroll state ──
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Mobile menu ──
const menuBtn = document.getElementById('menu-btn');
const navLiens = document.getElementById('nav-liens');
menuBtn.addEventListener('click', () => {
  const isOpen = navLiens.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
});
navLiens.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLiens.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// ── Scroll animations ──
const animatedEls = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      observer.unobserve(el.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
animatedEls.forEach(el => observer.observe(el));

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-liens a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ── Année dynamique footer ──
document.getElementById('annee-footer').textContent = new Date().getFullYear();

// ── Deplier/reduire le texte "Realisation" des cartes projets ──
const projetRealisations = document.querySelectorAll('.projet-realisation');
const checkDebordement = () => {
  projetRealisations.forEach(p => {
    if (p.classList.contains('expanded')) return;
    const btn = p.parentElement.querySelector('.projet-deplier');
    if (!btn) return;
    if (p.scrollHeight > p.clientHeight + 2) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
      p.classList.add('expanded');
    }
  });
};
checkDebordement();
window.addEventListener('resize', checkDebordement, { passive: true });

document.querySelectorAll('.projet-deplier').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = btn.parentElement.querySelector('.projet-realisation');
    const isExpanded = p.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', isExpanded);
    const label = btn.querySelector('.deplier-label');
    if (label) label.textContent = isExpanded ? 'Reduire' : 'Lire la suite';
  });
});

// ── Modal RGPD (avec focus trap pour accessibilité) ──
function openModal(target) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  document.body.appendChild(overlay);
  target.classList.add('modal-visible');
  
  // Sauvegarder l'élément qui avait le focus
  const previousFocus = document.activeElement;
  
  // Focus trap : éléments focusables dans la modale
  const focusableEls = target.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusable = focusableEls[0];
  const lastFocusable = focusableEls[focusableEls.length - 1];
  
  // Focus sur le bouton fermer
  firstFocusable?.focus();
  
  const close = () => {
    target.classList.remove('modal-visible');
    if (document.body.contains(overlay)) document.body.removeChild(overlay);
    document.removeEventListener('keydown', handleKeydown);
    // Restaurer le focus
    previousFocus?.focus();
  };
  
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    // Focus trap : Tab cycling dans la modale
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };
  
  overlay.addEventListener('click', close, { once: true });
  target.querySelector('.modal-close')?.addEventListener('click', close, { once: true });
  document.addEventListener('keydown', handleKeydown);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target && target.classList.contains('modal-content')) {
      e.preventDefault();
      openModal(target);
    }
  });
});

// ── Bouton "Copier l'email" ──
// Copie la valeur de data-copy dans le presse-papier, swap d'icône
// instantané (.copied), revert après 2s, annonce SR via aria-live.
document.querySelectorAll('.btn-copy').forEach(btn => {
  const labelDefault = btn.getAttribute('aria-label') || 'Copier';
  const status = document.getElementById('copy-status');
  let resetTimer;
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      btn.setAttribute('aria-label', 'Adresse email copiée');
      if (status) status.textContent = 'Adresse email copiée dans le presse-papier';
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        btn.classList.remove('copied');
        btn.setAttribute('aria-label', labelDefault);
        if (status) status.textContent = '';
      }, 2000);
    } catch (err) {
      console.error('Échec de la copie dans le presse-papier :', err);
    }
  });
});

// ── Toggle theme (mode clair/nuit) ──
// Sauvegarde la préférence utilisateur dans localStorage
// Prime sur prefers-color-scheme
(function() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const THEME_KEY = 'portfolio-theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';

  // Récupérer le thème sauvegardé ou utiliser la préférence système
  function getInitialTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === THEME_LIGHT || savedTheme === THEME_DARK) {
      return savedTheme;
    }
    // Pas de préférence sauvegardée, utiliser prefers-color-scheme
    return window.matchMedia('(prefers-color-scheme: light)').matches ? THEME_LIGHT : THEME_DARK;
  }

  // Appliquer le thème
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Mettre à jour l'aria-label du bouton
    const newLabel = theme === THEME_LIGHT ? 'Passer en mode sombre' : 'Passer en mode clair';
    themeToggle.setAttribute('aria-label', newLabel);
  }

  // Initialisation
  const initialTheme = getInitialTheme();
  setTheme(initialTheme);

  // Toggle au clic
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    setTheme(newTheme);
  });

  // Écouter les changements de préférence système (seulement si pas de préférence manuelle)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Ne changer que si l'utilisateur n'a pas de préférence manuelle
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? THEME_DARK : THEME_LIGHT);
    }
  });
})();
