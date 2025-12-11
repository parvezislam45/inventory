"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/invoices/${invoiceId}/`);

      if (!response.ok) {
        throw new Error("Failed to fetch invoice");
      }

      const data = await response.json();
      setInvoice(data);
    } catch (err) {
      setError(err.message || "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  const getUniqueBrands = () => {
    if (!invoice) return [];
    const brands = new Set(invoice.items.map(item => item.product.brand_name));
    return Array.from(brands);
  };

  const getFilteredItems = () => {
    if (!invoice) return [];
    if (selectedBrand === "all") return invoice.items;
    return invoice.items.filter(item => item.product.brand_name === selectedBrand);
  };

  const getBrandSummary = (brand) => {
    if (!invoice) return { count: 0, total: 0 };
    const brandItems = invoice.items.filter(item => item.product.brand_name === brand);
    const count = brandItems.length;
    const total = brandItems.reduce((sum, item) => sum + Number(item.final_price), 0);
    return { count, total };
  };

  const navigateToBrandInvoice = (brand) => {
    if (!invoice) return;
    const brandLower = brand.toLowerCase();
    if (brandLower.includes("harvest")) {
      router.push(`/admin/harvest/${invoice.id}`);
    } else if (brandLower.includes("kazi")) {
      router.push(`/admin/kazi/${invoice.id}`);
    } else {
      setSelectedBrand(brand);
    }
  };

  const handleUpdateItem = async (itemId, quantity) => {
    try {
      setUpdating(true);
      const response = await fetch(`http://127.0.0.1:8000/order-items/${itemId}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      await fetchInvoice();
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Failed to update item quantity");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    try {
      setDeleting(itemId);
      const response = await fetch(`http://127.0.0.1:8000/order-items/${itemId}/remove/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      await fetchInvoice();
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item");
    } finally {
      setDeleting(null);
    }
  };

  const openUpdateModal = (item) => {
    const newQuantity = prompt(`Update quantity for ${item.product.product_name}:`, item.quantity.toString());
    if (newQuantity && !isNaN(parseInt(newQuantity)) && parseInt(newQuantity) > 0) {
      handleUpdateItem(item.id, parseInt(newQuantity));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-xl w-64 mb-6"></div>
            <div className="h-32 bg-gray-100 rounded-2xl mb-6"></div>
            <div className="h-64 bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center border border-gray-200 shadow-lg">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Invoice</h3>
          <p className="text-gray-600 mb-6">{error || "Invoice not found"}</p>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const uniqueBrands = getUniqueBrands();
  const filteredItems = getFilteredItems();
  const totalItems = invoice.items.length;
  const totalValue = Number(invoice.final_total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{invoice.invoice_number}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium border border-blue-200">
                  {invoice.shop.shop_name}
                </span>
                <span className="text-gray-400">•</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">
                  {new Date(invoice.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                    invoice.is_delivered
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {invoice.is_delivered ? "✓ Delivered" : "⏳ Pending"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 min-w-[180px] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-2xl font-bold text-gray-900 mb-1">৳{totalValue.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 min-w-[180px] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-2xl font-bold text-gray-900 mb-1">{totalItems}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 min-w-[180px] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-2xl font-bold text-gray-900 mb-1">{uniqueBrands.length}</div>
              <div className="text-sm text-gray-600">Brands</div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Brand Filter & Summary */}
          <div className="xl:col-span-1 space-y-6">
            {/* Brand Filter */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Brands</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedBrand("all")}
                  className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 text-left border ${
                    selectedBrand === "all"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 border-transparent"
                      : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>All Brands</span>
                    <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">
                      {totalItems}
                    </span>
                  </div>
                </button>
                
                {uniqueBrands.map((brand) => {
                  const summary = getBrandSummary(brand);
                  const isKazi = brand.toLowerCase().includes("kazi");
                  const isHarvest = brand.toLowerCase().includes("harvest");
                  
                  let brandColors = "from-purple-500 to-purple-600 shadow-purple-500/25";
                  if (isKazi) brandColors = "from-blue-500 to-blue-600 shadow-blue-500/25";
                  if (isHarvest) brandColors = "from-emerald-500 to-emerald-600 shadow-emerald-500/25";
                  
                  return (
                    <button
                      key={brand}
                      onClick={() => navigateToBrandInvoice(brand)}
                      className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 text-left border ${
                        selectedBrand === brand
                          ? `bg-gradient-to-r ${brandColors} text-white shadow-lg border-transparent`
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">{brand}</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">
                            {summary.count}
                          </span>
                          <span className="text-sm opacity-75">
                            ৳{summary.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold">৳{Number(invoice.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-red-600 font-semibold">
                    -৳{Number(invoice.discount_amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Final Total</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ৳{Number(invoice.final_total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Items List */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedBrand === "all" ? "All Items" : `${selectedBrand} Items`}
                    <span className="text-gray-600 text-lg ml-2">({filteredItems.length})</span>
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Click brand to filter</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="group">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:bg-blue-50/50 hover:shadow-md">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="font-bold text-gray-900 text-lg group-hover:text-gray-800 transition-colors">
                                {item.product.product_name}
                              </h3>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium border border-blue-200">
                                {item.product.brand_name}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="font-semibold text-gray-700">Quantity: {item.quantity}</span>
                              <span>•</span>
                              <span>Unit: ৳{Number(item.tp_price || item.product.tp_price).toFixed(2)}</span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className="text-gray-500 text-sm line-through">
                                ৳{Number(item.quantity * (item.tp_price || item.product.tp_price)).toFixed(2)}
                              </span>
                              <span className="text-lg font-bold text-emerald-600">
                                ৳{Number(item.final_price).toFixed(2)}
                              </span>
                              {item.discount_amount > 0 && (
                                <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200">
                                  -৳{Number(item.discount_amount).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-3">
                          <button
                            onClick={() => openUpdateModal(item)}
                            disabled={updating}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 font-semibold text-sm min-w-[90px]"
                          >
                            {updating ? "Updating..." : "Update"}
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={deleting === item.id}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 font-semibold text-sm min-w-[90px]"
                          >
                            {deleting === item.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No items found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      No items match the selected brand filter. Try selecting a different brand or view all items.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}