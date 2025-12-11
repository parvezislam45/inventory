"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AddProductPage = () => {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    mrp_price: "",
    tp_price: "",
    stock: "",
    brand: null,
    category: null,
    image: null,
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch categories and brands using .then()
  useEffect(() => {
    fetch("http://127.0.0.1:8000/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories:", err));

    fetch("http://127.0.0.1:8000/brand/")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error("Failed to fetch brands:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      setFormData((p) => ({ ...p, image: file }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    } else if (["mrp_price", "tp_price", "stock"].includes(name)) {
      setFormData((p) => ({
        ...p,
        [name]: value === "" ? "" : Number(value),
      }));
    } else if (["brand", "category"].includes(name)) {
      setFormData((p) => ({
        ...p,
        [name]: value ? Number(value) : null,
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.category || !formData.brand) {
      setMessage("Please select both category and brand.");
      setIsLoading(false);
      return;
    }

    if (
      formData.mrp_price === "" ||
      formData.tp_price === "" ||
      formData.stock === ""
    ) {
      setMessage("Please fill in all price and stock fields.");
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append("product_name", formData.product_name);
    data.append("description", formData.description);
    data.append("mrp_price", String(formData.mrp_price));
    data.append("tp_price", String(formData.tp_price));
    data.append("stock", String(formData.stock));
    data.append("category", String(formData.category));
    data.append("brand", String(formData.brand));
    if (formData.image) data.append("image", formData.image);

    fetch("http://127.0.0.1:8000/product/", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (res.ok) {
          res.json().then(() => {
            setMessage("Product added successfully!");
            setTimeout(() => router.push("/admin/product"), 1500);
          });
        } else {
          res.json().then((errorData) => {
            setMessage(`Failed to add product: ${JSON.stringify(errorData)}`);
          });
        }
      })
      .catch(() => {
        setMessage("An error occurred while adding the product.");
      })
      .finally(() => setIsLoading(false));
  };

  const clearMessage = () => setMessage("");

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600">
            Create a new product with details, pricing, and images
          </p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
              message.includes("successfully")
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  message.includes("successfully")
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {message.includes("successfully") ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                </svg>
              </div>
              <span
                className={`font-medium ${
                  message.includes("successfully")
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {message}
              </span>
            </div>
            <button
              onClick={clearMessage}
              className={`transition-colors ${
                message.includes("successfully")
                  ? "text-green-600 hover:text-green-800"
                  : "text-red-600 hover:text-red-800"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="product_name"
                placeholder="Enter product name"
                value={formData.product_name}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 resize-none"
                required
              />
            </div>

            {/* Prices & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* MRP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  MRP Price *
                </label>
                <input
                  type="number"
                  name="mrp_price"
                  placeholder="0.00"
                  value={formData.mrp_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
                  required
                />
              </div>

              {/* TP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trade Price *
                </label>
                <input
                  type="number"
                  name="tp_price"
                  placeholder="0.00"
                  value={formData.tp_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
                  required
                />
              </div>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category ?? ""}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brand *
                </label>
                <select
                  name="brand"
                  value={formData.brand ?? ""}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.brand_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50/50 hover:border-blue-400 transition">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      id="image-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer block"
                    >
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium">
                        Click to upload image
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </label>
                  </div>
                </div>

                {imagePreview && (
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Preview
                    </p>
                    <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <p className="text-xs text-gray-500 text-center mt-2">
                        {formData.image?.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Product
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Fields marked with * are required
              </p>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Product Information
            </h3>
            <p className="text-gray-600 text-sm">
              Products will be available for sale immediately after being added
              to the system. Ensure all pricing and stock information is
              accurate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
