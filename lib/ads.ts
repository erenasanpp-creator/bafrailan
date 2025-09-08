import { supabase } from "@/lib/supabase";

export type AdSlot = { dataUrl?: string|null; link?: string|null; alt?: string|null; width?: number|null };
export type AdsCfg = { left?: AdSlot|null; right?: AdSlot|null; mobileTop?: AdSlot|null };

export async function fetchAds(): Promise<AdsCfg> {
  const { data, error } = await supabase
    .from("ads")
    .select("left_slot,right_slot,mobile_top")  // SQL’de *_slot kullandıysak
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return {};
  return { left: data.left_slot, right: data.right_slot, mobileTop: data.mobile_top };
}

export async function saveAds(patch: Partial<{left:AdSlot;right:AdSlot;mobileTop:AdSlot}>) {
  const payload: any = {};
  if ("left" in patch) payload.left_slot = patch.left;
  if ("right" in patch) payload.right_slot = patch.right;
  if ("mobileTop" in patch) payload.mobile_top = patch.mobileTop;
  const { error } = await supabase.from("ads").update(payload).eq("id", 1);
  if (error) throw error;
}
