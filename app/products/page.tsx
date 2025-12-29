'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/app/components/ProductCard';

import LoadingSpinner from '@/app/components/LoadingSpinner';
import { FiGrid, FiList } from 'react-icons/fi';

// Mock products data
const initialProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    category: 'Smartphones',
    price: 129999,
    originalPrice: 139999,
    rating: 4.8,
    reviews: 1245,
    shop: {
      name: 'Apple Store',
      location: 'Mumbai',
      rating: 4.9,
      verified: true
    },
    image: '📱',
    description: 'Latest Apple iPhone with A17 Pro chip, Titanium design, and Pro camera system',
    features: ['256GB Storage', '5G', 'Titanium', 'iOS 17'],
    stock: 25,
    delivery: 'Free delivery • 2 days',
    warranty: '1 Year'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Smartphones',
    price: 119999,
    originalPrice: 129999,
    rating: 4.7,
    reviews: 987,
    shop: {
      name: 'Samsung Plaza',
      location: 'Delhi',
      rating: 4.8,
      verified: true
    },
    image: '📱',
    description: 'Galaxy AI, 200MP camera, S Pen, Snapdragon 8 Gen 3',
    features: ['512GB', 'S Pen', '200MP Camera', 'AI Features'],
    stock: 42,
    delivery: 'Free delivery • 1 day',
    warranty: '2 Years'
  },
  {
    id: 3,
    name: 'MacBook Air M3',
    category: 'Laptops',
    price: 114999,
    originalPrice: 124999,
    rating: 4.9,
    reviews: 2345,
    shop: {
      name: 'Tech World',
      location: 'Bangalore',
      rating: 4.7,
      verified: true
    },
    image: '💻',
    description: 'Supercharged by M3 chip, 18-hour battery, Liquid Retina display',
    features: ['M3 Chip', '16GB RAM', '512GB SSD', '13.6"'],
    stock: 18,
    delivery: 'Free delivery • 3 days',
    warranty: '1 Year'
  },
  {
    id: 4,
    name: 'Sony Bravia 65" 4K TV',
    category: 'Televisions',
    price: 89999,
    originalPrice: 99999,
    rating: 4.6,
    reviews: 876,
    shop: {
      name: 'ElectroMart',
      location: 'Chennai',
      rating: 4.5,
      verified: true
    },
    image: '📺',
    description: 'Cognitive Processor XR, Dolby Vision, Android TV',
    features: ['65" 4K', 'Dolby Atmos', 'Google TV', 'XR Processor'],
    stock: 12,
    delivery: 'Free installation • 4 days',
    warranty: '3 Years'
  },
  {
    id: 5,
    name: 'LG 1.5 Ton 5 Star AC',
    category: 'Air Conditioners',
    price: 44999,
    originalPrice: 49999,
    rating: 4.5,
    reviews: 1567,
    shop: {
      name: 'Cool Home Appliances',
      location: 'Hyderabad',
      rating: 4.6,
      verified: true
    },
    image: '❄️',
    description: 'Inverter Compressor, AI Convertible 6-in-1, Ocean Black Fin',
    features: ['1.5 Ton', '5 Star', 'Wi-Fi', 'Inverter'],
    stock: 36,
    delivery: 'Free installation • 2 days',
    warranty: '10 Years Compressor'
  },
  {
    id: 6,
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 29999,
    originalPrice: 34999,
    rating: 4.8,
    reviews: 3456,
    shop: {
      name: 'Audio Heaven',
      location: 'Mumbai',
      rating: 4.9,
      verified: true
    },
    image: '🎧',
    description: 'Industry-leading noise cancellation, 30-hour battery, multipoint connection',
    features: ['Noise Cancelling', '30hr Battery', 'Hi-Res Audio', 'LDAC'],
    stock: 58,
    delivery: 'Free delivery • 1 day',
    warranty: '2 Years'
  },
  {
    id: 7,
    name: 'Canon EOS R6 Mark II',
    category: 'Cameras',
    price: 189999,
    originalPrice: 199999,
    rating: 4.7,
    reviews: 543,
    shop: {
      name: 'Camera Hub',
      location: 'Delhi',
      rating: 4.8,
      verified: true
    },
    image: '📸',
    description: 'Full-frame mirrorless, 24.2MP, 40fps continuous shooting',
    features: ['Full Frame', '4K 60p', 'IBIS', 'Dual Pixel AF'],
    stock: 8,
    delivery: 'Free delivery • 3 days',
    warranty: '2 Years'
  },
  {
    id: 8,
    name: 'Apple Watch Series 9',
    category: 'Wearables',
    price: 41999,
    originalPrice: 45999,
    rating: 4.6,
    reviews: 2341,
    shop: {
      name: 'Wearable Tech',
      location: 'Bangalore',
      rating: 4.7,
      verified: true
    },
    image: '⌚',
    description: 'S9 SiP, Double tap gesture, Always-On Retina display',
    features: ['GPS + Cellular', '45mm', 'watchOS 10', 'ECG'],
    stock: 67,
    delivery: 'Free delivery • 2 days',
    warranty: '1 Year'
  },
  {
    id: 9,
    name: 'Dyson V15 Detect',
    category: 'Home Appliances',
    price: 54999,
    originalPrice: 59999,
    rating: 4.8,
    reviews: 1890,
    shop: {
      name: 'Home Solutions',
      location: 'Pune',
      rating: 4.6,
      verified: true
    },
    image: '🧹',
    description: 'Laser dust detection, HEPA filtration, 60-minute runtime',
    features: ['Cordless', 'HEPA Filter', 'Laser Detect', '60min Runtime'],
    stock: 23,
    delivery: 'Free delivery • 2 days',
    warranty: '2 Years'
  },
  {
    id: 10,
    name: 'PlayStation 5',
    category: 'Gaming',
    price: 49999,
    originalPrice: 54999,
    rating: 4.9,
    reviews: 4567,
    shop: {
      name: 'Game Station',
      location: 'Mumbai',
      rating: 4.8,
      verified: true
    },
    image: '🎮',
    description: 'Ultra-high speed SSD, Ray tracing, 4K gaming',
    features: ['825GB SSD', '4K 120fps', 'Ray Tracing', 'DualSense'],
    stock: 15,
    delivery: 'Free delivery • 3 days',
    warranty: '2 Years'
  },
  {
    id: 11,
    name: 'iPad Pro M2',
    category: 'Tablets',
    price: 89999,
    originalPrice: 99999,
    rating: 4.7,
    reviews: 1234,
    shop: {
      name: 'Apple Premium',
      location: 'Delhi',
      rating: 4.9,
      verified: true
    },
    image: '📱',
    description: 'M2 chip, Liquid Retina XDR display, Pro cameras',
    features: ['M2 Chip', '12.9"', '5G', 'Face ID'],
    stock: 32,
    delivery: 'Free delivery • 2 days',
    warranty: '1 Year'
  },
  {
    id: 12,
    name: 'Bose Soundbar 900',
    category: 'Audio',
    price: 74999,
    originalPrice: 84999,
    rating: 4.6,
    reviews: 876,
    shop: {
      name: 'Sound Masters',
      location: 'Chennai',
      rating: 4.7,
      verified: true
    },
    image: '🔊',
    description: 'Dolby Atmos, ADAPTiQ, Bose Voice4Video',
    features: ['Dolby Atmos', 'Wi-Fi/Bluetooth', 'Voice Control', 'HDMI eARC'],
    stock: 19,
    delivery: 'Free installation • 3 days',
    warranty: '1 Year'
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const productsPerPage = 9;

  // Categories for quick filter
  const categories = [
    'All Products',
    'Smartphones',
    'Laptops',
    'Televisions',
    'Air Conditioners',
    'Audio',
    'Cameras',
    'Wearables',
    'Home Appliances',
    'Gaming',
    'Tablets'
  ];

  // Filter and sort products
  useEffect(() => {
    setLoading(true);
    
    let filtered = [...products];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
    }
    
    setTimeout(() => {
      setFilteredProducts(filtered);
      setLoading(false);
    }, 300);
  }, [searchQuery, sortBy, products]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleCategoryFilter = (category: string) => {
    if (category === 'All Products') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === category);
      setFilteredProducts(filtered);
    }
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic already in useEffect
  };

  if (loading && currentPage === 1) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Electronics Products Marketplace
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Discover thousands of verified electronics products from trusted shops across India
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, or categories..."
                className="w-full px-6 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                Search
              </button>
            </form>
            
            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-gray-300">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-gray-300">Brands</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-gray-300">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1 Day</div>
                <div className="text-sm text-gray-300">Delivery*</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>
              
              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-gray-700">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                      className="block w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-gray-700">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input type="radio" id="price-all" name="price" className="mr-2" />
                    <label htmlFor="price-all" className="cursor-pointer">All Prices</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="price-low" name="price" className="mr-2" />
                    <label htmlFor="price-low" className="cursor-pointer">Under ₹10,000</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="price-mid" name="price" className="mr-2" />
                    <label htmlFor="price-mid" className="cursor-pointer">₹10,000 - ₹50,000</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="price-high" name="price" className="mr-2" />
                    <label htmlFor="price-high" className="cursor-pointer">Above ₹50,000</label>
                  </div>
                </div>
              </div>
              
              {/* Ratings */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-gray-700">Customer Ratings</h3>
                <div className="space-y-3">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input type="checkbox" id={`rating-${rating}`} className="mr-2" />
                      <label htmlFor={`rating-${rating}`} className="cursor-pointer flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{rating}+</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Warranty */}
              <div>
                <h3 className="font-bold mb-4 text-gray-700">Warranty</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" id="warranty-1" className="mr-2" />
                    <label htmlFor="warranty-1" className="cursor-pointer">1 Year</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="warranty-2" className="mr-2" />
                    <label htmlFor="warranty-2" className="cursor-pointer">2 Years</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="warranty-3" className="mr-2" />
                    <label htmlFor="warranty-3" className="cursor-pointer">3+ Years</label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <main className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    All Products <span className="text-blue-600">({filteredProducts.length})</span>
                  </h2>
                  <p className="text-gray-600 mt-1">Showing {currentProducts.length} of {filteredProducts.length} products</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <FiGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <FiList className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
              
              {/* Active Filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="ml-2">×</button>
                  </span>
                )}
              </div>
            </div>

            {/* Products Grid/List */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <div className="text-5xl mb-4">😕</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredProducts(products);
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
                }>
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-lg disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}

            {/* Featured Brands */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Brands</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {['Apple', 'Samsung', 'Sony', 'LG', 'Canon', 'Bose'].map((brand) => (
                  <div
                    key={brand}
                    className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="text-2xl mb-2">
                      {brand === 'Apple' && '🍎'}
                      {brand === 'Samsung' && '📱'}
                      {brand === 'Sony' && '🎮'}
                      {brand === 'LG' && '📺'}
                      {brand === 'Canon' && '📸'}
                      {brand === 'Bose' && '🎧'}
                    </div>
                    <div className="font-medium">{brand}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}