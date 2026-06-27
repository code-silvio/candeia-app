// ── Data layer ────────────────────────────────────────────────────────────────
// Fonte de conteúdo dos santos. Hoje é estático (seed local); este é o ponto
// único que será trocado pela leitura do Supabase (tabela `saints`) sem
// precisar tocar em componentes ou hooks. Mantenha o formato dos objetos.

export const SAINTS = [
  {
    id: 1, name: 'Santo Agostinho', age: 'c. 354–430', themeValue: 'eucaristia',
    image: '/assets/santo-agostinho.png',
    quote: 'A Eucaristia é o alimento que alimenta a alma e nos une a Cristo.',
    source: { work: 'Confissões', author: 'Santo Agostinho', book: 'Livro VII', page: 'p. 142', publisher: 'Paulus', edition: '3ª ed., 2017' },
  },
  {
    id: 2, name: 'Santa Teresa de Calcutá', age: 'c. 1910–1997', themeValue: 'oracao',
    image: '/assets/madre-teresa.png',
    quote: 'Rezar é simplesmente conversar com Deus. Ele ama você, e é tão simples.',
    source: { work: 'Um Caminho Simples', author: 'Madre Teresa', book: 'Cap. 2 — Oração', page: 'p. 28', publisher: 'Editora Sextante', edition: '1ª ed., 2006' },
  },
  {
    id: 3, name: 'São João Vianney', age: 'c. 1786–1859', themeValue: 'missa',
    quote: 'A Santa Missa é a maior ação de graças que podemos oferecer a Deus.',
    source: { work: "Sermões do Cura d'Ars", author: 'São João Maria Vianney', book: 'Sobre a Santa Missa', page: 'p. 87', publisher: 'Quadrante', edition: '2ª ed., 2014' },
  },
  {
    id: 4, name: 'Santo Tomás de Aquino', age: 'c. 1225–1274', themeValue: 'liturgia',
    quote: 'A Liturgia é o cume para o qual tende toda a ação da Igreja.',
    source: { work: 'Suma Teológica', author: 'Santo Tomás de Aquino', book: 'III, q. 83', page: 'p. 512', publisher: 'Edições Loyola', edition: '2ª ed., 2015' },
  },
  {
    id: 5, name: 'Santa Catarina de Sena', age: 'c. 1347–1380', themeValue: 'virtudes',
    quote: 'A graça é a virtude que nos permite agir segundo a vontade de Deus.',
    source: { work: 'Diálogo da Divina Providência', author: 'Santa Catarina de Sena', book: 'Tratado da Discrição', page: 'p. 64', publisher: 'Paulinas', edition: '1ª ed., 2010' },
  },
  {
    id: 6, name: 'São Bento', age: 'c. 480–547', themeValue: 'sacramentos',
    image: '/assets/sao-bento.png',
    quote: 'Os Sacramentos são sinais sensíveis da graça invisível de Deus.',
    source: { work: 'A Regra de São Bento', author: 'São Bento de Núrsia', book: 'Prólogo', page: 'p. 19', publisher: 'Editora Vozes', edition: '5ª ed., 2018' },
  },
]

export const THEME_META = {
  eucaristia:  { label: 'Eucaristia',        icon: 'monstrance' },
  missa:       { label: 'Santa Missa',       icon: 'chalice' },
  liturgia:    { label: 'Liturgia Católica', icon: 'book' },
  oracao:      { label: 'Oração',            icon: 'rosary' },
  sacramentos: { label: 'Sacramentos',       icon: 'shell' },
  virtudes:    { label: 'Virtudes',          icon: 'heart' },
}

// Geometria interna de cada glifo (dentro de um <svg> 24x24).
export const THEME_ICONS_SVG = {
  monstrance: '<circle cx="12" cy="9.5" r="3"/><line x1="12" y1="2.3" x2="12" y2="4"/><line x1="16.6" y1="4.9" x2="15.4" y2="6.1"/><line x1="18.5" y1="9.5" x2="16.8" y2="9.5"/><line x1="16.6" y1="14.1" x2="15.4" y2="12.9"/><line x1="7.4" y1="4.9" x2="8.6" y2="6.1"/><line x1="5.5" y1="9.5" x2="7.2" y2="9.5"/><line x1="7.4" y1="14.1" x2="8.6" y2="12.9"/><line x1="12" y1="12.5" x2="12" y2="18"/><path d="M8.5 20 Q12 18 15.5 20"/><line x1="8.5" y1="20" x2="15.5" y2="20"/>',
  chalice:     '<circle cx="12" cy="3.1" r="1.5"/><path d="M7.3 6 H16.7 A4.7 4.7 0 0 1 7.3 6 Z"/><line x1="12" y1="10.6" x2="12" y2="17.5"/><path d="M8 20 Q12 17.4 16 20"/><line x1="8" y1="20" x2="16" y2="20"/>',
  book:        '<path d="M12 6.6 C9.5 5.1 6.6 5.1 4 5.9 V18.1 C6.6 17.3 9.5 17.3 12 18.8"/><path d="M12 6.6 C14.5 5.1 17.4 5.1 20 5.9 V18.1 C17.4 17.3 14.5 17.3 12 18.8"/><line x1="12" y1="6.6" x2="12" y2="18.8"/>',
  rosary:      '<circle cx="12" cy="8.5" r="5" stroke-dasharray="1.4 2.2"/><line x1="12" y1="13.5" x2="12" y2="17"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="10.3" y1="19" x2="13.7" y2="19"/>',
  shell:       '<path d="M5 13 A9 9 0 0 1 19 13"/><path d="M5 13 L12 18.5 L19 13"/><line x1="8.8" y1="14.4" x2="10.4" y2="18"/><line x1="12" y1="13.7" x2="12" y2="18.5"/><line x1="15.2" y1="14.4" x2="13.6" y2="18"/>',
  heart:       '<path d="M12 20 C5 14.6 4 10.7 6.2 8.2 C8 6.2 11 6.5 12 8.9 C13 6.5 16 6.2 17.8 8.2 C20 10.7 19 14.6 12 20 Z"/>',
}

export const THEME_ORDER = ['eucaristia', 'missa', 'liturgia', 'oracao', 'sacramentos', 'virtudes']
