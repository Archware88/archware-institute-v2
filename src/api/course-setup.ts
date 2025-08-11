import { post } from "./api";

interface CourseLandingResponse {
  status: boolean;
  message: string;
  course_id?: number;
}

export const createCourseLanding = async (
  formData: FormData
): Promise<CourseLandingResponse | null> => {
  try {
    const response = await post<CourseLandingResponse>(
      "/course-landing",
      formData
    );
    return response;
  } catch (error) {
    console.error("Error creating course landing:", error);
    return null;
  }
};

interface CourseDescriptionResponse {
  status: boolean;
  message: string;
  course_id?: number;
}

export const createCourseDescription = async (
  formData: FormData
): Promise<CourseDescriptionResponse | null> => {
  try {
    const response = await post<CourseDescriptionResponse>(
      "/course-description",
      formData
    );
    return response;
  } catch (error) {
    console.error("Error adding course description:", error);
    return null;
  }
};

// New helper function for course curriculum
interface CourseCurriculumResponse {
  status: boolean;
  message: string;
  curriculum_id?: number;
  section_id?: number;
}

export const createCourseCurriculum = async (
  formData: FormData
): Promise<CourseCurriculumResponse | null> => {
  try {
    const response = await post<CourseCurriculumResponse>(
      "/course-curriculum",
      formData
    );
    return response;
  } catch (error) {
    console.error("Error creating course curriculum:", error);
    return null;
  }
};

interface CoursePricingResponse {
  status: boolean;
  message: string;
}

export const createCoursePricing = async (
  formData: FormData
): Promise<CoursePricingResponse | null> => {
  try {
    const response = await post<CoursePricingResponse>(
      "/course-pricing",
      formData
    );
    return response;
  } catch (error) {
    console.error("Error setting course pricing:", error);
    return null;
  }
};

// **New: Course Messages**
interface CourseMessagesResponse {
  status: boolean;
  message: string;
}

export const createCourseMessages = async (
  formData: FormData
): Promise<CourseMessagesResponse | null> => {
  try {
    const response = await post<CourseMessagesResponse>(
      "/course-message",
      formData
    );
    return response;
  } catch (error) {
    console.error("Error adding course messages:", error);
    return null;
  }
};

interface CourseSetupDoneResponse {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

interface CourseSetupPayload {
  course_id: number;
  completed_status: boolean;
}

export const markCourseSetupDone = async (
  payload: CourseSetupPayload
): Promise<CourseSetupDoneResponse | null> => {
  try {
    const response = await post<CourseSetupDoneResponse>(
      "/course-setup-done",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error marking course setup as done:", error);
    return null;
  }
};