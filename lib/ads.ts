// lib/ads.ts
import { supabase } from "@/lib/supabase";

export type AdSlot = { dataUrl?: string|null; link?: string|null; alt?: string|null; width?: number|null };
export type AdsCfg = { left?: AdSlot|null; right?: AdSlot|null; mobileTop?: AdSlot|null };

export async function fetchAds(): Promise<AdsCfg> {
  const { data } = await supabase
    .from("ads")
    .select("left_slot,right_slot,mobile_top")
    .eq("id", 1)
    .maybeSingle();
  if (!data) return {};
  return { left: data.left_slot, right: data.right_slot, mobileTop: data.mobile_top };
}
