# dh-portfolio

Portfolio de Dylan Holin - Développeur avancé & IA. Le socle intensif de formation se termine fin juin 2026, recherche active d'une alternance Développeur & IA de 12 mois.

[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen?style=flat-square)](https://github.com/dylanholin/dh-portfolio)
[![RGPD](https://img.shields.io/badge/RGPD-Compliant-blue?style=flat-square)](https://www.cnil.fr/)
[![WCAG](https://img.shields.io/badge/WCAG-2.1_AA-8b5cf6?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![No Tracking](https://img.shields.io/badge/Tracking-None-critical?style=flat-square)](https://github.com/dylanholin/dh-portfolio)

<img width="1841" height="938" alt="Portfolio Preview" src="https://github.com/user-attachments/assets/fb77b0cd-6498-4115-9782-1e6ab627893c" />

## Voir le site

[https://dylanholin.github.io/dh-portfolio](https://dylanholin.github.io/dh-portfolio)

## Stack

- HTML5 sémantique & accessible (WCAG 2.1 AA visé)
- CSS3 (custom properties, grid, `@keyframes`, media queries, `prefers-reduced-motion`)
- JavaScript vanilla ES6+ (IIFE, IntersectionObserver, toggle de thème, modales)
- **Zéro dépendance externe, zéro build, zéro cookie**

## Sécurité et Confidentialité

Parce que votre vie privée mérite mieux et que la sécurité ne doit pas être une option.

Ce portfolio applique les bonnes pratiques de sécurité et de confidentialité RGPD dès la première ligne de code, le tracking est tout simplement banni et le portfolio applique les recommandations OWASP et RGPD en vigueur

### Ce qui est sécurisé

**Content-Security-Policy strict:**
- `default-src 'self'` - Politique par défaut : ressources locales uniquement
- `script-src 'self'` - Scripts uniquement depuis le domaine (bye bye XSS)
- `style-src 'self'` - Styles externes uniquement (variables CSS, pas de inline)
- `img-src 'self' data:` - Images locales uniquement
- `font-src 'self'` - Polices locales uniquement (variables CSS, pas de Google Fonts)
- `frame-ancestors 'none'` - Protection contre clickjacking
- `connect-src 'self'` - Connexions uniquement vers le domaine
- `base-uri 'self'` - Empêche le détournement de l'URL de base du document
- `form-action 'self'` - Restreint la cible des formulaires au domaine

**Headers de sécurité (via meta tags http-equiv):**
- `X-Content-Type-Options: nosniff` - Protection MIME sniffing
- `X-Frame-Options: DENY` - Anti-clickjacking
- `Referrer-Policy: no-referrer` - Confidentialité des référents
- `Permissions-Policy` - Géolocalisation, caméra, microphone désactivés

> Note : `X-XSS-Protection` n'est volontairement pas utilisé (déprécié, retiré de Chrome, déconseillé par OWASP, il peut introduire des vulnérabilités dans certains scénarios). La protection repose sur la CSP stricte.

### Ce qui est privacy-friendly

- Zéro cookie, zéro tracking, zéro collecte de données
- Polices système (pas de Google Fonts qui vous traquent)
- Aucun script d'analytics tiers (pas de Google Analytics)
- Email Proton.me
- Mentions légales et politique de confidentialité transparentes

### Contexte GitHub Pages

GitHub Pages ne permet pas les HTTP headers côté serveur (dommage), donc on utilise les meta tags http-equiv. C'est moins efficace que les vrais headers, mais c'est la seule option dans ce cas sur cette plateforme... faut parfois faire avec ce qu'on a.

**Variables CSS pour polices système :** tout est dans `style.css` (`--font-heading`, `--font-body`, `--font-mono`). Pas de CSS inline, donc plus besoin de hash SHA-256. C'est plus simple et propre.

**Pourquoi ces choix :**
- Meta tags http-equiv = seule solution sur GitHub Pages
- Variables CSS = bonnes pratiques professionnelles (pas d'inline)
- CSP stricte simple = optimal sans complexité inutile

## Accessibilité

Objectif WCAG 2.1 AA. Concrètement :

- Skip link vers le contenu principal
- Navigation clavier complète + focus visible partout
- Focus trap dans les modales (mentions légales, confidentialité)
- **`prefers-reduced-motion` détecté automatiquement** : si le visiteur a activé l'option « Réduire les animations » dans les paramètres de son système (Windows, macOS, iOS, Android) ou de son navigateur, le site le détecte via l'API `matchMedia` et adapte le rendu : les animations CSS sont désactivées (y compris le blink du logo), le scroll smooth devient instantané, et le canvas spatial passe en mode statique. C'est un confort essentiel pour les personnes sensibles au mouvement (troubles vestibulaires, migraines).
- **Mode clair/nuit** : le site supporte le mode clair et le mode sombre via `prefers-color-scheme` et un toggle manuel accessible dans la navbar. Le choix utilisateur est persisté via localStorage (préférence locale). Le thème est cohérent sur toutes les sections (navbar, Hero, contact, footer, modales).
- Styles d'impression fournis PDF

## Structure

```
dh-portfolio/
├── index.html           # Page unique (toutes les sections)
├── assets/
│   ├── css/style.css    # Tous les styles (variables dans :root, responsive en fin)
│   ├── js/script.js     # Nav, scroll, animations, toggle de thème, modales
│   ├── images/          # favicon.svg, og-image (png + svg)
│   └── docs/            # PDF officiels (CV, programme, planning, coût)
├── llms.txt             # Résumé structuré pour les IA externes (recruteurs)
├── AGENTS.md            # Instructions pour les IA développeurs (Cascade, Cursor, etc.)
└── README.md            # Ce fichier
```

## Fichiers à destination des IA

Deux fichiers dédiés suivent les conventions émergentes en 2026. Ils ont chacun un rôle précis et **ne se chevauchent pas** :

- **`llms.txt`** : Résumé public destiné aux IA qui **consomment** le site (un recruteur qui demande à ChatGPT "résume-moi ce candidat"). Format [llmstxt.org](https://llmstxt.org).
- **`AGENTS.md`** : Instructions destinées aux IA qui **développent** sur le code (Cascade, Cursor, Copilot, Claude Code). Documente les contraintes GitHub Pages, la CSP, les règles d'accessibilité et le workflow Git attendu.

Petite experimentation, en 2026 les IA sont présentes partout, autant leur donner un point d'entrée propre plutôt que de les laisser deviner ce qu'il faut faire.

## Contact

- [holinpro@proton.me](mailto:holinpro@proton.me)
- [LinkedIn](https://www.linkedin.com/in/dylan-holin/) 
oui... j'optimise mes chances mais une alternative privacy friendly à linkedin serait bienvenue
