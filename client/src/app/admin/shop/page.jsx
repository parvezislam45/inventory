'use client';

import { useState, useEffect } from "react";
import { Building2, MapPin, Phone, Percent, Edit2, Trash2, Plus, Store, ArrowLeft } from "lucide-react";

const ShopManagement = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [shops, setShops] = useState([]);
  const [activeTab, setActiveTab] = useState('add');
  const [editingShop, setEditingShop] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [shop, setShop] = useState({
    shop_name: '',
    address: '',
    phone: '',
    discount_kazi: '',
    discount_harvest: '',
  });

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const fetchShops = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/shops/');
      if (res.ok) {
        const data = await res.json();
        setShops(data);
      } else {
        showMessage('Failed to fetch shops', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error fetching shops', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchShops();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('discount')) {
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setShop(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'phone') {
      setShop(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setShop(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateDiscounts = () => {
    const discounts = [
      { value: shop.discount_kazi, name: 'Kazi' },
      { value: shop.discount_harvest, name: 'Harvest' },
    ];
    for (const d of discounts) {
      if (d.value !== '' && d.value != null) {
        const val = parseFloat(d.value);
        if (isNaN(val) || val < 0 || val > 100) {
          return `${d.name} discount must be between 0 and 100`;
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationError = validateDiscounts();
    if (validationError) {
      showMessage(validationError, 'error');
      setIsLoading(false);
      return;
    }

    const shopData = {
      ...shop,
      phone: shop.phone === '' ? null : Number(shop.phone),
      discount_kazi: shop.discount_kazi === '' ? 0 : parseFloat(shop.discount_kazi),
      discount_harvest: shop.discount_harvest === '' ? 0 : parseFloat(shop.discount_harvest),
    };

    try {
      const url = editingShop
        ? `http://127.0.0.1:8000/shops/${editingShop.id}/`
        : 'http://127.0.0.1:8000/shops/';
      const method = editingShop ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopData),
      });

      if (res.ok) {
        showMessage(editingShop ? '🎉 Shop updated successfully!' : '✨ Shop added successfully!', 'success');
        setShop({ shop_name: '', address: '', phone: '', discount_kazi: '', discount_harvest: '' });
        setEditingShop(null);
        if (activeTab === 'manage') fetchShops();
      } else {
        const data = await res.json();
        const errorMsg = data.shop_name?.[0] || data.detail || 'Operation failed';
        showMessage(errorMsg, 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('🚨 Server error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (shop) => {
    setEditingShop(shop);
    setShop(shop);
    setActiveTab('add');
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeleteLoading(id);
    try {
      const res = await fetch(`http://127.0.0.1:8000/shops/${id}/`, { method: 'DELETE' });
      if (res.ok) {
        showMessage(`🗑️ Shop "${name}" deleted successfully!`, 'success');
        fetchShops();
      } else {
        showMessage(`Failed to delete "${name}"`, 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error deleting shop', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -inset-2 bg-blue-500 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                Shop Management
              </h1>
              <p className="text-gray-600 text-lg mt-2">Manage your retail network with ease</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-3xl font-bold text-blue-600 mb-2">{shops.length}</div>
            <div className="text-gray-600 font-medium">Total Shops</div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex space-x-1 px-8 pt-6">
              <button
                onClick={() => {
                  setActiveTab('add');
                  setEditingShop(null);
                  if (editingShop) setShop({ shop_name: '', address: '', phone: '', discount_kazi: '', discount_harvest: '' });
                }}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${activeTab === 'add' ? 'bg-white text-blue-600 border border-blue-200 shadow-lg' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
              >
                {editingShop ? (
                  <>
                    <ArrowLeft className="w-5 h-5" />
                    <span>Edit Shop</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Add New Shop</span>
                  </>
                )}
              </button>
              <button
                onClick={() => { setActiveTab('manage'); setEditingShop(null); }}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${activeTab === 'manage' ? 'bg-white text-blue-600 border border-blue-200 shadow-lg' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}
              >
                <Building2 className="w-5 h-5" />
                <span>Manage Shops</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Message Alert */}
            {message && (
              <div className={`p-4 rounded-2xl mb-8 border ${messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {messageType === 'success' ? (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      </div>
                    )}
                    <span className="font-semibold">{message}</span>
                  </div>
                  <button onClick={() => setMessage('')} className="text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
                </div>
              </div>
            )}

            {/* Add/Edit Form */}
            {activeTab === 'add' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{editingShop ? 'Edit Shop Details' : 'Create New Shop'}</h2>
                  <p className="text-gray-600">{editingShop ? 'Update your shop information' : 'Add a new shop to your network'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <Building2 className="w-4 h-4" />
                        <span>Shop Name *</span>
                      </label>
                      <input
                        type="text"
                        name="shop_name"
                        placeholder="Enter shop name"
                        value={shop.shop_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <Phone className="w-4 h-4" />
                        <span>Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={shop.phone || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span>Address *</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter full address"
                      value={shop.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <Percent className="w-4 h-4" />
                        <span>Kazi Discount (%)</span>
                      </label>
                      <input
                        type="text"
                        name="discount_kazi"
                        placeholder="0-100%"
                        value={shop.discount_kazi || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                        <Percent className="w-4 h-4" />
                        <span>Harvest Discount (%)</span>
                      </label>
                      <input
                        type="text"
                        name="discount_harvest"
                        placeholder="0-100%"
                        value={shop.discount_harvest || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-3 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : editingShop ? (
                      <>
                        <Edit2 className="w-5 h-5" />
                        <span className="text-lg">Update Shop</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span className="text-lg">Create Shop</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Manage Shops */}
            {activeTab === 'manage' && (
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                  <div className="mb-4 lg:mb-0">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">All Shops</h2>
                    <p className="text-gray-600">Manage your shop network</p>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search shops..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 w-full lg:w-80"
                    />
                    <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {filteredShops.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-3xl flex items-center justify-center border border-gray-300">
                      <Store className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {searchTerm ? 'No shops found' : 'No shops yet'}
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto mb-6">
                      {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first shop'}
                    </p>
                    {searchTerm ? (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Clear Search
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('add')}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Add First Shop
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredShops.map((s) => (
                      <div key={s.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-900">{s.shop_name}</h3>
                          <div className="flex space-x-2">
                            <button onClick={() => handleEdit(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id, s.shop_name)}
                              disabled={deleteLoading === s.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                            >
                              {deleteLoading === s.id ? (
                                <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="text-gray-600 mb-2 flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{s.address}</span>
                        </div>
                        <div className="text-gray-600 mb-2 flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{s.phone || 'N/A'}</span>
                        </div>
                        <div className="text-gray-600 flex items-center space-x-4">
                          <span>Kazi Discount: {s.discount_kazi}%</span>
                          <span>Harvest Discount: {s.discount_harvest}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopManagement;
