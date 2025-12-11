"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useRoleGuard = (allowedRoles) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      const access = localStorage.getItem("accessToken");
      const username = localStorage.getItem("username");

      if (!access || !username) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(`http://127.0.0.1:8000/users/${username}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setRole(data.role);

          if (!allowedRoles.includes(data.role) && data.role !== "admin") {
            router.push("/unauthorized"); // Create this simple page
          }
        } else {
          router.push("/");
        }
      } catch (err) {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router, allowedRoles]);

  return { loading, role };
};
