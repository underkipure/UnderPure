import React, { useState } from 'react';
import { toast } from 'sonner';

import AdminContentHeader from './components/AdminContentHeader';
import AdminContentTabsNav from './components/AdminContentTabsNav';
import AdminContentTabRenderer from './components/AdminContentTabRenderer';
import PublishSuccessModal from './components/PublishSuccessModal';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('homepage');
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handleSelectTab = (key) => {
    setActiveTab(key);
  };

  const handlePublish = () => {
    console.log('Publishing all content changes...');
    toast.success('All content changes published successfully!');
    setShowPublishModal(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <AdminContentHeader
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onPublish={handlePublish}
      />

      {/* Tabs Nav with Horizontal Scroll Controls */}
      <AdminContentTabsNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* Active Tab Content Area */}
      <AdminContentTabRenderer activeTab={activeTab} />

      {/* Luxury Theme Publish Modal */}
      <PublishSuccessModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
      />
    </div>
  );
}
