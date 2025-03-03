import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../logo.png";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure email is retrieved correctly
  const storedEmail = localStorage.getItem("email");
  const email = location.state?.email || storedEmail || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if no email is found
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const resetPassword = async () => {
    setErrors({}); // Reset errors on each attempt
    let formErrors = {};

    if (!newPassword || !confirmPassword) {
      formErrors.password = "Both password fields are required.";
    } else if (newPassword !== confirmPassword) {
      formErrors.password = "Passwords do not match.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop form submission if there are errors
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        email, 
        newPassword,
      });

      if (response.data.success) {
        alert("✅ Password reset successfully! Please log in.");
        localStorage.removeItem("email"); // Remove email after reset
        navigate("/login");
      } else {
        setErrors({ server: response.data.message || "Error resetting password." });
      }
    } catch (error) {
      setErrors({ server: error.response?.data?.message || "Error resetting password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF7F4] p-6">
      <img src={logo} alt="Logo" className="w-[650px] h-auto mb-6" />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Reset Password</h2>
      <p className="mb-4 text-gray-600">
        Enter your new password for <span className="font-semibold">{email}</span>.
      </p>

      <div className="w-64 mb-4">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B]"
          placeholder="New Password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div className="w-64 mb-4">
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B]"
          placeholder="Confirm New Password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <button
        onClick={resetPassword}
        className={`w-64 bg-[#D81B60] text-white font-bold py-3 rounded-lg hover:bg-[#880E4F] transition-all duration-300 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>

      {errors.server && <p className="text-red-500 text-sm mt-4">{errors.server}</p>}

      <button onClick={() => navigate("/login")} className="mt-4 text-gray-700 hover:text-[#D81B60] underline">
        Back to Login
      </button>
    </div>
  );
};

export default ResetPassword;