"use client";
import { useEffect, useState } from "react";
import { fetchAds } from "../lib/ads";

type AdSlot = { dataUrl?: string|null; link?: string|null; alt?: string|null; width?: number|null };

export default function SideAd({ side = "left" }: { side?: "left" | "right" }) {
  const [slot, setSlot] = useState<AdSlot | null>(null);

  useEffect(() => {
    fetchAds().then(cfg => setSlot(side === "left" ? (cfg.left ?? null) : (cfg.right ?? null)));
  }, [side]);

  if (!slot?.dataUrl) return null;

  const href = slot.link || undefined;
  const external = !!href && /^(https?:\/\/|mailto:|tel:)/i.test(href);

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 30,
    ...(side === "left" ? { left: 12 } : { right: 12 }),
  };
  const imgStyle: React.CSSProperties = {
    width: slot.width ?? 160,
    height: "auto",
    maxHeight: "80vh",
    objectFit: "contain",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.35)",
    boxShadow: "0 12px 30px -15px rgba(2,6,23,.12)",
    background: "white",
  };

  const img = <img src={slot.dataUrl!} alt={slot.alt || "Reklam"} style={imgStyle} />;

  return (
    <div className="hidden lg:block" style={containerStyle}>
      {href ? (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}
