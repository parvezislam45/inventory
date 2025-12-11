'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderPage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('selectedProducts');
    if (saved) setSelectedProducts(JSON.parse(saved));

    fetch('http://127.0.0.1:8000/shops/')
      .then(res => res.json())
      .then((data) => setShops(data));
  }, []);

  // Calculate subtotal
  const subtotal = selectedProducts.reduce((sum, p) => sum + p.tp_price * p.quantity, 0);

  // Calculate discount for all products based on selected discount type
  const discountAmount = (() => {
    if (!selectedShop || !selectedDiscount) return 0;

    const discountPercent =
      selectedDiscount === 'discount_kazi'
        ? selectedShop.discount_kazi
        : selectedShop.discount_harvest;

    return (subtotal * discountPercent) / 100;
  })();

  const finalTotal = subtotal - discountAmount;

  const placeOrder = async () => {
    if (!selectedShop || !selectedDiscount) {
      alert('Please select shop and discount type');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const payload = {
        shop_id: selectedShop.id,
        discount_type: selectedDiscount,
        items: selectedProducts.map(p => ({
          product_id: p.id,
          quantity: p.quantity,
        })),
      };

      const res = await fetch('http://127.0.0.1:8000/invoice/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem('selectedProducts');
        router.push(`/kazi/invoices/${data.id}`);
      } else {
        alert(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const removeProduct = (id) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Order Summary
          </h1>
          <p className="text-gray-600 text-lg">Complete your purchase with confidence</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Selection Section */}
          <div className="p-8 border-b border-gray-100">
            {/* Shop Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                🏪 Select Shop
              </label>
              <div className="relative max-w-md">
                <button
                  onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 flex items-center justify-between"
                >
                  <span className={selectedShop ? "text-gray-900 font-medium" : "text-gray-500"}>
                    {selectedShop ? selectedShop.shop_name : "Choose a shop"}
                  </span>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${isShopDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isShopDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-10 max-h-60 overflow-y-auto">
                    {shops.map(shop => (
                      <button
                        key={shop.id}
                        onClick={() => {
                          setSelectedShop(shop);
                          setIsShopDropdownOpen(false);
                          setSelectedDiscount('');
                        }}
                        className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{shop.shop_name}</div>
                        <div className="text-sm text-gray-600 mt-1">{shop.address}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Discount Selection */}
            {selectedShop && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  💰 Select Discount
                </label>
                <div className="relative max-w-md">
                  <button
                    onClick={() => setIsDiscountDropdownOpen(!isDiscountDropdownOpen)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 flex items-center justify-between"
                  >
                    <span className={selectedDiscount ? "text-gray-900 font-medium" : "text-gray-500"}>
                      {selectedDiscount ? ` (${selectedShop.discount_kazi}%)` : "Choose Discount"}
                    </span>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDiscountDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDiscountDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-10">
                      <button
                        onClick={() => {
                          setSelectedDiscount('discount_kazi');
                          setIsDiscountDropdownOpen(false);
                        }}
                        className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors rounded-2xl"
                      >
                        <div className="text-sm text-gray-600 mt-1">{selectedShop.discount_kazi}% off</div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="p-8 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Order Items ({selectedProducts.length})
            </h3>
            
            {selectedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No products selected</p>
                <p className="text-gray-400 text-sm mt-2">Add products to continue</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedProducts.map((p, index) => (
                  <div 
                    key={p.id} 
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-sm font-bold text-blue-600">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{p.product_name}</h4>
                        <p className="text-sm text-gray-600">{p.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">
                          ${(p.tp_price * p.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${p.tp_price.toFixed(2)} × {p.quantity}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeProduct(p.id)}
                        className="opacity-0 group-hover:opacity-100 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Order Summary
            </h3>
            
            <div className="space-y-4 bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-y border-gray-100">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-green-600">-${discountAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 mt-2">
                <span className="text-xl font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-8 bg-white">
            <button
              onClick={placeOrder}
              disabled={!selectedShop || !selectedDiscount || isPlacingOrder || selectedProducts.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 rounded-2xl text-white font-bold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
            >
              {isPlacingOrder ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Order...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confirm Order • ${finalTotal.toFixed(2)}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}