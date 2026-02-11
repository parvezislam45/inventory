"use client";

export default function InvoicePage({
  items = [],
  date,
  challanNo
}) {
  
const grandTotal = items.reduce((sum, item) => {
  const tp = Number(item.tp_price) || 0;
  const qty = Number(item.added_stock) || 0;
  return sum + tp * qty;
}, 0);
  function numberToWords(num) {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
      "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
      "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (!num) return "Zero";

    if (num < 20) return a[num];

    if (num < 100)
      return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");

    if (num < 1000)
      return a[Math.floor(num / 100)] + " Hundred " + (num % 100 ? numberToWords(num % 100) : "");

    if (num < 100000)
      return numberToWords(Math.floor(num / 1000)) + " Thousand " + (num % 1000 ? numberToWords(num % 1000) : "");

    if (num < 10000000)
      return numberToWords(Math.floor(num / 100000)) + " Lakh " + (num % 100000 ? numberToWords(num % 100000) : "");

    return numberToWords(Math.floor(num / 10000000)) + " Crore " + (num % 10000000 ? numberToWords(num % 10000000) : "");
  }


  return (
    <div className="print-wrapper text-[12px] text-black">
      <button
      onClick={() => window.print()}
      className="print:hidden fixed top-4 right-4 bg-black text-white px-4 py-2"
    >
      Print
    </button>
      <div className="a4-page">
        {/* ================= LOGOS ================= */}
        <div className="grid grid-cols-3 items-center mb-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd32PNXXZSm6QVzguXy_6g2StIXApDisjZdw&s"
            className="w-16 mx-auto"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS9txBeaWEg3uGyz-KasDXs-eGnQN-dzTWWShBgk740A&s"
            className="w-36 mx-auto"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRknAPZ7rwKdH3m1BY-YAzqw8OIvih2XTMG4A&s"
            className="w-16 mx-auto"
          />
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
                Challan No
              </td>
              <td className="border px-2 py-1 w-[15%] text-center" rowSpan={3}>
                {challanNo}
              </td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Territory Name:</td>
              <td className="border px-2 py-1">
                Jurain Depot-Narsingdi-Frozen Food
              </td>
            </tr>

            <tr>
             
              <td className="border px-2 py-1">Challan Date:</td>
              <td className="border px-2 py-1">{date}</td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Document Status:</td>
              <td className="border px-2 py-1">
                Delivered
              </td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Order Date:</td>
              <td className="border px-2 py-1">{date}</td>
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
        <h2 className="text-center font-bold text-lg mb-6">Invoice Details</h2>

        {/* ================= INVOICE TABLE ================= */}
        <table className="w-full border border-black border-collapse text-center mb-4">
          <thead>
            <tr className="font-bold">
              <th className="border py-1">Line No</th>
              <th className="border py-1">Product Code</th>
              <th className="border py-1 w-[25vh]">Product Name</th>
              <th className="border py-1">Qty in Pcs</th>
              <th className="border py-1">Price Per Unit</th>
              <th className="border py-1">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const tp = Number(item.tp_price) || 0;
              const qty = Number(item.added_stock) || 0;
              const total = tp * qty;
              return (
                <tr key={item.id}>
                  <td className="border py-1">{index + 1}</td>
                  <td className="border py-1 text-left px-2">KF{item.product}</td>
                  <td className="border py-1 text-left px-2">
                    {item.product_name}
                  </td>
                  <td className="border py-1">{item.added_stock}</td>
                  <td className="border py-1 text-right px-2">
                    ৳{item.tp_price.toFixed(2)}
                  </td>
                  <td className="border py-1 text-right px-2">
                     ৳{total.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={4} className="border"></td>
              <td className="border text-right font-semibold px-2">
                Invoice Net Value
              </td>
              <td className="border text-right px-2 font-semibold">৳{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* ================= AMOUNT IN WORD ================= */}
        <table className="w-full border border-black border-collapse mb-16">
          <tbody>
            <tr>
              <td className="border px-3 py-2 w-[22%] font-semibold">
                Amount In Word (BDT):{numberToWords(Math.round(grandTotal))} Taka Only
              </td>
              
            </tr>
          </tbody>
        </table>

        {/* ================= SIGNATURE ================= */}
        <div className="flex justify-between mt-20 px-10">
          <div className="w-1/3 text-center">
            <div className="border-t border-black pt-1">Authorized By</div>
          </div>
          <div className="w-1/3 text-center">
            <div className="border-t border-black pt-1">Received By</div>
          </div>
        </div>
      </div>
      <style jsx global>{`

      @page {
        size: A4 portrait;
        margin: 10mm;
      }

      @media print {

        html, body {
          width: 210mm;
          height: 297mm;
        }

        .a4-page {
          width: 190mm;
          min-height: 277mm;
          margin: auto;
          background: white;
        }

        * {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        table {
          page-break-inside: avoid;
        }

        tr {
          page-break-inside: avoid;
        }

        .print\\:hidden {
          display: none !important;
        }
      }

      @media screen {
        .a4-page {
          width: 794px;
          min-height: 1123px;
          margin: auto;
          padding: 20px;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
      }

    `}</style>
    </div>
  );
}
