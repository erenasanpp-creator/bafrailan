"use client"
import { useEffect, useState } from "react"
import { adsConfig, AdsConfig } from "../lib/mockdb"

type Side = "left" | "right"

export default function SideAdFixed({ side }: { side: Side }) {
  const [slot, setSlot] = useState<any | null>(null)

  useEffect(() => {
    const cfg: AdsConfig = adsConfig()
    const data = side === "left" ? cfg.desktopLeft : cfg.desktopRight
    setSlot(data || null)
  }, [side])

  if (!slot?.dataUrl) return null
  const width = slot.width || 160
  const style: React.CSSProperties = (side === "left")
    ? { position: "fixed", left: 8, top: "50%", transform: "translateY(-50%)", width, zIndex: 40 }
    : { position: "fixed", right: 8, top: "50%", transform: "translateY(-50%)", width, zIndex: 40 }

  const img = <img src={slot.dataUrl} alt={`${side} banner`} style={{ width: "100%", borderRadius: 12, border: "1px solid rgba(148,163,184,.4)", boxShadow: "0 10px 20px -10px rgba(2,132,199,.15)" }} />
  return (
    <div style={style}>
      {slot.href ? <a href={slot.href} target="_blank" rel="noopener noreferrer">{img}</a> : img}
    </div>
  )
}
