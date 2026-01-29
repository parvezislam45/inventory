"use client";

const HarvestCard = ({ items, brandTotal, date, decodedBrand }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:rounded-none">
      {/* Harvest Design - Orange/Brown Theme */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white p-8 print:bg-orange-600">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-2xl font-bold">🌾</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Harvest World</h1>
                <p className="text-amber-100">Fresh From Our Fields</p>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-sm">Harvest World Food Products Ltd.</p>
              <p className="text-sm">Agro Industrial Complex, Dhaka</p>
              <p className="text-sm">Since 1995 • Fresh & Healthy</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-amber-800/50 px-4 py-2 rounded-lg inline-block">
              <p className="text-2xl font-bold">COMMERCIAL INVOICE</p>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-lg font-semibold">Delivery Date: {date}</p>
              <p className="text-amber-100 text-sm">Invoice #: HVST-{date.replace(/-/g, '')}</p>
              <p className="text-amber-100 text-sm">Batch: HW-{new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Body */}
      <div className="p-8">
        {items.length > 0 ? (
          <>
            {/* Items table */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <th className="p-3 text-left font-semibold text-amber-900 border-b-2 border-amber-300">SR</th>
                    <th className="p-3 text-left font-semibold text-amber-900 border-b-2 border-amber-300">Product Name & Details</th>
                    <th className="p-3 text-left font-semibold text-amber-900 border-b-2 border-amber-300">Quantity</th>
                    <th className="p-3 text-left font-semibold text-amber-900 border-b-2 border-amber-300">Rate</th>
                    <th className="p-3 text-left font-semibold text-amber-900 border-b-2 border-amber-300">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors border-b border-amber-100">
                      <td className="p-3 text-amber-800 font-medium">{index + 1}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-amber-900">{item.product_name}</p>
                          <p className="text-sm text-amber-600">Harvest World • Premium Quality</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center">
                          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md font-medium border border-amber-200">
                            {item.added_stock} Units
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-amber-800 font-medium">৳{item.tp_price}</td>
                      <td className="p-3 font-semibold text-amber-900">৳{item.total_stock_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-3">Delivery Information</h3>
                  <p className="text-amber-700 text-sm mb-2">Harvest World Distribution Center</p>
                  <p className="text-amber-600 text-sm">Delivery within 24 hours</p>
                  <p className="text-amber-600 text-sm">Freshness Guaranteed</p>
                </div>
              </div>
              <div>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-300">
                  <div className="flex justify-between mb-3">
                    <span className="text-amber-800">Product Value:</span>
                    <span className="font-medium text-amber-900">৳{brandTotal}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-amber-800">Packaging:</span>
                    <span className="font-medium text-amber-900">৳0</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-amber-800">VAT (0%):</span>
                    <span className="font-medium text-amber-900">৳0</span>
                  </div>
                  <div className="h-px bg-amber-300 my-4"></div>
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-amber-900">Payable Amount:</span>
                    <span className="text-orange-600">৳{brandTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-amber-600 text-2xl">🌾</span>
            </div>
            <p className="text-amber-600 text-lg">No items found for Harvest World on {date}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-amber-200 p-8 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-amber-900 mb-3">Harvest World Quality Promise</h3>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>✓ 100% Fresh Products</li>
              <li>✓ Hygienically Processed</li>
              <li>✓ Quality Checked</li>
              <li>✓ Best Before Date Mentioned</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-3">Bank Details</h3>
            <div className="text-amber-700 text-sm space-y-1">
              <p>Bank: Dutch-Bangla Bank Ltd.</p>
              <p>A/C Name: Harvest World Foods Ltd.</p>
              <p>A/C No: 123.45678.90</p>
              <p>Branch: Motijheel, Dhaka</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-amber-300 text-center">
          <div className="flex justify-center items-center gap-4 mb-3">
            <span className="text-amber-600">📞 +880 2 811 1000</span>
            <span className="text-amber-600">✉️ info@harvestworld.com</span>
            <span className="text-amber-600">🌐 www.harvestworld.com.bd</span>
          </div>
          <p className="text-amber-500 text-sm">
            Thank you for choosing Harvest World - Where Quality Meets Freshness
          </p>
        </div>
      </div>
    </div>
  );
};

export default HarvestCard;