import { supabase } from "@/lib/supabase";

export async function getMe() {
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return prof ? { ...prof, email: user.email } : { id: user.id, email: user.email, role: null };
}
