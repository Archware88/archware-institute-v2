"use client";

import React, { useState, useEffect } from "react";
// import Footer from "../../component/GeneralComponents/footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import UnpurchasedCard from "@/components/Essentials/UnpurchasedCard";
import Layout from "@/components/GeneralComponents/GeneralLayout";
import {
  fetchCategories,
  fetchCoursesByCategory,
  fetchAllCourses,
} from "@/api/courses";
import { ICategory, ICourse } from "@/types/types";
import FeaturesGrid from "@/components/HomeComponents/FeatureGrid";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Link from "next/link";
import AuthContainer from "@/components/AuthComponents/AuthContainer";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: false,
  autoplaySpeed: 2000,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024, // for tablets
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768, // for mobile
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480, // small mobile
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const faqs = [
  {
    question: "What is Archware Institute?",
    answer:
      "Archware Institute is a platform offering expert-led courses for learners worldwide.",
  },
  {
    question: "Who are the courses designed for?",
    answer:
      "Our courses are designed for students, professionals, and anyone looking to enhance their skills.",
  },
  {
    question: "What types of courses are available?",
    answer:
      "We offer a variety of courses including technology, business, design, and more.",
  },
  {
    question: "Are the courses self-paced?",
    answer:
      "Yes, most of our courses are self-paced, allowing learners to study at their convenience.",
  },
  {
    question: "Do I receive a certificate after completing a course?",
    answer:
      "Yes, upon successful completion, you will receive a certificate of achievement.",
  },
  {
    question: "How are the courses delivered?",
    answer:
      "Courses are delivered through video lessons, live sessions, and interactive materials.",
  },
];

const logos = [
  '/assets/images/herbalife-nutrition-logo-brandlogos.net_ky1i6f5w6 1.png',
  '/assets/images/Kimley-Horn-OprVH251K_brandlogos.net 1.png',
  '/assets/images/Experian_PLC-OI5iWameB_brandlogos.net 1.png',
  '/assets/images/Equifax-OJprm5rM6_brandlogos.net 1.png',
  '/assets/images/Charles_Russell_Speechlys.png',
  '/assets/images/herbalife-nutrition-logo-brandlogos.net_ky1i6f5w6 1.png',
  '/assets/images/Kimley-Horn-OprVH251K_brandlogos.net 1.png',
  '/assets/images/Experian_PLC-OI5iWameB_brandlogos.net 1.png',
  '/assets/images/Equifax-OJprm5rM6_brandlogos.net 1.png',
  '/assets/images/Charles_Russell_Speechlys.png',
  '/assets/images/herbalife-nutrition-logo-brandlogos.net_ky1i6f5w6 1.png',
  '/assets/images/Kimley-Horn-OprVH251K_brandlogos.net 1.png',
  '/assets/images/Experian_PLC-OI5iWameB_brandlogos.net 1.png',
  '/assets/images/Equifax-OJprm5rM6_brandlogos.net 1.png',
  '/assets/images/Charles_Russell_Speechlys.png',
];



const Homepages = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch categories when the component mounts
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategories();
      if (cats) {
        setCategories(cats);
      }
      setLoadingCategories(false);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    // Check authentication status
    const authToken = localStorage.getItem('authToken');
    setIsLoggedIn(!!authToken);
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true);
      try {
        let courseData: ICourse[] = [];

        if (selectedCategory === "All") {
          const allCourses = await fetchAllCourses();
          courseData = allCourses ?? [];
        } else {
          const category = categories.find((cat) => cat.name === selectedCategory);
          if (category) {
            const categoryCourses = await fetchCoursesByCategory(category.id);
            courseData = categoryCourses ?? [];
          }
        }

        setCourses(courseData);
      } catch (error) {
        console.error("Failed to load courses:", error);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, [selectedCategory, categories]);

  return (
    <>
      <Layout>
        <div className="w-full">
          {/* Hero Section */}
          <section className="block lg:flex items-center justify-between lg:px-[110px] px-5 py-12 bg-white">
            <div className="lg:w-1/2 w-full">
              <div className="flex items-center">
                <div className=" border border-[#A6CE39] rounded-full flex items-center px-4 py-2  text-xs">
                  <Image
                    src="/assets/images/star.png"
                    alt="star"
                    className="mr-[15px]  w-[20px] h-[20px]"
                    width={100}
                    height={100}
                  />
                  Welcome to Archware Institute
                </div>
              </div>
              <h1 className="lg:text-4xl text-[27px] text-[#333] mt-4 font-medium lg:leading-14">
                Empowering{" "}
                <span className="text-[#88D613]">young Africans</span>
                {" "}with {" "}
                <span className="text-[#88D613]">skills</span> for the future

              </h1>
              <p className=" text-[#666] mt-5 text-sm lg:text-base text-justify">
                Master a specific skill to enhance your business operations,
                solve pressing challenges, launch a career, advance your
                expertise, or stay updated with industry trends.
              </p>
              <div className="lg:mt-15 mt-8">
                <Link
                  href="/AllCourses"
                  className="bg-[#1B09A2] text-sm text-white px-3 py-3 rounded-md mr-5"
                >
                  Browse Courses
                </Link>
                {!isLoggedIn && (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="border-2 border-[#002d72] text-sm text-[#002d72] px-10 py-2.5 rounded-md cursor-pointer"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
            <div>
              <Image
                src="/assets/images/Hero-Section.svg"
                alt="Student Learning Online"
                className="w-[420px] rounded-lg lg:mt-0 mt-12"
                width={100}
                height={100}
              />
            </div>
          </section>

          {/* Graduates Impact */}
          <section className="bg-[#E6E8E6] pt-[50px] pb-[26px] text-center font-medium text-[20px]">
            <h4>Our Graduates Are making impact at:</h4>

            <div className="overflow-hidden relative w-full py-10">
              <div className="marquee-track flex gap-10 items-center">
                {[...logos, ...logos].map((src, index) => (
                  <div key={index} className="flex-shrink-0">
                    <Image
                      src={src || "/assets/images/Logo.png"}
                      alt={`Logo ${index + 1}`}
                      width={150}
                      height={50}
                      className="w-[150px] max-h-[50px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* Why Archware */}
          <div className="text-center p-10 bg-[#A9DA21] text-black">
            <h2 className="text-[#1F3F95] lg:text-3xl text-lg font-medium">
              WHY ARCHWARE INSTITUTE
            </h2>
            <p className="mb-7 text-[#0A1532] lg:text-base text-sm mt-3">
              At Archware Institute, we provide you with the knowledge and tools
              needed to thrive in the ever-evolving tech industry.
            </p>
            <FeaturesGrid />
          </div>

          {/* Featured Courses */}
          <section className="p-[50px] bg-[#f8f8f8] text-left">
            <div className="w-[90%] mx-auto">
              <h2 className="text-[32px] text-[#1f3f95] mb-2.5">Our Courses</h2>
              <p className="text-lg text-[#0a1532] mb-5">
                Discover top courses curated just for you.
              </p>

              {/* Categories Filter */}
              <div className="flex gap-2.5 mb-5 overflow-x-auto whitespace-nowrap">
                {/* "All" Button */}
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`h-[38px] px-4 py-2 rounded-md text-sm border-black/20 cusor-pointer whitespace-nowrap ${selectedCategory === "All" ? `bg-[#88D613] text-black` : "hover:bg-[#c9f453] border text-black/40"
                    }`}
                >
                  All
                </button>

                {loadingCategories ? (
                  <p>Loading categories...</p>
                ) : (
                  categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`h-[38px] px-4 py-2 rounded-md text-sm border border-black/20 cusor-pointer whitespace-nowrap ${selectedCategory === category.name ? `bg-[#88D613] text-black` : "hover:bg-[#c9f453] text-black/40"
                        }`}
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>

              {/* Courses Carousel */}
              {loadingCourses ? (
                <p>Loading courses...</p>
              ) : // Update the UnpurchasedCard rendering part in the Courses section
                  courses.length > 0 ? (
                    courses.length <= 4 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course) => (
                          <UnpurchasedCard
                            key={course.id}
                            id={course.id}
                            image={course.image ?? ''}
                            title={course.title}
                            authors={course.instructor_name ? [course.instructor_name] : ["No instructor"]}
                            rating={course.average_rating ?? 0}
                            reviews={course.total_reviews ?? 0}
                            price={course.courseprices?.[0]?.course_price ?? 0}
                            status={course.status ?? "New"}
                            is_saved={course.is_saved}
                          />
                        ))}
                      </div>
                    ) : (
                      <Slider {...settings}>
                        {courses.map((course) => (
                          <UnpurchasedCard
                            key={course.id}
                            id={course.id}
                            image={course.image ?? ''}
                            title={course.title}
                            authors={course.instructor_name ? [course.instructor_name] : ["No instructor"]}
                            rating={course.average_rating ?? 0}
                            reviews={course.total_reviews ?? 0}
                            price={course.courseprices?.[0]?.course_price ?? 0}
                            status={course.status ?? "New"}
                            is_saved={course.is_saved}
                          />
                        ))}
                      </Slider>
                    )
                  ) : (
                    <p>No courses available in this category.</p>
                  )
                }
            </div>
          </section>

          {/* Tutor Section */}
          <section className="lg:flex flex-wrap items-center justify-between  bg-[#1B09A2] lg:px-[100px] py-[60px] px-5 text-[#F8F8F8]">
            <div className="lg:w-1/2 w-full">
              <h2 className="lg:text-3xl text-lg font-medium mb-5">
                ARE YOU A FIRST CLASS TUTOR?
              </h2>
              <p className="lg:text-base text-sm leading-relaxed mb-5 text-justify">
                Share your expertise and inspire the next generation of learners by becoming a tutor at Archware Institute. As a tutor, you’ll
                have the opportunity to create impactful courses, deliver live
                sessions, and guide students toward achieving their career
                goals. Whether you’re a seasoned professional or a passionate
                educator, we provide the platform and tools to help you reach a
                global audience while earning competitively for your efforts.
                Join our community of experts today and make a difference in the
                lives of learners worldwide!
              </p>
              <div className="lg:block flex justify-center">
                <Link href="/Tutor/Home" className="px-6 py-3 lg:text-base text-sm border border-white rounded transition-all duration-300 hover:bg-white hover:text-[#1F3F95]">
                  Become a Tutor
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 w-full lg:mt-0 mt-12 flex justify-center">
              <Image
                src="/assets/images/course2.jpeg"
                alt="Tutor"
                className="w-full lg:pl-20 lg:h-[420px] h-[300px] rounded-lg"
                width={1000}
                height={1000}
              />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 px-6 bg-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-300">
                  <button
                    className="w-full text-left py-4 px-2 flex justify-between cusor-pointer items-center text-gray-800 hover:text-blue-600 transition"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="text-lg font-medium">{faq.question}</span>
                    <span className="text-xl">
                      {openIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </button>
                  {openIndex === index && (
                    <p className="px-4 pb-4 text-gray-600">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* <Footer /> */}
        </div>
        {isAuthOpen && <AuthContainer onClose={() => setIsAuthOpen(false)} />}
      </Layout>
    </>
  );
};

export default Homepages;
