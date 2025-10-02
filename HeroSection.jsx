import React from "react";
import { motion } from "framer-motion";
import HeroBg from "../assets/hero-bg.png";
import HandLeft from "../assets/hand-left.png";
import HandRight from "../assets/hand-right.png";
import Navbar from "./Navbar";
import { NavLink } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

const gradientAnimation = `
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-up { animation: fade-up 1s ease forwards; }
  .fade-up-delay-1 { animation: fade-up 1s ease forwards 0.3s; }
  .fade-up-delay-2 { animation: fade-up 1s ease forwards 0.6s; }

  .btn-animate {
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .btn-animate:hover {
    transform: scale(1.08);
    box-shadow: 0px 10px 25px rgba(255, 191, 36, 0.5);
    background-color: #ffd633;
    color: #000000;
  }
`;

const HeroSection = () => {
  return (
    <section className="relative h-screen w-screen overflow-hidden text-white flex flex-col">
      <style>{gradientAnimation}</style>

      {/* Navbar */}
      <Navbar className="w-[100%] absolute top-0" />

      {/* Background */}
      <div
        className="absolute inset-0 z-0 w-full h-full"
        style={{
          backgroundImage: `url(${HeroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "rotate(180deg)",
        }}
      >
        <div
          className="absolute inset-0 bg-[length:200%_200%] bg-gradient-to-br from-[#1b0934] via-[#10031d] to-[#04000f] opacity-80"
          style={{ animation: "gradient-shift 10s ease-in-out infinite" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-4 flex-1">
        <div className="max-w-5xl mt-20">
          <h1 className="fade-up text-[4rem] sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight">
            DIGITAL SOLUTION
          </h1>

          <h2 className="fade-up-delay-1 mt-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            That Drive{" "}
            <span
              className="text-[#FBBF24] hover:underline"
              style={{ fontSize: "2.9rem" }}
            >
              Success
            </span>
          </h2>
          <p className="fade-up-delay-2 mt-8 text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-300 max-w-3xl mx-auto">
            We Transform Your Ideas Into{" "}
            <span className="font-semibold text-white">
              Powerful Digital Realities
            </span>
          </p>
        </div>

        {/* Two Hands */}
        <div className="relative w-full flex justify-center items-center mt-2 mb-8 overflow-x-hidden">
          <motion.img
            src={HandLeft}
            alt="Left Hand"
            className="w-[40%] sm:w-[35%] md:w-[30%] lg:w-[28%] h-auto"
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 20,
              duration: 1,
            }}
          />
          <motion.img
            src={HandRight}
            alt="Right Hand"
            className="w-[40%] sm:w-[35%] md:w-[30%] lg:w-[28%] h-auto"
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 20,
              duration: 1,
              delay: 0.2,
            }}
          />
        </div>

        {/* Button */}
        <div className="mt-[-1rem]">
          <NavLink
            to="/services"
            className="btn-animate flex items-center gap-2 px-8 py-4 font-bold text-lg sm:text-xl text-black bg-[#FBBF24] rounded-full shadow-lg"
          >
            Explore Our Services <span className="ml-2">→</span>
          </NavLink>
        </div>
      </div>

      {/* Social Icons - Right Side */}
      <div className="fixed right-4 top-1/3 flex flex-col gap-5 z-20">
        <motion.a
          href="https://www.instagram.com/raulo_enterprises?igsh=aDhlajJ1cm4wd2g1"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="group relative text-3xl text-gray-300 transition-transform duration-300"
        >
          <FaInstagram className="group-hover:text-pink-500 group-hover:scale-125 group-hover:rotate-6 drop-shadow-[0_0_10px_rgba(255,20,147,0.7)] transition-all duration-300" />
        </motion.a>

        <motion.a
          href="https://www.linkedin.com/company/raulo-enterprises/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="group relative text-3xl text-gray-300 transition-transform duration-300"
        >
          <FaLinkedin className="group-hover:text-blue-500 group-hover:scale-125 group-hover:-rotate-6 drop-shadow-[0_0_10px_rgba(0,119,181,0.7)] transition-all duration-300" />
        </motion.a>

        <motion.a
          href="https://www.facebook.com/share/1aDy1fzuEh/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="group relative text-3xl text-gray-300 transition-transform duration-300"
        >
          <FaFacebook className="group-hover:text-blue-600 group-hover:scale-125 group-hover:rotate-12 drop-shadow-[0_0_10px_rgba(59,89,152,0.7)] transition-all duration-300" />
        </motion.a>
      </div>

      {/* Copyright - Always visible at bottom */}
      <footer className="absolute bottom-1 left-0 right-0 z-10 text-gray-400 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Your Company. All Rights Reserved.
        </p>
      </footer>
    </section>
  );
};

export default HeroSection;
