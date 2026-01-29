async function getDailyStock(date) {
  const res = await fetch(
    `http://localhost:8000/stock/daily/${date}/`,
    { cache: "no-store" }
  );

  return res.json();
  
}

export default async function StockPage({ searchParams }) {
  const brand = searchParams?.brand;
  const date = searchParams?.date || "2026-01-26";

  const data = await getDailyStock(date);
  const products = data.items.filter(
    (item) => item.brand_name === brand
  );
  console.log(products)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {brand} Stock
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Product</th>
            <th className="border p-2">Last</th>
            <th className="border p-2">Added</th>
            <th className="border p-2">Current</th>
            <th className="border p-2">TP</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.product_name}</td>
              <td className="border p-2">{item.last_stock}</td>
              <td className="border p-2">{item.added_stock}</td>
              <td className="border p-2">{item.current_stock}</td>
              <td className="border p-2">৳{item.tp_price}</td>
              <td className="border p-2">৳{item.total_stock_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}