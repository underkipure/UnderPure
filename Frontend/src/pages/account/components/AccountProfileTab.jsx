import React from "react";
import { fixImageUrl, optimizeImage } from "../../../lib/productUtils";
import {
  AccountProfileContactSection,
  AccountProfileOrdersSection,
  AccountProfileLoyaltySection,
  AccountProfileAddressesSection,
  AccountProfileMarketingSection,
  AccountProfilePointsSection,
  AccountProfileSignoutSection,
} from "./profile";

export default function AccountProfileTab({
  d,
  user,
  profileData,
  setProfileData,
  isEditingContact,
  setIsEditingContact,
  handleProfileSubmit,
  isUpdating,
  addresses,
  addressesLoading,
  setActiveTab,
  orders,
  ordersLoading,
  tier2Threshold,
  tier3Threshold,
  tier4Threshold,
  tier5Threshold,
  signupBonus,
  spendUnit,
  pointsPerSpend,
  birthdayBonus,
  emailMarketing,
  setEmailMarketing,
  logout,
  logoutAll,
  navigate,
  showAddressForm,
  setShowAddressForm,
  addressForm,
  setAddressForm,
  editingAddressId,
  setEditingAddressId,
  saveAddress,
  deleteAddress,
}) {
  return (
    <div className="space-y-1 sm:space-y-10 animate-in fade-in duration-500 w-full relative">
      {/* Top Image Banner */}
      {d?.heroImage && (
        <div className="mb-6 sm:mb-10 w-full">
          <img
            loading="lazy"
            src={optimizeImage(fixImageUrl(d.heroImage), { width: 1200 })}
            alt="Account Profile"
            className="w-full md:w-[80%] aspect-square md:aspect-square object-cover object-center"
          />
        </div>
      )}

      {/* CONTACT Section */}
      <AccountProfileContactSection
        d={d}
        user={user}
        profileData={profileData}
        setProfileData={setProfileData}
        isEditingContact={isEditingContact}
        setIsEditingContact={setIsEditingContact}
        handleProfileSubmit={handleProfileSubmit}
        isUpdating={isUpdating}
        addresses={addresses}
        setAddressForm={setAddressForm}
        setEditingAddressId={setEditingAddressId}
        setShowAddressForm={setShowAddressForm}
      />

      {/* YOUR RECENT ORDERS Section */}
      <AccountProfileOrdersSection
        d={d}
        orders={orders}
        ordersLoading={ordersLoading}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />

      {/* LOYALTY Section */}
      <AccountProfileLoyaltySection
        d={d}
        user={user}
        tier2Threshold={tier2Threshold}
        tier3Threshold={tier3Threshold}
        tier4Threshold={tier4Threshold}
        tier5Threshold={tier5Threshold}
        navigate={navigate}
      />

      {/* LOVELIST Section */}
      <div className="w-full md:w-[80%]">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-serif text-[15px] sm:text-[17px] uppercase tracking-[0.0001em] font-medium text-black">
            {d?.navigation?.tab3 || "LOVELIST"}
          </h2>
        </div>
        <button
          onClick={() => navigate("/lovelist")}
          className="bg-black text-white text-[11px] uppercase tracking-[0.0001em] px-4 py-3.5 font-sans font-medium rounded-lg"
        >
          VIEW LOVELIST
        </button>
      </div>

      {/* ADDRESSES Section */}
      <AccountProfileAddressesSection
        d={d}
        addresses={addresses}
        addressesLoading={addressesLoading}
        showAddressForm={showAddressForm}
        setShowAddressForm={setShowAddressForm}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        editingAddressId={editingAddressId}
        setEditingAddressId={setEditingAddressId}
        saveAddress={saveAddress}
        deleteAddress={deleteAddress}
      />

      {/* MARKETING PREFERENCES */}
      <AccountProfileMarketingSection
        d={d}
        emailMarketing={emailMarketing}
        setEmailMarketing={setEmailMarketing}
      />

      {/* UP COINS / LOYALTY POINTS Section */}
      <AccountProfilePointsSection
        user={user}
        tier2Threshold={tier2Threshold}
        tier3Threshold={tier3Threshold}
        tier4Threshold={tier4Threshold}
        tier5Threshold={tier5Threshold}
        signupBonus={signupBonus}
        spendUnit={spendUnit}
        pointsPerSpend={pointsPerSpend}
        birthdayBonus={birthdayBonus}
        orders={orders}
        navigate={navigate}
      />

      {/* SIGN OUT Section */}
      <AccountProfileSignoutSection d={d} logout={logout} logoutAll={logoutAll} />
    </div>
  );
}
