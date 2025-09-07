"use client"
import { useEffect, useState } from "react"
import { currentUser, jobs as readJobs, saveJobs } from "../../../lib/mockdb"
import { toNumberLoose } from "../../../lib/util"
import { useRouter } from "next/navigation"

function L({ children, req=false }: any) {
  return <label className={`label ${req? "label-required": ""}`}>{children}</label>
}

export default function NewJob() {
  const router = useRouter()
  const [me, setMe] = useState<any | null>(null)

  useEffect(() => {
    const u = currentUser()
    if (!u) { router.push("/auth/login"); return }
    if (u.role !== "business") { router.push("/"); return }
    if (!u.approved) { router.push("/dashboard"); return }
    setMe(u)
  }, [router])

  if (!me) return null

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const job = {
      id: String(Date.now()),
      user_id: me.id,
      store_name: String(fd.get("store_name") ?? ""),
      position: String(fd.get("position") ?? ""),
      work_hours: String(fd.get("work_hours") ?? ""),
      location: String(fd.get("location") ?? ""),
      salary_min: toNumberLoose(fd.get("salary_min")),
      salary_max: toNumberLoose(fd.get("salary_max")),
      employment_type: String(fd.get("employment_type") ?? ""),
      experience_level: String(fd.get("experience_level") ?? ""),
      education_level: String(fd.get("education_level") ?? ""),
      benefits: String(fd.get("benefits") ?? ""),
      description: String(fd.get("description") ?? ""),
      requirements: String(fd.get("requirements") ?? ""),
      application_email: String(fd.get("application_email") ?? ""),
      application_phone: String(fd.get("application_phone") ?? ""),
      application_link: String(fd.get("application_link") ?? ""),
      is_active: true,
      created_at: new Date().toISOString()
    }
    const js = readJobs()
    js.push(job)
    saveJobs(js)
    router.push("/dashboard")
  }

  return (
    <div className="max-w-2xl mx-auto card p-6 space-y-6">
      <h1 className="text-2xl font-bold">Yeni İlan</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid2">
          <div><L req>Dükkan Adı</L><input required name="store_name" className="input" placeholder="Örn: Demli Kafe" /></div>
          <div><L req>Pozisyon</L><input required name="position" className="input" placeholder="Örn: Garson" /></div>
        </div>
        <div className="grid2">
          <div><L req>Çalışma Saatleri</L><input required name="work_hours" className="input" placeholder="Örn: 09:00 - 18:00 (Hafta içi)" /></div>
          <div><L>Lokasyon</L><input name="location" className="input" placeholder="Örn: Bafra, Samsun" /></div>
        </div>
        <div className="grid2">
          <div><L>Maaş (Min)</L><input name="salary_min" className="input" placeholder="Örn: 30000" /></div>
          <div><L>Maaş (Max)</L><input name="salary_max" className="input" placeholder="Örn: 35000" /></div>
        </div>
        <div className="grid2">
          <div><L>Çalışma Tipi</L><input name="employment_type" className="input" placeholder="Tam Zamanlı / Yarı Zamanlı" /></div>
          <div><L>Deneyim Seviyesi</L><input name="experience_level" className="input" placeholder="Junior / Orta / Senior" /></div>
        </div>
        <div className="grid2">
          <div><L>Eğitim Durumu</L><input name="education_level" className="input" placeholder="Lise / Önlisans / Lisans" /></div>
          <div><L>Yan Haklar (virgülle)</L><input name="benefits" className="input" placeholder="Yemek, Yol, Prim" /></div>
        </div>
        <div><L>Görev & Sorumluluklar</L><textarea name="description" className="input min-h-[120px]" placeholder="İlanda yapılacak işlerin detayları..." /></div>
        <div><L req>İstenen Özellikler</L><textarea required name="requirements" className="input min-h-[120px]" placeholder="İletişimi güçlü, ekip çalışmasına yatkın..." /></div>
        <div className="grid2">
          <div><L>Başvuru E-posta</L><input name="application_email" className="input" placeholder="insan.kaynaklari@ornek.com" /></div>
          <div><L>Başvuru Telefon</L><input name="application_phone" className="input" placeholder="+90 5xx xxx xx xx" /></div>
        </div>
        <div><L>Başvuru Linki</L><input name="application_link" className="input" placeholder="https://forms.gle/..." /></div>
        <div className="flex gap-2"><button className="btn btn-primary" type="submit">Yayınla</button></div>
      </form>
    </div>
  )
}
