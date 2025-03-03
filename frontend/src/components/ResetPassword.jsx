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

  // Log retrieved email
  console.log("Retrieved Email:", email);

  // Redirect if no email is found
  useEffect(() => {
    if (!email) {
      console.warn("⚠️ Email is missing. Redirecting to login.");
      alert("⚠️ Email is missing. Redirecting to login.");
      navigate("/login");
    }
  }, [email, navigate]);

  const resetPassword = async () => {
    console.log("New Password:", newPassword);
    console.log("Confirm Password:", confirmPassword);

    if (!newPassword || !confirmPassword) {
      console.warn("⚠️ Missing password fields.");
      alert("⚠️ Please enter both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      console.warn("⚠️ Passwords do not match.");
      alert("⚠️ Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending request to reset password with email:", email);

      const response = await axios.post("http://localhost:5000/reset-password", {
        email,  // Ensure email is included
        newPassword: newPassword,
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        alert("✅ Password reset successfully! Please log in.");
        localStorage.removeItem("email"); // Remove email after reset
        navigate("/login");
      } else {
        console.error("⚠️ Error resetting password. Server response:", response.data);
        alert("⚠️ Error resetting password.");
      }
    } catch (error) {
      console.error("⚠️ API Error:", error.response?.data || error.message);
      alert(`⚠️ Error: ${error.response?.data?.message || "Reset failed"}`);
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

      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-64 p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] mb-2"
        placeholder="New Password"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-64 p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] mb-4"
        placeholder="Confirm New Password"
      />

      <button
        onClick={resetPassword}
        className={`w-64 bg-[#D81B60] text-white font-bold py-3 rounded-lg hover:bg-[#880E4F] transition-all duration-300 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>

      <button onClick={() => navigate("/login")} className="mt-4 text-gray-700 hover:text-[#D81B60] underline">
        Back to Login
      </button>
    </div>
  );
};

export default ResetPassword;
