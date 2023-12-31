import Sidebar from '@/components/sidebar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/services/redux/provider'
import Navbar from '@/components/navbar'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ModalLogin from '@/components/modalLogin'
import { PopupMessage } from '@/components/popup'
import Player from '@/components/player'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Musical Thing',
  description: 'Listen and enjoy',
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
          <ModalLogin />
          <PopupMessage />
          <div className="p-1 bg-gray-10 w-full h-screen max-w-desktop mr-auto ml-auto text-gray-60">
            <div className="w-full h-4/5 flex gap-2">
              <div className="w-1/4">
                <Sidebar />
              </div>
              <div className="w-3/4 bg-white rounded-xl h-full overflow-y-auto overflow-x-hidden">
                <div className="relative">
                  <Navbar />
                </div>
                {children}
              </div>
            </div>
            <div className="w-full h-1/5">
              <Player />
            </div>
          </div>
        </Providers>

      </body>
    </html>
  )
}
