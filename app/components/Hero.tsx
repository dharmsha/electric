'use client';

import { ArrowRightIcon, ShieldCheckIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Hero() {
  const [selectedUser, setSelectedUser] = useState<'seller' | 'customer'>('customer');

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Electronics Marketplace
            <span className="block text-cyan-300 mt-2">Connecting Sellers & Customers</span>
          </h1>
          
          <p className="text-xl mb-8 text-gray-200">
            Platform where electronics sellers list products and customers shop with confidence.
            We act as the trusted third-party ensuring secure transactions for everyone.
          </p>

          {/* User Type Selection */}
          <div className="mb-10">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setSelectedUser('customer')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedUser === 'customer'
                    ? 'bg-white text-blue-900'
                    : 'bg-blue-800 text-white hover:bg-blue-700'
                }`}
              >
                I'm a Customer
              </button>
              <button
                onClick={() => setSelectedUser('seller')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedUser === 'seller'
                    ? 'bg-white text-blue-900'
                    : 'bg-blue-800 text-white hover:bg-blue-700'
                }`}
              >
                I'm a Seller
              </button>
            </div>

            {selectedUser === 'customer' ? (
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">For Customers</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span>Buy from verified electronics sellers</span>
                  </li>
                  <li className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span>Secure third-party payment protection</span>
                  </li>
                  <li className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span>Easy returns & warranty claims</span>
                  </li>
                </ul>
                <button className="btn-primary mt-6 flex items-center">
                  Start Shopping <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">For Electronics Sellers</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span>Reach millions of customers nationwide</span>
                  </li>
                  <li className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span>Managed payments & logistics support</span>
                  </li>
                  <li className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span>Real-time inventory management</span>
                  </li>
                </ul>
                <button className="btn-primary mt-6 flex items-center">
                  Become a Seller <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300">5,000+</div>
              <div className="text-sm">Verified Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300">200K+</div>
              <div className="text-sm">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300">1M+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300">₹500Cr+</div>
              <div className="text-sm">GMV Processed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}