
import React from 'react';
import { ArrowRightIcon, LightboxLogo, SpheruleLogo, NietzscheLogo, MapPinIcon, RouteIcon, BinocularsIcon, CampIcon } from './icons';

const LocationTag: React.FC<{ icon: React.ReactNode; text: string; subtext?: string; }> = ({ icon, text, subtext }) => (
    <div className="absolute bg-white/90 backdrop-blur-sm rounded-full p-1.5 pr-3 shadow-md flex items-center text-xs text-gray-700">
        <div className="bg-gray-100 rounded-full p-1 mr-1.5">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-xs">{text}</p>
            {subtext && <p className="text-gray-500 text-xs -mt-0.5">{subtext}</p>}
        </div>
    </div>
);

const Hero: React.FC = () => {
    return (
        <section className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                <div className="lg:col-span-5 text-center lg:text-left">
                    <div className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#10b981] bg-emerald-50 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span>
                        <span>AI Trip Planner</span>
                    </div>

                    <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a4848] tracking-tight leading-tight">
                        Plan Perfect Trips in Seconds!
                    </h1>

                    <p className="mt-4 text-base text-gray-600 leading-relaxed">
                        Zero downloads, instant access. AI-powered trip planning right inside Telegram - faster than Google, smarter than humans.
                    </p>
                    
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                        <div className="flex items-center -space-x-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <img
                                    key={index}
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                    src={`https://picsum.photos/seed/${index+10}/32/32`}
                                    alt={`Customer ${index + 1}`}
                                />
                            ))}
                        </div>
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full py-1.5 px-4 text-center border border-emerald-100">
                            <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></span>
                            <span>23K+ Happy Travelers</span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <button className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0a4848] to-[#0d5555] text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            🚀 Launch webApp Now
                            <ArrowRightIcon className="ml-2 w-4 h-4" />
                        </button>
                        <p className="text-sm text-gray-500 text-center lg:text-left">
                            No installs. No hassle. Just AI magic in Telegram.
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 opacity-70">
                        <div className="flex items-center space-x-1 text-[#0a4848]">
                            <span className="font-semibold text-sm">🚀 Instant</span>
                        </div>
                         <div className="flex items-center space-x-1 text-[#0a4848]">
                            <span className="font-semibold text-sm">⚡ Fast</span>
                        </div>
                         <div className="flex items-center space-x-1 text-[#0a4848]">
                            <span className="font-semibold text-sm">🔒 Secure</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop" 
                            alt="AI Trip Planning" 
                            className="rounded-2xl lg:rounded-3xl w-full h-full object-cover shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;