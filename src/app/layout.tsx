import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Nunito } from 'next/font/google'
import { Nav } from '@/components/layout/Nav'
import './globals.css'

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap'
})

const bodyFont = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-body',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://miestampa.com'),
  title: 'Mi Estampa — Tu estilo, tu estampa',
  description:
    'Personalizá poleras, suéteres, gorras y tazas con tu propio diseño. Envío a todo Bolivia o retiro en local.',
  applicationName: 'Mi Estampa',
  authors: [{ name: 'Mi Estampa' }],
  keywords: [
    'personalización textil',
    'serigrafía Bolivia',
    'sublimación',
    'poleras personalizadas',
    'gorras personalizadas',
    'tazas personalizadas'
  ],
  openGraph: {
    title: 'Mi Estampa — Tu estilo, tu estampa',
    description: 'Personalizá tus prendas y recibí en todo Bolivia.',
    type: 'website',
    locale: 'es_BO'
  }
}

export const viewport: Viewport = {
  themeColor: '#F05A4F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-BO" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <Nav />
        {children}
      </body>
    </html>
  )
}
