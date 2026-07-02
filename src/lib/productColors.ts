// Paleta de colores de variante de producto (no confundir con los
// colores de marca en globals.css — estos son colores de TELA/PRENDA
// que el cliente elige, se usan en swatches y en <ProductMockup />).
export const PRODUCT_COLORS: Record<string, string> = {
  blanco: '#FFFFFF',
  negro: '#2B2B2B',
  gris: '#9CA3AF',
  rojo: '#EF4444',
  azul: '#3B82F6',
  'azul marino': '#1E3A5F',
  verde: '#22C55E',
  amarillo: '#F59E0B',
  rosa: '#F9A8D4',
  beige: '#E8DCC8',
  natural: '#EDE4D3',
  coral: '#F05A4F',
  violeta: '#A78BFA'
}

export function resolveProductColor(name: string | undefined): string {
  if (!name) return PRODUCT_COLORS.blanco
  if (name.startsWith('#')) return name
  return PRODUCT_COLORS[name.toLowerCase()] ?? PRODUCT_COLORS.blanco
}

// Determina si el trazo del mockup debe ser claro (tela oscura) u
// oscuro/charcoal (tela clara), para que el line art siga siendo legible.
export function contrastStroke(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4),16)
  const b = parseInt(c.substring(4, 6),16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.55 ? '#E5E7EB' : '#2B2B2B'
}
