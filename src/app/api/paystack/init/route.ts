import { NextResponse } from "next/server";
import { BASE_URL } from "@/api/constants";

export async function POST(request: Request) {
  try {
    const { amount, courseIds } = await request.json();

    if (!amount || !courseIds) {
      return NextResponse.json(
        { status: false, message: "Amount and courseIds are required" },
        { status: 400 }
      );
    }

    // Call your Laravel backend endpoint directly
    const laravelResponse = await fetch(
      `${BASE_URL}/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount,
          course_ids: courseIds,
        }),
      }
    );

    const data = await laravelResponse.json();

    if (!laravelResponse.ok) {
      return NextResponse.json(
        {
          status: false,
          message: data.message || "Payment initialization failed",
        },
        { status: laravelResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Paystack initialization error:", error);
    return NextResponse.json(
      {
        status: false,
        message:
          error instanceof Error
            ? error.message
            : "Payment initialization failed",
      },
      { status: 500 }
    );
  }
}
