import { useState, useEffect } from "react";

export function useCheckoutForm(user) {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.name ? user.name.split(" ")[0] : "",
    lastName: user?.name ? user.name.split(" ").slice(1).join(" ") : "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: user?.phone || "",
    country: "Pakistan",
  });

  useEffect(() => {
    if (!user) return;

    const baseUpdate = {
      email: user.email || "",
      firstName: user.name ? user.name.split(" ")[0] : "",
      lastName: user.name ? user.name.split(" ").slice(1).join(" ") : "",
      phone: user.phone || "",
    };

    if (user.defaultAddress) {
      const def = user.defaultAddress;
      setFormData((prev) => ({
        ...prev,
        ...baseUpdate,
        firstName: def.full_name
          ? def.full_name.split(" ")[0]
          : baseUpdate.firstName,
        lastName: def.full_name
          ? def.full_name.split(" ").slice(1).join(" ")
          : baseUpdate.lastName,
        address: def.address_line1 || "",
        apartment: def.address_line2 || "",
        city: def.city || "",
        postalCode: def.zip || "",
        phone: def.phone || baseUpdate.phone,
        country: def.country || "Pakistan",
      }));
    } else {
      setFormData((prev) => ({ ...prev, ...baseUpdate }));
      const token = localStorage.getItem("auth_token");
      if (token) {
        fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/addresses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              const defaultAddress =
                data.find((a) => a.is_default == 1) || data[0];
              setFormData((prev) => ({
                ...prev,
                firstName: defaultAddress.full_name
                  ? defaultAddress.full_name.split(" ")[0]
                  : prev.firstName,
                lastName: defaultAddress.full_name
                  ? defaultAddress.full_name.split(" ").slice(1).join(" ")
                  : prev.lastName,
                address: defaultAddress.address_line1 || "",
                apartment: defaultAddress.address_line2 || "",
                city: defaultAddress.city || "",
                postalCode: defaultAddress.zip || "",
                phone: defaultAddress.phone || prev.phone,
                country: defaultAddress.country || "Pakistan",
              }));
            }
          })
          .catch(console.error);
      }
    }
  }, [user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
  };
}
