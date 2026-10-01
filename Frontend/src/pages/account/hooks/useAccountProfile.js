import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useAccountProfile(user, updateProfile) {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [emailMarketing, setEmailMarketing] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile(profileData);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profileData,
    setProfileData,
    isUpdating,
    isEditingContact,
    setIsEditingContact,
    emailMarketing,
    setEmailMarketing,
    handleProfileSubmit,
  };
}
