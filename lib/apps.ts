import { supabase } from "@/lib/supabase";

export async function applyJob(jobId: string, ownerId: string, form: any) {
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Giriş gerekli");
  const { error } = await supabase.from("applications").insert({
    job_id: jobId, job_owner_id: ownerId, candidate_id: user.id, ...form
  });
  if (error) throw error;
}
