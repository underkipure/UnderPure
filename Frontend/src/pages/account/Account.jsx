import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useSiteSettingsStore, DEFAULTS } from "../../store/siteSettingsStore";
import ConfirmModal from "../../components/ConfirmModal";
import AccountHeader from "./components/AccountHeader";
import AccountSidebar from "./components/AccountSidebar";
import AccountFooter from "./components/AccountFooter";
import AccountOrderDetailModal from "./components/AccountOrderDetailModal";
import { AccountTabContent } from "./components/AccountTabContent";
import {
  useAccountProfile,
  useAccountOrders,
  useAccountAddresses,
  useAccountLovelist,
} from "./hooks";

export default function Account() {
  const accountData = useSiteSettingsStore((s) => s.accountData);
  const loyaltySettings = useSiteSettingsStore((s) => s.loyaltySettings);
  const storeName = useSiteSettingsStore((s) => s.storeName);
  const d = accountData || DEFAULTS.accountData || {};

  // Dynamic loyalty config from DB (admin editable)
  const lc = loyaltySettings || {};
  const tier2Threshold = lc.tier2Threshold ?? 500;
  const tier3Threshold = lc.tier3Threshold ?? 1000;
  const tier4Threshold = lc.tier4Threshold ?? 2000;
  const tier5Threshold = lc.tier5Threshold ?? 5000;
  const signupBonus = lc.signupBonus ?? 200;
  const birthdayBonus = lc.birthdayBonus ?? 500;
  const pointsPerSpend = lc.pointsPerSpend ?? 10;
  const spendUnit = lc.spendUnit ?? 1000;

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab") || "account";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  const {
    user,
    updateProfile,
    logout,
    logoutAll,
    isAuthenticated,
    fetchMe,
  } = useAuthStore();

  useEffect(() => {
    const newTab = searchParams.get("tab");
    if (newTab) {
      setActiveTab(newTab);
    }
  }, [location.search]);

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem("auth_token")) {
      navigate("/login");
    } else if (isAuthenticated) {
      fetchMe();
    }
  }, [isAuthenticated, navigate, fetchMe]);

  // Profile Form Management
  const {
    profileData,
    setProfileData,
    isUpdating,
    isEditingContact,
    setIsEditingContact,
    emailMarketing,
    setEmailMarketing,
    handleProfileSubmit,
  } = useAccountProfile(user, updateProfile);

  // Orders & Tracking Management
  const {
    orders,
    ordersLoading,
    selectedOrder,
    setSelectedOrder,
    trackingInfo,
    trackingLoading,
    fetchOrders,
    handleViewDetails,
  } = useAccountOrders(user, activeTab);

  // Addresses Management
  const {
    addresses,
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
  } = useAccountAddresses(user, activeTab);

  // Lovelist Management
  const {
    lovelist,
    lovelistLoading,
    removeFromLovelist,
  } = useAccountLovelist(user, activeTab);

  // Fetch initial addresses and orders on mount for profile overview
  useEffect(() => {
    if (user) {
      fetchAddresses();
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    { id: "account", label: "Profile" },
    { id: "orders", label: "Orders" },
    ...(user?.isAdmin || user?.role === "admin" || user?.is_admin
      ? [{ id: "admin_portal", label: "Admin Portal" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-4 pt-2">
        {/* Minimal Custom Header for Account Page */}
        <AccountHeader storeName={storeName} />

        {addressToDelete && (
          <ConfirmModal
            title="Delete Address"
            message="Are you sure you want to delete this address? This action cannot be undone."
            onConfirm={confirmDeleteAddress}
            onCancel={() => setAddressToDelete(null)}
            confirmText="Delete"
          />
        )}

        <div className="flex flex-col lg:flex-row gap-1 lg:gap-[180px]">
          {/* Sidebar Navigation */}
          <AccountSidebar
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navigate={navigate}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 w-full max-w-full lg:max-w-[800px]">
            <AccountTabContent
              activeTab={activeTab}
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
              handleViewDetails={handleViewDetails}
              lovelist={lovelist}
              lovelistLoading={lovelistLoading}
              removeFromLovelist={removeFromLovelist}
            />
          </div>
        </div>

        {/* Minimal Custom Footer for Account Page */}
        <AccountFooter d={d} />
      </div>

      {/* Order Details Modal */}
      <AccountOrderDetailModal
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        trackingInfo={trackingInfo}
        trackingLoading={trackingLoading}
      />
    </div>
  );
}
