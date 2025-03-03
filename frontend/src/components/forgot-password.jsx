import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendOtp = async () => {
    setEmailError("");
    setServerError("");

    if (!email) {
      setEmailError("Please enter your email.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/forgot-password", { email });

      if (response.data.success) {
        alert("📩 OTP has been sent to your email!");
        navigate("/verify-otp", { state: { email, purpose: "reset-password" } });
      } else {
        handleServerError(response.data.message);
      }
    } catch (error) {
      handleServerError(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServerError = (message) => {
    switch (message) {
      case "Email not registered":
        setEmailError("This email is not registered with us.");
        break;
      case "Too many attempts":
        setServerError("Too many attempts. Please try again later.");
        break;
      case "Server error":
        setServerError("Something went wrong. Please try again.");
        break;
      default:
        setServerError(message || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF7F4] p-6">
      <img src={logo} alt="Logo" className="w-[650px] h-auto mb-6" />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Forgot Password</h2>
      <p className="mb-4 text-gray-600">Enter your email to receive an OTP.</p>

      <div className="w-64">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-[#C2185B] ${
            emailError ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your email"
        />
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
      </div>

      {serverError && <p className="text-red-500 text-sm mt-2">{serverError}</p>}

      <button
        onClick={sendOtp}
        className={`w-64 mt-4 bg-[#D81B60] text-white font-bold py-3 rounded-lg hover:bg-[#880E4F] transition-all duration-300 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </button>

      <button onClick={() => navigate("/login")} className="mt-4 text-gray-700 hover:text-[#D81B60] underline">
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;
