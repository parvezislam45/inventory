"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DailyStockPage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date;

  const [items, setItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDailyStock() {
      if (!date) return;

      try {
        const res = await fetch(`http://localhost:8000/stock/daily/${date}/`);
        if (!res.ok) throw new Error("Failed to fetch daily stock");

        const data = await res.json();
        console.log("API Response:", data);
        
        // Set items and grand total
        setItems(Array.isArray(data.items) ? data.items : []);
        setGrandTotal(data.grand_total_price || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDailyStock();
  }, [date]);

  // Get unique brands from items
  const brands = [...new Set(items.map(item => item.brand_name).filter(Boolean))];
  
  console.log("Available brands:", brands); // Debug log

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Stock Details – {date}</h1>
      
      {/* Back button */}
      <button
        onClick={() => router.push('/admin/chalan')}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← Back
      </button>

      {/* Brand buttons section */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">View Brand Invoices</h2>
        <div className="flex gap-4">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <button
                key={brand}
                onClick={() =>
                  router.push(`/admin/chalan/${date}/invoice/${encodeURIComponent(brand)}`)
                }
                className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
              >
                View {brand} Invoice
              </button>
            ))
          ) : (
            <p className="text-gray-500">No brands available</p>
          )}
        </div>
      </div>

      {/* Items table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Product</th>
              <th className="border border-gray-300 p-3 text-left">Brand</th>
              <th className="border border-gray-300 p-3 text-left">Added Stock</th>
              <th className="border border-gray-300 p-3 text-left">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{item.product_name}</td>
                  <td className="border border-gray-300 p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      item.brand_name === "Harvest" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {item.brand_name}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3">{item.added_stock}</td>
                  <td className="border border-gray-300 p-3 font-medium">
                    {item.total_stock_price}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border border-gray-300 p-3 text-center text-gray-500">
                  No stock items for this date
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Grand Total */}
      <div className="mt-6 p-4 bg-gray-50 border rounded">
        <p className="text-lg font-semibold">Grand Total: {grandTotal}</p>
      </div>
    </div>
  );
}