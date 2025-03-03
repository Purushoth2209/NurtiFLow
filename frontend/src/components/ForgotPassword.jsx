// src/components/ForgotPassword.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error: Unable to send reset link.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
        
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Send Reset Link
        </button>

        {message && <p className="mt-4 text-green-600">{message}</p>}

        <div className="text-center mt-4">
          <Link to="/" className="text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
