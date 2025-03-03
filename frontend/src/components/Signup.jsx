import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP
  const sendOtp = async () => {
    if (!formData.email) {
      alert("Please enter an email first!");
      return;
    }
    try {
      await axios.post("http://localhost:5000/send-otp", { email: formData.email });
      setOtpSent(true);
      alert("OTP sent to your email!");
    } catch (error) {
      alert("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
  if (!formData.otp) {
    alert("Please enter the OTP.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/verify-otp", {
      email: formData.email,
      otp: formData.otp, // Ensure this is sent as a string
    }, {
      headers: { "Content-Type": "application/json" }, // Ensure JSON request
    });

    console.log("Server Response:", response.data); // Debugging response

    if (response.data.success) { // Check the success field from backend response
      setOtpVerified(true);
      alert("OTP verified successfully!");
    } else {
      alert(response.data.message || "Invalid OTP. Please try again.");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Error verifying OTP");
  }
};

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:5000/send-otp", { email: formData.email });
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      alert("Error sending OTP");
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
          className="w-full mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          placeholder="Age"
          name="age"
          className="w-full mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Gender"
          name="gender"
          className="w-full mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
          value={formData.gender}
          onChange={handleChange}
          required
        />
        <div className="flex space-x-2">
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="w-full mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
        </div>

        <input
          type="text"
          placeholder="Phone Number"
          name="phone"
          className="w-full mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            className="w-full mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          name="confirmPassword"
          className="w-full mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-[#D81B60] text-white font-bold py-3 rounded-lg hover:bg-[#880E4F] transition-all duration-300"
        >
          Sign Up
        </button>
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
