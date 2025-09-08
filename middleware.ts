// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function ok(req: NextRequest) {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Basic ")) return false;

  // Basic base64(user:pass) çöz
  const encoded = header.split(" ")[1] || "";
  // Edge runtime'da atob var
  const [user, pass] = atob(encoded).split(":");

  return (
    user === process.env.ADMIN_USER &&
    pass === process.env.ADMIN_PASS
  );
}

export function middleware(req: NextRequest) {
  // Doğruysa geç
  if (ok(req)) return NextResponse.next();

  // Yanlışsa tarayıcıdan kullanıcı/şifre sor
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}

// Sadece /admin ve altını koru (istersen /panel'i de ekleyebilirsin)
export const config = {
  matcher: ["/admin/:path*"],
};
