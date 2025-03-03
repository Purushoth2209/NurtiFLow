import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [otpSent, setOtpSent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (e) => setOtp(e.target.value);

  const verifyOtp = async () => {
    if (otp.trim().length === 0) {
      alert("Please enter the OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/verify-otp", { email, otp });
      if (response.data.success) {
        alert("✅ OTP Verified! Redirecting...");
        navigate("/dashboard"); // Redirect after successful verification
      } else {
        alert("❌ Invalid OTP. Try again.");
      }
    } catch (error) {
      alert(`⚠️ Error: ${error.response?.data?.message || "Verification failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/send-otp", { email });
      if (response.data.success) {
        setTimer(120); // Reset timer
        setOtpSent(true);
        alert("📩 OTP has been resent to your email!");
      } else {
        alert("⚠️ Error resending OTP.");
      }
    } catch (error) {
      alert(`⚠️ Error: ${error.response?.data?.message || "Resend failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF7F4]">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 font-sans">Verify OTP</h2>
      <p className="mb-4 text-gray-600">Enter the OTP sent to {email}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleOtpChange}
        className="w-full mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg"
      />
      <button 
        onClick={verifyOtp} 
        className={`btn-primary mb-4 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLoading || timer === 0}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>
      <p className="text-gray-600">
        Time remaining: <span className="font-bold">{timer}s</span>
      </p>
      {timer === 0 && (
        <button 
          onClick={resendOtp} 
          className={`text-blue-600 mt-2 hover:underline ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Resending..." : "Resend OTP"}
        </button>
      )}
    </div>
  );
};

export default VerifyOTP;
