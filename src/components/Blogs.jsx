// Blog.jsx
import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import bg from "../assets/services-bg.png";

const blogData = [
  {
    title: "5 Digital Marketing Trends You Shouldn’t Miss",
    img: "https://cdn3d.iconscout.com/3d/premium/thumb/marketing-analytics-4311240-3580916.png",
    desc: "Stay ahead of the competition with the latest digital marketing trends that can redefine your business growth in 2025.",
  },
  {
    title: "The Power of SEO for Small Businesses",
    img: "https://cdn3d.iconscout.com/3d/premium/thumb/search-engine-optimization-4311243-3580919.png",
    desc: "Learn how SEO can help small businesses reach their target audience effectively and boost online visibility.",
  },
  {
    title: "Why Content Marketing is the Future",
    img: "https://cdn3d.iconscout.com/3d/premium/thumb/content-marketing-4311235-3580912.png",
    desc: "Engaging content not only builds trust but also drives conversions. Here’s why content will always remain king.",
  },
];

const Blog = () => {
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
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 pt-32 pb-20">
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
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
          {blogData.map((blog, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col items-center text-center"
            >
              <img
                src={blog.img}
                alt={blog.title}
                className="w-40 h-36 object-contain mb-6"
              />
              <h3 className="text-xl font-bold mb-3">{blog.title}</h3>
              <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
                {blog.desc}
              </p>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-black px-5 py-2 sm:px-6 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-yellow-500/50 transition text-sm sm:text-base"
              >
                Read More
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
