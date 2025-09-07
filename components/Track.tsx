"use client"
import { useEffect } from "react"
import { visits, saveVisits } from "../lib/mockdb"

export default function Track({ path }: { path: string }) {
  useEffect(()=>{
    const v = visits()
    v.push({ path, ts: new Date().toISOString(), ua: navigator.userAgent })
    saveVisits(v)
  }, [path])
  return null
}
