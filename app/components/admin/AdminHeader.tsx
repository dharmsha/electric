'use client';

// Option 1: Define it here (easiest)
type AdminTab = 'overview' | 'shops' | 'orders' | 'users' | 'verifications' | 'analytics';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  stats: any;
}

export default function AdminHeader({ activeTab, onTabChange, stats }: AdminHeaderProps) {
  const tabs = [
    { id: 'overview' as AdminTab, name: 'Overview', icon: '📊' },
    { id: 'shops' as AdminTab, name: 'Shops', icon: '🏪' },
    { id: 'orders' as AdminTab, name: 'Orders', icon: '📦' },
    { id: 'users' as AdminTab, name: 'Users', icon: '👥' },
    { id: 'verifications' as AdminTab, name: 'Verifications', icon: '✅', badge: stats.pendingVerifications },
    { id: 'analytics' as AdminTab, name: 'Analytics', icon: '📈' }
  ];

  return (
    <div className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage ElectroHub Platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 md:space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.badge && tab.badge > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}