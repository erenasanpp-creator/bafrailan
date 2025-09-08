"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase";

useEffect(() => {
  (async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMe(null); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    setMe(prof ?? null);
  })();
}, []);


export default function NavBar() {
  const [me, setMe] = useState<any | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    ensureAdmin()
    setMe(currentUser())
  }, [pathname])

  function logout() {
    setCurrentUserId(null)
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800">
          <img src="/brand.svg" alt="Bafra" className="w-[180px] sm:w-[200px] h-auto" />
          <span className="sr-only">Bafra İş İlanları</span>
        </Link>

        <nav className="flex items-center gap-2">
          {/* Always-visible listings button */}
          <Link href="/" className="btn btn-outline hidden sm:inline-flex">İlanlar</Link>
          {me ? (
            <>
              {me.role === "business" && (
                <>
                  <Link href="/dashboard" className="btn btn-outline">Panel</Link>
                  <Link href="/dashboard/new" className={`btn ${me.approved ? "btn-primary" : "btn-outline pointer-events-none opacity-60"}`}>Yeni İlan</Link>
                </>
              )}
              {me.role === "candidate" && (
                <Link href="/dashboard" className="btn btn-outline">Başvurularım</Link>
              )}
              {me.role === "admin" && (
                <Link href="/admin" className="btn btn-outline">Yönetim</Link>
              )}
              <button onClick={logout} className="btn btn-outline">Çıkış</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-outline">Giriş</Link>
              <Link href="/auth/register" className="btn btn-primary">Üyelik</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
