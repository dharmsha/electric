'use client';

import { useState } from 'react';
import { 
  FiSearch, 
  FiUserPlus, 
  FiShoppingCart, 
  FiTool, 
  FiHome,
  FiCheckCircle,
  FiDollarSign,
  FiShield,
  FiMessageCircle,
  FiStar
} from 'react-icons/fi';

export default function HowItWorksPage() {
  const [activeSection, setActiveSection] = useState('customer');

  const customerSteps = [
    {
      step: 1,
      icon: <FiSearch className="text-3xl" />,
      title: 'Search Services',
      description: 'Find electronics repair shops, service centers, or products near your location',
      details: [
        'Enter your location or use GPS',
        'Browse by category: Mobile, TV, AC, Laptop, etc.',
        'Filter by ratings, price, and availability'
      ]
    },
    {
      step: 2,
      icon: <FiShoppingCart className="text-3xl" />,
      title: 'Compare & Choose',
      description: 'Compare multiple shops based on ratings, prices, and customer reviews',
      details: [
        'View shop profiles and service details',
        'Check verified customer reviews',
        'Compare pricing for same service'
      ]
    },
    {
      step: 3,
      icon: <FiTool className="text-3xl" />,
      title: 'Book Service',
      description: 'Schedule repair service or purchase products with secure payment options',
      details: [
        'Choose home service or shop visit',
        'Select convenient time slot',
        'Make secure online payment'
      ]
    },
    {
      step: 4,
      icon: <FiHome className="text-3xl" />,
      title: 'Get Service',
      description: 'Expert technician visits your home or visit shop for quality service',
      details: [
        'Track technician arrival in real-time',
        'Get professional service at doorstep',
        'Quality check before payment release'
      ]
    },
    {
      step: 5,
      icon: <FiCheckCircle className="text-3xl" />,
      title: 'Rate & Review',
      description: 'Share your experience and help others make better decisions',
      details: [
        'Rate service quality',
        'Write detailed review',
        'Get warranty details'
      ]
    }
  ];

  const sellerSteps = [
    {
      step: 1,
      icon: <FiUserPlus className="text-3xl" />,
      title: 'Register Shop',
      description: 'Create your shop profile with business details and documents',
      details: [
        'Submit GST and business registration',
        'Add shop location and contact details',
        'Upload shop photos and certificates'
      ]
    },
    {
      step: 2,
      icon: <FiShield className="text-3xl" />,
      title: 'Get Verified',
      description: 'Our team verifies your shop details and credentials',
      details: [
        'Background verification process',
        'Document authentication',
        'Quality standards check'
      ]
    },
    {
      step: 3,
      icon: <FiMessageCircle className="text-3xl" />,
      title: 'List Services',
      description: 'Add your services and products with pricing and details',
      details: [
        'Create service packages',
        'Set competitive pricing',
        'Add service time estimates'
      ]
    },
    {
      step: 4,
      icon: <FiDollarSign className="text-3xl" />,
      title: 'Get Orders',
      description: 'Start receiving orders from customers in your area',
      details: [
        'Real-time order notifications',
        'Customer contact details',
        'Service requirements'
      ]
    },
    {
      step: 5,
      icon: <FiStar className="text-3xl" />,
      title: 'Grow Business',
      description: 'Build reputation and grow your customer base',
      details: [
        'Collect customer reviews',
        'Get featured in local searches',
        'Access business analytics'
      ]
    }
  ];

  const platformFeatures = [
    {
      icon: '🛡️',
      title: 'Secure Payments',
      description: 'Payments held in escrow until service completion'
    },
    {
      icon: '✅',
      title: 'Verified Shops',
      description: 'All shops undergo thorough verification process'
    },
    {
      icon: '⭐',
      title: 'Quality Assurance',
      description: 'Minimum service quality standards maintained'
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description: 'Dedicated customer support for any issues'
    },
    {
      icon: '🎯',
      title: 'Local Focus',
      description: 'Hyperlocal matching for faster service'
    },
    {
      icon: '📊',
      title: 'Transparent Pricing',
      description: 'No hidden charges, clear pricing upfront'
    }
  ];

  const faqs = [
    {
      question: 'How do I find electronics shops near me?',
      answer: 'Enter your location on the homepage or allow GPS access. Browse through verified shops in your area with detailed profiles, ratings, and service offerings.'
    },
    {
      question: 'Are all shops on ElectroHub verified?',
      answer: 'Yes! Every shop undergoes a thorough verification process including document check, background verification, and quality standards assessment.'
    },
    {
      question: 'How does payment work on ElectroHub?',
      answer: 'Payments are securely held in escrow until your service is completed satisfactorily. You only release payment after verifying the quality of service.'
    },
    {
      question: 'Can I get home service for electronics repair?',
      answer: 'Absolutely! Many shops offer home service options. You can filter shops specifically offering home services during your search.'
    },
    {
      question: 'How long does it take to register my shop?',
      answer: 'Shop registration takes 10-15 minutes. Verification usually completes within 24-48 hours. Once verified, you can start listing services immediately.'
    },
    {
      question: 'What if I\'m not satisfied with the service?',
      answer: 'We offer a satisfaction guarantee. If you\'re not happy with the service, contact our support team within 24 hours for resolution or refund.'
    }
  ];

  const steps = activeSection === 'customer' ? customerSteps : sellerSteps;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How ElectroHub Works
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Connecting electronics shops with customers across India. Simple, secure, and efficient.
            </p>
            
            {/* Toggle Section */}
            <div className="inline-flex bg-white/20 rounded-full p-1 mb-8">
              <button
                onClick={() => setActiveSection('customer')}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  activeSection === 'customer' 
                    ? 'bg-white text-blue-900 shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                For Customers
              </button>
              <button
                onClick={() => setActiveSection('seller')}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  activeSection === 'seller' 
                    ? 'bg-white text-blue-900 shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                For Shop Owners
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Steps Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {activeSection === 'customer' ? 'Getting Started as a Customer' : 'Growing Your Business as a Seller'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {activeSection === 'customer' 
                ? 'Follow these simple steps to get your electronics repaired or buy products'
                : 'Join thousands of successful electronics businesses on our platform'
              }
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
            
            {/* Steps */}
            <div className="space-y-12 md:space-y-0">
              {steps.map((step, index) => (
                <div
                  key={step.step}
                  className={`relative flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Step Content */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 mb-6">
                        {step.icon}
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-2">
                        Step {step.step}: {step.title}
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Step Number Circle */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-white">
                      {step.step}
                    </div>
                  </div>

                  {/* Empty div for opposite side */}
                  <div className="md:w-1/2 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Why Choose ElectroHub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Verified Shops</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-blue-100">Services Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-blue-100">Cities Across India</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">4.8★</div>
                <div className="text-blue-100">Average Rating</div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Ready to {activeSection === 'customer' ? 'Get Started?' : 'Grow Your Business?'}
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                {activeSection === 'customer'
                  ? 'Join thousands of satisfied customers who trust ElectroHub for their electronics needs'
                  : 'Join India\'s fastest growing electronics marketplace and reach more customers'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition">
                  {activeSection === 'customer' ? 'Find Services Near Me' : 'Register Your Shop'}
                </button>
                <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}