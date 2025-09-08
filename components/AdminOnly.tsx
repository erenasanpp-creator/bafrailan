"use client";
import { useEffect, useState } from "react";
import { isAdmin } from "../lib/isAdmin"; // components → lib (../)

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => { isAdmin().then(setOk).catch(() => setOk(false)); }, []);
  if (!ok) return null;
  return <>{children}</>;
}
