import {
  UserPlusIcon,
  CubeIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const steps = [
  {
    title: 'For Sellers',
    icon: UserPlusIcon,
    points: [
      'Register as verified electronics seller',
      'List products with detailed specifications',
      'Set competitive pricing & inventory',
      'Receive orders through platform',
      'Ship with partner logistics',
      'Get secure payments after delivery',
    ],
  },
  {
    title: 'Platform Role',
    icon: CreditCardIcon,
    points: [
      'Verify seller credentials & products',
      'Hold payments in secure escrow',
      'Provide buyer protection guarantee',
      'Handle disputes & returns',
      'Ensure quality standards',
      'Offer logistics & warehousing',
    ],
    highlighted: true,
  },
  {
    title: 'For Customers',
    icon: CubeIcon,
    points: [
      'Browse verified electronics',
      'Compare prices & reviews',
      'Place secure orders',
      'Track deliveries in real-time',
      'Receive quality-checked products',
      'Get after-sales support',
    ],
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">
          How ElectroHub Works
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          A secure three-way marketplace connecting electronics sellers with customers
          through our trusted platform
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`bg-white rounded-xl shadow-lg p-8 card-hover ${
                step.highlighted ? 'border-2 border-blue-500 relative' : ''
              }`}
            >
              {step.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Our Role as Third-Party
                  </span>
                </div>
              )}
              
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-lg ${
                  step.highlighted ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <step.icon className={`h-8 w-8 ${
                    step.highlighted ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold ml-4">{step.title}</h3>
              </div>
              
              <ul className="space-y-3">
                {step.points.map((point, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-blue-900">
            Why Trust Our Platform?
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-bold mb-2">Secure Escrow</h4>
              <p className="text-sm text-gray-600">Payments held until delivery confirmation</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-bold mb-2">Verified Sellers</h4>
              <p className="text-sm text-gray-600">Rigorous seller verification process</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-bold mb-2">Quality Check</h4>
              <p className="text-sm text-gray-600">Products verified before shipping</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCardIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-bold mb-2">Easy Returns</h4>
              <p className="text-sm text-gray-600">30-day return policy on all products</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShieldCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}