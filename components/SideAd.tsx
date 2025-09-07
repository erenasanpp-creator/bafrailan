"use client"
import { useEffect, useState } from "react"
import { adsConfig } from "../lib/mockdb"

type AdSlot = {
  dataUrl?: string | null
  link?: string | null       // tercih edilen
  href?: string | null       // eski anahtar da desteklensin
  alt?: string | null
  width?: number | null
}

type AdsConfig = {
  // yeni isimler
  left?: AdSlot | null
  right?: AdSlot | null
  // eski isimleri de destekle (geriye dönük uyum)
  desktopLeft?: AdSlot | null
  desktopRight?: AdSlot | null
}

export default function SideAd({ side = "left" }: { side?: "left" | "right" }) {
  const [slot, setSlot] = useState<AdSlot | null>(null)

  useEffect(() => {
    const cfg = (adsConfig?.() ?? {}) as AdsConfig
    const s =
      side === "left"
        ? (cfg.left ?? cfg.desktopLeft ?? null)
        : (cfg.right ?? cfg.desktopRight ?? null)
    setSlot(s)
  }, [side])

  if (!slot?.dataUrl) return null

  const href = slot.link || slot.href || undefined
  const isExternal = !!href && /^(https?:\/\/|mailto:|tel:)/i.test(href)

  // Dikey ortalı, sayfanın dış kenarlarına yakın, masaüstünde görünsün
  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 30,
    ...(side === "left" ? { left: 12 } : { right: 12 }),
  }

  const imgStyle: React.CSSProperties = {
    width: (slot.width ?? 160),           // dar ve uzun bannerlar için 160px default
    height: "auto",
    maxHeight: "80vh",
    objectFit: "contain",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.35)",
    boxShadow: "0 12px 30px -15px rgba(2,6,23,.12)",
    background: "white",
  }

  const img = <img src={slot.dataUrl!} alt={slot.alt || "Reklam"} style={imgStyle} />

  return (
    <div className="hidden lg:block" style={containerStyle}>
      {href ? (
        <a href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  )
}
