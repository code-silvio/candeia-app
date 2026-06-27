# Valumaris Design System

> *"Intelligence that illuminates."*

Data intelligence platform for tokenized real-world assets (RWA) in Latin America — the "Bloomberg of tokenizations." Documents in this system capture the brand language, visual foundations, iconography and UI kit for building anything Valumaris-branded.

---

## Brand Context

**Valumaris** is the data infrastructure of the **Valumaris Group**, a Brazilian ecosystem of products centered on tokenized assets. The Valumaris platform is the fundação (foundation) — it ingests data from real-world assets (imóveis, arte, commodities, recebíveis) and produces indicators of pricing, liquidity and risk, served to downstream products via API.

- **Category:** Data Intelligence Platform
- **Posicionamento:** Infraestrutura — not a consumer product, a data layer
- **Tagline principal:** *"Intelligence that illuminates."*
- **Institucional (PT):** *"Onde os dados ganham clareza."*
- **Produto (PT):** *"O indicador que você precisava ver."*
- **Ecosystem signal:** *"Powered by Valumaris."*

### The name
**VALUMARIS** — pronounced `/va·lu·'ma·ris/` — fuses two Latin roots:
- **vallis** — a valley; a convergence point
- **lumaris** — luminous; illuminating

Read as "the valley that illuminates." Valumaris is where all the data of a market converges, becomes visible, and becomes actionable. "Value" emerges naturally for English speakers. Linguistically coherent with its sibling product **Claritoken**.

### Ecosystem (hierarchy)
```
Valumaris (foundation) ── data · indicators · intelligence
     │
     ├── Claritoken ── marketplace de ativos tokenizados
     ├── [Product B]  (tbd)
     └── [Product C]  (tbd)
```
Products consume Valumaris. Valumaris does not depend on them.

### Audience
Marketplaces, funds, gestoras, family offices, any product that needs clean, verified data about digitized real assets. **Not retail investors.** The tone is serious, the visuals are instrument-grade.

---

## Sources

Everything in this system is derived from a single source:
- `uploads/valumaris-brand-identity.html` — the official v1.0 · 2026 brand identity document (PT-BR). A copy is preserved at `reference/valumaris-brand-identity.html`.

No codebase, Figma file, or product screenshots were provided. **UI-kit components are invented extrapolations** of the brand language applied to a plausible Valumaris product surface (a data terminal) — they are not recreations of real product code. Replace with real component references when available.

---

## Content Fundamentals

Valumaris's copy is **precise, direct, confident, serious but not cold.** It treats the reader as a professional. Every sentence must earn its place.

### Tone
- **Precise** — data always has context. Never numbers floating alone.
- **Direct** — one idea per sentence. No academic preamble.
- **Confident** — afirma, não especula. States, does not speculate.
- **Serious with humanity** — rigor without coldness. Technical without being hermetic.
- **Translator** — complexity explained, never hidden or dressed up.

### Voice principle
> *"Valumaris não interpreta o mercado para você. Ela o torna visível com exatidão suficiente para que você interprete com confiança."*
>
> *(Valumaris does not interpret the market for you. It makes it visible with enough precision for you to interpret with confidence.)*

### Writing rules
- **Language:** primary PT-BR. English for ecosystem signals and international comms. Never mix within a single sentence.
- **Person:** institutional third-person ("a Valumaris"), or direct second-person in product UI ("você"). Never "nós/we" in marketing.
- **Casing:**
  - Product name always all-caps when used as wordmark: **VALUMARIS**
  - Inline body use: "Valumaris" (title case)
  - UI labels: `ALL CAPS` with mono font and wide tracking — `0.22em`
  - Section eyebrows: `01 · POSICIONAMENTO` (mono, uppercase, wide-tracked)
  - Display headlines: sentence case, italic accents on the emphasis word
- **Punctuation:** em-dashes for asides; straight quotes acceptable; curly quotes preferred in display type.
- **Numbers:** always with units and context. `R$ 487,20` (BR format) and `+2,4%` (comma decimal). Tickers are `ALL-CAPS-HYPHENATED`: `CLR-IMOVEL-SP01`.
- **Zero emoji.** Zero exclamations. Zero urgency.
- **Jargão cripto:** avoid unless defined inline. The brand translates, it does not gatekeep.

### Do / Don't
| ✦ Fala assim                                          | ✗ Nunca fala assim                              |
|-------------------------------------------------------|-------------------------------------------------|
| "O indicador que você precisava ver."                 | "Revolucionário, disruptivo, game-changer"     |
| "Dados com contexto, nunca números soltos."           | Promessas de retorno sem base                  |
| "Especializada em RWA. Dados específicos, não ruído." | Urgência artificial / linguagem de vendas      |
| "Afirma, não especula."                               | Jargão cripto sem definição                    |
| Italic accents for emphasis, sparingly                | Emojis, exclamations, informal tone            |

### Voice examples lifted from the brand doc
- Missão: *"Transformar dados brutos de ativos reais em inteligência precisa — para que investidores, plataformas e gestores tomem decisões com clareza, não com ruído."*
- Visão: *"Ser a camada de dados de referência para todo o ecossistema de ativos tokenizados na América Latina — o Bloomberg das tokenizações."*
- Diferencial: *"Não agrega dados genéricos de cripto — especializada em RWA: imóveis, arte, commodities e recebíveis. Dados específicos, não ruído de mercado."*

---

## Visual Foundations

The Valumaris aesthetic is **premium data terminal meets editorial report.** Think Bloomberg Terminal filtered through a fine-press magazine. Every surface feels measured. Every line feels earned.

### Palette
Split into three functional tiers. Do not introduce new hues.

**Dark tier — primary marketing + product dark mode**
- `--midnight #0B1527` — primary dark background; terminal depth
- `--navy #152040` — secondary dark; section strips, cards
- `--navy-deep #0E1E3A` — alternating band

**Signal — the pulse of the platform**
- `--electric #1655C8` — primary action, data-in-motion, brand blue
- `--electric-light #3A78F0` — accent, hover, highlight on dark

**Light tier — reports, docs, product light mode**
- `--ivory #F7F5F0` — primary surface; the "report paper"
- `--cream #EDEAE3` — subtle divider / secondary surface
- `--white #FFFFFF` — cards, inputs

**Ink — text on light**
- `--ink #0D1520` — primary
- `--slate #3D5070` — body
- `--silver #7A8EA8` — muted labels
- `--mist #B8C4D4` — disabled

**Status — used sparingly, never decoratively**
- `--teal #0C7A6E` — positive / growth / market health
- `--gold #A87800` — alert / caution / highlight only

> **Filosofia:** *"Electric é a cor do dado em movimento. Midnight e Navy criam a profundidade de um terminal premium. Ivory é o papel do relatório: limpo, neutro, respeitoso com o conteúdo. A paleta deve sempre evocar precisão, não entusiasmo."*

### Typography
Three families, three roles. Never substitute.

- **Playfair Display** (serif) — `--font-display`
  Headlines, quotes, taglines, card titles. Italic is used **as an accent**, not for entire blocks. Italic carries the "insight" — the emphasis word in a sentence.
- **DM Sans** (sans) — `--font-body`
  UI, navigation, body copy. Weight range 200–500. Default body is **300** — light, airy, technical.
- **DM Mono** — `--font-mono`
  All data: tickers, prices, labels, timestamps, section eyebrows, API keys. The mono family is the brand's "terminal voice."

Italic-into-electric is the signature type move: a single emphasized word in an `<em>` flips to italic + `--electric`. Use it to mark the "insight" in a headline.

### Spacing
8-point grid with generous whitespace. Sections breathe at 100px vertical. Cards pad at 32–48px. Never cramped.

- `4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 100` (px)

### Borders, dividers, cards
- The system uses **hairline dividers** (`1px solid var(--cream)` on light, `1px solid rgba(255,255,255,0.07)` on dark).
- **Cards are not floaty.** They sit on 2px gaps over a `--cream` background that reads as a grid line. No drop shadows in the core layout. This is a "sheet of data" aesthetic.
- **Radii are minimal.** Most surfaces are sharp (0px). Only pills and tags use `--radius-pill`. Never round cards.
- The **"2px gap grid"** is a signature layout pattern — items sit on a `--cream` background with `gap: 2px`, making the gaps read as divider lines.

### Backgrounds
- Solid color only. **No gradients** in the core system (the cover has a single subtle radial glow — reserve for key moments).
- The `cover` pattern uses a 48px × 48px subtle line grid at `opacity: 0.04` on midnight — available as a texture for hero moments.
- No photography, no illustration. No patterns beyond the grid. The visual language is geometric and typographic.

### Animation
Restrained. Data platforms earn trust by feeling solid.
- Default easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` — calm ease-out
- Durations: `160 / 220 / 400` ms
- Entry: `fadeUp` — 20px translate + opacity, 0.9s, staggered by 150ms
- Hover: underline bar scales in from left (`transform: scaleX(0) → 1`, `0.3s ease`); border-left fills with electric; no color floods.
- **No bounces, no springs, no parallax, no scroll-jack.**

### Hover & press
- **Link / button hover:** color shift to `--electric-light`, or the 2px bottom-underline bar scales in.
- **Card hover:** a 2px electric border-bottom or border-left appears.
- **Press:** opacity drops to `0.85`. No shrink. No shadow lift.
- **Focus:** `outline: 2px solid var(--electric); outline-offset: 2px`.

### Transparency & blur
- Used on dark only, for overlays on electric glow: `rgba(255,255,255,0.04/0.08/0.12)`.
- No backdrop-filter / frosted glass. The brand is clear, not translucent.

### Imagery (when added)
- Cool-leaning. Desaturated. Never warm or golden-hour.
- Prefer black & white or near-monochrome with electric as the single colored accent.
- No people. No stock. Abstract architecture, data visualizations, or nothing at all.

### Cards — anatomy
```
┌─────────────────────────────┐
│ 01  (mono, cream bg number) │ ← optional big ghost numeral
│                             │
│ [EYEBROW LABEL]             │ ← mono, 10px, electric, wide track
│                             │
│ Headline or body            │ ← display italic, or body light
│                             │
└─────────────────────────────┘
 2px hover underline (electric, scaleX)
```

### Fixed elements / layout
- **Max content width:** 1100px, with 80px horizontal padding.
- Grid systems use `grid-template-columns: repeat(N, 1fr); gap: 2px` on a `--cream` background — this is the signature "sheet" layout.
- Sections separated by `<hr>` rules in `--cream`, never in color.

---

## Iconography

The source brand doc ships **no external icon library**. Valumaris's "iconography" is essentially:

1. **The brand mark itself** — a glyph system derived from the logo: a V-shaped polyline with data points and a vertical light beam. Four official variants live in `assets/`:
   - `logo-mark.svg` — reversed (on midnight), full anatomy with grid lines
   - `logo-mark-light.svg` — on ivory, full anatomy
   - `logo-mark-mini.svg` — simplified, for favicon / app icon
   - `logo-mark-reversed.svg` — monochrome white, for electric backgrounds
2. **Hairline UI glyphs** — used throughout the brand doc: arrows (`→`), check (`✓`), cross (`✗`), plus (`+`), bullet dash (`—`). These are **Unicode characters**, not icon fonts.
3. **Data glyphs / directional marks** — `↑ ↓` for movement, rendered in `--teal` (up) and `--gold` (down). Variation deltas use plain `+2,4%` / `-0,8%` with color encoding, never arrow-clutter.

**Emoji: never.** Exclamations: never. Decorative icons: never.

### Substitution (flagged)
For UI elements in the UI kit — chevrons, menus, settings, close — we use **[Lucide](https://lucide.dev)** via CDN at `1.25px` stroke weight. Rationale: Lucide's hairline, geometric, utility-first look matches the brand's "instrument-grade" feel. This is a **substitution** — the brand has no officially-specified UI icon set. See `assets/README.md` once you're ready to swap to an official set.

```html
<!-- Load Lucide via CDN -->
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="arrow-right" style="stroke-width:1.25"></i>
<script>lucide.createIcons();</script>
```

Rules for icon use:
- Stroke weight **1–1.5px only.**
- Color inherits from text color (`--silver` default, `--electric` when active).
- Size pairs with type: 16px with body, 20px with UI labels, 12px in tickers.
- Never filled. Never two-tone. Never decorative — icons are always adjacent to a word.

---

## Index — manifest of this system

Root files:
- `README.md` — this file
- `SKILL.md` — portable skill descriptor (Claude Code compatible)
- `colors_and_type.css` — all tokens (colors, type, spacing, motion) + semantic classes

Folders:
- `assets/` — logo variants (`logo-mark*.svg`)
- `reference/` — the original uploaded brand identity doc
- `preview/` — design system cards (one card = one concept)
- `ui_kits/valumaris-platform/` — the Valumaris Platform UI kit (core product surface)

### UI kits
- **`ui_kits/valumaris-platform/`** — data terminal for the Valumaris platform. Key components: header/sidebar, asset list, price ticker rail, detail panel, API snippet block, empty states.

### How to use this system
1. Import `colors_and_type.css` at the top of any HTML artifact.
2. Use semantic classes (`.display-section`, `.eyebrow`, `.ticker`) rather than restating values.
3. For UI work, copy components from `ui_kits/valumaris-platform/` and compose. Don't recreate from screenshots.
4. For brand/marketing work, lean on `reference/valumaris-brand-identity.html` as the tonal anchor.

---

## Substitutions & caveats

- **Fonts**: Playfair Display, DM Sans, DM Mono — all loaded from Google Fonts (no TTFs required; these are the officially-specified families). No substitution needed.
- **Icons**: Lucide (CDN) as a substitution for unspecified UI glyphs. Flag for the user if a formal icon set is adopted.
- **UI kit**: no product codebase or Figma was provided, so the Valumaris Platform kit is an invented extrapolation of the brand language. Treat it as a starting point, not a recreation.
- **Portuguese first**: all UI copy is in PT-BR per the brand doc's primary language. English versions can be added if needed.
