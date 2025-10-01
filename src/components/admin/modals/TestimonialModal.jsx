import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Loader from "../Loader";

const TestimonialModal = ({ isOpen, onClose, testimonial, onSave }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    company: "",
    title: "",
    message: "",
    avatar: null, // file object
    avatarPreview: "", // local preview
  });

  const [loading, setLoading] = useState(false); // loader state

  useEffect(() => {
    if (testimonial) {
      setFormData({
        clientName: testimonial.clientName || "",
        company: testimonial.company || "",
        title: testimonial.title || "",
        message: testimonial.message || "",
        avatar: null,
        avatarPreview: testimonial.avatarUrl || "",
      });
    } else {
      setFormData({
        clientName: "",
        company: "",
        title: "",
        message: "",
        avatar: null,
        avatarPreview: "",
      });
    }
  }, [testimonial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatar: file, avatarPreview: preview }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.message) {
      toast.error("Client name and message are required.");
      return;
    }

    const payload = new FormData();
    payload.append("clientName", formData.clientName);
    payload.append("message", formData.message);
    if (formData.company) payload.append("company", formData.company);
    if (formData.title) payload.append("designation", formData.title);
    if (formData.avatar) payload.append("file", formData.avatar);

    setLoading(true); // show loader
    try {
      await onSave(payload, !!testimonial); // second arg: is update
      toast.success(testimonial ? "Testimonial updated!" : "Testimonial created!");
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
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Loader */}
            {loading && <Loader message={testimonial ? "Updating..." : "Saving..."} />}

            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {testimonial ? "Edit Testimonial" : "Add Testimonial"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Client Name */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Title / Designation */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Title / Designation
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={4}
                  required
                />
              </div>

              {/* Avatar / Image */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Avatar / Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full"
                />
                {formData.avatarPreview && (
                  <img
                    src={formData.avatarPreview}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded mt-2 border"
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  {testimonial ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TestimonialModal;
