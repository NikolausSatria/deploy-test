import { NextResponse } from "next/server";

export async function middleware(req) {
  const origin = req.headers.get("origin");

  // Daftar origin yang diizinkan
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_URL,
    "http://localhost:3000", // for development
  ];

  // Izinkan origin tertentu atau semua origin
  if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
    const response = NextResponse.next();

    // Tambahkan header CORS
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
  }

  // Tangani preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  return NextResponse.next();
}

// Terapkan middleware ke semua rute API
export const config = {
  matcher: "/api/:path*", // Hanya berlaku untuk rute API
};