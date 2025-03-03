import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../logo.png"; // Import logo for branding consistency

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve userData from location.state or localStorage
  const email = location.state?.email || localStorage.getItem("email") || "";
  const purpose = location.state?.purpose || localStorage.getItem("purpose") || "signup";
  const [userData, setUserData] = useState(location.state?.userData || null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Received location state:", location.state);

    // Store data in localStorage to prevent loss on refresh
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("email", email);
      localStorage.setItem("purpose", purpose);
    } else {
      // If userData is missing and purpose is signup, redirect to signup page
      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData && purpose === "signup") {
        alert("⚠️ Missing user data. Please restart the signup process.");
        navigate("/signup");
      } else {
        setUserData(JSON.parse(storedUserData));
      }
    }
  }, [userData, purpose, navigate]);

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
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      let requestData = { email, otp: enteredOtp };

      if (purpose === "signup") {
        if (!userData) {
          alert("⚠️ Missing user data. Please restart the signup process.");
          setIsLoading(false);
          return;
        }
        requestData = {
          ...requestData,
          name: userData.name,
          age: userData.age,
          gender: userData.gender,
          phone: userData.phone,
          password: userData.password,
        };
      }

      const apiEndpoint =
        purpose === "signup"
          ? "http://localhost:5000/register"
          : "http://localhost:5000/verify-otp";

      const response = await axios.post(apiEndpoint, requestData);

      if (response.data.success) {
        alert("✅ OTP Verified! Account successfully created.");
        localStorage.removeItem("userData"); // Cleanup after successful verification

        if (purpose === "signup") {
          navigate("/login"); // Redirect to login after signup
        } else if (purpose === "reset-password") {
          navigate("/reset-password", { state: { email } }); // Redirect to reset password page
        }
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF7F4] p-6">
      <img src={logo} alt="NutriFlow Logo" className="w-[650px] h-auto mb-6" />
      <h2 className="text-2xl font-bold mb-4 text-gray-800 font-sans">
        {purpose === "signup" ? "Verify Your Email" : "Reset Your Password"}
      </h2>
      <p className="mb-4 text-gray-600">
        Enter the OTP sent to <span className="font-semibold">{email}</span>
      </p>

      {/* OTP Input Fields */}
      <div className="flex justify-center gap-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            value={digit}
            maxLength="1"
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-12 h-12 text-xl text-center bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
          />
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

      {/* Back to Login */}
      <button
        onClick={() => navigate("/login")}
        className="mt-4 text-gray-700 hover:text-[#D81B60] underline"
      >
        Back to Login
      </button>
    </div>
  );
};

export default VerifyOTP;
