import { useState, useCallback } from "react";

/**
 * Validates customer address data for both checkout and account profiles.
 *
 * @param {Object} data - Address data object (supports checkout and account field conventions)
 * @param {Object} [options]
 * @param {'checkout'|'account'} [options.mode='checkout']
 * @param {boolean} [options.requirePhone=false]
 * @returns {{ isValid: boolean, errors: Record<string, string>, firstError: string|null }}
 */
export function validateAddress(data = {}, options = {}) {
  const { mode = "checkout", requirePhone = false } = options;
  const errors = {};

  // Name validation
  if (mode === "checkout") {
    const firstName = data.firstName || data.first_name || "";
    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }
  } else {
    const fullName = data.full_name || data.name || "";
    if (!fullName.trim()) {
      errors.full_name = "Full name is required";
    }
  }

  // Street address validation
  const street = data.address || data.address_line1 || "";
  if (!street.trim()) {
    const key = mode === "checkout" ? "address" : "address_line1";
    errors[key] = "Street address is required";
  }

  // City validation
  const city = data.city || "";
  if (!city.trim()) {
    errors.city = "City is required";
  }

  // Phone validation
  const phone = (data.phone || "").trim();
  if (requirePhone && !phone) {
    errors.phone = "Mobile phone number is required";
  } else if (phone) {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    if (!/^\+?[0-9]{10,15}$/.test(cleaned)) {
      errors.phone = "Please enter a valid phone number (min 10 digits)";
    }
  }

  const keys = Object.keys(errors);
  return {
    isValid: keys.length === 0,
    errors,
    firstError: keys.length > 0 ? errors[keys[0]] : null,
  };
}

/**
 * React hook for address validation state and triggers.
 */
export function useAddressValidation(initialErrors = {}) {
  const [errors, setErrors] = useState(initialErrors);

  const validate = useCallback((data, options) => {
    const result = validateAddress(data, options);
    setErrors(result.errors);
    return result;
  }, []);

  const clearError = useCallback((fieldName) => {
    setErrors((prev) => {
      if (!prev[fieldName]) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    setErrors,
    validate,
    clearError,
    clearAllErrors,
  };
}
