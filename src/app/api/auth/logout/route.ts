import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const requestOrigin = request.headers.get("origin");
  const appOrigin = new URL(request.url).origin;

  if (!requestOrigin || requestOrigin !== appOrigin) {
    return NextResponse.json(
      { error: "Forbidden. Invalid request origin." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.set("mediflow_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}