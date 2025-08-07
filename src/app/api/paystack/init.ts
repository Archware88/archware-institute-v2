import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { amount, courseIds } = await request.json();

    if (!amount || !courseIds) {
      return NextResponse.json(
        { status: false, message: "Amount and courseIds are required" },
        { status: 400 }
      );
    }

    // Call your backend API to initialize Paystack payment
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/paystack/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            request.headers.get("authorization")?.split(" ")[1] || ""
          }`,
        },
        body: JSON.stringify({ amount, course_ids: courseIds }),
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          status: false,
          message: data.message || "Failed to initialize payment",
        },
        { status: backendResponse.status }
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

