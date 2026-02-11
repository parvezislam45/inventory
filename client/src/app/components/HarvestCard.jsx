"use client";

const HarvestCard = ({ items, date, challanNo }) => {
  // Extract weight from product name (e.g., "Product 250gm" -> "250 gm")
  const extractWeight = (productName) => {
    if (!productName || typeof productName !== "string") return "N/A";
    const match = productName.match(/(\d+)\s*gm/i);
    return match ? `${match[1]} gm` : "N/A";
  };

  // Calculate grand total
  const grandTotal = items.reduce((sum, item) => {
    const tp = Number(item.tp_price) || 0;
    const qty = Number(item.added_stock) || 0;
    return sum + tp * qty;
  }, 0);

  return (
    <div className="flex justify-center py-10">
      {/* Invoice container */}
      <div
        className="w-[200mm] min-h-[287mm] border border-gray-300 shadow-lg bg-white p-5 print:p-5"
        style={{ margin: "0 auto" }}
      >
        {/* Header */}
        <div className="flex justify-between mb-3 px-1">
          {/* Left - Logo */}
          <div className="w-1/5 text-left">
            <img
              src="https://i.postimg.cc/WpmyDkS8/Screenshot-2025-10-03-004927-removebg-preview.png"
              alt="Golden Harvest Logo"
              className="w-20 h-auto"
            />
          </div>

          {/* Center */}
          <div className="w-1/2 text-center">
            <div className="text-[13px] font-bold leading-tight mt-5">
              Golden Harvest Agro Industries Limited
            </div>
            <div className="text-[10px] leading-tight mb-1">
              186, Gulshan, Tejgaon Link Road, Tejgaon, Dhaka-1208, Bangladesh
            </div>
            <div className="inline-block border-[1.5px] border-black rounded px-2 py-[1px] font-bold text-[12px]">
              Challan
            </div>
          </div>

          {/* Right */}
          <div className="w-1/4 text-right text-[10px] leading-snug mt-5">
            <div className="font-bold text-[11px] mb-[2px]">Territory: Narsingdi</div>
            <div className="text-[9px] mb-[2px]">
              Distributor: Mollah Departmental Store,
              <br /> 55/1 Circuit House, Narsingdi Sader, Narsingdi
            </div>
            <div className="font-bold text-[10px]">Date: {date}</div>
          </div>
        </div>

        {/* Outlet Info */}
        <div className="text-[11px] mb-2 px-1">
          <div>Challan No: {challanNo}</div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto px-1">
          <table className="w-full border border-black border-collapse table-fixed text-[10px]">
            <thead>
              <tr className="bg-gray-200 font-bold text-center">
                <th className="border border-black w-[8%]">P-Code</th>
                <th className="border border-black w-[50%]">Name of Product</th>
                <th className="border border-black w-[8%]">Weight gm</th>
                <th className="border border-black w-[6%]">Qty</th>
                <th className="border border-black w-[8%]">TP</th>
                <th className="border border-black w-[8%]">Quantity</th>
                <th className="border border-black w-[12%]">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const tp = Number(item.tp_price) || 0;
                const qty = Number(item.added_stock) || 0;
                const total = tp * qty;

                return (
                  <tr key={item.id || index} className="text-center">
                    <td className="border border-black">{item.product}</td>
                    <td className="border border-black text-left px-2">{item.product_name}</td>
                    <td className="border border-black">{extractWeight(item.product_name)}</td>
                    <td className="border border-black">{qty}</td>
                    <td className="border border-black text-right">{item.tp_price}</td>
                    <td className="border border-black">{qty}</td>
                    <td className="border border-black text-right px-2">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="w-[280px] border border-black bg-gray-100 p-2 mt-2 ml-auto text-[12px]">
          <div className="flex justify-between border-t border-black pt-1 font-bold">
            <div>Total Amount:</div>
            <div>৳{grandTotal.toFixed(2)}</div>
          </div>
        </div>

        {/* Signature */}
        <div className="flex justify-between mt-12 px-1 gap-40">
          <div className="border-t border-black text-center w-1/2 font-bold pt-4 text-[12px]">
            Received By
          </div>
          <div className="border-t border-black text-center w-1/2 font-bold pt-4 text-[12px]">
            Authorized By
          </div>
        </div>
      </div>

      {/* Print helper */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            margin: 0;
            padding: 0;
          }
          /* Ensure content fits within A4 with margins */
          div[class*="w-[200mm]"] {
            width: 200mm !important;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default HarvestCard;
