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

    const checkAuthStatus = () => {
        const token = localStorage.getItem("authToken");
        const expiresAt = localStorage.getItem("tokenExpiresAt");

        if (!token || !expiresAt) {
            clearAuthData();
            setIsAuthenticated(false);
            return false;
        }

        if (new Date(expiresAt) < new Date()) {
            clearAuthData();
            setIsAuthenticated(false);
            return false;
        }

        setIsAuthenticated(true);
        return true;
    };

    const validateAndRedirect = () => {
        const isPublic = publicRoutes.includes(pathname);
        const isAuthValid = checkAuthStatus();

        if (!isPublic && !isAuthValid) {
            router.push("/");
        }
    };

    useEffect(() => {
        validateAndRedirect();

        const interval = setInterval(validateAndRedirect, 60000);
        return () => clearInterval(interval);
    }, [router, pathname]);

    return isAuthenticated ? <UserNavbar /> : <GuestNavbar />;
};

export default Navbar;