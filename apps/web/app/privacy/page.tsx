"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';

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
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 9.95 5.16-.212 9-4.4 9-9.95V7l-10-5z"/>
                  </svg>
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

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-3xl shadow-2xl p-8 md:p-16 border border-white/10 backdrop-blur-xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-6 shadow-2xl">
              <span className="text-3xl">🔒</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-gray-300 text-lg">
              Last updated: July 19, 2025
            </p>
          </div>
          
          <div className="space-y-8">
            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">🛡️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Our Commitment to Privacy</h2>
                  <p className="text-gray-300 leading-relaxed">
                    AI Travel Planner operates as a Telegram mini-app and strictly follows Telegram's privacy policy 
                    and data protection standards. We are committed to protecting your privacy and ensuring compliance 
                    with GDPR and other global data protection laws.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">📊</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">Data Collection</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We collect only essential data necessary to provide our AI travel planning service:
                  </p>
                  <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/40 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-blue-200">Telegram user identifier (for authentication)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-blue-200">Travel preferences and search queries</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-blue-200">Generated itineraries and saved trips</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-blue-200">Credit usage and purchase history</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    We do not collect personal information beyond what's necessary for service operation. 
                    No sensitive personal data such as payment details are stored on our servers.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">Data Usage</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Your data is used solely for:
                  </p>
                  <div className="grid gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">Providing personalized travel itinerary recommendations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">Improving our AI algorithms and service quality</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">Managing your credit balance and purchase history</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">Enabling data export and sharing features you request</span>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    We never share, sell, or rent your personal data to third parties for commercial purposes.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">🔐</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We implement industry-standard security measures to protect your data, including encryption 
                    in transit and at rest. All data processing occurs within secure, compliant cloud infrastructure.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">⏰</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
                  <p className="text-gray-300 leading-relaxed">
                    To protect your privacy, we automatically delete user data after 90 days of inactivity. 
                    You can request immediate data deletion by contacting us through Telegram.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">⚖️</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Under GDPR and other privacy laws, you have the right to:
                  </p>
                  <div className="grid gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-gray-300">Access your personal data</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-gray-300">Correct inaccurate information</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-gray-300">Request data deletion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-gray-300">Export your data</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-gray-300">Withdraw consent at any time</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">📱</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Telegram Integration</h2>
                  <p className="text-gray-300 leading-relaxed">
                    As a Telegram mini-app, we operate under Telegram's privacy framework. Telegram's own 
                    privacy policy applies to all interactions within their platform. We recommend reviewing 
                    Telegram's privacy policy for comprehensive understanding of data handling.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <p className="text-gray-300 leading-relaxed">
                    For privacy-related questions or requests, please contact us through our Telegram bot. 
                    We respond to all privacy inquiries within 48 hours.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">🔄</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Policy Updates</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may update this privacy policy to reflect changes in our practices or legal requirements. 
                    Users will be notified of significant changes through Telegram.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-16 pt-12 border-t border-white/10 text-center">
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
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 bg-slate-900/60 backdrop-blur-xl border-t border-white/10 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
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
