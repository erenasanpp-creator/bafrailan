"use client";
import { useEffect, useState } from "react";
import { fetchAds } from "../lib/ads"; // "@/lib/ads" da olur

type AdSlot = { dataUrl?: string|null; link?: string|null; alt?: string|null; width?: number|null };

export default function MobileAd({ position = "top" }: { position?: "top" | "bottom" }) {
  const [slot, setSlot] = useState<AdSlot | null>(null);

  useEffect(() => {
    fetchAds().then(cfg => {
      const chosen =
        position === "bottom"
          ? (cfg.mobileTop ?? cfg.right ?? null)
          : (cfg.mobileTop ?? cfg.left ?? null);
      setSlot(chosen);
    });
  }, [position]);

  if (!slot?.dataUrl) return null;

  const href = slot.link || undefined;
  const external = !!href && /^(https?:\/\/|mailto:|tel:)/i.test(href);

  return (
    <div className="md:hidden w-full flex justify-center my-3">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="block w-full max-w-[360px]"
      >
        <img
          src={slot.dataUrl!}
          alt={slot.alt || "Reklam"}
          className="w-full h-auto rounded-lg border object-contain"
        />
      </a>
    </div>
  );
}
