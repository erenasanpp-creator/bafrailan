"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { users as readUsers, saveUsers, currentUser } from "../../../lib/mockdb"
import Link from "next/link"

export default function Register() {
  const router = useRouter()
  const [role, setRole] = useState<"business"|"candidate">("business")
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
    const owner_name = String(fd.get("owner_name")||"").trim()
    const business_name = String(fd.get("business_name")||"").trim()
    const phone = String(fd.get("phone")||"").trim()
    const address = String(fd.get("address")||"").trim()

    const list = readUsers()
    if (list.some(u => (u.email||"").toLowerCase() === email)) {
      alert("Bu e‑posta zaten kayıtlı."); setBusy(false); return
    }

    const user = {
      id: String(Date.now()),
      email,
      password,
      owner_name: owner_name || (role==="candidate" ? "" : ""),
      business_name: role==="business" ? business_name : null,
      phone: phone || null,
      address: address || null,
      tax_id: null,
      role,
      approved: role==="business" ? false : true,
      logo_dataUrl: null,
      created_at: new Date().toISOString()
    }
    list.push(user as any)
    saveUsers(list)
    alert("Kayıt oluşturuldu. "+(role==="business" ? "Yönetici onayı sonrası ilan verebilirsiniz." : "Giriş yapabilirsiniz."))
    router.push("/auth/login")
  }

  return (
    <div className="max-w-lg mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">Üyelik</h1>

      {/* Role tabs */}
      <div className="card p-2 flex">
        <button className={`flex-1 px-4 py-2 rounded-xl ${role==="business" ? "bg-brand text-white" : "text-slate-700"}`} onClick={()=>setRole("business")}>
          İşveren
        </button>
        <button className={`flex-1 px-4 py-2 rounded-xl ${role==="candidate" ? "bg-brand text-white" : "text-slate-700"}`} onClick={()=>setRole("candidate")}>
          İş Arayan
        </button>
      </div>

      {/* Forms */}
      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        {role === "business" ? (
          <>
            <div><label className="label label-required">İşletme Adı</label><input required name="business_name" className="input" placeholder="Örn: Bafra Pide & Kebap" /></div>
            <div><label className="label label-required">Yetkili Ad Soyad</label><input required name="owner_name" className="input" placeholder="Ad Soyad" /></div>
          </>
        ) : (
          <>
            <div><label className="label label-required">Ad Soyad</label><input required name="owner_name" className="input" placeholder="Ad Soyad" /></div>
          </>
        )}

        <div className="grid2">
          <div><label className="label label-required">E‑posta</label><input required type="email" name="email" className="input" placeholder="ornek@eposta.com" /></div>
          <div><label className="label label-required">Şifre</label><input required type="password" name="password" className="input" placeholder="••••••••" /></div>
        </div>

        <div className="grid2">
          <div><label className="label">Telefon</label><input name="phone" className="input" placeholder="+90 5xx xxx xx xx" /></div>
          <div><label className="label">Adres</label><input name="address" className="input" placeholder="(İsteğe bağlı)" /></div>
        </div>

        {role==="business" && (
          <div className="text-xs text-slate-600">
            * İşveren hesapları yönetici onayı sonrası ilan yayınlayabilir.
          </div>
        )}

        <button className="btn btn-primary w-full" disabled={busy} type="submit">
          {busy ? "Kaydediliyor..." : "Üye Ol"}
        </button>
      </form>

      <div className="text-center text-sm">
        Zaten hesabınız var mı? <Link href="/auth/login" className="text-brand underline">Giriş yap</Link>
      </div>
    </div>
  )
}
