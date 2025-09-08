"use client";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const r = useRouter();
  const [role, setRole] = useState<"business"|"candidate">("business");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const owner_name = String(fd.get("owner_name") || "");
    const business_name = role === "business" ? String(fd.get("business_name") || "") : "";

    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { role } }});
    if (error) return alert(error.message);
    const user = data.user;
    await supabase.from("profiles").upsert({
      id: user?.id, role, approved: role==="business" ? false : true,
      owner_name, business_name
    });
    alert("Kayıt oluşturuldu. (E-posta doğrulaması gerekebilir)");
    r.push("/auth/login");
  }

  // mevcut formun HTML'i aynı kalsın; role state'ini sekmelerde kullan
  return (<>{/* mevcut form JSX'in */}</>);
}
