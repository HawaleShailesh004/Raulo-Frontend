// Testimonial.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "./Navbar";
import bg from "../assets/services-bg.png";
import { useEffect } from "react";
import apiService from "../api/apiService";

// const testimonials = [
//   {
//     name: "Riya Sharma",
//     role: "Founder, StartupX",
//     img: "https://randomuser.me/api/portraits/women/44.jpg",
//     feedback:
//       "This team completely transformed our online presence. Their digital marketing strategy helped us grow our audience and generate leads faster than ever.",
//   },
//   {
//     name: "Arjun Mehta",
//     role: "CEO, TechSolutions",
//     img: "https://randomuser.me/api/portraits/men/46.jpg",
//     feedback:
//       "The SEO and content marketing services were beyond expectations. We now rank on the first page of Google for multiple keywords.",
//   },
//   {
//     name: "Priya Kapoor",
//     role: "Marketing Head, BrandBoost",
//     img: "https://randomuser.me/api/portraits/women/68.jpg",
//     feedback:
//       "Amazing creativity and execution! Their team is highly professional and always delivers results on time. Highly recommended.",
//   },
// ];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 10,
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
  }),
};

const Testimonial = () => {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nextSlide = () => {
    setCurrent(([prev]) => [(prev + 1) % testimonials.length, 1]);
  };

  const prevSlide = () => {
    setCurrent(([prev]) => [
      prev === 0 ? testimonials.length - 1 : prev - 1,
      -1,
    ]);
  };

  useEffect(() => {
    document.title = "Raulo Enterprises | Testimonials";
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    apiService.testimonials
      .getAll()
      .then((response) => {
        console.log("Testimonials fetched successfully:", response.data);
        setTestimonials(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Testimonials:", err);
        setError("Failed to load Testimonials. Please try again later.");
        setLoading(false);
      });
  }, []);

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

      {/* Testimonial Section */}

      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 pt-32 pb-20">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500"
          style={{ fontSize: "4rem" }}
        >
          Testimonials
        </motion.h2>

        {/* Loading/Error/Empty states */}
        {loading && (
          <div className="flex justify-center items-center w-[70%] h-72 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg mt-10">
            <div className="text-yellow-400 text-xl font-semibold animate-pulse">
              Loading Testimonials...
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center w-[70%] h-72 bg-red-500/20 backdrop-blur-md rounded-3xl shadow-lg mt-10">
            <div className="text-red-500 text-xl font-semibold">{error}</div>
          </div>
        )}

        {!loading && !error && testimonials.length === 0 && (
          <div className="flex justify-center items-center w-[70%] h-72 bg-gray-500/20 backdrop-blur-md rounded-3xl shadow-lg mt-10">
            <div className="text-gray-300 text-xl font-semibold">
              No Testimonials available.
            </div>
          </div>
        )}

        {/* Carousel */}
        {!loading && !error && testimonials.length > 0 && (
          <>
            <div className="relative w-full max-w-6xl flex items-center justify-center overflow-hidden">
              {/* Prev Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="absolute left-4 md:left-10 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg hover:shadow-yellow-500/50 transition z-20"
                style={{ borderRadius: "50%" }}
              >
                <ChevronLeft size={24} className="text-yellow-400" />
              </motion.button>

              {/* Slide */}
              <div className="relative flex w-full justify-center items-center">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 text-center flex flex-col items-center w-[85%] md:w-[60%]"
                  >
                    <motion.img
                      src={testimonials[current].avatarUrl}
                      alt={testimonials[current].clientName}
                      className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-lg mb-4"
                      whileHover={{ scale: 1.1 }}
                      loading="lazy"
                    />
                    <h3 className="text-lg sm:text-xl font-bold">
                      {testimonials[current].clientName}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {testimonials[current].title} of{" "}
                      {testimonials[current].company}
                    </p>
                    <p className="text-gray-200 text-sm sm:text-base italic leading-relaxed">
                      "{testimonials[current].message}"
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="absolute right-4 md:right-10 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg hover:shadow-yellow-500/50 transition z-20"
                style={{ borderRadius: "50%" }}
              >
                <ChevronRight size={24} className="text-yellow-400" />
              </motion.button>
            </div>

            {/* Dots */}
            <div className="flex gap-3 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent([index, index > current ? 1 : -1])}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    current === index
                      ? "bg-yellow-400 scale-125"
                      : "bg-gray-400"
                  }`}
                  style={{ borderRadius: "50%" }}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Testimonial;
