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

  // Las fotos de producto no son 1:1 (ej. 1688x1536). Estirarlas directo a
  // un canvas cuadrado las comprimía ~10% en ancho. Recorte "cover" centrado
  // en vez de estirar: mantiene la proporción real de la prenda.
  const mockupRatio = mockupImg.naturalWidth / mockupImg.naturalHeight
  let srcW = mockupImg.naturalWidth
  let srcH = mockupImg.naturalHeight
  if (mockupRatio > 1) {
    srcW = srcH
  } else {
    srcH = srcW
  }
  const srcX = (mockupImg.naturalWidth - srcW) / 2
  const srcY = (mockupImg.naturalHeight - srcH) / 2
  ctx.drawImage(mockupImg, srcX, srcY, srcW, srcH, 0, 0, CANVAS_SIZE, CANVAS_SIZE)

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

  // 'multiply' deja que las sombras/pliegues de la tela se noten a
  // través del diseño (equivalente Canvas de mix-blend-mode: multiply),
  // y el drop-shadow suave da la sensación de que el estampado sigue
  // la curvatura de la prenda en vez de flotar encima.
  ctx.save()
  ctx.globalCompositeOperation = 'multiply'
  ctx.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))'
  ctx.drawImage(designImg, drawX, drawY, drawW, drawH)
  ctx.restore()

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('No se pudo generar el preview'))
    }, 'image/png')
  })
}
