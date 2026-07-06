export type CartVariantSnapshot = {
  type: string
  label: string
  value: string
  priceDelta: number
}

export type CartItem = {
  id: string
  productId: string
  productName: string
  categoryName: string
  mockupImageUrl: string | null
  variantsSnapshot: CartVariantSnapshot[]
  designSource: 'galeria' | 'subida'
  designId: string | null
  designLabel: string
  previewImageUrl: string
  quantity: number
  unitPrice: number
}
