import React from "react";
import { Navigate } from "react-router-dom";

import InquiriesContainer from "./containers/InquiriesContainer";
import BlogContainer from "./containers/BlogContainer";
import ServiceContainer from "./containers/ServiceContainer";
import TestimonialContainer from "./containers/TestimonialContainer";

const AdminPanel = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-sans">
      <header className="flex items-center justify-between pb-5 border-b border-gray-200 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Admin Dashboard
        </h1>
        <button
          className="bg-red-500 text-white px-4 py-2  shadow-sm hover:bg-red-600 transition font-semibold text-sm rounded-2xl"
          style={{borderRadius: "0.5rem" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main>
        <InquiriesContainer />
        <BlogContainer />
        <ServiceContainer />
        <TestimonialContainer />
      </main>
    </div>
  );
};

export default AdminPanel;
