import React, { useState } from "react";

function AdminPanel({ setIsAuthenticated }) {
  const [items, setItems] = useState([]);
  const [modalStep, setModalStep] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({});
  const [viewItem, setViewItem] = useState(null); // Read More modal

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  const handleAddClick = () => {
    setSelectedType(""); // Clear type
    setFormData({}); // Clear form data for new item
    setModalStep(1);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData({});
    setModalStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    // Handle file input separately, otherwise use value
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = () => {
    // Check if we are updating (has an ID) or adding (needs new ID)
    const id = formData.id || Date.now(); 
    
    // If updating, filter out the old item, otherwise just add
    const updatedItems = formData.id 
        ? items.filter(item => item.id !== formData.id) 
        : items;
        
    setItems([...updatedItems, { id, type: selectedType, data: formData }]);
    
    // Reset state and close modal
    setModalStep(0);
    setSelectedType("");
    setFormData({});
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
    // Close the Read More modal if the item being viewed is deleted
    if (viewItem && viewItem.id === id) setViewItem(null);
    else setViewItem(null); // Close modal after successful delete from popup
  };

  const handleUpdate = (item) => {
    setSelectedType(item.type);
    // Include the original ID in formData to track the item being updated
    setFormData({ id: item.id, ...item.data }); 
    setModalStep(2); // Go directly to the form
    setViewItem(null); // Close read more if it was open
  };

  const openReadMore = (item) => setViewItem(item);

  const renderCardContent = (item) => {
    const text =
      item.type === "service"
        ? item.data.description
        : item.type === "testimonial"
        ? item.data.text
        : item.data.content || "";

    if (!text) return null;

    // Show collapsed content if too long
    // Use the card's onClick to open the full view
    return (
      <p className="mt-2 text-gray-400 text-sm italic break-words">
        {text.substring(0, 100)}...
        <span className="text-indigo-400 font-medium ml-1">
          Click to view details
        </span>
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 sm:p-10 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-8 border-b border-gray-700 mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Admin Dashboard 🚀</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-5 py-2 rounded-full shadow-lg hover:bg-red-700 transition duration-300 font-semibold text-white transform hover:scale-105"
        >
          Logout
        </button>
      </div>
{/* ---------------------------------------------------------------------- */}
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Add Card */}
        <div
          onClick={handleAddClick}
          className="h-48 bg-gray-800 border-2 border-dashed border-indigo-500/50 p-6 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer 
                   hover:bg-gray-700/70 hover:scale-[1.02] transform transition duration-300 group"
        >
          <span className="text-2xl font-bold text-indigo-400 group-hover:text-indigo-300 transition duration-300">
            + Add New Item
          </span>
        </div>

        {/* Existing Cards */}
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => openReadMore(item)} // Click card to open the pop-up
            className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50 relative transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer flex flex-col justify-between min-h-[12rem]"
          >
                {/* Content Container */}
                <div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full absolute top-3 right-3 capitalize 
              ${item.type === 'service' ? 'bg-blue-600 text-white' : 
                item.type === 'testimonial' ? 'bg-green-600 text-white' : 
                'bg-purple-600 text-white'}`
            }>
              {item.type}
            </span>
            
            <h2 className="text-xl font-bold mt-2 text-white truncate">
              {item.type === "service" ? item.data.name : 
               item.type === "testimonial" ? item.data.name : 
               item.data.title}
            </h2>

            {renderCardContent(item)}

            {item.type === "testimonial" && item.data.photo && (
                <img
                    src={URL.createObjectURL(item.data.photo)}
                    alt="testimonial photo"
                    className="mt-4 w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                />
            )}
                </div> {/* End of Content Container */}
          </div>
        ))}
      </div>
{/* ---------------------------------------------------------------------- */}
      {/* --- Modals Below --- */}
      {/* Add/Edit Modal (No change needed here) */}
      {modalStep > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-lg shadow-2xl text-gray-100 border border-gray-700">
            {modalStep === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-white">
                  What type of content are you adding?
                </h2>
                <div className="flex flex-col space-y-3">
                  {["service", "testimonial", "blog"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className="bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-xl transition transform hover:scale-[1.01] font-semibold text-lg"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setModalStep(0)}
                  className="mt-6 text-gray-400 hover:text-white transition font-medium"
                >
                  Cancel
                </button>
              </>
            )}

            {modalStep === 2 && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-white capitalize">
                  {formData.id ? 'Update' : 'Add New'} {selectedType}
                </h2>
                <div className="flex flex-col space-y-4">
                  {selectedType === "service" && (
                    <>
                      <input
                        type="text"
                        name="name"
                        placeholder="Service Name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        className="px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-gray-200 transition"
                      />
                      <textarea
                        name="description"
                        placeholder="Service Description"
                        rows="4"
                        value={formData.description || ""}
                        onChange={handleInputChange}
                        className="px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-gray-200 transition resize-none"
                      />
                    </>
                  )}

                  {selectedType === "testimonial" && (
                    <>
                      <input
                        type="text"
                        name="name"
                        placeholder="Client Name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        className="px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 transition"
                      />
                      <textarea
                        name="text"
                        placeholder="Testimonial Text"
                        rows="4"
                        value={formData.text || ""}
                        onChange={handleInputChange}
                        className="px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none text-gray-200 transition resize-none"
                      />
                      <label className="block text-sm font-medium text-gray-400">
                        Client Photo (Optional)
                        <input
                            type="file"
                            name="photo"
                            onChange={handleInputChange}
                            className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                        />
                      </label>
                    </>
                  )}

                  {selectedType === "blog" && (
                    <>
                      <input
                        type="text"
                        name="title"
                        placeholder="Blog Title"
                        value={formData.title || ""}
                        onChange={handleInputChange}
                        className="px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-200 transition"
                      />
                      <textarea
                        name="content"
                        placeholder="Blog Content (Markdown supported)"
                        rows="8"
                        value={formData.content || ""}
                        onChange={handleInputChange}
                        className="px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-200 transition resize-none"
                      />
                    </>
                  )}

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={handleSubmit}
                      className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 transform transition font-bold text-white shadow-md hover:scale-[1.02]"
                    >
                      {formData.id ? 'Save Changes' : 'Publish'}
                    </button>
                    <button
                      onClick={() => setModalStep(0)}
                      className="text-gray-400 hover:text-white transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Read More Modal (Updated with Delete button) */}
      {viewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-2xl shadow-2xl text-gray-100 max-h-[90vh] overflow-y-auto relative border border-gray-700">
            <button
              onClick={() => setViewItem(null)}
              className="absolute top-4 right-4 text-gray-400 text-2xl hover:text-white transition"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-6 capitalize text-white border-b border-gray-700 pb-2">
              {viewItem.type} Details
            </h2>

            <div className="mb-6 space-y-4">
              {viewItem.type === "service" && (
                <>
                  <p className="text-xl font-semibold">
                    Name: <span className="font-normal text-indigo-400">{viewItem.data.name}</span>
                  </p>
                  <div>
                    <strong className="block mb-1 text-gray-400">Description:</strong>
                    <p className="text-gray-300 whitespace-pre-wrap">{viewItem.data.description}</p>
                  </div>
                </>
              )}

              {viewItem.type === "testimonial" && (
                <>
                  <p className="text-xl font-semibold">
                    Client: <span className="font-normal text-green-400">{viewItem.data.name}</span>
                  </p>
                  <div>
                    <strong className="block mb-1 text-gray-400">Testimonial:</strong>
                    <p className="text-gray-300 italic whitespace-pre-wrap">"{viewItem.data.text}"</p>
                  </div>
                  {viewItem.data.photo && (
                    <img
                      src={URL.createObjectURL(viewItem.data.photo)}
                      alt="Client photo"
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-500 mt-4"
                    />
                  )}
                </>
              )}

              {viewItem.type === "blog" && (
                <>
                  <p className="text-xl font-semibold">
                    Title: <span className="font-normal text-purple-400">{viewItem.data.title}</span>
                  </p>
                  <div>
                    <strong className="block mb-1 text-gray-400">Content:</strong>
                    <p className="text-gray-300 whitespace-pre-wrap">{viewItem.data.content}</p>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons in Pop-up Panel */}
            <div className="flex space-x-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => handleUpdate(viewItem)}
                className="bg-yellow-500 text-gray-900 px-5 py-2 rounded-lg hover:bg-yellow-400 transform transition font-bold shadow-md hover:scale-[1.02]"
              >
                Edit Item
              </button>
              <button
                onClick={() => handleDelete(viewItem.id)}
                className="bg-red-600 text-white px-5 py-2 ml-2 rounded-lg hover:bg-red-700 transform transition font-bold shadow-md hover:scale-[1.02]"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;