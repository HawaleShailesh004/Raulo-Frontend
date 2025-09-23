import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import AboutUs from "./components/About";
import Blog from "./components/Blogs";
import Testimonial from "./components/Testimonial";
import Contact from "./components/Contact";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignnUp";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Toast messages */}
        <Toaster position="bottom-right" reverseOrder={false} />

        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/testimonials" element={<Testimonial />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Get Started route → redirect to SignIn */}
          <Route path="/get-started" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
