// Composición automática del preview (spec sección 9).
// NO es un editor: el diseño se ajusta (contain) y centra dentro del
// print_area del producto. Sin input del usuario sobre posición/escala.
import type { PrintArea } from '@/lib/queries/catalog'

const CANVAS_SIZE = 1000

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`))
    img.src = src
  })
}

export async function composePreview(
  mockupUrl: string,
  designSrc: string,
  printArea: PrintArea
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D no disponible')

  const [mockupImg, designImg] = await Promise.all([loadImage(mockupUrl), loadImage(designSrc)])

  ctx.drawImage(mockupImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE)

  const areaX = printArea.x * CANVAS_SIZE
  const areaY = printArea.y * CANVAS_SIZE
  const areaW = printArea.w * CANVAS_SIZE
  const areaH = printArea.h * CANVAS_SIZE

  const designRatio = designImg.naturalWidth / designImg.naturalHeight
  const areaRatio = areaW / areaH

  let drawW: number
  let drawH: number
  if (designRatio > areaRatio) {
    drawW = areaW
    drawH = areaW / designRatio
  } else {
    drawH = areaH
    drawW = areaH * designRatio
  }

  const drawX = areaX + (areaW - drawW) / 2
  const drawY = areaY + (areaH - drawH) / 2

  ctx.drawImage(designImg, drawX, drawY, drawW, drawH)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('No se pudo generar el preview'))
    }, 'image/png')
  })
}
