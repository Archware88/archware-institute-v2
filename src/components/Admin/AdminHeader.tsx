// src/components/admin/AdminHeader.tsx
"use client";

import { useRouter } from "next/navigation";
import { logoutUser, } from "@/api/auth";

const AdminHeader: React.FC = () => {
    // const user = getCurrentUser();
    const router = useRouter();

    const handleLogout = () => {
        logoutUser();
        router.push("/login");
    };

    return (
        <header className="bg-white shadow">
            <div className="flex justify-between items-center px-6 py-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-700 mr-4">
                        Welcome, Admin
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;