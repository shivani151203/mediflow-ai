import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// PUBLIC API: Patients can submit appointment requests
export async function POST(request: Request) {
  try {
    // Rate limit: 5 appointment requests per 15 minutes
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || "local";

    const rateLimit = checkRateLimit(
      `appointments:${clientIp}`,
      5,
      15 * 60 * 1000
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many appointment requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      );
    }

    const body = await request.json();

    const {
      patientName,
      mobile,
      speciality,
      appointmentDate,
      message,
    } = body;

    if (
      typeof patientName !== "string" ||
      typeof mobile !== "string" ||
      typeof speciality !== "string" ||
      typeof appointmentDate !== "string"
    ) {
      return NextResponse.json(
        { error: "Please provide all required appointment details." },
        { status: 400 }
      );
    }

    const name = patientName.trim();
    const phone = mobile.trim();
    const selectedSpeciality = speciality.trim();
    const date = appointmentDate.trim();
    const additionalMessage =
      typeof message === "string" ? message.trim() : "";

    if (!name || name.length > 100) {
      return NextResponse.json(
        { error: "Please enter a valid patient name." },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (!selectedSpeciality || selectedSpeciality.length > 100) {
      return NextResponse.json(
        { error: "Please select a valid speciality." },
        { status: 400 }
      );
    }

    const validSpecialities = [
      "Cardiology",
      "Neurology",
      "Orthopedics",
      "General Medicine",
      "Dermatology",
      "Pediatrics",
      "Gynecology",
    ];

    if (!validSpecialities.includes(selectedSpeciality)) {
      return NextResponse.json(
        { error: "The selected speciality is not available." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);
    const today = new Date().toISOString().slice(0, 10);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date ||
      date < today
    ) {
      return NextResponse.json(
        { error: "Please select a valid future appointment date." },
        { status: 400 }
      );
    }

    if (additionalMessage.length > 500) {
      return NextResponse.json(
        { error: "Message must be under 500 characters." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO appointments
       (patient_name, mobile, speciality, appointment_date, message)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        phone,
        selectedSpeciality,
        date,
        additionalMessage || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Appointment request submitted successfully.",
        appointmentId: result.insertId,
        status: "PENDING",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment API error:", error);

    return NextResponse.json(
      { error: "Unable to save your appointment. Please try again." },
      { status: 500 }
    );
  }
}

// ADMIN ONLY: Fetch all appointments
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
        id,
        patient_name,
        mobile,
        speciality,
        appointment_date,
        message,
        status,
        created_at
       FROM appointments
       ORDER BY created_at DESC`
    );

    return NextResponse.json({
      success: true,
      appointments: rows,
    });
  } catch (error) {
    console.error("Fetch appointments error:", error);

    return NextResponse.json(
      { error: "Unable to fetch appointments." },
      { status: 500 }
    );
  }
}

// ADMIN ONLY: Approve or reject appointments
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

  let connection;

  try {
    const body = await request.json();

    const id = Number(body.id);
    const status = body.status;

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid appointment ID." },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid appointment status." },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT patient_name, speciality, appointment_date, status
       FROM appointments
       WHERE id = ?
       FOR UPDATE`,
      [id]
    ) as [any[], any];

    if (rows.length === 0) {
      await connection.rollback();

      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    const appointment = rows[0];

    if (appointment.status !== "PENDING") {
      await connection.rollback();

      return NextResponse.json(
        { error: "This appointment has already been processed." },
        { status: 409 }
      );
    }

    await connection.execute(
      `UPDATE appointments SET status = ? WHERE id = ?`,
      [status, id]
    );

    const appointmentDate = new Date(
      appointment.appointment_date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });

    const title =
      status === "APPROVED"
        ? "Appointment Approved"
        : "Appointment Rejected";

    const notificationMessage =
      status === "APPROVED"
        ? `Hello ${appointment.patient_name}, your ${appointment.speciality} appointment on ${appointmentDate} has been approved.`
        : `Hello ${appointment.patient_name}, your ${appointment.speciality} appointment request for ${appointmentDate} has been rejected. Please contact the hospital for assistance.`;

    await connection.execute(
      `INSERT INTO notifications
       (appointment_id, title, message, type)
       VALUES (?, ?, ?, ?)`,
      [id, title, notificationMessage, status]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Appointment status updated and notification created.",
      appointmentId: id,
      status,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Appointment update error:", error);

    return NextResponse.json(
      { error: "Unable to update appointment and create notification." },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
