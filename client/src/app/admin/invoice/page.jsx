"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [shops, setShops] = useState([]);
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewFull, setViewFull] = useState(false);

  // Load shops
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/shops/")
      .then((res) => res.json())
      .then(setShops)
      .catch((err) => console.error("Error loading shops:", err));
  }, []);

  // Load brands
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/brand/")
      .then((res) => res.json())
      .then(setBrands)
      .catch((err) => console.error("Error loading brands:", err));
  }, []);

  // Load invoices when shop changes
  useEffect(() => {
    if (!selectedShop) {
      setOrders([]);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/shops/${selectedShop}/invoices/`)
      .then((res) => res.json())
      .then(setOrders)
      .catch((err) => console.error("Error loading invoices:", err));
  }, [selectedShop]);

  // Fetch single invoice
  const fetchInvoice = (id) => {
    fetch(`http://127.0.0.1:8000/api/invoices/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedInvoice(data);
        setViewFull(false);
      })
      .catch((err) => console.error("Error loading invoice:", err));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: "bold" }}>Invoices</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <select
          value={selectedShop ?? ""}
          onChange={(e) =>
            setSelectedShop(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Select Shop</option>
          {shops.map((s) => (
            <option key={s.id} value={s.id}>
              {s.shop_name}
            </option>
          ))}
        </select>

        <select
          value={selectedBrand ?? ""}
          onChange={(e) =>
            setSelectedBrand(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.brand_name}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      {!selectedInvoice && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((inv) =>
                selectedBrand
                  ? inv.items.some((it) => it.product.brand.id === selectedBrand)
                  : true
              )
              .map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoice_number}</td>
                  <td>{new Date(inv.created_at).toLocaleString()}</td>
                  <td>{inv.is_delivered ? "✅ Delivered" : "⏳ Pending"}</td>
                  <td>
                    <button onClick={() => fetchInvoice(inv.id)}>View</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* Invoice Details - Normal Brand View */}
      {selectedInvoice && !viewFull && (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #ccc" }}>
          <h2 style={{ fontWeight: "bold" }}>
            Invoice {selectedInvoice.invoice_number}
          </h2>
          <p>
            Shop: {selectedInvoice.shop.shop_name} (
            {selectedInvoice.shop.discount}% off)
          </p>
          <p>
            Created: {new Date(selectedInvoice.created_at).toLocaleString()}
          </p>
          <p>
            Status:{" "}
            {selectedInvoice.is_delivered ? "✅ Delivered" : "⏳ Pending"}
          </p>

          <h3 style={{ marginTop: 12 }}>Items</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Final Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.items
                .filter((item) =>
                  selectedBrand ? item.product.brand.id === selectedBrand : true
                )
                .map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.product.product_name} (
                      {item.product.brand.brand_name})
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.final_price}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <button onClick={() => setSelectedInvoice(null)}>Back</button>
            <button onClick={() => setViewFull(true)}>View Full</button>
          </div>
        </div>
      )}

      {/* Invoice Details - Special Full View */}
      {selectedInvoice && viewFull && (
        <div style={{ marginTop: 20, padding: 16, border: "2px solid black" }}>
          <h2 style={{ fontWeight: "bold" }}>
            Full Invoice View ({selectedInvoice.invoice_number})
          </h2>

          {selectedInvoice.items
            .filter(
              (item) =>
                item.product.brand.brand_name === "Kazi" ||
                item.product.brand.brand_name === "Harvest"
            )
            .map((item) => {
              if (item.product.brand.brand_name === "Kazi") {
                return (
                  <div
                    key={item.id}
                    style={{
                      marginBottom: 20,
                      padding: 12,
                      border: "1px solid green",
                      borderRadius: 8,
                      background: "#ecfdf5",
                    }}
                  >
                    <h3 style={{ color: "green" }}>Kazi Invoice</h3>
                    <p>Product: {item.product.product_name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Final Price: {item.final_price}</p>
                  </div>
                );
              }

              if (item.product.brand.brand_name === "Harvest") {
                return (
                  <div
                    key={item.id}
                    style={{
                      marginBottom: 20,
                      padding: 12,
                      border: "1px solid blue",
                      borderRadius: 8,
                      background: "#eef2ff",
                    }}
                  >
                    <h3 style={{ color: "blue" }}>Harvest Invoice</h3>
                    <p>Product: {item.product.product_name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Final Price: {item.final_price}</p>
                  </div>
                );
              }

              return null;
            })}

          <button
            onClick={() => setViewFull(false)}
            style={{ marginTop: 20 }}
          >
            Back to Normal
          </button>
        </div>
      )}
    </div>
  );
}
