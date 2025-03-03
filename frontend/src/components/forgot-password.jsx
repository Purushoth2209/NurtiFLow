import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const sendOtp = async () => {
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  setIsLoading(true);
  try {
    const response = await axios.post("http://localhost:5000/forgot-password", { email });

    console.log("API Response:", response.data); // Debugging

    if (response.data.success) {
      alert("📩 OTP has been sent to your email!");
      navigate("/verify-otp", { state: { email, purpose: "reset-password" } });
    } else {
      alert(`⚠️ Error: ${response.data.message || "Failed to send OTP"}`);
    }
  } catch (error) {
    console.error("API Error:", error);
    alert(`⚠️ Error: ${error.response?.data?.message || "Failed to send OTP"}`);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF7F4] p-6">
      <img src={logo} alt="Logo" className="w-[650px] h-auto mb-6" />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Forgot Password</h2>
      <p className="mb-4 text-gray-600">Enter your email to receive an OTP.</p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-64 p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B]"
        placeholder="Enter your email"
      />

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
