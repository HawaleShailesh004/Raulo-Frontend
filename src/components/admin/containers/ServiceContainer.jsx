import React, { useEffect, useState } from "react";
import apiService from "../../../api/apiService";
import toast from "react-hot-toast";
import ServiceModal from "../modals/ServiceModal";
import Loader from "../Loader"; // reusable loader

const ServiceContainer = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.services.getAll();
      setServices(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchServices();
  }, []);

  const handleOpenModal = (service = null) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    setLoading(true);
    try {
      if (selectedService) {
        await apiService.services.update(selectedService._id, formData);
        toast.success("Service updated successfully");
      } else {
        await apiService.services.create(formData);
        toast.success("Service created successfully");
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);
    try {
      await apiService.services.delete(id);
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-8 w-[90%] mx-auto pb-4 border-b relative">
      {/* Loader overlay */}
      {loading && <Loader message="Processing..." />}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Services</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal()}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Add Service
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="relative h-48 rounded-xl overflow-hidden shadow-lg group"
          >
            {service.images[0] && (
              <img
                src={service.images[0]}
                alt={service.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
              <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                {service.title}
              </h3>
              <p className="text-white text-sm line-clamp-3">{service.shortDesc}</p>
            </div>
            <div className="absolute bottom-3 right-3 flex gap-2 backdrop-blur-sm rounded-lg p-1 opacity-90 group-hover:opacity-100 transition">
              <button
                onClick={() => handleOpenModal(service)}
                className="px-3 py-1 bg-yellow-400/40 hover:bg-yellow-400 text-white rounded text-xs backdrop-blur-sm transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service._id)}
                className="px-3 py-1 bg-red-500/40 hover:bg-red-500 text-white rounded text-xs backdrop-blur-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500 py-8">
            No services found.
          </p>
        )}
      </div>

      {/* Modal */}
      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        service={selectedService}
        onSave={handleSave}
      />
    </section>
  );
};

export default ServiceContainer;
