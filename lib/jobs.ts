import { supabase } from "@/lib/supabase";

export async function listJobs() {
  const { data } = await supabase.from("jobs").select("*").eq("active", true).order("created_at",{ascending:false});
  return data || [];
}
export async function createJob(job: any) {
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Giriş gerekli");
  const insert = { ...job, user_id: user.id, active: true };
  const { error } = await supabase.from("jobs").insert(insert);
  if (error) throw error;
}
