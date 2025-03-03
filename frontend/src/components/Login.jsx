import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../logo.png"; // Ensure the correct path

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF7F4]">

      {/* Enlarged Logo */}
      <img src={logo} alt="NutriFlow Logo" className="w-[500px] md:w-[650px] h-auto mb-6" />

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="w-full max-w-md px-6">
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-[#D81B60] text-white font-bold py-3 rounded-lg hover:bg-[#880E4F] transition-all duration-300"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-gray-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="text-center mt-2">
          <Link to="/signup" className="text-gray-600 hover:underline">
            Don't have an account? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
