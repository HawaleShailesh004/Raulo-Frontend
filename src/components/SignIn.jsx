import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../api/apiService";

function SignIn({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await apiService.auth.login({ email, password });

      // Save access token and auth flag
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);

      navigate("/admin"); // redirect to admin panel
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Invalid credentials or server error";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-sm border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-5 text-gray-800 text-center">
          Admin Sign In
        </h2>

        {/* Email */}
        <div className="mb-2">
          <label className="block text-gray-700 font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block text-gray-700 font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition mb-4"
          style={{ borderRadius: "0.25rem" }}
        >
          Sign In
        </button>

        {/* Optional Footer */}
        <p className="text-gray-500 text-xs mt-6 text-center">
          &copy; 2025 Raulo Enterprises. All rights reserved.
        </p>
      </form>
    </div>
  );
}

export default SignIn;
