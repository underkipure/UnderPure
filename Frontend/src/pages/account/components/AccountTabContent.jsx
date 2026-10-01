import React from "react";
import AccountProfileTab from "./AccountProfileTab";
import AccountOrdersTab from "./AccountOrdersTab";
import AccountLovelistTab from "./AccountLovelistTab";

export function AccountTabContent({
  activeTab,
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
  handleViewDetails,
  lovelist,
  lovelistLoading,
  removeFromLovelist,
}) {
  switch (activeTab) {
    case "orders":
      return (
        <AccountOrdersTab
          d={d}
          orders={orders}
          ordersLoading={ordersLoading}
          handleViewDetails={handleViewDetails}
        />
      );

    case "lovelist":
      return (
        <AccountLovelistTab
          d={d}
          lovelist={lovelist}
          lovelistLoading={lovelistLoading}
          removeFromLovelist={removeFromLovelist}
        />
      );

    case "account":
    default:
      return (
        <AccountProfileTab
          d={d}
          user={user}
          profileData={profileData}
          setProfileData={setProfileData}
          isEditingContact={isEditingContact}
          setIsEditingContact={setIsEditingContact}
          handleProfileSubmit={handleProfileSubmit}
          isUpdating={isUpdating}
          addresses={addresses}
          addressesLoading={addressesLoading}
          setActiveTab={setActiveTab}
          orders={orders}
          ordersLoading={ordersLoading}
          tier2Threshold={tier2Threshold}
          tier3Threshold={tier3Threshold}
          tier4Threshold={tier4Threshold}
          tier5Threshold={tier5Threshold}
          signupBonus={signupBonus}
          spendUnit={spendUnit}
          pointsPerSpend={pointsPerSpend}
          birthdayBonus={birthdayBonus}
          emailMarketing={emailMarketing}
          setEmailMarketing={setEmailMarketing}
          logout={logout}
          logoutAll={logoutAll}
          navigate={navigate}
          showAddressForm={showAddressForm}
          setShowAddressForm={setShowAddressForm}
          addressForm={addressForm}
          setAddressForm={setAddressForm}
          editingAddressId={editingAddressId}
          setEditingAddressId={setEditingAddressId}
          saveAddress={saveAddress}
          deleteAddress={deleteAddress}
        />
      );
  }
}
