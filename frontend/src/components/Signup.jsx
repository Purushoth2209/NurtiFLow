import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../logo.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate Form Fields
  const validateFields = () => {
    const { name, age, gender, email, phone, password, confirmPassword } = formData;
    if (!name || !age || !gender || !email || !phone || !password || !confirmPassword) {
      alert("All fields are required!");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return false;
    }
    return true;
  };

  // Send OTP
  const sendOtp = async () => {
    if (!formData.email) {
      alert("Please enter an email first!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/send-otp", { email: formData.email });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!formData.otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });

      if (response.data.success) {
        setOtpVerified(true);
        alert("OTP verified successfully!");
      } else {
        alert(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error verifying OTP");
    }
  };

// Handle Signup
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateFields()) return;

  if (!otpVerified) {
    alert("Please verify your OTP before signing up.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match. Please re-enter.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/register", {
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    alert("Signup successful! Redirecting to login...");
    navigate("/login");
  } catch (error) {
    alert(error.response?.data?.message || "Error signing up");
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF7F4]">
      <img src={logo} alt="NutriFlow Logo" className="w-[650px] h-auto mb-6" />
      <h2 className="text-2xl font-bold mb-4 text-gray-800 font-sans">Create Your Account</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md px-6">
        <input
          type="text"
          placeholder="Name"
          name="name"
          className="w-full mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Age"
          name="age"
          className="w-full mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg"
          value={formData.age}
          onChange={handleChange}
        />
        <select
          name="gender"
          className="w-full mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          name="email"
          className="w-full mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Phone Number"
          name="phone"
          className="w-full mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg"
          value={formData.phone}
          onChange={handleChange}
        />

        {/* OTP Section */}
        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            name="otp"
            className="w-full mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg"
            value={formData.otp}
            onChange={handleChange}
          />
        )}

        {!otpSent ? (
          <button
            type="button"
            onClick={sendOtp}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Send OTP
          </button>
        ) : !otpVerified ? (
          <button
            type="button"
            onClick={verifyOtp}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Verify OTP
          </button>
        ) : (
          <>
            <p className="text-green-500 text-center mb-4">OTP Verified ✅</p>

            {/* Password Inputs */}
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>

            <div className="relative w-full mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D81B60] text-white font-bold py-3 rounded-lg hover:bg-[#880E4F] transition-all duration-300"
            >
              Sign Up
            </button>
          </>
        )}

        <div className="text-center mt-2">
          <Link to="/" className="text-gray-600 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
