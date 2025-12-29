'use client';

const categories = [
  {
    name: 'Smartphones',
    count: '15,000+',
    icon: '📱',
    color: 'bg-blue-100',
  },
  {
    name: 'Laptops',
    count: '8,000+',
    icon: '💻',
    color: 'bg-green-100',
  },
  {
    name: 'Audio Devices',
    count: '25,000+',
    icon: '🎧',
    color: 'bg-purple-100',
  },
  {
    name: 'Cameras',
    count: '5,000+',
    icon: '📸',
    color: 'bg-yellow-100',
  },
  {
    name: 'Home Appliances',
    count: '30,000+',
    icon: '🏠',
    color: 'bg-red-100',
  },
  {
    name: 'Wearables',
    count: '12,000+',
    icon: '⌚',
    color: 'bg-indigo-100',
  },
  {
    name: 'Gaming',
    count: '10,000+',
    icon: '🎮',
    color: 'bg-pink-100',
  },
  {
    name: 'Components',
    count: '50,000+',
    icon: '⚙️',
    color: 'bg-gray-100',
  },
];

export default function ProductCategories() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">
          Electronics Categories
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Browse through thousands of verified electronics products from trusted sellers
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`${category.color} rounded-xl p-6 card-hover cursor-pointer`}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.count} products</p>
              <button className="mt-4 text-blue-600 font-medium text-sm hover:underline">
                View Products →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}