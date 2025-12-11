"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";


export default function InvoicePage() {
  const params = useParams();
  const id = params?.id;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const invoiceRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://127.0.0.1:8000/invoices/${id}/`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch invoice: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched invoice data:', data);
        console.log('Shop data:', data.shop);
        
        // Filter only Kazi products
        data.items = data.items.filter(item => item.product.brand_name === "Kazi");
        
        setInvoice(data);
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError(err instanceof Error ? err.message : 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  // Calculate proper totals from items
  const calculateTotals = (items, discountPercent) => {
    // Calculate subtotal from TP price * quantity
    const subtotal = items.reduce((acc, item) => {
      const tpPrice = parseFloat(item.product.tp_price) || 0;
      return acc + (tpPrice * item.quantity);
    }, 0);

    // Calculate discount amount
    const discountAmount = subtotal * (discountPercent / 100);
    
    // Calculate final total
    const finalTotal = subtotal - discountAmount;

    return {
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      finalTotal: finalTotal.toFixed(2)
    };
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent || !invoice) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Determine discount percent from shop
    let discountPercent = 0;
    if (invoice.discount_type === "discount_kazi") {
      discountPercent = Number(invoice.shop?.discount_kazi || 0);
    } else if (invoice.discount_type === "discount_harvest") {
      discountPercent = Number(invoice.shop?.discount_harvest || 0);
    }

    // Calculate totals
    const totals = calculateTotals(invoice.items, discountPercent);

    const printStyles = `
      <style>
        @media print {
          @page {
            size: A4 landscape;
            margin: 0.5cm;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: black;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .print-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            gap: 15px;
          }
          
          .invoice-copy {
            width: 48%;
            background: white;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            box-sizing: border-box;
            page-break-inside: avoid;
          }
          
          .invoice-header {
            text-align: center;
            margin-bottom: 10px;
          }
          
          .invoice-header h1 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 3px;
            color: black;
          }
          
          .invoice-header p {
            font-weight: bold;
            color: black;
            margin: 1px 0;
            font-size: 11px;
          }
          
          .invoice-title {
            display: inline-block;
          border: 1.5px solid #000;
          border-radius: 3px;
          padding: 2px 10px;
          font-weight: bold;
          font-size: 12px;
          background-color: #fff
            margin-top: 16px;
          }
          
          .invoice-details {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
            font-size: 10px;
          }
          
          .shop-info p {
            margin: 1px 0;
          }
          
          .copy-label {
            border: 1px solid black;
            padding: 4px 8px;
            font-weight: bold;
            font-size: 10px;
            background: #f0f0f0;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            font-size: 9px;
          }
          
          table, th, td {
            border: 1px solid black;
          }
          
          th {
            
            color: black;
            padding: 4px 2px;
            font-weight: bold;
            text-align: center;
          }
          
          td {
            padding: 3px;
            text-align: center;
            font-weight: bold;
          }
          
          .totals-table {
            border: none;
            width: 100%;
            margin-top: 10px;
          }
          
          .totals-table td {
            border: none;
            padding: 3px 6px;
            text-align: left;
          }
          
          .totals-table tr:last-child {
            border-top: 1px solid black;
          }
          
          .totals-table tr:last-child td {
            padding-top: 6px;
            font-weight: bold;
          }
          
          .invoice-footer {
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
          }
          
          .footer-section {
            text-align: center;
          }
          
          .footer-section p {
            font-weight: bold;
            margin: 0;
            font-size: 10px;
          }
          
          .footer-line {
            border-top: 1px solid black;
            width: 70px;
            margin: 3px auto 0;
          }
        }
        
        @media screen {
          body {
            font-family: Arial, sans-serif;
            background: #f3f4f6;
            padding: 20px;
          }
          
          .print-container {
            max-width: 29.7cm;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }
          
          .invoice-copy {
            width: 48%;
            background: white;
            padding: 15px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
          }
          
          .invoice-header {
            text-align: center;
            margin-bottom: 15px;
          }
          
          .invoice-header h1 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 4px;
            color: black;
          }
          
          .invoice-header p {
            font-weight: bold;
            color: black;
            margin: 2px 0;
            font-size: 12px;
          }
          
          .invoice-title {
            display: inline-block;
          border: 1.5px solid #000;
          border-radius: 3px;
          padding: 2px 10px;
          font-weight: bold;
          font-size: 12px;
          background-color: #fff
            margin-top: 8px;
          }
          
          .invoice-details {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            font-size: 11px;
          }
          
          .shop-info p {
            margin: 2px 0;
          }
          
          .copy-label {
            border: 1px solid black;
            padding: 6px 10px;
            font-weight: bold;
            font-size: 11px;
            background: #f0f0f0;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 10px;
          }
          
          table, th, td {
            border: 1px solid black;
          }
          
          th {
            background: #d97706;
            color: white;
            padding: 6px 4px;
            font-weight: bold;
            text-align: center;
          }
          
          td {
            padding: 4px;
            text-align: center;
            font-weight: bold;
          }
          
          .totals-table {
            border: none;
            width: 100%;
            margin-top: 15px;
          }
          
          .totals-table td {
            border: none;
            padding: 4px 8px;
            text-align: left;
          }
          
          .totals-table tr:last-child {
            border-top: 1px solid black;
          }
          
          .totals-table tr:last-child td {
            padding-top: 8px;
            font-weight: bold;
          }
          
          .invoice-footer {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
          }
          
          .footer-section {
            text-align: center;
          }
          
          .footer-section p {
            font-weight: bold;
            margin: 0;
            font-size: 11px;
          }
          
          .footer-line {
            border-top: 1px solid black;
            width: 80px;
            margin: 4px auto 0;
          }
        }
      </style>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          ${printStyles}
        </head>
        <body>
          <div class="print-container">
            <div class="invoice-copy">
              <div class="invoice-header">
                <h1>Kazi Farms Kitchen Limited</h1>
                <p>Address: Shimanto Shambhar Lavel-5, Dhanmondi,Dhaka-1205 (Frozen Food)</p>
                <div class="invoice-title">Invoice Details</div>
              </div>

              <div class="invoice-details">
                <div class="shop-info">
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                  <p><strong>Partner Name:</strong> ${invoice.shop?.shop_name}</p>
                  <p><strong>Partner Location:</strong> ${invoice.shop?.address}</p>
                  <p><strong>Phone:</strong> ${invoice.shop?.phone || 'N/A'}</p>
                </div>
                <div class="copy-label">CUSTOMER COPY</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>P-Code</th>
                    <th>Name of Product</th>
                    <th>MRP</th>
                    <th>TP</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map(item => {
                    const tpPrice = parseFloat(item.product.tp_price) || 0;
                    const itemTotal = tpPrice * item.quantity;
                    return `
                      <tr>
                        <td>${item.product.id}</td>
                        <td>${item.product.product_name}</td>
                        <td>${item.product.mrp_price}</td>
                        <td>${item.product.tp_price}</td>
                        <td>${item.quantity}</td>
                        <td>${itemTotal.toFixed(2)}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>

              <table class="totals-table">
                <tbody>
                  <tr>
                    <td style="width: 60%;"><strong>Total Distributor Price</strong></td>
                    <td style="width: 40%; text-align: right;">${totals.subtotal}</td>
                  </tr>
                  <tr>
                    <td><strong>Trade Discount %</strong></td>
                    <td style="text-align: right;">${discountPercent}%</td>
                  </tr>
                  <tr>
                    <td><strong>Discount Amount</strong></td>
                    <td style="text-align: right;">- ${totals.discountAmount}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Amount</strong></td>
                    <td style="text-align: right; font-weight: bold;">${totals.finalTotal}</td>
                  </tr>
                </tbody>
              </table>

              <div class="invoice-footer">
                <div class="footer-section">
                  <p>Received By</p>
                  <div class="footer-line"></div>
                </div>
                <div class="footer-section">
                  <p>Authorized By</p>
                  <div class="footer-line"></div>
                </div>
              </div>
            </div>

            <div class="invoice-copy">
              <div class="invoice-header">
                <h1>Kazi Farms Kitchen Limited</h1>
                <p>Address: Shimanto Shambhar Lavel-5, Dhanmondi,Dhaka-1205 (Frozen Food)</p>
                <div class="invoice-title">Invoice Details</div>
              </div>

              <div class="invoice-details">
                <div class="shop-info">
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                  <p><strong>Partner Name:</strong> ${invoice.shop?.shop_name}</p>
                  <p><strong>Partner Location:</strong> ${invoice.shop?.address}</p>
                  <p><strong>Phone:</strong> ${invoice.shop?.phone || 'N/A'}</p>
                </div>
                <div class="copy-label">DISTRIBUTOR COPY</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>P-Code</th>
                    <th>Name of Product</th>
                    <th>MRP</th>
                    <th>TP</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map(item => {
                    const tpPrice = parseFloat(item.product.tp_price) || 0;
                    const itemTotal = tpPrice * item.quantity;
                    return `
                      <tr>
                        <td>${item.product.id}</td>
                        <td>${item.product.product_name}</td>
                        <td>${item.product.mrp_price}</td>
                        <td>${item.product.tp_price}</td>
                        <td>${item.quantity}</td>
                        <td>${itemTotal.toFixed(2)}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>

              <table class="totals-table">
                <tbody>
                  <tr>
                    <td style="width: 60%;"><strong>Total Distributor Price</strong></td>
                    <td style="width: 40%; text-align: right;">${totals.subtotal}</td>
                  </tr>
                  <tr>
                    <td><strong>Trade Discount %</strong></td>
                    <td style="text-align: right;">${discountPercent}%</td>
                  </tr>
                  <tr>
                    <td><strong>Discount Amount</strong></td>
                    <td style="text-align: right;">- ${totals.discountAmount}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Amount</strong></td>
                    <td style="text-align: right; font-weight: bold;">${totals.finalTotal}</td>
                  </tr>
                </tbody>
              </table>

              <div class="invoice-footer">
                <div class="footer-section">
                  <p>Received By</p>
                  <div class="footer-line"></div>
                </div>
                <div class="footer-section">
                  <p>Authorized By</p>
                  <div class="footer-line"></div>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 100);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadPDF = () => {
    handlePrint();
  };

  // Invoice copy component for preview
  const InvoiceCopy = ({ copyType, brandName }) => {
    if (!invoice) return null;

    const items = invoice.items;

    // Determine discount percent from shop
    let discountPercent = 0;
    if (invoice.discount_type === "discount_kazi") {
      discountPercent = Number(invoice.shop?.discount_kazi || 0);
    } else if (invoice.discount_type === "discount_harvest") {
      discountPercent = Number(invoice.shop?.discount_harvest || 0);
    }

    // Calculate totals using the new function
    const totals = calculateTotals(items, discountPercent);

    return (
      <div className="invoice-copy bg-white p-6 border border-gray-300 rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-black mb-2">
            {brandName} Farms Kitchen Limited
          </h1>
          <p className="font-semibold text-black">
            Address: Jurain Depot ( Frozen Food )
          </p>
          <div className="border-2 border-black px-2 py-2 font-bold text-md text-black bg-gray-100 mt-3 w-40 mx-auto">
            Invoice Details
          </div>
        </div>

        <div className="flex justify-between items-start mb-6 text-sm text-black">
          <div className="space-y-1">
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Partner Name:</strong> {invoice.shop?.shop_name || 'N/A'}</p>
            <p><strong>Partner Location:</strong> {invoice.shop?.address || 'N/A'}</p>
            <p><strong>Phone:</strong> {invoice.shop?.phone || 'N/A'}</p>
          </div>
          <div className="border border-black px-4 py-2 font-semibold text-xs bg-gray-100">
            {copyType === "customer" ? "CUSTOMER COPY" : "DISTRIBUTOR COPY"}
          </div>
        </div>

        <div className="mb-4">
          <table className="w-full border border-black text-xs text-center text-black">
            <thead>
              <tr >
                <th className="border border-black text-xs py-2">P-Code</th>
                <th className="border border-black px-4 py-2 text-xs">Name of Product</th>
                <th className="border border-black text-xs py-2">MRP</th>
                <th className="border border-black text-xs py-2">TP</th>
                <th className="border border-black text-xs py-2">Quantity</th>
                <th className="border border-black text-xs py-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const tpPrice = parseFloat(item.product.tp_price) || 0;
                const itemTotal = tpPrice * item.quantity;
                
                return (
                  <tr key={item.id}>
                    <td className="border border-black text-xs font-semibold py-1">
                      {item.product.id}
                    </td>
                    <td className="border border-black px-2 py-1 text-xs font-semibold">
                      {item.product.product_name}
                    </td>
                    <td className="border border-black px-1 py-1 text-xs font-semibold">
                      {item.product.mrp_price}
                    </td>
                    <td className="border border-black px-1 py-1 text-xs font-semibold">
                      {item.product.tp_price}
                    </td>
                    <td className="border border-black px-1 py-1 text-xs font-semibold">
                      {item.quantity}
                    </td>
                    <td className="border border-black px-1 py-1 text-xs font-semibold">
                      {itemTotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="font-semibold text-xs px-3 py-1 text-black w-2/3">
                  Total Distributor Price
                </td>
                <td className="text-right text-xs px-3 py-1 text-black font-semibold w-1/3">
                  {totals.subtotal}
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-xs px-3 py-1 text-black">
                  Trade Discount %
                </td>
                <td className="text-right text-xs px-3 py-1 text-black font-semibold">
                  {discountPercent}%
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-xs px-3 py-1 text-black">
                  Discount Amount
                </td>
                <td className="text-right text-xs px-3 py-1 text-black font-semibold">
                  -{totals.discountAmount}
                </td>
              </tr>
              <tr className="border-t border-black">
                <td className="font-semibold text-xs px-3 py-2 text-black">
                  Total Amount
                </td>
                <td className="text-right text-xs px-3 py-2 text-black font-bold">
                  {totals.finalTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="invoice-footer mt-8 flex justify-between">
          <div className="footer-section">
            <p className="text-black font-semibold text-xs">Received By</p>
            <div className="border-t border-black w-20 mx-auto mt-1"></div>
          </div>
          <div className="footer-section">
            <p className="text-black font-semibold text-xs">Authorized By</p>
            <div className="border-t border-black w-20 mx-auto mt-1"></div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading invoice...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">No invoice found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Action Buttons */}
      <div className="text-center mb-8 no-print">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 mr-3 shadow-md"
        >
          Print Invoice
        </button>
      </div>

      {/* Delivery Status */}
      <div className="text-center mb-8 no-print">
        {invoice.is_delivered && (
          <p className="text-red-600 font-semibold text-lg">
            This invoice is delivered and expired.
          </p>
        )}
      </div>

      {/* Previews - Centered horizontally */}
      <div className="no-print flex justify-center">
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start max-w-6xl">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-full lg:w-[500px]">
            <div className="border border-gray-200 rounded p-2">
              <InvoiceCopy copyType="customer" brandName="Kazi" />
            </div>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-full lg:w-[500px]">
            <div className="border border-gray-200 rounded p-2">
              <InvoiceCopy copyType="distributor" brandName="Kazi" />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Print Section */}
      <div ref={invoiceRef} style={{ display: "none" }}>
        {/* This content will be used for printing */}
      </div>
    </div>
  );
}