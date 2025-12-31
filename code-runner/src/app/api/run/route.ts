import { NextResponse } from "next/server";
import { z } from "zod";

const codeRunSchema = z.object({
  code: z.string().max(10000),
  language: z.enum(["typescript", "ts"]),
});

const CODE_EXECUTOR_URL = process.env.CODE_EXECUTOR_URL;
const EXECUTOR_API_KEY = process.env.EXECUTOR_API_KEY;

export async function POST(req: Request) {
  if (!CODE_EXECUTOR_URL || !EXECUTOR_API_KEY) {
    console.error("Missing CODE_EXECUTOR_URL or EXECUTOR_API_KEY");
    return NextResponse.json(
      { error: "Service not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const parseResult = codeRunSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { code } = parseResult.data;

    const response = await fetch(`${CODE_EXECUTOR_URL}/typescript`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EXECUTOR_API_KEY}`,
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Executor error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: "Execution failed", details: { error: errorText } },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (result.stderr && !result.stdout) {
      return NextResponse.json(
        { error: "Execution error", details: { error: result.stderr } },
        { status: 500 }
      );
    }

    return NextResponse.json({ output: result.stdout || "" }, { status: 200 });
  } catch (error) {
    console.error("Request failed:", error);
    return NextResponse.json(
      { error: "Internal error", details: { error: String(error) } },
      { status: 500 }
    );
  }
}
