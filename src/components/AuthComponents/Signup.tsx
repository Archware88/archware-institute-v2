"use client";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { createUser, registerInstructor } from "@/api/auth"; // Import both APIs
import { usePathname } from "next/navigation";


const SignupModal = ({ onClose, onSwitchToLogin, onSignupSuccess }: {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSignupSuccess: (email: string) => void;
}) => {
  // Form State
  const pathname = usePathname();
  const isTutorPage = pathname.includes("/Tutor/Home");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: isTutorPage ? "instructor" : "student",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Convert form data to URL-encoded format
    const formPayload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      role: formData.role
    };

    setLoading(true);

    try {
      const response = formData.role === "student"
        ? await createUser(formPayload)
        : await registerInstructor(formPayload);

      if (response?.status) {
        // Success case
        localStorage.setItem("authToken", response.token ?? "");
        onSignupSuccess(formData.email);
      } else {
        // Handle validation errors
        if (response?.errors?.email) {
          setErrorMessage(response.errors.email[0]);
        } else {
          setErrorMessage(response?.message || "Signup failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000099] bg-opacity-50 flex items-center justify-center z-50 px-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl flex overflow-hidden">
        <div className="w-full p-6 relative">
          {/* Close Button */}
          <button className="absolute top-4 right-4 cusor-pointer text-2xl text-gray-600" onClick={onClose}>
            <FiX />
          </button>

          <h2 className="text-lg font-semibold pt-8 text-center">
            Welcome back to <span className="text-[#88D613]">Archware</span>{" "}
            <span className="text-[#1B09A2]">Institute</span>
          </h2>

          <p className="text-center text-sm ">
            Continue your learning journey and unlock new opportunities with us.
          </p>

          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}


          <form className="space-y-2 mt-10 text-sm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p>First Name</p>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 text-xs"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <p>Last Name</p>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 text-xs"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <p>Email Address</p>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 text-xs"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <p>Phone Number</p>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 text-xs"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <p>Password</p>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 text-xs"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <p>Confirm Password</p>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400 text-xs"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
          </div>

           
            {/* Terms & Conditions */}
            <div className="flex items-center space-x-2 pt-4">
              <input type="checkbox" className="w-4 h-4 cusor-pointer" required />
              <span className="text-sm text-gray-600">
                By ticking this box, you agree to our{" "}
                <a href="/TermsAndConditions" className="text-[#88D613]">Terms and Conditions</a> and{" "}
                <a href="/Privacy" className="text-[#88D613]">Privacy Policy</a>.
              </span>
            </div>

            <div className="pt-6 cusor-pointer">
              <button
                type="submit"
                className="w-full bg-[#1B09A2] text-white p-3 cusor-pointer rounded-lg"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>

          {/* Toggle to Sign In */}
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <button className="text-blue-600 cusor-pointer" onClick={onSwitchToLogin}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
