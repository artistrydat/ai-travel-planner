"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ITEMS } from '../../components/creditstore/data/items';
import { DEFAULT_OPERATION_COSTS, formatCostDisplay } from '../../config/operationCosts';

const CreditPolicyPage: React.FC = () => {
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/15 to-purple-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/15 to-blue-600/15 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-3xl shadow-2xl p-8 md:p-16 border border-white/10 backdrop-blur-xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-2xl">
              <span className="text-3xl">⭐</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Credit Policy
              </span>
            </h1>
            <p className="text-gray-300 text-lg">
              Last updated: July 19, 2025
            </p>
          </div>

          <div className="space-y-8">
            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">💎</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">What Are Credits?</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Credits are the virtual currency used in AI Travel Planner to access AI-powered trip planning services. 
                    Each credit represents one AI-generated itinerary request, providing you with a complete, personalized 
                    travel plan including attractions, restaurants, accommodations, and interactive maps.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">🎉</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">Free Credit Allocation</h2>
                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">�</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-emerald-300 mb-2">Welcome Bonus</h3>
                        <p className="text-emerald-200">New users receive 10 free credits upon first login (worth $10 value)</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    This welcome bonus allows you to explore our AI travel planning capabilities and generate up to 
                    10 complete itineraries at no cost. Additional credits can be purchased as needed.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">⚡</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">Credit Usage</h2>
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-cyan-300 mb-4">Current Pricing:</h3>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-cyan-200">1 credit = 1 AI-generated itinerary</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-cyan-200">Each itinerary includes detailed day-by-day plans</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-cyan-200">Interactive maps with photos and reviews</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-cyan-200">Export capabilities (PDF, sharing)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Credits are consumed only when you successfully generate a complete itinerary. Failed requests 
                    or errors do not consume credits, ensuring you only pay for successful AI-generated plans.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">💳</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">Purchasing Credits</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Additional credits can be purchased securely through Telegram Payments, supporting various 
                    payment methods including:
                  </p>
                  <div className="grid gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      <span className="text-gray-300">Credit and debit cards</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      <span className="text-gray-300">Digital wallets</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      <span className="text-gray-300">Local payment methods (varies by region)</span>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    All transactions are processed securely through Telegram's payment system. We do not store 
                    or have access to your payment information.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">📦</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-6">Credit Packages</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {ITEMS.map((item, index) => {
                      const styles = [
                        { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-400/40', accent: 'text-purple-300', icon: 'from-purple-500 to-pink-600' },
                        { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-400/40', accent: 'text-cyan-300', icon: 'from-cyan-500 to-blue-600' },
                        { bg: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-400/40', accent: 'text-emerald-300', icon: 'from-emerald-500 to-green-600' }
                      ];
                      const style = styles[index % styles.length];
                      const isPopular = item.bonus && item.bonus > 0;
                      
                      return (
                        <div key={item.id} className={`group relative bg-gradient-to-br ${style.bg} border ${style.border} rounded-2xl p-6 text-center backdrop-blur-sm hover:border-opacity-80 transition-all duration-300 ${isPopular ? 'ring-2 ring-amber-400/30 scale-105' : ''}`}>
                          {isPopular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              POPULAR
                            </div>
                          )}
                          <div className={`w-16 h-16 bg-gradient-to-br ${style.icon} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg`}>
                            {item.icon}
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">{item.name.replace(/^[📖⭐🌟]\s*/, '')}</h4>
                          <p className={`text-3xl font-bold ${style.accent} mb-2`}>⭐ {item.price}</p>
                          <div className="mb-4">
                            <p className={`${style.accent} text-sm mb-1`}>
                              {item.credits + (item.bonus || 0)} Credits Total
                            </p>
                            {item.bonus && (
                              <p className="text-xs text-gray-300">
                                ({item.credits} base + {item.bonus} bonus)
                              </p>
                            )}
                          </div>
                          <div className={`bg-gradient-to-r ${style.bg} border ${style.border} rounded-xl p-2`}>
                            <span className={`${style.accent} text-xs font-medium`}>
                              {item.bonus ? `${Math.round((item.bonus / item.credits) * 100)}% Bonus Credits` : 'Essential Package'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">⚡</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">Operation Costs</h2>
                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/40 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-indigo-300 mb-4">Current Pricing Structure:</h3>
                    <div className="grid gap-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-400/30">
                          <h4 className="text-indigo-300 font-medium mb-2">Itinerary Generation</h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-indigo-200">• {formatCostDisplay(DEFAULT_OPERATION_COSTS.itineraryGeneration.costPerDay)} per day</p>
                            <p className="text-indigo-200">• Minimum: {formatCostDisplay(DEFAULT_OPERATION_COSTS.itineraryGeneration.minimumCost)}</p>
                            <p className="text-indigo-200">• Maximum: {formatCostDisplay(DEFAULT_OPERATION_COSTS.itineraryGeneration.maximumCost)}</p>
                          </div>
                        </div>
                        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-400/30">
                          <h4 className="text-purple-300 font-medium mb-2">Export Options</h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-purple-200">• Text file: {formatCostDisplay(DEFAULT_OPERATION_COSTS.export.textFile)}</p>
                            <p className="text-purple-200">• PDF document: {formatCostDisplay(DEFAULT_OPERATION_COSTS.export.pdfFile)}</p>
                            <p className="text-purple-200">• Calendar file: {formatCostDisplay(DEFAULT_OPERATION_COSTS.export.calendarFile)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Our transparent pricing ensures you know exactly what each feature costs. Credits are only consumed 
                    when you successfully generate content, with no charges for failed requests or system errors.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">Important Terms</h2>
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-amber-300 mb-4">Please Note:</h3>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span className="text-amber-200">Credits are non-refundable after purchase</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span className="text-amber-200">Credits are non-transferable between users</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span className="text-amber-200">Credits do not expire but account cleanup after 90 days of inactivity</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span className="text-amber-200">Refunds only available for technical issues preventing service access</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">🛡️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Fair Usage</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our credit system ensures fair access to AI travel planning for all users. We reserve the right 
                    to limit excessive automated requests or abuse of the service. Each credit entitles you to one 
                    genuine travel planning request.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">🎧</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Support</h2>
                  <p className="text-gray-300 leading-relaxed">
                    If you experience technical issues with credit purchases or itinerary generation, please contact 
                    us through Telegram. We provide full support for transaction issues and technical problems that 
                    prevent proper service delivery.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-16 pt-12 border-t border-white/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to start planning your next adventure?
            </h3>
            <p className="text-gray-300 mb-8">
              Get started with your 10 free credits and discover amazing destinations
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
              <span className="relative z-10">Get Started with 10 Free Credits</span>
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
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                Privacy Policy
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

export default CreditPolicyPage;
