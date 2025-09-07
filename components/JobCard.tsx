"use client"
import Link from "next/link"
import { useMemo } from "react"
import { users } from "../lib/mockdb"
import { formatMoney, timeAgo } from "../lib/util"

export function JobCard({ job }: { job: any }) {
  const owner = useMemo(()=> users().find(u => u.id === job.user_id) || null, [job.user_id])

  const salary =
    (job.salary_min || job.salary_max)
      ? `${job.salary_min ? formatMoney(job.salary_min) : ""}${job.salary_min && job.salary_max ? " - " : ""}${job.salary_max ? formatMoney(job.salary_max) : ""}`
      : "-"

  const createdAgo = useMemo(()=> timeAgo(job.created_at), [job.created_at])
  const isNew = useMemo(()=> {
    const d = new Date(job.created_at || Date.now())
    const diff = (Date.now() - d.getTime()) / (1000*3600*24)
    return diff <= 7
  }, [job.created_at])

  const requirementsSnippet = useMemo(()=> {
    const t = String(job.requirements || "").trim()
    return t.length > 140 ? t.slice(0, 140) + "…" : t
  }, [job.requirements])

  const descriptionSnippet = useMemo(()=> {
    const t = String(job.description || "").trim()
    return t.length > 140 ? t.slice(0, 140) + "…" : t
  }, [job.description])

  return (
    <article className="card p-5 flex flex-col gap-4 hover:shadow-md transition">
      {/* Başlık + Logo + Rotalar */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {owner?.logo_dataUrl && <img src={owner.logo_dataUrl} alt="logo" className="w-10 h-10 rounded-md border object-cover aspect-square" />}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{job.position}</h3>
              {isNew && <span className="pill bg-green-100 text-green-700">Yeni</span>}
            </div>
            <div className="text-slate-600 text-sm">{job.store_name} • {job.location ?? "Bafra"} <span className="text-slate-400">• {createdAgo}</span></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {job.employment_type && <span className="pill">{job.employment_type}</span>}
          {job.experience_level && <span className="pill">{job.experience_level}</span>}
          {job.education_level && <span className="pill">{job.education_level}</span>}
        </div>
      </div>

      {/* Özet bilgiler */}
      <div className="grid md:grid-cols-3 gap-3 text-sm text-slate-700">
        <div><span className="font-medium">Saatler:</span> {job.work_hours}</div>
        <div><span className="font-medium">Maaş:</span> {salary}</div>
        <div><span className="font-medium">İletişim:</span> {job.application_phone || job.application_email || "-"}</div>
      </div>

      {/* Kısa açıklamalar */}
      {(requirementsSnippet || descriptionSnippet) && (
        <div className="text-sm text-slate-700">
          {requirementsSnippet && <div><span className="font-medium">Aranan:</span> {requirementsSnippet}</div>}
          {descriptionSnippet && <div className="mt-1"><span className="font-medium">Açıklama:</span> {descriptionSnippet}</div>}
        </div>
      )}

      {/* Yan haklar/etiketler */}
      {job.benefits && (
        <div className="flex flex-wrap gap-2">
          {String(job.benefits).split(",").slice(0,6).map((b:string,i:number)=>(
            <span key={i} className="pill">{b.trim()}</span>
          ))}
        </div>
      )}

      {/* Aksiyonlar */}
      <div className="flex items-center gap-2">
        <Link href={`/jobs/${job.id}`} className="btn btn-outline">Detay</Link>
        {job.application_phone && <a href={`tel:${job.application_phone}`} className="btn btn-primary">Ara</a>}
        {job.application_email && <a href={`mailto:${job.application_email}`} className="btn btn-outline">E‑posta</a>}
      </div>
    </article>
  )
}
