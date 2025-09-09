"use client";
import React, { useEffect, useState } from 'react';
import { getCourses, getPendingCourses, approveCourse, rejectCourse } from '@/api/adminservice';

interface Course {
    id: number;
    title: string;
    subtitle: string;
    status: string;
    image: string;
    created_at: string;
    instructor: {
        id: number;
        name: string;
        email: string;
    };
    categories: Array<{
        id: number;
        name: string;
    }>;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        count: number;
        per_page: number;
        current_page: number;
        total_pages: number;
        last_page :number
    };
}

const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [viewPending, setViewPending] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, [currentPage, statusFilter, viewPending]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            let response: PaginatedResponse<Course>;

            if (viewPending) {
                response = await getPendingCourses(currentPage);
            } else {
                response = await getCourses(currentPage, statusFilter);
            }

            setCourses(response.data);
            setTotalPages(response.pagination.last_page); // Use last_page instead of total_pages
        } catch (error) {
            setError('Failed to load courses');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            const result = await approveCourse(id);
            if (result.status) {
                // Refresh the list
                fetchCourses();
            } else {
                setError(result.message || 'Failed to approve course');
            }
        } catch (error) {
            setError('Failed to approve course');
            console.error(error);
        }
    };

    const handleReject = async (id: number) => {
        try {
            const result = await rejectCourse(id);
            if (result.status) {
                // Refresh the list
                fetchCourses();
            } else {
                setError(result.message || 'Failed to reject course');
            }
        } catch (error) {
            setError('Failed to reject course');
            console.error(error);
        }
    };

    const handleStatusChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        setViewPending(false);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Course Management</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setViewPending(!viewPending)}
                        className={`px-4 py-2 rounded-md ${viewPending
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        {viewPending ? 'View All Courses' : 'View Pending Courses'}
                    </button>
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Instructor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categories
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-md object-cover" src={course.image} alt={course.title} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                            <div className="text-sm text-gray-500">{course.subtitle}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{course.instructor.name}</div>
                                    <div className="text-sm text-gray-500">{course.instructor.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {course.categories.map(cat => cat.name).join(', ')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {course.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(course.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {course.status === 'inactive' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(course.id)}
                                                className="text-green-600 hover:text-green-900 mr-3"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(course.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {course.status === 'active' && (
                                        <button className="text-blue-600 hover:text-blue-900">
                                            View
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Courses;