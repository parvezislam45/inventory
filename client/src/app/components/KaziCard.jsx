'use client'

export default function InvoicePage({ items = [], brandTotal, date, decodedBrand }) {
  return (
    <div className="bg-white min-h-screen p-6 text-[11px] text-black">
      <div className="max-w-[900px] mx-auto">

        {/* ================= LOGOS ================= */}
        <div className="grid grid-cols-3 items-center mb-4">
          <img src="/logos/bellissimo.png" className="h-14 mx-auto" />
          <img src="/logos/kazifarms.png" className="h-14 mx-auto" />
          <img src="/logos/zaabee.png" className="h-14 mx-auto" />
        </div>

        {/* ================= HEADER INFO ================= */}
        <table className="w-full border border-black border-collapse">
          <tbody>
            <tr>
              <td className="border px-2 py-[2px] font-medium">Company Name:</td>
              <td className="border px-2 py-[2px]">Kazi Food Industries Limited</td>
              <td className="border px-2 py-[2px] text-center font-medium" rowSpan={2}>
                Order No
              </td>
              <td className="border px-2 py-[2px] text-center" rowSpan={2}>
                321322
              </td>
            </tr>

            <tr>
              <td className="border px-2 py-[2px] font-medium">Territory Name:</td>
              <td className="border px-2 py-[2px]">
                Jurain Depot-Narsingdi-Frozen Food
              </td>
            </tr>

            <tr>
              <td className="border px-2 py-[2px] font-medium">Partner Name:</td>
              <td className="border px-2 py-[2px]">Nitto Bazar</td>
              <td className="border px-2 py-[2px] font-medium">Order Date:</td>
              <td className="border px-2 py-[2px]">{date}</td>
            </tr>

            <tr>
              <td className="border px-2 py-[2px] font-medium">Partner Location:</td>
              <td className="border px-2 py-[2px]">Mahbodhi, Narsingdi</td>
              <td className="border px-2 py-[2px] font-medium">Document Status:</td>
              <td className="border px-2 py-[2px]">Complete</td>
            </tr>

            <tr>
              <td className="border px-2 py-[2px] font-medium">Partner Mobile No:</td>
              <td className="border px-2 py-[2px]">01829-054230</td>
              <td className="border px-2 py-[2px] font-medium">Activity:</td>
              <td className="border px-2 py-[2px]">Frozen</td>
            </tr>

            <tr>
              <td className="border px-2 py-[2px] font-medium">Order Date:</td>
              <td className="border px-2 py-[2px]">{date}</td>
              <td className="border px-2 py-[2px] font-medium">Document Type:</td>
              <td className="border px-2 py-[2px]">AR Invoice</td>
            </tr>

            <tr>
              <td className="border px-2 py-[2px] font-medium">Description:</td>
              <td className="border px-2 py-[2px]" colSpan={3}>
                Frozen Shipment
              </td>
            </tr>
          </tbody>
        </table>

        {/* ================= TITLE ================= */}
        <h2 className="text-center font-bold text-sm my-2">
          Invoice Details
        </h2>

        {/* ================= INVOICE TABLE ================= */}
        <table className="w-full border border-black border-collapse text-center">
          <thead>
            <tr className="font-bold">
              <th className="border py-1">Line No</th>
              <th className="border py-1">Product Code</th>
              <th className="border py-1">Product Name</th>
              <th className="border py-1">Qty</th>
              <th className="border py-1">Price / Unit</th>
              <th className="border py-1">Line Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index}>
                <td className="border py-1">{index + 1}</td>
                <td className="border py-1">{item.product_code || '-'}</td>
                <td className="border py-1 text-left px-2">
                  {item.product_name}
                </td>
                <td className="border py-1">{item.added_stock}</td>
                <td className="border py-1 text-right px-2">
                  ৳{item.tp_price}
                </td>
                <td className="border py-1 text-right px-2 font-semibold">
                  ৳{item.total_stock_price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= AMOUNT IN WORD ================= */}
        <table className="w-full border border-black border-t-0">
          <tbody>
            <tr>
              <td className="px-2 py-1">
                <strong>Amount In Word (BDT):</strong>{' '}
                Nineteen Thousand Twenty Nine and Twelve Paisa Tk Only.
              </td>
            </tr>
          </tbody>
        </table>

        {/* ================= SIGNATURE ================= */}
        <div className="flex justify-between mt-20 text-sm">
          <div className="w-1/3 text-center">
            <div className="border-t border-black pt-1">Authorized By</div>
          </div>
          <div className="w-1/3 text-center">
            <div className="border-t border-black pt-1">Received By</div>
          </div>
        </div>

      </div>
    </div>
  )
}
