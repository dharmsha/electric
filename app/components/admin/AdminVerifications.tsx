'use client';

import { useState } from 'react';

interface VerificationRequest {
  id: string;
  shopName: string;
  ownerName: string;
  city: string;
  category: string;
  submittedDate: string;
  documents: number;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminVerifications() {
  const [requests, setRequests] = useState<VerificationRequest[]>([
    { id: '1', shopName: 'Patel Mobile World', ownerName: 'Suresh Patel', city: 'Bangalore', category: 'Mobile Sales', submittedDate: '2024-03-10', documents: 3, status: 'pending' },
    { id: '2', shopName: 'Joshi Computer Hub', ownerName: 'Rahul Joshi', city: 'Pune', category: 'Laptop Repair', submittedDate: '2024-03-05', documents: 4, status: 'pending' },
    { id: '3', shopName: 'Tech Gadget Store', ownerName: 'Anil Verma', city: 'Mumbai', category: 'Electronics', submittedDate: '2024-03-08', documents: 2, status: 'pending' },
    { id: '4', shopName: 'Cool AC Services', ownerName: 'Mohan Das', city: 'Delhi', category: 'AC Repair', submittedDate: '2024-03-12', documents: 3, status: 'pending' },
    { id: '5', shopName: 'Smart TV Repair', ownerName: 'Sanjay Mehta', city: 'Hyderabad', category: 'TV Services', submittedDate: '2024-03-03', documents: 5, status: 'pending' },
  ]);

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
    alert(`Shop ${id} approved!`);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: 'rejected' } : req
      ));
      alert(`Shop ${id} rejected: ${reason}`);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pending Verifications ({pendingRequests.length})
        </h2>
        
        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-lg font-medium mb-2">No pending verifications!</h4>
            <p className="text-gray-600">All shops are verified.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRequests.map(request => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{request.shopName}</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <span className="w-4 mr-2">👤</span>
                        <span>Owner: {request.ownerName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 mr-2">📍</span>
                        <span>Location: {request.city}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 mr-2">🏷️</span>
                        <span>Category: {request.category}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 mr-2">📅</span>
                        <span>Submitted: {request.submittedDate}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 mr-2">📄</span>
                        <span>Documents: {request.documents} files</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="text-yellow-800 font-medium mb-2">Documents Preview</div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="mr-2">📋</span>
                          <span>GST Certificate</span>
                          <a href="#" className="ml-2 text-blue-600 hover:underline">View</a>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="mr-2">🏢</span>
                          <span>Shop License</span>
                          <a href="#" className="ml-2 text-blue-600 hover:underline">View</a>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="mr-2">🆔</span>
                          <span>Owner ID Proof</span>
                          <a href="#" className="ml-2 text-blue-600 hover:underline">View</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200">
                  <div className="mb-4 md:mb-0">
                    <button className="text-blue-600 hover:text-blue-800 flex items-center">
                      <span className="mr-2">📞</span>
                      Contact Owner
                    </button>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason:');
                        if (reason) handleReject(request.id);
                      }}
                      className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      ✅ Approve Shop
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Verified */}
      <div>
        <h3 className="text-lg font-bold mb-4">Recently Verified Shops</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Verified On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests
                .filter(r => r.status === 'approved')
                .map(shop => (
                  <tr key={shop.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium">{shop.shopName}</div>
                      <div className="text-sm text-gray-500">{shop.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{shop.submittedDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Verified
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">
                        View Shop
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}