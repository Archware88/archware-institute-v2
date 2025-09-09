// src/app/admin/layout.tsx
import AdminLayout from "@/components/Admin/AdminLayout";
import { ReactNode } from "react";

interface AdminRootLayoutProps {
    children: ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
    return <AdminLayout>{children}</AdminLayout>;
}