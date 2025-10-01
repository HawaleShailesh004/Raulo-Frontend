// Services.jsx
import React, { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import Navbar from "./Navbar";
import bg from "../assets/services-bg.png";

import apiService from "../api/apiService";

// const servicesData = [
//   {
//     title: "Social Media Marketing",
//     img: "https://cdn3d.iconscout.com/3d/premium/thumb/social-media-marketing-7064954-5760913.png",
//     desc: "Boost your online presence with strategic social media campaigns tailored to your audience.",
//   },
//   {
//     title: "Search Engine Optimization (SEO)",
//     img: "https://cdn3d.iconscout.com/3d/premium/thumb/seo-optimization-4311237-3580913.png",
//     desc: "Improve your website ranking and visibility with effective SEO strategies.",
//   },
//   {
//     title: "Content Marketing",
//     img: "https://cdn3d.iconscout.com/3d/premium/thumb/content-marketing-4311235-3580912.png",
//     desc: "Engage and retain customers with impactful blogs, posts, and creative content.",
//   },
//   {
//     title: "Web Development",
//     img: "https://cdn3d.iconscout.com/3d/premium/thumb/web-development-6814412-5585225.png",
//     desc: "Modern, responsive, and user-friendly websites built for performance and scalability.",
//   },
//   {
//     title: "Graphic Design",
//     img: "https://cdn3d.iconscout.com/3d/premium/thumb/graphic-designer-6814414-5585227.png",
//     desc: "Creative and professional graphic design to build a unique brand identity.",
//   },
// ];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

const Services = () => {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    apiService.services
      .getAll()
      .then((response) => {
        setServiceData(response.data);
        setLoading(false);
        console.log("Services fetched successfully:", response.data);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = "Raulo Enterprises | Services";
  }, []);

  const [[current, direction], setCurrent] = useState([0, 0]);

  const nextSlide = () => {
    setCurrent(([prev]) => [(prev + 1) % serviceData.length, 1]);
  };

  const prevSlide = () => {
    setCurrent(([prev]) => [
      prev === 0 ? serviceData.length - 1 : prev - 1,
      -1,
    ]);
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={bg}
          alt="background"
          className="w-full h-full object-cover transform origin-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Services Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 pt-32 pb-16 w-full max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500"
        >
          Our Services
        </motion.h2>

        {/* Loading/Error/Empty states */}
        {loading && (
          <div className="flex justify-center items-center w-full h-72 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg mt-10">
            <div className="text-yellow-400 text-xl font-semibold animate-pulse">
              Loading services...
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center w-full h-72 bg-red-500/20 backdrop-blur-md rounded-3xl shadow-lg mt-10">
            <div className="text-red-500 text-xl font-semibold">{error}</div>
          </div>
        )}

        {!loading && !error && serviceData.length === 0 && (
          <div className="flex justify-center items-center w-full h-72 bg-gray-500/20 backdrop-blur-md rounded-3xl shadow-lg">
            <div className="text-gray-300 text-xl font-semibold">
              No services available.
            </div>
          </div>
        )}

        {/* Carousel */}
        {!loading && !error && serviceData.length > 0 && (
          <div className="relative w-full flex items-center justify-center mt-8">
            {/* Prev Button */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              className="absolute left-[-4rem] w-12 h-12 rounded-full flex items-center justify-center text-black z-20
                         bg-white/20 backdrop-blur-md border border-white/30 shadow-lg transition duration-300 hover:shadow-[0_0_15px_rgba(255,215,0,0.7)] hover:bg-white/30"
                         style={{borderRadius: "50%" }}
            >
              
              <ChevronLeft size={24} className="text-yellow-400" />
            </motion.button>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl w-full"
              >
                {/* Image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-white rounded-2xl md:rounded-3xl overflow-hidden p-0 md:p-0 shadow-lg flex justify-center items-center w-72 h-60 sm:w-80 sm:h-64 md:w-96 md:h-72"
                >
                  <img
                    src={serviceData[current]?.images[0]}
                    alt={serviceData[current]?.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Content */}
                <div className="max-w-md text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3">
                    {serviceData[current]?.title}
                  </h3>
                  <p className="text-gray-300 mb-6 text-sm sm:text-base md:text-lg">
                    {serviceData[current]?.shortDesc}
                  </p>

                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href="#"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-black px-5 py-2 sm:px-6 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-yellow-500/50 transition text-sm sm:text-base md:text-lg no-underline decoration-none hover:decoration-none"
                 
                  >
                    View More <ArrowRight size={18} />
                  </motion.a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              className="absolute right-[-4rem] rounded-full flex items-center justify-center text-black z-20
             bg-white/20 backdrop-blur-md border border-white/30 shadow-lg transition duration-300 hover:shadow-[0_0_15px_rgba(255,215,0,0.7)] hover:bg-white/30"
              style={{ width: "3rem", height: "3rem", borderRadius: "50%" }}
            >
              <ChevronRight size={24} className="text-yellow-400" />
            </motion.button>
          </div>
        )}

        {/* Slider Dots */}
        {!loading && !error && serviceData.length > 0 && (
          <div className="flex gap-3 mt-8 rounded-full">
            {serviceData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent([index, index > current ? 1 : -1])}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                  current === index ? "bg-yellow-400 scale-125" : "bg-gray-400"
                }`}
                style={{ borderRadius: "50%" }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Services;
