import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import apiService from "../../../api/apiService";
import TurndownService from "turndown";
import Loader from "../Loader";

const turndownService = new TurndownService();

const BlogModal = ({ isOpen, onClose, blog, onSuccess }) => {
  const isEdit = Boolean(blog);

  const [title, setTitle] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false); // loader state

  // Prefill when editing
  useEffect(() => {
    if (isEdit) {
      setTitle(blog.title || "");
      setTags(blog.tags || []);
      setContent(blog.content || "");
      setThumbnailPreview(blog.thumbnailUrl || "");
    } else {
      setTitle("");
      setTags([]);
      setTagInput("");
      setContent("");
      setThumbnailFile(null);
      setThumbnailPreview("");
    }
  }, [blog, isEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file)); // show preview
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // show loader

    try {
      const markdownContent = turndownService.turndown(content);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", title.toLowerCase().replace(/\s+/g, "-"));
      formData.append("content", markdownContent);
      formData.append("tags", JSON.stringify(tags));
      formData.append("status", "published");
      formData.append("category", blog?.category?._id || "68da8362d279079b53a05b66");

      if (thumbnailFile) formData.append("file", thumbnailFile);

      if (isEdit) {
        await apiService.blog.update(blog._id, formData, true);
        toast.success("Blog updated successfully!");
      } else {
        await apiService.blog.create(formData, true);
        toast.success("Blog created successfully!");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // hide loader
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-[95%] h-[90%] max-w-7xl p-6 relative overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? "Edit Blog" : "Create Blog"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Tags + File */}
              <div className="flex gap-6 items-start">
                {/* File Upload */}
                <div className="w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer"/>
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="mt-2 h-24 w-full object-cover rounded-md border"
                    />
                  )}
                </div>

                {/* Tags */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border rounded-lg px-3 py-2"
                      placeholder="Enter tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      style={{ borderRadius: "5%" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  className="bg-white"
                  style={{ height: "200px" }}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 absolute bottom-10 right-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  style={{ borderRadius: "5%" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ borderRadius: "5%" }}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  {isEdit ? "Update Blog" : "Create Blog"}
                </button>
              </div>
            </form>

            {/* Loader */}
            {loading && <Loader message={isEdit ? "Updating..." : "Creating..."} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogModal;
