"use client";

export const dynamic = "force-dynamic"; // önbellek/SSR sapıtmalarını önle

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Me = { role?: string|null; approved?: boolean|null } | null;

export default function AdminPage() {
  const [me, setMe] = useState<Me>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  // SAYFA AÇILIR: kullanıcı & profil oku — YÖNLENDİRME YOK
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setMe(null); setLoading(false); return; }
      const { data: prof } = await supabase
        .from("profiles").select("role,approved").eq("id", user.id).maybeSingle();
      setMe(prof ?? null);
      setLoading(false);
    })();
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); return; }
    const uid = (await supabase.auth.getUser()).data.user!.id;
    const { data: prof } = await supabase
      .from("profiles").select("role,approved").eq("id", uid).maybeSingle();
    if (!prof || prof.role !== "admin") {
      await supabase.auth.signOut();
      setErr("Bu hesap admin değil.");
      return;
    }
    setMe(prof);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setMe(null);
  }

  if (loading) return null;

  if (!me || me.role !== "admin") {
    // ADMIN DEĞİLSE: giriş formu göster (redirect YOK)
    return (
      <div className="max-w-md mx-auto mt-16 p-6 rounded-xl border bg-white">
        <h1 className="text-xl font-semibold mb-4">Yönetim Girişi</h1>
        <p className="text-sm text-gray-600 mb-4">
          /admin sayfası herkese açıktır; panel sadece <b>admin</b> ile görünür.
        </p>
        <form onSubmit={handleLogin} className="space-y-3">
          <input name="email" type="email" required placeholder="Admin e-posta" className="w-full border rounded-lg px-3 py-2" />
          <input name="password" type="password" required placeholder="Şifre" className="w-full border rounded-lg px-3 py-2" />
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="w-full bg-blue-600 text-white rounded-lg py-2">Giriş Yap</button>
        </form>
      </div>
    );
  }

  // ADMIN ise: panel içeriğini göster
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Yönetim Paneli</h1>
        <button onClick={handleLogout} className="px-3 py-1.5 rounded-md border">Çıkış</button>
      </div>
      {/* Buraya mevcut admin dashboard'unu koy */}
      {/* <AdminDashboard /> */}
    </div>
  );
}
