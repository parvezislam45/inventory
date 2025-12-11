'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Package,
  LayoutDashboard,
  FileText,
  ClipboardList,
  RefreshCcw,
  LogOut,
  Plus,
  Users,
  ShoppingBag,
  Tag,
  Building,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const logout = async () => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    if (!access || !refresh) {
      localStorage.clear();
      router.push("/");
      return;
    }

    try {
      await fetch("http://127.0.0.1:8000/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ refresh }),
      });
      localStorage.clear();
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.clear();
      router.push("/");
    }
  };

  const links = [
    { 
      href: "/admin/add", 
      label: "Add Product", 
      icon: <Plus className="w-5 h-5" />,
      category: "Products"
    },
    { 
      href: "/admin/brand", 
      label: "Brands", 
      icon: <Tag className="w-5 h-5" />,
      category: "Management"
    },
    { 
      href: "/admin/category", 
      label: "Categories", 
      icon: <LayoutDashboard className="w-5 h-5" />,
      category: "Management"
    },
    { 
      href: "/admin/shop", 
      label: "Shops", 
      icon: <Building className="w-5 h-5" />,
      category: "Management"
    },
    { 
      href: "/admin/product", 
      label: "All Products", 
      icon: <Package className="w-5 h-5" />,
      category: "Products"
    },
    { 
      href: "/admin/orders", 
      label: "Orders", 
      icon: <ShoppingBag className="w-5 h-5" />,
      category: "Sales"
    },
    { 
      href: "/admin/delete", 
      label: "Invoices", 
      icon: <ShoppingBag className="w-5 h-5" />,
      category: "Sales"
    },
    { 
      href: "/admin/user", 
      label: "Users", 
      icon: <Users className="w-5 h-5" />,
      category: "Management"
    },
  ];

  const categories = [...new Set(links.map(link => link.category))];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-80 hidden lg:flex flex-col bg-white border-r border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Management Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                {category}
              </h3>
              <div className="space-y-1">
                {links
                  .filter(link => link.category === category)
                  .map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        pathname === link.href
                          ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${
                        pathname === link.href 
                          ? "bg-blue-100 text-blue-600" 
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      }`}>
                        {link.icon}
                      </div>
                      <span className="font-medium">{link.label}</span>
                      {pathname === link.href && (
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full ml-auto" />
                      )}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-xs">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-50 shadow-lg">
        {links.slice(0, 5).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] transition-colors ${
              pathname === link.href 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className={`p-1.5 rounded-lg ${
              pathname === link.href ? "bg-blue-100" : "bg-gray-100"
            }`}>
              {link.icon}
            </div>
            <span className="text-xs mt-1 font-medium truncate max-w-[60px]">
              {link.label.split(' ')[0]}
            </span>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pb-20 lg:pb-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200 min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
