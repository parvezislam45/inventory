export default function InvoicePage() {
  return (
    <div className="bg-white min-h-screen p-6 text-[12px] text-black">
      <div className="max-w-[1000px] mx-auto">

        {/* ================= LOGOS ================= */}
        <div className="grid grid-cols-3 items-center mb-4">
          <img src="/logos/bellissimo.png" className="h-20 mx-auto" />
          <img src="/logos/kazifarms.png" className="h-16 mx-auto" />
          <img src="/logos/zaabee.png" className="h-16 mx-auto" />
        </div>

        {/* ================= HEADER INFO ================= */}
        <table className="w-full border border-black border-collapse mb-10">
          <tbody>
            <tr>
              <td className="border px-2 py-1 w-[18%]">Company Name:</td>
              <td className="border px-2 py-1 w-[32%]">
                Kazi Food Industries Limited
              </td>
              <td className="border px-2 py-1 w-[25%] text-center" rowSpan={3}>
                Order No
              </td>
              <td className="border px-2 py-1 w-[15%] text-center" rowSpan={3}>
                321322
              </td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Territory Name:</td>
              <td className="border px-2 py-1">
                Jurain Depot-Narsingdi-Frozen Food
              </td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Partner Name:</td>
              <td className="border px-2 py-1">Nitto Bazar</td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Partner Location</td>
              <td className="border px-2 py-1">Madhobdi,Narsingdi</td>
              <td className="border px-2 py-1">Order Date:</td>
              <td className="border px-2 py-1">26-Jan-26</td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Partner Mobile No:</td>
              <td className="border px-2 py-1">01829-054230</td>
              <td className="border px-2 py-1">Document Status:</td>
              <td className="border px-2 py-1">Complete</td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Order Date:</td>
              <td className="border px-2 py-1">26-Jan-26</td>
              <td className="border px-2 py-1">Activity:</td>
              <td className="border px-2 py-1">Frozen</td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Description:</td>
              <td className="border px-2 py-1">Frozen Shipment</td>
              <td className="border px-2 py-1">Document Type:</td>
              <td className="border px-2 py-1">AR Invoice</td>
            </tr>
          </tbody>
        </table>

        {/* ================= TITLE ================= */}
        <h2 className="text-center font-bold text-lg mb-6">
          Invoice Details
        </h2>

        {/* ================= INVOICE TABLE ================= */}
        <table className="w-full border border-black border-collapse text-center mb-4">
          <thead>
            <tr className="font-bold">
              <th className="border py-1">Line No</th>
              <th className="border py-1">Product Code</th>
              <th className="border py-1">Product Name</th>
              <th className="border py-1">Qty</th>
              <th className="border py-1">Price Per Unit</th>
              <th className="border py-1">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {[
              [1,"F1004","Plain Paratha 1300gm",20,276,5520],
              [2,"F1005","Plain Paratha 650gm",20,146,2920],
              [3,"F1006","Chicken Nuggets Original",20,176,3520],
              [4,"F1007","Chicken Nuggets Spicy",13,176,2288],
              [5,"F1008","Chicken Strip 300gm",12,227,2724],
              [6,"F1009","Chicken Roll 300gm",10,190,1900],
              [7,"F1010","Chicken Samosa",5,190,950],
            ].map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td key={i} className="border py-1 px-1">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}

            <tr>
              <td colSpan={3} className="border"></td>
              <td className="border">100</td>
              <td className="border text-right font-semibold">
                Gross Invoice Value
              </td>
              <td className="border text-right">19822</td>
            </tr>

            <tr>
              <td colSpan={4} className="border"></td>
              <td className="border text-right font-semibold">
                Trade Discount-DD
              </td>
              <td className="border text-right">792.88</td>
            </tr>

            <tr>
              <td colSpan={4} className="border"></td>
              <td className="border text-right font-semibold">
                Invoice Net Value
              </td>
              <td className="border text-right">19029.12</td>
            </tr>
          </tbody>
        </table>

        {/* ================= AMOUNT IN WORD ================= */}
        <table className="w-full border border-black border-collapse mb-16">
          <tbody>
            <tr>
              <td className="border px-3 py-2 w-[22%] font-semibold">
                Amount In Word (BDT):
              </td>
              <td className="border px-3 py-2">
                Nineteenth Thousand Twenty Nine and Twelve Paisa Tk Only.
              </td>
            </tr>
          </tbody>
        </table>

        {/* ================= SIGNATURE ================= */}
        <div className="flex justify-between mt-20 px-10">
          <div className="w-1/3 text-center">
            <div className="border-t border-black pt-1">
              Authorized By
            </div>
          </div>
          <div className="w-1/3 text-center">
            <div className="border-t border-black pt-1">
              Received By
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
