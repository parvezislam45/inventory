"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function HarvestInvoicePage() {
  const params = useParams();
  const { id } = params;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const invoiceRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/invoices/${id}/`);
        if (!response.ok) throw new Error(`Failed to fetch invoice`);
        const data = await response.json();
        console.log("Fetched invoice:", data);
        setInvoice(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const markDelivered = async () => {
    if (!invoice) return;
    const res = await fetch(
      `http://127.0.0.1:8000/invoices/${invoice.id}/deliver/`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );
    if (res.ok) {
      alert("Invoice marked as delivered!");
      window.location.reload();
    } else alert("Error updating invoice");
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = invoiceRef.current.cloneNode(true);

    // Get current date and time (formatted)
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    const printStyles = `
<style>
  /* Reset and base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    font-size: 11px;
    line-height: 1.3;
    color: #000;
    background: white;
    margin: 0;
    padding: 0;
  }

  @media print {
    @page {
      size: A4;
      margin: 10mm 10mm;
    }

    body {
      width: 100%;
      height: 100%;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .no-print {
      display: none !important;
    }
  }

  /* Invoice Container */
  .invoice-container {
    width: 100%;
    max-width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 20px;
    background: white;
    position: relative;
  }

  /* Header Section */
  .invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 12px;
    padding: 0 5px;
  }

  .header-left {
    flex: 1;
    text-align: left;
  }

  .header-logo {
    width: 50px;
    height: auto;
  }

  .header-center {
    flex: 2;
    text-align: center;
    padding: 0 10px;
  }

  .company-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 3px;
  }

  .company-address {
    font-size: 10px;
    margin-bottom: 5px;
    line-height: 1.2;
  }

  .invoice-label {
    display: inline-block;
    border: 1.5px solid #000;
    border-radius: 3px;
    padding: 2px 10px;
    font-weight: bold;
    font-size: 12px;
    background-color: #fff;
  }

  .header-right {
    flex: 1;
    text-align: right;
    font-size: 10px;
    line-height: 1.2;
  }

  .territory-title {
    font-weight: bold;
    font-size: 11px;
    margin-bottom: 3px;
    white-space: nowrap;
  }

  .distributor-info {
    margin-bottom: 4px;
    font-size: 8px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .invoice-date {
    font-size: 10px;
    font-weight: bold;
    white-space: nowrap;
  }

  /* Outlet Information */
  .outlet-info {
    font-size: 11px;
    margin-bottom: 8px;
    padding: 0 5px;
    line-height: 1.4;
  }

  /* Content Wrapper */
  .content-wrapper {
    padding: 0 5px;
  }

  /* Table Styles */
  .invoice-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
    margin-bottom: 8px;
    table-layout: fixed;
  }

  .invoice-table th,
  .invoice-table td {
    border: 1px solid #000;
    padding: 3px 4px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .invoice-table th {
    background: #f0f0f0;
    font-weight: bold;
    text-align: center;
  }

  /* Column widths */
  .invoice-table th:nth-child(1),
  .invoice-table td:nth-child(1) { width: 8%; }
  .invoice-table th:nth-child(2),
  .invoice-table td:nth-child(2) { width: 12%; }
  .invoice-table th:nth-child(3),
  .invoice-table td:nth-child(3) { width: 20%; }
  .invoice-table th:nth-child(4),
  .invoice-table td:nth-child(4) { width: 8%; }
  .invoice-table th:nth-child(5),
  .invoice-table td:nth-child(5) { width: 6%; }
  .invoice-table th:nth-child(6),
  .invoice-table td:nth-child(6) { width: 8%; }
  .invoice-table th:nth-child(7),
  .invoice-table td:nth-child(7) { width: 8%; }
  .invoice-table th:nth-child(8),
  .invoice-table td:nth-child(8) { width: 8%; }
  .invoice-table th:nth-child(9),
  .invoice-table td:nth-child(9) { width: 12%; }

  .text-center { text-align: center; }
  .text-right { text-align: right; }

  /* Summary Section */
  .summary-section {
    width: 240px;
    margin-left: auto;
    margin-top: 10px;
    font-size: 10px;
    border: 1px solid #000;
    padding: 6px;
    background: #f9f9f9;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .summary-total {
    font-weight: bold;
    border-top: 1px solid #000;
    margin-top: 4px;
    padding-top: 4px;
  }

  /* Signature Section */
  .signature-section {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 0 5px;
  }

  .signature-box {
    width: 45%;
    border-top: 1px solid #000;
    text-align: center;
    padding-top: 4px;
    font-weight: bold;
    font-size: 11px;
  }

  /* Print date/time */
  .invoice-date-time {
    text-align: center;
    font-size: 9px;
    margin-top: 10px;
    color: #666;
  }
</style>
`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoice?.shop?.shop_name || 'Harvest'}</title>
          ${printStyles}
        </head>
        <body>
          <div class="invoice-container">
            ${printContent.innerHTML}
            <div class="invoice-date-time">
              Printed on: ${formattedDate} at ${formattedTime}
            </div>
          </div>
          <script>
            window.onload = () => { 
              window.print(); 
              setTimeout(() => window.close(), 1000); 
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const groupItemsByCategory = (items) => {
    const grouped = {};
    items.forEach((item) => {
      const category = item.product.category_name || "Other";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });
    return grouped;
  };

  const extractWeight = (productName) => {
    const match = productName.match(/(\d+)\s*gm/);
    return match ? `${match[1]} gm` : "N/A";
  };

  const calculateQuantity = (totalPrice, tpPrice) => {
    return tpPrice > 0 ? Math.floor(totalPrice / tpPrice) : 0;
  };

  const InvoiceContent = () => {
    if (!invoice) return null;

    // ✅ Filter only Harvest brand products
    const items = invoice.items.filter(
      (item) => item.product.brand_name.toLowerCase() === "harvest"
    );

    // ✅ Group items by category
    const groupedItems = groupItemsByCategory(items);

    // ✅ Calculate subtotal (only for Harvest products)
    const subtotal = items.reduce((acc, item) => {
      const itemTotal = parseFloat(item.total_price) || 0;
      return acc + itemTotal;
    }, 0);

    // ✅ Always use Harvest discount (ignore Kazi discount completely)
    const discountPercent = parseFloat(String(invoice.shop.discount_harvest)) || 0;

    // ✅ Calculate discount and final total
    const discountAmount = (subtotal * discountPercent) / 100;
    const finalTotal = subtotal - discountAmount;

    return (
      <div className="invoice-container">
        {/* Header Section */}
        <div className="invoice-header">
          <div className="header-left">
            <img
              src="https://i.postimg.cc/WpmyDkS8/Screenshot-2025-10-03-004927-removebg-preview.png"
              alt="Golden Harvest Logo"
              className="header-logo"
            />
          </div>

          <div className="header-center">
            <div className="company-title">
              Golden Harvest Agro Industries Limited
            </div>
            <div className="company-address">
              186, Gulshan, Tejgaon Link Road, Tejgaon, Dhaka-1208, Bangladesh
            </div>
            <div className="invoice-label">Invoice</div>
          </div>

          <div className="header-right">
            <div className="territory-title">Territory: Narsingdi</div>
            <div className="distributor-info">
              Distributor: Mollah Departmental Store,<br/> 55/1 Circuit House, Narsingdi Sader, Narsingdi
            </div>
            <div className="invoice-date">
              Date: {new Date(invoice.created_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Outlet Information */}
        <div className="outlet-info">
          <div>Outlet Name: {invoice.shop.shop_name}</div>
          <div>Outlet Address: {invoice.shop.address}</div>
        </div>

        {/* Content Wrapper for proper margins */}
        <div className="content-wrapper">
          {/* Table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>P-Code</th>
                <th>Category</th>
                <th>Name of Product</th>
                <th>Weight gm</th>
                <th>Qty</th>
                <th>TP</th>
                <th>MRP</th>
                <th>Quantity</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedItems).map(([category, items]) =>
                items.map((item, index) => (
                  <tr key={item.id}>
                    {index === 0 && (
                      <>
                        <td rowSpan={items.length} className="text-center">GH
                          {item.product.id}
                        </td>
                        <td className="text-center" rowSpan={items.length}>
                          {category}
                        </td>
                      </>
                    )}
                    <td style={{ fontSize: '8px' }}>{item.product.product_name}</td>
                    <td className="text-center">
                      {extractWeight(item.product.product_name)}
                    </td>
                    <td className="text-center">
                      {calculateQuantity(
                        parseFloat(item.total_price) || 0,
                        item.product.tp_price
                      )}
                    </td>
                    <td className="text-center">{item.product.tp_price}</td>
                    <td className="text-center">{item.product.mrp_price}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      {parseFloat(item.total_price || "0").toFixed(0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Summary Section */}
          <div className="summary-section">
            <div className="summary-row">
              <div>Total Trade Price:</div>
              <div>{subtotal.toFixed(0)}</div>
            </div>
            <div className="summary-row">
              <div>Discount Amount ({discountPercent}%):</div>
              <div>-{discountAmount.toFixed(0)}</div>
            </div>
            <div className="summary-row summary-total">
              <div>Total Amount:</div>
              <div>{finalTotal.toFixed(0)}</div>
            </div>
          </div>

          {/* Signature */}
          <div className="signature-section">
            <div className="signature-box">Received By</div>
            <div className="signature-box">Authorized By</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!invoice) return <div>No invoice found</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="text-center mb-4 no-print">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 mr-4"
        >
          Print / Download
        </button>
        <button
          onClick={markDelivered}
          className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700"
        >
          Mark as Delivered
        </button>
      </div>

      {/* View content with proper styling */}
      <div className="no-print flex justify-center">
        <div className="invoice-preview">
          <InvoiceContent />
        </div>
      </div>

      {/* Hidden content for printing - same design */}
      <div ref={invoiceRef} style={{ display: "none" }}>
        <InvoiceContent />
      </div>

      {/* Preview specific styles */}
      <style jsx global>{`
        /* View mode specific styles */
        .invoice-preview {
          width: 210mm;
          min-height: 297mm;
          border: 1px solid #ccc;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          transform-origin: top center;
        }

        /* Shared invoice styles for both view and print */
        .invoice-container {
          width: 100%;
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 20px;
          background: white;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          margin-bottom: 12px;
          padding: 0 5px;
        }

        .header-left {
          width: 20%;
          text-align: left;
        }

        .header-logo {
          width: 70px;
          height: auto;
        }

        .header-center {
          width: 50%;
          text-align: center;
        }

        .company-title {
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 3px;
          line-height: 1.2;
        }

        .company-address {
          font-size: 10px;
          margin-bottom: 5px;
          line-height: 1.2;
        }

        .invoice-label {
          display: inline-block;
          border: 1.5px solid #000;
          border-radius: 3px;
          padding: 2px 10px;
          font-weight: bold;
          font-size: 12px;
          background-color: #fff;
        }

        .header-right {
          width: 30%;
          text-align: right;
          font-size: 10px;
          line-height: 1.3;
        }

        .territory-title {
          font-weight: bold;
          font-size: 11px;
          margin-bottom: 2px;
        }

        .distributor-info {
          margin-bottom: 4px;
          font-size: 9px;
          line-height: 1.2;
        }

        .invoice-date {
          font-size: 10px;
          font-weight: bold;
        }

        .outlet-info {
          font-size: 11px;
          margin-bottom: 8px;
          padding: 0 5px;
          line-height: 1.4;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          margin-bottom: 8px;
          table-layout: fixed;
        }
        .invoice-table th,
        .invoice-table td {
          border: 1px solid #000;
          padding: 3px 4px;
          word-wrap: break-word;
          overflow: hidden;
        }
        .invoice-table th {
          background: #f0f0f0;
          font-weight: bold;
          text-align: center;
        }
        
        /* Column widths for view mode */
        .invoice-table th:nth-child(1),
        .invoice-table td:nth-child(1) { width: 8%; }
        .invoice-table th:nth-child(2),
        .invoice-table td:nth-child(2) { width: 12%; }
        .invoice-table th:nth-child(3),
        .invoice-table td:nth-child(3) { width: 20%; }
        .invoice-table th:nth-child(4),
        .invoice-table td:nth-child(4) { width: 8%; }
        .invoice-table th:nth-child(5),
        .invoice-table td:nth-child(5) { width: 6%; }
        .invoice-table th:nth-child(6),
        .invoice-table td:nth-child(6) { width: 8%; }
        .invoice-table th:nth-child(7),
        .invoice-table td:nth-child(7) { width: 8%; }
        .invoice-table th:nth-child(8),
        .invoice-table td:nth-child(8) { width: 8%; }
        .invoice-table th:nth-child(9),
        .invoice-table td:nth-child(9) { width: 12%; }
        
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        .summary-section {
          margin-top: 10px;
          font-size: 12px;
          width: 280px;
          margin-left: auto;
          border: 1px solid #000;
          padding: 8px;
          background: #f9f9f9;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          padding: 2px 0;
        }
        .summary-total {
          font-weight: bold;
          border-top: 1px solid #000;
          padding-top: 4px;
          margin-top: 4px;
        }

        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          padding: 0 5px;
        }
        .signature-box {
          width: 45%;
          border-top: 1px solid #000;
          text-align: center;
          font-weight: bold;
          padding-top: 5px;
          font-size: 12px;
        }

        .content-wrapper {
          padding: 0 5px;
        }

        .no-print {
          display: block;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          
          .invoice-container {
            padding: 0;
          }
          
          .invoice-header {
            margin-bottom: 8px;
          }
          
          .outlet-info {
            margin-bottom: 6px;
          }
          
          .invoice-table {
            font-size: 9px;
            margin-bottom: 6px;
          }
          
          .summary-section {
            margin-top: 6px;
            font-size: 11px;
            width: 250px;
            padding: 6px;
          }
          
          .signature-section {
            margin-top: 20px;
          }
        }
      `}</style>
    </div>
  );
}