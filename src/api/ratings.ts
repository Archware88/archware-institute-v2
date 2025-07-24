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
  } catch {
    console.error("Rate Course API error:");
    return {
      status: false,
      message: "Failed to rate course",
    };
  }
};

export const getUserRating = async (
  courseId: number
): Promise<RatingResponse> => {
  try {
    const response = await get<RatingResponse>(`/get-user-rating/${courseId}`);
    return response;
  } catch {
    console.error("Get User Rating API error:");
    return {
      status: false,
      message: "Failed to fetch rating",
    };
  }
};
