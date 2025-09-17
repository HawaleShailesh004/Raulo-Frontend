import React from "react";
import HeroBg from "../assets/hero-bg.png";
import Hand from "../assets/hand.png";
import Navbar from "./Navbar";

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

  @keyframes fade-scale {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }

  .fade-up { animation: fade-up 1s ease forwards; }
  .fade-up-delay-1 { animation: fade-up 1s ease forwards 0.3s; }
  .fade-up-delay-2 { animation: fade-up 1s ease forwards 0.6s; }
  .fade-scale { animation: fade-scale 1s ease forwards 1s; }

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
    <section className="relative min-h-screen overflow-hidden text-white flex flex-col justify-center items-center">
      <style>{gradientAnimation}</style>

      {/* Navbar inside Hero */}
      <Navbar className="w-[100%]" />

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
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-4 py-16">
        <div className="max-w-5xl">
          <h1 className="fade-up text-5xl sm:text-6xl md:text-8xl font-extrabold leading-tight tracking-tight">
            DIGITAL SOLUTION
          </h1>
          <h2 className="fade-up-delay-1 mt-6 text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            That Drive <span className="text-[#FBBF24]">Success</span>
          </h2>
          <p className="fade-up-delay-2 mt-8 text-lg sm:text-2xl font-light text-gray-300 max-w-3xl mx-auto">
            We Transform Your Ideas Into{" "}
            <span className="font-semibold text-white">
              Powerful Digital Realities
            </span>
          </p>
        </div>

        {/* Hand Image */}
        <img
          src={Hand}
          alt="Two hands reaching with digital wireframes"
          className="fade-scale w-[90%] max-w-4xl h-auto mt-[-19rem] mb-12"
        />

        {/* Button */}
        <div className="mt-6 flex flex-col sm:flex-row gap-6 items-center">
          <a
            href="#services"
            className="btn-animate flex items-center gap-2 px-8 py-4 mt-[-18rem] font-bold text-xl text-black bg-[#FBBF24] rounded-full shadow-lg"
          >
            Explore Our Services
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
