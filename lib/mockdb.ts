// lib/mockdb.ts
// Geçici köprü: Eski mockdb import'larını kırmadan Supabase'e yönlendirir.
// Not: Şema farklıysa upsert/select alanlarını kendine göre sadeleştirebilirsin.

import { supabase } from "./supabase";

export type Job = any;
export type Application = any;
export type Profile = {
  id: string;
  role?: string | null;
  approved?: boolean | null;
  email?: string | null;
};

// ------ JOBS ------
export async function readJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) console.error("readJobs error:", error);
  return data ?? [];
}

// Eski kodun saveJobs([...]) veya saveJobs(obj) çağrılarına uyumlu basit upsert
export async function saveJobs(jobs: Job[] | Job): Promise<void> {
  const rows = Array.isArray(jobs) ? jobs : [jobs];
  const { error } = await supabase.from("jobs").upsert(rows);
  if (error) throw error;
}

// ------ APPLICATIONS (başvurular) ------
export async function readApps(): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) console.error("readApps error:", error);
  return data ?? [];
}

export async function saveApps(apps: Application[] | Application): Promise<void> {
  const rows = Array.isArray(apps) ? apps : [apps];
  const { error } = await supabase.from("applications").upsert(rows);
  if (error) throw error;
}

// ------ USERS / PROFILES ------
export async function users(): Promise<Profile[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, approved")
    .eq("id", auth.user.id);
  if (error) console.error("users error:", error);
  return (data ?? []).map((p: any) => ({
    ...p,
    email: auth.user?.email ?? null,
  }));
}

export async function saveUsers(_any: any): Promise<void> {
  // Kullanıcı yönetimi Supabase Auth + profiles ile yapılır; burada iş yok.
}

export async function currentUser(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: prof } = await supabase
    .from("profiles")
    .select("id, role, approved")
    .eq("id", user.id)
    .maybeSingle();
  return {
    id: user.id,
    email: user.email ?? null,
    role: prof?.role ?? null,
    approved: prof?.approved ?? null,
  };
}

// Eski guard çağrıları kırılmasın diye NO-OP bırakıyoruz:
export function ensureAdmin() { /* no-op */ }
export function ensureLoggedIn() { /* no-op */ }

// Bazı eski bileşenler için placeholder (reklam konfigürasyonu kullanmıyorsan boş dönsün)
export function adsConfig() { return {}; }
