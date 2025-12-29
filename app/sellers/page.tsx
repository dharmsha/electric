'use client';

import { useState, useEffect } from 'react';
import ShopCard from '@/app/components/ShopCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { FiMapPin, FiCheckCircle, FiStar, FiFilter } from 'react-icons/fi';

// Mock sellers/shops data
const initialShops = [
  {
    id: 1,
    name: 'Gupta Electronics',
    owner: 'Raj Gupta',
    city: 'Mumbai',
    location: 'Andheri East',
    categories: ['Mobile Repair', 'TV Repair', 'AC Service'],
    rating: 4.8,
    totalReviews: 245,
    totalServices: 1567,
    joined: '2020',
    verification: 'verified',
    services: [
      'Mobile Screen Replacement',
      'Battery Replacement',
      'Software Repair',
      'Water Damage Repair'
    ],
    products: ['Mobile Phones', 'Accessories', 'Chargers'],
    availability: 'Open Now',
    openingHours: '9 AM - 9 PM',
    homeService: true,
    image: '🏪',
    description: 'Trusted electronics repair shop with 10+ years experience. Specialized in mobile and TV repairs.',
    badges: ['Top Rated', 'Fast Service', 'Warranty Provided']
  },
  {
    id: 2,
    name: 'Sharma AC Services',
    owner: 'Amit Sharma',
    city: 'Delhi',
    location: 'Connaught Place',
    categories: ['AC Repair', 'AC Installation', 'AC Maintenance'],
    rating: 4.9,
    totalReviews: 187,
    totalServices: 892,
    joined: '2019',
    verification: 'verified',
    services: [
      'AC Gas Refill',
      'AC Installation',
      'Annual Maintenance',
      'Emergency Repair'
    ],
    products: ['AC Units', 'Coolers', 'Air Purifiers'],
    availability: 'Open Now',
    openingHours: '8 AM - 10 PM',
    homeService: true,
    image: '❄️',
    description: 'Expert AC technicians with 15+ years experience. Available 24/7 for emergency services.',
    badges: ['Expert Technician', '24/7 Service', 'Brand Certified']
  },
  {
    id: 3,
    name: 'Patel Mobile World',
    owner: 'Suresh Patel',
    city: 'Bangalore',
    location: 'Koramangala',
    categories: ['Mobile Sales', 'Mobile Repair', 'Accessories'],
    rating: 4.7,
    totalReviews: 342,
    totalServices: 1245,
    joined: '2018',
    verification: 'verified',
    services: [
      'New Mobile Sales',
      'Mobile Exchange',
      'Screen Protection',
      'Mobile Accessories'
    ],
    products: ['Smartphones', 'Tablets', 'Earphones', 'Power Banks'],
    availability: 'Open Now',
    openingHours: '10 AM - 8 PM',
    homeService: false,
    image: '📱',
    description: 'Authorized retailer for all major smartphone brands. Best prices with warranty.',
    badges: ['Authorized Retailer', 'Best Price', 'GST Bill']
  },
  {
    id: 4,
    name: 'Kumar TV Services',
    owner: 'Vijay Kumar',
    city: 'Hyderabad',
    location: 'Banjara Hills',
    categories: ['TV Repair', 'Home Theater', 'Installation'],
    rating: 4.6,
    totalReviews: 189,
    totalServices: 678,
    joined: '2021',
    verification: 'verified',
    services: [
      'LED/LCD TV Repair',
      'Home Theater Setup',
      'Wall Mounting',
      'Smart TV Setup'
    ],
    products: ['Televisions', 'Soundbars', 'TV Accessories'],
    availability: 'Closes at 7 PM',
    openingHours: '9 AM - 7 PM',
    homeService: true,
    image: '📺',
    description: 'Specialized in TV repairs and home entertainment systems. Same-day service available.',
    badges: ['Same Day Service', 'Free Installation', 'Warranty']
  },
  {
    id: 5,
    name: 'Desai Laptop Solutions',
    owner: 'Rahul Desai',
    city: 'Pune',
    location: 'Kothrud',
    categories: ['Laptop Repair', 'Data Recovery', 'Software'],
    rating: 4.8,
    totalReviews: 276,
    totalServices: 934,
    joined: '2020',
    verification: 'pending',
    services: [
      'Laptop Hardware Repair',
      'Data Recovery',
      'OS Installation',
      'Virus Removal'
    ],
    products: ['Laptops', 'Antivirus', 'Laptop Accessories'],
    availability: 'Open Now',
    openingHours: '10 AM - 8 PM',
    homeService: true,
    image: '💻',
    description: 'Laptop repair specialists with certified technicians. Data recovery experts.',
    badges: ['Data Recovery', 'Certified', 'Quick Service']
  },
  {
    id: 6,
    name: 'Singh Home Appliances',
    owner: 'Gurpreet Singh',
    city: 'Chandigarh',
    location: 'Sector 17',
    categories: ['Refrigerator', 'Washing Machine', 'Microwave'],
    rating: 4.5,
    totalReviews: 167,
    totalServices: 523,
    joined: '2022',
    verification: 'verified',
    services: [
      'Refrigerator Repair',
      'Washing Machine Service',
      'Microwave Repair',
      'Annual Maintenance'
    ],
    products: ['Refrigerators', 'Washing Machines', 'Microwaves'],
    availability: 'Open Now',
    openingHours: '9 AM - 8 PM',
    homeService: true,
    image: '🏠',
    description: 'Complete home appliances repair and service. Authorized service center for major brands.',
    badges: ['Authorized Service', 'Same Day', 'Free Pickup']
  },
  {
    id: 7,
    name: 'Joshi Computer Hub',
    owner: 'Anil Joshi',
    city: 'Ahmedabad',
    location: 'Navrangpura',
    categories: ['Desktop Repair', 'Networking', 'Printer'],
    rating: 4.4,
    totalReviews: 98,
    totalServices: 345,
    joined: '2023',
    verification: 'verified',
    services: [
      'Desktop Assembly',
      'Network Setup',
      'Printer Repair',
      'Software Solutions'
    ],
    products: ['Computer Parts', 'Printers', 'Networking'],
    availability: 'Open Now',
    openingHours: '10 AM - 7 PM',
    homeService: false,
    image: '🖥️',
    description: 'Complete computer solutions from repair to networking. Corporate IT support available.',
    badges: ['Corporate Support', 'Networking', 'IT Solutions']
  },
  {
    id: 8,
    name: 'Reddy Audio Visual',
    owner: 'Kiran Reddy',
    city: 'Chennai',
    location: 'T Nagar',
    categories: ['Sound System', 'Home Theater', 'Installation'],
    rating: 4.7,
    totalReviews: 213,
    totalServices: 789,
    joined: '2020',
    verification: 'verified',
    services: [
      'Sound System Setup',
      'Home Theater Installation',
      'Audio Calibration',
      'Smart Home Setup'
    ],
    products: ['Sound Systems', 'Speakers', 'AV Cables'],
    availability: 'Closes at 8 PM',
    openingHours: '10 AM - 8 PM',
    homeService: true,
    image: '🔊',
    description: 'Audio-visual experts for home theaters and professional sound systems.',
    badges: ['Premium Service', 'Expert Setup', 'Warranty']
  },
  {
    id: 9,
    name: 'Mehta Camera Repair',
    owner: 'Sanjay Mehta',
    city: 'Jaipur',
    location: 'MI Road',
    categories: ['Camera Repair', 'Lens Service', 'Photography'],
    rating: 4.9,
    totalReviews: 145,
    totalServices: 456,
    joined: '2019',
    verification: 'verified',
    services: [
      'DSLR/Mirrorless Repair',
      'Lens Cleaning',
      'Sensor Cleaning',
      'Camera Accessories'
    ],
    products: ['Cameras', 'Lenses', 'Tripods'],
    availability: 'Open Now',
    openingHours: '11 AM - 7 PM',
    homeService: true,
    image: '📸',
    description: 'Specialized camera repair service for professional and amateur photographers.',
    badges: ['Expert Repair', 'Quick Turnaround', 'Genuine Parts']
  },
  {
    id: 10,
    name: 'Cool Air Solutions',
    owner: 'Mohammed Ali',
    city: 'Lucknow',
    location: 'Hazratganj',
    categories: ['AC Service', 'Cooler Repair', 'Ventilation'],
    rating: 4.6,
    totalReviews: 187,
    totalServices: 612,
    joined: '2021',
    verification: 'pending',
    services: [
      'AC Installation',
      'Cooler Repair',
      'Duct Cleaning',
      'Ventilation Setup'
    ],
    products: ['AC Units', 'Coolers', 'Fans'],
    availability: 'Open Now',
    openingHours: '8 AM - 9 PM',
    homeService: true,
    image: '💨',
    description: 'Complete cooling solutions from ACs to ventilation systems. Emergency service available.',
    badges: ['Emergency Service', 'Cooling Experts', 'Affordable']
  },
  {
    id: 11,
    name: 'Smartphone Experts',
    owner: 'Ravi Verma',
    city: 'Kolkata',
    location: 'Park Street',
    categories: ['Mobile Repair', 'Tablet Repair', 'Accessories'],
    rating: 4.7,
    totalReviews: 324,
    totalServices: 1345,
    joined: '2020',
    verification: 'verified',
    services: [
      'Smartphone Repair',
      'Tablet Repair',
      'Data Transfer',
      'Accessories'
    ],
    products: ['Smartphones', 'Tablets', 'Accessories'],
    availability: 'Open Now',
    openingHours: '10 AM - 9 PM',
    homeService: true,
    image: '📲',
    description: 'Smartphone and tablet repair specialists with genuine parts and quick service.',
    badges: ['Genuine Parts', 'Quick Service', 'Warranty']
  },
  {
    id: 12,
    name: 'Electrical Masters',
    owner: 'Suresh Kumar',
    city: 'Coimbatore',
    location: 'RS Puram',
    categories: ['Electrical', 'Inverter', 'Generator'],
    rating: 4.5,
    totalReviews: 156,
    totalServices: 489,
    joined: '2022',
    verification: 'verified',
    services: [
      'Electrical Wiring',
      'Inverter Repair',
      'Generator Service',
      'Home Electrical'
    ],
    products: ['Inverters', 'Generators', 'Electrical Items'],
    availability: 'Open Now',
    openingHours: '9 AM - 7 PM',
    homeService: true,
    image: '⚡',
    description: 'Electrical solutions for homes and businesses. Certified electricians available.',
    badges: ['Certified', 'Safe Service', 'Quality Work']
  }
];

export default function SellersPage() {
  const [shops, setShops] = useState(initialShops);
  const [filteredShops, setFilteredShops] = useState(initialShops);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [homeServiceFilter, setHomeServiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique cities and categories
  const cities = ['all', ...Array.from(new Set(shops.map(shop => shop.city)))];
  const categories = ['all', ...Array.from(new Set(shops.flatMap(shop => shop.categories)))];

  // Filter and sort shops
  useEffect(() => {
    setLoading(true);
    
    let filtered = [...shops];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // City filter
    if (selectedCity !== 'all') {
      filtered = filtered.filter(shop => shop.city === selectedCity);
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(shop => shop.categories.includes(selectedCategory));
    }
    
    // Verification filter
    if (verificationFilter !== 'all') {
      filtered = filtered.filter(shop => shop.verification === verificationFilter);
    }
    
    // Home service filter
    if (homeServiceFilter !== 'all') {
      filtered = filtered.filter(shop => 
        homeServiceFilter === 'yes' ? shop.homeService : !shop.homeService
      );
    }
    
    // Sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      case 'services':
        filtered.sort((a, b) => b.totalServices - a.totalServices);
        break;
      case 'newest':
        filtered.sort((a, b) => b.joined.localeCompare(a.joined));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    setTimeout(() => {
      setFilteredShops(filtered);
      setLoading(false);
    }, 300);
  }, [searchQuery, selectedCity, selectedCategory, verificationFilter, homeServiceFilter, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic already in useEffect
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedCategory('all');
    setVerificationFilter('all');
    setHomeServiceFilter('all');
    setSortBy('rating');
  };

  if (loading && shops.length > 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Trusted Electronics Shops
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Discover verified electronics shops near you offering repair services, products, and expert solutions
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shops by name, services, or location..."
                className="w-full px-6 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"
              >
                Search
              </button>
            </form>
            
            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">1,000+</div>
                <div className="text-sm text-emerald-200">Verified Shops</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-emerald-200">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm text-emerald-200">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-emerald-200">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Clear All
                </button>
              </div>
              
              {/* City Filter */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-gray-700 flex items-center">
                  <FiMapPin className="mr-2" /> City
                </h3>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Cities</option>
                  {cities.filter(city => city !== 'all').map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-gray-700">Service Category</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(cat => cat !== 'all').map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Verification Filter */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-gray-700 flex items-center">
                  <FiCheckCircle className="mr-2" /> Verification
                </h3>
                <div className="space-y-3">
                  {['all', 'verified', 'pending'].map((status) => (
                    <div key={status} className="flex items-center">
                      <input
                        type="radio"
                        id={`verification-${status}`}
                        checked={verificationFilter === status}
                        onChange={() => setVerificationFilter(status)}
                        className="mr-2"
                      />
                      <label htmlFor={`verification-${status}`} className="cursor-pointer capitalize">
                        {status === 'all' ? 'All Shops' : status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Home Service Filter */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-gray-700">Home Service</h3>
                <div className="space-y-3">
                  {['all', 'yes', 'no'].map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="radio"
                        id={`home-${option}`}
                        checked={homeServiceFilter === option}
                        onChange={() => setHomeServiceFilter(option)}
                        className="mr-2"
                      />
                      <label htmlFor={`home-${option}`} className="cursor-pointer capitalize">
                        {option === 'all' ? 'All Shops' : 
                         option === 'yes' ? 'Offers Home Service' : 'Shop Visit Only'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rating Filter */}
              <div>
                <h3 className="font-bold mb-4 text-gray-700 flex items-center">
                  <FiStar className="mr-2" /> Minimum Rating
                </h3>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option>Any Rating</option>
                  <option>4.5+ Stars</option>
                  <option>4.0+ Stars</option>
                  <option>3.5+ Stars</option>
                </select>
              </div>
            </div>
            
            {/* Become a Seller CTA */}
            <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white text-center">
              <h3 className="font-bold text-lg mb-3">Own an Electronics Shop?</h3>
              <p className="text-sm mb-4 opacity-90">Join India's fastest growing electronics marketplace</p>
              <button className="w-full py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-gray-100">
                Register Your Shop
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Electronics Shops <span className="text-emerald-600">({filteredShops.length})</span>
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredShops.length === shops.length 
                      ? 'Showing all verified shops'
                      : `Found ${filteredShops.length} shops matching your criteria`
                    }
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="services">Most Services</option>
                    <option value="newest">Newest First</option>
                    <option value="name">A to Z</option>
                  </select>
                </div>
              </div>
              
              {/* Active Filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedCity !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                    City: {selectedCity}
                    <button onClick={() => setSelectedCity('all')} className="ml-2 hover:text-emerald-900">×</button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')} className="ml-2 hover:text-blue-900">×</button>
                  </span>
                )}
                {verificationFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    {verificationFilter === 'verified' ? '✓ Verified Only' : 'Pending Verification'}
                    <button onClick={() => setVerificationFilter('all')} className="ml-2 hover:text-purple-900">×</button>
                  </span>
                )}
                {homeServiceFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    {homeServiceFilter === 'yes' ? '🏠 Home Service' : '🏪 Shop Only'}
                    <button onClick={() => setHomeServiceFilter('all')} className="ml-2 hover:text-orange-900">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="ml-2 hover:text-gray-900">×</button>
                  </span>
                )}
              </div>
            </div>

            {/* Shops Grid/List */}
            {filteredShops.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No shops found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
                }>
                  {filteredShops.map((shop) => (
                    <ShopCard
                      key={shop.id}
                      shop={shop}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Stats Banner */}
                <div className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Why Choose Verified Shops?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">✓</div>
                      <div className="font-medium text-gray-800">Verified Credentials</div>
                      <div className="text-sm text-gray-600 mt-1">All shops are background checked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">⭐</div>
                      <div className="font-medium text-gray-800">Customer Reviews</div>
                      <div className="text-sm text-gray-600 mt-1">Real feedback from previous customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">🛡️</div>
                      <div className="font-medium text-gray-800">Platform Protection</div>
                      <div className="text-sm text-gray-600 mt-1">Secure payments and service guarantee</div>
                    </div>
                  </div>
                </div>

                {/* Popular Cities */}
                <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Popular Cities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Coimbatore'].map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`p-4 text-center rounded-lg border hover:border-emerald-500 hover:bg-emerald-50 transition-colors ${
                          selectedCity === city ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="text-lg font-medium text-gray-800">{city}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {shops.filter(s => s.city === city).length} shops
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}