import Sidebar from '@/components/sidebar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/services/redux/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="p-1 bg-gray-10 w-full h-screen max-w-desktop mr-auto ml-auto text-gray-60">
            <div className="w-full h-3/4 flex gap-2">
              <div className="w-2/6">
                <Sidebar />
              </div>
              <div className="w-2/3 bg-white rounded-xl">
                {children}
              </div>
            </div>
          </div>
        </Providers>

      </body>
    </html>
  )
}
