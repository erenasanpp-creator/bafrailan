"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const r = useRouter();
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    r.push("/");
  }
  // mevcut formun HTML'i aynı kalsın
  return (<>{/* mevcut form JSX'in */}</>);
}
