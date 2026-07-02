import type { MockupType } from '@/components/product/ProductMockup'

// Mapea la categoría de un producto al tipo de <ProductMockup /> que le
// corresponde, mientras no exista una columna product_type real en la
// base (llega con el seed extendido — Paso 2 del rediseño Printful).
export function getMockupForCategory(categoryName: string): {
  type: MockupType
  accent?: 'heart'
} {
  const key = categoryName.toLowerCase()

  if (key.includes('blusa')) return { type: 'blusa', accent: 'heart' }
  if (key.includes('gorra')) return { type: 'gorra' }
  if (key.includes('taza')) return { type: 'taza' } // el corazón en 'taza' es incondicional
  if (key.includes('suéter') || key.includes('sueter')) return { type: 'sueter' }
  if (key.includes('tote') || key.includes('bolso')) return { type: 'totebag' }
  return { type: 'polera', accent: 'heart' }
}

// Técnica de impresión por categoría — heurística temporal, igual que el
// mapeo de arriba. Sustituir por una columna products.print_technique
// real cuando llegue el seed extendido (Paso 2).
export function getTechniqueForCategory(categoryName: string): string {
  const key = categoryName.toLowerCase()

  if (key.includes('gorra') || key.includes('taza')) return 'Sublimación'
  if (key.includes('blusa') || key.includes('suéter') || key.includes('sueter')) return 'DTF'
  return 'Serigrafía'
}
