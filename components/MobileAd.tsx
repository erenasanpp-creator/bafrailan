"use client"
import { useEffect, useState } from "react"
import { adsConfig, AdsConfig } from "../lib/mockdb"

type Pos = "top" | "bottom"

export default function MobileAd({ pos }: { pos: Pos }) {
  const [slot, setSlot] = useState<any | null>(null)

  useEffect(() => {
    const cfg: AdsConfig = adsConfig()
    setSlot(pos === "top" ? cfg.mobileTop || null : cfg.mobileBottom || null)
  }, [pos])

  if (!slot?.dataUrl) return null

  // Defaults: top 320x100 sticky, bottom 320x50 fixed. Width can be overridden from admin.
  const width = slot.width || 320
  const height = slot.height || (pos === "top" ? 100 : 50)

  const containerStyle: React.CSSProperties =
    pos === "top"
      ? { position: "sticky", top: 56, zIndex: 35, display: "flex", justifyContent: "center" }
      : { position: "fixed", bottom: 8, left: 0, right: 0, zIndex: 35, display: "flex", justifyContent: "center" }

  const imgStyle: React.CSSProperties = { width, height: "auto", maxWidth: "90vw", maxHeight: height, borderRadius: 12, border: "1px solid rgba(148,163,184,.4)", boxShadow: "0 10px 20px -10px rgba(2,132,199,.15)", background: "#fff" }

  const img = <img src={slot.dataUrl} alt={`${pos} mobile banner`} style={imgStyle} />
  return (
    <div className="lg:hidden" style={containerStyle}>
      {slot.href ? <a href={slot.href} target="_blank" rel="noopener noreferrer">{img}</a> : img}
    </div>
  )
}
