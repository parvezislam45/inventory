'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Minus, ShoppingCart, Package, Box, Database, BarChart3 } from 'lucide-react';

export default function HarvestProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/product/');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const harvestProducts = data
          .filter((p) => p.brand_name === 'Harvest')
          .map((product) => {
            let status;
            if (product.stock === 0) status = 'Out of Stock';
            else if (product.stock < 10) status = 'Low Stock';
            else status = 'In Stock';

            return {
              ...product,
              status,
              last_updated: new Date().toISOString().split('T')[0],
              sku: `HV${product.id.toString().padStart(4, '0')}`
            };
          });
        setProducts(harvestProducts);
        setFilteredProducts(harvestProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedBrands.length > 0) filtered = filtered.filter((p) => selectedBrands.includes(p.brand_name));
    if (selectedCategories.length > 0) filtered = filtered.filter((p) => selectedCategories.includes(p.category_name));
    if (selectedStatus.length > 0) filtered = filtered.filter((p) => selectedStatus.includes(p.status));
    setFilteredProducts(filtered);
  }, [searchTerm, selectedBrands, selectedCategories, selectedStatus, products]);

  const handleQtyChange = (id, value, stock) => {
    const newValue = Math.max(0, Math.min(stock, value));
    setQuantities((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleGoToOrder = () => {
    const selected = products
      .filter((p) => quantities[p.id] > 0)
      .map((p) => ({ ...p, quantity: quantities[p.id] }));
    localStorage.setItem('selectedProducts', JSON.stringify(selected));
    router.push('/harvest/order');
  };

  const toggleFilter = (filter, type) => {
    const setters = { brand: setSelectedBrands, category: setSelectedCategories, status: setSelectedStatus };
    const state = { brand: selectedBrands, category: selectedCategories, status: selectedStatus };
    const setter = setters[type];
    const currentState = state[type];
    setter(currentState.includes(filter) ? currentState.filter((item) => item !== filter) : [...currentState, filter]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedStatus([]);
  };

  const brands = [...new Set(products.map((p) => p.brand_name))];
  const categories = [...new Set(products.map((p) => p.category_name))];
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalAmount = products.reduce((sum, p) => sum + (quantities[p.id] || 0) * p.tp_price, 0);
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter((p) => p.status === 'Out of Stock').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800 border-green-200';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Stock': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <div className="text-gray-700 font-medium">Loading inventory data...</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Golden Harvest</h1>
                <p className="text-gray-600">Golden Harvest Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts - lowStockCount - outOfStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Box className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm font-medium ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} rounded-l-lg border-r border-gray-300`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} rounded-r-lg`}
              >
                Grid
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleFilter(status, 'status')}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedStatus.includes(status)
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Brands</label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleFilter(brand, 'brand')}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedBrands.includes(brand)
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleFilter(category, 'category')}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedCategories.includes(category)
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedBrands.length > 0 || selectedCategories.length > 0 || selectedStatus.length > 0 || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 self-end"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Table / Grid */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Qty</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const qty = quantities[product.id] ?? 0;
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                              <img
                                src={product.image || '/api/placeholder/40/40'}
                                alt={product.product_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                              <div className="text-sm text-gray-500">{product.brand_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{product.tp_price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQtyChange(product.id, qty - 1, product.stock)}
                              disabled={qty === 0 || product.stock === 0}
                              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              value={qty}
                              min={0}
                              max={product.stock}
                              disabled={product.stock === 0}
                              onChange={(e) => handleQtyChange(product.id, Number(e.target.value), product.stock)}
                              className="w-12 text-center border border-gray-300 rounded py-1 text-sm"
                            />
                            <button
                              onClick={() => handleQtyChange(product.id, qty + 1, product.stock)}
                              disabled={qty >= product.stock || product.stock === 0}
                              className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const qty = quantities[product.id] ?? 0;
              return (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
                  <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <img src={product.image || '/api/placeholder/160/160'} alt={product.product_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-medium text-gray-900">{product.product_name}</h2>
                    <p className="text-sm text-gray-500">{product.brand_name}</p>
                    <p className="text-sm text-gray-900 mt-1">৳{product.tp_price}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusColor(product.status)}`}>{product.status}</span>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <button onClick={() => handleQtyChange(product.id, qty - 1, product.stock)} disabled={qty === 0 || product.stock === 0} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                      <Minus className="w-3 h-3" />
                    </button>
                    <input type="number" value={qty} min={0} max={product.stock} disabled={product.stock === 0} onChange={(e) => handleQtyChange(product.id, Number(e.target.value), product.stock)} className="w-12 text-center border border-gray-300 rounded py-1 text-sm" />
                    <button onClick={() => handleQtyChange(product.id, qty + 1, product.stock)} disabled={qty >= product.stock || product.stock === 0} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Summary */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6 flex justify-between items-center">
          <div>
            <p>Total Items: {totalItems}</p>
            <p>Total Amount: ৳{totalAmount}</p>
          </div>
          <button
            onClick={handleGoToOrder}
            disabled={totalItems === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 flex items-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Go to Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
