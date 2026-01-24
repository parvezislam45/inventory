"use client";

export default function InvoicePage() {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center py-6">
      {/* PAGE */}
      <div className="w-[980px] bg-white border border-gray-500 text-[11px] text-black font-sans">
        {/* TOP LOGO ROW */}
        <div className="grid grid-cols-3 items-center border-b border-gray-500 p-3">
          <div className="text-left">
            <div className="w-12 h-12 border border-gray-400 rounded-full flex items-center justify-center text-[9px]">LOGO</div>
          </div>
          <div className="text-center leading-tight">
            <div className="text-[14px] font-bold uppercase">Kazi Farms Kitchen</div>
            <div className="text-[10px]">Kazi Food Industries Limited</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-[12px]">Sales Invoice</div>
            <div className="font-bold text-[14px]">1163341</div>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="grid grid-cols-2 border-b border-gray-500">
          {/* LEFT INFO */}
          <div className="p-3 border-r border-gray-500 space-y-[2px]">
            <div><span className="font-semibold">Customer Name:</span> Juran Depot Frozen Food</div>
            <div><span className="font-semibold">Customer Address:</span> DSSW0992 JMS Media Departmental Store</div>
            <div>51/A Goni road, Bislal, Narsingdi sadar, Narsingdi</div>
            <div><span className="font-semibold">Customer Code:</span> 8274894</div>
            <div><span className="font-semibold">Order Date:</span> 31-Dec-25</div>
          </div>
          {/* RIGHT INFO */}
          <div className="p-3 space-y-[2px]">
            <div><span className="font-semibold">Invoice Date:</span> 31-Dec-25</div>
            <div><span className="font-semibold">Document Status:</span> Completed</div>
            <div><span className="font-semibold">Activity:</span> Frozen</div>
            <div><span className="font-semibold">Document Type:</span> AR Invoice</div>
          </div>
        </div>

        {/* TABLE TITLE */}
        <div className="text-center font-semibold border-b border-gray-500 py-1">Invoice Details</div>

        {/* TABLE */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-500 px-1">SL</th>
              <th className="border border-gray-500 px-1">Product Code</th>
              <th className="border border-gray-500 px-1 text-left">Product Name</th>
              <th className="border border-gray-500 px-1">Qty in Unit</th>
              <th className="border border-gray-500 px-1">Unit</th>
              <th className="border border-gray-500 px-1">Pack Size</th>
              <th className="border border-gray-500 px-1">Qty in PCS</th>
              <th className="border border-gray-500 px-1">Price Per Unit</th>
              <th className="border border-gray-500 px-1">Line Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-500 text-center">1</td>
              <td className="border border-gray-500 text-center">F1004</td>
              <td className="border border-gray-500 px-1">Chicken Nuggets Original 250g</td>
              <td className="border border-gray-500 text-center">23.00</td>
              <td className="border border-gray-500 text-center">EA</td>
              <td className="border border-gray-500 text-center">1</td>
              <td className="border border-gray-500 text-center">23</td>
              <td className="border border-gray-500 text-right px-1">162.53</td>
              <td className="border border-gray-500 text-right px-1">3,738.19</td>
            </tr>
            <tr>
              <td className="border border-gray-500 text-center">2</td>
              <td className="border border-gray-500 text-center">F1005</td>
              <td className="border border-gray-500 px-1">Chicken Nuggets Spicy 250g</td>
              <td className="border border-gray-500 text-center">24.00</td>
              <td className="border border-gray-500 text-center">EA</td>
              <td className="border border-gray-500 text-center">1</td>
              <td className="border border-gray-500 text-center">24</td>
              <td className="border border-gray-500 text-right px-1">162.53</td>
              <td className="border border-gray-500 text-right px-1">3,900.72</td>
            </tr>
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="grid grid-cols-2 border-t border-gray-500">
          <div className="p-3">
            <div><span className="font-semibold">Amount in Words (BDT):</span> Seventy Six Thousand One and Twenty Seven Paisa</div>
          </div>
          <div className="p-3">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border border-gray-500 px-2">Gross Invoice Value</td>
                  <td className="border border-gray-500 text-right px-2">76,383.19</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-2">Trade Discount</td>
                  <td className="border border-gray-500 text-right px-2">-381.92</td>
                </tr>
                <tr className="font-bold">
                  <td className="border border-gray-500 px-2">Invoice Grand Total</td>
                  <td className="border border-gray-500 text-right px-2">76,001.27</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-500 text-center py-2 text-[10px]">
          Printed Date: 04-Jan-2026 12:19 PM
        </div>
      </div>
    </div>
  );
}
