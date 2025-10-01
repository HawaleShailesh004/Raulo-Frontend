import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo-container">
        <Link to="/" className="navbar-brand" onClick={() => setIsOpen(false)}>
          <img
            src={logo}
            alt="Raulo Enterprises Logo"
            className="navbar-logo"
          />
          <span className="navbar-title">Raulo Enterprises</span>
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button className="navbar-toggle-button" onClick={toggleNavbar}>
        <svg
          className="navbar-hamburger-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Navbar Links */}
      <div className={`navbar-links-container ${isOpen ? "open" : ""}`}>
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className="navbar-link" onClick={() => setIsOpen(false)}>
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="navbar-link" onClick={() => setIsOpen(false)}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className="navbar-link" onClick={() => setIsOpen(false)}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink to="/testimonials" className="navbar-link" onClick={() => setIsOpen(false)}>
              Testimonials
            </NavLink>
          </li>
        </ul>
      </div>

      {/* CTA Get Started → SignIn */}
      <div className="navbar-cta-container">
        <Link to="/contact" className="navbar-cta-button" onClick={() => setIsOpen(false)}>
          Contact Us <span className="arrow-icon">&rarr;</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
