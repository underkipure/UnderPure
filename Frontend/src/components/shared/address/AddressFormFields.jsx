import React from "react";
import { ChevronDown, Search, Phone } from "lucide-react";
import { useSiteSettingsStore } from "../../../store/siteSettingsStore";

export const DEFAULT_COUNTRIES = [
  "Pakistan",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "United Arab Emirates",
  "Saudi Arabia",
];

/**
 * Reusable AddressFormFields component for checkout and user account address management.
 *
 * @param {Object} props
 * @param {'checkout'|'account'} [props.variant='checkout']
 * @param {Object} props.values - Current values for fields
 * @param {Function} props.onChange - Change handler, receives (e) event with target.name and target.value
 * @param {Object} [props.errors] - Field-level error messages
 * @param {boolean} [props.isMobile=false] - Responsive layout toggle for checkout
 * @param {string[]} [props.countries] - Country options
 */
export function AddressFormFields({
  variant = "checkout",
  values = {},
  onChange,
  errors = {},
  isMobile = false,
  countries,
}) {
  const storeCountries = useSiteSettingsStore((s) => s.checkoutSettings?.supportedCountries);
  const countryOptions = (countries && countries.length > 0)
    ? countries
    : (storeCountries && storeCountries.length > 0 ? storeCountries : DEFAULT_COUNTRIES);

  const isAccount = variant === "account";

  // Field values with fallbacks across naming conventions
  const country = values.country || "Pakistan";
  const fullName = values.full_name || `${values.firstName || ""} ${values.lastName || ""}`.trim();
  const firstName = values.firstName || (values.full_name ? values.full_name.split(" ")[0] : "");
  const lastName =
    values.lastName ||
    (values.full_name ? values.full_name.split(" ").slice(1).join(" ") : "");
  const address1 = values.address_line1 ?? values.address ?? "";
  const address2 = values.address_line2 ?? values.apartment ?? "";
  const city = values.city || "";
  const state = values.state || "";
  const zip = values.zip ?? values.postalCode ?? "";
  const phone = values.phone || "";

  const handleFieldChange = (name, val) => {
    if (onChange) {
      onChange({ target: { name, value: val } });
    }
  };

  if (isAccount) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country */}
        <div className="md:col-span-2 border border-gray-200 rounded-lg p-3 relative">
          <label className="block text-[10px] font-sans text-gray-500 mb-1">
            Country/region
          </label>
          <div className="relative">
            <select
              name="country"
              value={country}
              onChange={(e) => handleFieldChange("country", e.target.value)}
              className="w-full text-[13px] font-sans outline-none bg-transparent appearance-none cursor-pointer pr-6 text-gray-900"
            >
              {countryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Full Name */}
        <div
          className={`md:col-span-2 border rounded-lg p-3 ${
            errors.full_name ? "border-red-400" : "border-[#b3004d]"
          }`}
        >
          <label className="block text-[10px] font-sans text-gray-500 mb-1">
            Full name
          </label>
          <input
            type="text"
            name="full_name"
            required
            value={fullName}
            onChange={(e) => handleFieldChange("full_name", e.target.value)}
            className="w-full text-[13px] font-sans outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="First and last name"
          />
          {errors.full_name && (
            <p className="text-[10px] text-red-500 mt-1">{errors.full_name}</p>
          )}
        </div>

        {/* Street Address */}
        <div
          className={`md:col-span-2 border rounded-lg p-3 ${
            errors.address_line1 || errors.address ? "border-red-400" : "border-gray-200"
          }`}
        >
          <label className="block text-[10px] font-sans text-gray-500 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address_line1"
            required
            value={address1}
            onChange={(e) => {
              handleFieldChange("address_line1", e.target.value);
              handleFieldChange("address", e.target.value);
            }}
            className="w-full text-[13px] font-sans outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="Street address"
          />
          {(errors.address_line1 || errors.address) && (
            <p className="text-[10px] text-red-500 mt-1">
              {errors.address_line1 || errors.address}
            </p>
          )}
        </div>

        {/* Apartment */}
        <div className="md:col-span-2 border border-gray-200 rounded-lg p-3">
          <label className="block text-[10px] font-sans text-gray-500 mb-1">
            Apartment, suite, etc (optional)
          </label>
          <input
            type="text"
            name="address_line2"
            value={address2}
            onChange={(e) => {
              handleFieldChange("address_line2", e.target.value);
              handleFieldChange("apartment", e.target.value);
            }}
            className="w-full text-[13px] font-sans outline-none bg-transparent text-gray-900"
          />
        </div>

        {/* City */}
        <div
          className={`border rounded-lg p-3 ${
            errors.city ? "border-red-400" : "border-gray-200"
          }`}
        >
          <label className="block text-[10px] font-sans text-gray-500 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            required
            value={city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            className="w-full text-[13px] font-sans outline-none bg-transparent text-gray-900"
          />
          {errors.city && (
            <p className="text-[10px] text-red-500 mt-1">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div className="border border-gray-200 rounded-lg p-3">
          <label className="block text-[10px] font-sans text-gray-500 mb-1">
            State / Province
          </label>
          <input
            type="text"
            name="state"
            value={state}
            onChange={(e) => handleFieldChange("state", e.target.value)}
            className="w-full text-[13px] font-sans outline-none bg-transparent text-gray-900"
          />
        </div>

        {/* ZIP / Postal Code */}
        <div className="border border-gray-200 rounded-lg p-3">
          <label className="block text-[10px] font-sans text-gray-500 mb-1">
            ZIP code
          </label>
          <input
            type="text"
            name="zip"
            value={zip}
            onChange={(e) => {
              handleFieldChange("zip", e.target.value);
              handleFieldChange("postalCode", e.target.value);
            }}
            className="w-full text-[13px] font-sans outline-none bg-transparent text-gray-900"
          />
        </div>

        {/* Phone */}
        <div
          className={`border rounded-lg p-3 ${
            errors.phone ? "border-red-400" : "border-gray-200"
          }`}
        >
          <label className="block text-[10px] font-sans text-gray-500 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            className="w-full text-[13px] font-sans outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="+92 300 1234567"
          />
          {errors.phone && (
            <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>
      </div>
    );
  }

  // Checkout variant
  const inputBaseStyle = isMobile
    ? "w-full border border-gray-300 rounded-lg py-2.5 px-3 text-[12px] text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-gray-400 font-sans"
    : "border border-gray-300 rounded-lg py-2 px-3 text-[11.5px] bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-gray-400 font-sans";

  return (
    <div className="space-y-2">
      {/* Country Select */}
      <div className="relative">
        <select
          name="country"
          aria-label="Country or Region"
          value={country}
          onChange={(e) => handleFieldChange("country", e.target.value)}
          className={`w-full ${inputBaseStyle} appearance-none cursor-pointer pr-8 text-gray-800`}
        >
          {countryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {/* First Name & Last Name */}
      <div className={isMobile ? "space-y-2" : "flex gap-2"}>
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          value={firstName}
          onChange={(e) => {
            handleFieldChange("firstName", e.target.value);
            handleFieldChange(
              "full_name",
              `${e.target.value} ${lastName}`.trim()
            );
          }}
          className={`${isMobile ? "" : "flex-1 "} ${inputBaseStyle}`}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => {
            handleFieldChange("lastName", e.target.value);
            handleFieldChange(
              "full_name",
              `${firstName} ${e.target.value}`.trim()
            );
          }}
          className={`${isMobile ? "" : "flex-1 "} ${inputBaseStyle}`}
        />
      </div>

      {/* Street Address */}
      <div className="relative">
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={address1}
          onChange={(e) => {
            handleFieldChange("address", e.target.value);
            handleFieldChange("address_line1", e.target.value);
          }}
          className={`w-full ${inputBaseStyle} ${isMobile ? "pr-9" : ""}`}
        />
        {isMobile && (
          <Search
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        )}
      </div>

      {/* Apartment / Suite */}
      <input
        type="text"
        name="apartment"
        placeholder="Apartment, suite, etc. (optional)"
        value={address2}
        onChange={(e) => {
          handleFieldChange("apartment", e.target.value);
          handleFieldChange("address_line2", e.target.value);
        }}
        className={`w-full ${inputBaseStyle}`}
      />

      {/* City & Postal Code */}
      <div className={isMobile ? "space-y-2" : "flex gap-2"}>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={city}
          onChange={(e) => handleFieldChange("city", e.target.value)}
          className={`${isMobile ? "" : "flex-1 "} ${inputBaseStyle}`}
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal code (optional)"
          value={zip}
          onChange={(e) => {
            handleFieldChange("postalCode", e.target.value);
            handleFieldChange("zip", e.target.value);
          }}
          className={`${isMobile ? "" : "flex-1 "} ${inputBaseStyle}`}
        />
      </div>

      {/* Mobile Phone (Optional or with phone icon) */}
      <div className="relative">
        <input
          type="tel"
          name="phone"
          placeholder={isMobile ? "Mobile phone (optional)" : "Phone (optional)"}
          value={phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          className={`w-full ${inputBaseStyle} ${isMobile ? "pl-9" : ""}`}
        />
        {isMobile && (
          <Phone
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        )}
      </div>
    </div>
  );
}
