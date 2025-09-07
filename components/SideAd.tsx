"use client"
import { useEffect, useState } from "react"
import { adsConfig } from "../lib/mockdb"

export default function SideAd({ side }: { side: "left" | "right" }) {
  const [img, setImg] = useState<string | null>(null)
  const [href, setHref] = useState<string | undefined>(undefined)

  useEffect(() => {
    const cfg = adsConfig()
    const data = side === "left" ? cfg.left : cfg.right
    setImg(data?.dataUrl || null)
    setHref(data?.href || undefined)
  }, [side])

  if (!img) return null

  const image = <img className="img" src={img} alt={`${side} banner`} />
  return (
    <div className="slot">
      {href ? <a href={href} target="_blank" rel="noopener noreferrer">{image}</a> : image}
    </div>
  )
}
