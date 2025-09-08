"use client";
import { useEffect, useState } from "react";
import { isAdmin } from "../../lib/isAdmin"; // yolunu konumuna göre ayarla

export default function DashboardPage() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    isAdmin().then(setAdmin).catch(() => setAdmin(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel</h1>

      {/* Herkese açık bölüm: kullanıcının ilanları vs. */}
      <section className="mb-8">
        {/* ... */}
      </section>

      {/* SADECE admin'e özel bölümler */}
      {admin && (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Firma Onayları</h2>
            {/* bekleyen işverenleri listele / onayla */}
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">İlan Yönetimi</h2>
            {/* ilan kaldır / düzenle */}
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Reklam Alanları</h2>
            {/* banner upload / kaydet */}
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Site İstatistikleri</h2>
            {/* ziyaret sayıları, başvurular vb. */}
          </section>
        </>
      )}
    </div>
  );
}
