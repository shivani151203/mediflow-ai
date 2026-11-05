
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("mediflow_session")?.value;

    if (!token) {
      return false;
    }

    const sessionSecret = process.env.SESSION_SECRET;

    if (!sessionSecret) {
      return false;
    }

    const secret = new TextEncoder().encode(sessionSecret);

    const { payload } = await jwtVerify(token, secret);

    return (
      payload.role === "ADMIN" &&
      payload.sub === "admin"
    );
  } catch {
    return false;
  }
}
