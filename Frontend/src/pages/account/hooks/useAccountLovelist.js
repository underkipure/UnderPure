import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useAccountLovelist(user, activeTab) {
  const [lovelist, setLovelist] = useState([]);
  const [lovelistLoading, setLovelistLoading] = useState(false);

  const fetchLovelist = async () => {
    setLovelistLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      const data = await res.json();
      setLovelist(Array.isArray(data) ? data : []);
    } catch {
      setLovelist([]);
    } finally {
      setLovelistLoading(false);
    }
  };

  const removeFromLovelist = async (productId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to remove from lovelist");
      toast.success("Removed from lovelist");
      fetchLovelist();
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (user && activeTab === "lovelist") {
      fetchLovelist();
    }
  }, [activeTab, user]);

  return {
    lovelist,
    setLovelist,
    lovelistLoading,
    fetchLovelist,
    removeFromLovelist,
  };
}
