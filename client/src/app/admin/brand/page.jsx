"use client";

import { useState, useEffect } from "react";

export default function BrandManagementPage() {
  const [brandName, setBrandName] = useState("");
  const [brands, setBrands] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);

  const baseURL = "http://127.0.0.1:8000/brand/";

  // ✅ Fetch brands
  const fetchBrands = async () => {
    try {
      const res = await fetch(baseURL);
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load brands");
    }
  };

  // ✅ Add or update brand
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const url = editId ? `${baseURL}${editId}/` : baseURL;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_name: brandName }),
      });

      if (!res.ok) throw new Error("Failed to save brand");

      setBrandName("");
      setEditId(null);
      setSuccessMessage(editId ? "✅ Brand updated successfully!" : "✅ Brand added successfully!");
      fetchBrands();

      // Auto-clear success message
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Error saving brand");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete brand
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await fetch(`${baseURL}${id}/`, { method: "DELETE" });
      setSuccessMessage("✅ Brand deleted successfully!");
      fetchBrands();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Error deleting brand");
    }
  };

  // ✅ Edit brand (set data in form)
  const handleEdit = (brand) => {
    setEditId(brand.id);
    setBrandName(brand.brand_name);
    setActiveTab("add");
  };

  // ✅ Cancel edit
  const handleCancelEdit = () => {
    setEditId(null);
    setBrandName("");
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (activeTab === "delete") {
      fetchBrands();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Brand Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your brand portfolio with ease. Add new brands or update existing ones.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* 🔄 Premium Tab Navigation */}
          <div className="flex bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6">
            {["add", "delete"].map((tab) => (
              <button
                key={tab}
                className={`relative py-5 px-6 font-semibold text-lg transition-all duration-300 ${
                  activeTab === tab
                    ? "text-blue-600 bg-white shadow-sm border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setEditId(null);
                  setBrandName("");
                }}
              >
                {tab === "add" ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Brand
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Manage Brands
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* ✅ Status Messages */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-green-800 font-medium">{successMessage}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-in">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            )}

            {/* 🧩 Add/Edit Brand Form */}
            {activeTab === "add" ? (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {editId ? "Update Brand" : "Add New Brand"}
                  </h2>
                  <p className="text-gray-600">
                    {editId
                      ? "Modify the brand name and save your changes."
                      : "Create a new brand"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="group">
                    <label
                      htmlFor="brandName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Brand Name
                    </label>
                    <div className="relative">
                      <input
                        id="brandName"
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                        placeholder="Enter brand name (e.g., Nike, Apple, Samsung)"
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 group-hover:border-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading || !brandName.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-3 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {loading
                        ? editId
                          ? "Updating..."
                          : "Adding..."
                        : editId
                        ? "Update Brand"
                        : "Add Brand"}
                    </button>

                    {editId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 focus:outline-none focus:ring-3 focus:ring-gray-500/20 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              // 🗑️ Manage Brands List
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Manage Brands
                  </h2>
                  <p className="text-gray-600">View, edit, or delete existing brands.</p>
                </div>

                {brands.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No brands found
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Get started by adding your first brand using the Add Brand tab.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {brands.map((brand) => (
                      <div
                        key={brand.id}
                        className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-bold text-lg">
                                {brand.brand_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                {brand.brand_name}
                              </h3>
                              <p className="text-sm text-gray-500">ID: {brand.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => handleEdit(brand)}
                              className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(brand.id)}
                              className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{brands.length}</div>
              <div className="text-sm text-gray-600">Total Brands</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {brands.filter((b) => b.brand_name.length > 0).length}
              </div>
              <div className="text-sm text-gray-600">Active Brands</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
