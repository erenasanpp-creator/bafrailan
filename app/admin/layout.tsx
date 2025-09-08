"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      // 1) Session var mı?
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace(`/auth/login?next=${encodeURIComponent(pathname || "/admin")}`);
        return;
      }
      // 2) Rol kontrolü
      const { data: prof } = await supabase
        .from("profiles")
        .select("role, approved")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!prof || prof.role !== "admin") {
        router.replace("/");
        return;
      }
      setReady(true);
    })();
  }, [router, pathname]);

  if (!ready) return null;
  return <>{children}</>;
}
