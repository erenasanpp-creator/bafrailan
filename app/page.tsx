"use client"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { JobCard } from "../components/JobCard"
import Track from "../components/Track"
import { jobs as readJobs } from "../lib/mockdb"

export default function Home({ searchParams }: any) {
  const [jobs, setJobs] = useState<any[]>([])
  const q = (searchParams?.q ?? "").trim?.() ?? ""

  useEffect(() => { setJobs(readJobs()) }, [])

  const filtered = useMemo(() => {
    return (jobs || []).filter(j =>
      j.is_active &&
      (!q ||
        j.store_name?.toLowerCase().includes(q.toLowerCase()) ||
        j.position?.toLowerCase().includes(q.toLowerCase()) ||
        (j.requirements || "").toLowerCase().includes(q.toLowerCase()) ||
        (j.location || "").toLowerCase().includes(q.toLowerCase())
      )
    ).sort((a,b)=> (a.created_at < b.created_at ? 1 : -1))
  }, [jobs, q])

  return (
    <div className="space-y-8">
      <Track path="/" />
      <div className="hero rounded-3xl border border-slate-200 p-8 sm:p-10 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Bafra’daki en güncel iş ilanları</h1>
            <p className="text-slate-600 mt-2">Modern ve sade arayüz. İşletmeni kaydet, onay al ve dakikalar içinde ilan ver. İş arayanlar da üye olup tek tıkla başvurabilir.</p>
          </div>
          <Link href="/dashboard/new" className="btn btn-primary">İlan Ver</Link>
        </div>
        <form className="mt-6 flex gap-2" action="/">
          <input name="q" placeholder="Pozisyon, dükkan adı veya özellik..." defaultValue={q} className="input" />
          <button className="btn btn-outline" type="submit">Ara</button>
        </form>
        <div className="mt-3 text-xs text-slate-500">Örnek: <span className="kbd">garson</span> <span className="kbd">kafe</span> <span className="kbd">bafra</span></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((j:any) => <JobCard key={j.id} job={j} />)}
      </div>
      {!filtered.length && (
        <div className="text-center text-slate-500">
          {q ? "Aramanıza uygun ilan bulunamadı." : "Henüz ilan yok. İlk ilanı siz verin!"}
        </div>
      )}
    </div>
  )
}
