import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const sessionSecret = process.env.SESSION_SECRET;

    if (!adminEmail || !passwordHash || !sessionSecret) {
      console.error("Admin authentication environment variables are missing.");
      return NextResponse.json(
        { error: "Authentication is not configured." },
        { status: 500 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Local-development key. In production, use an IP supplied
    // by a trusted reverse proxy, not an arbitrary client header.
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || "local";
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      );
    }

    const isEmailValid = email === adminEmail;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(sessionSecret);

    const token = await new SignJWT({
      role: "ADMIN",
      email: adminEmail,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .setSubject("admin")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful.",
    });

    response.cookies.set("mediflow_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Unable to process login." },
      { status: 500 }
    );
  }
}