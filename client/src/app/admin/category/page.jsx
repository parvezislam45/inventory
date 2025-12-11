'use client';

import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Plus,
  Package,
  X,
  Loader
} from "lucide-react";
import Api from "../../../utils/Api";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newName, setNewName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');

  // -----------------------------------------------------------------------------------------------------
  // Fetch Categories
  // -----------------------------------------------------------------------------------------------------
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await Api.get("/categories/");

      const categoriesWithCount = res.data.map(cat => ({
        ...cat,
        product_count: Math.floor(Math.random() * 50) + 1,
      }));

      setCategories(categoriesWithCount);
      setFilteredCategories(categoriesWithCount);

    } catch (err) {
      console.error("Error fetching categories:", err);
      showMessage("❌ Failed to load categories", 'error');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------------------------------------
  // filter + sort
  // -----------------------------------------------------------------------------------------------------
  useEffect(() => {
    let result = categories.filter(cat =>
      cat.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'name') {
      result.sort((a, b) => a.category_name.localeCompare(b.category_name));
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredCategories(result);
  }, [searchTerm, sortBy, categories]);

  // -----------------------------------------------------------------------------------------------------
  // Show message
  // -----------------------------------------------------------------------------------------------------
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  // -----------------------------------------------------------------------------------------------------
  // Image handler
  // -----------------------------------------------------------------------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // -----------------------------------------------------------------------------------------------------
  // Add Category
  // -----------------------------------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append("category_name", categoryName);
      if (categoryImage) {
        formData.append("cat_image", categoryImage);
      }

      await Api.post("/categories/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCategoryName('');
      setCategoryImage(null);
      setImagePreview('');

      showMessage("🎉 Category added successfully!", 'success');
      fetchCategories();
      setActiveTab('all');

    } catch (error) {
      console.error("Error adding category:", error);
      showMessage("🚨 Error adding category", 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // -----------------------------------------------------------------------------------------------------
  // Delete Category
  // -----------------------------------------------------------------------------------------------------
  const deleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await Api.delete(`/categories/${id}/`);
      showMessage("🗑️ Category deleted successfully!", "success");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      showMessage("🚨 Error deleting category", "error");
    }
  };

  // -----------------------------------------------------------------------------------------------------
  // Update Category
  // -----------------------------------------------------------------------------------------------------
  const updateCategory = async () => {
    if (!editingCategory || !newName.trim()) return;

    try {
      await Api.put(`/categories/${editingCategory.id}/`, {
        category_name: newName,
      });

      setEditingCategory(null);
      setNewName('');

      showMessage("✨ Category updated successfully!", 'success');
      fetchCategories();

    } catch (err) {
      console.error("Error updating category:", err);
      showMessage("🚨 Error updating category", 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // -----------------------------------------------------------------------------------------------------
  // Loader UI
  // -----------------------------------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="text-lg font-medium text-gray-700">
            Loading categories...
          </span>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // Main UI
  // -----------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Category Manager
        </h1>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 justify-center">
          {[
            { key: "all", label: "All Categories", icon: Package },
            { key: "add", label: "Add New", icon: Plus },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === key
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        {activeTab === "all" && (
          <div>
            {/* Search & Sort */}
            <div className="flex justify-between mb-6">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 border rounded-xl w-64"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border rounded-xl"
              >
                <option value="newest">Newest First</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>

            {/* Category List */}
            {filteredCategories.length === 0 ? (
              <p className="text-center text-gray-500">No categories found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="border rounded-2xl p-6 bg-white shadow hover:shadow-lg transition relative"
                  >
                    {cat.cat_image ? (
                      <img
                        src={cat.cat_image}
                        alt={cat.category_name}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                        <Package className="w-10 h-10 text-gray-400" />
                      </div>
                    )}

                    <h3 className="font-bold text-xl text-gray-900 mb-2">
                      {cat.category_name}
                    </h3>

                    <p className="text-gray-500 text-sm mb-4">/{cat.slug}</p>

                    <div className="flex justify-between">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setNewName(cat.category_name);
                        }}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>

                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add New Category */}
        {activeTab === "add" && (
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Add New Category
            </h2>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl"
                placeholder="e.g. Electronics"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Category Image
              </label>
              <input type="file" onChange={handleImageChange} accept="image/*" />

              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setCategoryImage(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={formLoading || !categoryName.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              {formLoading ? "Creating..." : "Create Category"}
            </button>
          </form>
        )}
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Edit Category</h3>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl mb-4"
              placeholder="Enter new name"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setEditingCategory(null)}
                className="flex-1 border py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={updateCategory}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCategory;
