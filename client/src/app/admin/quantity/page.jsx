"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Building2,
  PlusCircle,
  Eye,
  ArrowRight,
  TrendingUp,
  DollarSign,
  PackagePlus,
  Trash2,
  Layers,
  CheckCircle,
} from "lucide-react";

export default function StockRestockPage() {
  const API = "http://127.0.0.1:8000";
  const router = useRouter();

  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedStock, setAddedStock] = useState("");
  const [isLoading, setIsLoading] = useState({
    brands: false,
    products: false,
    submit: false,
  });
  const [restockItems, setRestockItems] = useState([]);

  useEffect(() => {
    setIsLoading((prev) => ({ ...prev, brands: true }));
    fetch(`${API}/brand/`)
      .then((res) => res.json())
      .then(setBrands)
      .finally(() => setIsLoading((prev) => ({ ...prev, brands: false })));
  }, []);

  const loadProducts = async (brandId) => {
    setIsLoading((prev) => ({ ...prev, products: true }));
    setSelectedBrand(brandId);
    setSelectedProduct(null);
    setAddedStock("");

    try {
      const res = await fetch(`${API}/product-list/?brand=${brandId}`);
      const data = await res.json();
      setProducts(data);
    } finally {
      setIsLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const handleProductSelect = (id) => {
    const product = products.find((p) => p.id == id);
    setSelectedProduct(product);
    setAddedStock("");
  };

  const addToRestockList = () => {
    if (!selectedProduct || !addedStock || Number(addedStock) <= 0) {
      alert("Please enter valid stock");
      return;
    }

    const added = Number(addedStock);
    const exists = restockItems.find(
      (item) => item.product_id === selectedProduct.id
    );
    
    if (exists) {
      alert("Product already added to restock list");
      return;
    }

    const newItem = {
      product_id: selectedProduct.id,
      product_name: selectedProduct.product_name,
      last_stock: selectedProduct.stock,
      added_stock: added,
      current_stock: selectedProduct.stock + added,
      tp_price: selectedProduct.tp_price,
      total_stock_price: added * selectedProduct.tp_price,
    };

    setRestockItems((prev) => [...prev, newItem]);
    setAddedStock("");
    setSelectedProduct(null);
  };

  const removeFromRestockList = (index) => {
    setRestockItems((prev) => prev.filter((_, i) => i !== index));
  };

  const submitAllStock = async () => {
    if (restockItems.length === 0) return;

    setIsLoading((prev) => ({ ...prev, submit: true }));

    try {
      const res = await fetch(`${API}/product/bulk-restock/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: restockItems.map((item) => ({
            product_id: item.product_id,
            added_stock: item.added_stock,
          })),
        }),
      });

      if (!res.ok) throw new Error("Bulk restock failed");
      router.push("/admin/chalan");
    } catch (e) {
      alert(e.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const totalInvestment = restockItems.reduce(
    (sum, item) => sum + item.total_stock_price,
    0
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <PackagePlus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Stock Restock</h1>
              <p className="text-xs text-gray-500">Add new stock to inventory</p>
            </div>
          </div>
          {restockItems.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-gray-900">${totalInvestment.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Brand Selection */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-medium text-gray-700">Select Brand</h2>
              </div>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                onChange={(e) => loadProducts(e.target.value)}
                disabled={isLoading.brands}
              >
                <option value="">Choose a brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.brand_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Selection */}
            {products.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-gray-500" />
                  <h2 className="text-sm font-medium text-gray-700">Select Product</h2>
                  {isLoading.products ? (
                    <span className="text-xs text-gray-400 ml-auto">Loading...</span>
                  ) : (
                    <span className="text-xs text-gray-400 ml-auto">{products.length} available</span>
                  )}
                </div>
                <select
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  onChange={(e) => handleProductSelect(e.target.value)}
                  value={selectedProduct?.id || ""}
                  disabled={isLoading.products}
                >
                  <option value="">Choose a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.product_name} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add Stock */}
            {selectedProduct && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <h2 className="text-sm font-medium text-gray-700">Add Stock</h2>
                  </div>
                  <span className="text-xs text-gray-500">ID: {selectedProduct.id}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-md p-2">
                    <p className="text-xs text-gray-500">Current Stock</p>
                    <p className="text-sm font-medium text-gray-900">{selectedProduct.stock}</p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <p className="text-xs text-gray-500">TP Price</p>
                    <p className="text-sm font-medium text-gray-900">${selectedProduct.tp_price}</p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <p className="text-xs text-gray-500">Product</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{selectedProduct.product_name}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      min="1"
                      placeholder="Quantity"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pl-8"
                      value={addedStock}
                      onChange={(e) => setAddedStock(e.target.value)}
                    />
                    <PlusCircle className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <button
                    onClick={addToRestockList}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Restock List */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-gray-500" />
                  <h2 className="text-sm font-medium text-gray-700">Restock List</h2>
                </div>
                {restockItems.length > 0 && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                    {restockItems.length} items
                  </span>
                )}
              </div>

              {/* Restock Items */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {restockItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">No items added</p>
                  </div>
                ) : (
                  <>
                    {restockItems.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-md p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-xs font-medium text-gray-900">{item.product_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">Stock: {item.last_stock} → {item.current_stock}</span>
                              <span className="text-xs text-green-600 font-medium">+{item.added_stock}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromRestockList(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">TP: ${item.tp_price}</span>
                          <span className="text-xs font-medium text-gray-900">
                            ${item.total_stock_price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                  </>
                )}
              </div>

              {/* Submit Button */}
              {restockItems.length > 0 && (
                <button
                  onClick={submitAllStock}
                  disabled={isLoading.submit}
                  className="w-full mt-4 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading.submit ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Confirm & Continue
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Brands</p>
              <p className="text-sm font-medium text-gray-900">{brands.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Products</p>
              <p className="text-sm font-medium text-gray-900">{products.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Added Items</p>
              <p className="text-sm font-medium text-gray-900">{restockItems.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-sm font-medium text-gray-900">${totalInvestment.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}