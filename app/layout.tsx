import './raat-theme.css'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'STATIC - Exclusive Events',
  description: 'Premium event ticketing platform for exclusive chaotic experiences',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/bgstatic2.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/bgstatic2.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/bgstatic2.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/bgstatic2.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#dc2626',
  colorScheme: 'dark',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} dark`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
