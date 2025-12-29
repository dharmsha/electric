'use client';

import { useState } from 'react';
import { 
  ShoppingCartIcon, 
  UserCircleIcon, 
  Bars3Icon, 
  XMarkIcon,
  ComputerDesktopIcon 
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'seller' | null>(null);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Sellers', href: '/sellers' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Support', href: '/support' },
  ];

  return (
    <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ComputerDesktopIcon className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold">ElectroHub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-cyan-300 transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {userType ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Logged in as {userType === 'seller' ? 'Seller' : 'Customer'}
                </span>
                <button
                  onClick={() => setUserType(null)}
                  className="btn-secondary !py-2 !px-4 !text-sm"
                >
                  Logout
                </button>
                <ShoppingCartIcon className="h-6 w-6 cursor-pointer" />
              </div>
            ) : (
              <>
                <button
                  onClick={() => setUserType('customer')}
                  className="btn-secondary !py-2 !px-4 !text-sm"
                >
                  Customer Login
                </button>
                <button
                  onClick={() => setUserType('seller')}
                  className="btn-primary !py-2 !px-4 !text-sm"
                >
                  Seller Login
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-2 hover:text-cyan-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-blue-700">
              {userType ? (
                <>
                  <div className="py-2 text-sm">
                    Logged in as {userType === 'seller' ? 'Seller' : 'Customer'}
                  </div>
                  <button
                    onClick={() => {
                      setUserType(null);
                      setIsMenuOpen(false);
                    }}
                    className="w-full btn-secondary mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setUserType('customer');
                      setIsMenuOpen(false);
                    }}
                    className="w-full btn-secondary mb-2"
                  >
                    Customer Login
                  </button>
                  <button
                    onClick={() => {
                      setUserType('seller');
                      setIsMenuOpen(false);
                    }}
                    className="w-full btn-primary"
                  >
                    Seller Login
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}