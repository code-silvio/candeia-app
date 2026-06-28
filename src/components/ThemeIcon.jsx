import { THEME_ICONS_SVG } from '../data/saints'

/** Glifo line-art do tema, exibido no topo da imagem. */
export default function ThemeIcon({ iconKey }) {
  return (
    <svg
      width={28} height={28} viewBox="0 0 24 24" fill="none"
      stroke="#d9c081" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block' }}
      dangerouslySetInnerHTML={{ __html: THEME_ICONS_SVG[iconKey] || '' }}
    />
  )
}
