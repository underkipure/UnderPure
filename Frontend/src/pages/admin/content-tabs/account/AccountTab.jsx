import React, { useState, useEffect } from 'react';
import { useSiteSettingsStore, DEFAULTS } from '../../../../store/siteSettingsStore';
import { useAuthStore } from '../../../../store/authStore';
import { toast } from 'sonner';

import AccountHeader from './components/AccountHeader';
import AccountNavMenuEditor from './components/AccountNavMenuEditor';
import AccountDashboardEditor from './components/AccountDashboardEditor';
import AccountEmptyStatesEditor from './components/AccountEmptyStatesEditor';
import AccountPersonalInfoEditor from './components/AccountPersonalInfoEditor';
import AccountPasswordEditor from './components/AccountPasswordEditor';
import AccountAddressBookEditor from './components/AccountAddressBookEditor';
import AccountOrdersTableEditor from './components/AccountOrdersTableEditor';
import AccountLogoutEditor from './components/AccountLogoutEditor';
import AccountHeroExtrasEditor from './components/AccountHeroExtrasEditor';
import AccountFooterLinksEditor from './components/AccountFooterLinksEditor';

export default function AccountTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);

  const [d, setD] = useState(settings.accountData || DEFAULTS.accountData);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFileToServer = (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend'}/upload/image?folder=account_media`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            let percentComplete = Math.round((event.loaded / event.total) * 100);
            if (percentComplete > 95) percentComplete = 95;
            onProgress(percentComplete);
          }
        };
      }
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (onProgress) onProgress(100);
            resolve(data.url);
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData.error || 'Upload failed'));
          } catch (e) {
            reject(new Error('Upload failed'));
          }
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });
  };

  const handleHeroMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const localPreviewUrl = URL.createObjectURL(file);
    update({ heroImage: localPreviewUrl });
    setUploadingHero(true);
    setUploadProgress(0);
    try {
      const serverUrl = await uploadFileToServer(file, (progress) => {
        setUploadProgress(progress);
      });
      update({ heroImage: serverUrl });
      URL.revokeObjectURL(localPreviewUrl);
    } catch (err) {
      toast.error('Media upload failed. Please try again.');
      update({ heroImage: settings.accountData?.heroImage || '' });
      URL.revokeObjectURL(localPreviewUrl);
    } finally {
      setUploadingHero(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (settings._loaded && settings.accountData) {
      setD(settings.accountData);
    }
  }, [settings._loaded]);

  const update = (patch) => setD(prev => ({ ...prev, ...patch }));

  const handleSave = async () => {
    await updateSettings({ accountData: d }, token);
    toast.success('Account page content saved!');
  };

  return (
    <div className="bg-white border border-black/10 p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      <AccountHeader handleSave={handleSave} />
      
      {/* Navigation Menu */}
      <AccountNavMenuEditor navigation={d.navigation} update={update} />

      {/* Dashboard Messaging */}
      <AccountDashboardEditor dashboard={d.dashboard} update={update} />

      {/* Empty States */}
      <AccountEmptyStatesEditor emptyStates={d.emptyStates} update={update} />

      {/* Personal Information */}
      <AccountPersonalInfoEditor personalInfo={d.personalInfo} update={update} />

      {/* Change Password */}
      <AccountPasswordEditor password={d.password} update={update} />

      {/* Address Book */}
      <AccountAddressBookEditor addressBook={d.addressBook} update={update} />

      {/* Order History Columns */}
      <AccountOrdersTableEditor orders={d.orders} update={update} />

      {/* Logout */}
      <AccountLogoutEditor logout={d.logout} update={update} />

      {/* Hero Image & Extra Sections */}
      <AccountHeroExtrasEditor
        d={d}
        update={update}
        uploadingHero={uploadingHero}
        uploadProgress={uploadProgress}
        handleHeroMediaUpload={handleHeroMediaUpload}
      />

      {/* Account Footer & Country Links */}
      <AccountFooterLinksEditor footerLinks={d.footerLinks} update={update} />
    </div>
  );
}
