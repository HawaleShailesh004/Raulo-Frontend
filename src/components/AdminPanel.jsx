import React, { useState, useEffect, useMemo } from "react";
import { Editor } from "@tinymce/tinymce-react";

function AdminPanel({ setIsAuthenticated }) {
  const [items, setItems] = useState([]);
  const [modalStep, setModalStep] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({});
  const [viewItem, setViewItem] = useState(null);

  // Sorting and Filtering State
  const [filterType, setFilterType] = useState("all"); // 'all', 'service', 'testimonial', 'blog'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'alphabetical'

  // Error/Success Handling State (from previous revision)
  const [alertMessage, setAlertMessage] = useState(null); // { type: 'success'|'error'|'warning', message: string }
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Blog editor state
  const [blogContent, setBlogContent] = useState("");

  // Clear alert message after a few seconds (from previous revision)
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Sync blog content for update (unchanged)
  useEffect(() => {
    if (modalStep === 2 && selectedType === "blog") {
      setBlogContent(formData.content || "");
    }
  }, [modalStep, selectedType, formData.content]);

  // --- NEW: Memoized Filtered and Sorted Items ---
  const filteredAndSortedItems = useMemo(() => {
    let currentItems = [...items];

    // 1. Filtering
    if (filterType !== "all") {
      currentItems = currentItems.filter((item) => item.type === filterType);
    }

    // 2. Sorting
    currentItems.sort((a, b) => {
      // Items are saved with their id being the Date.now() timestamp, which is used for sorting.
      const idA = a.id;
      const idB = b.id;

      if (sortBy === "newest") {
        return idB - idA; // Descending timestamp
      } else if (sortBy === "oldest") {
        return idA - idB; // Ascending timestamp
      } else if (sortBy === "alphabetical") {
        // Get the main display name/title for comparison
        const nameA = (a.data.name || a.data.title || "").toLowerCase();
        const nameB = (b.data.name || b.data.title || "").toLowerCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      }
      return 0;
    });

    return currentItems;
  }, [items, filterType, sortBy]);
  // -----------------------------------------------

  const handleLogout = () => {
    try {
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      setAlertMessage({
        type: "success",
        message: "Logged out successfully! 👋",
      });
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Error during logout: Could not clear local storage.",
      });
    }
  };

  const handleAddClick = () => {
    setSelectedType("");
    setFormData({});
    setBlogContent("");
    setModalStep(1);
    setAlertMessage(null);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData({});
    setModalStep(2);
  };

  const handleInputChange = (e) => {
    try {
      const { name, value, files } = e.target;
      setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Input change failed. Please check the field.",
      });
      console.error("Input change error:", error);
    }
  };

  const validateFormData = (type, data, content) => {
    if (type === "service") {
      if (!data.name || !data.description)
        return "Service Name and Description are required.";
    } else if (type === "testimonial") {
      if (!data.name || !data.text)
        return "Client Name and Testimonial Text are required.";
    } else if (type === "blog") {
      if (!data.title || !data.image || !content)
        return "Blog Title, Cover Image, and Content are required.";
    }
    return null; // No error
  };

  const handleSubmit = () => {
    let contentToStore = formData.content;
    if (selectedType === "blog") {
      contentToStore = blogContent;
    }

    const validationError = validateFormData(
      selectedType,
      formData,
      contentToStore
    );

    if (validationError) {
      setAlertMessage({ type: "warning", message: validationError });
      return;
    }

    try {
      const finalFormData = { ...formData, content: contentToStore };
      // ID uses Date.now() for unique ID and creation time for sorting
      const id = finalFormData.id || Date.now(); 

      const updatedItems = finalFormData.id
        ? items.filter((item) => item.id !== finalFormData.id)
        : items;

      setItems([...updatedItems, { id, type: selectedType, data: finalFormData }]);
      setModalStep(0);
      setSelectedType("");
      setFormData({});
      setBlogContent("");

      setAlertMessage({
        type: "success",
        message: `Content for ${selectedType} ${
          finalFormData.id ? "updated" : "published"
        } successfully! 🎉`,
      });
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "An unexpected error occurred while saving the item.",
      });
      console.error("Submission error:", error);
    }
  };

  const handleDelete = (id) => {
    try {
      setItems(items.filter((item) => item.id !== id));
      if (viewItem && viewItem.id === id) setViewItem(null);
      setAlertMessage({ type: "success", message: "Item deleted successfully." });
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Error deleting item. Please try again.",
      });
      console.error("Delete error:", error);
    }
  };

  const handleUpdate = (item) => {
    try {
      setSelectedType(item.type);
      setFormData({ id: item.id, ...item.data });
      setModalStep(2);
      setViewItem(null);
      setAlertMessage(null);
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Error preparing item for update.",
      });
      console.error("Update preparation error:", error);
    }
  };

  const openReadMore = (item) => setViewItem(item);

  // Helper function for safe image URL creation (from previous revision)
  const getObjectUrlSafely = (file) => {
    if (!file) return null;
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Error creating object URL:", error);
      return null;
    }
  };

  const renderCardContent = (item) => {
    const content =
      item.type === "service"
        ? item.data.description
        : item.type === "testimonial"
        ? item.data.text
        : item.data.description || item.data.content || "";

    if (!content) return null;

    const text =
      item.type === "blog" ? content.replace(/<[^>]*>/g, "") : content;

    return (
      <p className="mt-2 text-gray-400 text-sm italic break-words">
        {text.substring(0, 100)}...
        <span className="text-indigo-400 font-medium ml-1">
          Click to view details
        </span>
      </p>
    );
  };

  const alertStyles = alertMessage
    ? {
        success: "bg-green-500 border-green-700",
        error: "bg-red-500 border-red-700",
        warning: "bg-yellow-500 border-yellow-700",
      }[alertMessage.type] || "bg-gray-500 border-gray-700"
    : "";

  return (
    <div className="min-h-screen bg-gray-900 p-6 sm:p-10 text-gray-100">
      {/* --- Alert Message Display --- */}
      {alertMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-white font-semibold shadow-2xl transition duration-500 ease-in-out transform scale-100 border-2 ${alertStyles}`}
        >
          {alertMessage.message}
          <button
            onClick={() => setAlertMessage(null)}
            className="ml-4 font-bold opacity-75 hover:opacity-100 transition"
          >
            &times;
          </button>
        </div>
      )}
      {/* ----------------------------- */}

      {/* Header (unchanged) */}
      <div className="flex items-center justify-between pb-8 border-b border-gray-700 mb-6">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Admin Dashboard 🚀
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-5 py-2 rounded-full shadow-lg hover:bg-red-700 transition duration-300 font-semibold text-white transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* --- NEW: Filter and Sort Controls --- */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between">
        {/* Filter Dropdown */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label htmlFor="filter-type" className="text-gray-400 font-medium whitespace-nowrap">
            Filter By:
          </label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 w-full sm:w-40"
          >
            <option value="all">All Items</option>
            <option value="service">Services</option>
            <option value="testimonial">Testimonials</option>
            <option value="blog">Blogs</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label htmlFor="sort-by" className="text-gray-400 font-medium whitespace-nowrap">
            Sort By:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 w-full sm:w-40"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Name (A-Z)</option>
          </select>
        </div>
        
        {/* Add New Button (Moved for better layout) */}
        <button
          onClick={handleAddClick}
          className="bg-indigo-600 px-5 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 font-semibold text-white transform hover:scale-105 w-full sm:w-auto"
        >
          + Add New
        </button>
      </div>
      {/* ------------------------------------------- */}

      {/* Grid (Now uses filteredAndSortedItems) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/*
          Removing the original '+ Add New Item' card here to use the button above.
          This makes the grid cleaner and keeps controls grouped.
        */}

        {filteredAndSortedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => openReadMore(item)}
            className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50 relative transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer flex flex-col justify-between min-h-[12rem]"
          >
            <div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full absolute top-3 right-3 capitalize 
              ${
                item.type === "service"
                  ? "bg-blue-600 text-white"
                  : item.type === "testimonial"
                  ? "bg-green-600 text-white"
                  : "bg-purple-600 text-white"
              }`}
              >
                {item.type}
              </span>

              <h2 className="text-xl font-bold mt-2 text-white truncate">
                {item.type === "service"
                  ? item.data.name
                  : item.type === "testimonial"
                  ? item.data.name
                  : item.data.title}
              </h2>

              {renderCardContent(item)}

              {/* Image Rendering (uses safe function) */}
              {item.type === "service" && item.data.icon && (
                <img
                  src={getObjectUrlSafely(item.data.icon)}
                  alt="Service Icon"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "placeholder-error-icon.svg";
                  }}
                  className="mt-4 w-12 h-12 rounded-lg object-cover border-2 border-blue-500/70"
                />
              )}

              {item.type === "testimonial" && item.data.photo && (
                <img
                  src={getObjectUrlSafely(item.data.photo)}
                  alt="testimonial photo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "placeholder-error-photo.svg";
                  }}
                  className="mt-4 w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                />
              )}

              {item.type === "blog" && item.data.image && (
                <img
                  src={getObjectUrlSafely(item.data.image)}
                  alt="blog main"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "placeholder-error-image.svg";
                  }}
                  className="mt-4 w-full h-40 rounded-lg object-cover border-2 border-purple-500"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals and Read More Modal (kept unchanged for brevity, only showing the new logic) */}
      {/* Modal Step 1 (Type Selection) */}
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
            {/* Modal Step 2 (Form) */}
            {modalStep === 2 && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-white capitalize">
                  {formData.id ? "Update" : "Add New"} {selectedType}
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
                      <label className="block text-sm font-medium text-gray-400">
                        Service Icon/Image (Optional)
                        <input
                          type="file"
                          name="icon"
                          onChange={handleInputChange}
                          className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                        />
                      </label>
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

                      <label className="block text-sm font-medium text-gray-400">
                        Blog Cover Image (Required)
                        <input
                          type="file"
                          name="image"
                          onChange={handleInputChange}
                          className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                        />
                      </label>

                      {!isEditorReady && (
                        <p className="text-yellow-400">
                          Loading rich text editor...
                        </p>
                      )}
                      <Editor
                        apiKey="6tmgaucy6jn9sbs54pscrnc3kh2mr2ls59320y1lwviq205s"
                        value={blogContent}
                        onInit={(evt, editor) => {
                          setIsEditorReady(true);
                          editor.on("error", (e) => {
                            setAlertMessage({
                              type: "error",
                              message: "TinyMCE Editor failed to load.",
                            });
                            console.error("TinyMCE error:", e);
                            setIsEditorReady(false);
                          });
                        }}
                        init={{
                          height: 300,
                          menubar: false,
                          skin: "oxide-dark",
                          content_css: "dark",
                          plugins: [
                            "advlist autolink lists link image charmap preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                          ],
                          toolbar:
                            "undo redo | formatselect | bold italic underline | " +
                            "alignleft aligncenter alignright alignjustify | " +
                            "bullist numlist outdent indent | removeformat | image | help",
                        }}
                        onEditorChange={(content) => setBlogContent(content)}
                      />
                    </>
                  )}

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={handleSubmit}
                      className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 transform transition font-bold text-white shadow-md hover:scale-[1.02]"
                    >
                      {formData.id ? "Save Changes" : "Publish"}
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

      {/* Read More Modal (unchanged) */}
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
                    Name:{" "}
                    <span className="font-normal text-blue-400">
                      {viewItem.data.name}
                    </span>
                  </p>
                  <div>
                    <strong className="block mb-1 text-gray-400">
                      Description:
                    </strong>
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {viewItem.data.description}
                    </p>
                  </div>
                  {viewItem.data.icon && (
                    <img
                      src={getObjectUrlSafely(viewItem.data.icon)}
                      alt="Service Icon"
                      className="w-16 h-16 rounded-lg object-cover border-4 border-blue-500 mt-4"
                    />
                  )}
                </>
              )}

              {viewItem.type === "testimonial" && (
                <>
                  <p className="text-xl font-semibold">
                    Client:{" "}
                    <span className="font-normal text-green-400">
                      {viewItem.data.name}
                    </span>
                  </p>
                  <div>
                    <strong className="block mb-1 text-gray-400">
                      Testimonial:
                    </strong>
                    <p className="text-gray-300 italic whitespace-pre-wrap">
                      "{viewItem.data.text}"
                    </p>
                  </div>
                  {viewItem.data.photo && (
                    <img
                      src={getObjectUrlSafely(viewItem.data.photo)}
                      alt="Client photo"
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-500 mt-4"
                    />
                  )}
                </>
              )}

              {viewItem.type === "blog" && (
                <>
                  <p className="text-xl font-semibold">
                    Title:{" "}
                    <span className="font-normal text-purple-400">
                      {viewItem.data.title}
                    </span>
                  </p>
                  {viewItem.data.image && (
                    <img
                      src={getObjectUrlSafely(viewItem.data.image)}
                      alt="blog main"
                      className="w-full h-64 rounded-lg object-cover border-4 border-purple-500 my-4"
                    />
                  )}
                  <div>
                    <strong className="block mb-1 text-gray-400">
                      Content:
                    </strong>
                    <div
                      className="text-gray-300 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: viewItem.data.content,
                      }}
                    />
                  </div>
                </>
              )}
            </div>

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