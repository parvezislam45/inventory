"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  Eye,
  Package,
  TrendingUp,
  DollarSign,
  Layers,
  Hash,
  Clock,
  ChevronRight,
  Archive,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  AlertTriangle,
  FileText,
  BarChart,
  Activity,
  RefreshCw,
  MoreHorizontal,
  Tag,
  Box,
  ChevronDown,
  ChevronUp,
  Printer,
  Share2,
} from "lucide-react";

export default function StockHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ show: false, type: null, id: null, date: null });
  const router = useRouter();

  useEffect(() => {
    async function fetchStockHistory() {
      try {
        const response = await fetch("http://localhost:8000/stock-history/");
        if (!response.ok) throw new Error("Failed to fetch stock history");

        const data = await response.json();

        const grouped = data.reduce((acc, item) => {
          const date = new Date(item.created_at);
          const dateStr = date.toISOString().split('T')[0];
          
          if (!acc[dateStr]) acc[dateStr] = [];
          acc[dateStr].push(item);
          return acc;
        }, {});

        const groupedArray = Object.entries(grouped).map(([date, items]) => {
          const totalValue = items.reduce((sum, item) => {
            const price = parseFloat(item.total_stock_price) || 0;
            return sum + price;
          }, 0);
          
          const totalUnits = items.reduce((sum, item) => {
            const added = parseInt(item.added_stock) || 0;
            return sum + added;
          }, 0);
          
          return {
            id: date,
            date,
            dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            displayDate: new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            items: items || [],
            totalValue,
            totalUnits,
            itemCount: items.length,
            brandCount: [...new Set(items.map(item => item.brand_name))].length,
            productCount: [...new Set(items.map(item => item.product_name))].length,
          };
        });

        groupedArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(groupedArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStockHistory();
  }, []);

  const formatCurrency = (value) => {
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatNumber = (value) => {
    const numValue = parseInt(value) || 0;
    return numValue.toLocaleString('en-US');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

// Delete an entire transaction (date challan)
const handleDeleteDateChallan = async (date) => {
  try {
    const response = await fetch(`http://localhost:8000/stock-history/${date}/delete/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || 'Failed to delete date challan');
    }

    // Remove deleted date from state
    setHistory((prev) => prev.filter((group) => group.date !== date));

    // Close modal
    setDeleteModal({ show: false, type: null, id: null, date: null });
  } catch (err) {
    alert(err.message);
  }
};

 

  const totalOverallValue = history.reduce((sum, group) => sum + (group.totalValue || 0), 0);
  const totalOverallUnits = history.reduce((sum, group) => sum + (group.totalUnits || 0), 0);
  const totalOverallItems = history.reduce((sum, group) => sum + group.itemCount, 0);

  const filteredHistory = history.filter(group => 
    group.displayDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.dayOfWeek.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.items.some(item => 
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'date') {
      aValue = new Date(a.date).getTime();
      bValue = new Date(b.date).getTime();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-lg"></div>
            <div className="absolute inset-0 border-4 border-t-gray-900 rounded-lg animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500">Loading stock history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-red-50 rounded-lg p-6 max-w- border border-red-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 bg-red-100 rounded">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Failed to load data</h3>
          </div>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200 animate-in fade-in zoom-in duration-200">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-red-50 rounded">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  {deleteModal.type === 'transaction' ? 'Delete Transaction' : 'Delete Item'}
                </h3>
              </div>
              <p className="text-xs text-gray-500 mb-5">
                {deleteModal.type === 'transaction' 
                  ? 'Are you sure you want to delete this transaction? This action cannot be undone.' 
                  : 'Are you sure you want to delete this item from the transaction?'}
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setDeleteModal({ show: false, type: null, id: null, date: null })}
                  className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
  onClick={() => {
    if (deleteModal.type === 'transaction') {
      handleDeleteDateChallan(deleteModal.id); // pass date here
    } else {
      handleDeleteItem(deleteModal.id, deleteModal.date);
    }
  }}
  className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
>
  Delete
</button>

              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-lg">
              <BarChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Stock History</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {history.length} days · {totalOverallItems} items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-100 w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {/* Export Button */}
            <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-500 mb-0.5">Total Days</p>
            <p className="text-lg font-semibold text-gray-900">{history.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-500 mb-0.5">Total Items</p>
            <p className="text-lg font-semibold text-gray-900">{formatNumber(totalOverallItems)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-500 mb-0.5">Units Added</p>
            <p className="text-lg font-semibold text-gray-900">{formatNumber(totalOverallUnits)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-500 mb-0.5">Total Value</p>
            <p className="text-lg font-semibold text-gray-900">${formatCurrency(totalOverallValue)}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-0.5">Avg. Value</p>
            <p className="text-lg font-semibold text-white">
              ${history.length ? formatCurrency(totalOverallValue / history.length) : '0'}
            </p>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th 
                    className="py-3 px-4 text-left cursor-pointer group"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Date</span>
                      {sortField === 'date' && (
                        <span className="text-gray-400">
                          {sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Products</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Brands</span>
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer group"
                    onClick={() => handleSort('totalUnits')}
                  >
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Units</span>
                      {sortField === 'totalUnits' && (
                        <span className="text-gray-400">
                          {sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer group"
                    onClick={() => handleSort('totalValue')}
                  >
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Value</span>
                      {sortField === 'totalValue' && (
                        <span className="text-gray-400">
                          {sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedHistory.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 px-4 text-center">
                      <div className="max-w-sm mx-auto">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-gray-200">
                          <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">No transactions found</p>
                        <p className="text-xs text-gray-500 mb-4">
                          {searchTerm ? 'Try adjusting your search' : 'Start adding stock to see your history'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedHistory.map((group) => (
                    <>
                      {/* Main Row */}
                      <tr key={group.date} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{group.displayDate}</span>
                            <span className="text-xs text-gray-500">{group.dayOfWeek}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm text-gray-900">{group.productCount}</span>
                            <span className="text-xs text-gray-500">items</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {group.items.slice(0, 2).map((item, idx) => (
                              <span key={idx} className="inline-flex px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                {item.brand_name}
                              </span>
                            ))}
                            {group.brandCount > 2 && (
                              <span className="inline-flex px-1.5 py-0.5 bg-gray-50 text-gray-500 text-xs rounded">
                                +{group.brandCount - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            +{formatNumber(group.totalUnits)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-semibold text-gray-900">
                            ${formatCurrency(group.totalValue)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => router.push(`/admin/chalan/${group.date}`)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ 
                                show: true, 
                                type: 'transaction', 
                                id: group.date, 
                                date: null 
                              })}
                              className="p-1 hover:bg-red-50 rounded transition-colors"
                              title="Delete Transaction"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row - Items Detail */}
                      {expandedRows[group.date] && (
                        <tr className="bg-gray-50/50 border-t border-b border-gray-100">
                          <td colSpan="8" className="py-3 px-4">
                            <div className="ml-8">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-1.5">
                                  <Box className="w-3.5 h-3.5 text-gray-500" />
                                  <span className="text-xs font-medium text-gray-700">Items Details</span>
                                </div>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{group.items.length} products</span>
                              </div>
                              
                              <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                      <th className="py-2 px-3 text-left font-medium text-gray-600">Product</th>
                                      <th className="py-2 px-3 text-left font-medium text-gray-600">Brand</th>
                                      <th className="py-2 px-3 text-left font-medium text-gray-600">Stock Movement</th>
                                      <th className="py-2 px-3 text-left font-medium text-gray-600">Unit Price</th>
                                      <th className="py-2 px-3 text-left font-medium text-gray-600">Total</th>
                                      <th className="py-2 px-3 text-right font-medium text-gray-600">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {group.items.map((item) => (
                                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-2 px-3">
                                          <div className="flex items-center gap-2">
                                            <div className="p-0.5 bg-gray-100 rounded">
                                              <Package className="w-3 h-3 text-gray-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">{item.product_name}</span>
                                          </div>
                                        </td>
                                        <td className="py-2 px-3">
                                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px]">
                                            {item.brand_name}
                                          </span>
                                        </td>
                                        <td className="py-2 px-3">
                                          <div className="flex items-center gap-2">
                                            <span className="text-gray-500">{item.last_stock}</span>
                                            <ArrowRight className="w-2.5 h-2.5 text-gray-300" />
                                            <span className="font-medium text-emerald-600 bg-emerald-50 px-1 rounded">
                                              +{item.added_stock}
                                            </span>
                                            <ArrowRight className="w-2.5 h-2.5 text-gray-300" />
                                            <span className="font-medium text-gray-900">{item.current_stock}</span>
                                          </div>
                                        </td>
                                        <td className="py-2 px-3">
                                          <span className="text-gray-900">${formatCurrency(item.tp_price)}</span>
                                        </td>
                                        <td className="py-2 px-3">
                                          <span className="font-medium text-gray-900">${formatCurrency(item.total_stock_price)}</span>
                                        </td>
                                        <td className="py-2 px-3 text-right">
                                          <button
                                            onClick={() => setDeleteModal({ 
                                              show: true, 
                                              type: 'item', 
                                              id: item.id, 
                                              date: group.date 
                                            })}
                                            className="p-1 hover:bg-red-50 rounded transition-colors"
                                          >
                                            <XCircle className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div className="flex items-center justify-end gap-4 mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Subtotal:</span>
                                  <span className="text-xs font-semibold text-gray-900">${formatCurrency(group.totalValue)}</span>
                                </div>
                                <button
                                  onClick={() => router.push(`/admin/chalan/${group.date}`)}
                                  className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors inline-flex items-center gap-1"
                                >
                                  View Full Chalan
                                  <ArrowUpRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-600">
                {selectedRows.length} of {filteredHistory.length} selected
              </span>
              {selectedRows.length > 0 && (
                <button
                  onClick={() => setDeleteModal({ 
                    show: true, 
                    type: 'transaction', 
                    id: selectedRows[0], 
                    date: null 
                  })}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Selected
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                Showing {sortedHistory.length} of {history.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600 rotate-180" />
                </button>
                <span className="px-2 py-0.5 text-xs bg-gray-900 text-white rounded">1</span>
                <span className="px-2 py-0.5 text-xs text-gray-600">2</span>
                <span className="px-2 py-0.5 text-xs text-gray-600">3</span>
                <button className="p-1 border border-gray-200 rounded bg-white hover:bg-gray-50">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Row */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded"></div>
              <span className="text-gray-600">Stock Added</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-gray-900 rounded"></div>
              <span className="text-gray-600">Current Stock</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            Last updated {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>
      </div>
    </div>
  );
}