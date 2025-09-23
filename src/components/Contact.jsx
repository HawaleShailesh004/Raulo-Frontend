// Contact.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import bg from "../assets/services-bg.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Input change handle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // remove error on typing
  };

  // Validation function
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    return newErrors;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess("");
    } else {
      // ✅ Valid form - can send data to backend
      setSuccess("Message sent successfully ✅");
      setErrors({});
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={bg}
          alt="background"
          className="w-full h-full object-cover transform origin-center"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <Navbar />

      {/* Contact Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 pt-32 pb-20">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500"
          style={{ fontSize: "4rem" }}
        >
          Contact Us
        </motion.h2>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 sm:p-12 w-[90%] md:w-[60%] lg:w-[50%] flex flex-col gap-6"
        >
          {/* Name */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold mb-2 text-yellow-400">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold mb-2 text-yellow-400">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Message */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold mb-2 text-yellow-400">
              Message
            </label>
            <textarea
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
            />
            {errors.message && (
              <p className="text-red-400 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold rounded-xl shadow-lg hover:opacity-90 transition"
          >
            Send Message
          </motion.button>

          {/* Success Message */}
          {success && (
            <p className="text-green-400 font-semibold text-center mt-4">
              {success}
            </p>
          )}
        </motion.form>
      </section>
    </div>
  );
};

export default Contact;
