import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../../../store/authStore";

export function useAccountAddresses(user, activeTab) {
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip: "",
    country: "Pakistan",
    is_default: false,
  });

  const fetchAddresses = async () => {
    setAddressesLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/addresses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      const data = await res.json();
      const addrList = Array.isArray(data) ? data : [];
      setAddresses(addrList);

      const currentUser = useAuthStore.getState().user || {};
      const updatedUser = {
        ...currentUser,
        addresses: addrList,
        defaultAddress:
          addrList.find((a) => a.is_default) || addrList[0] || null,
      };
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      useAuthStore.setState({ user: updatedUser });
    } catch {
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      const method = editingAddressId ? "PUT" : "POST";
      const url = editingAddressId
        ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/addresses/${editingAddressId}`
        : `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/addresses`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save address");

      toast.success(editingAddressId ? "Address updated" : "Address added");
      setShowAddressForm(false);
      setEditingAddressId(null);
      fetchAddresses();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteAddress = (id) => {
    setAddressToDelete(id);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/addresses/${addressToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAddressToDelete(null);
    }
  };

  useEffect(() => {
    if (user && activeTab === "addresses") {
      fetchAddresses();
    }
  }, [activeTab, user]);

  return {
    addresses,
    setAddresses,
    addressesLoading,
    showAddressForm,
    setShowAddressForm,
    editingAddressId,
    setEditingAddressId,
    addressToDelete,
    setAddressToDelete,
    addressForm,
    setAddressForm,
    fetchAddresses,
    saveAddress,
    deleteAddress,
    confirmDeleteAddress,
  };
}
