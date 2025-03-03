import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../logo.png"; // Import logo

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve email from location.state or localStorage
  const email = location.state?.email || localStorage.getItem("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    // Store email in localStorage to persist across refresh
    if (email) {
      localStorage.setItem("email", email);
    } else {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    if (value.length === 6) {
      // If all 6 digits are pasted into the first field, update all at once
      newOtp.splice(0, 6, ...value.split(""));
    } else {
      newOtp[index] = value;
    }

    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    setOtpError(""); // Clear error on input change
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setOtpError("Please enter the full 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/verify-otp", {
        email,
        otp: enteredOtp,
      });

      if (response.data.success) {
        localStorage.setItem("email", email);
        navigate("/reset-password", { state: { email } }); // Redirect to Reset Password
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError(`Error: ${error.response?.data?.message || "Verification failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setResendError(""); // Clear any previous resend error
    try {
      const response = await axios.post("http://localhost:5000/forgot-password", { email });
      if (response.data.success) {
        setTimer(120); // Reset timer
      } else {
        setResendError("Error resending OTP. Please try again.");
      }
    } catch (error) {
      setResendError(`Error: ${error.response?.data?.message || "Resend failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF7F4] p-6">
      <img src={logo} alt="Logo" className="w-[650px] h-auto mb-6" />
      <h2 className="text-2xl font-bold mb-4 text-gray-800 font-sans">Reset Your Password</h2>
      <p className="mb-4 text-gray-600">
        Enter the OTP sent to <span className="font-semibold">{email}</span>
      </p>

      {/* OTP Input Fields */}
      <div className="flex justify-center gap-2 mb-4">
        {otp.map((digit, index) => (
          <div key={index} className="relative">
            <input
              id={`otp-${index}`}
              type="text"
              value={digit}
              maxLength="1"
              onChange={(e) => handleChange(index, e.target.value)}
              onPaste={(e) => {
                const pasteValue = e.clipboardData.getData("Text");
                handleChange(index, pasteValue);
              }}
              className="w-12 h-12 text-xl text-center bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
            />
            {otpError && index === otp.length - 1 && (
              <p className="text-red-500 text-xs absolute -bottom-6 left-0">{otpError}</p>
            )}
          </div>
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={verifyOtp}
        className={`w-64 bg-[#D81B60] text-white font-bold py-3 rounded-lg hover:bg-[#880E4F] transition-all duration-300 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>

      {/* Timer & Resend */}
      <p className="text-gray-600 mt-4">
        Time remaining: <span className="font-bold">{timer}s</span>
      </p>
      {timer === 0 && (
        <button
          onClick={resendOtp}
          className={`mt-2 text-[#D81B60] hover:underline ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Resending..." : "Resend OTP"}
        </button>
      )}
      {resendError && <p className="text-red-500 text-xs mt-2">{resendError}</p>}

      {/* Back to Forgot Password */}
      <button
        onClick={() => navigate("/forgot-password")}
        className="mt-4 text-gray-700 hover:text-[#D81B60] underline"
      >
        Back to Forgot Password
      </button>
    </div>
  );
};

export default VerifyOTP;
