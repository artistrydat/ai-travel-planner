"use client";

import Link from 'next/link';
import { useEffect } from 'react';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    // Apply Telegram WebApp theme colors if available
    if (typeof window !== 'undefined') {
      const telegram = (window as any).Telegram;
      if (telegram?.WebApp) {
        telegram.WebApp.ready();
        // Set theme colors for better integration
        document.documentElement.style.setProperty('--tg-theme-bg-color', telegram.WebApp.backgroundColor || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', telegram.WebApp.textColor || '#000000');
        document.documentElement.style.setProperty('--tg-theme-button-color', telegram.WebApp.buttonColor || '#2481cc');
      }
    }

    // Add enhanced UIVERSE animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-up {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      @keyframes glow-pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
      }
      .float-animation {
        animation: float-up 3s ease-in-out infinite;
      }
      .glow-animation {
        animation: glow-pulse 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden" style={{
      backgroundColor: 'var(--tg-theme-bg-color, var(--color-bg))',
      color: 'var(--tg-theme-text-color, var(--color-text-base))'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/15 to-teal-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/15 to-indigo-600/15 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <span className="text-xl">🤖</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">AI Travel Planner</h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/landing" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10">
                Home
              </Link>
              <Link href="/credits" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10">
                Credit Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Enhanced UIVERSE Style */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative group">
          {/* Floating glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
          
          <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-16 border border-white/10 hover:border-green-400/30 transition-all duration-500">
            {/* Enhanced Header Section */}
            <div className="text-center mb-12 relative">
              {/* Floating particles */}
              <div className="absolute -top-4 left-1/4 w-3 h-3 bg-green-400/60 rounded-full animate-bounce delay-100"></div>
              <div className="absolute -top-2 right-1/3 w-2 h-2 bg-teal-400/70 rounded-full animate-bounce delay-300"></div>
              <div className="absolute top-2 left-1/6 w-2.5 h-2.5 bg-cyan-400/50 rounded-full animate-bounce delay-500"></div>
              
              {/* Enhanced icon with layers */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-2xl animate-pulse glow-animation"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl float-animation hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🔒</span>
                </div>
                {/* Orbiting elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400/30 rounded-full animate-spin"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-teal-400/40 rounded-full animate-ping"></div>
              </div>
              
              {/* Enhanced title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 relative">
                <span className="bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 inline-block">
                  Privacy Policy
                </span>
                {/* Animated underline */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full transition-all duration-1000 group-hover:w-32"></div>
              </h1>
              
              <div className="relative">
                <p className="text-gray-300 text-lg backdrop-blur-sm bg-black/20 rounded-2xl px-6 py-3 border border-green-400/20">
                  Last updated: July 19, 2025
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent rounded-2xl blur"></div>
              </div>
            </div>
          
          <div className="space-y-8">
            <section className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-start gap-6 p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-green-400/30">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,17.4 15.4,18 14.8,18H9.2C8.6,18 8,17.4 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">Information We Collect</h3>
                  <p className="text-gray-300 leading-relaxed mb-4 group-hover:text-gray-200 transition-colors">
                    We collect information you provide directly when using our travel planning services through Telegram.
                  </p>
                  <ul className="text-gray-400 space-y-2 text-sm">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></span>Travel preferences and destination requests</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></span>Telegram user information (username, ID)</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></span>Search history and saved itineraries</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-start gap-6 p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-blue-400/30">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">How We Use Your Data</h3>
                  <p className="text-gray-300 leading-relaxed mb-4 group-hover:text-gray-200 transition-colors">
                    Your information helps us provide personalized travel recommendations and improve our services.
                  </p>
                  <ul className="text-gray-400 space-y-2 text-sm">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>Generate personalized travel itineraries</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>Provide weather and flight information</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>Enhance AI recommendations over time</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-start gap-6 p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-400/30">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10,4H14V6H10V4M9,2V8H15V2H9M15.5,22H8.5A1.5,1.5 0 0,1 7,20.5V19.5A1.5,1.5 0 0,1 8.5,18H15.5A1.5,1.5 0 0,1 17,19.5V20.5A1.5,1.5 0 0,1 15.5,22M15.5,16H8.5A3.5,3.5 0 0,0 5,19.5V20.5A3.5,3.5 0 0,0 8.5,24H15.5A3.5,3.5 0 0,0 19,20.5V19.5A3.5,3.5 0 0,0 15.5,16Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">Data Security</h3>
                  <p className="text-gray-300 leading-relaxed mb-4 group-hover:text-gray-200 transition-colors">
                    We implement industry-standard security measures to protect your personal information.
                  </p>
                  <ul className="text-gray-400 space-y-2 text-sm">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></span>End-to-end encryption for sensitive data</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></span>Secure storage with regular backups</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></span>No sharing with third parties without consent</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-16 pt-12 border-t border-white/10 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Questions about our privacy practices?
                </h3>
                <p className="text-gray-300 mb-8">
                  We're committed to transparency and protecting your data
                </p>
                <Link 
                  href="/landing"
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40"
                  style={{
                    backgroundColor: 'var(--tg-theme-button-color, #6366F1)'
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="text-xl">🚀</span>
                  <span className="relative z-10">Back to AI Travel Planner</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
                </Link>
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>      {/* Enhanced Footer */}
      <footer className="relative z-10 bg-slate-900/60 backdrop-blur-xl border-t border-white/10 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <span className="font-bold text-white text-lg">AI Travel Planner</span>
            </div>
            <div className="flex space-x-8">
              <Link href="/landing" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                Home
              </Link>
              <Link href="/credits" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                Credit Policy
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-white/10">
            <p className="text-gray-400">
              © 2025 AI Travel Planner • Powered by Telegram • Made with ❤️ for travelers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
