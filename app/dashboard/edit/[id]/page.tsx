"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { currentUser, jobs as readJobs, saveJobs } from "../../../../lib/mockdb"
import { toNumberLoose } from "../../../../lib/util"

function L({ children, req=false }: any) {
  return <label className={`label ${req? "label-required": ""}`}>{children}</label>
}

export default function EditJob() {
  const router = useRouter()
  const params = useParams()
  const [me, setMe] = useState<any | null>(null)
  const [job, setJob] = useState<any | null>(null)

  useEffect(() => {
    const u = currentUser()
    if (!u) { router.push("/auth/login"); return }
    setMe(u)
    const id = String(params?.id ?? "")
    const j = readJobs().find(x => x.id === id) || null
    if (!j || j.user_id !== u.id) { router.push("/dashboard"); return }
    setJob(j)
  }, [router, params])

  if (!me || !job) return null

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const updated = {
      ...job,
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
      application_link: String(fd.get("application_link") ?? "")
    }
    const js = readJobs().map(j => j.id === job.id ? updated : j)
    saveJobs(js)
    router.push("/dashboard")
  }

  return (
    <div className="max-w-2xl mx-auto card p-6 space-y-6">
      <h1 className="text-2xl font-bold">İlanı Düzenle</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid2">
          <div><L req>Dükkan Adı</L><input required name="store_name" defaultValue={job.store_name} className="input" /></div>
          <div><L req>Pozisyon</L><input required name="position" defaultValue={job.position} className="input" /></div>
        </div>
        <div className="grid2">
          <div><L req>Çalışma Saatleri</L><input required name="work_hours" defaultValue={job.work_hours} className="input" /></div>
          <div><L>Lokasyon</L><input name="location" defaultValue={job.location ?? ""} className="input" /></div>
        </div>
        <div className="grid2">
          <div><L>Maaş (Min)</L><input name="salary_min" defaultValue={job.salary_min ?? ""} className="input" /></div>
          <div><L>Maaş (Max)</L><input name="salary_max" defaultValue={job.salary_max ?? ""} className="input" /></div>
        </div>
        <div className="grid2">
          <div><L>Çalışma Tipi</L><input name="employment_type" defaultValue={job.employment_type ?? ""} className="input" /></div>
          <div><L>Deneyim Seviyesi</L><input name="experience_level" defaultValue={job.experience_level ?? ""} className="input" /></div>
        </div>
        <div className="grid2">
          <div><L>Eğitim Durumu</L><input name="education_level" defaultValue={job.education_level ?? ""} className="input" /></div>
          <div><L>Yan Haklar (virgülle)</L><input name="benefits" defaultValue={job.benefits ?? ""} className="input" /></div>
        </div>
        <div><L>Görev & Sorumluluklar</L><textarea name="description" defaultValue={job.description ?? ""} className="input min-h-[120px]" /></div>
        <div><L req>İstenen Özellikler</L><textarea required name="requirements" defaultValue={job.requirements} className="input min-h-[120px]" /></div>
        <div className="grid2">
          <div><L>Başvuru E-posta</L><input name="application_email" defaultValue={job.application_email ?? ""} className="input" /></div>
          <div><L>Başvuru Telefon</L><input name="application_phone" defaultValue={job.application_phone ?? ""} className="input" /></div>
        </div>
        <div><L>Başvuru Linki</L><input name="application_link" defaultValue={job.application_link ?? ""} className="input" /></div>
        <div className="flex gap-2"><button className="btn btn-primary" type="submit">Kaydet</button></div>
      </form>
    </div>
  )
}
