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

// ══════════════════════════════════════════════════════════
// ══  HERO CANVAS - Infrastructure Active Salle de Contrôle  ══
// ══════════════════════════════════════════════════════════
(function() {
  const canvas = document.getElementById('pixel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let W, H, prevW = 0;
  
  // Lecture des couleurs depuis les variables CSS (theming friendly)
  function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  
  const C = {
    grid: getCSSVar('--hero-canvas-grid'),
    gridHover: getCSSVar('--hero-canvas-grid-hover'),
    node: getCSSVar('--hero-canvas-node'),
    nodeActive: getCSSVar('--hero-canvas-node-active'),
    edge: getCSSVar('--hero-canvas-edge'),
    packet: getCSSVar('--hero-canvas-packet'),
    radar: getCSSVar('--hero-canvas-radar'),
    radarSweep: getCSSVar('--hero-canvas-radar-sweep'),
    scan: getCSSVar('--hero-canvas-scan'),
    scanActive: getCSSVar('--hero-canvas-scan-active')
  };
  
  let gridNodes = [], gridEdges, packets = [], radarAngle = 0, scanY = 0, exclusionZones = [];

  // Calcule les zones protégées depuis les positions réelles des éléments texte
  function calcExclusionZones() {
    exclusionZones = [];
    const canvasRect = canvas.getBoundingClientRect();
    ['.hero-badge', '.hero-contenu'].forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      const r = el.getBoundingClientRect();
      exclusionZones.push({
        x: r.left - canvasRect.left,
        y: r.top  - canvasRect.top,
        w: r.width,
        h: r.height
      });
    });
  }

  // Vérifie si (x, y) tombe dans une zone protégée (avec marge autour)
  function isInTextZone(x, y, margin = 10) {
    return exclusionZones.some(z =>
      x > z.x - margin && x < z.x + z.w + margin &&
      y > z.y - margin && y < z.y + z.h + margin
    );
  }
  
  // Position aléatoire hors zone texte
  function randomPosOutsideText() {
    let x, y, attempts = 0;
    do {
      x = Math.random() * W;
      y = Math.random() * H;
      attempts++;
    } while (isInTextZone(x, y, 15) && attempts < 50);
    return { x, y };
  }
  
  function resize() {
    const newW = canvas.offsetWidth;
    W = canvas.width = newW;
    H = canvas.height = canvas.offsetHeight;
    calcExclusionZones();
    if (prevW !== newW) {
      prevW = newW;
      init();
      if (motionQuery.matches && canvasVisible && !document.hidden) {
        draw(performance.now());
      }
    }
  }
  
  // Dessiner un pixel
  function px(x, y, color, alpha = 1) {
    if (x < 0 || x > W || y < 0 || y > H) return;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
  }
  
  // Dessiner une ligne
  function line(x1, y1, x2, y2, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  
  function init() {
    // Noeuds de la grille d'infrastructure (hors zone texte)
    gridNodes = [];
    const nodeCount = 7;
    for (let i = 0; i < nodeCount; i++) {
      const pos = randomPosOutsideText();
      gridNodes.push({
        x: pos.x,
        y: pos.y,
        active: false,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
    
    // Segments reliant les noeuds
    gridEdges = [];
    for (let i = 0; i < gridNodes.length; i++) {
      for (let j = i + 1; j < gridNodes.length; j++) {
        if (Math.random() > 0.4) {
          gridEdges.push({ from: i, to: j });
        }
      }
    }
    
    // Paquets lumineux sur les segments
    packets = [];
    gridEdges.forEach(edge => {
      if (Math.random() > 0.5) {
        packets.push({
          edgeIndex: gridEdges.indexOf(edge),
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.003
        });
      }
    });
    
    // Reset animations
    radarAngle = 0;
    scanY = 0;
  }
  
  
  // ══════════════════════════════════════════════════════════
  // ══  DESSIN INFRASTRUCTURE ACTIVE                      ══
  // ══════════════════════════════════════════════════════════
  
  function drawGrid(timestamp) {
    // Quadrillage fin en fond
    const gridSize = 30;
    for (let x = 0; x < W; x += gridSize) {
      line(x, 0, x, H, C.grid, 0.5);
    }
    for (let y = 0; y < H; y += gridSize) {
      line(0, y, W, y, C.grid, 0.5);
    }
  }
  
  function drawNodes(timestamp) {
    const time = timestamp * 0.001;
    gridNodes.forEach((node, i) => {
      // Pulse discret
      const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 0.7;
      const nodeColor = node.active ? C.nodeActive : C.node;
      const nodeAlpha = node.active ? 0.9 : 0.5;
      
      // Dessiner le noeud (cercle)
      ctx.globalAlpha = nodeAlpha * pulse;
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Activation aléatoire
      if (Math.random() > 0.995) {
        node.active = true;
        setTimeout(() => { node.active = false; }, 500);
      }
    });
  }
  
  function drawEdges(timestamp) {
    gridEdges.forEach(edge => {
      const fromNode = gridNodes[edge.from];
      const toNode = gridNodes[edge.to];
      line(fromNode.x, fromNode.y, toNode.x, toNode.y, C.edge, 0.4);
    });
  }
  
  function drawPackets(timestamp) {
    packets.forEach(packet => {
      const edge = gridEdges[packet.edgeIndex];
      const fromNode = gridNodes[edge.from];
      const toNode = gridNodes[edge.to];
      
      // Position du paquet sur le segment
      const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
      const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress;
      
      // Dessiner le paquet
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = C.packet;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Avancer le paquet
      packet.progress += packet.speed;
      if (packet.progress >= 1) packet.progress = 0;
    });
  }
  
  function drawRadar(timestamp) {
    const centerX = W / 2;
    const centerY = H / 2;
    const maxRadius = Math.min(W, H) * 0.4;
    
    // Arcs concentriques
    for (let r = 50; r < maxRadius; r += 60) {
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = C.radar;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Balayage rotatif lent
    const sweepX = centerX + Math.cos(radarAngle) * maxRadius;
    const sweepY = centerY + Math.sin(radarAngle) * maxRadius;
    line(centerX, centerY, sweepX, sweepY, C.radarSweep, 0.5);
    
    // Point d'echo sur le balayage
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = C.radarSweep;
    ctx.beginPath();
    ctx.arc(sweepX, sweepY, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  function drawScan(timestamp) {
    // Bande lumineuse horizontale lente
    const scanHeight = 3;
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = C.scan;
    ctx.fillRect(0, scanY, W, scanHeight);
    
    // Focus rectangulaire discret sur le badge
    const badge = document.querySelector('.hero-badge');
    if (badge) {
      const r = badge.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const bx = r.left - canvasRect.left;
      const by = r.top - canvasRect.top;
      const bw = r.width;
      const bh = r.height;
      
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = C.scanActive;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx - 5, by - 5, bw + 10, bh + 10);
    }
  }
  
  // ══════════════════════════════════════════════════════════
  // ══  BOUCLE PRINCIPALE                                    ══
  // ══════════════════════════════════════════════════════════
  
  function update(timestamp) {
    // Rotation radar (lente)
    radarAngle += 0.005;
    if (radarAngle > Math.PI * 2) radarAngle = 0;
    
    // Scan vertical (lent)
    scanY += 0.3;
    if (scanY > H) scanY = 0;
  }
  
  function draw(timestamp) {
    ctx.clearRect(0, 0, W, H);
    
    // Fond quadrillage
    drawGrid(timestamp);
    
    // Segments reliant les noeuds
    drawEdges(timestamp);
    
    // Paquets lumineux
    drawPackets(timestamp);
    
    // Noeuds
    drawNodes(timestamp);
    
    // Radar tactique
    drawRadar(timestamp);
    
    // Scan de sécurité
    drawScan(timestamp);
    
    ctx.globalAlpha = 1;
  }
  
  let animationId = null;
  let canvasVisible = true;
  let lastFrameTime = 0;
  const MIN_FRAME_DELTA = 1000 / 60; // plafonne à ~60 FPS (écrans 120/144 Hz)

  // Respect de prefers-reduced-motion : on dessine une seule frame statique
  // et on n'anime pas (positions/flammes/scintillement figés).
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function startLoop() {
    if (animationId || !canvasVisible || document.hidden) return;
    if (motionQuery.matches) {
      // Frame unique, pas de boucle rAF
      draw(performance.now());
      return;
    }
    animationId = requestAnimationFrame(loop);
  }

  // Pause l'animation quand le canvas sort du viewport (économie CPU/GPU)
  const canvasObserver = new IntersectionObserver((entries) => {
    canvasVisible = entries[0].isIntersecting;
    if (canvasVisible) startLoop();
  }, { threshold: 0 });
  canvasObserver.observe(canvas);

  function loop(timestamp) {
    if (!canvasVisible || document.hidden || motionQuery.matches) {
      animationId = null;
      return;
    }
    if (timestamp - lastFrameTime < MIN_FRAME_DELTA) {
      animationId = requestAnimationFrame(loop);
      return;
    }
    lastFrameTime = timestamp;
    update();
    draw(timestamp);
    animationId = requestAnimationFrame(loop);
  }

  // Debounce du resize : évite de ré-initialiser étoiles/nébuleuses à chaque event
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  resize();
  startLoop();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else {
      startLoop();
    }
  });

  // Réagit au changement de préférence système (ex. utilisateur active/désactive
  // "réduire les animations" pendant la session)
  motionQuery.addEventListener('change', () => {
    if (motionQuery.matches) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      draw(performance.now());
    } else {
      startLoop();
    }
  });
})();

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
