import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../Loader";

const InquiryModal = ({ isOpen, onClose, inquiry }) => {
  const [loading, setLoading] = useState(false);

  if (!inquiry) return null;

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
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-lg p-6 relative"
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

            <h2 className="text-2xl font-bold mb-4 text-gray-800">Inquiry Details</h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> {inquiry.name}
              </p>
              {inquiry.email && (
                <p>
                  <span className="font-semibold">Email:</span> {inquiry.email}
                </p>
              )}
              {inquiry.company && (
                <p>
                  <span className="font-semibold">Company:</span> {inquiry.company}
                </p>
              )}
              {inquiry.phone && (
                <p>
                  <span className="font-semibold">Phone:</span> {inquiry.phone}
                </p>
              )}
              {inquiry.businessDetails && (
                <p>
                  <span className="font-semibold">Business Details:</span> {inquiry.businessDetails}
                </p>
              )}
              {inquiry.subject && (
                <p>
                  <span className="font-semibold">Subject:</span> {inquiry.subject}
                </p>
              )}
              <p className="mt-2">
                <span className="font-semibold">Message:</span>
              </p>
              <div className="border p-3 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                {inquiry.message}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            {loading && <Loader message="Loading..." />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InquiryModal;
