// lib/isAdmin.ts
import { supabase } from "./supabase";

// Bu e-postayla giriş yapan HERKES admin sayılır
const ADMIN_EMAIL = "erenasanpp@gmail.com";

export async function isAdmin(): Promise<boolean> {
  // 1) Oturum var mı?
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // 2) E-posta üzerinden admin?
  if ((user.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;

  // 3) Profilden admin (veritabanı rolü)
  const { data: prof } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return prof?.role === "admin";
}
