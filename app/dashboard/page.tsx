"use client"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { currentUser, jobs as readJobs, saveJobs, applications as readApps } from "../../lib/mockdb"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([])
  const [me, setMe] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    const u = currentUser()
    if (!u) { router.push("/auth/login"); return }
    setMe(u)
    setJobs(readJobs())
  }, [router])

  const myApps = useMemo(()=>{
    if (!me) return []
    return readApps().filter(a => a.candidate_id === me.id).sort((a,b)=> a.created_at < b.created_at ? 1 : -1)
  }, [me])

  const inbox = useMemo(()=>{
    if (!me) return []
    return readApps().filter(a => a.job_owner_id === me.id).sort((a,b)=> a.created_at < b.created_at ? 1 : -1)
  }, [me])

  if (!me) return null

  if (me.role === "candidate") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Başvurularım</h1>
        <div className="grid gap-4">
          {myApps.map(a => (
            <div key={a.id} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.candidate_name}</div>
                  <div className="text-sm text-slate-600">{a.candidate_email} • {a.candidate_phone || "-"}</div>
                  <div className="text-xs text-slate-500">Tarih: {new Date(a.created_at).toLocaleString("tr-TR")}</div>
                </div>
                <Link className="btn btn-outline" href={`/jobs/${a.job_id}`} target="_blank">İlana Git</Link>
              </div>
              <div className="mt-3 text-slate-700 whitespace-pre-wrap">{a.experience || "-"}</div>
            </div>
          ))}
          {!myApps.length && <div className="card p-5 text-slate-600">Henüz bir başvurunuz yok.</div>}
        </div>
      </div>
    )
  }

  const mine = jobs.filter(j => j.user_id === me.id).sort((a,b)=> (a.created_at < b.created_at ? 1 : -1))

  function del(id: string) {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return
    const next = jobs.filter(j => j.id != id)
    saveJobs(next)
    setJobs(next)
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">İlanlarım</h1>
          <div className="flex gap-2">
            <Link href="/dashboard/profile" className="btn btn-outline">Profil / Logo</Link>
            <Link href="/dashboard/new" className={`btn ${me.approved ? "btn-primary" : "btn-outline pointer-events-none opacity-60"}`}>
              Yeni İlan
            </Link>
          </div>
        </div>

        {!me.approved && (
          <div className="card p-4 text-amber-800 bg-amber-50 border-amber-200">
            Hesabınız henüz onaylanmadı. Yönetici onayından sonra ilan verebilirsiniz.
          </div>
        )}

        <div className="grid gap-4">
          {mine.map((j:any) => (
            <div key={j.id} className="card p-5 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{j.position}</div>
                <div className="text-sm text-slate-600">{j.store_name} • {j.work_hours}</div>
              </div>
              <div className="flex gap-2">
                <Link className="btn btn-outline" href={`/jobs/${j.id}`} target="_blank">Görüntüle</Link>
                <Link className="btn btn-outline" href={`/dashboard/edit/${j.id}`}>Düzenle</Link>
                <button className="btn btn-outline" onClick={()=>del(j.id)}>Sil</button>
              </div>
            </div>
          ))}
          {!mine.length && (
            <div className="card p-5 text-slate-600">
              Henüz ilanınız yok. <Link className="text-brand underline" href="/dashboard/new">İlk ilanınızı ekleyin.</Link>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Başvurular (İşveren Gelen Kutusu)</h2>
        <div className="grid gap-3">
          {inbox.map(a => (
            <div key={a.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.candidate_name}</div>
                  <div className="text-sm text-slate-600">{a.candidate_email} • {a.candidate_phone || "-"}</div>
                  <div className="text-xs text-slate-500">Tarih: {new Date(a.created_at).toLocaleString("tr-TR")}</div>
                </div>
                <div className="flex gap-2">
                  <Link className="btn btn-outline" href={`/jobs/${a.job_id}`} target="_blank">İlana Git</Link>
                  {a.cv_data && <a className="btn btn-primary" href={`data:${a.cv_type || "application/octet-stream"};base64,${a.cv_data}`} download={a.cv_name || "cv"}>CV İndir</a>}
                </div>
              </div>
              <div className="mt-3 text-slate-700 whitespace-pre-wrap">{a.experience || "-"}</div>
            </div>
          ))}
          {!inbox.length && <div className="card p-5 text-slate-600">Henüz başvuru yok.</div>}
        </div>
      </section>
    </div>
  )
}
