"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, LogOut, ShoppingBag } from "lucide-react";
import React from "react";

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
      href: "/harvest/product",
      label: "Products",
      icon: <Package className="w-5 h-5" />,
    },
    {
      href: "/harvest/orders",
      label: "Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 hidden md:flex flex-col bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Golden Harvest</h1>
          <p className="text-sm text-gray-500 mt-1">Management Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
                ${
                  pathname === link.href
                    ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout (Desktop Sidebar) */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-start">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-50 shadow-lg">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] transition-colors ${
              pathname === link.href
                ? "text-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {link.icon}
            <span className="text-xs mt-1 font-medium">{link.label}</span>
          </Link>
        ))}

        {/* Logout (Mobile) */}
        <button
          onClick={logout}
          className="flex flex-col items-center p-2 rounded-lg min-w-[60px] text-gray-500 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs mt-1 font-medium">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
