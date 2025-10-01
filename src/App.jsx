import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import AboutUs from "./components/About";
import Blog from "./components/Blogs";
import Testimonial from "./components/Testimonial";
import Contact from "./components/Contact";
import SignIn from "./components/SignIn";
import AdminPanel from "./components/admin/AdminPanel";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("accessToken") !== null
  );

  // While checking auth, render nothing to prevent flicker
  if (isAuthenticated === null) return null;

  return (
    <Router>
      <div className="App">
        <Toaster position="bottom-right" reverseOrder={false} />

        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/testimonials" element={<Testimonial />} />
          <Route path="/contact" element={<Contact />} />

          {/* Sign In */}
          <Route
            path="/signin"
            element={
              isAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <SignIn setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

          {/* Protected Admin Panel */}
          <Route
            path="/admin"
            element={
              <AdminPanel
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
