'use client';

import { useState } from 'react';
import { FiMapPin, FiStar, FiCheckCircle, FiClock, FiHome, FiShoppingBag } from 'react-icons/fi';

interface Shop {
  id: number;
  name: string;
  owner: string;
  city: string;
  location: string;
  categories: string[];
  rating: number;
  totalReviews: number;
  totalServices: number;
  joined: string;
  verification: 'verified' | 'pending';
  services: string[];
  products: string[];
  availability: string;
  openingHours: string;
  homeService: boolean;
  image: string;
  description: string;
  badges: string[];
}

interface ShopCardProps {
  shop: Shop;
  viewMode: 'grid' | 'list';
}

export default function ShopCard({ shop, viewMode }: ShopCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Shop Image & Basic Info */}
          <div className="md:w-1/4">
            <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex items-center justify-center relative">
              <span className="text-6xl">{shop.image}</span>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg"
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiStar className="text-yellow-500 mr-1" />
                  <span className="font-bold">{shop.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({shop.totalReviews})</span>
                </div>
                <span className="text-sm text-gray-600">{shop.totalServices} services</span>
              </div>
            </div>
          </div>

          {/* Shop Details */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{shop.name}</h3>
                  {shop.verification === 'verified' && (
                    <span className="inline-flex items-center text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                      <FiCheckCircle className="mr-1" /> Verified
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <FiMapPin className="mr-1" />
                  <span>{shop.location}, {shop.city}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{shop.description}</p>
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {shop.categories.map((category, index) => (
                    <span
                      key={index}
                      className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                
                {/* Services Preview */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Services Offered:</div>
                  <div className="flex flex-wrap gap-2">
                    {shop.services.slice(0, 4).map((service, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {service}
                      </span>
                    ))}
                    {shop.services.length > 4 && (
                      <span className="text-xs text-gray-500">+{shop.services.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">Joined {shop.joined}</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center">
                <FiClock className="text-gray-400 mr-2" />
                <div>
                  <div className="text-sm font-medium">{shop.openingHours}</div>
                  <div className={`text-xs ${shop.availability.includes('Open') ? 'text-green-600' : 'text-red-600'}`}>
                    {shop.availability}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiHome className="text-gray-400 mr-2" />
                <div className="text-sm">
                  {shop.homeService ? '🏠 Home Service Available' : '🏪 Shop Visit Only'}
                </div>
              </div>
              
              <div className="flex items-center">
                <FiShoppingBag className="text-gray-400 mr-2" />
                <div className="text-sm">{shop.products.length} Products</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              <div className="flex flex-wrap gap-2">
                {shop.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button className="px-5 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 font-medium">
                  View Shop
                </button>
                <button className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:opacity-90 font-medium">
                  Contact Shop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
      {/* Shop Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
          <span className="text-7xl">{shop.image}</span>
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        
        {/* Verification Badge */}
        {shop.verification === 'verified' && (
          <div className="absolute top-3 left-3 inline-flex items-center bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            <FiCheckCircle className="mr-1" /> Verified
          </div>
        )}
      </div>

      {/* Shop Info */}
      <div className="p-5">
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-800 truncate">{shop.name}</h3>
            <div className="flex items-center">
              <FiStar className="text-yellow-500 mr-1" />
              <span className="font-bold">{shop.rating}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <FiMapPin className="mr-1" />
            <span className="truncate">{shop.city}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {shop.categories.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
            >
              {category}
            </span>
          ))}
          {shop.categories.length > 2 && (
            <span className="text-xs text-gray-500">+{shop.categories.length - 2}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shop.description}</p>

        {/* Services Preview */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-700 mb-2">Top Services:</div>
          <div className="flex flex-wrap gap-1">
            {shop.services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="font-bold text-gray-800">{shop.totalReviews}</div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-800">{shop.totalServices}</div>
            <div className="text-xs text-gray-500">Services</div>
          </div>
          <div className="text-center">
            <div className={`font-bold ${shop.availability.includes('Open') ? 'text-green-600' : 'text-red-600'}`}>
              {shop.availability.includes('Open') ? 'Open' : 'Closed'}
            </div>
            <div className="text-xs text-gray-500">Now</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <FiClock className="mr-1" />
            {shop.openingHours}
          </div>
          {shop.homeService && (
            <div className="flex items-center">
              <FiHome className="mr-1" />
              Home Service
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 py-2.5 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 text-sm font-medium">
            View Details
          </button>
          <button className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:opacity-90 text-sm font-medium">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}