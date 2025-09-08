"use client";
import { useEffect, useState } from "react";
// ÖNEMLİ: alias yerine göreceli yol
import { supabase } from "../../lib/supabase";

export default function Debug() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { (async () => {
    const u = (await supabase.auth.getUser()).data.user;
    const p = u ? (await supabase.from("profiles").select("*").eq("id", u.id).maybeSingle()).data : null;
    setS({ host: typeof window !== "undefined" ? location.host : null, user: u, prof: p });
  })(); }, []);
  return <pre style={{padding:16,whiteSpace:"pre-wrap"}}>{JSON.stringify(s, null, 2)}</pre>;
}
