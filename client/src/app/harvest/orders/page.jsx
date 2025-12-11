'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load shops only on mount
    fetch('http://127.0.0.1:8000/shops/')
      .then(res => res.json())
      .then(setShops);
  }, []);

  const handleShopChange = async (shopId) => {
    setSelectedShop(shopId);
    setLoading(true);

    try {
      if (shopId) {
        const res = await fetch(`http://127.0.0.1:8000/shops/${shopId}/invoices/`);
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        const ordersData = await res.json();
        setOrders(ordersData);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Harvest Orders Management</h1>
          <p className="text-gray-600">View and manage all Harvest brand orders</p>
        </div>

        {/* Shop Filter Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Filter Orders</h2>
              <p className="text-sm text-gray-600">Select a shop to view their orders</p>
            </div>
            <div className="w-64">
              <select
                value={selectedShop || ''}
                onChange={(e) => handleShopChange(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 shadow-sm"
              >
                <option value="">Select a shop</option>
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>
                    {shop.shop_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Default State */}
        {!selectedShop && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Shop Selected</h3>
              <p className="text-gray-600 mb-6">
                Please select a shop from the dropdown above to view their Harvest brand orders.
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Orders</h3>
              <p className="text-gray-600">Fetching order data for the selected shop...</p>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && selectedShop && (
          <div>
            {/* Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {shops.find(s => s.id === selectedShop)?.shop_name} - Harvest Orders
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {orders.filter(order => order.items?.some(item => item.brand === "Harvest")).length} invoices found
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Harvest Orders Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ৳{orders
                      .reduce((total, order) => {
                        const harvestItems = order.items?.filter(item => item.brand === "Harvest") || [];
                        return total + harvestItems.reduce((sum, item) => sum + Number(item.final_price), 0);
                      }, 0)
                      .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="grid gap-6">
              {orders.map(order => {
                const harvestItems = order.items?.filter(item => item.brand === "Harvest") || [];
                if (harvestItems.length === 0) return null;
                const harvestTotal = harvestItems.reduce((sum, item) => sum + item.final_price, 0);

                return (
                  <div 
                    key={order.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{order.invoice_number}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              order.is_delivered ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {order.is_delivered ? 'Delivered' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            Created: {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <div className="text-right ml-6">
                          <p className="text-2xl font-bold text-gray-900 mb-2">
                            ৳{Number(harvestTotal).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          </p>
                          <button
                            onClick={() => router.push(`/harvest/invoices/${order.id}`)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            View Invoice
                          </button>
                        </div>
                      </div>

                      {/* Harvest Products */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Harvest Products ({harvestItems.length})</h4>
                        <div className="grid gap-3">
                          {harvestItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                  <span>Quantity: {item.quantity}</span>
                                  <span>×</span>
                                  <span>TP: ৳{item.tp_price}</span>
                                  {item.tp_price * item.quantity !== item.final_price && (
                                    <span className="text-orange-600 font-medium">
                                      After discount: ৳{item.final_price}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  ৳{(item.tp_price * item.quantity).toLocaleString()}
                                </p>
                                {item.tp_price * item.quantity !== item.final_price && (
                                  <p className="text-sm text-green-600 font-medium">
                                    Final: ৳{item.final_price.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State for Selected Shop */}
            {orders.filter(order => order.items?.some(item => item.brand === "Harvest")).length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Harvest Orders Found</h3>
                  <p className="text-gray-600">
                    No Harvest brand orders found for {shops.find(s => s.id === selectedShop)?.shop_name}.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
