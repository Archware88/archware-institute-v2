import { get, post } from "./api";

interface RatingResponse {
  status: boolean;
  rating?: number;
  review?: string;
  message?: string;
}

export const rateCourse = async (
  courseId: number,
  rating: number,
  review?: string
): Promise<RatingResponse> => {
  try {
    const response = await post<RatingResponse>(`/rate-course/${courseId}`, {
      rating,
      review: review || "",
    });
    return response;
  } catch (error: any) {
    console.error("Rate Course API error:", error);
    return {
      status: false,
      message: error.response?.data?.message || "Failed to rate course",
    };
  }
};

export const getUserRating = async (
  courseId: number
): Promise<RatingResponse> => {
  try {
    const response = await get<RatingResponse>(`/get-user-rating/${courseId}`);
    return response;
  } catch (error: any) {
    console.error("Get User Rating API error:", error);
    return {
      status: false,
      message: error.response?.data?.message || "Failed to fetch rating",
    };
  }
};
