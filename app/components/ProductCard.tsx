'use client';

import { useState } from 'react';

interface ShopInfo {
  name: string;
  location: string;
  rating: number;
  verified: boolean;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  shop: ShopInfo;
  image: string;
  description: string;
  features: string[];
  stock: number;
  delivery: string;
  warranty: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="md:w-1/4">
            <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <span className="text-6xl">{product.image}</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                  {product.category}
                </span>
                <h3 className="text-xl font-bold mt-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mt-2">{product.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="text-gray-400 hover:text-red-500"
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Shop Info & Ratings */}
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-blue-600 text-sm font-bold">
                    {product.shop.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm">{product.shop.name}</div>
                  <div className="text-xs text-gray-500">{product.shop.location}</div>
                </div>
                {product.shop.verified && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    ✓ Verified
                  </span>
                )}
              </div>

              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500 ml-1">({product.reviews})</span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <>
                      <span className="ml-2 text-lg text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {product.delivery} • {product.warranty} warranty
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                  View Details
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium">
                  Add to Cart
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
      {/* Product Image */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <span className="text-7xl">{product.image}</span>
        </div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg"
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="mb-3">
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Shop Info */}
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
            <span className="text-blue-600 text-xs font-bold">
              {product.shop.name.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-gray-600">{product.shop.name}</span>
          {product.shop.verified && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
              ✓
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="font-medium">{product.rating}</span>
          </div>
          <span className="text-gray-500 text-sm ml-2">({product.reviews})</span>
          <span className="ml-auto text-sm text-gray-500">{product.shop.location}</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {product.delivery} • {product.warranty}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.stock > 10 ? (
            <span className="text-green-600 text-sm">✓ In Stock</span>
          ) : product.stock > 0 ? (
            <span className="text-orange-600 text-sm">Only {product.stock} left</span>
          ) : (
            <span className="text-red-600 text-sm">Out of Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium">
            View
          </button>
          <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 text-sm font-medium">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}