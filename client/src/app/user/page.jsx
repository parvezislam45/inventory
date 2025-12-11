'use client';

import { useRouter } from "next/navigation";

const UserDashboard = () => {
  const router = useRouter();

  const logout = async () => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    if (!access || !refresh) {
      localStorage.clear();
      router.push("/"); // Go home if no tokens
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

      // Clear storage and navigate home
      localStorage.clear();
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <div>
      <h1>Welcome to Dashboard. Please wait for admin approval.</h1>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
