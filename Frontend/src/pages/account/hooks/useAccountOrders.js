import { useState, useEffect } from "react";

export function useAccountOrders(user, activeTab) {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedOrder]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    setTrackingInfo(null);
    if (order.tracking_number) {
      setTrackingLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/orders/${order.id}/track`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );
        const data = await res.json();
        if (data.tracking) setTrackingInfo(data.tracking);
        if (data.order) {
          setSelectedOrder(data.order);
          setOrders((prev) =>
            prev.map((o) => (o.id === data.order.id ? data.order : o))
          );
        }
      } catch (err) {
        console.error("Failed to fetch tracking info:", err);
      } finally {
        setTrackingLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, user]);

  return {
    orders,
    setOrders,
    ordersLoading,
    selectedOrder,
    setSelectedOrder,
    trackingInfo,
    trackingLoading,
    fetchOrders,
    handleViewDetails,
  };
}
