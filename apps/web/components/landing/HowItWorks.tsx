import React from 'react';

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon }) => (
  <div className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
    <div className="absolute -top-3 left-6">
      <div className="w-6 h-6 bg-gradient-to-r from-[#0a4848] to-[#0d5555] text-white rounded-full flex items-center justify-center font-bold text-xs">
        {number}
      </div>
    </div>
    <div className="text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-[#0a4848] mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  const steps: StepProps[] = [
    {
      number: "1",
      title: "Start the webApp",
      description: "Search @AITripPlannerBot in Telegram. No downloads, no installations required.",
      icon: "🤖"
    },
    {
      number: "2", 
      title: "Switch to Agent Mode",
      description: "Activate agent mode and describe your trip: '3-day Bali trip, budget $300, vegan food, beaches'",
      icon: "🔄"
    },
    {
      number: "3",
      title: "AI Generates Your Plan",
      description: "Get a full itinerary with maps, bookings, and prices in under 10 seconds.",
      icon: "⚡"
    },
    {
      number: "4",
      title: "Refill Credits & Export",
      description: "Charge your credits via Telegram Stars Payment. Export to PDF/Text/Calendar with a tap.",
      icon: "💳"
    }
  ];

  return (
    <section className="bg-gray-50 py-12 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 text-sm font-medium text-[#10b981] bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span>
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0a4848] mb-4">
            How It Works
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From idea to itinerary in 4 simple steps. No complex interfaces, just AI magic in Telegram.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0a4848] to-[#0d5555] text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            👉 Launch webApp Now: t.me/AITripPlannerBot
          </button>
          <p className="mt-3 text-sm text-gray-500">
            Perfect for: Solo travelers, busy professionals, budget backpackers, and travel influencers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
