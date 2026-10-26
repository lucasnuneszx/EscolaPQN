import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Centro Educacional Pequeno Príncipe — Dias d\'Ávila, BA',
    template: '%s | Centro Educacional Pequeno Príncipe',
  },
  description:
    'Escola de educação infantil e ensino fundamental em Dias d\'Ávila, Bahia. Formando crianças com excelência, afeto e responsabilidade.',
  keywords: [
    'escola',
    'educação infantil',
    'ensino fundamental',
    'Dias d\'Ávila',
    'Bahia',
    'Pequeno Príncipe',
    'matrícula',
  ],
  authors: [{ name: 'Centro Educacional Pequeno Príncipe' }],
  creator: 'Centro Educacional Pequeno Príncipe',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Centro Educacional Pequeno Príncipe',
  },
  icons: {
    icon: '/brand/logo-pequeno-principe.png',
    shortcut: '/brand/logo-pequeno-principe.png',
    apple: '/brand/logo-pequeno-principe.png',
  },
}

import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { WhatsAppFloatingWidget } from '@/components/public/WhatsAppFloatingWidget'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full antialiased">
        <ThemeProvider>
          {children}
          <WhatsAppFloatingWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
