"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { users as readUsers, setCurrentUserId, currentUser } from "../../../lib/mockdb"

export default function Login() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  useEffect(()=>{
    if (currentUser()) router.push("/")
  }, [router])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email")||"").trim().toLowerCase()
    const password = String(fd.get("password")||"")
    const list = readUsers()
    const u = list.find(x => (x.email||"").toLowerCase() === email && x.password === password)
    if (!u) { alert("Hatalı e‑posta veya şifre."); setBusy(false); return }
    setCurrentUserId(u.id)
    router.push("/")
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">Giriş</h1>

      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        <div><label className="label">E‑posta</label><input name="email" type="email" className="input" required placeholder="ornek@eposta.com" /></div>
        <div><label className="label">Şifre</label><input name="password" type="password" className="input" required placeholder="••••••••" /></div>
        <button className="btn btn-primary w-full" disabled={busy} type="submit">{busy ? "Giriş yapılıyor..." : "Giriş Yap"}</button>
      </form>

      <div className="text-center text-sm space-y-2">
        <div>Hesabın yok mu? <Link href="/auth/register" className="text-brand underline">Üye Ol</Link></div>
        <div className="text-slate-500">Kayıt olurken <span className="font-medium">İşveren</span> veya <span className="font-medium">İş Arayan</span> seçebilirsin.</div>
      </div>
    </div>
  )
}
