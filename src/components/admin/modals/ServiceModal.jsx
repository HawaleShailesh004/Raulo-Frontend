import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Loader from "../Loader";

const ServiceModal = ({ isOpen, onClose, service, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDesc: "",
    fullDesc: "",
    file: null,
  });
  const [preview, setPreview] = useState(""); // for image preview
  const [loading, setLoading] = useState(false); // loader state

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        slug: service.slug || "",
        shortDesc: service.shortDesc || "",
        fullDesc: service.fullDesc || "",
        file: null, // file will be uploaded anew
      });
      setPreview(service.file || "");
    } else {
      setFormData({
        title: "",
        slug: "",
        shortDesc: "",
        fullDesc: "",
        file: null,
      });
      setPreview("");
    }
  }, [service]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.trim().toLowerCase().replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // only one file
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.shortDesc) {
      toast.error("Title, slug, and short description are required.");
      return;
    }

    setLoading(true); // show loader
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("slug", formData.slug);
      payload.append("shortDesc", formData.shortDesc);
      payload.append("fullDesc", formData.fullDesc);

      if (formData.file) {
        payload.append("file", formData.file); // single image
      }

      // onSave must accept FormData
      await onSave(payload, !!service); // second arg indicates update
      toast.success(service ? "Service updated!" : "Service created!");
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
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-lg p-6 relative overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Loader */}
            {loading && <Loader message={service ? "Updating..." : "Saving..."} />}

            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {service ? "Edit Service" : "Add New Service"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated from title. Can edit manually.
                </p>
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Short Description *
                </label>
                <textarea
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={2}
                  required
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Full Description
                </label>
                <textarea
                  name="fullDesc"
                  value={formData.fullDesc}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={4}
                />
              </div>

              {/* Image */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded border"
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
                  {service ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;
