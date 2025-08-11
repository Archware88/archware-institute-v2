"use client";
import { useState } from "react";
import { FiTrash, FiEdit, FiPlus, FiX, FiSave } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
// import { BASE_URL } from "@/api/constants";
import { createCourseCurriculum } from "@/api/course-setup";

interface Lesson {
    id: string;
    title: string;
    contentType: "video" | "article" | "slides" | null;
    content: File | string | null;
    note?: string;
}

interface CourseModule {
    id: string;
    title: string;
    editing: boolean;
    lessons: Lesson[];
}

// interface CourseCurriculumResponse {
//     status: boolean;
//     message: string;
//     curriculum_id?: number;
//     section_id?: number;
// }

const CourseContent = ({ nextStep }: { nextStep: () => void }) => {
    const [courseModules, setCourseModules] = useState<CourseModule[]>([
        {
            id: Date.now().toString(),
            title: "Module 1: Introduction",
            editing: false,
            lessons: [],
        },
    ]);
    const [isSaving, setIsSaving] = useState(false);
    const [curriculumId, setCurriculumId] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');

    // const createCourseCurriculum = async (formData: FormData): Promise<CourseCurriculumResponse | null> => {
    //     try {
    //         const response = await fetch(`${BASE_URL}/api/course-curriculum`, {
    //             method: 'POST',
    //             body: formData,
    //         });
    //         return await response.json();
    //     } catch (error) {
    //         console.error("Error creating course curriculum:", error);
    //         return null;
    //     }
    // };

    const submitModule = async (moduleToSave: CourseModule) => {
        if (!courseId) {
            toast.error("Course ID is missing");
            return null;
        }
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append("course_id", courseId);
            formData.append("section_name", moduleToSave.title.split(": ")[1] || moduleToSave.title);

            if (curriculumId) {
                formData.append("curriculum_id", curriculumId);
            }

            moduleToSave.lessons.forEach((lesson, index) => {
                formData.append(`lessons[${index}][title]`, lesson.title);
                if (lesson.note) {
                    formData.append(`lessons[${index}][note]`, lesson.note);
                }

                if (lesson.contentType === "video" && lesson.content instanceof File) {
                    formData.append(`lessons[${index}][video]`, lesson.content);
                }
                else if (lesson.contentType === "slides" && lesson.content instanceof File) {
                    formData.append(`lessons[${index}][resource]`, lesson.content);
                }
                else if (lesson.contentType === "article" && typeof lesson.content === "string") {
                    formData.append(`lessons[${index}][note]`, lesson.content);
                }
            });

            const response = await createCourseCurriculum(formData);

            if (response?.status) {
                if (response.curriculum_id && !curriculumId) {
                    setCurriculumId(response.curriculum_id.toString());
                }
                toast.success("Module saved successfully");
                return response;
            } else {
                toast.error(response?.message || "Failed to save module");
                return null;
            }
        } catch (error) {
            console.error("Error submitting curriculum:", error);
            toast.error("An error occurred while saving");
            return null;
        } finally {
            setIsSaving(false);
        }
    };

    const validateModule = (module: CourseModule): boolean => {
        if (!module.title.trim()) {
            toast.error("Module title is required");
            return false;
        }

        if (module.lessons.length === 0) {
            toast.error("Module must have at least one lesson");
            return false;
        }

        for (const lesson of module.lessons) {
            if (!lesson.title.trim()) {
                toast.error("All lessons must have a title");
                return false;
            }

            if (!lesson.contentType) {
                toast.error("All lessons must have a content type");
                return false;
            }

            if (lesson.contentType === "article" && typeof lesson.content === "string" && !lesson.content.trim()) {
                toast.error("Article content cannot be empty");
                return false;
            }

            if ((lesson.contentType === "video" || lesson.contentType === "slides") && !(lesson.content instanceof File)) {
                toast.error(`Please upload a ${lesson.contentType} file`);
                return false;
            }
        }

        return true;
    };

    const addModule = async () => {
        if (courseModules.length > 0) {
            const lastModule = courseModules[courseModules.length - 1];
            if (!validateModule(lastModule)) return;

            const result = await submitModule(lastModule);
            if (!result) return;
        }

        const newModule = {
            id: Date.now().toString(),
            title: `Module ${courseModules.length + 1}: New Module`,
            editing: false,
            lessons: [],
        };
        setCourseModules([...courseModules, newModule]);
    };

    const removeModule = (id: string) => {
        if (courseModules.length <= 1) {
            toast.error("You must have at least one module");
            return;
        }
        setCourseModules(courseModules.filter(module => module.id !== id));
    };

    const toggleEdit = (id: string) => {
        setCourseModules(courseModules.map(module =>
            module.id === id ? { ...module, editing: !module.editing } : module
        ));
    };

    const updateTitle = (id: string, newTitle: string) => {
        setCourseModules(courseModules.map(module =>
            module.id === id ? { ...module, title: newTitle } : module
        ));
    };

    const addLesson = (moduleId: string) => {
        setCourseModules(courseModules.map(module =>
            module.id === moduleId
                ? {
                    ...module,
                    lessons: [
                        ...module.lessons,
                        {
                            id: Date.now().toString(),
                            title: "",
                            contentType: null,
                            content: null,
                            note: ""
                        }
                    ]
                }
                : module
        ));
    };

    const removeLesson = (moduleId: string, lessonId: string) => {
        setCourseModules(courseModules.map(module =>
            module.id === moduleId
                ? {
                    ...module,
                    lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
                }
                : module
        ));
    };

    const setLessonContentType = (moduleId: string, lessonId: string, type: "video" | "article" | "slides") => {
        setCourseModules(courseModules.map(module =>
            module.id === moduleId
                ? {
                    ...module,
                    lessons: module.lessons.map(lesson =>
                        lesson.id === lessonId
                            ? {
                                ...lesson,
                                contentType: type,
                                content: type === "article" ? "" : null
                            }
                            : lesson
                    )
                }
                : module
        ));
    };

    const handleFileUpload = (moduleId: string, lessonId: string, file: File) => {
        setCourseModules(courseModules.map(module =>
            module.id === moduleId
                ? {
                    ...module,
                    lessons: module.lessons.map(lesson =>
                        lesson.id === lessonId
                            ? { ...lesson, content: file }
                            : lesson
                    )
                }
                : module
        ));
    };

    const updateLessonField = (
        moduleId: string,
        lessonId: string,
        field: "title" | "note" | "content",
        value: string | File
    ) => {
        setCourseModules(courseModules.map(module =>
            module.id === moduleId
                ? {
                    ...module,
                    lessons: module.lessons.map(lesson =>
                        lesson.id === lessonId
                            ? { ...lesson, [field]: value }
                            : lesson
                    )
                }
                : module
        ));
    };

    const handleNext = async () => {
        if (courseModules.length === 0) {
            toast.error("Please add at least one module");
            return;
        }

        const lastModule = courseModules[courseModules.length - 1];
        if (!validateModule(lastModule)) return;

        const result = await submitModule(lastModule);
        if (result) {
            nextStep();
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Course Content</h1>

            {curriculumId && (
                <div className="mb-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-md inline-block text-sm">
                    Curriculum ID: {curriculumId}
                </div>
            )}

            <div className="space-y-6">
                <AnimatePresence>
                    {courseModules.map((module) => (
                        <div key={module.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                {module.editing ? (
                                    <input
                                        type="text"
                                        value={module.title}
                                        onChange={(e) => updateTitle(module.id, e.target.value)}
                                        onBlur={() => toggleEdit(module.id)}
                                        onKeyDown={(e) => e.key === "Enter" && toggleEdit(module.id)}
                                        autoFocus
                                        className="flex-1 border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <h2 className="text-lg font-semibold">{module.title}</h2>
                                )}

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => toggleEdit(module.id)}
                                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                        aria-label="Edit module title"
                                    >
                                        <FiEdit />
                                    </button>
                                    <button
                                        onClick={() => removeModule(module.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                        aria-label="Remove module"
                                        disabled={courseModules.length <= 1}
                                    >
                                        <FiTrash />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {module.lessons.map((lesson) => (
                                    <div key={lesson.id} className="border rounded-md p-4 bg-white">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Lesson Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={lesson.title}
                                                    onChange={(e) => updateLessonField(module.id, lesson.id, "title", e.target.value)}
                                                    className="w-full border p-2 rounded-md"
                                                    placeholder="Enter lesson title"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Lesson Note (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={lesson.note || ""}
                                                    onChange={(e) => updateLessonField(module.id, lesson.id, "note", e.target.value)}
                                                    className="w-full border p-2 rounded-md"
                                                    placeholder="Short description"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Content Type
                                                </label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <button
                                                        onClick={() => setLessonContentType(module.id, lesson.id, "video")}
                                                        className={`p-2 rounded-md border transition-colors ${lesson.contentType === "video" ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"}`}
                                                    >
                                                        Video
                                                    </button>
                                                    <button
                                                        onClick={() => setLessonContentType(module.id, lesson.id, "article")}
                                                        className={`p-2 rounded-md border transition-colors ${lesson.contentType === "article" ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"}`}
                                                    >
                                                        Article
                                                    </button>
                                                    <button
                                                        onClick={() => setLessonContentType(module.id, lesson.id, "slides")}
                                                        className={`p-2 rounded-md border transition-colors ${lesson.contentType === "slides" ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"}`}
                                                    >
                                                        Slides
                                                    </button>
                                                </div>
                                            </div>

                                            {lesson.contentType === "video" && (
                                                <div className="mt-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Video File
                                                    </label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                                                        {lesson.content instanceof File ? (
                                                            <div className="flex justify-between items-center">
                                                                <span className="truncate">{lesson.content.name}</span>
                                                                <button
                                                                    onClick={() => updateLessonField(module.id, lesson.id, "content", "")}
                                                                    className="ml-2 text-red-500"
                                                                >
                                                                    <FiX />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <input
                                                                    type="file"
                                                                    accept="video/*"
                                                                    onChange={(e) => {
                                                                        if (e.target.files?.[0]) {
                                                                            handleFileUpload(module.id, lesson.id, e.target.files[0]);
                                                                        }
                                                                    }}
                                                                    className="hidden"
                                                                    id={`video-upload-${lesson.id}`}
                                                                />
                                                                <label
                                                                    htmlFor={`video-upload-${lesson.id}`}
                                                                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                                                                >
                                                                    Click to upload video (MP4, AVI, MOV)
                                                                </label>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {lesson.contentType === "article" && (
                                                <div className="mt-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Article Content
                                                    </label>
                                                    <textarea
                                                        value={typeof lesson.content === "string" ? lesson.content : ""}
                                                        onChange={(e) => updateLessonField(module.id, lesson.id, "content", e.target.value)}
                                                        className="w-full border p-2 rounded-md h-32"
                                                        placeholder="Write your article content here..."
                                                    />
                                                </div>
                                            )}

                                            {lesson.contentType === "slides" && (
                                                <div className="mt-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Slides File
                                                    </label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                                                        {lesson.content instanceof File ? (
                                                            <div className="flex justify-between items-center">
                                                                <span className="truncate">{lesson.content.name}</span>
                                                                <button
                                                                    onClick={() => updateLessonField(module.id, lesson.id, "content", "")}
                                                                    className="ml-2 text-red-500"
                                                                >
                                                                    <FiX />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <input
                                                                    type="file"
                                                                    accept=".pdf,.ppt,.pptx"
                                                                    onChange={(e) => {
                                                                        if (e.target.files?.[0]) {
                                                                            handleFileUpload(module.id, lesson.id, e.target.files[0]);
                                                                        }
                                                                    }}
                                                                    className="hidden"
                                                                    id={`slides-upload-${lesson.id}`}
                                                                />
                                                                <label
                                                                    htmlFor={`slides-upload-${lesson.id}`}
                                                                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                                                                >
                                                                    Click to upload slides (PDF, PPT, PPTX)
                                                                </label>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => removeLesson(module.id, lesson.id)}
                                                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                                                >
                                                    <FiTrash className="mr-1" /> Remove Lesson
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => addLesson(module.id)}
                                className="mt-3 px-3 py-1 bg-blue-50 text-blue-600 rounded-md flex items-center text-sm hover:bg-blue-100 transition-colors"
                            >
                                <FiPlus className="mr-1" /> Add Lesson
                            </button>
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-6 flex justify-between">
                <button
                    onClick={addModule}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <FiPlus className="mr-2" /> Add Module
                </button>

                <button
                    onClick={handleNext}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <FiSave className="mr-2 animate-spin" /> Saving...
                        </>
                    ) : (
                        "Save & Continue"
                    )}
                </button>
            </div>
        </div>
    );
};

export default CourseContent;