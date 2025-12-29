export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">ElectroHub</h3>
            <p className="text-gray-300">
              India's trusted electronics marketplace connecting verified sellers with customers.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">For Sellers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Seller Registration</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Seller Dashboard</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Inventory Management</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Payment & Reports</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">For Customers</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Browse Products</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Order Tracking</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Returns & Warranty</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Customer Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Third-Party Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Secure Payment Escrow</li>
              <li className="text-gray-300">Quality Verification</li>
              <li className="text-gray-300">Dispute Resolution</li>
              <li className="text-gray-300">Logistics Support</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 ElectroHub Marketplace. All rights reserved.</p>
          <p className="mt-2">Acting as trusted third-party for all electronics transactions</p>
        </div>
      </div>
    </footer>
  );
}