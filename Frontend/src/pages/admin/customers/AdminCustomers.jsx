import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchCustomers, updateCustomerVip } from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';
import { useSiteSettingsStore } from '../../../store/siteSettingsStore';
import { toast } from 'sonner';

import CustomersHeader from './components/CustomersHeader';
import CustomersToolbar from './components/CustomersToolbar';
import CustomersFilterPills from './components/CustomersFilterPills';
import CustomerMobileCard from './components/CustomerMobileCard';
import CustomersDesktopTable from './components/CustomersDesktopTable';
import CustomersPagination from './components/CustomersPagination';
import CustomerPrivilegesModal from './components/CustomerPrivilegesModal';
import GlobalPrivilegesModal from './components/GlobalPrivilegesModal';

export default function AdminCustomers() {
  const { token } = useAuthStore();
  const PAGE_SIZE = 20;
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [vipFilter, setVipFilter] = useState('all');
  const [actioningId, setActioningId] = useState(null);

  const settings = useSiteSettingsStore();
  const globalPrivileges = settings.vipPrivilegesList || [];

  const [managingPrivilegesFor, setManagingPrivilegesFor] = useState(null);
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);

  const [managingGlobalPrivileges, setManagingGlobalPrivileges] = useState(false);
  const [newPrivilegeName, setNewPrivilegeName] = useState('');
  const [newPrivilegeDesc, setNewPrivilegeDesc] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadCustomers = useCallback(async (pageNumber = 1, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = {
        page: pageNumber,
        limit: PAGE_SIZE,
      };
      if (vipFilter && vipFilter !== 'all') params.vip = vipFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const data = await fetchCustomers(token, params);
      const list = Array.isArray(data) ? data : (data?.customers ?? []);
      const total = data?.total ?? list.length;
      const more = data?.hasMore ?? false;

      if (append) {
        setCustomers(prev => [...prev, ...list]);
      } else {
        setCustomers(list);
      }
      setTotalCount(total);
      setHasMore(more);
      setPage(pageNumber);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [token, vipFilter, debouncedSearch]);

  useEffect(() => {
    loadCustomers(1, false);
  }, [loadCustomers]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadCustomers(page + 1, true);
    }
  };

  const handleToggleVip = async (c) => {
    setActioningId(c.id);
    try {
      const isVipNow = !(c.is_vip || c.status === 'VIP');
      await updateCustomerVip(token, c.id, { is_vip: isVipNow ? 1 : 0 });
      toast.success(isVipNow ? 'Customer promoted to VIP' : 'VIP status removed');
      loadCustomers(1, false);
    } catch (error) {
      toast.error(error.message || 'Failed to update VIP status');
    } finally {
      setActioningId(null);
    }
  };

  const openPrivilegesModal = (c) => {
    setManagingPrivilegesFor(c);
    setSelectedPrivileges(Array.isArray(c.vipPrivileges) ? c.vipPrivileges : []);
  };

  const togglePrivilege = (privilegeName) => {
    setSelectedPrivileges(prev => 
      prev.includes(privilegeName) 
        ? prev.filter(p => p !== privilegeName)
        : [...prev, privilegeName]
    );
  };

  const handleSavePrivileges = async () => {
    try {
      await updateCustomerVip(token, managingPrivilegesFor.id, { 
        is_vip: 1, 
        vip_privileges: selectedPrivileges 
      });
      toast.success('VIP privileges updated');
      setManagingPrivilegesFor(null);
      loadCustomers();
    } catch (error) {
      toast.error(error.message || 'Failed to save privileges');
    }
  };

  const handleAddGlobalPrivilege = async (e) => {
    e.preventDefault();
    if (!newPrivilegeName.trim()) return;
    const newGlobalList = [...globalPrivileges, { 
      id: Date.now(), 
      name: newPrivilegeName.trim(), 
      description: newPrivilegeDesc.trim() 
    }];
    await settings.updateSettings({ vipPrivilegesList: newGlobalList }, token);
    setNewPrivilegeName('');
    setNewPrivilegeDesc('');
  };

  const handleRemoveGlobalPrivilege = async (id) => {
    const newGlobalList = globalPrivileges.filter(p => p.id !== id);
    await settings.updateSettings({ vipPrivilegesList: newGlobalList }, token);
  };

  const filtered = customers;

  const vipCount = customers.filter(c => c.is_vip || c.status === 'VIP').length;
  const regularCount = customers.length - vipCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <CustomersHeader 
        onOpenGlobalPrivileges={() => setManagingGlobalPrivileges(true)} 
      />

      <CustomersToolbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      {/* Quick Customer Pill Bar */}
      <CustomersFilterPills
        vipFilter={vipFilter}
        setVipFilter={setVipFilter}
        customersCount={customers.length}
        vipCount={vipCount}
        regularCount={regularCount}
      />

      {/* Customer View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-black/10">
          <Loader2 size={32} className="animate-spin text-black mb-4" />
          <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Loading customers...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-white border border-black/10 text-gray-400 italic">No customers found.</div>
      ) : (
        <>
          {/* Mobile Card View (md:hidden) */}
          <div className="md:hidden space-y-4">
            {filtered.map((c) => (
              <CustomerMobileCard
                key={c.id}
                customer={c}
                actioningId={actioningId}
                onOpenPrivileges={openPrivilegesModal}
                onToggleVip={handleToggleVip}
              />
            ))}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <CustomersDesktopTable
            customers={filtered}
            actioningId={actioningId}
            onOpenPrivileges={openPrivilegesModal}
            onToggleVip={handleToggleVip}
          />

          {/* Server-Side Load More Section */}
          <CustomersPagination
            displayedCount={customers.length}
            totalCount={totalCount}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
          />
        </>
      )}

      {/* Privileges Modal */}
      <CustomerPrivilegesModal
        customer={managingPrivilegesFor}
        globalPrivileges={globalPrivileges}
        selectedPrivileges={selectedPrivileges}
        onTogglePrivilege={togglePrivilege}
        onSave={handleSavePrivileges}
        onClose={() => setManagingPrivilegesFor(null)}
      />

      {/* Global Privileges Modal */}
      <GlobalPrivilegesModal
        isOpen={managingGlobalPrivileges}
        globalPrivileges={globalPrivileges}
        newPrivilegeName={newPrivilegeName}
        setNewPrivilegeName={setNewPrivilegeName}
        newPrivilegeDesc={newPrivilegeDesc}
        setNewPrivilegeDesc={setNewPrivilegeDesc}
        onAddGlobalPrivilege={handleAddGlobalPrivilege}
        onRemoveGlobalPrivilege={handleRemoveGlobalPrivilege}
        onClose={() => setManagingGlobalPrivileges(false)}
      />
    </div>
  );
}
