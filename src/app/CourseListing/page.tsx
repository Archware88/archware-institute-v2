"use client"

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import PurchasedCard from "@/components/Essentials/PurchasedCards";
import UserNavbar from "@/components/GeneralComponents/UserNavbar";
import { fetchCategories, fetchStudentCourses } from "@/api/courses";
import { rateCourse } from "@/api/ratings";
import { ICourse, ICategory } from "@/types/types";
import Layout from "@/components/GeneralComponents/GeneralLayout";
import SkeletonLoader from "@/components/GeneralComponents/SkeletonLoader";

// First, update your ICourse interface to allow both string and object instructors
interface ExtendedICourse extends ICourse {
  instructor?: string | { name: string };
}

interface CourseWithRating extends ExtendedICourse {
  userRating?: number;
  hasRated?: boolean;
  rating?: number;
  review?: string;
  progress?: number;
}

const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Ongoing");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [courses, setCourses] = useState<CourseWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch categories
      const fetchedCategories = await fetchCategories();
      if (fetchedCategories) {
        setCategories([{ id: 0, name: "All Categories" }, ...fetchedCategories]);
      }

      // Fetch student courses with rating data included
      const fetchedCourses = await fetchStudentCourses();
      if (fetchedCourses) {
        const normalizedCourses = fetchedCourses.map((course) => {
          // Convert instructor to object format if it's a string
          let instructor;
          if (course.instructor) {
            instructor = typeof course.instructor === 'string'
              ? { name: course.instructor }
              : course.instructor;
          }

          return {
            ...course,
            userRating: course.rating || 0,
            hasRated: course.rating !== undefined && course.rating !== null,
            instructor,
            progress: course.progress || 0
          } as CourseWithRating; // Explicit type assertion
        });

        setCourses(normalizedCourses);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
  };

  const handleRateCourse = async (courseId: number, rating: number, review?: string) => {
    try {
      // Optimistically update the UI
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? {
              ...course,
              userRating: rating,
              hasRated: true,
              rating: rating,
              review: review,
            }
            : course
        )
      );

      const response = await rateCourse(courseId, rating, review);
      if (!response.status) {
        // Revert if failed
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId
              ? {
                ...course,
                userRating: 0,
                hasRated: false,
                rating: undefined,
                review: undefined,
              }
              : course
          )
        );
        return { success: false, message: response.message || "Failed to update rating" };
      }
      return { success: true };
    } catch (error) {
      console.error("Error rating course:", error);
      // Revert on error
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? {
              ...course,
              userRating: 0,
              hasRated: false,
              rating: undefined,
              review: undefined,
            }
            : course
        )
      );
      return { success: false, message: "An error occurred while rating the course" };
    }
  };

  const filteredCourses = courses
    .filter((course) => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((course) => categoryFilter === "All Categories" || course.category === categoryFilter);

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "Completed") {
      return (b.progress || 0) - (a.progress || 0);
    } else {
      return (a.progress || 0) - (b.progress || 0);
    }
  });

  return (
    <Layout>
      <div>
        <UserNavbar />
        <div className="lg:px-[120px] pt-32">
          <h1 className="text-2xl font-bold mb-4">MY COURSES</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex space-x-4">
              <select
                className="border bg-white border-gray-300 p-2 rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Ongoing">Sort By: Ongoing</option>
                <option value="Completed">Sort By: Completed</option>
              </select>

              <select
                className="border bg-white border-gray-300 p-2 rounded-md"
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Search My Courses..."
                className="border bg-white border-gray-300 rounded-lg pl-10 pr-4 py-2 w-72"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : sortedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedCourses.map((course) => {
                // Ensure we're passing the correct author format
                const author = course.instructor
                  ? typeof course.instructor === 'string'
                    ? course.instructor
                    : course.instructor.name
                  : "Unknown Instructor";

                return (
                  <PurchasedCard
                    key={course.id}
                    id={course.id}
                    image={course.thumbnail}
                    title={course.title}
                    authors={author}
                    rating={course.userRating || 0}
                    progress={course.progress || 0}
                    onRateCourse={handleRateCourse}
                    hasRated={course.hasRated || false}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-blue-500 hover:text-blue-700"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyCourses;