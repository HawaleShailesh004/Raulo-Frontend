import React, { useState, useEffect, useMemo } from "react";
import { Editor } from "@tinymce/tinymce-react";

// --- SVG Icons (Heroicons) ---
// Using inline SVGs for simplicity, no extra dependencies needed.
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- 1. CONFIGURATION ---
// Central place to define form fields for each content type. Makes adding new types easier.
const FORM_CONFIG = {
  service: {
    name: "Service",
    color: "blue",
    fields: [
      { name: "name", placeholder: "Service Name", type: "text", required: true },
      { name: "description", placeholder: "Service Description", type: "textarea", required: true },
      { name: "icon", label: "Service Icon (Optional)", type: "file", accept: "image/*" },
    ],
  },
  testimonial: {
    name: "Testimonial",
    color: "green",
    fields: [
      { name: "name", placeholder: "Client Name", type: "text", required: true },
      { name: "text", placeholder: "Testimonial Text", type: "textarea", required: true },
      { name: "photo", label: "Client Photo (Optional)", type: "file", accept: "image/*" },
    ],
  },
  blog: {
    name: "Blog Post",
    color: "purple",
    fields: [
      { name: "title", placeholder: "Blog Title", type: "text", required: true },
      { name: "image", label: "Blog Cover Image (Required)", type: "file", accept: "image/*", required: true },
      { name: "content", type: "editor", required: true },
    ],
  },
};


// --- 2. CUSTOM HOOK FOR STATE MANAGEMENT ---
/**
 * @description Manages all state and logic for the admin panel content.
 * This encapsulates the complexity, keeping components clean.
 * @returns {object} State and handler functions.
 */
const useContentManager = (initialItems = []) => {
  const [items, setItems] = useState(initialItems);
  const [modalState, setModalState] = useState({ type: null, data: null }); // 'add', 'edit', 'view'
  const [viewItem, setViewItem] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [alert, setAlert] = useState(null);

  // Clear alert message after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  
  // Memoized filtering and sorting for performance
  const processedItems = useMemo(() => {
    let currentItems = [...items];
    if (filterType !== "all") {
      currentItems = currentItems.filter((item) => item.type === filterType);
    }
    currentItems.sort((a, b) => {
      if (sortBy === "newest") return b.id - a.id;
      if (sortBy === "oldest") return a.id - b.id;
      if (sortBy === "alphabetical") {
        const nameA = (a.data.name || a.data.title || "").toLowerCase();
        const nameB = (b.data.name || b.data.title || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }
      return 0;
    });
    return currentItems;
  }, [items, filterType, sortBy]);

  const showAlert = (type, message) => setAlert({ type, message });

  const handleSaveItem = (itemData) => {
    try {
      const { id, type, data } = itemData;
      const isUpdating = !!id;
      
      const updatedItems = isUpdating
        ? items.map(item => (item.id === id ? { ...item, data } : item))
        : [...items, { id: Date.now(), type, data }];
        
      setItems(updatedItems);
      setModalState({ type: null, data: null }); // Close modal
      showAlert("success", `${FORM_CONFIG[type].name} ${isUpdating ? "updated" : "added"} successfully! 🎉`);
    } catch (error) {
      console.error("Save item error:", error);
      showAlert("error", "An unexpected error occurred while saving.");
    }
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      setItems(items.filter((item) => item.id !== id));
      setViewItem(null); // Close view modal if open
      showAlert("success", "Item deleted successfully.");
    }
  };

  return {
    items, processedItems, modalState, setModalState, viewItem, setViewItem,
    filterType, setFilterType, sortBy, setSortBy, alert, setAlert,
    handleSaveItem, handleDeleteItem, showAlert,
  };
};

// --- 3. REUSABLE UI COMPONENTS ---

const Alert = ({ alert, onDismiss }) => {
  if (!alert) return null;

  const styles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
  };

  return (
    <div className={`fixed top-5 right-5 z-50 p-4 rounded-md border text-sm font-medium shadow-lg transition-transform transform-gpu animate-fade-in-down ${styles[alert.type]}`}>
      <span>{alert.message}</span>
      <button onClick={onDismiss} className="ml-4 font-bold opacity-75 hover:opacity-100">&times;</button>
    </div>
  );
};

const DashboardHeader = ({ onLogout }) => (
  <header className="flex items-center justify-between pb-5 border-b border-gray-200 mb-8">
    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
      Admin Dashboard
    </h1>
    <button
      onClick={onLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition duration-300 font-semibold text-sm transform hover:scale-105"
    >
      Logout
    </button>
  </header>
);

const FilterControls = ({ filterType, setFilterType, sortBy, setSortBy, onAddNew }) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
    <div className="flex gap-4 w-full sm:w-auto">
      {/* Filter Dropdown */}
      <div className="flex-1">
        <label htmlFor="filter-type" className="block text-sm font-medium text-gray-600 mb-1">Filter By</label>
        <select
          id="filter-type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition"
        >
          <option value="all">All Items</option>
          <option value="service">Services</option>
          <option value="testimonial">Testimonials</option>
          <option value="blog">Blogs</option>
        </select>
      </div>
      {/* Sort Dropdown */}
      <div className="flex-1">
        <label htmlFor="sort-by" className="block text-sm font-medium text-gray-600 mb-1">Sort By</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alphabetical">Name (A-Z)</option>
        </select>
      </div>
    </div>
    {/* Add New Button */}
    <button
      onClick={onAddNew}
      className="bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition duration-300 font-semibold flex items-center justify-center w-full sm:w-auto transform hover:scale-105"
    >
      <PlusIcon /> Add New
    </button>
  </div>
);

const ContentCard = ({ item, onView, onEdit, onDelete }) => {
  const config = FORM_CONFIG[item.type];
  const title = item.data.name || item.data.title;
  const description = (item.data.description || item.data.text || item.data.content || "").replace(/<[^>]*>/g, "");
  const imageUrl = item.data.icon || item.data.photo || item.data.image;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-blue-400 hover:-translate-y-1">
      <div>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 truncate pr-2" title={title}>{title}</h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize bg-${config.color}-100 text-${config.color}-800`}>
              {item.type}
            </span>
        </div>
        <p className="text-sm text-gray-600 break-words line-clamp-3">
          {description || "No description provided."}
        </p>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <button onClick={() => onView(item)} className="text-sm font-medium text-blue-600 hover:text-blue-800">View Details</button>
        <div className="flex gap-2">
            <button onClick={() => onEdit(item)} className="text-sm font-medium text-yellow-600 hover:text-yellow-800">Edit</button>
            <button onClick={() => onDelete(item.id)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
        </div>
      </div>
    </div>
  );
};


const ContentModal = ({ modalState, onSave, onDismiss, showAlert }) => {
    const { type: action, item } = modalState;
    const isEditing = action === 'edit';
    const [selectedType, setSelectedType] = useState(isEditing ? item.type : null);
    const [formData, setFormData] = useState(isEditing ? item.data : {});
    const [blogContent, setBlogContent] = useState(isEditing && item.type === 'blog' ? item.data.content : '');
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Effect to reset form when modal opens for adding a new item
    useEffect(() => {
        if (action === 'add') {
            setSelectedType(null);
            setFormData({});
            setBlogContent('');
        }
    }, [action]);

    if (!action) return null;

    const config = selectedType ? FORM_CONFIG[selectedType] : null;
    const title = `${isEditing ? 'Edit' : 'Add New'} ${config ? config.name : ''}`;

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleSubmit = () => {
        // Validate required fields
        for (const field of config.fields) {
            const isMissingFile = field.type === 'file' && field.required && !formData[field.name] && (!isEditing || !item.data[field.name]);
            const isMissingText = field.type !== 'file' && field.required && !formData[field.name] && (field.type !== 'editor' || !blogContent);

            if (isMissingFile || isMissingText) {
                showAlert('warning', `${field.placeholder || field.label} is required.`);
                return;
            }
        }
        
        const dataToSave = {
            ...formData,
            content: selectedType === 'blog' ? blogContent : formData.content,
        };

        onSave({
            id: isEditing ? item.id : null,
            type: selectedType,
            data: dataToSave,
        });
    };
    
    // Step 1: Type Selection
    if (action === 'add' && !selectedType) {
        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">What do you want to add?</h2>
                    <div className="flex flex-col space-y-3">
                         {Object.entries(FORM_CONFIG).map(([key, { name }]) => (
                            <button key={key} onClick={() => setSelectedType(key)}
                                className="w-full text-left bg-gray-100 hover:bg-blue-100 hover:text-blue-700 p-3 rounded-lg transition font-semibold"
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                    <button onClick={onDismiss} className="mt-6 text-sm text-gray-500 hover:text-gray-800">Cancel</button>
                </div>
            </div>
        );
    }
    
    // Step 2: Form
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onDismiss} className="text-gray-400 hover:text-gray-700"><CloseIcon /></button>
                </div>
                
                <div className="space-y-4">
                    {config.fields.map(field => {
                        if (field.type === 'editor') {
                             return (
                                <div key={field.name}>
                                    {!isEditorReady && <p className="text-yellow-600 text-sm">Loading editor...</p>}
                                    <Editor
                                        apiKey="YOUR_API_KEY_HERE" // Replace with your TinyMCE API key
                                        value={blogContent}
                                        onInit={() => setIsEditorReady(true)}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
                                            toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image | help'
                                        }}
                                        onEditorChange={(content) => setBlogContent(content)}
                                    />
                                </div>
                            );
                        } else if (field.type === 'textarea') {
                             return (
                                <textarea key={field.name} name={field.name} placeholder={field.placeholder}
                                    value={formData[field.name] || ''} onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 transition resize-none"
                                    rows="4"
                                />
                            );
                        } else if (field.type === 'file') {
                            return (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-gray-600">{field.label}</label>
                                    <input type="file" name={field.name} onChange={handleInputChange} accept={field.accept}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <input key={field.name} type={field.type} name={field.name} placeholder={field.placeholder}
                                    value={formData[field.name] || ''} onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 transition"
                                />
                            );
                        }
                    })}
                </div>
                
                <div className="flex justify-end items-center pt-6 mt-6 border-t border-gray-200 gap-3">
                    <button onClick={onDismiss} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                    <button onClick={handleSubmit} className={`px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition`}>
                        {isEditing ? 'Save Changes' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 4. MAIN COMPONENT ---

function AdminPanel({ setIsAuthenticated }) {
  const {
    processedItems, modalState, setModalState, viewItem, setViewItem,
    filterType, setFilterType, sortBy, setSortBy, alert, setAlert,
    handleSaveItem, handleDeleteItem, showAlert
  } = useContentManager([]); // Start with empty items

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    // Note: The alert won't be visible after redirect, but this is good practice.
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-sans">
      <Alert alert={alert} onDismiss={() => setAlert(null)} />
      
      <DashboardHeader onLogout={handleLogout} />

      <main>
        <FilterControls
          filterType={filterType} setFilterType={setFilterType}
          sortBy={sortBy} setSortBy={setSortBy}
          onAddNew={() => setModalState({ type: 'add', item: null })}
        />

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedItems.length > 0 ? (
            processedItems.map((item) => (
              <ContentCard key={item.id} item={item}
                onView={setViewItem}
                onEdit={(itemToEdit) => setModalState({ type: 'edit', item: itemToEdit })}
                onDelete={handleDeleteItem}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed">
                <h3 className="text-lg font-medium text-gray-700">No items found.</h3>
                <p className="text-sm text-gray-500 mt-1">Click "Add New" to get started!</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {modalState.type &&
        <ContentModal
          modalState={modalState}
          onSave={handleSaveItem}
          onDismiss={() => setModalState({ type: null, data: null })}
          showAlert={showAlert}
        />
      }
      
   

    </div>
  );
}

export default AdminPanel;