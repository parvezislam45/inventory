"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DeliveredInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  // ✅ Fetch all delivered invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/invoices/delivered/");
      setInvoices(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch invoices.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ✅ Delete delivered invoice
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this delivered invoice?")) return;

    try {
      setDeleting(id);
      await axios.delete(`http://127.0.0.1:8000/invoices/delivered/${id}/`);
      setInvoices(invoices.filter((inv) => inv.id !== id));
      setDeleting(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete invoice.");
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Delivered Invoices</h1>

        {loading && <p className="text-gray-500">Loading invoices...</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        {!loading && invoices.length === 0 && (
          <p className="text-gray-600">No delivered invoices found.</p>
        )}

        {!loading && invoices.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-2 px-3 border">Invoice #</th>
                  <th className="py-2 px-3 border">Shop</th>
                  <th className="py-2 px-3 border">Subtotal</th>
                  <th className="py-2 px-3 border">Discount</th>
                  <th className="py-2 px-3 border">Final Total</th>
                  <th className="py-2 px-3 border">Date</th>
                  <th className="py-2 px-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border">{invoice.invoice_number}</td>
                    <td className="py-2 px-3 border">{invoice.shop?.shop_name}</td>
                    <td className="py-2 px-3 border">{invoice.subtotal}</td>
                    <td className="py-2 px-3 border">{invoice.discount_amount}</td>
                    <td className="py-2 px-3 border font-semibold text-green-600">
                      {invoice.final_total}
                    </td>
                    <td className="py-2 px-3 border">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 border text-center">
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        disabled={deleting === invoice.id}
                        className={`px-3 py-1 rounded-md text-white ${
                          deleting === invoice.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {deleting === invoice.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
