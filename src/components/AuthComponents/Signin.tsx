"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiX } from "react-icons/fi";
import { loginUser } from "@/api/auth";
import { fetchProfileInfo } from "@/api/student";
import { fetchInstructorInfo } from "@/api/instructor";

const LoginModal = ({ onClose, onSwitchToSignup }: { onClose: () => void; onSwitchToSignup: () => void }) => {
  const router = useRouter(); // Initialize router
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const successMessage = searchParams.get("success");
    const errorMessage = searchParams.get("error");

    if (successMessage) {
      setMessage(successMessage);
    } else if (errorMessage) {
      setMessage(errorMessage);
    }
  }, [searchParams]);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await loginUser({ email, password });

    if (response && response.status) {
      // Store token and role in localStorage
      localStorage.setItem("authToken", response.token ?? "");
      localStorage.setItem("userRole", response.role ?? "student");
      localStorage.setItem("tokenExpiresAt", response.expires_at);

      try {
        let profileData;
        if (response.role === "instructor") {
          profileData = await fetchInstructorInfo();
        } else {
          profileData = await fetchProfileInfo();
        }

        if (profileData) {
          const formattedProfile = 'email' in profileData ? profileData : { ...profileData, email: '' };
          localStorage.setItem("userData", JSON.stringify(formattedProfile));
        }
      } catch (err) {
        console.error("Error fetching user profile after login:", err);
      }

      setMessage("Login successful!");

      // Redirect user based on role
      setTimeout(() => {
        if (response.role === "instructor") {
          router.push("/TutorDashboard/Courses"); // Redirect to instructor dashboard
        } else {
          router.push("/CourseListing"); // Redirect to student course listing
        }
      }, 1500);
    } else {
      setMessage("Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#00000099] flex items-center justify-center z-50 px-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl flex overflow-hidden">
        <div className="w-full p-6 relative">
          <button className="absolute top-4 right-4 text-2xl cusor-pointer text-gray-600" onClick={onClose}>
            <FiX />
          </button>

          <h2 className="text-lg font-semibold pt-8 text-center">
            Welcome back to <span className="text-[#88D613]">Archware</span>{" "}
            <span className="text-[#1B09A2]">Institute</span>
          </h2>

          <p className="text-center text-sm ">
            Continue your learning journey and unlock new opportunities with us.
          </p>

          {message && (
            <p className={`text-center mt-4 ${message.includes("successful") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <form className="space-y-2 mt-6  text-sm" onSubmit={handleLogin}>
            <p>Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email here"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white mb-5 text-xs "
              required
            />

            <p>Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-xs"
              required
            />

            <div className="text-right">
              <a href="#" className="text-sm text-[#88D613]">Forgot your password?</a>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#1B09A2] text-white cusor-pointer p-3 rounded-lg"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* <button className="w-full flex items-center justify-center border p-3 rounded-lg mb-2">
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center border p-3 rounded-lg">
            Continue with Facebook
          </button> */}

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <button className="text-blue-600 cusor-pointer" onClick={onSwitchToSignup}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

