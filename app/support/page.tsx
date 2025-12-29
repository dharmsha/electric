'use client';

import { useState } from 'react';
import { 
  FiHeadphones, 
  FiMessageCircle, 
  FiHelpCircle, 
  FiMail,
  FiPhone,
  FiClock,
  FiMapPin,
  FiFileText,
  FiUsers,
  FiShield,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

export default function SupportPage() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const supportCategories = [
    { id: 'customer', name: 'Customer Support', icon: '👤', count: 8 },
    { id: 'seller', name: 'Seller Support', icon: '🏪', count: 6 },
    { id: 'technical', name: 'Technical Issues', icon: '🔧', count: 5 },
    { id: 'payment', name: 'Payment & Refunds', icon: '💰', count: 7 },
    { id: 'account', name: 'Account Issues', icon: '🔐', count: 4 },
    { id: 'general', name: 'General Queries', icon: '❓', count: 6 },
  ];

  const allFAQs = [
    // Customer Support FAQs
    {
      id: 1,
      category: 'customer',
      question: 'How do I find electronics repair shops near me?',
      answer: 'You can use our location search feature on the homepage. Enter your city or allow location access to find verified electronics shops, repair centers, and service providers in your area. Filter by service type, ratings, and availability.'
    },
    {
      id: 2,
      category: 'customer',
      question: 'How can I book a home service for electronics repair?',
      answer: 'Select a shop that offers home services, choose "Home Service" option during booking, select your preferred date and time, and provide your address. The technician will visit your location at the scheduled time.'
    },
    {
      id: 3,
      category: 'customer',
      question: 'Are the shops on ElectroHub verified and trustworthy?',
      answer: 'Yes! All shops undergo a rigorous verification process including document verification, background checks, and quality assessment. We also have customer rating systems to ensure quality service.'
    },
    {
      id: 4,
      category: 'customer',
      question: 'How does the payment system work?',
      answer: 'We use secure escrow payment system. Your payment is held securely until service completion. Only after you confirm satisfactory service, the payment is released to the shop. This ensures protection for both customers and shops.'
    },
    {
      id: 5,
      category: 'customer',
      question: 'What if I\'m not satisfied with the service?',
      answer: 'Contact our support team within 24 hours of service completion. We offer a satisfaction guarantee and will work to resolve the issue, which may include re-service, partial refund, or full refund based on the situation.'
    },
    {
      id: 6,
      category: 'customer',
      question: 'How do I cancel or reschedule a booked service?',
      answer: 'Go to your orders section, select the booking, and choose cancel/reschedule option. Free cancellation is available up to 2 hours before scheduled time. Late cancellations may incur charges.'
    },
    {
      id: 7,
      category: 'customer',
      question: 'Can I get warranty for repairs done through ElectroHub?',
      answer: 'Yes! Most shops provide service warranty ranging from 30 days to 6 months depending on the service type. Warranty details are mentioned during booking and in your service receipt.'
    },
    {
      id: 8,
      category: 'customer',
      question: 'How do I rate and review a shop?',
      answer: 'After service completion, you\'ll receive a request to rate the shop. You can also go to your order history, select the completed service, and submit your rating and review.'
    },
    
    // Seller Support FAQs
    {
      id: 9,
      category: 'seller',
      question: 'How do I register my electronics shop on ElectroHub?',
      answer: 'Click on "Register as Seller" on the homepage, fill in your business details, upload required documents (GST, shop license, ID proof), and submit for verification. Our team will verify within 24-48 hours.'
    },
    {
      id: 10,
      category: 'seller',
      question: 'What documents are required for shop registration?',
      answer: 'Required documents include: GST certificate, Shop establishment license, Owner ID proof (Aadhaar/PAN), Business address proof, and any professional certifications. All documents are verified for authenticity.'
    },
    {
      id: 11,
      category: 'seller',
      question: 'How do I receive payments for services?',
      answer: 'Payments are processed through our secure platform. After service completion and customer approval, payments are transferred to your registered bank account within 2-3 business days, minus platform fees.'
    },
    {
      id: 12,
      category: 'seller',
      question: 'Can I update my service prices and offerings?',
      answer: 'Yes! You can update your service catalog, pricing, and availability anytime from your seller dashboard. Changes reflect immediately on your shop profile.'
    },
    {
      id: 13,
      category: 'seller',
      question: 'How are customer ratings calculated?',
      answer: 'Ratings are based on average of all customer reviews. We use a 5-star system across multiple parameters: service quality, timeliness, communication, and value for money.'
    },
    {
      id: 14,
      category: 'seller',
      question: 'What commission does ElectroHub charge?',
      answer: 'We charge 10-15% commission on each successful transaction, depending on your subscription plan. This includes platform maintenance, customer support, payment processing, and marketing.'
    },
    
    // Technical Issues FAQs
    {
      id: 15,
      category: 'technical',
      question: 'The website/app is not loading properly',
      answer: 'Clear your browser cache and cookies, try using a different browser, check your internet connection, or update the app. If problem persists, contact our technical support.'
    },
    {
      id: 16,
      category: 'technical',
      question: 'I\'m unable to make a payment',
      answer: 'Check if your payment method is valid, ensure sufficient balance, try a different payment method, or contact your bank. Our payment gateway supports UPI, cards, net banking, and wallets.'
    },
    {
      id: 17,
      category: 'technical',
      question: 'Notifications are not working',
      answer: 'Check notification settings in your device, ensure app permissions are granted, update the app to latest version, or reinstall the app if needed.'
    },
    
    // Payment & Refunds FAQs
    {
      id: 18,
      category: 'payment',
      question: 'How long does refund processing take?',
      answer: 'Refunds are processed within 5-7 business days after approval. The time taken to reflect in your account depends on your bank/payment method.'
    },
    {
      id: 19,
      category: 'payment',
      question: 'Are there any hidden charges?',
      answer: 'No hidden charges! All fees are clearly displayed during booking. You see the final amount including service charge, taxes, and platform fee before payment.'
    },
    
    // Account Issues FAQs
    {
      id: 20,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on login page, enter your registered email/mobile, follow the verification steps, and set a new password.'
    },
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? allFAQs 
    : allFAQs.filter(faq => faq.category === activeCategory);

  const contactMethods = [
    {
      icon: <FiPhone />,
      title: 'Call Support',
      details: ['1800-123-ELECTRO (5336)', 'Available 24/7'],
      buttonText: 'Call Now',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FiMail />,
      title: 'Email Support',
      details: ['support@electrohub.com', 'response within 4 hours'],
      buttonText: 'Send Email',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <FiMessageCircle />,
      title: 'Live Chat',
      details: ['Chat with support agent', 'Instant response'],
      buttonText: 'Start Chat',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <FiHeadphones />,
      title: 'Help Center',
      details: ['Browse help articles', 'Video tutorials'],
      buttonText: 'Browse Guides',
      color: 'from-orange-500 to-red-600'
    },
  ];

  const supportResources = [
    {
      title: 'User Guides & Tutorials',
      description: 'Step-by-step guides for using ElectroHub',
      icon: '📚'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch video guides for common tasks',
      icon: '🎬'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and experts',
      icon: '💬'
    },
    {
      title: 'Service Status',
      description: 'Check platform status and updates',
      icon: '📊'
    },
    {
      title: 'Policy Documents',
      description: 'Terms, privacy, and refund policies',
      icon: '📄'
    },
    {
      title: 'Safety Guidelines',
      description: 'Tips for safe transactions',
      icon: '🛡️'
    },
  ];

  const toggleFAQ = (id: number) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <FiHeadphones className="text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How Can We Help You?
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Get support for your queries, issues, or feedback. We're here to help 24/7.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full px-6 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${method.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="text-3xl mb-4">{method.icon}</div>
              <h3 className="text-xl font-bold mb-3">{method.title}</h3>
              {method.details.map((detail, idx) => (
                <p key={idx} className="text-white/90 mb-1">{detail}</p>
              ))}
              <button className="mt-6 w-full py-3 bg-white/20 backdrop-blur-sm rounded-lg font-medium hover:bg-white/30 transition">
                {method.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Support Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Browse Support Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`p-4 rounded-xl text-center transition-all ${
                activeCategory === 'all'
                  ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                  : 'bg-white border border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">All Topics</div>
              <div className="text-sm text-gray-500 mt-1">{allFAQs.length} FAQs</div>
            </button>
            
            {supportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-xl text-center transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                    : 'bg-white border border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-gray-500 mt-1">{category.count} FAQs</div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        faq.category === 'customer' ? 'bg-blue-100 text-blue-800' :
                        faq.category === 'seller' ? 'bg-green-100 text-green-800' :
                        faq.category === 'technical' ? 'bg-purple-100 text-purple-800' :
                        faq.category === 'payment' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="ml-4">
                    {activeFAQ === faq.id ? (
                      <FiChevronUp className="text-gray-400" />
                    ) : (
                      <FiChevronDown className="text-gray-400" />
                    )}
                  </div>
                </button>
                
                {activeFAQ === faq.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <p className="text-gray-600">{faq.answer}</p>
                    <div className="mt-4 flex gap-3">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        👍 Helpful
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        👎 Not Helpful
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        💬 Need more help?
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Helpful Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportResources.map((resource, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="text-3xl mb-4">{resource.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <button className="text-blue-600 font-medium hover:text-blue-800">
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Still Need Help? Contact Us
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select a category</option>
                    <option>Customer Support</option>
                    <option>Seller Support</option>
                    <option>Technical Issue</option>
                    <option>Payment Issue</option>
                    <option>Account Issue</option>
                    <option>Feedback/Suggestion</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your issue in detail..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:opacity-90 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <FiPhone className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="font-medium">Call Us</div>
                    <div className="text-gray-600">1800-123-ELECTRO</div>
                    <div className="text-sm text-gray-500">24/7 Support</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiMail className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="font-medium">Email Us</div>
                    <div className="text-gray-600">support@electrohub.com</div>
                    <div className="text-sm text-gray-500">Response within 4 hours</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiClock className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="font-medium">Support Hours</div>
                    <div className="text-gray-600">24/7 All Days</div>
                    <div className="text-sm text-gray-500">Including holidays</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiMapPin className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="font-medium">Office Address</div>
                    <div className="text-gray-600">
                      ElectroHub Headquarters<br />
                      Mumbai, Delhi, Bangalore
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Support */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <FiShield className="text-2xl text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Urgent Support Needed?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            For critical issues requiring immediate attention, contact our emergency support line
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 flex items-center">
              <FiPhone className="mr-2" />
              Emergency Support: 1800-911-ELECTRO
            </button>
            <div className="text-sm text-gray-500">
              Available 24/7 for critical issues
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}