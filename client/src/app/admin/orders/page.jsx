"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Update Modal Component
const UpdateModal = ({ isOpen, onClose, item, onUpdate }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item) {
      onUpdate(item.id, quantity);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Update Item Quantity</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={item.product.image}
              alt={item.product.product_name}
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMkMyMi4yMDkxIDIyIDI0IDIwLjIwOTEgMjQgMThDMjQgMTUuNzkwOSAyMi4yMDkxIDE0IDIwIDE0QzE3Ljc5MDkgMTQgMTYgMTUuNzkwOSAxNiAxOEMxNiAyMC4yMDkxIDE3Ljc5MDkgMjIgMjAgMjJaTTIwIDI0QzE2LjEzIDI0IDEyIDI1Ljc5IDEyIDMwSDI4QzI4IDI1Ljc5IDIzLjg3IDI0IDIwIDI0WiIgZmlsbD0iIzlDQTBBQiIvPgo8L3N2Zz4=';
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{item.product.product_name}</h3>
              <p className="text-sm text-gray-600">{item.product.brand_name}</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="text-green-600 font-semibold">
              TP: ৳{Number(item.product.tp_price).toFixed(2)}
            </span>
            <span className="text-gray-400 line-through">
              MRP: ৳{Number(item.product.mrp_price).toFixed(2)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <button
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Update Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  invoice,
  loading,
}) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Delete Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Warning: This action cannot be undone</h3>
                <p className="text-sm text-red-600 mt-1">
                  All items and data associated with this invoice will be permanently deleted.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Invoice Details:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Invoice Number:</span>
                <span className="font-semibold">{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Shop:</span>
                <span className="font-semibold">{invoice.shop.shop_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold text-green-600">৳{Number(invoice.final_total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Items:</span>
                <span className="font-semibold">{invoice.items.length} products</span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="font-semibold">
                  {new Date(invoice.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2" />
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Invoice
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Table Row Component
const InvoiceTableRow = ({
  invoice,
  onUpdateItem,
  onDeleteItem,
  onDeleteInvoice,
  onViewInvoice,
  updating,
  deleting,
  deletingInvoice,
}) => {
  // Calculate values from current items
  const totalItems = invoice.items.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueProducts = invoice.items.length;
  
  const calculatedSubtotal = invoice.items.reduce((sum, item) => {
    return sum + (Number(item.product.tp_price) * item.quantity);
  }, 0);
  
  const calculatedFinalTotal = invoice.items.reduce((sum, item) => {
    return sum + Number(item.final_price);
  }, 0);
  
  const calculatedDiscountAmount = calculatedSubtotal - calculatedFinalTotal;
  const calculatedDiscountPercent = calculatedSubtotal > 0 
    ? ((calculatedDiscountAmount / calculatedSubtotal) * 100).toFixed(1)
    : "0.0";

  const formatCurrency = (value) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  const formatDisplayDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getBrandBadge = (items) => {
    if (items.length === 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
          <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
          No Items
        </span>
      );
    }

    const brandCounts = {};
    
    items.forEach(item => {
      const brand = item.product.brand_name;
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
    
    const dominantBrand = Object.keys(brandCounts).reduce((a, b) => 
      brandCounts[a] > brandCounts[b] ? a : b
    );

    const isMixed = Object.keys(brandCounts).length > 1;

    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm border";
    
    if (dominantBrand.toLowerCase().includes('kazi')) {
      return (
        <span className={`${baseClass} bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200`}>
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          {isMixed ? `Mixed (${dominantBrand})` : dominantBrand}
        </span>
      );
    } else if (dominantBrand.toLowerCase().includes('harvest')) {
      return (
        <span className={`${baseClass} bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200`}>
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          {isMixed ? `Mixed (${dominantBrand})` : dominantBrand}
        </span>
      );
    } else {
      return (
        <span className={`${baseClass} bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200`}>
          <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
          {dominantBrand}
        </span>
      );
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors duration-150">
      {/* Invoice Number */}
      <td className="py-4 px-4">
        <div >
            <div className="text-sm font-medium text-gray-900">{formatDisplayDate(invoice.created_at)}</div>
          </div>
      </td>
      <td className="py-4 px-4">
        <div >
          <div className="text-sm font-medium text-gray-900">{invoice.invoice_number}</div>
          </div>
      </td>


      {/* Shop */}
      <td className="py-4 px-4">
        <div className="text-sm text-gray-900">{invoice.shop.shop_name}</div>
      </td>
      <td className="py-4 px-4">
        <div className="text-sm text-gray-600">{getBrandBadge(invoice.items)}</div>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          invoice.is_delivered
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {invoice.is_delivered ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Delivered
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Pending
            </>
          )}
        </span>
      </td>

      {/* Amount */}
      <td className="py-4 px-4">
        <div className="text-right">
          <div className="font-bold text-lg text-green-600">
            ৳{formatCurrency(calculatedFinalTotal)}
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewInvoice(invoice)}
            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
            title="View Details"
          >
            View
          </button>
          
          <button
            onClick={() => onDeleteInvoice(invoice.id)}
            disabled={deletingInvoice === invoice.id}
            className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center gap-1"
            title="Delete Invoice"
          >
            {deletingInvoice === invoice.id ? (
              <>
                Deleting
              </>
            ) : (
              <>
                
                Delete
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function OrdersPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchShop, setSearchShop] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [searchDate, setSearchDate] = useState("");
  
  // Modal states
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deletingInvoice, setDeletingInvoice] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://127.0.0.1:8000/invoices/");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.status}`);
      }
      
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err instanceof Error ? err.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update item quantity - CORRECTED VERSION
  const handleUpdateItem = async (itemId, quantity) => {
    if (!selectedItem) return;

    try {
      setUpdating(true);
      
      const response = await fetch(`http://127.0.0.1:8000/order-items/${itemId}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.status}`);
      }

      // Refetch invoices to ensure data consistency
      await fetchInvoices();

      setUpdateModalOpen(false);
      setSelectedItem(null);
      
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Failed to update item quantity");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Delete item - FIXED VERSION
  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to remove this item from the invoice?")) {
      return;
    }

    try {
      setDeleting(itemId);
      
      const response = await fetch(`http://127.0.0.1:8000/order-items/${itemId}/remove/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.status}`);
      }

      const updatedInvoice = await response.json();
      
      // Update the specific invoice with properly formatted data
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
          invoice.id === updatedInvoice.id 
            ? {
                ...invoice, // Keep the original invoice structure
                subtotal: String(updatedInvoice.subtotal || 0),
                discount_amount: String(updatedInvoice.discount_amount || 0),
                discount_percent: String(updatedInvoice.discount_percent || 0),
                final_total: String(updatedInvoice.final_total || 0),
                items: updatedInvoice.items.map((item) => ({
                  ...item,
                  total_price: String(item.total_price || 0),
                  discount_amount: String(item.discount_amount || 0),
                  final_price: String(item.final_price || 0),
                }))
              }
            : invoice
        )
      );
      
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item");
      
      // Refetch invoices on error to ensure UI consistency
      await fetchInvoices();
    } finally {
      setDeleting(null);
    }
  };

  // ✅ Delete invoice
  const handleDeleteInvoice = async (invoiceId) => {
    try {
      setDeletingInvoice(invoiceId);
      
      const response = await fetch(`http://127.0.0.1:8000/invoices/${invoiceId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete invoice: ${response.status}`);
      }

      // Remove the invoice from the local state
      setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== invoiceId));
      
      // Close the modal
      setDeleteModalOpen(false);
      setInvoiceToDelete(null);
      
    } catch (err) {
      console.error("Error deleting invoice:", err);
      alert("Failed to delete invoice");
    } finally {
      setDeletingInvoice(null);
    }
  };

  // ✅ Open delete confirmation modal
  const openDeleteModal = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setInvoiceToDelete(invoice);
      setDeleteModalOpen(true);
    }
  };

  // ✅ Open update modal
  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  // ✅ Navigate to brand-specific invoice page
  const handleViewInvoice = (invoice) => {
    router.push(`/admin/invoices/${invoice.id}`);
  };

  // ✅ Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const shopMatch = searchShop.trim() === "" ||
      invoice.shop.shop_name.toLowerCase().includes(searchShop.toLowerCase());

    const brandMatch = searchBrand.trim() === "" ||
      invoice.items.some((item) =>
        item.product.brand_name.toLowerCase().includes(searchBrand.toLowerCase())
      );

    const dateMatch = (() => {
      if (searchDate.trim() === "") return true;
      if (!invoice.created_at) return false;
      
      try {
        const invoiceDate = new Date(invoice.created_at);
        const searchDateObj = new Date(searchDate);
        
        const invoiceDateStr = invoiceDate.toLocaleDateString('en-CA');
        const searchDateStr = searchDateObj.toLocaleDateString('en-CA');
        
        return invoiceDateStr === searchDateStr;
      } catch (error) {
        console.error("Date parsing error:", error);
        return false;
      }
    })();

    return shopMatch && brandMatch && dateMatch;
  });

  // ✅ Clear all filters
  const clearFilters = () => {
    setSearchShop("");
    setSearchBrand("");
    setSearchDate("");
  };

  // ✅ Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              <div className="h-12 bg-gray-200"></div>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 border-b border-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Invoices</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Management</h1>
              <p className="text-gray-600">Manage and track all your invoices in one place</p>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600">
                Total: <span className="font-semibold text-gray-900">{invoices.length}</span> • 
                Showing: <span className="font-semibold text-blue-600">{filteredInvoices.length}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Invoices</p>
                  <p className="text-3xl font-bold mt-2">{invoices.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Delivered</p>
                  <p className="text-3xl font-bold mt-2">
                    {invoices.filter(inv => inv.is_delivered).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold mt-2">
                    {invoices.filter(inv => !inv.is_delivered).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search by Shop
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter shop name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                  value={searchShop}
                  onChange={(e) => setSearchShop(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search by Brand
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter brand name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Date
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Clear Filters Button */}
          {(searchShop || searchBrand || searchDate) && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-semibold text-gray-700">
                  <th className="py-4 px-4 w-48">Date</th>
                  <th className="py-4 px-4 w-50">Invoice No</th>
                  <th className="py-4 px-4 w-44">Shop</th>
                  <th className="py-4 px-4 w-32">Brand</th>
                  <th className="py-4 px-4 w-28">Status</th>
                  <th className="py-4 px-4 32">Amount</th>
                  <th className="py-4 px-4 w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {invoices.length === 0 ? "No invoices found" : "No invoices match your filters"}
                        </h3>
                        <p className="text-gray-600 mb-4 max-w-sm">
                          {invoices.length === 0 
                            ? "Get started by creating your first invoice." 
                            : "Try adjusting your search criteria or clear the filters."}
                        </p>
                        {invoices.length > 0 && (
                          <button
                            onClick={clearFilters}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                          >
                            Clear filters to see all {invoices.length} invoices
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <InvoiceTableRow
                      key={invoice.id}
                      invoice={invoice}
                      onUpdateItem={openUpdateModal}
                      onDeleteItem={handleDeleteItem}
                      onDeleteInvoice={openDeleteModal}
                      onViewInvoice={handleViewInvoice}
                      updating={updating}
                      deleting={deleting}
                      deletingInvoice={deletingInvoice}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredInvoices.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredInvoices.length}</span> of{" "}
                  <span className="font-semibold">{invoices.length}</span> invoices
                </div>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-green-600">
                    ৳{filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.final_total || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      <UpdateModal
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onUpdate={handleUpdateItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setInvoiceToDelete(null);
        }}
        onConfirm={() => invoiceToDelete && handleDeleteInvoice(invoiceToDelete.id)}
        invoice={invoiceToDelete}
        loading={deletingInvoice !== null}
      />
    </div>
  );
}