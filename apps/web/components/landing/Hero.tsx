
import React from 'react';
import { ArrowRightIcon, LightboxLogo, SpheruleLogo, NietzscheLogo, MapPinIcon, RouteIcon, BinocularsIcon, CampIcon } from './icons';

const LocationTag: React.FC<{ icon: React.ReactNode; text: string; subtext?: string; }> = ({ icon, text, subtext }) => (
    <div className="absolute bg-white/80 backdrop-blur-md rounded-full p-2 pr-4 shadow-lg flex items-center text-xs text-gray-700 animate-fade-in-up">
        <div className="bg-gray-100 rounded-full p-1.5 mr-2">
            {icon}
        </div>
        <div>
            <p className="font-bold">{text}</p>
            {subtext && <p className="text-gray-500 -mt-0.5">{subtext}</p>}
        </div>
    </div>
);

const Hero: React.FC = () => {
    return (
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 text-center lg:text-left">
                    <p className="inline-flex items-center justify-center lg:justify-start space-x-2 text-sm font-medium text-[#10b981]">
                        <span className="w-2 h-2 bg-[#10b981] rounded-full"></span>
                        <span>Hiking & Outdoor Activities</span>
                    </p>

                    <h1 className="mt-4 text-5xl md:text-6xl font-extrabold text-[#0a4848] tracking-tight">
                        Your Adventure Starts Here!
                    </h1>

                    <p className="mt-6 text-lg text-gray-600">
                        Find expert advice, detailed trail guides, and the best equipment to start your hiking journey today.
                    </p>
                    
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <div className="flex items-center -space-x-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <img
                                    key={index}
                                    className="w-12 h-12 rounded-full border-4 border-[#F9FAF8] object-cover"
                                    src={`https://picsum.photos/seed/${index+10}/48/48`}
                                    alt={`Customer ${index + 1}`}
                                />
                            ))}
                        </div>
                        <div className="bg-gray-100 rounded-full py-2 px-5 text-center">
                            <p className="font-bold text-[#0a4848]">23K+</p>
                            <p className="text-xs text-gray-500">Worldwide Customer</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <button className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-[#0a4848] text-white font-bold rounded-full hover:bg-[#0d5555] transition-transform transform hover:scale-105 shadow-lg">
                            Start Adventure
                            <ArrowRightIcon className="ml-3 w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-16 flex items-center justify-center lg:justify-start space-x-8 opacity-60">
                        <div className="flex items-center space-x-2 text-[#0a4848]">
                            <LightboxLogo className="w-6 h-6"/>
                            <span className="font-bold text-lg">Lightbox</span>
                        </div>
                         <div className="flex items-center space-x-2 text-[#0a4848]">
                            <SpheruleLogo className="w-6 h-6"/>
                            <span className="font-bold text-lg">Spherule</span>
                        </div>
                         <div className="flex items-center space-x-2 text-[#0a4848]">
                            <NietzscheLogo className="w-6 h-6"/>
                            <span className="font-bold text-lg">Nietzsche</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop" 
                            alt="Hiker on a mountain trail" 
                            className="rounded-[40px] w-full h-full object-cover shadow-2xl"
                        />
                        <div className="absolute top-8 right-8">
                             <LocationTag icon={<MapPinIcon className="w-4 h-4 text-[#0a4848]" />} text="Rainer Mountain" subtext="10 miles"/>
                        </div>
                        <div className="absolute top-1/3 left-8">
                            <LocationTag icon={<RouteIcon className="w-4 h-4 text-[#0a4848]" />} text="Extreme Route" />
                        </div>
                         <div className="absolute top-2/3 left-1/4">
                            <LocationTag icon={<CampIcon className="w-4 h-4 text-[#0a4848]" />} text="Camp Site" />
                        </div>
                         <div className="absolute bottom-1/3 left-16">
                            <LocationTag icon={<BinocularsIcon className="w-4 h-4 text-[#0a4848]" />} text="Viewpoint" />
                        </div>
                         <div className="absolute bottom-8 right-1/2 translate-x-1/2">
                            <div className="bg-white/80 backdrop-blur-md rounded-full p-2 pr-5 shadow-lg flex items-center text-sm">
                                <div className="bg-gray-100 rounded-full p-2 mr-3">
                                    <MapPinIcon className="w-5 h-5 text-[#0a4848]" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">Mount Rainier National Park, USA</p>
                                    <p className="text-xs text-gray-500 -mt-0.5">Southwest Track</p>
                                </div>
                            </div>
                        </div>
                        {/* Wavy path overlay */}
                         <svg className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/3 pointer-events-none" width="250" height="150" viewBox="0 0 250 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 146C46.8049 119.825 125.438 41.5173 246 4" stroke="url(#paint0_linear_101_2)" strokeWidth="8" strokeLinecap="round" strokeDasharray="16 16"/>
                            <defs>
                                <linearGradient id="paint0_linear_101_2" x1="246" y1="4" x2="4" y2="146" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" stopOpacity="0.7"/>
                                <stop offset="1" stopColor="white" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;