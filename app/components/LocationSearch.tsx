'use client';

import { useState, useEffect } from 'react';

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 
  'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'
];

const services = [
  { id: 'mobile_repair', name: 'Mobile Repair', icon: '📱' },
  { id: 'laptop_repair', name: 'Laptop Repair', icon: '💻' },
  { id: 'tv_repair', name: 'TV Repair', icon: '📺' },
  { id: 'ac_service', name: 'AC Service', icon: '❄️' },
  { id: 'refrigerator', name: 'Refrigerator', icon: '🧊' },
  { id: 'washing_machine', name: 'Washing Machine', icon: '🧺' },
  { id: 'sell_mobile', name: 'Buy Mobile', icon: '🛒' },
  { id: 'sell_laptop', name: 'Buy Laptop', icon: '🛒' }
];

export default function LocationSearch() {
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUseCurrentLocation(true);
          // In real app, reverse geocode to get city name
          setCity('Your Location');
        },
        () => {
          alert('Location access denied. Please enter manually.');
        }
      );
    }
  };

  const findShops = () => {
    if (!city && !pincode) {
      alert('Please enter location or pincode');
      return;
    }
    
    // In real app, this would fetch shops from API
    console.log('Searching shops in:', { city, pincode, selectedServices });
    
    // Show results
    alert(`Finding ${selectedServices.length} services near ${city || pincode}`);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Find Electronics Shops Near You
      </h2>
      
      {/* Location Input */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <select 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 rounded-lg text-gray-800"
          >
            <option value="">Select City</option>
            {indianCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">OR Enter Pincode</label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="e.g., 400001"
            className="w-full p-3 rounded-lg text-gray-800"
            maxLength={6}
          />
        </div>
        
        <div className="flex items-end">
          <button
            onClick={detectLocation}
            className="w-full p-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            📍 Use My Location
          </button>
        </div>
      </div>
      
      {/* Services Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Select Services Needed</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {services.map(service => (
            <button
              key={service.id}
              onClick={() => {
                if (selectedServices.includes(service.id)) {
                  setSelectedServices(selectedServices.filter(s => s !== service.id));
                } else {
                  setSelectedServices([...selectedServices, service.id]);
                }
              }}
              className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                selectedServices.includes(service.id)
                  ? 'bg-white text-blue-600 border-2 border-blue-500'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span className="text-2xl mb-1">{service.icon}</span>
              <span className="text-sm font-medium">{service.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Search Button */}
      <button
        onClick={findShops}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg text-lg hover:shadow-xl transition-all hover:scale-105"
      >
        🔍 Find Shops Near Me
      </button>
      
      {useCurrentLocation && (
        <div className="mt-4 text-center text-sm bg-white/20 p-2 rounded-lg">
          ✅ Using your current location. Finding nearest shops...
        </div>
      )}
    </div>
  );
}