'use client';

import { useState } from 'react';

interface Order {
  id: string;
  customer: string;
  shop: string;
  service: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  payment: 'paid' | 'pending';
}

export default function AdminOrdersTable({ limit }: { limit?: number }) {
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const orders: Order[] = [
    { id: 'ORD001', customer: 'Rahul Sharma', shop: 'Gupta Electronics', service: 'Mobile Repair', amount: 1500, status: 'completed', date: '2024-03-20', payment: 'paid' },
    { id: 'ORD002', customer: 'Priya Patel', shop: 'Kumar TV Services', service: 'TV Repair', amount: 3200, status: 'in_progress', date: '2024-03-21', payment: 'paid' },
    { id: 'ORD003', customer: 'Amit Singh', shop: 'Reddy AC Center', service: 'AC Service', amount: 2800, status: 'pending', date: '2024-03-21', payment: 'pending' },
    { id: 'ORD004', customer: 'Neha Gupta', shop: 'Desai Electronics', service: 'Refrigerator Repair', amount: 4500, status: 'confirmed', date: '2024-03-20', payment: 'paid' },
    { id: 'ORD005', customer: 'Vikram Joshi', shop: 'Sharma Repair Center', service: 'Washing Machine', amount: 3800, status: 'completed', date: '2024-03-19', payment: 'paid' },
    { id: 'ORD006', customer: 'Anjali Reddy', shop: 'Patel Mobile World', service: 'Mobile Screen', amount: 2500, status: 'cancelled', date: '2024-03-21', payment: 'pending' },
    { id: 'ORD007', customer: 'Rajesh Kumar', shop: 'Singh Appliances', service: 'Microwave Repair', amount: 1800, status: 'in_progress', date: '2024-03-20', payment: 'paid' },
    { id: 'ORD008', customer: 'Sneha Desai', shop: 'Joshi Computer Hub', service: 'Laptop Repair', amount: 4200, status: 'pending', date: '2024-03-21', payment: 'pending' },
  ];

  const filteredOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .slice(0, limit || orders.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (payment: string) => {
    return payment === 'paid' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    alert(`Change order ${orderId} status to ${newStatus}`);
  };

  return (
    <div className="p-6">
      {!limit && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">Orders Management</h2>
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shop
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              {!limit && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  <div className="text-sm text-gray-500">{order.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customer}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.shop}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.service}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">₹{order.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-xs font-medium rounded px-2 py-1 ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentColor(order.payment)}`}>
                    {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                  </span>
                </td>
                {!limit && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/orders/${order.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Message
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}