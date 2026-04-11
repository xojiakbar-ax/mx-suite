import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// 🔥 QO‘SHILADI
import { CheckInInitializer } from '@/components/dashboard/checkin-initialize'

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter'
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: "MX SUITE - Ta'lim markazi boshqaruv tizimi",
  description: "O'quv markazi uchun zamonaviy boshqaruv platformasi",
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/logo.png', sizes: '16x16' },
      { url: '/logo.png', sizes: '32x32' },
      { url: '/logo.png', sizes: '48x48' },
    ],
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4f46e5' },
    { media: '(prefers-color-scheme: dark)', color: '#6366f1' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>

        {/* 🔥 STORE INIT (ENG MUHIM) */}
        <CheckInInitializer />

        {children}

        <Analytics />
      </body>
    </html>
  )
}