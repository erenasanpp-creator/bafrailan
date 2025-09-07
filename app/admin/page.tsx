"use client"
import { useEffect, useMemo, useState } from "react"
import { currentUser, users as readUsers, saveUsers, jobs as readJobs, saveJobs, visits, adsConfig, saveAdsConfig, AdsConfig, AdSlot } from "../../lib/mockdb"
import { useRouter } from "next/navigation"

async function fileToDataUrl(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  let binary = ""; for (let i=0;i<bytes.length;i++) binary += String.fromCharCode(bytes[i])
  const b64 = btoa(binary); const type = file.type || "image/png"
  return `data:${type};base64,${b64}`
}

function SlotEditor({ name, slot, onChange, defaults }:
 { name: string, slot: AdSlot | null | undefined, onChange: (s: AdSlot | null)=>void, defaults: { width?: number, height?: number } }) {
  const [href, setHref] = useState(slot?.href || "")
  const [width, setWidth] = useState<number | string>(slot?.width ?? (defaults.width ?? ""))
  const [height, setHeight] = useState<number | string>(slot?.height ?? (defaults.height ?? ""))
  const [img, setImg] = useState<string | null>(slot?.dataUrl || null)

  useEffect(()=>{
    setHref(slot?.href || "")
    setWidth(slot?.width ?? (defaults.width ?? ""))
    setHeight(slot?.height ?? (defaults.height ?? ""))
    setImg(slot?.dataUrl || null)
  }, [slot, defaults.width, defaults.height])

  async function onUpload(file: File | null) {
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    const next: AdSlot = { href, width: Number(width) || undefined, height: Number(height) || undefined, dataUrl }
    onChange(next); setImg(dataUrl)
    alert(`${name} görseli kaydedildi.`)
  }

  function onSave() {
    const next: AdSlot = { href: href || undefined, width: Number(width) || undefined, height: Number(height) || undefined, dataUrl: img || undefined }
    onChange(next)
    alert(`${name} ayarları güncellendi.`)
  }

  function onClear() {
    onChange(null); setImg(null); setHref(""); setWidth(""); setHeight("")
  }

  return (
    <div className="card p-5 space-y-3">
      <h3 className="font-semibold">{name}</h3>
      {img ? <img src={img} className="rounded-lg border max-w-full" style={{maxHeight: 300}} /> : <div className="text-slate-500">Görsel yok</div>}
      <div className="grid grid-cols-2 gap-2">
        <div><label className="label">Link (tıklanınca)</label><input className="input" value={href} onChange={e=>setHref(e.target.value)} placeholder="https://..." /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className="label">Genişlik (px)</label><input className="input" value={width} onChange={e=>setWidth(e.target.value)} placeholder={String(defaults.width || "")} /></div>
          <div><label className="label">Yükseklik (px)</label><input className="input" value={height} onChange={e=>setHeight(e.target.value)} placeholder={String(defaults.height || "")} /></div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="label">Görsel yükle (PNG/JPEG/GIF)</label>
        <input type="file" accept="image/png,image/jpeg,image/gif" onChange={e=>onUpload(e.target.files?.[0]||null)} className="input" />
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={onSave}>Kaydet</button>
        <button className="btn btn-outline" onClick={onClear}>Temizle</button>
      </div>
    </div>
  )
}

export default function Admin() {
  const router = useRouter()
  const [me, setMe] = useState<any | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [cfg, setCfg] = useState<AdsConfig>({})

  const daily = useMemo(() => {
    const vs = visits()
    const byDay = new Map<string, number>()
    vs.forEach(v => {
      const d = new Date(v.ts); const key = d.toISOString().slice(0,10)
      byDay.set(key, (byDay.get(key) || 0) + 1)
    })
    return Array.from(byDay.entries()).sort((a,b)=> a[0] < b[0] ? 1 : -1).slice(0, 30).map(([day, count])=>({day, count}))
  }, [])

  useEffect(() => {
    const u = currentUser()
    if (!u) { router.push("/auth/login"); return }
    if (u.role !== "admin") { router.push("/"); return }
    setMe(u)
    setUsers(readUsers())
    setJobs(readJobs())
    setCfg(adsConfig())
  }, [router])

  if (!me) return null

  function toggleApprove(id: string) {
    const next = users.map(u => u.id === id ? { ...u, approved: !u.approved } : u)
    saveUsers(next); setUsers(next)
  }
  function toggleActive(jobId: string) {
    const next = jobs.map(j => j.id === jobId ? { ...j, is_active: !j.is_active } : j)
    saveJobs(next); setJobs(next)
  }
  function delJob(jobId: string) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return
    const next = jobs.filter(j => j.id !== jobId)
    saveJobs(next); setJobs(next)
  }

  function update(partial: Partial<AdsConfig>) {
    const next = { ...cfg, ...partial }
    setCfg(next); saveAdsConfig(next)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Yönetim Paneli</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Üyeler</h2>
        <div className="grid gap-3">
          {users.map((u:any) => (
            <div key={u.id} className="card p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {u.logo_dataUrl && <img src={u.logo_dataUrl} className="w-10 h-10 rounded-md border object-cover aspect-square" />}
                <div>
                  <div className="font-semibold">{u.role === "candidate" ? u.owner_name : u.business_name} <span className="text-slate-500 text-sm">({u.email})</span></div>
                  <div className="text-sm text-slate-600">{u.owner_name || "-"} • {u.phone || "-" } {u.address ? ("• "+u.address) : ""}</div>
                  <div className="text-xs text-slate-500">Rol: {u.role} • Onay: {u.approved ? "Evet" : "Hayır"}</div>
                </div>
              </div>
              <div className="flex gap-2">
                {u.role === "business" && (
                  <button onClick={()=>toggleApprove(u.id)} className={`btn ${u.approved ? "btn-outline" : "btn-primary"}`}>
                    {u.approved ? "Onayı Kaldır" : "Onayla"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">İlanlar</h2>
        <div className="grid gap-3">
          {jobs.map((j:any) => (
            <div key={j.id} className="card p-4 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{j.position} — {j.store_name}</div>
                <div className="text-sm text-slate-600">{j.location ?? "Bafra"} • {j.work_hours}</div>
                <div className="text-xs text-slate-500">Durum: {j.is_active ? "Aktif" : "Pasif"} • Sahib: {j.user_id}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>toggleActive(j.id)} className="btn btn-outline">
                  {j.is_active ? "Pasifleştir" : "Aktifleştir"}
                </button>
                <button onClick={()=>delJob(j.id)} className="btn btn-outline">Sil</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reklam Alanları</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SlotEditor name="Masaüstü Sol (sabit, dikey)" slot={cfg.desktopLeft} onChange={(s)=>update({ desktopLeft: s })} defaults={{ width: 160, height: 600 }} />
          <SlotEditor name="Masaüstü Sağ (sabit, dikey)" slot={cfg.desktopRight} onChange={(s)=>update({ desktopRight: s })} defaults={{ width: 160, height: 600 }} />
          <SlotEditor name="Mobil Üst (sticky)" slot={cfg.mobileTop} onChange={(s)=>update({ mobileTop: s })} defaults={{ width: 320, height: 100 }} />
        </div>
        <p className="text-sm text-slate-500">Not: Mock sürümde reklamlar tarayıcınızın localStorage'ında saklanır.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Ziyaret İstatistikleri</h2>
        <div className="card p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {daily.map((v:any)=>(
              <div key={v.day} className="flex items-center justify-between">
                <span className="text-slate-600">{new Date(v.day).toLocaleDateString("tr-TR")}</span>
                <span className="font-semibold">{v.count}</span>
              </div>
            ))}
          </div>
          {!daily.length && <div className="text-sm text-slate-600">Henüz veri yok.</div>}
        </div>
      </section>
    </div>
  )
}
