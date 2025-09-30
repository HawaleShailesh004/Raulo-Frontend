import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import bg from "../assets/services-bg.png";
import apiService from "../api/apiService";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    document.title = "Raulo Enterprises | Blog";
  }, []);

  useEffect(() => {
    apiService.blog
      .getAll()
      .then((response) => {
        // response.data should be the array of blog objects
        setBlogs(response.data);
      })
      .catch((error) => console.error("Error fetching blogs:", error));
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
          style={{ fontSize: "4rem" }}
        >
          Our Blog
        </motion.h2>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mt-5">
          {!blogs.length && (
            <div className="text-white text-center mt-32">Loading Blogs...</div>
          )}
        
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
              {/* Top Image: 40% of card height, rounded top corners */}
              <div
                className="w-full h-40 md:h-40 lg:h-50 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${blog.thumbnailUrl})`,
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
      </section>
    </div>
  );
};

export default Blog;
