
import Hero from '@/app/components/Hero';
import HowItWorks from '@/app/components/HowItWorks';
import ProductCategories from '@/app/components/ProductCategories';

import LocationSearch from '@/app/components/LocationSearch';
import CustomerDashboard from '@/app/components/CustomerDashboard';
import ShopRegistration from '@/app/components/ShopRegistration';

export default function Home() {
  return (
    <main className="min-h-screen">
      
      <Hero />
      
      {/* Location Search Section - Highlight karna important hai */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Find Electronics Services Near You
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Enter your location to discover verified electronics shops offering repair, service, and products in your area.
            </p>
            <LocationSearch />
          </div>
        </div>
      </section>
      
      <HowItWorks />
      <ProductCategories />
      
      {/* Customer Dashboard Preview - Only show highlights */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Experience Our Platform
          </h2>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto">
            <CustomerDashboard />
          </div>
        </div>
      </section>
      
      {/* Shop Registration CTA - Important for business owners */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Are You an Electronics Business Owner?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Register your shop on ElectroHub and grow your business. Get customers from your locality, manage orders online, and increase your revenue.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <ShopRegistration />
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-2">Increase Revenue</h3>
                <p className="opacity-80">Get 40% more business</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-2">Reach More Customers</h3>
                <p className="opacity-80">Access to local customers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Easy Management</h3>
                <p className="opacity-80">Digital tools & dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust & Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            Trusted Across India
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Verified Shops</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">₹50Cr+</div>
              <div className="text-gray-600">Business Generated</div>
            </div>
          </div>
        </div>
      </section>
      
      
    </main>
  );
}