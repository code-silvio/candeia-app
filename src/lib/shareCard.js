// ── Share card renderer ───────────────────────────────────────────────────────
// Gera a imagem 1080x1350 (formato story) com a citação do santo para
// compartilhamento. Isolado da UI: recebe um santo + label do tema e devolve
// { dataURL, blob }. Sem dependência de React.

function wrapText(ctx, text, maxW, font) {
  if (font) ctx.font = font
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w }
    else line = test
  }
  if (line) lines.push(line)
  return lines
}

function drawFlame(ctx, cx, cy, size, color) {
  ctx.save()
  ctx.translate(cx - size / 2, cy - size / 2)
  ctx.scale(size / 64, size / 64)
  ctx.strokeStyle = color
  ctx.lineWidth = 2.6; ctx.lineJoin = 'round'; ctx.lineCap = 'round'
  ctx.stroke(new Path2D('M32 12 C 41 25, 43 34, 32 45 C 21 34, 23 25, 32 12 Z'))
  ctx.globalAlpha = 0.55; ctx.lineWidth = 2.1
  ctx.stroke(new Path2D('M32 24 C 37 30, 38 35, 32 41 C 26 35, 27 30, 32 24 Z'))
  ctx.globalAlpha = 1; ctx.lineWidth = 2.6
  ctx.stroke(new Path2D('M24 52 q8 7 16 0'))
  ctx.restore()
}

function drawCover(ctx, img, dx, dy, dw, dh, focusY = 0.5) {
  const ir = img.width / img.height, dr = dw / dh
  let sw, sh, sx, sy
  if (ir > dr) { sh = img.height; sw = sh * dr; sx = (img.width - sw) / 2; sy = 0 }
  else { sw = img.width; sh = sw / dr; sx = 0; sy = (img.height - sh) * focusY }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const im = new Image()
    im.crossOrigin = 'anonymous'
    im.onload = () => res(im)
    im.onerror = rej
    im.src = src
  })
}

/**
 * @param {object} saint  Objeto do santo (name, age, image, quote).
 * @param {string} themeLabel  Rótulo do tema já traduzido.
 * @returns {Promise<{ dataURL: string, blob: Blob | null }>}
 */
export async function buildShareCard(saint, themeLabel) {
  const W = 1080, H = 1350, split = 760
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const x = canvas.getContext('2d')

  try {
    await document.fonts.load("600 66px 'Cormorant Garamond'")
    await document.fonts.load("italic 500 52px 'Cormorant Garamond'")
    await document.fonts.load("700 22px 'Mulish'")
    await document.fonts.ready
  } catch { /* fontes podem não estar disponíveis offline; segue com fallback */ }

  // Faixa vinho (topo) + faixa pergaminho (base)
  const g = x.createRadialGradient(W / 2, 300, 60, W / 2, 300, 820)
  g.addColorStop(0, '#7a3a40'); g.addColorStop(0.46, '#5e2230'); g.addColorStop(1, '#3e1620')
  x.fillStyle = g; x.fillRect(0, 0, W, split)
  x.fillStyle = '#F2E9D2'; x.fillRect(0, split, W, H - split)

  const cx = W / 2
  let drewImage = false

  if (saint.image) {
    try {
      const img = await loadImage(saint.image)
      drawCover(x, img, 0, 0, W, split, 0.12)
      const sc = x.createLinearGradient(0, split - 420, 0, split)
      sc.addColorStop(0, 'rgba(40,16,24,0)'); sc.addColorStop(1, 'rgba(40,16,24,0.92)')
      x.fillStyle = sc; x.fillRect(0, split - 420, W, 420)
      drewImage = true
    } catch { /* sem imagem: cai no halo/cruz desenhado abaixo */ }
  }

  if (drewImage) {
    x.textAlign = 'left'; x.fillStyle = '#f7eed7'
    x.font = "600 64px 'Cormorant Garamond'"
    const nameLines = wrapText(x, saint.name, W - 160)
    let ny = split - 96 - (nameLines.length - 1) * 70
    nameLines.forEach(l => { x.fillText(l, 80, ny); ny += 70 })
    x.fillStyle = 'rgba(247,238,215,0.7)'; x.font = "400 26px 'Mulish'"
    x.fillText(saint.age, 80, ny + 2)
    x.textAlign = 'center'
  } else {
    const cy = 195
    x.strokeStyle = '#d9c081'; x.lineCap = 'round'
    x.globalAlpha = 0.9; x.lineWidth = 3.2
    x.beginPath(); x.arc(cx, cy, 64, 0, Math.PI * 2); x.stroke()
    x.globalAlpha = 0.4; x.lineWidth = 1.6
    x.beginPath(); x.arc(cx, cy, 88, 0, Math.PI * 2); x.stroke()
    x.globalAlpha = 0.9; x.lineWidth = 3.2
    x.beginPath(); x.moveTo(cx, cy + 50); x.lineTo(cx, cy + 200); x.stroke()
    x.beginPath(); x.moveTo(cx - 52, cy + 118); x.lineTo(cx + 52, cy + 118); x.stroke()
    x.globalAlpha = 1
    x.textAlign = 'center'
    x.fillStyle = '#e4c878'; x.font = "700 22px 'Mulish'"
    x.fillText('SANTO DO DIA', cx, 470)
    x.fillStyle = '#f7eed7'; x.font = "600 66px 'Cormorant Garamond'"
    const nameLines = wrapText(x, saint.name, W - 200)
    let ny = 545
    nameLines.forEach(l => { x.fillText(l, cx, ny); ny += 72 })
    x.fillStyle = 'rgba(247,238,215,0.62)'; x.font = "400 26px 'Mulish'"
    x.fillText(saint.age, cx, ny + 6)
  }

  // Rótulo do tema
  x.fillStyle = '#a07c34'; x.font = "700 22px 'Mulish'"; x.textAlign = 'center'
  x.fillText('— ' + themeLabel.toUpperCase(), cx, 870)

  // Citação
  x.fillStyle = '#2e2419'
  let qf = 54, lh = 70
  let qLines = wrapText(x, '“' + saint.quote + '”', W - 200, `italic 500 ${qf}px 'Cormorant Garamond'`)
  if (qLines.length > 5) { qf = 46; lh = 60; qLines = wrapText(x, '“' + saint.quote + '”', W - 180, `italic 500 ${qf}px 'Cormorant Garamond'`) }
  x.font = `italic 500 ${qf}px 'Cormorant Garamond'`
  let qy = 960 - ((qLines.length - 1) * lh) / 2 + 60
  qLines.forEach(l => { x.fillText(l, cx, qy); qy += lh })

  // Rodapé — marca Candeia
  x.strokeStyle = 'rgba(168,139,72,0.4)'; x.lineWidth = 1
  x.beginPath(); x.moveTo(cx - 60, 1238); x.lineTo(cx + 60, 1238); x.stroke()
  const fy = 1288
  x.font = "600 46px 'Cormorant Garamond'"
  const wordmark = 'Candeia'
  const tw = x.measureText(wordmark).width
  const flameSize = 50, gap = 14
  const startX = cx - (flameSize + gap + tw) / 2
  drawFlame(x, startX + flameSize / 2, fy - 4, flameSize, '#c6713e')
  x.textAlign = 'left'; x.textBaseline = 'middle'
  x.fillStyle = '#5e2230'; x.fillText(wordmark, startX + flameSize + gap, fy)
  x.textAlign = 'center'; x.textBaseline = 'alphabetic'
  x.fillStyle = '#a07c34'; x.font = "700 17px 'Mulish'"
  x.fillText('PALAVRAS QUE ILUMINAM', cx, 1325)

  const dataURL = canvas.toDataURL('image/png')
  const blob = await new Promise(res => canvas.toBlob(res, 'image/png'))
  return { dataURL, blob }
}
