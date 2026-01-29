"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function InvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/invoices/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch invoice");
        const data = await res.json();

        // Only Kazi items
        data.items = data.items.filter(
          i => i.product.brand_name === "Kazi"
        );

        setInvoice(data);
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

  // Calculate total amount for amount in words
  const totalAmount = items.reduce((sum, item) => {
    const tp = Number(item.product.tp_price) || 0;
    return sum + (tp * item.quantity);
  }, 0);

  // Function to convert number to words (you might want to use a library for production)
  const amountInWords = (num) => {
    // This is a simple implementation - you might want to use a proper library
    const simpleNumbers = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    if (num === 0) return 'Zero';

    const thousands = Math.floor(num / 1000);
    const hundreds = Math.floor((num % 1000) / 100);
    const remainder = num % 100;

    let words = '';

    if (thousands > 0) {
      words += simpleNumbers[thousands] + ' Thousand ';
    }

    if (hundreds > 0) {
      words += simpleNumbers[hundreds] + ' Hundred ';
    }

    if (remainder > 0) {
      if (remainder < 20) {
        words += simpleNumbers[remainder];
      } else {
        words += tens[Math.floor(remainder / 10)];
        if (remainder % 10 > 0) {
          words += ' ' + simpleNumbers[remainder % 10];
        }
      }
    }

    const paisa = Math.round((num % 1) * 100);
    let paisaWords = '';
    if (paisa > 0) {
      if (paisa < 20) {
        paisaWords = simpleNumbers[paisa];
      } else {
        paisaWords = tens[Math.floor(paisa / 10)];
        if (paisa % 10 > 0) {
          paisaWords += ' ' + simpleNumbers[paisa % 10];
        }
      }
    }

    return words.trim() + (paisa > 0 ? ` and ${paisaWords} Paisa` : '') + ' Tk Only.';
  };

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
                {invoice.invoice_number}
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
              <td className="border px-2 py-[2px]">{invoice.shop?.shop_name || 'Nitto Bazar'}</td>
              <td className="border px-2 py-[2px] font-medium">Order Date:</td>
              <td className="border px-2 py-[2px]">{date}</td>
            </tr>

            <tr>
              <td className="border px-2 py-[2px] font-medium">Partner Location:</td>
              <td className="border px-2 py-[2px]">{invoice.shop?.address || 'Mahbodhi, Narsingdi'}</td>
              <td className="border px-2 py-[2px] font-medium">Document Status:</td>
              <td className="border px-2 py-[2px]">
                {invoice.is_delivered ? "Complete" : "Pending"}
              </td>
            </tr>

            <tr>
              <td className="border px-2 py-[2px] font-medium">Partner Mobile No:</td>
              <td className="border px-2 py-[2px]">{invoice.shop?.phone || '01829-054230'}</td>
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
            {items.map((item, index) => {
              const tp = Number(item.product.tp_price) || 0;
              const total = tp * item.quantity;

              return (
                <tr key={item.id}>
                  <td className="border py-1">{index + 1}</td>
                  <td className="border py-1">{item.product.id || '-'}</td>
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
          </tbody>
        </table>

        {/* ================= AMOUNT IN WORD ================= */}
        <table className="w-full border border-black border-t-0">
          <tbody>
            <tr>
              <td className="px-2 py-1">
                <strong>Amount In Word (BDT):</strong>{' '}
                {amountInWords(totalAmount)}
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
  );
}