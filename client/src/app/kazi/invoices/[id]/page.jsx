"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      try {
        const res = await fetch(`https://server.jobaeralmahamud.com/invoices/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch invoice");
        const data = await res.json();

        // Only Kazi items
        data.items = data.items.filter((i) => i.product.brand_name === "Kazi");

        setInvoice(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;
  if (!invoice) return null;

  const items = invoice.items;
  const date = new Date(invoice.created_at).toLocaleDateString();

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
    <div className="bprint-wrapper text-[12px] text-black">
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
            className="w-28 mx-auto"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS9txBeaWEg3uGyz-KasDXs-eGnQN-dzTWWShBgk740A&s"
            className="w-36 mx-auto"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRknAPZ7rwKdH3m1BY-YAzqw8OIvih2XTMG4A&s"
            className="w-24 mx-auto"
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
                Order No
              </td>
              <td className="border px-2 py-1 w-[15%] text-center" rowSpan={3}>
                {invoice.invoice_number}
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
              <td className="border px-2 py-1">{invoice.shop?.shop_name}</td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Partner Location</td>
              <td className="border px-2 py-1">{invoice.shop?.address}</td>
              <td className="border px-2 py-1">Invoice Date:</td>
              <td className="border px-2 py-1">{date}</td>
            </tr>

            <tr>
              <td className="border px-2 py-1">Partner Mobile No:</td>
              <td className="border px-2 py-1">{invoice.shop?.phone}</td>
              <td className="border px-2 py-1">Document Status:</td>
              <td className="border px-2 py-1">
                {invoice.is_delivered ? "Complete" : "Pending"}
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
              <th className="border py-1">Product Name</th>
              <th className="border py-1">Qty in Pcs</th>
              <th className="border py-1">Price Per Unit</th>
              <th className="border py-1">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const tp = Number(item.product.tp_price) || 0;
              const total = tp * item.quantity;
              return (
                <tr key={item.id}>
                  <td className="border py-1">{index + 1}</td>
                  <td className="border py-1 text-left px-2">KP{item.product.id || "-"}</td>
                  <td className="border py-1 text-left px-2">
                    {item.product.product_name}
                  </td>
                  <td className="border py-1">{item.quantity}</td>
                  <td className="border py-1 text-right px-2">
                    ৳{tp.toFixed(2)}
                  </td>
                  <td className="border py-1 text-right px-2 font-semibold">
                    ৳{total.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={3} className="border"></td>
              <td className="border text-right font-semibold px-2">
                Gross Invoice Value
              </td>
              <td className="border text-right px-2">{invoice.subtotal}</td>
            </tr>

            <tr>
              <td colSpan={4} className="border"></td>
              <td className="border text-right font-semibold px-2">
                Trade Discount-DD {Number(invoice.discount_percent).toFixed(0)}%
              </td>

              <td className="border text-right px-2">{invoice.discount_amount}</td>
            </tr>

            <tr>
              <td colSpan={4} className="border"></td>
              <td className="border text-right font-semibold px-2">
                Invoice Net Value
              </td>
              <td className="border text-right px-2">{invoice.final_total}</td>
            </tr>
          </tbody>
        </table>

        {/* ================= AMOUNT IN WORD ================= */}
        <table className="w-full border border-black border-collapse mb-16">
          <tbody>
            <tr>
              <td className="border px-3 py-2 w-[25%] font-semibold">
                Amount In Word (BDT):
              </td>
              <td className="border px-3 py-2">
                {numberToWords(Math.round(invoice.final_total))} Taka Only
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
