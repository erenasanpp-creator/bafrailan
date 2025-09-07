import "./globals.css"
import type { Metadata } from "next"
import NavBar from "../components/NavBar"
import SideAdFixed from "../components/SideAdFixed"
import MobileAdTop from "../components/MobileAdTop"

export const metadata: Metadata = {
  title: "Bafra İş İlanları (Mock Pro)",
  description: "Sabit yan reklamlar + mobil üst reklam."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">
        <NavBar />
        {/* Desktop sabit bannerlar */}
        <div className="hidden lg:block"><SideAdFixed side="left" /></div>
        <div className="hidden lg:block"><SideAdFixed side="right" /></div>

        {/* Mobil üst banner */}
        <MobileAdTop />

        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</div>
        </main>

        <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Bafra İş İlanları
        </footer>
      </body>
    </html>
  )
}
