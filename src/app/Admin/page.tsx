// src/app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "../../api/auth";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is admin
        if (!isAdmin()) {
            router.push("/");
            return;
        }

        // Redirect to admin dashboard
        router.push("/Admin/Dashboard");
    }, [router]);

    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
}