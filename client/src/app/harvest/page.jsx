"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Package,
  Box,
  Database,
  BarChart3,
} from "lucide-react";
import { useRoleGuard } from '../../utils/checkRoleAccess';

export default function HarvestProducts() {
  const { role } = useRoleGuard(["Harvest"]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/product/"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const harvestProducts = data
          .filter((p) => p.brand_name === "Harvest")
          .map((product) => {
            let status;
            if (product.stock === 0) {
              status = "Out of Stock";
            } else if (product.stock < 10) {
              status = "Low Stock";
            } else {
              status = "In Stock";
            }

            return {
              ...product,
              status,
              last_updated: new Date().toISOString().split("T")[0],
              sku: `HV${product.id.toString().padStart(4, "0")}`,
            };
          });

        setProducts(harvestProducts);
        setFilteredProducts(harvestProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
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
      filtered = filtered.filter(
        (product) =>
          product.product_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand_name)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category_name)
      );
    }

    if (selectedStatus.length > 0) {
      filtered = filtered.filter((product) =>
        selectedStatus.includes(product.status)
      );
    }

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

    localStorage.setItem("selectedProducts", JSON.stringify(selected));
    router.push("/harvest/order");
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

    setter((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedStatus([]);
  };

  const brands = [...new Set(products.map((p) => p.brand_name))];
  const categories = [...new Set(products.map((p) => p.category_name))];
  const statuses = ["In Stock", "Low Stock", "Out of Stock"];

  const totalItems = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const totalAmount = products.reduce(
    (sum, p) => sum + (quantities[p.id] || 0) * p.tp_price,
    0
  );
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const outOfStockCount = products.filter(
    (p) => p.status === "Out of Stock"
  ).length;

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            <div className="text-gray-700 font-medium">
              Loading inventory data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Golden Harvest
              </h1>
              <p className="text-gray-600">Golden Harvest Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border p-6 rounded-lg">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
          <div className="bg-white border p-6 rounded-lg">
            <p className="text-sm text-gray-600">In Stock</p>
            <p className="text-2xl font-bold">
              {totalProducts - lowStockCount - outOfStockCount}
            </p>
          </div>
          <div className="bg-white border p-6 rounded-lg">
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">
              {lowStockCount}
            </p>
          </div>
          <div className="bg-white border p-6 rounded-lg">
            <p className="text-sm text-gray-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">
              {outOfStockCount}
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex border rounded-lg">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "table"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                } rounded-l-lg`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                } rounded-r-lg`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Product List */}
        {viewMode === "table" ? (
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">SKU</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Stock</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const qty = quantities[product.id] ?? 0;
                  return (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <img
                          src={product.image}
                          alt={product.product_name}
                          className="w-10 h-10 rounded"
                        />
                        {product.product_name}
                      </td>
                      <td className="px-4 py-2">{product.sku}</td>
                      <td className="px-4 py-2">{product.category_name}</td>
                      <td className="px-4 py-2">৳{product.tp_price}</td>
                      <td className="px-4 py-2">{product.stock}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQtyChange(product.id, qty - 1, product.stock)
                            }
                            disabled={qty === 0}
                            className="border px-2 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            value={qty}
                            onChange={(e) =>
                              handleQtyChange(
                                product.id,
                                Number(e.target.value),
                                product.stock
                              )
                            }
                            className="w-12 text-center border rounded"
                          />
                          <button
                            onClick={() =>
                              handleQtyChange(product.id, qty + 1, product.stock)
                            }
                            className="border px-2 rounded"
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const qty = quantities[product.id] ?? 0;
              return (
                <div
                  key={product.id}
                  className="bg-white border rounded-lg p-3 shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.product_name}
                    className="w-full h-24 object-cover rounded"
                  />
                  <h3 className="font-semibold mt-2">
                    {product.product_name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.category_name}</p>
                  <p className="text-sm text-gray-900 font-medium">
                    ৳ {product.tp_price}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() =>
                        handleQtyChange(product.id, qty - 1, product.stock)
                      }
                      disabled={qty === 0}
                      className="border px-2 py-1 rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span>{qty}</span>
                    <button
                      onClick={() =>
                        handleQtyChange(product.id, qty + 1, product.stock)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalItems > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border shadow-lg px-6 py-3 rounded-lg flex items-center gap-6">
            <div>
              <p className="font-bold text-lg">{totalItems}</p>
              <p className="text-sm text-gray-600">Items</p>
            </div>
            <div>
              <p className="font-bold text-lg">৳{totalAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <button
              onClick={handleGoToOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Create Order</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
