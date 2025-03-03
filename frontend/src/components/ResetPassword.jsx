import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    return password.length >= 8 && /\d/.test(password) && /[!@#$%^&*]/.test(password);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("⚠️ Password must be at least 8 characters long, contain a number, and a special character.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        email,
        newPassword,
      });

      if (response.data.success) {
        setSuccess("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000); // Auto redirect
      } else {
        setError(response.data.message || "⚠️ Error resetting password. Try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "⚠️ Error resetting password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Reset Password</h2>
        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-2 text-center">{success}</p>}

        <form onSubmit={handleReset} className="flex flex-col space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`p-3 rounded text-white font-bold transition duration-300 ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-gray-600 hover:text-blue-600 text-center block"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
