import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiService from "../../../api/apiService";
import TestimonialModal from "../modals/TestimonialModal";
import Loader from "../Loader"; // Reusable loader

const TestimonialContainer = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  // Fetch all testimonials
  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.testimonials.getAll();
      setTestimonials(response.data);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Failed to load testimonials. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchTestimonials();
  }, []);

  // Open modal for add
  const handleAdd = () => {
    setSelectedTestimonial(null);
    setModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setModalOpen(true);
  };

  // Delete testimonial
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    setLoading(true);
    try {
      await apiService.testimonials.delete(id);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      toast.success("Testimonial deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete testimonial.");
    } finally {
      setLoading(false);
    }
  };

  // Handle create or update from modal
  const handleSave = async (formData) => {
    setLoading(true);
    try {
      if (selectedTestimonial) {
        await apiService.testimonials.update(selectedTestimonial._id, formData);
        toast.success("Testimonial updated successfully!");
      } else {
        await apiService.testimonials.create(formData);
        toast.success("Testimonial created successfully!");
      }
      setModalOpen(false);
      fetchTestimonials(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to save testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-8 w-[90%] mx-auto pb-4 border-b relative">
      {/* Loader overlay */}
      {loading && <Loader message="Processing..." />}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Testimonials</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Add Testimonial
          </button>
        
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t._id}
            className="relative bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              {t.avatarUrl ? (
                <img
                  src={t.avatarUrl}
                  alt={t.clientName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  {t.clientName?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{t.clientName}</h3>
                <p className="text-gray-500 text-xs">
                  {t.title}, {t.company}
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-xs line-clamp-3">{t.message}</p>

            <div className="absolute top-3 right-3 flex gap-2 rounded-lg p-1 hover:opacity-100 transition">
              <button
                onClick={() => handleEdit(t)}
                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-400 text-white rounded text-xs backdrop-blur-sm transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="px-3 py-1 bg-red-500 hover:bg-red-500 text-white rounded text-xs backdrop-blur-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500 py-8">
            No testimonials found.
          </p>
        )}
      </div>

      {/* Modal */}
      <TestimonialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        testimonial={selectedTestimonial}
        onSave={handleSave}
      />
    </section>
  );
};

export default TestimonialContainer;
