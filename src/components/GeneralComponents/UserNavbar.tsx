'use client';
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaGlobe, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import Image from "next/image";
import { IProfileInfo, } from "@/types/types";
import { BASE_URL } from "@/api/constants";
import { logoutUser } from "@/api/auth";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

const UserNavbar = () => {
  const { cartCount } = useCart();
  // const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu toggle state
  const [profile, setProfile] = useState<IProfileInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInstructor, setIsInstructor] = useState(false);

  const getInitials = (firstname: string = '', lastname: string = '') => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase()
  };

  console.log(profile)
  const handleLogout = async () => {
    try {
      const result = await logoutUser();

      // Clear all storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      sessionStorage.clear();

      // Get current path and normalize it (remove trailing slashes)
      const currentPath = window.location.pathname.replace(/\/+$/, '');

      if (result.success) {
        // If we're on home page (either "" or "/")
        if (currentPath === '' || currentPath === '/') {
          // Force hard reload with cache bypass
          window.location.href = '/?logout=' + Date.now();
        } else {
          // Redirect to home with cache-busting parameter
          window.location.href = '/?logout=' + Date.now();
        }
      } else {
        alert(result.message || 'Logged out successfully');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };
  useEffect(() => {
    setLoading(true);
    try {
      const role = localStorage.getItem("userRole");
      const userData = localStorage.getItem("userData");

      if (role) {
        setIsInstructor(role === "instructor");
      }

      if (userData) {
        const parsedData = JSON.parse(userData);
        setProfile(parsedData);
      } else {
        setError("No user data found. Please log in again.");
      }
    } catch (err) {
      console.error("Error loading profile from localStorage:", err);
      setError("Failed to load profile information.");
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <div>
      {/* Desktop Navbar */}
      <div className="hidden md:block top-0 fixed w-full z-50 text-sm">
        <nav className="border-gray-300 py-3 px-12 flex items-center justify-between bg-[#FFFCF5]">
          {/* Left: Logo */}
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/assets/images/ArchwareLogo.svg"
                alt="ArchWare Logo"
                className="h-16"
                width={100}
                height={100}
              />
            </div>
          </Link>

          {/* Center: Search Bar */}
          <div className="flex-grow max-w-xl mx-6 relative">
            <input
              type="text"
              placeholder="Search for courses"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-6">
            <a href="/AllCourses" className="text-gray-600 hover:text-blue-600">
              Explore Categories
            </a>
            <a href="/Tutor/Home" className="text-gray-600 hover:text-blue-600">
              Become a Tutor
            </a>
          </div>

          {/* Right: Nav Items */}
          <div className="flex items-center space-x-6 text-[#010101]">
            {/* Profile Dropdown */}
            <div className="relative">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                      {profile?.profile_picture ? (
                        <Image
                          src={`${BASE_URL}/${profile.profile_picture}`}
                          alt="User"
                          className="h-10 w-10 rounded-full border"
                          width={100}
                          height={100}
                          unoptimized
                        />
                      ) : (
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#1B09A2] text-white font-bold ">
                          {getInitials(profile?.firstname, profile?.lastname)}
                        </div>
                      )}
                  <span className="ml-2 text-gray-700 text-sm">
                    Welcome, {profile?.firstname}!
                  </span>
                  <FaChevronDown className="ml-1 text-gray-500" />
                </div>
              )}

              {/* Dropdown Menu */}
              {isOpen && profile && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg z-50 overflow-hidden">
                  {/* User Info */}
                  <div className="pt-4 text-center border-b border-gray-300">
                    {profile?.profile_picture ? (
                      <Image
                        src={`${BASE_URL}/${profile.profile_picture || "/assets/images/profile-image.png"}`}
                        alt="User"
                        className="h-14 w-14 rounded-full mx-auto border"
                        width={100}
                        height={100}
                        unoptimized
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full text-center items-center flex justify-center mx-auto bg-[#1B09A2] text-white font-bold">
                        {getInitials(profile?.firstname, profile?.lastname)}
                      </div>
                    )}
                    <p className="mt-2 pb-1">
                      {profile.firstname} {profile.lastname}
                    </p>
                  </div>

                  {/* Conditional Menu Items */}
                  {isInstructor ? (
                    <>
                      <div className="py-2">
                        <a href="/TutorDashboard/Courses" className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-300">
                          Dashboard
                        </a>
                      </div>
                      <div className="pb-3">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cusor-pointer"
                        >
                          Log out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-2">
                      <div className=" my-1">
                        <a href="/MyCourses" className="block px-4 py-2 hover:bg-gray-100">My Courses</a>
                        <a href="/ShoppingCart" className="block px-4 py-2 hover:bg-gray-100">My Cart</a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">My Saved Items</a>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="">
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Notifications</a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Messages</a>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="">
                        <a href="/AccountSettings/ProfileSettings" className="block px-4 py-2 hover:bg-gray-100">
                          Profile Settings
                        </a>
                        {/* <a href="#" className="block px-4 py-2 hover:bg-gray-100">Account Settings</a> */}
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Help and Support</a>
                      </div>
                      <hr className="border-gray-300" />
                        <button
                          onClick={handleLogout}
                          className="text-red-500 hover:text-red-700 text-left py-2 px-4 cusor-pointer"
                        >
                          Log out
                        </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Icons */}
            <FaGlobe className="text-gray-600 text-lg cursor-pointer" />
            <div className="relative">
              <Link href="/ShoppingCart" className="text-gray-600 hover:text-blue-600">
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/">
          <>
            <Image
              src="/assets/images/ArchwareLogo.svg"
              alt="ArchWare Logo"
              width={80}
              height={80}
            />
          </>
        </Link>

        {/* Hamburger Icon */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 text-2xl cusor-pointer">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-t border-gray-300 z-50">
          <div className="p-4 flex flex-col space-y-3">
            <Link href="/AllCourses" className="text-gray-600 hover:text-blue-600">Explore Categories</Link>
            <Link href="/Tutor/Home" className="text-gray-600 hover:text-blue-600">Become a Tutor</Link>
            <hr />
            <Link href="#" className="text-gray-600 hover:text-blue-600">My Courses</Link>
            <Link href="/ShoppingCart" className="text-gray-600 hover:text-blue-600 flex items-center">
              My Cart
              {cartCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600">My Saved Items</Link>
            <hr />
            <Link href="/AccountSettings/ProfileSettings" className="text-gray-600 hover:text-blue-600">Profile Settings</Link>
            {/* <Link href="#" className="text-gray-600 hover:text-blue-600">Account Settings</Link> */}
            <Link href="#" className="text-gray-600 hover:text-blue-600">Help and Support</Link>
            <hr />
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 text-left cusor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNavbar;
