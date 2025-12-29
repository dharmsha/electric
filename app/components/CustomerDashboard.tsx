'use client';

import { useState } from 'react';

const nearbyShops = [
  {
    id: 1,
    name: 'Gupta Electronics',
    distance: '0.5 km',
    rating: 4.8,
    services: ['Mobile Repair', 'TV Repair', 'AC Service'],
    products: ['Mobiles', 'TVs', 'AC Units'],
    openNow: true,
    homeService: true,
    verified: true,
    image: '🛒'
  },
  {
    id: 2,
    name: 'Sharma Repair Center',
    distance: '1.2 km',
    rating: 4.5,
    services: ['Laptop Repair', 'Computer Repair'],
    products: ['Laptops', 'Computer Parts'],
    openNow: true,
    homeService: true,
    verified: true,
    image: '💻'
  },
  {
    id: 3,
    name: 'Kumar AC Services',
    distance: '2.1 km',
    rating: 4.9,
    services: ['AC Installation', 'AC Repair', 'AC Gas Refill'],
    products: ['AC Units', 'Coolers'],
    openNow: false,
    homeService: true,
    verified: true,
    image: '❄️'
  },
  {
    id: 4,
    name: 'Patel Mobile World',
    distance: '0.8 km',
    rating: 4.7,
    services: ['Mobile Repair', 'Screen Replacement'],
    products: ['Mobile Phones', 'Accessories'],
    openNow: true,
    homeService: false,
    verified: true,
    image: '📱'
  }
];

const orders = [
  {
    id: 'ORD001',
    shop: 'Gupta Electronics',
    service: 'AC Repair',
    date: 'Today, 10:00 AM',
    status: 'In Progress',
    technician: 'Ramesh Kumar',
    amount: '₹1,500'
  },
  {
    id: 'ORD002',
    shop: 'Patel Mobile World',
    service: 'Mobile Screen Replacement',
    date: 'Yesterday',
    status: 'Completed',
    technician: 'Amit Patel',
    amount: '₹2,800'
  }
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('nearby');
  const [selectedShop, setSelectedShop] = useState<number | null>(null);

  const bookService = (shopId: number) => {
    setSelectedShop(shopId);
    alert(`Booking service with shop ${shopId}. Opening booking form...`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, Customer!</h1>
        <p className="opacity-90">Find electronics shops & services near you</p>
        <div className="mt-4 flex items-center bg-white/20 p-3 rounded-lg">
          <span className="mr-3">📍</span>
          <div>
            <div className="font-medium">Current Location: Andheri East, Mumbai</div>
            <button className="text-sm underline">Change Location</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['nearby', 'orders', 'favorites', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'nearby' ? 'Nearby Shops' : 
             tab === 'orders' ? 'My Orders' :
             tab === 'favorites' ? 'Favorite Shops' : 'History'}
          </button>
        ))}
      </div>

      {/* Nearby Shops Tab */}
      {activeTab === 'nearby' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Electronics Shops Near You (4 km radius)
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {nearbyShops.map(shop => (
                <div key={shop.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{shop.image}</div>
                      <div>
                        <h3 className="font-bold text-lg">{shop.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 font-medium">{shop.rating}</span>
                          <span className="mx-2">•</span>
                          <span className="text-gray-600">{shop.distance} away</span>
                        </div>
                      </div>
                    </div>
                    {shop.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        ✅ Verified
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Services:</div>
                    <div className="flex flex-wrap gap-2">
                      {shop.services.map(service => (
                        <span key={service} className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">Products Available:</div>
                    <div className="flex flex-wrap gap-2">
                      {shop.products.map(product => (
                        <span key={product} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className={`flex items-center text-sm ${shop.openNow ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                        {shop.openNow ? 'Open Now' : 'Closed'}
                      </div>
                      {shop.homeService && (
                        <div className="text-sm text-blue-600">🏠 Home Service Available</div>
                      )}
                    </div>
                    <button
                      onClick={() => bookService(shop.id)}
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Booking CTA */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need Emergency Repair?</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Book a technician to visit your home for urgent repairs. Available 7AM-11PM.
            </p>
            <button className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100">
              🚨 Book Emergency Service
            </button>
          </div>
        </div>
      )}

      {/* My Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Orders</h2>
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{order.service}</h3>
                    <p className="text-gray-600">Order #{order.id} • {order.shop}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Scheduled</div>
                    <div className="font-medium">{order.date}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Technician</div>
                    <div className="font-medium">{order.technician}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="font-medium">{order.amount}</div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Track Order
                  </button>
                  {order.status === 'Completed' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Rate Service
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center hover:shadow-md">
          <div className="text-2xl mb-2">📱</div>
          <div className="font-medium">Mobile Repair</div>
        </button>
        <button className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center hover:shadow-md">
          <div className="text-2xl mb-2">💻</div>
          <div className="font-medium">Laptop Service</div>
        </button>
        <button className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center hover:shadow-md">
          <div className="text-2xl mb-2">❄️</div>
          <div className="font-medium">AC Repair</div>
        </button>
        <button className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center hover:shadow-md">
          <div className="text-2xl mb-2">🛒</div>
          <div className="font-medium">Buy Electronics</div>
        </button>
      </div>
    </div>
  );
}