"use client";
import UnpurchasedCard from "@/components/Essentials/UnpurchasedCard";
import PurchasedCard from "@/components/Essentials/PurchasedCards";
import UserNavbar from "@/components/GeneralComponents/UserNavbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ICourse } from "@/types/types";
import {
  fetchStudentCourses,
  fetchPopularCourses,
  fetchTrendingCourses,
} from "@/api/courses";
import { useEffect, useState } from "react";
import AuthLayout from "@/components/GeneralComponents/AuthLayout";
import Image from "next/image";
import SkeletonLoader from "@/components/GeneralComponents/SkeletonLoader";
import Link from "next/link";

const CourseListing = () => {
  const [purchasedCourses, setPurchasedCourses] = useState<ICourse[]>([]);
  const [popularCourses, setPopularCourses] = useState<ICourse[]>([]);
  const [trendingCourses, setTrendingCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPopular, setLoadingPopular] = useState<boolean>(true);
  const [loadingTrending, setLoadingTrending] = useState<boolean>(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      const courses = await fetchStudentCourses();
      if (courses !== null) {
        setPurchasedCourses(courses);
      }
      setLoading(false);
    };

    const loadPopularCourses = async () => {
      setLoadingPopular(true);
      const courses = await fetchPopularCourses();
      if (courses !== null) {
        setPopularCourses(courses);
      }
      setLoadingPopular(false);
    };

    const loadTrendingCourses = async () => {
      setLoadingTrending(true);
      const courses = await fetchTrendingCourses();
      if (courses !== null) {
        setTrendingCourses(courses);
      }
      setLoadingTrending(false);
    };

    loadCourses();
    loadPopularCourses();
    loadTrendingCourses();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3.2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2.2, slidesToScroll: 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1.2, slidesToScroll: 1 },
      },
    ],
  };

  const renderCourses = (courses: ICourse[], isPurchased: boolean = false) => {
    const filteredCourses = isPurchased
      ? courses
      : courses.filter(course => course.price !== undefined);
    if (isDesktop && filteredCourses.length >= 4) {
      return (
        <Slider {...sliderSettings} className="mt-4">
          {courses.map((course, index) => (
            <div key={index} className="p-2">
              {isPurchased ? (
                <PurchasedCard
                  id={course.id}
                  image={course.thumbnail || null}
                  authors={Array.isArray(course.authors) ? course.authors : [course.authors ?? ""]}
                  rating={course.rating || 0}
                  progress={course.progress}
                  title={course.title}
                // Add other needed props individually instead of using {...course}
                />
              ) : (
                <UnpurchasedCard
                  image={course.thumbnail || null}
                  authors={[course.instructors ?? "no one"]}
                  rating={0}
                  reviews={0}
                  status="New"
                  {...course}
                />
              )}
            </div>
          ))}
        </Slider>
      );
    } else {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {courses.map((course, index) => (
            <div key={index} className="p-2">
              {isPurchased ? (
                <PurchasedCard
                  id={course.id}
                  image={course.thumbnail || null}
                  authors={course.instructor || { name: "Unknown Instructor" }}
                  rating={course.rating || 0}
                  progress={course.progress}
                  total_lessons={course.total_lessons}
                  completed_lessons={course.completed_lessons}
                  hasRated={course.hasRated || false} // You need to ensure this comes from your API
                  onRateCourse={async (courseId, rating, review) => {
                    // Implement your actual rating submission API call here
                    try {
                      const response = await submitCourseRating(courseId, rating, review);
                      return { success: true };
                    } catch (error) {
                      return { success: false, message: "Failed to submit rating" };
                    }
                  }}
                />
              ) : (
                <UnpurchasedCard
                  image={course.thumbnail || null}
                  authors={[course.instructors ?? "no one"]}
                  rating={0}
                  reviews={0}
                  status="New"
                  {...course}
                />
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <AuthLayout>
      <UserNavbar />
      <div className="p-6 md:p-12 bg-gray-50">
        {/* My Courses (Purchased) */}
        <section className="mt-12">
          {loading ? (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : purchasedCourses?.length ? (
            <div>
              <h2 className="text-2xl text-[#1B09A2]">CONTINUE LEARNING</h2>
              {renderCourses(purchasedCourses, true)}
            </div>
          ) : (
            <div className="md:flex items-center bg-[#88D613] text-white p-6 md:p-12 rounded-lg">
              <Image
                src="/assets/images/undraw_learning_re_45gp.svg"
                alt="Learning illustration"
                className="md:w-1/3 h-60 bg-white rounded-lg w-full"
                height={100}
                width={100}
              />
              <div className=" md:pl-12 md:pt-0 pt-6">
                <h2 className="text-3xl font-bold">HEY CHAMP!</h2>
                <p className="mt-2 text-lg">
                  Join thousands of learners who are unlocking new careers and
                  shaping their future.
                </p>
                <Link href="/AllCourses">
                  <div className="mt-4 w-fit text-white py-2 px-6 rounded-lg font-semibold bg-[#1B09A2]">
                    Browse Courses
                  </div>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Trending Courses */}
        <section className="mt-12">
          <h2 className="text-2xl text-[#1B09A2] uppercase">
            Trending Courses
          </h2>
          {loadingTrending ? (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : trendingCourses?.length ? (
            renderCourses(trendingCourses)
          ) : (
            <p className="text-center mt-4">
              No trending courses available at the moment.
            </p>
          )}
        </section>

        {/* Popular Courses */}
        <section className="mt-12">
          <h2 className="text-2xl text-[#1B09A2] uppercase">Popular Courses</h2>
          {loadingPopular ? (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : popularCourses?.length ? (
            renderCourses(popularCourses)
          ) : (
            <p className="text-center mt-4">
              No popular courses available at the moment.
            </p>
          )}
        </section>
      </div>
    </AuthLayout>
  );
};

export default CourseListing;