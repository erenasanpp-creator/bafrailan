"use client"
import { useEffect, useState } from "react"
import { adsConfig, AdsConfig } from "../lib/mockdb"

export default function MobileAdTop() {
  const [slot, setSlot] = useState<any | null>(null)
  useEffect(()=>{ const cfg: AdsConfig = adsConfig(); setSlot(cfg.mobileTop || null) }, [])
  if (!slot?.dataUrl) return null

  const width = slot.width || 320
  const height = slot.height || 100

  return (
    <div className="mobile-ad-top" style={{ position: "sticky", top: 56, zIndex: 35, display: "flex", justifyContent: "center" }}>
      <style jsx global>{`
        @media (min-width:1024px){ .mobile-ad-top{ display:none !important; } }
      `}</style>
      <a href={slot.href || "#"} target="_blank" rel="noopener noreferrer">
        <img src={slot.dataUrl} alt="mobil banner" style={{ width: width, maxWidth: "90vw", maxHeight: height, borderRadius: 12, border: "1px solid rgba(148,163,184,.4)", boxShadow: "0 10px 20px -10px rgba(2,132,199,.15)", background: "#fff" }} />
      </a>
    </div>
  )
}
