
"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Track from "../../../components/Track"
import { jobs as readJobs, currentUser, applications as readApps, saveApplications, users } from "../../../lib/mockdb"
import { formatMoney } from "../../../lib/util"

function normalizeApplyLink(s?: string | null): { href: string, external: boolean } | null {
  const raw = String(s || "").trim()
  if (!raw) return null
  if (raw.startsWith("#")) return { href: "#apply", external: false }
  if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) return { href: raw, external: true }
  if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(raw)) return { href: `mailto:${raw}`, external: true }
  if (/^(www\.)/i.test(raw)) return { href: `https://${raw}`, external: true }
  if (/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/.*)?$/i.test(raw)) return { href: `https://${raw}`, external: true }
  return { href: "#apply", external: false }
}

export default function JobDetail() {
  const params = useParams()
  const [job, setJob] = useState<any | null>(null)
  const [me, setMe] = useState<any | null>(null)
  const [owner, setOwner] = useState<any | null>(null)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    const id = String(params?.id ?? "")
    const j = readJobs().find(x => x.id === id) || null
    setJob(j)
    const user = currentUser()
    setMe(user)
    if (j) setOwner(users().find(u => u.id === j.user_id) || null)
    const apps = readApps()
    if (j && user) setApplied(apps.some(a => a.job_id === j.id && a.candidate_id === user.id))
  }, [params])

  const salary = useMemo(()=>{
    if (!job) return "-"
    const parts = []
    if (job.salary_min) parts.push(formatMoney(job.salary_min))
    if (job.salary_max) parts.push(formatMoney(job.salary_max))
    return parts.length ? parts.join(" - ") : "-"
  }, [job])

  async function fileToBase64(f: File): Promise<string> {
    const buf = await f.arrayBuffer()
    const bytes = new Uint8Array(buf)
    let binary = ""
    for (let i=0;i<bytes.length;i++) binary += String.fromCharCode(bytes[i])
    return btoa(binary)
  }

  async function onApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!me || me.role !== "candidate" || !job) return
    const fd = new FormData(e.currentTarget)
    let cv_name: string | null = null
    let cv_type: string | null = null
    let cv_data: string | null = null
    const fileInput = e.currentTarget.elements.namedItem("cv") as HTMLInputElement | null
    const file = fileInput?.files?.[0]
    if (file) { cv_name = file.name; cv_type = file.type || "application/octet-stream"; cv_data = await fileToBase64(file) }
    const apps = readApps()
    apps.push({
      id: String(Date.now()),
      job_id: job.id,
      job_owner_id: job.user_id,
      candidate_id: me.id,
      candidate_name: String(fd.get("candidate_name") ?? ""),
      candidate_email: String(fd.get("candidate_email") ?? ""),
      candidate_phone: String(fd.get("candidate_phone") ?? ""),
      experience: String(fd.get("experience") ?? ""),
      cv_name, cv_type, cv_data,
      created_at: new Date().toISOString()
    })
    saveApplications(apps)
    setApplied(true)
  }

  if (!job) return <div className="card p-6">İlan bulunamadı.</div>

  const normalized = normalizeApplyLink(job.application_link)
  const safeHref = normalized
    ? (normalized.external ? encodeURI(normalized.href) : normalized.href)
    : null

  return (
    <div className="space-y-6">
      <Track path={`/jobs/${job.id}`} />
      <div className="card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {owner?.logo_dataUrl && <img src={owner.logo_dataUrl} alt="logo" className="w-12 h-12 rounded-md border object-cover aspect-square" />}
            <div>
              <h1 className="text-2xl font-bold">{job.position}</h1>
              <div className="text-slate-600">{job.store_name} • {job.location ?? "Bafra"}</div>
            </div>
          </div>
          <span className="badge">{job.employment_type ?? "Tam Zamanlı"}</span>
        </div>

        <div className="grid2 text-slate-700">
          <div><span className="font-semibold">Çalışma Saatleri:</span> {job.work_hours}</div>
          <div><span className="font-semibold">Maaş Aralığı:</span> {salary}</div>
          <div><span className="font-semibold">Deneyim:</span> {job.experience_level ?? "-"}</div>
          <div><span className="font-semibold">Eğitim:</span> {job.education_level ?? "-"}</div>
        </div>

        {job.benefits && (
          <div className="flex flex-wrap gap-2">
            {job.benefits?.split(",").map((b:string,i:number)=>(<span key={i} className="pill">{b.trim()}</span>))}
          </div>
        )}

        <div className="space-y-2">
          <div className="font-semibold">Görev & Sorumluluklar</div>
          <p className="whitespace-pre-wrap text-slate-700">{job.description}</p>
        </div>

        <div className="space-y-2">
          <div className="font-semibold">İstenen Özellikler</div>
          <p className="whitespace-pre-wrap text-slate-700">{job.requirements}</p>
        </div>

        <div className="space-y-2">
          <div className="font-semibold">Başvuru</div>
          <div className="text-slate-700">
            {job.application_email && <div>E-posta: {job.application_email}</div>}
            {job.application_phone && <div>Telefon: {job.application_phone}</div>}
            {safeHref && (
              <div>
                {normalized?.external
                  ? <a className="text-brand underline" href={safeHref} target="_blank" rel="noopener noreferrer">Başvuru Formu</a>
                  : <a className="text-brand underline" href={safeHref}>Başvuru Formu</a>}
              </div>
            )}
          </div>
        </div>
      </div>

      {me?.role === "candidate" && (
        <div id="apply" className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Bu ilana başvur</h2>
          {applied ? (
            <div className="text-green-700">Bu ilana başvurdun. Başvurun işveren panelinde görünüyor.</div>
          ) : (
            <form onSubmit={onApply} className="space-y-4">
              <div className="grid2">
                <div><label className="label label-required">Ad Soyad</label><input name="candidate_name" required className="input" defaultValue={me.owner_name ?? ""} /></div>
                <div><label className="label label-required">E-posta</label><input name="candidate_email" required type="email" className="input" defaultValue={me.email} /></div>
              </div>
              <div><label className="label">Telefon</label><input name="candidate_phone" className="input" defaultValue={me.phone ?? ""} /></div>
              <div><label className="label label-required">Deneyim / Özet</label><textarea name="experience" required className="input min-h-[120px]" placeholder="Kısa deneyim ve yetenek özeti..." /></div>
              <div><label className="label">CV (PDF / DOC)</label><input name="cv" type="file" accept=".pdf,.doc,.docx,.txt" className="input" /></div>
              <button className="btn btn-primary" type="submit">Başvuruyu Gönder</button>
            </form>
          )}
        </div>
      )}

      <div><Link href="/" className="btn btn-outline">← İlanlara Dön</Link></div>
    </div>
  )
}
