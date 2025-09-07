"use client"
import { useEffect, useState } from "react"
import { adsConfig } from "../lib/mockdb"

// Reklam slotu verisi (mockdb ile uyumlu)
type AdSlot = {
  dataUrl?: string | null
  link?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

// Konfig: bottom artık opsiyonel — yoksa top’a düşer
type AdsConfig = {
  mobileTop?: AdSlot | null
  mobileBottom?: AdSlot | null
}

type Props = { position?: "top" | "bottom" }

/**
 * Sadece mobilde görünür.
 * position="bottom" istenir ama konfigde yoksa mobileTop'a düşer.
 */
export default function MobileAd({ position = "top" }: Props) {
  const [slot, setSlot] = useState<AdSlot | null>(null)

  useEffect(() => {
    const cfg = (adsConfig?.() ?? {}) as AdsConfig
    const chosen =
      position === "bottom"
        ? (cfg.mobileBottom ?? cfg.mobileTop ?? null)
        : (cfg.mobileTop ?? cfg.mobileBottom ?? null)
    setSlot(chosen || null)
  }, [position])

  if (!slot?.dataUrl) return null

  // Varsayılan ölçüler (top: 320×100 sticky, bottom: 320×50 fixed)
  const width = (slot.width ?? undefined) || 320
  const height = (slot.height ?? undefined) || (position === "top" ? 100 : 50)

  const containerStyle: React.CSSProperties =
    position === "top"
      ? { position: "sticky", top: 56, zIndex: 35, display: "flex", justifyContent: "center" }
      : { position: "fixed", bottom: 8, left: 0, right: 0, zIndex: 35, display: "flex", justifyContent: "center" }

  const imgStyle: React.CSSProperties = {
    width,
    height: "auto",
    maxWidth: "90vw",
    maxHeight: height,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.4)",
    boxShadow: "0 10px 20px -10px rgba(2,6,23,.08)",
  }

  const href = slot.link || undefined
  const isExternal = !!href && /^(https?:\/\/|mailto:|tel:)/i.test(href)

  const img = <img src={slot.dataUrl!} alt={slot.alt || "Reklam"} style={imgStyle} />

  return (
    <div className="lg:hidden" style={containerStyle}>
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
