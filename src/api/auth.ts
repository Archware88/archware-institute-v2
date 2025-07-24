import { get , post } from "./api";
import {
  IUserCreateData,
  IUserResponse,
  IInstructorCreateData,
  IUserLoginData,
  IUserUpdateData,
} from "../types/types";

interface ApiError {
  status?: number;
  data?: {
    message?: string;
    errors?: {
      email?: string[];
      // other possible error fields
    };
  };
  message?: string;
  isApiError?: boolean;
}

// Create a new user
export const createUser = async (
  data: IUserCreateData
): Promise<IUserResponse> => {
  try {
    const response = await post<IUserResponse>("/register", data);
    return response;
  } catch (error: unknown) {
    console.error("Create User API error:", error);

    // Type guard for ApiError
    if (isApiError(error)) {
      return {
        status: false,
        message: error.message || "Registration failed",
        errors: error.data?.errors || {},
        role: "",
      };
    }

    // Fallback for non-API errors
    return {
      status: false,
      message: "Registration failed",
      errors: {},
      role: ""
    };
  }
};

// Type guard for ApiError
function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "isApiError" in error;
}
// Register a new instructor
export const registerInstructor = async (
  data: IInstructorCreateData
): Promise<IUserResponse | null> => {
  try {
    const response = await post<IUserResponse>("/register-instructor", data);
    return response;
  } catch (error) {
    console.error("Register Instructor API error:", error);
    return null;
  }
};

// User login
export const loginUser = async (
  data: IUserLoginData
): Promise<IUserResponse & { token?: string }> => {
  try {
    const response = await post<IUserResponse & { token: string }>(
      "/login",
      data
    );

    if (response.token) {
      localStorage.setItem("authToken", response.token);
    }

    return response;
  } catch (error) {
    console.error("Login User API error:", error);

    if (isApiError(error)) {
      return {
        status: false,
        message: error.data?.message || error.message || "Login failed",
        errors: error.data?.errors || {},
        role: "",
        token: undefined,
      };
    }

    return {
      status: false,
      message: "Login failed",
      errors: {},
      role: "",
      token: undefined,
    };
  }
};
export const verifyEmail = async (
  token: string
): Promise<{ message: string } | null> => {
  try {
    const response = await get<{ message: string }>(`/verify-email/${token}`);
    return response;
  } catch (error) {
    console.error("Verify Email API error:", error);
    return null;
  }
};
export const updateUserProfile = async (
  data: IUserUpdateData
): Promise<IUserResponse | null> => {
  try {
    const response = await post<IUserResponse>("/update-user-profile", data);
    return response;
  } catch (error) {
    console.error("Update User API error:", error);
    return null;
  }
};

export const logoutUser = async (): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await post<{ success: boolean; message?: string }>(
      "/logout",
      {}
    );
    return response;
  } catch (error: unknown) {
    console.error("Logout API error:", error);

    // Handle different error types
    if (isApiError(error)) {
      return {
        success: false,
        message: error.message || "Logout failed",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred during logout",
    };
  }
};