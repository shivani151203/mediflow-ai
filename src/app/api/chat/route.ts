
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  try {
    // 1. Rate limiting: 20 requests per 15 minutes
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || "local";

    const rateLimit = checkRateLimit(
      `chat:${clientIp}`,
      20,
      15 * 60 * 1000
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many chat requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      );
    }

    // 2. Check Gemini API key
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    // 3. Validate request body
    const body = await request.json();
    const message = body.message;

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: "Please enter a valid message." },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message must be under 1000 characters." },
        { status: 400 }
      );
    }

    // 4. Initialize Gemini AI
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: `
          You are MediFlow AI, a helpful healthcare enquiry assistant.

          Your responsibilities:
          1. Answer general hospital-related questions.
          2. Explain how patients can request appointments.
          3. Provide clear and friendly responses.
          4. Help users find relevant hospital services.

          Safety rules:
          - Never diagnose diseases.
          - Never prescribe medicines or treatments.
          - Never claim to replace a qualified doctor.
          - For medical concerns, advise users to consult a
            qualified healthcare professional.
          - For emergencies, advise users to contact local
            emergency services immediately.
          - Never invent hospital details or doctor availability.
          - If you do not know something, clearly say so.

          Keep answers simple, polite and concise.
        `,
      },
    });

    // 5. Validate Gemini response
    const answer = response.text;

    if (!answer) {
      return NextResponse.json(
        { error: "The AI could not generate a response." },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer });

  } catch (error) {
    console.error("MediFlow AI error:", error);

    return NextResponse.json(
      {
        error: "Unable to process your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
