import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flow - Vibe Code Environment',
  description: 'AI-powered website generator for Walrus Sites. Create stunning websites with natural language.',
  keywords: ['AI', 'website generator', 'Walrus Sites', 'Sui blockchain', 'web development'],
  authors: [{ name: 'Motion Labs' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}