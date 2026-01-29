"use client";


import HarvestCard from "../../../../../components/HarvestCard";
import KaziCard from "../../../../../components/KaziCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BrandInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const { date, brand } = params;
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brandTotal, setBrandTotal] = useState(0);

  useEffect(() => {
    async function fetchInvoice() {
      if (!date || !brand) return;
      
      try {
        // Fetch all items for the date
        const res = await fetch(`http://localhost:8000/stock/daily/${date}/`);
        
        if (!res.ok) throw new Error("Failed to fetch invoice data");
        
        const data = await res.json();
        console.log("Invoice API Response:", data);

        // Decode brand name from URL
        const decodedBrand = decodeURIComponent(brand);
        
        // Filter items by brand
        const filtered = Array.isArray(data.items) 
          ? data.items.filter(item => item.brand_name === decodedBrand)
          : [];

        console.log("Filtered items for brand:", decodedBrand, filtered);
        
        setItems(filtered);
        
        // Calculate total for this brand
        const total = filtered.reduce(
          (sum, item) => sum + (parseFloat(item.total_stock_price) || 0), 
          0
        );
        setBrandTotal(total);
        
      } catch (err) {
        setError(err.message);
        console.error("Error fetching invoice:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [date, brand]);

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading invoice...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-500 text-lg font-semibold mb-2">Error</p>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push(`/admin/chalan/${date}`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  const decodedBrand = decodeURIComponent(brand);
  const isKazi = decodedBrand.toLowerCase().includes('kazi');
  const isHarvest = decodedBrand.toLowerCase().includes('harvest');

  // Function to render invoice based on brand
  const renderInvoice = () => {
    if (isKazi) {
      return (
        <KaziCard 
          items={items}
          brandTotal={brandTotal}
          date={date}
          decodedBrand={decodedBrand}
        />
      );
    } else if (isHarvest) {
      return (
        <HarvestCard 
          items={items}
          brandTotal={brandTotal}
          date={date}
          decodedBrand={decodedBrand}
        />
      );
    } else {
      // Default invoice design for other brands
      return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:rounded-none">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 print:bg-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{decodedBrand}</h1>
                <p className="text-blue-100">Commercial Invoice</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">Date: {date}</p>
                <p className="text-blue-100 text-sm">Invoice #: INV-{date.replace(/-/g, '')}-{decodedBrand.slice(0, 3).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Invoice Body */}
          <div className="p-8">
            {items.length > 0 ? (
              <>
                {/* Items table */}
                <div className="overflow-x-auto mb-8">
                  <table className="min-w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">#</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Product Name</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Quantity</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Unit Price</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="border border-gray-300 p-3">{index + 1}</td>
                          <td className="border border-gray-300 p-3 font-medium">{item.product_name}</td>
                          <td className="border border-gray-300 p-3 text-center">{item.added_stock}</td>
                          <td className="border border-gray-300 p-3 text-right">৳{item.tp_price}</td>
                          <td className="border border-gray-300 p-3 text-right font-semibold">৳{item.total_stock_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="flex justify-end">
                  <div className="w-64 border-t border-gray-300 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">৳{brandTotal}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tax (0%):</span>
                      <span className="font-medium">৳0</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3 mt-3">
                      <span>Grand Total:</span>
                      <span className="text-blue-600">৳{brandTotal}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg">No items found for {decodedBrand} on {date}</p>
                <button
                  onClick={() => router.push(`/admin/chalan/${date}`)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go Back to Stock List
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-8 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Company Info</h3>
                <p className="text-gray-600 text-sm">{decodedBrand} Foods Ltd.</p>
                <p className="text-gray-600 text-sm">Dhaka, Bangladesh</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Payment Terms</h3>
                <p className="text-gray-600 text-sm">Net 30 Days</p>
                <p className="text-gray-600 text-sm">Payment via Bank Transfer</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Contact</h3>
                <p className="text-gray-600 text-sm">Email: info@{decodedBrand.toLowerCase()}.com</p>
                <p className="text-gray-600 text-sm">Phone: +880 XXXX-XXXXXX</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-300 text-center">
              <p className="text-gray-500 text-sm">
                This is a computer-generated invoice. No signature required.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Action buttons - Hidden when printing */}
      <div className="mb-6 flex flex-wrap gap-3 print:hidden">
        <button
          onClick={() => router.push(`/admin/chalan/${date}`)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Daily Stock
        </button>
        
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Invoice
        </button>
      </div>

      {/* Render the appropriate invoice based on brand */}
      {renderInvoice()}
    </div>
  );
}