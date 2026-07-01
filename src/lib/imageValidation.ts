// Validación de calidad de imagen subida por el cliente.
// Reglas exactas de docs/SPEC_Tecnica_App_Personalizacion.md, sección 5.
// Se valida por DIMENSIONES EN PX, no por DPI (el DPI en metadatos EXIF
// no es confiable desde el navegador).
export const IMAGE_VALIDATION = {
  minWidth: 1500,
  minHeight: 1500,
  maxFileSizeMB: 25,
  allowedFormats: ['image/png', 'image/jpeg', 'image/webp'] as const,
  recommended: 2000
}

export type ImageValidationResult =
  | {
      ok: true
      quality: 'optima' | 'advertencia'
      width: number
      height: number
      message: string
    }
  | {
      ok: false
      reason: 'formato' | 'peso' | 'resolucion'
      message: string
      width?: number
      height?: number
    }

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}

export async function validateImageFile(file: File): Promise<ImageValidationResult> {
  if (!IMAGE_VALIDATION.allowedFormats.includes(file.type as (typeof IMAGE_VALIDATION.allowedFormats)[number])) {
    return {
      ok: false,
      reason: 'formato',
      message: 'Formato no soportado. Usá una imagen PNG, JPG o WEBP.'
    }
  }

  const maxBytes = IMAGE_VALIDATION.maxFileSizeMB * 1024 * 1024
  if (file.size > maxBytes) {
    return {
      ok: false,
      reason: 'peso',
      message: `El archivo pesa demasiado (máx. ${IMAGE_VALIDATION.maxFileSizeMB} MB).`
    }
  }

  const { width, height } = await readImageDimensions(file)

  if (width < IMAGE_VALIDATION.minWidth || height < IMAGE_VALIDATION.minHeight) {
    return {
      ok: false,
      reason: 'resolucion',
      width,
      height,
      message: `La imagen tiene baja resolución (${width}×${height} px). Para una impresión de calidad necesitamos mínimo ${IMAGE_VALIDATION.minWidth}×${IMAGE_VALIDATION.minHeight} px. Probá con una imagen más grande o nítida.`
    }
  }

  if (width < IMAGE_VALIDATION.recommended || height < IMAGE_VALIDATION.recommended) {
    return {
      ok: true,
      quality: 'advertencia',
      width,
      height,
      message: `La imagen funciona, pero para mejor calidad recomendamos ${IMAGE_VALIDATION.recommended} px o más.`
    }
  }

  return {
    ok: true,
    quality: 'optima',
    width,
    height,
    message: 'Calidad óptima ✓'
  }
}
