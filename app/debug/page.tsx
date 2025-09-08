"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Debug() {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user ?? null;

      let prof = null as any;
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        prof = data ?? null;
      }

      setState({
        host: typeof window !== "undefined" ? window.location.host : null,
        user,
        prof,
      });
    })();
  }, []);

  return (
    <pre style={{ padding: 16, whiteSpace: "pre-wrap" }}>
      {JSON.stringify(state, null, 2)}
    </pre>
  );
}
