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
              <Link href="/credits" className="text-gray-600 hover:text-blue-600 transition-colors">
                Credit Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6 text-center">
              Last updated: July 19, 2025
            </p>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Commitment to Privacy</h2>
                <p>
                  AI Travel Planner operates as a Telegram mini-app and strictly follows Telegram's privacy policy 
                  and data protection standards. We are committed to protecting your privacy and ensuring compliance 
                  with GDPR and other global data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Collection</h2>
                <p>
                  We collect only essential data necessary to provide our AI travel planning service:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Telegram user identifier (for authentication)</li>
                  <li>Travel preferences and search queries</li>
                  <li>Generated itineraries and saved trips</li>
                  <li>Credit usage and purchase history</li>
                </ul>
                <p className="mt-3">
                  We do not collect personal information beyond what's necessary for service operation. 
                  No sensitive personal data such as payment details are stored on our servers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Usage</h2>
                <p>
                  Your data is used solely for:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Providing personalized travel itinerary recommendations</li>
                  <li>Improving our AI algorithms and service quality</li>
                  <li>Managing your credit balance and purchase history</li>
                  <li>Enabling data export and sharing features you request</li>
                </ul>
                <p className="mt-3">
                  We never share, sell, or rent your personal data to third parties for commercial purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your data, including encryption 
                  in transit and at rest. All data processing occurs within secure, compliant cloud infrastructure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Retention</h2>
                <p>
                  To protect your privacy, we automatically delete user data after 90 days of inactivity. 
                  You can request immediate data deletion by contacting us through Telegram.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h2>
                <p>
                  Under GDPR and other privacy laws, you have the right to:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request data deletion</li>
                  <li>Export your data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Telegram Integration</h2>
                <p>
                  As a Telegram mini-app, we operate under Telegram's privacy framework. Telegram's own 
                  privacy policy applies to all interactions within their platform. We recommend reviewing 
                  Telegram's privacy policy for comprehensive understanding of data handling.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
                <p>
                  For privacy-related questions or requests, please contact us through our Telegram bot. 
                  We respond to all privacy inquiries within 48 hours.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Policy Updates</h2>
                <p>
                  We may update this privacy policy to reflect changes in our practices or legal requirements. 
                  Users will be notified of significant changes through Telegram.
                </p>
              </section>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-6">
              Questions about our privacy practices?
            </p>
            <Link 
              href="/landing"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #2481cc)'
              }}
            >
              Back to AI Travel Planner
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
              <Link href="/credits" className="text-gray-600 hover:text-blue-600 transition-colors">
                Credit Policy
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

export default PrivacyPolicyPage;
