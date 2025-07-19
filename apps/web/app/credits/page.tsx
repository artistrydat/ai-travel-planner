"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{
      backgroundColor: 'var(--tg-theme-bg-color, #f8fafc)',
      color: 'var(--tg-theme-text-color, #1e293b)'
    }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 9.95 5.16-.212 9-4.4 9-9.95V7l-10-5z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI Travel Planner</h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/landing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Credit Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6 text-center">
              Last updated: July 19, 2025
            </p>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">What Are Credits?</h2>
                <p>
                  Credits are the virtual currency used in AI Travel Planner to access AI-powered trip planning services. 
                  Each credit represents one AI-generated itinerary request, providing you with a complete, personalized 
                  travel plan including attractions, restaurants, accommodations, and interactive maps.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Free Credit Allocation</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎉</span>
                    <div>
                      <h3 className="font-semibold text-green-800">Welcome Bonus</h3>
                      <p className="text-green-700">New users receive 10 free credits upon first login (worth $10 value)</p>
                    </div>
                  </div>
                </div>
                <p>
                  This welcome bonus allows you to explore our AI travel planning capabilities and generate up to 
                  10 complete itineraries at no cost. Additional credits can be purchased as needed.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Credit Usage</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Current Pricing:</h3>
                  <ul className="text-blue-700 space-y-1">
                    <li>• 1 credit = 1 AI-generated itinerary</li>
                    <li>• Each itinerary includes detailed day-by-day plans</li>
                    <li>• Interactive maps with photos and reviews</li>
                    <li>• Export capabilities (PDF, sharing)</li>
                  </ul>
                </div>
                <p>
                  Credits are consumed only when you successfully generate a complete itinerary. Failed requests 
                  or errors do not consume credits, ensuring you only pay for successful AI-generated plans.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Purchasing Credits</h2>
                <p>
                  Additional credits can be purchased securely through Telegram Payments, supporting various 
                  payment methods including:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Credit and debit cards</li>
                  <li>Digital wallets</li>
                  <li>Local payment methods (varies by region)</li>
                </ul>
                <p className="mt-3">
                  All transactions are processed securely through Telegram's payment system. We do not store 
                  or have access to your payment information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Credit Packages</h2>
                <div className="grid md:grid-cols-3 gap-4 my-6">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-gray-900">Starter Pack</h4>
                    <p className="text-2xl font-bold text-blue-600">$5</p>
                    <p className="text-sm text-gray-600">5 Credits</p>
                  </div>
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-blue-900">Popular</h4>
                    <p className="text-2xl font-bold text-blue-600">$15</p>
                    <p className="text-sm text-blue-700">20 Credits</p>
                    <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                      25% Bonus
                    </span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-gray-900">Power User</h4>
                    <p className="text-2xl font-bold text-blue-600">$40</p>
                    <p className="text-sm text-gray-600">60 Credits</p>
                    <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                      50% Bonus
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Important Terms</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Please Note:</h3>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Credits are non-refundable after purchase</li>
                    <li>• Credits are non-transferable between users</li>
                    <li>• Credits do not expire but account cleanup after 90 days of inactivity</li>
                    <li>• Refunds only available for technical issues preventing service access</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Fair Usage</h2>
                <p>
                  Our credit system ensures fair access to AI travel planning for all users. We reserve the right 
                  to limit excessive automated requests or abuse of the service. Each credit entitles you to one 
                  genuine travel planning request.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Support</h2>
                <p>
                  If you experience technical issues with credit purchases or itinerary generation, please contact 
                  us through Telegram. We provide full support for transaction issues and technical problems that 
                  prevent proper service delivery.
                </p>
              </section>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-6">
              Ready to start planning your next adventure?
            </p>
            <Link 
              href="/landing"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #2481cc)'
              }}
            >
              Get Started with 10 Free Credits
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="font-medium text-gray-900">AI Travel Planner</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/landing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2025 AI Travel Planner • Powered by Telegram
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreditPolicyPage;
