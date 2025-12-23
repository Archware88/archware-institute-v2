"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
    fetchCourseDetails,
    fetchCourseProgress,
    updateLessonProgress,
    ICourseDetails,
    ICourseProgress,
} from "../../../api/courses";
import UserNavbar from "@/components/GeneralComponents/UserNavbar";
import AuthLayout from "@/components/GeneralComponents/AuthLayout";
import SkeletonLoader from "@/components/GeneralComponents/SkeletonLoader";
import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/api/constants";
import { FaCheckCircle, FaPlayCircle, FaClock, FaDownload } from "react-icons/fa";
import { ILessonProgress } from "@/api/courses";

const CourseDetailsPage = () => {
    const params = useParams();
    const courseId = Number(params.id);
    const [courseDetails, setCourseDetails] = useState<ICourseDetails | null>(null);
    const [courseProgress, setCourseProgress] = useState<ICourseProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoTime, setCurrentVideoTime] = useState(0);
    const [videoError, setVideoError] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0);
    const hasEndedOnce = useRef(false);

    // Memoized active lesson data
    const activeLessonData = useMemo(() => {
        return courseDetails?.curriculum_details
            ?.flatMap(section => section.lesson)
            ?.find(lesson => lesson.lesson_id === activeLesson);
    }, [courseDetails, activeLesson]);

    // Get progress for a specific lesson
    const getLessonProgress = useCallback((lessonId: number) => {
        if (!courseProgress) return null;
        return courseProgress.lessons_progress.find(lp => lp.lesson_id === lessonId);
    }, [courseProgress]);

    // Calculate completion percentage for the active lesson
    const getCompletionPercentage = useCallback(() => {
        if (activeLesson === null) return 0;
        const progress = getLessonProgress(activeLesson);
        return progress?.watch_percentage || 0;
    }, [activeLesson, getLessonProgress]);

    const loadCourseData = useCallback(async () => {
        setLoading(true);
        try {
            const [detailsResponse, progress] = await Promise.all([
                fetchCourseDetails(courseId),
                fetchCourseProgress(courseId)
            ]);

            // Transform the response to match ICourseDetails
            const transformedDetails: ICourseDetails | null = detailsResponse ? {
                ...detailsResponse,
                profile_info: {
                    ...detailsResponse.profile_info,
                    profile_picture: detailsResponse.profile_info.profile_picture || 'default-profile.jpg'
                },
                course_info: {
                    ...detailsResponse.course_info,
                    courseprices: detailsResponse.course_info.courseprices.map((price: { course_price: number; course_id?: number; id?: number }) => ({
                        id: typeof price.id === 'number' ? price.id : 0,
                        course_id: price.course_id || courseId,
                        course_price: price.course_price
                    })),
                    description: detailsResponse.course_info.description || ''
                },
                curriculum_details: detailsResponse.curriculum_details.map(section => ({
                    ...section,
                    lesson: section.lesson.map(lesson => ({
                        ...lesson,
                        note: lesson.note || '',
                        resource: lesson.resource || ''
                    }))
                }))
            } : null;

            setCourseDetails(transformedDetails);
            setCourseProgress(progress);

            // Set first lesson as active if available
            if (transformedDetails?.curriculum_details?.length) {
                const firstLesson = transformedDetails.curriculum_details[0]?.lesson?.[0];
                if (firstLesson) {
                    setActiveLesson(firstLesson.lesson_id);
                }
            }
        } catch (error) {
            console.error("Error loading course data:", error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    // Handle video source changes and resume from saved position
    useEffect(() => {
        if (videoRef.current && activeLessonData?.video && activeLesson !== null) {
            const video = videoRef.current;
            const progress = getLessonProgress(activeLesson);

            // Reset ended flag when lesson changes
            hasEndedOnce.current = false;

            const handleLoadedMetadata = () => {
                setVideoDuration(video.duration);
                if (progress) {
                    // If lesson is completed, start from beginning
                    if (progress.is_completed) {
                        video.currentTime = 0;
                    } else {
                        // Use the exact saved time, but don't exceed duration
                        video.currentTime = Math.min(progress.current_watch_time, video.duration);
                    }
                    setCurrentVideoTime(video.currentTime);
                }
            };

            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.load();

            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, [activeLesson, activeLessonData?.video, getLessonProgress]);

    // Video control effects
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, []);

    // Video progress tracking
    useEffect(() => {
        if (!activeLessonData || !videoRef.current || activeLesson === null) return;

        const video = videoRef.current;
        let updateInterval: NodeJS.Timeout;
        let initialTimeout: NodeJS.Timeout | null = null;

        const sendProgressUpdate = () => {
            if (video.duration > 0 && activeLesson !== null) {
                const progress = getLessonProgress(activeLesson);

                // If lesson is already completed, we don't need to send updates
                if (progress?.is_completed) return;

                // Only send update if video is playing or we're at the end
                if (isPlaying || video.currentTime >= video.duration - 0.1) {
                    // In your sendProgressUpdate function:
                    updateLessonProgress(
                        activeLesson,
                        video.currentTime,
                        video.duration,
                        video.currentTime > video.duration - 5
                    ).then(updatedProgress => {
                        if (updatedProgress.status && updatedProgress.progress) {
                            const progress = updatedProgress.progress as unknown as ILessonProgress;
                            setCourseProgress(prev => {
                                if (!prev) return null;

                                return {
                                    ...prev,
                                    lessons_progress: prev.lessons_progress.map(lp =>
                                        lp.lesson_id === activeLesson ? {
                                            ...lp,
                                            current_watch_time: progress.current_watch_time,
                                            total_watch_time: progress.total_watch_time,
                                            watch_percentage: progress.watch_percentage || 0,
                                            is_completed: progress.is_completed
                                        } : lp
                                    )
                                };
                            });
                        }
                    });
                }
            }
        };

        const handleTimeUpdate = () => {
            setCurrentVideoTime(video.currentTime);
        };

        const handleEnded = () => {
            if (hasEndedOnce.current) return; // prevent repeated execution
            hasEndedOnce.current = true;

            clearTimeout(initialTimeout ?? undefined);
            clearInterval(updateInterval);

            if (video.duration > 0 && activeLesson !== null) {
                updateLessonProgress(
                    activeLesson,
                    video.duration,
                    video.duration,
                    true
                ).then(async (updatedProgress) => {
                    if (updatedProgress.status) {
                        // Optimistically update the lesson progress locally
                        setCourseProgress(prev => {
                            if (!prev) return null;

                            return {
                                ...prev,
                                lessons_progress: prev.lessons_progress.map(lp => {
                                    if (lp.lesson_id === activeLesson) {
                                        return {
                                            ...lp,
                                            current_watch_time: video.duration,
                                            total_watch_time: lp.total_watch_time + (video.duration - lp.current_watch_time),
                                            is_completed: true,
                                            watch_percentage: 100 // Ensure 100% if completed
                                        };
                                    }
                                    return lp;
                                })
                            };
                        });

                        // Refetch the entire course progress to get updated completion percentage
                        try {
                            const freshProgress = await fetchCourseProgress(courseId);
                            setCourseProgress(freshProgress);
                        } catch (error) {
                            console.error("Failed to refresh course progress:", error);
                            // Fallback: recalculate locally if API fails
                            setCourseProgress(prev => {
                                if (!prev || !courseDetails) return prev;

                                const totalLessons = courseDetails.curriculum_details.reduce(
                                    (sum, section) => sum + section.lesson.length, 0
                                );
                                const completedLessons = prev.lessons_progress.filter(
                                    lp => lp.is_completed
                                ).length;

                                return {
                                    ...prev,
                                    completion_percentage: Math.round((completedLessons / totalLessons) * 100),
                                    completed_lessons: completedLessons
                                };
                            });
                        }
                    }
                });
            }
        };

        // Set up event listeners
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);

        // Start the progress tracking
        initialTimeout = setTimeout(() => {
            sendProgressUpdate();
            updateInterval = setInterval(sendProgressUpdate, 5000);
        }, 10000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(updateInterval);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
        };
    }, [activeLesson, activeLessonData, getLessonProgress, isPlaying]);

    // Load data on mount
    useEffect(() => {
        loadCourseData();
    }, [loadCourseData]);

    if (loading) {
        return (
            <AuthLayout>
                <UserNavbar />
                <div className="p-6 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <SkeletonLoader />
                            <div className="mt-6 space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <SkeletonLoader key={i} />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <SkeletonLoader key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    if (!courseDetails) {
        return (
            <AuthLayout>
                <UserNavbar />
                <div className="p-6 md:p-12 text-center">
                    <h1 className="text-2xl font-bold">Course not found</h1>
                    <p className="mt-4">The course you`&apos;re looking for doesn`&apos;t exist or may have been removed.</p>
                    <Link href="/course-listing" className="mt-6 inline-block bg-[#1B09A2] text-white py-2 px-6 rounded-lg">
                        Browse Courses
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <UserNavbar />
            <div className="p-6 md:p-12">
                {/* Progress Overview */}
                {courseProgress && (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">
                                Course Progress: {courseProgress.completion_percentage}%
                            </h3>
                            <span className="text-sm text-gray-600">
                                {courseProgress.completed_lessons} of {courseProgress.total_lessons} lessons completed
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-[#1B09A2] h-2.5 rounded-full"
                                style={{
                                    width: `${courseProgress.completion_percentage}%`
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
                            {activeLessonData?.video ? (
                                <>
                                    {videoError ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600">
                                            <p>Failed to load video</p>
                                        </div>
                                    ) : (
                                        <>
                                            <video
                                                ref={videoRef}
                                                controls
                                                className="w-full h-full object-cover"
                                                src={activeLessonData.video}
                                                onError={() => setVideoError(true)}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const video = videoRef.current;
                                                    if (video) {
                                                        if (video.paused) {
                                                            video.play();
                                                        } else {
                                                            video.pause();
                                                        }
                                                    }
                                                }}
                                                preload="metadata"
                                            />
                                            {!isPlaying && (
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                                    onClick={() => videoRef.current?.play()}
                                                >
                                                    <FaPlayCircle className="w-16 h-16 text-white opacity-80 hover:opacity-100 transition-opacity" />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                                    <p>No video available for this lesson</p>
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {activeLessonData?.video && !videoError && (
                            <div className="mt-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>
                                        {Math.floor(currentVideoTime / 60)}:
                                        {(Math.floor(currentVideoTime % 60)).toString().padStart(2, '0')}
                                    </span>
                                    <span>
                                        {videoDuration
                                            ? `${Math.floor(videoDuration / 60)}:${(Math.floor(videoDuration % 60)).toString().padStart(2, '0')}`
                                            : '--:--'}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div
                                        className="bg-[#1B09A2] h-1.5 rounded-full"
                                        style={{ width: `${getCompletionPercentage()}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Course Info */}
                        <div className="mt-6 space-y-4">
                            <h1 className="text-3xl font-bold">{courseDetails.course_info.title}</h1>
                            <p className="text-gray-600">{courseDetails.course_info.subtitle}</p>

                            <div className="flex items-center gap-4 pt-4">
                                <Image
                                    src={`${BASE_URL}/images/${courseDetails.profile_info.profile_picture}`}
                                    alt="Instructor"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="font-semibold">
                                        {courseDetails.profile_info.firstname} {courseDetails.profile_info.lastname}
                                    </p>
                                    <p className="text-gray-600 text-sm">{courseDetails.profile_info.email}</p>
                                </div>
                            </div>

                            {/* Lesson Notes */}
                            {activeLessonData?.note && (
                                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-lg mb-2">Lesson Notes</h3>
                                    <p className="whitespace-pre-line">{activeLessonData.note}</p>
                                </div>
                            )}

                            {/* Lesson Resources */}
                            {activeLessonData?.resource && (
                                <div className="mt-4">
                                    <h3 className="font-bold text-lg mb-2">Resources</h3>
                                    <a
                                        href={activeLessonData.resource}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-2"
                                    >
                                        <FaDownload className="text-sm" />
                                        Download Resource
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Curriculum Sidebar */}
                    <div className="lg:sticky lg:top-4 lg:self-start bg-white rounded-lg shadow-md p-4 h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Course Curriculum</h2>
                            {courseProgress && (
                                <span className="text-sm bg-[#1B09A2] text-white px-2 py-1 rounded">
                                    {courseProgress.completion_percentage}% Complete
                                </span>
                            )}
                        </div>

                        {courseDetails.curriculum_details.length === 0 ? (
                            <p className="text-gray-500">No curriculum available for this course</p>
                        ) : (
                            <div className="space-y-4">
                                {courseDetails.curriculum_details.map((section) => (
                                    <div key={section.section_id}>
                                        <div className="font-medium p-2 bg-gray-50 rounded">
                                            {section.name}
                                        </div>
                                        <div className="mt-2 ml-2 space-y-2">
                                            {section.lesson.map((lesson) => {
                                                const progress = getLessonProgress(lesson.lesson_id);
                                                const isCompleted = progress?.is_completed || (progress?.watch_percentage && progress.watch_percentage >= 100);
                                                const isActive = activeLesson === lesson.lesson_id;

                                                return (
                                                    <div
                                                        key={lesson.lesson_id}
                                                        className={`p-3 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200 ${isActive
                                                            ? 'bg-[#1B09A2] text-white shadow-md'
                                                            : 'hover:bg-gray-50 hover:shadow-sm'
                                                            }`}
                                                        onClick={() => setActiveLesson(lesson.lesson_id)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {isCompleted ? (
                                                                <FaCheckCircle className="w-4 h-4 text-green-500" />
                                                            ) : progress ? (
                                                                <FaClock className="w-4 h-4 text-yellow-500" />
                                                            ) : (
                                                                <FaPlayCircle className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            <span>{lesson.title}</span>
                                                        </div>
                                                        {progress && (
                                                            <span className="text-xs">
                                                                {isCompleted ? '100%' : `${Math.round(progress.watch_percentage)}%`}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default CourseDetailsPage;