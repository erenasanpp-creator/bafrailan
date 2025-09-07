"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

/**
 * Bu layout, /admin altındaki TÜM sayfaları sarar.
 * Sadece Supabase'te role='admin' olan kullanıcı görebilir.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      // 1) Kullanıcı var mı?
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace(`/auth/login?next=${encodeURIComponent(pathname || "/admin")}`);
        return;
      }
      // 2) Profili oku → role kontrolü
      const { data: prof } = await supabase
        .from("profiles")
        .select("role, approved")
        .eq("id", user.id)
        .maybeSingle();

      if (!prof || prof.role !== "admin") {
        router.replace("/"); // admin değilse ana sayfaya
        return;
      }
      setOk(true);
    })();
  }, [router, pathname]);

  // Yönlendirme yapılırken boş dön
  if (!ok) return null;
  return <>{children}</>;
}
