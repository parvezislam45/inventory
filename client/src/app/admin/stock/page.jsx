'use client'
import React, { useEffect, useState } from 'react';

const TotalStock = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('stock'); // 'stock', 'value', 'name'

  useEffect(() => {
    fetch('http://localhost:8000/products/brand-summary/')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Sort data based on selected option
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'stock') {
      return b.total_stock - a.total_stock;
    } else if (sortBy === 'value') {
      return b.total_tp_price - a.total_tp_price;
    } else if (sortBy === 'name') {
      const nameA = a.brand_name || a['brand__brand_name'] || '';
      const nameB = b.brand_name || b['brand__brand_name'] || '';
      return nameA.localeCompare(nameB);
    }
    return 0;
  });

  // Calculate totals
  const totalStock = data.reduce((sum, item) => sum + item.total_stock, 0);
  const totalValue = data.reduce((sum, item) => sum + item.total_tp_price, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Brand Inventory Dashboard
          </h1>
          <p className="text-gray-600">Comprehensive overview of brand-wise stock and valuation</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Brands</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Stock Units</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalStock.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Inventory Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ৳ {totalValue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Brand Details</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">Sort by:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSortBy('stock')}
                className={`px-3 py-1 text-sm rounded-md transition ${sortBy === 'stock' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Stock
              </button>
              <button
                onClick={() => setSortBy('value')}
                className={`px-3 py-1 text-sm rounded-md transition ${sortBy === 'value' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Value
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-3 py-1 text-sm rounded-md transition ${sortBy === 'name' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Name
              </button>
            </div>
          </div>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedData.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Brand Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-bold text-lg">
                      {(item.brand_name || item['brand__brand_name'] || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                    {item.brand_name || item['brand__brand_name'] || 'Unnamed Brand'}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Stock Info */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600 text-sm">Stock Units</span>
                    <span className="font-bold text-gray-900 text-lg">
                      {item.total_stock.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, (item.total_stock / Math.max(...data.map(d => d.total_stock))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600 text-sm">Inventory Value</span>
                    <span className="font-bold text-yellow-700 text-lg">
                      ৳ {item.total_tp_price.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, (item.total_tp_price / Math.max(...data.map(d => d.total_tp_price))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Avg. Unit Value</span>
                  <span className="font-semibold text-gray-900">
                    ৳ {item.total_tp_price > 0 && item.total_stock > 0 
                      ? Math.round(item.total_tp_price / item.total_stock).toLocaleString() 
                      : '0'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TotalStock;