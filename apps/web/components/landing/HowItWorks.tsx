import React from 'react';

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon }) => (
  <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="absolute -top-4 left-8">
      <div className="w-8 h-8 bg-[#0a4848] text-white rounded-full flex items-center justify-center font-bold text-sm">
        {number}
      </div>
    </div>
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-[#0a4848] mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  const steps: StepProps[] = [
    {
      number: "1",
      title: "Start the Bot",
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
      description: "Charge your credits via Telegram STAR Payment. Export to PDF/Text/Calendar with a tap.",
      icon: "💳"
    }
  ];

  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="inline-flex items-center space-x-2 text-sm font-medium text-[#10b981] mb-4">
            <span className="w-2 h-2 bg-[#10b981] rounded-full"></span>
            <span>Simple Process</span>
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0a4848] mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From idea to itinerary in 4 simple steps. No complex interfaces, just AI magic in Telegram.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#0a4848] mb-4">✨ Why Users Love It</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">🌏</div>
                <p className="font-semibold text-[#0a4848]">Digital Nomads</p>
                <p className="text-gray-600">"Planned my Thailand workation in 20 seconds!"</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
                <p className="font-semibold text-[#0a4848]">Families</p>
                <p className="text-gray-600">"Exported Disneyland PDF for the kids – zero stress!"</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎒</div>
                <p className="font-semibold text-[#0a4848]">Backpackers</p>
                <p className="text-gray-600">"Found hidden hostels 80% cheaper than Booking.com!"</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-8 py-4 bg-[#0a4848] text-white font-bold rounded-full hover:bg-[#0d5555] transition-transform transform hover:scale-105 shadow-lg">
            👉 Launch Bot Now: t.me/AITripPlannerBot
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
