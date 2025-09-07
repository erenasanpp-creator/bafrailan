"use client"
import { useEffect, useState } from "react"
import { currentUser, users as readUsers, saveUsers } from "../../../lib/mockdb"
import { useRouter } from "next/navigation"

async function toSquareDataUrl(file: File, maxSize = 256): Promise<string> {
  const img = document.createElement("img")
  const reader = new FileReader()
  const load = new Promise<string>((resolve, reject) => {
    reader.onload = () => { img.src = String(reader.result); }
    reader.onerror = () => reject(new Error("read error"))
    img.onload = () => {
      const size = Math.min(maxSize, 512)
      const canvas = document.createElement("canvas")
      canvas.width = size; canvas.height = size
      const ctx = canvas.getContext("2d")
      if (!ctx) return resolve(String(reader.result))
      const side = Math.min(img.naturalWidth, img.naturalHeight)
      const sx = Math.max(0, (img.naturalWidth - side) / 2)
      const sy = Math.max(0, (img.naturalHeight - side) / 2)
      ctx.clearRect(0,0,size,size)
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)
      resolve(canvas.toDataURL("image/png"))
    }
  })
  reader.readAsDataURL(file)
  return load
}

export default function Profile() {
  const router = useRouter()
  const [me, setMe] = useState<any | null>(null)
  const [img, setImg] = useState<string | null>(null)

  useEffect(()=>{
    const u = currentUser()
    if (!u) { router.push("/auth/login"); return }
    if (u.role !== "business") { router.push("/dashboard"); return }
    setMe(u); setImg(u.logo_dataUrl || null)
  }, [router])

  if (!me) return null

  async function onUpload(file: File | null) {
    if (!file) return
    const dataUrl = await toSquareDataUrl(file, 256)
    const us = readUsers().map(u => u.id === me.id ? { ...u, logo_dataUrl: dataUrl } : u)
    saveUsers(us); setImg(dataUrl); alert("Logo kaydedildi (kare & ölçekli).")
  }

  function onClear() {
    const us = readUsers().map(u => u.id === me.id ? { ...u, logo_dataUrl: null } : u)
    saveUsers(us); setImg(null)
  }

  return (
    <div className="max-w-xl mx-auto card p-6 space-y-4">
      <h1 className="text-2xl font-bold">Profil / Logo</h1>
      <div className="space-y-2">
        <div className="text-sm text-slate-600">Logo kare kırpılıp 256×256 px PNG'e dönüştürülür. SVG dahil tüm görseller kabul edilir.</div>
        {img ? <img src={img} className="w-28 h-28 rounded-lg border object-cover" /> : <div className="text-slate-500">Logo yok.</div>}
      </div>
      <div className="space-y-2">
        <label className="label">Logo Yükle</label>
        <input type="file" accept="image/*" className="input" onChange={e=>onUpload(e.target.files?.[0]||null)} />
      </div>
      <div className="flex gap-2">
        <button className="btn btn-outline" onClick={onClear}>Kaldır</button>
      </div>
    </div>
  )
}
