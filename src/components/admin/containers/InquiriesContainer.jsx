import React, { useEffect, useState } from "react";
import { FiEye, FiCheckCircle, FiTrash2 } from "react-icons/fi";
import apiService from "../../../api/apiService";
import toast from "react-hot-toast";
import InquiryModal from "../modals/InquiryModal";
import Loader from "../Loader";

const InquiriesContainer = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const [filterHandled, setFilterHandled] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);

    try {
      let params = {};
      if (filterHandled === "handled") params.handled = true;
      else if (filterHandled === "not-handled") params.handled = false;

      const response = await apiService.inquiries.filter(params);
      let data = response.data;

      if (sortOrder === "newest")
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      else data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setInquiries(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load inquiries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchInquiries();
  }, [filterHandled, sortOrder]);

  const handleView = (inq) => {
    setSelectedInquiry(inq);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    setLoading(true);
    try {
      await apiService.inquiries.delete(id);
      toast.success("Inquiry deleted successfully");
      fetchInquiries();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inquiry");
    } finally {
      setLoading(false);
    }
  };

  const toggleHandled = async (id) => {
    setLoading(true);
    try {
      await apiService.inquiries.markAsHandled(id);
      toast.success("Inquiry status updated");
      fetchInquiries();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update inquiry status");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const time = `${hours}:${minutes} ${ampm}`;

    return (
      <div className="flex flex-col text-gray-600 text-sm">
        <span>{`${day} ${month}`}</span>
        <span>{time}</span>
      </div>
    );
  };

  return (
    <section className="mb-8 w-[90%] mx-auto pb-4 border-b relative">
      {loading && <Loader message="Loading inquiries..." />}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Inquiries</h2>
        <div className="flex gap-2">
          <select
            value={filterHandled}
            onChange={(e) => setFilterHandled(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="handled">Handled</option>
            <option value="not-handled">Not Handled</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-4 font-medium text-gray-700">Name</th>
              <th className="px-4 py-4 font-medium text-gray-700">Phone</th>
              <th className="px-2 py-4 font-medium text-gray-700 w-1/3">Message</th>
              <th className="px-1 py-4 font-medium text-gray-700">Received</th>
              <th className="px-4 py-4 font-medium text-gray-700">Status</th>
              <th className="px-4 py-4 font-medium text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr
                key={inq._id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{inq.name}</td>
                <td className="px-2 py-3">{inq.phone}</td>
                <td className="pl-2 pr-2 py-3 line-clamp-2">{inq.message}</td>
                <td className="py-3 text-left">{formatDateTime(inq.createdAt)}</td>
                <td className="px-2 py-3 text-center">
                  {inq.handled ? (
                    <span className="text-green-600 font-semibold text-xs">Handled</span>
                  ) : (
                    <span className="text-red-500 font-semibold text-xs">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex gap-2 justify-center">
                    <button
                      onClick={() => handleView(inq)}
                      className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs transition"
                    >
                      <FiEye />
                    </button>

                    <button
                      onClick={() => handleDelete(inq._id)}
                      className="flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition"
                    >
                      <FiTrash2 />
                    </button>

                    <button
                      onClick={() => toggleHandled(inq._id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                        inq.handled
                          ? "bg-gray-400 hover:bg-gray-500 text-white"
                          : "bg-yellow-400 hover:bg-yellow-500 text-white"
                      }`}
                    >
                      <FiCheckCircle />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {inquiries.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No inquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        inquiry={selectedInquiry}
      />
    </section>
  );
};

export default InquiriesContainer;
