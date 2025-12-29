import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ElectroHub - India\'s Electronics Marketplace',
  description: 'Find electronics shops, repair services, and buy products near you. Shop owners register to grow your business.',
  keywords: 'electronics repair, mobile repair, laptop service, AC repair, TV repair, electronics shop, India',
  openGraph: {
    title: 'ElectroHub - Electronics Marketplace',
    description: 'Connect with verified electronics shops across India',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}