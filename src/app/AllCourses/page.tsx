"use client";
import UnpurchasedCard from "@/components/Essentials/UnpurchasedCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ICourse } from "@/types/types";
import { fetchPopularCourses, fetchTrendingCourses } from "@/api/courses";
import { useEffect, useState } from "react";
import Layout from "@/components/GeneralComponents/GeneralLayout";
import SkeletonLoader from "@/components/GeneralComponents/SkeletonLoader";

const CourseListing = () => {
    const [popularCourses, setPopularCourses] = useState<ICourse[]>([]);
    const [trendingCourses, setTrendingCourses] = useState<ICourse[]>([]);
    const [loading, setLoading] = useState({
        popular: true,
        trending: true
    });

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const [popular, trending] = await Promise.all([
                    fetchPopularCourses(),
                    fetchTrendingCourses()
                ]);

                setPopularCourses(popular ?? []);
                setTrendingCourses(trending ?? []);
            } catch (error) {
                console.error("Error loading courses:", error);
            } finally {
                setLoading({ popular: false, trending: false });
            }
        };

        loadCourses();
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
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 }
            }
        ]
    };

    const getCoursePrice = (course: ICourse): number => {
        return course.course_prices?.[0]?.course_price ||
            course.courseprices?.[0]?.course_price ||
            course.price || 0;
    };

    const getInstructorName = (course: ICourse): string[] => {
        if (course.instructors) return [course.instructors];
        if (course.authors && course.authors.length > 0) return course.authors;
        return ['Unknown Instructor'];
    };

    const renderCourseCard = (course: ICourse) => (
        <UnpurchasedCard
            key={course.id}
            id={course.id}
            image={course.image || course.thumbnail || '/default-course.jpg'}
            title={course.title}
            authors={getInstructorName(course)}
            rating={course.rating || course.average_rating || 0}
            reviews={course.reviews || 0}
            price={getCoursePrice(course)}
            status={course.status || "New"}
            is_saved={course.is_saved || false}
        />
    );

    const renderSkeletons = (count: number) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, idx) => (
                <SkeletonLoader key={idx} />
            ))}
        </div>
    );

    return (
        <Layout>
            <div className="p-6 md:p-12 bg-gray-50">
                {/* Trending Courses */}
                <section className="mb-12">
                    <h2 className="text-2xl text-[#1B09A2] uppercase mb-6">Trending Courses</h2>
                    {loading.trending ? (
                        renderSkeletons(4)
                    ) : trendingCourses.length > 0 ? (
                        <Slider {...sliderSettings} className="px-2">
                            {trendingCourses.map(course => (
                                <div key={course.id} className="px-2">
                                    {renderCourseCard(course)}
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <p className="text-center py-8 text-gray-500">
                            No trending courses found
                        </p>
                    )}
                </section>

                {/* Popular Courses */}
                <section className="mb-12">
                    <h2 className="text-2xl text-[#1B09A2] uppercase">Popular Courses</h2>
                    {loading.popular ? (
                        renderSkeletons(4)
                    ) : popularCourses.length > 0 ? (
                        <Slider {...sliderSettings} className="px-2">
                            {popularCourses.map(course => (
                                <div key={course.id} className="px-2">
                                    {renderCourseCard(course)}
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <p className="text-center py-8 text-gray-500">
                            No popular courses found
                        </p>
                    )}
                </section>
            </div>
        </Layout>
    );
};

export default CourseListing;