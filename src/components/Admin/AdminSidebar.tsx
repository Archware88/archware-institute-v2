// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar: React.FC = () => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <div className="w-64 bg-gray-800">
            <div className="flex items-center justify-center h-16 bg-gray-900">
                <span className="text-white font-bold uppercase">Admin Panel</span>
            </div>
            <nav className="mt-5 px-2">
                <Link
                    href="/Admin/Dashboard"
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive("/admin/dashboard")
                            ? "text-white bg-gray-900"
                            : "text-gray-300 hover:text-white hover:bg-gray-700"
                        }`}
                >
                    <svg
                        className="mr-4 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                    Dashboard
                </Link>
                <Link
                    href="/Admin/Courses"
                    className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive("/admin/courses")
                            ? "text-white bg-gray-900"
                            : "text-gray-300 hover:text-white hover:bg-gray-700"
                        }`}
                >
                    <svg
                        className="mr-4 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    Courses
                </Link>
            </nav>
        </div>
    );
};

export default AdminSidebar;