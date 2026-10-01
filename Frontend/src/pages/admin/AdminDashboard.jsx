import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, Users, Activity, AlertTriangle, Package, Plus, Edit3, ExternalLink } from 'lucide-react';
import { fetchAdminStats } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { AdminStatCard } from '../../components/admin/shared';

const statusColors = {
  pending:    'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped:    'bg-purple-100 text-purple-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminStats(token);
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const fmt = (n) => {
    if (n === undefined || n === null) return '—';
    return Number(n).toLocaleString('en-PK', { maximumFractionDigits: 0 });
  };

  const kpis = stats
    ? [
        { label: 'Total Revenue',  value: `Rs. ${fmt(stats.totalRevenue)}`,  change: `${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange}%`,  isUp: stats.revenueChange >= 0,  icon: DollarSign, link: '/admin/orders' },
        { label: 'Orders',         value: fmt(stats.totalOrders),             change: `${stats.ordersChange > 0 ? '+' : ''}${stats.ordersChange}%`,     isUp: stats.ordersChange >= 0,   icon: ShoppingBag, link: '/admin/orders' },
        { label: 'Customers',      value: fmt(stats.totalCustomers),          change: `${stats.customersChange > 0 ? '+' : ''}${stats.customersChange}%`,isUp: stats.customersChange >= 0,icon: Users, link: '/admin/customers' },
        { label: 'Products',       value: fmt(stats.totalProducts),           change: '',                                                                isUp: true,                      icon: Activity, link: '/admin/products' },
      ]
    : [];

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="font-serif text-3xl mb-2 text-black">Dashboard</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Loading live data…</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white p-6 border border-black/10 h-28 animate-pulse rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="font-serif text-3xl mb-2 text-black">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm rounded-sm flex items-center gap-3">
          <AlertTriangle size={18} />
          <span>Failed to load stats: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header + Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-1 text-black">Dashboard</h1>
          <p className="text-gray-500 text-xs tracking-widest uppercase">Welcome back, Admin. Here's what's happening.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center gap-2 px-3.5 py-2 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-sm"
          >
            <Plus size={14} /> Add Product
          </button>
          <button
            onClick={() => navigate('/admin/content')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 text-black text-xs uppercase tracking-widest hover:border-black transition-colors rounded-sm"
          >
            <Edit3 size={14} /> Edit Storefront
          </button>
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 text-black text-xs uppercase tracking-widest hover:border-black transition-colors rounded-sm"
          >
            <ExternalLink size={14} /> Storefront
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <AdminStatCard
            key={index}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            change={kpi.change}
            isUp={kpi.isUp}
            onClick={kpi.link ? () => navigate(kpi.link) : undefined}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-black/10 rounded-sm shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-black/10 flex justify-between items-center bg-gray-50/40">
            <div>
              <h2 className="font-serif text-xl text-black">Recent Orders</h2>
              <p className="text-[11px] uppercase tracking-widest text-gray-400">Latest customer orders</p>
            </div>
            <button 
              onClick={() => navigate('/admin/orders')} 
              className="text-xs uppercase tracking-widest px-3 py-1.5 border border-black/10 hover:border-black hover:bg-black hover:text-white transition-all rounded-sm"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
              <thead>
                <tr className="border-b border-black/10 text-[10px] uppercase tracking-widest text-gray-500 bg-gray-50/80">
                  <th className="p-4 font-semibold">Order</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {stats?.recentOrders?.length > 0 ? stats.recentOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => navigate('/admin/orders')}
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-serif text-base font-medium group-hover:underline">#{order.id}</td>
                    <td className="p-4 text-gray-700">{order.shipping_name || order.userEmail || '—'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-semibold text-black">Rs. {fmt(order.total)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-400 text-xs uppercase tracking-widest">
                      No orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Low Stock + Quick Actions */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          {stats?.lowStockTotalCount > 0 && (
            <div className="bg-white border border-black/10 p-6 rounded-sm shadow-2xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-orange-500" />
                  <h2 className="font-serif text-lg text-black">Low Stock Alert</h2>
                </div>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-mono rounded-full font-bold">
                  {stats.lowStockTotalCount}
                </span>
              </div>
              <div className="space-y-3.5">
                {stats.lowStockVariants?.slice(0, 4).map((v, i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate('/admin/products')}
                    className="flex justify-between items-center text-sm pb-2.5 border-b border-black/5 last:border-none last:pb-0 hover:bg-gray-50 -mx-2 px-2 py-1 rounded cursor-pointer transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-black truncate text-xs">{v.name}</p>
                      <p className="text-gray-400 text-[11px] uppercase tracking-wider">{v.color} · Size {v.size}</p>
                    </div>
                    <span className={`text-xs font-bold ${v.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                      {v.stock === 0 ? 'Out' : `${v.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/admin/products')} className="mt-4 text-xs uppercase tracking-widest text-black underline underline-offset-4 font-semibold hover:text-orange-700">
                Manage Inventory
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white border border-black/10 p-6">
            <h2 className="font-serif text-xl mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => navigate('/admin/products')} className="w-full p-4 border border-black/10 hover:border-black transition-colors text-left group">
                <h3 className="text-sm font-semibold uppercase tracking-widest mb-1 group-hover:text-black">Add Product</h3>
                <p className="text-xs text-gray-500">Create a new product listing.</p>
              </button>
              <button onClick={() => navigate('/admin/content')} className="w-full p-4 border border-black/10 hover:border-black transition-colors text-left group">
                <h3 className="text-sm font-semibold uppercase tracking-widest mb-1 group-hover:text-black">Update Homepage</h3>
                <p className="text-xs text-gray-500">Edit hero banners for the new season.</p>
              </button>
              <button onClick={() => navigate('/admin/orders')} className="w-full p-4 border border-black/10 hover:border-black transition-colors text-left group">
                <h3 className="text-sm font-semibold uppercase tracking-widest mb-1 group-hover:text-black flex items-center gap-2">
                  <Package size={14} />
                  Pending Orders
                  {stats?.pendingOrders > 0 && (
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded-full">{stats.pendingOrders}</span>
                  )}
                </h3>
                <p className="text-xs text-gray-500">Review and process new orders.</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
