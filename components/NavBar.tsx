"use client";
import { useEffect, useState } from "react";
import { isAdmin } from "../lib/isAdmin"; // gerekirse ../../lib/isAdmin

export default function NavBar() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    isAdmin().then(setAdmin).catch(() => setAdmin(false));
  }, []);

  return (
    <nav className="...">
      {/* mevcut menüler */}
      {/* ... */}

      {/* admin'e özel link veya butonlar */}
      {admin && (
        <a href="/dashboard?admin=1" className="btn btn-outline">
          Yönetim
        </a>
      )}
    </nav>
  );
}
v
