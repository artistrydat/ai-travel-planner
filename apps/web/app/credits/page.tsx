'use client';

import React from 'react';
import Link from 'next/link';
import { RealtimeCredits } from '@/components/auxiliary/RealtimeCredits';
import { useSEO } from '../../hooks/useSEO';
import { siteMetadata } from '../../data/metadata';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const CreditPolicyPage: React.FC = () => {
  // SEO Hook
  useSEO('credits');
  
  return (
    <div className="min-h-screen bg-white" style={{
      backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      color: 'var(--tg-theme-text-color, #000000)'
    }}>
      
      <Header variant="minimal" />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
              Credit Collections
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Understand how our sophisticated credit system works, with transparent pricing, flexible usage, and premium support for your travel curation needs.
            </p>
          </div>

          {/* What are Credits */}
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                💳 What are Credits?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    Credits are the currency used to access AI Travel Planner services. Each operation consumes a specific amount of credits based on the complexity and resources required.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Used for AI-powered itinerary generation
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Required for advanced planning features
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Enables premium service access
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                    Credit Balance
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      <RealtimeCredits />
                    </div>
                    <p className="text-gray-600">Available Credits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Usage */}
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-6" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                📊 Credit Usage
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🗺️</div>
                  <h3 className="font-semibold mb-2" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                    Basic Itinerary
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">5 Credits</p>
                  <p className="text-sm text-gray-600">Simple day planning with basic recommendations</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">⭐</div>
                  <h3 className="font-semibold mb-2" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                    Advanced Itinerary
                  </h3>
                  <p className="text-2xl font-bold text-purple-600 mb-2">10 Credits</p>
                  <p className="text-sm text-gray-600">Detailed planning with personalized recommendations</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🚀</div>
                  <h3 className="font-semibold mb-2" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                    Premium Features
                  </h3>
                  <p className="text-2xl font-bold text-pink-600 mb-2">15-25 Credits</p>
                  <p className="text-sm text-gray-600">AI-powered optimization and special features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Packages */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                Credit Packages
              </h2>
              <p className="text-gray-600">Choose the package that best fits your travel planning needs</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Starter Package */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl mb-4">🌟</div>
                <h3 className="text-xl font-bold mb-2" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                  Starter
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">100 Credits</div>
                <p className="text-gray-600 mb-6">Perfect for occasional travelers</p>
                <ul className="space-y-2 mb-6 text-left">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    20 Basic Itineraries
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    10 Advanced Itineraries
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Basic Support
                  </li>
                </ul>
                <div className="text-2xl font-bold mb-4" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                  $9.99
                </div>
              </div>

              {/* Explorer Package */}
              <div className="bg-white rounded-lg border-2 border-purple-500 p-6 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-3xl mb-4 mt-2">🚀</div>
                <h3 className="text-xl font-bold mb-2" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                  Explorer
                </h3>
                <div className="text-3xl font-bold text-purple-600 mb-4">500 Credits</div>
                <p className="text-gray-600 mb-6">Best value for regular travelers</p>
                <ul className="space-y-2 mb-6 text-left">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    100 Basic Itineraries
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    50 Advanced Itineraries
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    20 Premium Features
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Priority Support
                  </li>
                </ul>
                <div className="text-2xl font-bold mb-4" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                  $39.99
                </div>
              </div>

              {/* Professional Package */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl mb-4">👑</div>
                <h3 className="text-xl font-bold mb-2" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                  Professional
                </h3>
                <div className="text-3xl font-bold text-yellow-600 mb-4">1000 Credits</div>
                <p className="text-gray-600 mb-6">For travel professionals & enthusiasts</p>
                <ul className="space-y-2 mb-6 text-left">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    200 Basic Itineraries
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    100 Advanced Itineraries
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    40 Premium Features
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    24/7 Premium Support
                  </li>
                </ul>
                <div className="text-2xl font-bold mb-4" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                  $69.99
                </div>
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-6" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                🔄 Refund Policy
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                    Refund Conditions
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-semibold">Within 7 days:</span> Full refund if less than 10% of credits used
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-semibold">Service issues:</span> Refund available for technical problems
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-semibold">Unused credits:</span> No expiration, credits remain valid
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--tg-theme-text-color, #000000)'}}>
                    How to Request
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 mb-2">
                        Contact our support team through the app or email us at:
                      </p>
                      <p className="text-blue-600 font-semibold">support@aitravelplanner.com</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">
                        Include your purchase details and reason for refund request.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link 
              href="/credit-store" 
              className="inline-flex items-center px-8 py-4 rounded-xl font-light transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-xl tracking-wide"
            >
              <span className="mr-2">{siteMetadata.logo}</span>
              Purchase Credits
              <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreditPolicyPage;
