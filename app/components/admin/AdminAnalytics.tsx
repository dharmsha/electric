'use client';

import { useState } from 'react';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');

  const analyticsData = {
    orders: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [120, 190, 300, 500, 200, 300]
    },
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [150000, 220000, 350000, 450000, 280000, 520000]
    },
    topCities: [
      { city: 'Mumbai', shops: 245, orders: 1256, revenue: 4523000 },
      { city: 'Delhi', shops: 198, orders: 987, revenue: 3890000 },
      { city: 'Bangalore', shops: 167, orders: 856, revenue: 3210000 },
      { city: 'Hyderabad', shops: 132, orders: 654, revenue: 2450000 },
      { city: 'Chennai', shops: 98, orders: 432, revenue: 1890000 },
    ],
    topCategories: [
      { category: 'Mobile Repair', shops: 156, orders: 2345 },
      { category: 'AC Service', shops: 89, orders: 1678 },
      { category: 'TV Repair', shops: 67, orders: 1234 },
      { category: 'Laptop Repair', shops: 54, orders: 987 },
      { category: 'Home Appliances', shops: 45, orders: 765 },
    ]
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4">Orders Over Time</h3>
          <div className="h-64 flex items-end space-x-2">
            {analyticsData.orders.data.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg"
                  style={{ height: `${(value / 600) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">
                  {analyticsData.orders.labels[index]}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-gray-600">
            Total Orders: {analyticsData.orders.data.reduce((a, b) => a + b, 0)}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4">Revenue Over Time</h3>
          <div className="h-64 flex items-end space-x-2">
            {analyticsData.revenue.data.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-500 rounded-t-lg"
                  style={{ height: `${(value / 600000) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">
                  {analyticsData.revenue.labels[index]}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-gray-600">
            Total Revenue: ₹{(analyticsData.revenue.data.reduce((a, b) => a + b, 0) / 100000).toFixed(1)}L
          </div>
        </div>
      </div>

      {/* Top Cities & Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4">Top Cities by Performance</h3>
          <div className="space-y-4">
            {analyticsData.topCities.map((city, index) => (
              <div key={city.city} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{city.city}</div>
                    <div className="text-sm text-gray-500">{city.shops} shops</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{city.orders} orders</div>
                  <div className="text-sm text-gray-500">₹{(city.revenue / 100000).toFixed(1)}L</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-lg mb-4">Top Service Categories</h3>
          <div className="space-y-4">
            {analyticsData.topCategories.map((cat, index) => (
              <div key={cat.category} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{cat.category}</div>
                  <div className="text-sm text-gray-500">{cat.shops} shops</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(cat.orders / 2500) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-2">{cat.orders} total orders</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">98.2%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">4.7</div>
          <div className="text-sm text-gray-600">Avg. Rating</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">45min</div>
          <div className="text-sm text-gray-600">Avg. Response Time</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">12%</div>
          <div className="text-sm text-gray-600">MoM Growth</div>
        </div>
      </div>
    </div>
  );
}