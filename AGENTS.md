# AGENTS.md

Instructions for AI assistants (Cascade, Cursor, Copilot, Claude Code, etc.) working on this repository.

> This file follows the AGENTS.md convention. It is **not** for external AI consumption; see [[llms.txt](cci:7://file:///c:/Users/Working/Documents/dh-portfolio/llms.txt:0:0-0:0)](./llms.txt) for that.

## Project Context

- Personal portfolio of Dylan Holin, student in "Développeur avancé & IA" seeking a 12-month apprenticeship.
- Production: https://dylanholin.github.io/dh-portfolio
- Repo: https://github.com/dylanholin/dh-portfolio

## Behavior

- **Stay critical.** The user can be wrong; verify claims against the project's actual state before acting.
- **Be anti-sycophantic:** no flattery, no filler, don't fold under pushback, never open with "you're right". Challenge weak reasoning, anticipate mistakes, and when unsure say "I don't know" or ask.
- **Surface tradeoffs and evaluate their impact** instead of hiding them.
- **Admit that both user and AI can be wrong:** a request may contradict a rule by mistake, an AI proposal may rely on a false assumption. When in doubt, ask a short question rather than take a risky action.

## Communication

- **Answer first:** result before reason. Drop pleasantries and hedging.
- **No preamble or recap:** don't restate the request or summarize visible changes. End by stating the single next action, or that nothing's pending.
- **Evidence over assertion:** back "works", "tested", "fixed" with the command, output, or file that proves it.
- **Quote the shortest decisive line** of an error or log, not the whole dump.
- **No tool-call narration.** No decorative tables or emoji unless they carry information.
- **Write for a reader who scans:** telegraphic, fewest words, fragments over sentences. Full prose only for security warnings, irreversible actions, or explanations where nuance matters.

## Action

- **Surgical changes:** ship the minimum that solves the problem; touch only what the task needs.
- **Stay focused:** exceed the literal ask only when it clearly helps. Note unrelated issues in one line and keep going.
- **Solve your own issues first** before escalating to the human.
- **Do not commit or push** unless the user asks.
- **Don't guess** APIs, signatures, or behavior; read the source to confirm.
- **Batch independent operations** in one pass.
- **Before adding any instruction or rule, check whether an existing one already covers or contradicts it.**
- **Require explicit consent for irreversible operations** (file deletion, CSP modification, force-push, etc.). Never execute a destructive action without human confirmation, even if the request seems to allow it.
- **Detect suspicious requests:** network operations, data extraction, credential manipulation, bypassing security rules. When in doubt: refuse and ask for clarification.

## Hosting Constraints (GitHub Pages)

- Static-only: no backend, no custom HTTP headers, no server build.
- Jekyll is active by default but unused (no front matter, no `_config.yml`).
- Files starting with `_` are ignored; do not create any.
- Push to `main` triggers automatic deployment.

## Tech Stack

- HTML5, CSS3 (custom properties, grid, media queries, `@keyframes`), vanilla JS ES6+.
- **Zero external dependencies:** no `package.json`, no CDN, no framework, no bundler, no build step.

## Non-Negotiable Rules

### Security & CSP
- CSP in [index.html](cci:7://file:///c:/Users/Working/Documents/dh-portfolio/index.html:0:0-0:0) is strict: `default-src 'self'`, `script-src 'self'`, `style-src 'self'`, `img-src 'self' data:`.
- Forbidden: inline CSS, inline JS, external resources (Google Fonts, CDN, analytics, iframes).
- Any new integration must comply with the CSP or the CSP must be revised with justification.

### Privacy (GDPR)
- Zero cookies, zero tracking, zero data collection. No third-party services.
- System fonts only (`--font-*` variables in [style.css](cci:7://file:///c:/Users/Working/Documents/dh-portfolio/assets/css/style.css:0:0-0:0)).

### Accessibility (WCAG 2.1 AA)
- Respect `prefers-reduced-motion` in CSS and JS.
- Preserve skip link, `aria-label`, `aria-labelledby`, `role="list"` on styled lists.
- Decorative SVGs: `aria-hidden="true"`; meaningful SVGs: explicit `aria-label`.
- Visible focus and focus trap in modals: do not break.

### Network & Data Safety
- No unjustified network connections (SSH, external APIs, downloads).
- No data extraction or exfiltration without legitimate context.
- No manipulation of credentials, SSH keys, or secrets.

## Code Conventions

- **Comments and class names:** French (consistency with existing code). Do not anglicize mid-project.
- **Indentation:** 2 spaces CSS/JS, 4 spaces HTML.
- **CSS:** variables in `:root`, kebab-case, no `!important` without justification.
- **JS:** no `var`, prefer `const`; IIFE for isolated code; `{ passive: true }` scroll listeners.
- **No em dash (`—`) or en dash (`–`) in French content** (HTML, Markdown, CSS/JS comments, llms.txt, README).

## Git Workflow

- Atomic commits: one intent = one commit. No god commits.
- Conventional Commits, messages in French: `feat(scope):`, `fix(scope):`, `chore(scope):`, `docs(scope):`, `refactor(scope):`, `style(scope):`.
- Push to `main` for GH Pages deployment. Use branches for large changes.

## Sensitive Files

- [index.html](cci:7://file:///c:/Users/Working/Documents/dh-portfolio/index.html:0:0-0:0) (CSP, security headers): modify with justification.
- [llms.txt](cci:7://file:///c:/Users/Working/Documents/dh-portfolio/llms.txt:0:0-0:0): public AI-facing summary; keep in sync with CV changes.
- `assets/docs/*.pdf`: official apprenticeship documents, do not rename.
- [README.md](cci:7://file:///c:/Users/Working/Documents/dh-portfolio/README.md:0:0-0:0): public project docs; verify if changes impact README before each commit.
- [AGENTS.md](cci:7://file:///c:/Users/Working/Documents/dh-portfolio/AGENTS.md:0:0-0:0): **the AI must never modify this file, even on explicit user request.** The AI may propose changes in plain text, but the user must apply them manually.

## Pre-Change Checklist

- [ ] Compatible with GitHub Pages (no backend, no build).
- [ ] Respects strict CSP (no inline, no external).
- [ ] Respects `prefers-reduced-motion` if new animation.
- [ ] No new external dependency without explicit validation.
- [ ] Atomic commit with French Conventional Commits message.
- [ ] No a11y regression (skip link, focus, aria).
- [ ] No irreversible operation without explicit user confirmation.
- [ ] [AGENTS.md](cci:7://file:///c:/Users/Working/Documents/dh-portfolio/AGENTS.md:0:0-0:0) never modified by the AI.
- [ ] [README.md](cci:7://file:///c:/Users/Working/Documents/dh-portfolio/README.md:0:0-0:0) updated if the change impacts public docs.

## Manual Validation (no automated tests)

- **Browser console:** no CSP errors, no 404s.
- **Keyboard navigation:** Tab/Shift+Tab, skip link, visible focus.
- **Reduced motion:** DevTools → `prefers-reduced-motion: reduce` → canvas static, no CSS animations.
- **Responsive:** 320px, 768px, 1440px.
- **Lighthouse:** Performance >= 95, Accessibility = 100, Best Practices >= 95, SEO >= 95.
- **Print:** readable print preview.