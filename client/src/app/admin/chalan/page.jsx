"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Eye, Package, TrendingUp, DollarSign, Layers, Hash } from "lucide-react";

export default function StockHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchStockHistory() {
      try {
        const response = await fetch("http://localhost:8000/stock-history/");
        if (!response.ok) throw new Error("Failed to fetch stock history");

        const data = await response.json();

        // Group items by date (YYYY-MM-DD)
        const grouped = data.reduce((acc, item) => {
          const date = new Date(item.created_at);
          const dateStr = date.toISOString().split('T')[0]; // Get YYYY-MM-DD
          
          if (!acc[dateStr]) acc[dateStr] = [];
          acc[dateStr].push(item);
          return acc;
        }, {});

        // Convert grouped object to array with items always as array
        const groupedArray = Object.entries(grouped).map(([date, items]) => {
          // Calculate total value safely
          const totalValue = items.reduce((sum, item) => {
            const price = parseFloat(item.total_stock_price) || 0;
            return sum + price;
          }, 0);
          
          return {
            date, // Keep as YYYY-MM-DD
            displayDate: new Date(date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            items: items || [],
            totalValue: totalValue
          };
        });

        // Sort by date descending (newest first)
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading stock history...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Helper function to safely format numbers
  const formatCurrency = (value) => {
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate total value safely
  const totalOverallValue = history.reduce((sum, group) => {
    return sum + (group.totalValue || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Stock History</h1>
                <p className="text-gray-600 mt-1">Track and manage your inventory changes over time</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {history.length} {history.length === 1 ? 'Day' : 'Days'} Recorded
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
                <Hash className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{history.length}</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
                <Package className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {history.reduce((total, group) => total + (group.items?.length || 0), 0)}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
                <DollarSign className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${formatCurrency(totalOverallValue)}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <TrendingUp className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-lg font-bold text-gray-900">
                {history.length > 0 ? history[0].displayDate.split(',')[0] : 'No data'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Brands
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <Layers className="inline w-4 h-4 mr-2" />
                    Stock Details
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 px-6 text-center">
                      <div className="max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No stock history found</h3>
                        <p className="text-gray-500 mb-6">Start adding stock to see your history here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((group) => (
                    <tr key={group.date} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{group.displayDate || 'Unknown Date'}</span>
                          <span className="text-xs text-gray-500 mt-1">
                            {(group.items?.length || 0)} {(group.items?.length || 0) === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="space-y-2 max-w-xs">
                          {(group.items || []).map((item, index) => (
                            <div key={item.id || index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-900">
                                {item.product_name || "Unnamed Product"}
                              </span>
                              {index < (group.items?.length || 0) - 1 && (
                                <div className="w-px h-4 bg-gray-200 mx-2"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="space-y-2">
                          {(group.items || []).map((item, index) => (
                            <div key={item.id || index} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                              {item.brand_name || "No Brand"}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="space-y-3">
                          {(group.items || []).map((item, index) => (
                            <div key={item.id || index} className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">Previous</div>
                                <div className="font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded">
                                  {item.last_stock || "0"}
                                </div>
                              </div>
                              <div className="text-gray-400">→</div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">Added</div>
                                <div className={`font-medium px-2 py-1 rounded ${(item.added_stock || 0) > 0 ? 'text-green-700 bg-green-50' : 'text-gray-900 bg-gray-50'}`}>
                                  +{(item.added_stock || "0")}
                                </div>
                              </div>
                              <div className="text-gray-400">=</div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">Current</div>
                                <div className="font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                                  {item.current_stock || "0"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="space-y-3">
                          {(group.items || []).map((item, index) => (
                            <div key={item.id || index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Unit Price:</span>
                                <span className="font-medium text-gray-900">
                                  ${formatCurrency(item.tp_price)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total Value:</span>
                                <span className="font-semibold text-blue-700">
                                  ${formatCurrency(item.total_stock_price)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => router.push(`/admin/chalan/${group.date}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <div className="text-xs text-gray-500 text-center">
                            Total: ${formatCurrency(group.totalValue)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Active Items</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Stock Added</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            Showing {history.length} of {history.length} transaction days
          </div>
        </div>
      </div>
    </div>
  );
}