import { get, post } from "./api";
import { ICourse, ICategory, ICourseDetailsResponse } from "../types/types";

export const fetchStudentCourses = async (): Promise<ICourse[] | null> => {
  try {
    const response = await get<{ status: boolean; courses: ICourse[] }>(
      "/get-course-student-purhcase"
    );
    return response.status ? response.courses : null;
  } catch (error) {
    console.error("Fetch Student Courses API error:", error);
    return null;
  }
};

// New function to fetch popular courses
export const fetchPopularCourses = async (): Promise<ICourse[] | null> => {
  try {
    const response = await get<{ courses: ICourse[] }>("/get-popular-courses");
    return response.courses ?? null;
  } catch (error) {
    console.error("Fetch Popular Courses API error:", error);
    return null;
  }
};

export const fetchTrendingCourses = async (): Promise<ICourse[] | null> => {
  try {
    const response = await get<{ courses: ICourse[] }>("/get-trending-courses");
    return response.courses || null;
  } catch (error) {
    console.error("Fetch Trending Courses API error:", error);
    return null;
  }
};

export const fetchCategories = async (): Promise<ICategory[] | null> => {
  try {
    const response = await get<{ categories: ICategory[] }>(
      "/get-all-categories"
    );
    return response.categories ?? null;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

// Fetch courses for a specific category
export const fetchCoursesByCategory = async (
  categoryId: number
): Promise<ICourse[] | null> => {
  try {
    const response = await get<{
      courses: ICourse[]; // Changed from expecting 'data' property
      pagination: number;
    }>(`/get-courses-in-category/${categoryId}`);

    return response.courses ?? null; // Directly return courses array
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    return null;
  }
};

export const fetchAllCourses = async (): Promise<ICourse[]> => {
  try {
    const response = await get<{ status: boolean; all_courses: ICourse[] }>(
      "/get-all-courses"
    );
    return response.all_courses ?? []; // Always return an array
  } catch (error) {
    console.error("Error fetching all courses:", error);
    return []; // Return empty array instead of null
  }
};

// Fetch courses created by the instructor
export const fetchInstructorCourses = async (): Promise<ICourse[] | null> => {
  try {
    const response = await get<{ courses: ICourse[] }>("/instructor-courses");
    return response.courses ?? null;
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    return null;
  }
};

export const fetchCourseDetails = async (
  courseId: number
): Promise<ICourseDetailsResponse | null> => {
  try {
    const response = await get<ICourseDetailsResponse>(
      `/course-details?course_id=${courseId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching course details:", error);
    return null;
  }
};

export interface ICourseDetails {
  curriculum_id: number | null;
  profile_info: {
    firstname: string;
    lastname: string;
    email: string;
    profile_picture?: string;
  };
  course_info: {
    id: number;
    title: string;
    subtitle: string;
    video: string;
    image: string;
    status: string;
    instructor_id: number;
    courseprices: { id: number; course_id: number; course_price: number }[];
    description: string;
  };
  curriculum_details: Array<{
    section_id: number;
    name: string;
    lesson: Array<{
      title: string;
      video: string;
      note: string;
      resource: string;
      lesson_id: number;
      section_id: number;
    }>;
  }>;
  progress_stats?: {
    total_lessons: number;
    completed_lessons: number;
    total_watch_time: number;
  };
}

// Add these new interfaces
export interface ILessonProgress {
  lesson_id: number;
  current_watch_time: number;
  total_watch_time: number;
  is_completed: boolean;
  watch_percentage: number;
  section_id?: number;
  title?: string;
}

export interface ICourseProgress {
  completion_percentage: number;
  total_lessons: number;
  completed_lessons: number;
  total_watch_time: number;
  lessons_progress: ILessonProgress[];
  section_progress?: ISectionProgress[];
}

// Add these new API functions

// Update the existing ICourseDetails interface
export interface ICourseDetails extends ICourseDetailsResponse {
  progress_stats?: {
    total_lessons: number;
    completed_lessons: number;
    total_watch_time: number;
  };
  lessons_progress?: Record<number, {
    current_watch_time: number;
    total_watch_time: number;
    is_completed: boolean;
  }>;
}

// export interface ILessonProgress {
//   lesson_id: number;
//   section_id: number;
//   current_watch_time: number;
//   total_watch_time: number;
//   is_completed: boolean;
//   title?: string;
// }

export interface ISectionProgress {
  section_id: number;
  name: string;
  completion_percentage: number;
  total_lessons: number;
  completed_lessons: number;
}

export interface ICourseProgress {
  completion_percentage: number;
  total_lessons: number;
  completed_lessons: number;
  total_watch_time: number;
  lessons_progress: ILessonProgress[];
  section_progress?: ISectionProgress[];
}


function transformCourseDetails(
  response: ICourseDetailsResponse
): ICourseDetails {
  return {
    curriculum_id: response.curriculum_id,
    profile_info: response.profile_info,
    course_info: {
      ...response.course_info,
      courseprices: response.course_info.courseprices.map((price, index) => ({
        id: index + 1, // Generate ID if not available
        course_id: response.course_info.id,
        course_price: price.course_price,
      })),
    },
    curriculum_details: response.curriculum_details,
    // No need to include progress_stats here - it will be added later
  };
}

export const fetchCourseProgress = async (
  courseId: number
): Promise<ICourseProgress | null> => {
  try {
    const response = await get<ICourseProgress>(
      `/courses/${courseId}/progress`
    );
    return response;
  } catch (error) {
    console.error("Fetch Course Progress API error:", error);
    return null;
  }
};

export const updateLessonProgress = async (
  lessonId: number,
  currentTime: number,
  duration: number,
  isCompleted: boolean = false
): Promise<{
  status: boolean;
  progress?: string|number;
  watch_percentage?: number;
  message?: string;
}> => {
  try {
    // Ensure values are proper numbers
    const numericCurrentTime = Number(currentTime);
    const numericDuration = Number(duration);
    const boolIsCompleted = Boolean(isCompleted);

    // Calculate is_completed as a boolean
    const is_completed =
      boolIsCompleted || numericCurrentTime >= numericDuration * 0.95;

    const response = await post<{
      status: boolean;
      progress: string | number;
      completion_percentage: number;
      message: string;
    }>(
      "/lesson-progress",
      {
        lesson_id: Number(lessonId),
        current_time: numericCurrentTime,
        duration: numericDuration,
        is_completed: is_completed, // This is now definitely a boolean
      },
      {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    );

    return {
      status: response.status,
      progress: response.progress,
     watch_percentage: response.completion_percentage,
      message: response.message,
    };
  } catch {
    console.error("Progress update failed:");
    return {
      status: false,
      message: "Failed to update progress",
    };
  }
};


// Combined course details and progress fetcher
export const fetchCourseWithProgress = async (
  courseId: number
): Promise<{
  details: ICourseDetails | null;
  progress: ICourseProgress | null;
}> => {
  try {
    const [detailsResponse, progress] = await Promise.all([
      fetchCourseDetails(courseId),
      fetchCourseProgress(courseId),
    ]);

    const details = detailsResponse
      ? transformCourseDetails(detailsResponse)
      : null;
    return { details, progress };
  } catch (error) {
    console.error("Error fetching course with progress:", error);
    return { details: null, progress: null };
  }
};

// Helper to calculate section progress
export const calculateSectionProgress = (
  curriculumDetails: ICourseDetails["curriculum_details"],
  progressData: ICourseProgress | null
): ISectionProgress[] => {
  return curriculumDetails.map((section) => {
    const sectionLessons = section.lesson || [];
    const totalLessons = sectionLessons.length;

    const completedLessons = progressData
      ? sectionLessons.filter((lesson) => {
          const lessonProgress = progressData.lessons_progress.find(
            (lp) => lp.lesson_id === lesson.lesson_id
          );
          return lessonProgress?.is_completed;
        }).length
      : 0;

    return {
      section_id: section.section_id,
      name: section.name,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      completion_percentage:
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0,
    };
  });
};

// Enhanced course details fetcher with progress
export const fetchCourseDetailss = async (
  courseId: number,
): Promise<{
  details: ICourseDetails | null;
  progress: ICourseProgress | null;
  sectionProgress?: ISectionProgress[];
}> => {
  try {
    const { details, progress } = await fetchCourseWithProgress(
      courseId,
    );

    if (!details) {
      return { details: null, progress: null };
    }

    const sectionProgress = calculateSectionProgress(
      details.curriculum_details,
      progress
    );

    return {
      details,
      progress,
      sectionProgress,
    };
  } catch (error) {
    console.error("Fetch Course Details with Progress error:", error);
    return { details: null, progress: null };
  }
};

// Get progress for specific section
export const getSectionProgress = (
  progress: ICourseProgress | null,
  sectionId: number
) => {
  if (!progress) return null;

  const sectionLessons = progress.lessons_progress.filter(
    (lp) => lp.section_id === sectionId
  );

  const total = sectionLessons.length;
  const completed = sectionLessons.filter((lp) => lp.is_completed).length;

  return {
    section_id: sectionId,
    completion_percentage:
      total > 0 ? Math.round((completed / total) * 100) : 0,
    total_lessons: total,
    completed_lessons: completed,
    lessons: sectionLessons,
  };
};