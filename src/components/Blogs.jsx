import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import bg from "../assets/services-bg.png";
import apiService from "../api/apiService";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Raulo Enterprises | Blog";
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    apiService.blog
      .getAll()
      .then((response) => {
        console.log("Fetched blogs:", response.data);
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
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

      {/* Navbar */}
      <Navbar />

      {/* Blog Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 pt-32 pb-20 ">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500"
        >
          Our Blog
        </motion.h2>

        {/* Loading/Error/Empty states */}
        {loading && (
          <div className="flex justify-center items-center w-[70%] h-72 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg mt-10">
            <div className="text-yellow-400 text-xl font-semibold animate-pulse">
              Loading blogs...
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center w-[70%] h-72 bg-red-500/20 backdrop-blur-md rounded-3xl shadow-lg mt-10">
            <div className="text-red-500 text-xl font-semibold">{error}</div>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="flex justify-center items-center w-[70%] h-72 bg-gray-500/20 backdrop-blur-md rounded-3xl shadow-lg mt-10">
            <div className="text-gray-300 text-xl font-semibold">
              No blogs available.
            </div>
          </div>
        )}

        {/* Blog Cards */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mt-5">
            {blogs.map((blog) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl flex flex-col overflow-hidden text-center"
              >
                {/* Top Image */}
                <div
                  className="w-full h-40 md:h-40 lg:h-50 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${blog.thumbnailUrl})`,
                    loading: "lazy",
                  }}
                ></div>

                {/* Content */}
                <div className="flex flex-col items-center p-6">
                  <h3 className="text-xl font-bold mb-3">{blog.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base leading-5">
                    {blog.excerpt}
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-black px-5 py-2 sm:px-6 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-yellow-500/50 transition text-sm sm:text-base mt-10"
                  >
                    Read More
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
