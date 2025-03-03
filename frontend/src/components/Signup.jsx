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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate Form Fields
  const validateFields = () => {
    const { name, age, gender, email, phone, password, confirmPassword } = formData;
    let formErrors = {};
    if (!name) formErrors.name = "Name is required.";
    if (!age) formErrors.age = "Age is required.";
    if (!gender) formErrors.gender = "Gender is required.";
    if (!email) formErrors.email = "Email is required.";
    if (!phone) formErrors.phone = "Phone number is required.";
    if (!password) formErrors.password = "Password is required.";
    if (!confirmPassword) formErrors.confirmPassword = "Please confirm your password.";
    if (password && confirmPassword && password !== confirmPassword) formErrors.passwordMatch = "Passwords do not match.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
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
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            name="name"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Age"
            name="age"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>

        <div className="mb-4">
          <select
            name="gender"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Phone Number"
            name="phone"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        {/* OTP Section */}
        {otpSent && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
              value={formData.otp}
              onChange={handleChange}
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
          </div>
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
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              {errors.passwordMatch && <p className="text-red-500 text-sm">{errors.passwordMatch}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300"
            >
              Sign Up
            </button>
          </>
        )}
      </form>
      <div className="mt-4">
        <p className="text-gray-700 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:text-indigo-700">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
