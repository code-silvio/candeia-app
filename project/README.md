# Catholic Devotional App — Complete Design System & Implementation Kit

## 📱 O que você tem aqui

Você recebeu um **design system completo** + **prototype interativo** para um aplicativo móvel católico minimalista. Tudo pronto para passar para seu time de desenvolvimento.

### Arquivos entregues:

1. **`Catholic Devotional Design System.dc.html`** — Design system visual (cores, tipografia, componentes)
2. **`Catholic App - Interactive Prototype.dc.html`** — Prototype funcional com todas as interações
3. **`IMPLEMENTATION_GUIDE.md`** — Guia técnico completo para desenvolvimento
4. **`SAINTS_DATA_TEMPLATE.json`** — 15 santos de exemplo com dados estruturados
5. **`REACT_COMPONENTS.js`** — Componentes React reutilizáveis
6. **`README.md`** — Este arquivo

---

## 🎨 Design System Summary

### Paleta de cores — Manuscrito Iluminado
```
--parchment: #F2E9D2      (superfície principal, "papel")
--parchment-light: #F7F0DD (cards, bottom sheet)
--wine: #5E2230           (primário litúrgico, estados ativos)
--wine-deep: #3E1620      (base do gradiente da imagem)
--gold: #A98B48           (acento sagrado — molduras, ativo)
--gold-light: #D9C081     (ouro sobre vinho: cruz, motivos)
--gold-deep: #8A6D2F      (ouro como texto sobre pergaminho)
--ink: #2E2419            (texto principal)
--ink-soft: #5B513C       (texto secundário)
--clay: #B5613C           (coração / favoritar)
```

### Tipografia (Google Fonts)
- **Cormorant Garamond** — Nomes de santos, citações, títulos (itálico carrega a emoção)
- **Mulish** — Body, UI, rótulos, eyebrows (humanista, legível para crianças)

### Princípios de Design
✦ **Minimalista** — Sem decoração, cada elemento tem propósito  
✦ **Acessível** — Tipografia legível (16px+), contraste suficiente  
✦ **Contemplativo** — Espaço em branco generoso, animações suaves  
✦ **Móvel-first** — Vertical priority, touch-friendly (44px min)  
✦ **Tradicional + Moderno** — Ouro em acentos + interface limpa  

---

## 🎯 Arquitetura da App

```
App
├─ Header (nome do santo, ícone, eyebrow)
├─ ImageContainer (full-screen imagem com fade transition)
├─ QuoteCard (quote em card, tema em tag)
└─ DoubleTabMenu (modal: filtros, settings, favoritos)
```

### State Management Essencial

```javascript
{
  currentSaint: { id, name, icon, theme, themeValue, image, quote },
  selectedTheme: 'eucaristia' | 'missa' | 'liturgia' | 'oracao' | 'sacramentos' | 'virtudes' | null,
  menuOpen: boolean,
  favorites: [saintId, ...],                    // localStorage
  settings: { textSize: 'sm|md|lg', language: 'pt|en' }, // localStorage
}
```

### Interações Principais

| Ação | Comportamento |
|------|---------------|
| **1x Tap** | Load próximo santo aleatório (fade 220ms) |
| **2x Tap** | Abre menu (slide up 300ms) |
| **Filtro de tema** | Refiltra santos, lista se atualiza |
| **Settings** | Persiste imediatamente a localStorage |
| **Favoritar** | Toggle ⭐, persiste a localStorage |

---

## 🚀 Getting Started (Roadmap de Desenvolvimento)

### Fase 1: Setup Básico (1-2 dias)
- [ ] Clone seu repo React
- [ ] Copie tipografia + cores (CSS variables)
- [ ] Implemente layout mobile (header, image, card, menu)
- [ ] Adicione componentes do arquivo `REACT_COMPONENTS.js`

### Fase 2: Dados & Backend (2-3 dias)
- [ ] Design API endpoint: `GET /api/saints?theme=&language=`
- [ ] Implemente storage de imagens no backend (URLs)
- [ ] Carregue dados do `SAINTS_DATA_TEMPLATE.json` como seed
- [ ] Integre fetch na app React

### Fase 3: Interações (1-2 dias)
- [ ] Implemente double-tap (300ms detection)
- [ ] Fade transitions (220ms)
- [ ] Menu modal slide-up (300ms)
- [ ] localStorage persistence (favorites, settings)

### Fase 4: Polish & Deploy (1-2 dias)
- [ ] Teste em dispositivos reais
- [ ] Otimize imagens (lazy load, compression)
- [ ] Crie mais santos (database)
- [ ] Deploy web + considere React Native

---

## 📋 Checklist de Desenvolvimento

### Backend
- [ ] Estrutura de dados de santos (id, name, icon, quote, image, theme)
- [ ] Endpoint GET /api/saints (com filtro por tema)
- [ ] Storage de imagens (S3, Cloudinary, etc)
- [ ] Seeding com 50+ santos
- [ ] Suporte para PT-BR e EN (quotes traduzidas)

### Frontend (React)
- [ ] Setup projeto (Create React App ou Vite)
- [ ] Adicione fontes Google (Playfair Display, DM Sans)
- [ ] Implemente layout base (header, image, card)
- [ ] Copie componentes de `REACT_COMPONENTS.js`
- [ ] Integre API calls
- [ ] Double-tap handler
- [ ] localStorage hooks (favorites, settings)
- [ ] Theme filter logic
- [ ] Bilingual support (PT/EN)

### Mobile
- [ ] Teste em iPhone/Android
- [ ] Verifique touch targets (44px min)
- [ ] Teste scroll/animations
- [ ] Optimize performance
- [ ] Considere service worker (offline support)

### Extras (Nice-to-have)
- [ ] Favorites screen (view saved quotes)
- [ ] Saint biography modal (more info)
- [ ] Share quote (social media)
- [ ] Search saints
- [ ] Dark mode
- [ ] Notifications (daily saint)
- [ ] Swipe gestures (next/prev)

---

## 💻 Exemplo Rápido de Implementação

### 1. Configurar CSS (index.css ou _globals.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&family=DM+Sans:wght@300;400;500;700&display=swap');

:root {
  --ivory: #F7F5F0;
  --gold: #A87800;
  --electric: #1655C8;
  --midnight: #0B1527;
  --cream: #EDEAE3;
  --slate: #3D5070;
  --silver: #7A8EA8;
  --mist: #B8C4D4;
  /* ... complete list em IMPLEMENTATION_GUIDE.md */
}

body {
  font-family: 'DM Sans', sans-serif;
  background-color: var(--ivory);
  color: var(--midnight);
}

h1, h2, h3 {
  font-family: 'Playfair Display', serif;
}
```

### 2. Componente App Principal

```jsx
import React, { useState, useEffect } from 'react';
import { SaintHeader, ImageContainer, QuoteCard, DoubleTabMenu } from './components';
import { usePersistentState, useDoubleTap } from './hooks';

export default function App() {
  const [saints, setSaints] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = usePersistentState('catholicApp_favorites', []);
  const [settings, setSettings] = usePersistentState('catholicApp_settings', {
    textSize: 'md',
    language: 'pt',
  });

  // Fetch saints
  useEffect(() => {
    const fetchSaints = async () => {
      try {
        const res = await fetch('/api/saints?language=' + settings.language);
        const data = await res.json();
        setSaints(data.saints);
      } catch (err) {
        console.error('Erro ao carregar santos:', err);
      }
    };
    fetchSaints();
  }, [settings.language]);

  const filtered = selectedTheme
    ? saints.filter((s) => s.themeValue === selectedTheme)
    : saints;

  const current = filtered[currentIndex] || saints[0];

  const handleTap = useDoubleTap(
    () => setCurrentIndex((prev) => (prev + 1) % filtered.length), // single
    () => setMenuOpen(true) // double
  );

  return (
    <div style={{ width: '100%', maxWidth: '480px', height: '100vh', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
      <SaintHeader saint={current} eyebrow="SANTO DO DIA" />
      <ImageContainer saint={current} onTap={handleTap} />
      <QuoteCard saint={current} />
      <DoubleTabMenu
        isOpen={menuOpen}
        themes={[
          { value: 'eucaristia', label: 'Eucaristia' },
          { value: 'missa', label: 'Santa Missa' },
          // ...
        ]}
        selectedTheme={selectedTheme}
        onSelectTheme={setSelectedTheme}
        settings={settings}
        onSetTextSize={(size) => setSettings({ ...settings, textSize: size })}
        onSetLanguage={(lang) => setSettings({ ...settings, language: lang })}
        isFavorite={favorites.includes(current.id)}
        onToggleFavorite={() => {
          setFavorites(
            favorites.includes(current.id)
              ? favorites.filter((id) => id !== current.id)
              : [...favorites, current.id]
          );
        }}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
}
```

---

## 📚 Documentação Adicional

Para mais detalhes, consulte:
- **IMPLEMENTATION_GUIDE.md** — Guia técnico completo
- **SAINTS_DATA_TEMPLATE.json** — Estrutura de dados
- **REACT_COMPONENTS.js** — Componentes prontos para copiar
- **Catholic Devotional Design System.dc.html** — Referência visual

---

## 🎯 Próximos Passos

1. **Compartilhe o design system** com seu time de design/frontend
2. **Revise o guia de implementação** com seu backend/full-stack
3. **Clone/customize o prototype** para sua stack React
4. **Inicie desenvolvimento** usando este kit como foundation
5. **Teste em dispositivos reais** (iOS/Android)
6. **Deploy** 🚀

---

## 📧 Dúvidas?

Se tiver perguntas sobre:
- **Design** → Consulte Catholic Devotional Design System.dc.html
- **Arquitetura** → Consulte IMPLEMENTATION_GUIDE.md
- **Código** → Consulte REACT_COMPONENTS.js
- **Dados** → Consulte SAINTS_DATA_TEMPLATE.json

---

## ✨ Final Notes

- **Design system é flexível** — pode customizar cores, fonts, spacing mantendo princípios
- **Prototype é referência, não código final** — adapte para sua stack
- **Dados são mock** — substitua pela sua API
- **Acessibilidade é prioritária** — crianças de 10+ anos devem compreender

**Bom desenvolvimento! 🙏**

---

*Design System v1.0 — Catholic Devotional Mobile App*  
*Minimalista, acolhedor, contemplativo, reverente.*
