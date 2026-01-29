"use client";

const KaziCard = ({ items, brandTotal, date, decodedBrand }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:rounded-none">
      {/* Kazi Farm Design - Green Theme */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8 print:bg-green-600">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 text-2xl font-bold">K</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Kazi & Kazi Tea</h1>
                <p className="text-green-100">Organic & Premium Tea Estate</p>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-sm">Kazi & Kazi Tea Estate Ltd.</p>
              <p className="text-sm">Tetulia, Panchagarh, Bangladesh</p>
              <p className="text-sm">Organic Certified: USDA, EU, JAS</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-green-700/50 px-4 py-2 rounded-lg inline-block">
              <p className="text-2xl font-bold">INVOICE</p>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-lg font-semibold">Date: {date}</p>
              <p className="text-green-100 text-sm">Invoice #: KAZ-{date.replace(/-/g, '')}</p>
              <p className="text-green-100 text-sm">Order Type: Organic Products</p>
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
                <thead className="bg-green-50">
                  <tr>
                    <th className="p-3 text-left font-semibold text-green-800 border-b-2 border-green-200">#</th>
                    <th className="p-3 text-left font-semibold text-green-800 border-b-2 border-green-200">Product Description</th>
                    <th className="p-3 text-left font-semibold text-green-800 border-b-2 border-green-200">Qty</th>
                    <th className="p-3 text-left font-semibold text-green-800 border-b-2 border-green-200">Unit Price</th>
                    <th className="p-3 text-left font-semibold text-green-800 border-b-2 border-green-200">Total (BDT)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-green-50/50 transition-colors border-b border-green-100">
                      <td className="p-3 text-green-700 font-medium">{index + 1}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-green-900">{item.product_name}</p>
                          <p className="text-sm text-green-600">Organic Product • Kazi Tea Estate</p>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                          {item.added_stock}
                        </span>
                      </td>
                      <td className="p-3 text-green-700">৳{item.tp_price}</td>
                      <td className="p-3 font-semibold text-green-800">৳{item.total_stock_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end">
              <div className="w-80">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex justify-between mb-3">
                    <span className="text-green-700">Subtotal:</span>
                    <span className="font-medium text-green-800">৳{brandTotal}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-green-700">Organic Tax (0%):</span>
                    <span className="font-medium text-green-800">৳0</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-green-700">Delivery Charge:</span>
                    <span className="font-medium text-green-800">৳0</span>
                  </div>
                  <div className="h-px bg-green-200 my-4"></div>
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-green-800">Grand Total:</span>
                    <span className="text-green-600">৳{brandTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">K</span>
            </div>
            <p className="text-green-600 text-lg">No organic items found for Kazi on {date}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-green-200 p-8 bg-green-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span>🌱</span> Contact Info
            </h3>
            <p className="text-green-700 text-sm">Kazi & Kazi Tea Estate Ltd.</p>
            <p className="text-green-600 text-sm">Tetulia, Panchagarh 5030</p>
            <p className="text-green-600 text-sm">Bangladesh</p>
          </div>
          <div>
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span>📞</span> Contact Details
            </h3>
            <p className="text-green-600 text-sm">Phone: +880 2 989 5270</p>
            <p className="text-green-600 text-sm">Email: info@kazifoods.com</p>
            <p className="text-green-600 text-sm">Web: www.kazifoods.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span>📋</span> Payment Terms
            </h3>
            <p className="text-green-600 text-sm">Net 30 Days Payment</p>
            <p className="text-green-600 text-sm">Bank: Prime Bank Ltd.</p>
            <p className="text-green-600 text-sm">Acc: 1234567890</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-green-300 text-center">
          <p className="text-green-600 text-sm">
            "Nature's Best, Delivered Fresh"
          </p>
          <p className="text-green-500 text-xs mt-2">
            This is an organic product invoice. Certified by USDA, EU, JAS
          </p>
        </div>
      </div>
    </div>
  );
};

export default KaziCard;