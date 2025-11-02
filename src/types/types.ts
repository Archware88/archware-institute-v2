export interface IInstructorCreateData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  age?: number;
  gender?: string;
  location?: string;
  expectation?: string;
}

export interface ISavedItem {
  id: number;
  user_id: number;
  course_id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  course: ICourse; // Expanded course details
}



  export interface IInstructorInfo {
  firstname: string;
  lastname: string;
  profile_picture?: string ;
  id: number;
  specialty: string;
  course_creation_time: string;
  currentEmployer?: {
    organization: string;
    jobtitle: string;
    instructor_id: number;
  };
  previousEmployer?: {
    organization: string;
    jobtitle: string;
    instructor_id: number;
  };
}

export interface IPaginatedCourses {
  current_page: number;
  data: ICourse[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}



export interface IUserResponse {
  status: boolean;
  message: string;
  role: string;
  token?: string;
  errors?: Record<string, string[]>; // For validation errors
  expires_at?: string;
}

export interface IUserCreateData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  age?: number;
  gender?: string;
  location?: string;
  expectation?: string;
  preferredoccupation?: string;
  workexperience?: string;
  education?: string;
}

export interface IUserLoginData {
  email: string;
  password: string;
}


export interface IProfileInfo {
  firstname: string;
  lastname: string;
  email: string;
  gender?: string;
  phonenumber?: string;
  age?: number;
  profile_picture?: string;
  about?: string;
  preferredoccupation?: string;
  workexperience?: string;
  education?: string;
}



export interface ICourse {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructors?: string;
  total_cost?: number;
  rating?: number;
  image?: string;
  authors?: string[];
  reviews?: number;
  status?: "New" | "Best Seller" | "Top Rated" | "Top Teacher";
  student_count?: number;
  data?: string | undefined;
  courseprices?: { course_price: number }[];
  level?: string;
  updated?: string;
  category?: string;
  students_count?: number;
  average_rating?: number;
  course_prices?: { course_price: number }[];
  is_saved?: boolean;
  instructor_name?: string;
  total_reviews?: number;
  progress?: number;
  total_lessons?: number;
  completed_lessons?: number;
  hasRated?: boolean;
  reviews_avg_rating?: number;
  instructor?: string | { name: string; email: string};
}

export interface ICategory {
  id: number;
  name: string;
}

export interface IUserUpdateData {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  phonenumber?: string;
  gender?: string;
  location?: string;
  age?: number;
  expectation?: string;
  preferredoccupation?: string;
  workexperience?: string;
  education?: string;
  profile_picture?: string;
}

// In types.ts

export interface ICourseInfo {
  id: number;
  title: string;
  subtitle: string;
  video: string;
  image: string;
  status: string;
  instructor_id: number;
  courseprices: { course_price: number }[];
  description: string;
}

export interface ILesson {
  title: string;
  video: string;
  note: string;
  resource: string;
  lesson_id: number;
  section_id: number;
}

export interface ISection {
  section_id: number;
  name: string;
  lesson: ILesson[];
}

export interface ICourseDetailsResponse {
  curriculum_id: number | null;
  profile_info: IProfileInfo;
  course_info: {
    id: number;
    title: string;
    subtitle: string;
    video: string;
    image: string;
    status: string;
    instructor_id: number;
    courseprices: { course_price: number }[]; // API format
    description: string;
  };
  curriculum_details: ISection[];
}

export interface ICartItem {
  id?: string | number; // Unique cart item ID
  course?: ICourse;    // The course details
  quantity?: number;   // Default 1, but allows for future expansion
  added_at?: string;   // ISO 8601 date string
  price_at_addition?: number; // Snapshot of price when added
  title?: string;
  image?: string;
  average_rating?: number;
  students_count?: number;
  courseprices?: { course_price: number }[];
  instructor?:string;
}

// Optional: Cart summary interface
export interface ICartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  item_count: number;
}

// Optional: Full cart response
export interface ICartResponse {
  items: ICartItem[];
  summary: ICartSummary;
  expires_at?: string; // For cart expiration functionality
}

export interface SavedItem {
  id: number;
  course_id: number;
}