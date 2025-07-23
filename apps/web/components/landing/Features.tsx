
import React from 'react';
import { ArrowRightIcon, GuideIcon, ExpertTipsIcon, PersonalizedIcon, CommunityIcon } from './icons';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-[#083b3b] rounded-2xl p-6 flex flex-col text-left transition-transform transform hover:-translate-y-2">
    <div className="text-[#14b8a6] mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <GuideIcon className="w-10 h-10" />,
      title: 'Zero Downloads Required',
      description: 'No app needed! Operate 100% within Telegram. Start in 1 click: Launch the bot, type /start, and begin planning.'
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
    <section className="bg-[#0a4848] text-white py-20 lg:py-28">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-3xl overflow-hidden mb-16">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
            alt="Mountain landscape"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative px-8 py-12 lg:py-20 flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="lg:w-3/5 text-center lg:text-left">
              <p className="font-semibold text-gray-200">
                <span className="text-yellow-400 mr-2">•</span> How It Works
              </p>
              <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold tracking-tight">
                Revolutionize Travel Planning <br/> Right Inside Telegram
              </h2>
              <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0">
                90% cheaper than travel agents. Privacy-first with Telegram's encryption. Real-time travel data via Google Flights & Google Maps. No hidden fees – pay only for what you use.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <button className="flex items-center px-8 py-4 bg-white text-[#0a4848] font-bold rounded-full hover:bg-gray-200 transition-transform transform hover:scale-105 shadow-lg whitespace-nowrap">
                Try Bot Now
                <ArrowRightIcon className="ml-3 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
