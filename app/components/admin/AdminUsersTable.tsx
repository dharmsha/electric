'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'shop_owner' | 'admin';
  status: 'active' | 'inactive';
  joinedDate: string;
  totalOrders: number;
  city: string;
}

export default function AdminUsersTable() {
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Mock data
  const users: User[] = [
    { id: '1', name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '9876543210', role: 'customer', status: 'active', joinedDate: '2024-01-15', totalOrders: 12, city: 'Mumbai' },
    { id: '2', name: 'Raj Gupta', email: 'raj@guptaelectronics.com', phone: '9876543211', role: 'shop_owner', status: 'active', joinedDate: '2024-01-10', totalOrders: 156, city: 'Mumbai' },
    { id: '3', name: 'Priya Patel', email: 'priya@gmail.com', phone: '9876543212', role: 'customer', status: 'active', joinedDate: '2024-02-20', totalOrders: 8, city: 'Delhi' },
    { id: '4', name: 'Amit Sharma', email: 'amit@sharmarepair.com', phone: '9876543213', role: 'shop_owner', status: 'active', joinedDate: '2024-02-18', totalOrders: 89, city: 'Delhi' },
    { id: '5', name: 'Admin User', email: 'admin@electrohub.com', phone: '9876543214', role: 'admin', status: 'active', joinedDate: '2024-01-01', totalOrders: 0, city: 'Bangalore' },
    { id: '6', name: 'Neha Gupta', email: 'neha@gmail.com', phone: '9876543215', role: 'customer', status: 'inactive', joinedDate: '2024-02-25', totalOrders: 3, city: 'Chennai' },
    { id: '7', name: 'Vijay Kumar', email: 'vijay@kumartv.com', phone: '9876543216', role: 'shop_owner', status: 'active', joinedDate: '2024-01-05', totalOrders: 234, city: 'Hyderabad' },
    { id: '8', name: 'Anjali Reddy', email: 'anjali@gmail.com', phone: '9876543217', role: 'customer', status: 'active', joinedDate: '2024-03-10', totalOrders: 5, city: 'Bangalore' },
  ];

  const filteredUsers = users.filter(user => 
    (roleFilter === 'all' || user.role === roleFilter) &&
    (search === '' || 
     user.name.toLowerCase().includes(search.toLowerCase()) ||
     user.email.toLowerCase().includes(search.toLowerCase()) ||
     user.city.toLowerCase().includes(search.toLowerCase()))
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'shop_owner': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    alert(`Change user ${userId} status to ${newStatus}`);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl font-bold text-gray-900">Users Management</h2>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="shop_owner">Shop Owners</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role === 'shop_owner' ? 'Shop Owner' : user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.city}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    className={`text-xs font-medium rounded px-2 py-1 ${getStatusColor(user.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.totalOrders}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.joinedDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => alert(`View user ${user.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Message
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
          <span className="font-medium">{users.length}</span> users
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
    </div>
  );
}