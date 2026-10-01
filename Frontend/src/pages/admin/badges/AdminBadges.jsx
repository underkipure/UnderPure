import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { createBadge, updateBadge, deleteBadge } from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';
import { useSiteSettingsStore } from '../../../store/siteSettingsStore';
import { toast } from 'sonner';

import BadgesHeader from './components/BadgesHeader';
import BadgeForm from './components/BadgeForm';
import BadgesGrid from './components/BadgesGrid';
import HeaderPlacementModal from './components/HeaderPlacementModal';
import {
  isBadgeInHeader,
  buildUpdatedMenusForBadge,
  buildMenusWithoutBadge,
} from './utils/badgeHeaderHelpers';

const INITIAL_FORM_DATA = {
  name: '',
  color: '#000000',
  textColor: '#FFFFFF',
  description: '',
};

export default function AdminBadges() {
  const { globalBadges, setGlobalBadges } = useAdmin();
  const { token } = useAuthStore();
  const { megaMenuData, updateSettings } = useSiteSettingsStore();

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [headerModalBadge, setHeaderModalBadge] = useState(null);
  const [headerTargetType, setHeaderTargetType] = useState('main'); // 'main' | 'sub'
  const [targetMenuId, setTargetMenuId] = useState('');

  const handleOpenCreateForm = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleEdit = (badge) => {
    setFormData({
      name: badge.name || '',
      color: badge.color || '#000000',
      textColor: badge.textColor || '#FFFFFF',
      description: badge.description || '',
    });
    setEditingId(badge.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    try {
      if (editingId) {
        await updateBadge(token, editingId, formData);
        setGlobalBadges(
          globalBadges.map((b) => (b.id === editingId ? { ...b, ...formData } : b))
        );
        toast.success('Badge updated successfully');
      } else {
        const res = await createBadge(token, formData);
        setGlobalBadges([
          ...globalBadges,
          res?.badge || { ...formData, id: res?.id || Date.now(), productsCount: 0 },
        ]);
        toast.success('Badge created successfully');
      }
      handleCloseForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save badge');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBadge(token, id);
      setGlobalBadges(globalBadges.filter((b) => b.id !== id));
      toast.success('Badge deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete badge');
    }
  };

  const handleToggleHeader = (badge, inHeader) => {
    if (inHeader) {
      removeFromHeader(badge.name);
    } else {
      setHeaderModalBadge(badge);
      setHeaderTargetType('main');
      setTargetMenuId('');
    }
  };

  const handleAddBadgeToHeaderConfirmed = async () => {
    if (!headerModalBadge) return;
    try {
      const { menus, alreadyExists, message } = buildUpdatedMenusForBadge(
        megaMenuData?.menus,
        headerModalBadge,
        headerTargetType,
        targetMenuId
      );

      if (alreadyExists) {
        toast.info(message);
      } else {
        toast.success(message);
      }

      await updateSettings({ megaMenuData: { menus } }, token);
      setHeaderModalBadge(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update Header Menu');
    }
  };

  const removeFromHeader = async (badgeName) => {
    try {
      const updatedMenus = buildMenusWithoutBadge(megaMenuData?.menus, badgeName);
      await updateSettings({ megaMenuData: { menus: updatedMenus } }, token);
      toast.success(`Removed "${badgeName}" from Header Menu`);
    } catch (err) {
      toast.error('Failed to remove from Header');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <BadgesHeader onCreateClick={handleOpenCreateForm} />

      {showForm && (
        <BadgeForm
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          onCancel={handleCloseForm}
          onSave={handleSave}
        />
      )}

      <BadgesGrid
        badges={globalBadges}
        isBadgeInHeaderFn={(name) => isBadgeInHeader(name, megaMenuData)}
        onEditBadge={handleEdit}
        onDeleteBadge={handleDelete}
        onToggleHeader={handleToggleHeader}
      />

      <HeaderPlacementModal
        badge={headerModalBadge}
        targetType={headerTargetType}
        setTargetType={setHeaderTargetType}
        targetMenuId={targetMenuId}
        setTargetMenuId={setTargetMenuId}
        menus={megaMenuData?.menus}
        onClose={() => setHeaderModalBadge(null)}
        onConfirm={handleAddBadgeToHeaderConfirmed}
      />
    </div>
  );
}
