# Catholic Devotional App — Implementation Guide

## Overview

This is a **design system + interactive prototype** for a minimalist Catholic mobile app that displays saint quotes and images. The app is optimized for children (10+) and families.

### Key Features
- ✝️ Full-screen saint images with quotes below
- 🎯 Tap: load next random saint quote (fade transition)
- 👆 Double-tap: open theme filter menu + settings
- ⭐ Favorites system (persisted to localStorage)
- 🌍 Bilingual (PT-BR / EN)
- 🔤 Adjustable text sizes
- 📱 Mobile-first, responsive design

---

## Files Provided

### 1. **Catholic Devotional Design System.dc.html**
A comprehensive design system reference showing:
- **Color palette** (ivory, midnight, gold, electric blue)
- **Typography** (Playfair Display, DM Sans, DM Mono)
- **Components** (buttons, cards, theme pills, settings panel)
- **Spacing grid** (8-point scale)
- **Interaction patterns** (tap, double-tap, favorites)
- **React component structure** recommendations

**Use this** to:
- Understand the visual language
- Share with designers/developers
- Reference CSS variables and classes
- Follow design principles (minimalist, contemplative, accessible)

### 2. **Catholic App - Interactive Prototype.dc.html**
A fully functional React prototype with:
- Full-screen image + quote card layout
- Single-tap: load next random saint
- Double-tap: open menu
- Theme filtering (Eucaristia, Missa, Liturgia, Oração, Sacramentos, Virtudes)
- Settings (text size: sm/md/lg, language: PT/EN)
- Favorites system (heart icon, localStorage persistence)
- Smooth fade/slide animations

**Use this** to:
- Test interactions and flows
- Understand state management patterns
- Use as a template for your React app
- Share with stakeholders for feedback

---

## Architecture

### Component Structure

```
<App>
  ├─ <Header>
  │  └─ Saint name, icon, eyebrow label
  ├─ <ImageContainer>
  │  ├─ Full-screen image (placeholder or backend image)
  │  └─ Fade transition on tap
  ├─ <QuoteCard>
  │  ├─ Theme label (tag)
  │  ├─ Quote text (italic, left-border gold)
  │  └─ Tap hint
  └─ <DoubleTabMenu> (modal)
     ├─ Theme filter (pills)
     ├─ Text size (radio buttons)
     ├─ Language (radio buttons)
     ├─ Favorite toggle (button)
     └─ Close button
```

### State Management

```javascript
state = {
  currentSaint: { name, icon, quote, theme, image },
  selectedTheme: 'eucaristia' | 'missa' | 'liturgia' | 'oracao' | 'sacramentos' | 'virtudes' | null,
  menuOpen: boolean,
  favorites: [saintId, ...], // persisted to localStorage
  settings: {
    textSize: 'sm' | 'md' | 'lg',
    language: 'pt' | 'en'
  },
  fadeState: 'fade-in' | 'fade-out' // for image transitions
}
```

### Key Methods

- `handleTap()` — Single tap: load next saint; Double tap (300ms): open menu
- `selectTheme(theme)` — Toggle theme filter
- `toggleFavorite()` — Add/remove from favorites (localStorage)
- `setTextSize(size)` — Update text size setting
- `setLanguage(lang)` — Switch language
- `getFilteredSaints()` — Return saints by selected theme (or all if null)

---

## Backend Integration

### Saints Data Structure

Each saint should have this structure:

```javascript
{
  id: 1,
  name: "Santo Agostinho",
  icon: "✝️", // or emoji, or you can use SVG/image paths
  theme: "EUCARISTIA", // display label
  themeValue: "eucaristia", // key for filtering
  image: "https://backend.com/storage/santo-agostinho.jpg", // from backend
  quote: "A Eucaristia é o alimento...",
  age: "c. 354–430" // optional
}
```

### API Endpoint (suggested)

```
GET /api/saints
Query params:
  - theme?: string (filter by theme)
  - random?: boolean (if true, return 1 random saint)
  - language?: 'pt' | 'en'

Response:
{
  "data": [
    { id, name, icon, theme, themeValue, image, quote, age },
    ...
  ]
}
```

### Image Storage

- Images are served from backend storage (as mentioned in your requirements)
- Path: `{{ currentSaint.image }}` (URL string from API)
- Fallback: emoji icon (✝️) for development/testing
- Recommendation: Store high-quality vertical images (portrait aspect ratio)
  - Suggested sizes: 480×640px or 540×720px (mobile-optimized)
  - Format: JPEG (smaller) or WebP (modern browsers)

---

## Color Palette (CSS Variables) — Manuscrito Iluminado

```css
:root {
  --parchment: #F2E9D2;       /* Primary surface (the "paper") */
  --parchment-light: #F7F0DD; /* Cards, bottom sheet */
  --parchment-deep: #ECE4D0;  /* Page background */
  --wine: #5E2230;            /* Primary / liturgical, active states */
  --wine-deep: #3E1620;       /* Image gradient base */
  --wine-light: #7A3A40;      /* Image gradient highlight */
  --gold: #A98B48;            /* Sacred accent — frames, active */
  --gold-light: #D9C081;      /* Gold on dark (motifs, cross) */
  --gold-deep: #8A6D2F;       /* Gold text on parchment */
  --ink: #2E2419;             /* Primary text on parchment */
  --ink-soft: #5B513C;        /* Secondary / body text */
  --cream-text: #F7EED7;      /* Text on wine */
  --clay: #B5613C;            /* Favorite / heart accent */
}
```

---

## Typography

All fonts are loaded from **Google Fonts** (no TTF files needed):

- **Cormorant Garamond** (Serif) — Saint names, quotes, display headlines. Italic carries the emotion.
- **Mulish** (Sans) — Body, UI, labels, eyebrows. Humanist & highly legible for children.
- *(EB Garamond optional for long-form body if needed.)*

Base font size: **16px** (body) · Quote display: **20–28px**
Minimum readable: **12px** (labels, hints)
Line height: **1.6** (body), **1.4** (quotes)

---

## Spacing Scale (8-point grid)

```
4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 100px
```

- Header padding: 12px (vertical), 16px (horizontal)
- Quote card padding: 20px
- Menu panel padding: 24px
- Section spacing: 48px (vertical)
- Gap between items: 8px to 16px

---

## Interactions & Animations

### Tap Behavior
1. **Single tap** (< 300ms gap):
   - Load next random saint
   - Fade out (220ms) → swap data → fade in (220ms)
   - Transition: `cubic-bezier(0.2, 0.8, 0.2, 1)` (calm ease)

2. **Double-tap** (< 300ms gap):
   - Open menu modal
   - Slide up from bottom (300ms)
   - Background overlay fades in

### Menu Interactions
- **Close button** or click overlay → slide down + fade out menu
- **Theme pill** → toggle filter, refresh saint list
- **Settings** → persist to localStorage immediately
- **Favorite button** → toggle star, persist to localStorage

### Animations
```css
Fade transition:  220ms cubic-bezier(0.2, 0.8, 0.2, 1)
Slide up (menu):  300ms cubic-bezier(0.2, 0.8, 0.2, 1)
Button hover:     160ms ease-out
```

---

## Responsive Design

### Mobile-First
- Base: 480px width (typical smartphone)
- Container max-width: 480px with center margin
- Padding: 16–24px (never cramped)
- Images: 100% width, fill vertical space

### Tablet (600px+)
- Layout remains single-column
- Increase font sizes slightly if needed
- More whitespace on sides

### Desktop (Preview/Testing)
- Box shadow around container simulates device
- Max-width enforced (480px)

---

## Persistence (localStorage)

The app uses localStorage for three pieces of state:

### 1. Favorites
```javascript
localStorage.getItem('catholicApp_favorites') 
// Returns: [1, 3, 5, ...] (array of saint IDs)
```

### 2. Settings
```javascript
localStorage.getItem('catholicApp_settings')
// Returns: { textSize: 'md', language: 'pt' }
```

### 3. (Optional) Last Viewed Saint
```javascript
// You can add:
localStorage.getItem('catholicApp_lastSaint')
// Returns: { id: 1, timestamp: 1718400000 }
// Useful for resuming where user left off
```

---

## Bilingual Support (PT-BR / EN)

### Current Translations

**Portuguese (PT-BR):**
- "SANTO DO DIA" (header)
- "Toque para próxima · Duplo toque para menu" (hint)
- "Filtrar por Tema", "Tamanho do Texto", "Idioma" (menu labels)
- "Adicionar aos Favoritos" / "Remover de Favoritos"

**English:**
- "SAINT OF THE DAY"
- "Tap for next · Double-tap for menu"
- "Filter by Theme", "Text Size", "Language" (menu labels)
- "Add to Favorites" / "Remove from Favorites"

To add more strings: create a `translations.json` or use i18n library.

---

## Development Checklist

- [ ] Copy mock saint data → replace with API calls to backend
- [ ] Implement `/api/saints` endpoint (with theme filtering)
- [ ] Integrate image storage URLs (replace emoji placeholders)
- [ ] Test localStorage persistence (favorites, settings)
- [ ] Add more saints (currently 6 mock saints)
- [ ] Implement swipe gestures (left = next, right = prev)
- [ ] Add share functionality (share quote to social media)
- [ ] Implement favorites screen (view saved quotes)
- [ ] Add saint biography section (optional)
- [ ] Test on real devices (iOS/Android)
- [ ] Set up analytics (track favorite saints, themes)
- [ ] Optimize image loading (lazy load, compress)
- [ ] Add offline support (service worker, cache saints)

---

## Design System Principles

1. **Minimalist** — No decoration, every element has purpose
2. **Accessible** — Readable typography, sufficient contrast, no micro-text
3. **Contemplative** — Generous whitespace, calm animations, no urgency
4. **Mobile-first** — Vertical priority, touch-friendly targets (44px min)
5. **Traditional + Modern** — Gold accents + clean interface, no kitsch
6. **Inclusive** — PT + EN, adjustable text, no assumed theological knowledge

---

## Next Steps

1. **Review the design system** — Share with team, align on aesthetics
2. **Test the prototype** — Click around, understand interactions
3. **Plan backend structure** — Design saints API, image storage
4. **Set up React project** — Copy component structure from prototype
5. **Integrate backend** — Replace mock data with API calls
6. **Add more saints** — Build comprehensive database
7. **Polish & test** — Animations, performance, device compatibility
8. **Deploy** — Web app or native wrapper (React Native)

---

## Questions?

Refer back to:
- **Design System file** for visual decisions
- **Prototype file** for interaction code
- This guide for implementation details

Good luck! 🙏
