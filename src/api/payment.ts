import { API_URL } from "./constants";


interface IPaystackInitResponse {
  status: boolean;
  message?: string;
  authorization_url?: string;
  reference?: string;
  data?: {
    authorization_url: string;
    reference: string;
  };
}

interface IPaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed";
    reference: string;
    amount: number;
    metadata?: {
      course_ids?: number[];
      user_id?: string;
    };
  };
}

export const initializePaystackPayment = async (
  amount: number,
  courseIds: number[],
  email: string
): Promise<{ authorization_url: string; reference: string }> => {
  try {
    const response = await fetch(`${API_URL}/paystack/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
      body: JSON.stringify({
        amount,
        course_ids: courseIds,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to initialize payment");
    }

    const data: IPaystackInitResponse = await response.json();

    if (!data.status || !data.authorization_url || !data.reference) {
      throw new Error("Invalid payment initialization response");
    }

    return {
      authorization_url: data.authorization_url,
      reference: data.reference,
    };
  } catch (error) {
    console.error("Payment initialization error:", error);
    throw error;
  }
};

export const verifyPaystackPayment = async (
  reference: string
): Promise<IPaystackVerifyResponse> => {
  try {
    const response = await fetch(`${API_URL}/paystack/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error("Verification request failed");
    }

    const data: IPaystackVerifyResponse = await response.json();

    // If payment is successful, trigger cart clearance
    if (data.status && data.data?.status === "success") {
      try {
        const courseIds = data.data.metadata?.course_ids || [];
        const userId = data.data.metadata?.user_id;

        if (courseIds.length > 0 && userId) {
          await fetch(`${API_URL}/cart/clear-after-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                localStorage.getItem("authToken") || ""
              }`,
            },
            body: JSON.stringify({
              course_ids: courseIds,
              user_id: userId,
            }),
          });
        }
      } catch (cleanupError) {
        console.error("Cart cleanup error:", cleanupError);
      }
    }

    return data;
  } catch (error) {
    console.error("Payment verification error:", error);
    throw error;
  }
};

export const handlePaystackCallback = async (): Promise<{
  status: boolean;
  message: string;
}> => {
  try {
    const reference = new URLSearchParams(window.location.search).get(
      "reference"
    );
    if (!reference) {
      return { status: false, message: "No reference provided" };
    }

    const verification = await verifyPaystackPayment(reference);
    if (verification.status && verification.data?.status === "success") {
      return { status: true, message: "Payment successful" };
    }

    return {
      status: false,
      message: verification.message || "Payment verification failed",
    };
  } catch (error) {
    console.error("Callback handling error:", error);
    return {
      status: false,
      message:
        error instanceof Error ? error.message : "Payment processing failed",
    };
  }
};