// Datos de cobro — configurables sin tocar código.
// Pendientes reales del cliente (ver Asana "00 — Pendientes del cliente"):
// datos bancarios + imagen del QR de cobro. Hasta entonces se usan valores
// de ejemplo.
export const BANK_INFO = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || 'Banco de Ejemplo',
  accountHolder: process.env.NEXT_PUBLIC_BANK_HOLDER || 'Mi Estampa (titular de ejemplo)',
  qrImageUrl:
    process.env.NEXT_PUBLIC_PAYMENT_QR_URL ||
    'https://ywykaivywtvcucedxnoc.supabase.co/storage/v1/object/public/payment-qr/placeholder.svg'
}
