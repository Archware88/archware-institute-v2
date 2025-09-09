// src/services/adminService.ts
import { get, post, put } from "./api";

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalInstructors: number;
  totalStudents: number;
  pendingCourses: number;
}

interface Course {
  id: number;
  title: string;
  subtitle: string;
  status: string;
  image: string;
  created_at: string;
  updated_at: string;
  instructor: {
    id: number;
    name: string;
    email: string;
  };
  categories: Array<{
    id: number;
    name: string;
  }>;
  objectives: Array<Record<string, unknown>>;
  requirements: Array<Record<string, unknown>>;
  price: number | null;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    last_page: number
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await get<DashboardStats>(
      "/admin/dashboard/stats"
    );
    // Your API returns the stats directly, so just return the response
    return response;
  } catch (error) {
    console.error('Get Dashboard Stats API error:', error);
    throw error;
  }
};

export const getCourses = async (
  page: number = 1,
  status: string = ""
): Promise<PaginatedResponse<Course>> => {
  try {
    const response = await get<PaginatedResponse<Course>>(
      `/admin/courses?page=${page}&status=${status}`
    );
    return response;
  } catch (error) {
    console.error("Get Courses API error:", error);
    throw error;
  }
};

export const getPendingCourses = async (
  page: number = 1
): Promise<PaginatedResponse<Course>> => {
  try {
    const response = await get<PaginatedResponse<Course>>(
      `/admin/courses/pending?page=${page}`
    );
    return response;
  } catch (error) {
    console.error("Get Pending Courses API error:", error);
    throw error;
  }
};

export const getCourse = async (id: number): Promise<Course> => {
  try {
    const response = await get<Course>(`/admin/courses/${id}`);
    return response;
  } catch (error) {
    console.error("Get Course API error:", error);
    throw error;
  }
};

export const approveCourse = async (
  id: number
): Promise<{ status: boolean; message?: string }> => {
  try {
    const response = await post<{ status: boolean; message?: string }>(
      `/admin/courses/${id}/approve`
    );
    return response;
  } catch (error) {
    console.error("Approve Course API error:", error);
    return {
      status: false,
      message: "Failed to approve course",
    };
  }
};

export const rejectCourse = async (
  id: number
): Promise<{ status: boolean; message?: string }> => {
  try {
    const response = await post<{ status: boolean; message?: string }>(
      `/admin/courses/${id}/reject`
    );
    return response;
  } catch (error) {
    console.error("Reject Course API error:", error);
    return {
      status: false,
      message: "Failed to reject course",
    };
  }
};

export const updateCourseStatus = async (
  id: number,
  status: string
): Promise<{ status: boolean; message?: string }> => {
  try {
    const response = await put<{ status: boolean; message?: string }>(
      `/admin/courses/${id}/status`,
      { status }
    );
    return response;
  } catch (error) {
    console.error("Update Course Status API error:", error);
    return {
      status: false,
      message: "Failed to update course status",
    };
  }
};