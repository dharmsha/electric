'use client';

import { useState } from 'react';

const businessTypes = [
  'Mobile Repair Shop',
  'Electronics Store',
  'AC Service Center',
  'TV Repair Specialist',
  'Laptop Service Center',
  'Home Appliances Repair',
  'Computer Hardware Store',
  'Electronic Components Shop'
];

const certificates = [
  'GST Registration',
  'Shop Act License',
  'Professional Certificate',
  'Brand Authorized Service Center',
  'ISO Certification',
  'Other Government License'
];

export default function ShopRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    
    // Step 2: Location
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    
    // Step 3: Business Details
    businessType: '',
    yearsExperience: '',
    services: [] as string[],
    products: [] as string[],
    
    // Step 4: Documents
    gstNumber: '',
    certificates: [] as string[],
    documentFiles: [] as File[],
    
    // Step 5: Availability
    openingTime: '09:00',
    closingTime: '21:00',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    homeService: true,
  });

  const servicesList = [
    'Mobile Repair', 'Laptop Repair', 'TV Repair', 'AC Service',
    'Refrigerator Repair', 'Washing Machine Repair', 'Computer Repair',
    'Electronic Circuit Repair', 'Installation Services', 'Maintenance Contracts'
  ];

  const productsList = [
    'Mobile Phones', 'Laptops', 'Televisions', 'AC Units',
    'Refrigerators', 'Washing Machines', 'Computer Parts',
    'Electronic Components', 'Cables & Accessories', 'Power Supplies'
  ];

  const handleSubmit = async () => {
    // In real app, send to backend
    console.log('Registering shop:', formData);
    
    alert('Registration submitted! Our team will verify and activate your account within 24 hours.');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Register Your Electronics Shop
        </h2>
        <p className="text-gray-600">
          Join India's largest hyperlocal electronics marketplace
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="flex flex-col items-center z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
              ${step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {num}
            </div>
            <span className="text-sm mt-2">
              {['Basic Info', 'Location', 'Services', 'Documents', 'Schedule'][num-1]}
            </span>
          </div>
        ))}
        <div className="absolute top-6 left-12 right-12 h-1 bg-gray-200 -z-10">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step-1) * 25}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name *
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., Gupta Electronics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="10-digit mobile number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="business@email.com"
              />
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <div></div>
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
            >
              Next: Location Details →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Shop Location</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Shop no, Building, Street, Area"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., Maharashtra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
            >
              Next: Services & Products →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Services */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Services & Products</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Services You Offer *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {servicesList.map(service => (
                <div key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    id={service}
                    checked={formData.services.includes(service)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          services: [...formData.services, service]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          services: formData.services.filter(s => s !== service)
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={service} className="text-gray-700">
                    {service}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Products You Sell
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {productsList.map(product => (
                <div key={product} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`product-${product}`}
                    checked={formData.products.includes(product)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          products: [...formData.products, product]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          products: formData.products.filter(p => p !== product)
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`product-${product}`} className="text-gray-700">
                    {product}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
            >
              Next: Documents →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Documents */}
      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Business Documents</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Number (if available)
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., 27ABCDE1234F1Z5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Business Certificates/Licenses
              </label>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {certificates.map(cert => (
                  <div key={cert} className="flex items-center">
                    <input
                      type="checkbox"
                      id={cert}
                      checked={formData.certificates.includes(cert)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            certificates: [...formData.certificates, cert]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            certificates: formData.certificates.filter(c => c !== cert)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={cert} className="text-gray-700 text-sm">
                      {cert}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documents (GST, License, Shop Photos)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-2">Drag & drop files or click to upload</p>
                <p className="text-sm text-gray-400">Max 5 files, 2MB each (jpg, png, pdf)</p>
                <button className="mt-4 px-6 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
                  Choose Files
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
            >
              Next: Schedule →
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Schedule */}
      {step === 5 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Working Hours & Services</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opening Time
              </label>
              <input
                type="time"
                value={formData.openingTime}
                onChange={(e) => setFormData({...formData, openingTime: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closing Time
              </label>
              <input
                type="time"
                value={formData.closingTime}
                onChange={(e) => setFormData({...formData, closingTime: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Working Days
            </label>
            <div className="flex flex-wrap gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    if (formData.workingDays.includes(day)) {
                      setFormData({
                        ...formData,
                        workingDays: formData.workingDays.filter(d => d !== day)
                      });
                    } else {
                      setFormData({
                        ...formData,
                        workingDays: [...formData.workingDays, day]
                      });
                    }
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    formData.workingDays.includes(day)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="homeService"
              checked={formData.homeService}
              onChange={(e) => setFormData({...formData, homeService: e.target.checked})}
              className="mr-3 h-5 w-5"
            />
            <div>
              <label htmlFor="homeService" className="font-medium text-gray-700">
                Offer Home Services
              </label>
              <p className="text-sm text-gray-500 mt-1">
                I can visit customer's home for repair/service (extra charges may apply)
              </p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mr-3 mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the terms and conditions. I understand that my shop will be 
                verified by ElectroHub team before activation. I will maintain quality 
                service and respond to customer requests promptly.
              </label>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-xl"
            >
              ✅ Submit Registration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}