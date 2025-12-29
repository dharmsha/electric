'use client';
interface AdminStatsProps {
  stats: {
    totalShops: number;
    totalCustomers: number;
    totalOrders: number;
    pendingVerifications: number;
    revenue: number;
    activeShops: number;
    todayOrders: number;
    avgRating: number;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      title: 'Total Shops',
      value: stats.totalShops.toLocaleString(),
      change: '+12%',
      icon: '🏪',
      color: 'blue'
    },
    {
      title: 'Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: '+24%',
      icon: '👥',
      color: 'green'
    },
    {
      title: 'Orders (30 days)',
      value: stats.totalOrders.toLocaleString(),
      change: '+18%',
      icon: '📦',
      color: 'purple'
    },
    {
      title: 'Revenue',
      value: `₹${(stats.revenue / 100000).toFixed(1)}L`,
      change: '+32%',
      icon: '💰',
      color: 'yellow'
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications,
      change: 'Needs action',
      icon: '✅',
      color: 'red'
    },
    {
      title: 'Avg Rating',
      value: stats.avgRating.toFixed(1),
      change: '⭐',
      icon: '⭐',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'indigo': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
            <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
          </div>
          <div className={`mt-4 text-xs font-medium ${
            stat.change.includes('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}