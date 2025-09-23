// AboutUs.jsx
import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import bg from "../assets/services-bg.png"; // same bg as services

const AboutUs = () => {
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

      {/* Navbar */}
      <Navbar />

      {/* About Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 pt-32 pb-16">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500"
          style={{ fontSize: "4rem" }}
        >
          About Us
        </motion.h2>

        {/* About Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl w-full max-w-5xl"
        >
          {/* Image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white rounded-2xl md:rounded-3xl p-2 md:p-4 shadow-lg flex justify-center"
          >
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/teamwork-6814411-5585224.png"
              alt="About Us"
              className="w-52 h-44 sm:w-60 sm:h-52 md:w-72 md:h-60 object-contain"
            />
          </motion.div>

          {/* Text */}
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3">
              Who We Are
            </h3>
            <p className="text-gray-300 mb-6 text-sm sm:text-base md:text-lg leading-relaxed">
              We are a passionate team of digital marketers, designers, and
              developers committed to helping businesses grow online. With
              innovative strategies, creativity, and technology, we deliver
              impactful solutions that drive measurable results.
            </p>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-black px-5 py-2 sm:px-6 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-yellow-500/50 transition text-sm sm:text-base md:text-lg"
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>

        {/* Mission & Vision Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-10 w-full max-w-5xl">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Our Mission</h3>
            <p className="text-gray-300 text-base leading-relaxed">
              To empower businesses with innovative digital marketing solutions
              that maximize growth, strengthen brand presence, and create lasting
              customer connections.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-4 text-pink-400">Our Vision</h3>
            <p className="text-gray-300 text-base leading-relaxed">
              To become a global leader in digital transformation, inspiring
              innovation and setting new benchmarks in creativity, strategy, and
              technology-driven marketing.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
