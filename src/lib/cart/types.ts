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
  // Path (no URL) del archivo original en el bucket privado "uploads",
  // solo para designSource:'subida'. Se resuelve a signed URL bajo demanda.
  uploadedImagePath: string | null
  quantity: number
  unitPrice: number
}
