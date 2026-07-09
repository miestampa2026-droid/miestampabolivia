import { Resend } from 'resend'

// Aviso al CLIENTE (no a las socias) cuando confirman su pago desde el
// admin. Igual que el resto de notificaciones: nunca lanza, solo loguea,
// para no romper el cambio de estado si Resend no está configurado.
export async function sendPaymentConfirmedEmail(order: {
  customerEmail: string
  orderNumber: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || !order.customerEmail) {
    console.log('[notifications] RESEND_API_KEY no configurado — se omite el aviso de pago confirmado')
    return
  }

  try {
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'Mi Estampa <onboarding@resend.dev>',
      to: [order.customerEmail],
      subject: `¡Pago confirmado! Pedido ${order.orderNumber}`,
      html: `
        <h2>¡Pago confirmado! 🎉</h2>
        <p>Tu pedido <strong>${order.orderNumber}</strong> entró a producción.</p>
        <p>Te avisamos apenas esté listo.</p>
      `
    })
  } catch (err) {
    console.error('[notifications] Error enviando aviso de pago confirmado:', err)
  }
}
