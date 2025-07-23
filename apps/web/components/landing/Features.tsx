
import React from 'react';
import { ArrowRightIcon, GuideIcon, ExpertTipsIcon, PersonalizedIcon, CommunityIcon } from './icons';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-gradient-to-br from-[#083b3b] to-[#0a4848] rounded-xl p-4 flex flex-col text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-white/10">
    <div className="text-[#14b8a6] mb-3">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <GuideIcon className="w-10 h-10" />,
      title: 'Zero Downloads Required',
      description: 'No app needed! Operate 100% within Telegram. Start in 1 click: Launch the webApp, type /start, and begin planning.'
    },
    {
      icon: <ExpertTipsIcon className="w-10 h-10" />,
      title: 'AI-Powered & Lightning Fast',
      description: 'Faster than Google: Generate full itineraries (flights, hotels, activities) in under 10 seconds. Smarter than humans.'
    },
    {
      icon: <PersonalizedIcon className="w-10 h-10" />,
      title: 'Telegram-Powered Payments',
      description: 'Seamless checkout via Telegram\'s native STAR payment system. Pay-per-trip pricing with no subscriptions.'
    },
    {
      icon: <CommunityIcon className="w-10 h-10" />,
      title: 'Export & Share Effortlessly',
      description: 'One-click export: Download plans as PDF, Text, or Calendar (.ics) files. Auto-sync to Google/Apple Calendar.'
    }
  ];

  return (
    <section className="bg-[#0a4848] text-white py-12 lg:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-[#083b3b] to-[#0a4848]">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
            alt="Mountain landscape"
            className="absolute inset-0 w-full h-full object-cover opacity-15"
          />
          <div className="relative px-6 py-10 lg:py-14 flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="lg:w-3/5 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 text-sm font-medium text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full mb-4">
                <span>•</span>
                <span>How It Works</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Revolutionize Travel Planning <br className="hidden lg:block"/> Right Inside Telegram
              </h2>
              <p className="mt-4 text-base text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                90% cheaper than travel agents. Privacy-first with Telegram's encryption. Real-time travel data via Google Flights & Google Maps. No hidden fees – pay only for what you use.
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <button className="flex items-center px-6 py-3 bg-white text-[#0a4848] font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Try webApp Now
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
