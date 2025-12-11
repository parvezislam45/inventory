'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Minus, ShoppingCart, Package, Box, Database, BarChart3 } from 'lucide-react';

export default function KaziProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching products from API...');
        
        const response = await fetch('http://127.0.0.1:8000/product/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // Check if data is an array
        if (!Array.isArray(data)) {
          throw new Error('API response is not an array');
        }

        // Filter Kazi products and handle potential missing fields
        const kaziProducts = data
          .filter(p => p.brand_name && p.brand_name.toLowerCase().includes('kazi'))
          .map(product => {
            let status;
            const stock = product.stock || 0;
            
            if (stock === 0) status = 'Out of Stock';
            else if (stock < 10) status = 'Low Stock';
            else status = 'In Stock';
            
            return {
              id: product.id,
              product_name: product.product_name || 'Unknown Product',
              description: product.description || '',
              mrp_price: product.mrp_price || 0,
              tp_price: product.tp_price || 0,
              stock: stock,
              category_name: product.category_name || 'Uncategorized',
              brand_name: product.brand_name || 'Unknown Brand',
              image: product.image || '',
              status,
              last_updated: new Date().toISOString().split('T')[0],
              sku: `KZ${product.id.toString().padStart(4, '0')}`,
            };
          });
        
        console.log('Processed Kazi Products:', kaziProducts);
        setProducts(kaziProducts);
        setFilteredProducts(kaziProducts);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
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
      filtered = filtered.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand_name));
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category_name));
    }
    
    if (selectedStatus.length > 0) {
      filtered = filtered.filter(product => selectedStatus.includes(product.status));
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedBrands, selectedCategories, selectedStatus, products]);

  const handleQtyChange = (id, value, stock) => {
    const newValue = Math.max(0, Math.min(stock, value));
    setQuantities(prev => ({ ...prev, [id]: newValue }));
  };

  const handleGoToOrder = () => {
    const selected = products
      .filter(p => quantities[p.id] > 0)
      .map(p => ({ ...p, quantity: quantities[p.id] }));
    localStorage.setItem('selectedProducts', JSON.stringify(selected));
    router.push('/kazi/order');
  };

  const toggleFilter = (filter, type) => {
    const setters = {
      brand: setSelectedBrands,
      category: setSelectedCategories,
      status: setSelectedStatus,
    };
    const state = {
      brand: selectedBrands,
      category: selectedCategories,
      status: selectedStatus,
    };
    const setter = setters[type];
    const currentState = state[type];
    setter(prev => prev.includes(filter) ? prev.filter(item => item !== filter) : [...prev, filter]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedStatus([]);
  };

  const brands = [...new Set(products.map(p => p.brand_name))];
  const categories = [...new Set(products.map(p => p.category_name))];
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalAmount = products.reduce((sum, p) => sum + (quantities[p.id] || 0) * p.mrp_price, 0);
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;

  const getStatusColor = status => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800 border-green-200';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Stock': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Add table and grid view components
  const TableView = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Quantity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      {product.image ? (
                        <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.product_name} />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-black">{product.product_name}</div>
                      <div className="text-sm text-gray-500">{product.category_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="text-black font-medium">৳{product.mrp_price}</div>
                  <div className="text-gray-500 text-xs">TP: ৳{product.tp_price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQtyChange(product.id, (quantities[product.id] || 0) - 1, product.stock)}
                      disabled={(quantities[product.id] || 0) <= 0}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      max={product.stock}
                      value={quantities[product.id] || 0}
                      onChange={(e) => handleQtyChange(product.id, parseInt(e.target.value) || 0, product.stock)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center text-black"
                    />
                    <button
                      onClick={() => handleQtyChange(product.id, (quantities[product.id] || 0) + 1, product.stock)}
                      disabled={(quantities[product.id] || 0) >= product.stock}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {filteredProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-3">
              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                {product.image ? (
                  <img className="w-full h-32 rounded-lg object-cover" src={product.image} alt={product.product_name} />
                ) : (
                  <Package className="h-12 w-12 text-gray-400" />
                )}
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-black mb-1 line-clamp-2">{product.product_name}</h3>
              <p className="text-xs text-gray-500 mb-2">{product.category_name}</p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-black">৳{product.mrp_price}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
              
              <p className="text-xs text-gray-500 mb-3">Stock: {product.stock}</p>
            </div>
            
            <div className="flex items-center space-x-2 mt-auto">
              <button
                onClick={() => handleQtyChange(product.id, (quantities[product.id] || 0) - 1, product.stock)}
                disabled={(quantities[product.id] || 0) <= 0}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <Minus className="w-3 h-3" />
              </button>
              <input
                type="number"
                min="0"
                max={product.stock}
                value={quantities[product.id] || 0}
                onChange={(e) => handleQtyChange(product.id, parseInt(e.target.value) || 0, product.stock)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-center text-black text-sm"
              />
              <button
                onClick={() => handleQtyChange(product.id, (quantities[product.id] || 0) + 1, product.stock)}
                disabled={(quantities[product.id] || 0) >= product.stock}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            <div className="text-black font-medium">Loading inventory data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-black mb-2">Error Loading Products</h3>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Mollah Mart</h1>
                <p className="text-black">Kazi Products ({products.length} products found)</p>
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
                <p className="text-sm font-medium text-black">Total Products</p>
                <p className="text-2xl font-bold text-black">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">In Stock</p>
                <p className="text-2xl font-bold text-black">{totalProducts - lowStockCount - outOfStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Box className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Low Stock</p>
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
                <p className="text-sm font-medium text-black">Out of Stock</p>
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
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'table' ? 'bg-purple-600 text-white' : 'bg-white text-black hover:bg-gray-50'
                } rounded-l-lg border-r border-gray-300`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-black hover:bg-gray-50'
                } rounded-r-lg`}
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
                <label className="text-sm font-medium text-black mb-2 block">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => toggleFilter(status, 'status')}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedStatus.includes(status)
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              {brands.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-black mb-2 block">Brands</label>
                  <div className="flex flex-wrap gap-2">
                    {brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => toggleFilter(brand, 'brand')}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          selectedBrands.includes(brand)
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Filter */}
              {categories.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-black mb-2 block">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => toggleFilter(category, 'category')}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          selectedCategories.includes(category)
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(selectedBrands.length > 0 || selectedCategories.length > 0 || selectedStatus.length > 0 || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-black hover:text-purple-800 self-end font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {products.length === 0 
                ? "No Kazi products available in the inventory." 
                : "No products match your current filters."}
            </p>
            {products.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
            
            {viewMode === 'table' ? <TableView /> : <GridView />}
          </>
        )}

        {/* Order Summary Bar */}
        {totalItems > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-300 p-4 z-50">
            <div className="flex items-center justify-between space-x-6">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-black">{totalItems}</div>
                  <div className="text-sm text-black">Items</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-black">৳{totalAmount.toFixed(2)}</div>
                  <div className="text-sm text-black">Total</div>
                </div>
              </div>
              <button
                onClick={handleGoToOrder}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Create Order</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}