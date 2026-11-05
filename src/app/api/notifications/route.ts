import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

// ADMIN ONLY: Fetch notifications
export async function GET() {
  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorized. Admin login required." },
      { status: 401 }
    );
  }

  try {
    const [rows] = await pool.execute(
      `SELECT
        n.id,
        n.appointment_id,
        n.title,
        n.message,
        n.type,
        n.is_read,
        n.created_at,
        a.patient_name
       FROM notifications n
       INNER JOIN appointments a
       ON n.appointment_id = a.id
       ORDER BY n.created_at DESC`
    );

    return NextResponse.json({
      success: true,
      notifications: rows,
    });
  } catch (error) {
    console.error("Fetch notifications error:", error);

    return NextResponse.json(
      { error: "Unable to fetch notifications." },
      { status: 500 }
    );
  }
}

// ADMIN ONLY: Mark notification as read
export async function PATCH(request: NextRequest) {
  const requestOrigin = request.headers.get("origin");
  const appOrigin = new URL(request.url).origin;

  if (!requestOrigin || requestOrigin !== appOrigin) {
    return NextResponse.json(
      { error: "Forbidden. Invalid request origin." },
      { status: 403 }
    );
  }

  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorized. Admin login required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid notification ID." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `UPDATE notifications SET is_read = TRUE WHERE id = ?`,
      [id]
    ) as [import("mysql2/promise").ResultSetHeader, unknown];

    if (result.affectedRows === 0) {
      const [rows] = await pool.execute(
        `SELECT id FROM notifications WHERE id = ?`,
        [id]
      ) as [any[], unknown];

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Notification not found." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read.",
      id,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    return NextResponse.json(
      { error: "Unable to update notification." },
      { status: 500 }
    );
  }
}
