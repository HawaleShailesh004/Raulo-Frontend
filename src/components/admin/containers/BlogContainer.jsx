import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiService from "../../../api/apiService";
import BlogModal from "../modals/BlogModal";
import Loader from "../Loader";

const BlogContainer = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBlog(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    setLoading(true);
    try {
      await apiService.blog.delete(id);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.blog.getAll();
      setBlogs(response.data);
    } catch (err) {
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchBlogs();
  }, []);

  return (
    <section className="mb-8 w-[90%] mx-auto pb-4 border-b relative">
      {/* Loader */}
      {loading && <Loader message="Loading blogs..." />}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Blogs</h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={handleAdd}
          >
            Add Blog
          </button>
         
        </div>
      </div>

      {/* Status */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="w-full h-36 overflow-hidden rounded-t-xl">
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {blog.excerpt}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-xs">
                  By {blog.author?.name || "Unknown"}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-xs transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BlogModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        blog={selectedBlog}
        onSuccess={fetchBlogs}
      />
    </section>
  );
};

export default BlogContainer;
