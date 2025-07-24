"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import GuestNavbar from "./GuestNavbar";
import UserNavbar from "./UserNavbar";

const publicRoutes = [
    '/',
    '/TermsAndConditions',
    '/AllCourses',
    '/Tutor/Home',
    '/Privacy',
];

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const clearAuthData = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiresAt");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");
        localStorage.removeItem("auth-storage");
    };

    const isPublicRoute = publicRoutes.includes(pathname);

    const checkAuthStatus = () => {
        if (isPublicRoute) {
            setIsAuthenticated(false);
            return false;
        }

        const token = localStorage.getItem("authToken");
        const expiresAt = localStorage.getItem("tokenExpiresAt");

        if (!token) {
            clearAuthData();
            setIsAuthenticated(false);
            router.push("/");
            return false;
        }

        if (!expiresAt) {
            clearAuthData();
            setIsAuthenticated(false);
            router.push("/");
            return false;
        }

        if (new Date(expiresAt) < new Date()) {
            clearAuthData();
            setIsAuthenticated(false);
            router.push("/");
            return false;
        }

        setIsAuthenticated(true);
        return true;
    };

    useEffect(() => {
        checkAuthStatus();

        const interval = setInterval(checkAuthStatus, 60000);
        return () => clearInterval(interval);
    }, [router, pathname]);

    if (isPublicRoute) {
        return <GuestNavbar />;
    }

    return isAuthenticated ? <UserNavbar /> : <GuestNavbar />;
};

export default Navbar;