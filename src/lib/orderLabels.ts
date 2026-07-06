import type { OrderStatus, PaymentStatus } from '@/lib/supabase/types'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  nuevo: 'Nuevo',
  en_produccion: 'En producción',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado'
}

export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  nuevo: 'bg-brand-info/15 text-brand-info',
  en_produccion: 'bg-brand-warning/15 text-brand-warning',
  listo: 'bg-brand-success/15 text-brand-success',
  entregado: 'bg-charcoal/10 text-charcoal',
  cancelado: 'bg-brand-error/15 text-brand-error'
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pendiente_verificacion: 'Pago pendiente de verificación',
  pagado_confirmado: 'Pago confirmado',
  rechazado: 'Pago rechazado'
}

export const PAYMENT_STATUS_BADGE_CLASS: Record<PaymentStatus, string> = {
  pendiente_verificacion: 'bg-brand-warning/15 text-brand-warning',
  pagado_confirmado: 'bg-brand-success/15 text-brand-success',
  rechazado: 'bg-brand-error/15 text-brand-error'
}

export const ORDER_STATUS_TIMELINE: OrderStatus[] = ['nuevo', 'en_produccion', 'listo', 'entregado']
