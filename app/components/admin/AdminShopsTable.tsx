'use client';

import { useState } from 'react';

interface Shop {
  id: string;
  name: string;
  owner: string;
  city: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  totalOrders: number;
  revenue: number;
  joinedDate: string;
}

export default function AdminShopsTable({ limit }: { limit?: number }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const shops: Shop[] = [
    { id: '1', name: 'Gupta Electronics', owner: 'Raj Gupta', city: 'Mumbai', category: 'Mobile Repair', status: 'active', rating: 4.8, totalOrders: 156, revenue: 245000, joinedDate: '2024-01-15' },
    { id: '2', name: 'Sharma Repair Center', owner: 'Amit Sharma', city: 'Delhi', category: 'AC Service', status: 'active', rating: 4.5, totalOrders: 89, revenue: 189000, joinedDate: '2024-02-20' },
    { id: '3', name: 'Patel Mobile World', owner: 'Suresh Patel', city: 'Bangalore', category: 'Mobile Sales', status: 'pending', rating: 0, totalOrders: 0, revenue: 0, joinedDate: '2024-03-10' },
    { id: '4', name: 'Kumar TV Services', owner: 'Vijay Kumar', city: 'Hyderabad', category: 'TV Repair', status: 'active', rating: 4.9, totalOrders: 234, revenue: 367000, joinedDate: '2024-01-05' },
    { id: '5', name: 'Singh Appliances', owner: 'Gurpreet Singh', city: 'Chennai', category: 'Home Appliances', status: 'inactive', rating: 4.2, totalOrders: 67, revenue: 89000, joinedDate: '2024-02-28' },
    { id: '6', name: 'Reddy AC Center', owner: 'Kiran Reddy', city: 'Mumbai', category: 'AC Repair', status: 'active', rating: 4.7, totalOrders: 178, revenue: 312000, joinedDate: '2024-01-22' },
    { id: '7', name: 'Joshi Computer Hub', owner: 'Rahul Joshi', city: 'Pune', category: 'Laptop Repair', status: 'pending', rating: 0, totalOrders: 0, revenue: 0, joinedDate: '2024-03-05' },
    { id: '8', name: 'Desai Electronics', owner: 'Manoj Desai', city: 'Ahmedabad', category: 'Electronics Store', status: 'active', rating: 4.6, totalOrders: 145, revenue: 256000, joinedDate: '2024-02-10' },
  ];

  const filteredShops = shops
    .filter(shop => 
      (search === '' || 
       shop.name.toLowerCase().includes(search.toLowerCase()) ||
       shop.owner.toLowerCase().includes(search.toLowerCase()) ||
       shop.city.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === 'all' || shop.status === statusFilter)
    )
    .slice(0, limit || shops.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVerify = (shopId: string) => {
    alert(`Verify shop ${shopId}`);
  };

  const handleSuspend = (shopId: string) => {
    alert(`Suspend shop ${shopId}`);
  };

  const handleActivate = (shopId: string) => {
    alert(`Activate shop ${shopId}`);
  };

  return (
    <div className="p-6">
      {!limit && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <h2 className="text-xl font-bold text-gray-900">Shops Management</h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="Search shops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shop
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              {!limit && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredShops.map((shop) => (
              <tr key={shop.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{shop.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                      <div className="text-sm text-gray-500">{shop.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{shop.owner}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{shop.city}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shop.status)}`}>
                    {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 font-medium">{shop.rating.toFixed(1)}</span>
                    <span className="ml-2 text-gray-500 text-sm">({shop.totalOrders})</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ₹{shop.revenue.toLocaleString()}
                  </div>
                </td>
                {!limit && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/shop/${shop.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      {shop.status === 'pending' && (
                        <button
                          onClick={() => handleVerify(shop.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Verify
                        </button>
                      )}
                      {shop.status === 'active' && (
                        <button
                          onClick={() => handleSuspend(shop.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Suspend
                        </button>
                      )}
                      {shop.status === 'inactive' && (
                        <button
                          onClick={() => handleActivate(shop.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!limit && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredShops.length}</span> of{' '}
            <span className="font-medium">{shops.length}</span> shops
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}