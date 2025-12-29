'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/app/components/admin/AdminHeader'
import AdminStats from '@/app/components/admin/AdminStats'
import AdminShopsTable from '@/app/components/admin/AdminShopsTable'
import AdminOrdersTable from '@/app/components/admin/AdminOrdersTable'
import AdminUsersTable from '@/app/components/admin/AdminUsersTable'
import AdminVerifications from '@/app/components/admin/AdminVerifications'
import AdminAnalytics from '@/app/components/admin/AdminAnalytics'

type AdminTab = 'overview' | 'shops' | 'orders' | 'users' | 'verifications' | 'analytics';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, fetch from Firebase
  const [stats, setStats] = useState({
    totalShops: 1245,
    totalCustomers: 15678,
    totalOrders: 8923,
    pendingVerifications: 23,
    revenue: 4523000,
    activeShops: 987,
    todayOrders: 156,
    avgRating: 4.7
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <AdminStats stats={stats} />
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold mb-4">Recent Shops</h3>
                <AdminShopsTable limit={5} />
              </div>
              
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
                <AdminOrdersTable limit={5} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shops' && (
          <div className="bg-white rounded-xl shadow">
            <AdminShopsTable />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow">
            <AdminOrdersTable />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow">
            <AdminUsersTable />
          </div>
        )}

        {activeTab === 'verifications' && (
          <div className="bg-white rounded-xl shadow">
            <AdminVerifications />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow">
            <AdminAnalytics />
          </div>
        )}
      </div>
    </div>
  );
}