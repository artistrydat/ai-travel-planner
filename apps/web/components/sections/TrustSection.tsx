"use client";

import React from 'react';
import { siteMetadata } from '../../data/metadata';

const TrustSection: React.FC = () => {
  return (
    <div className="bg-white py-16 border-y border-amber-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <p className="text-gray-500 font-light tracking-[0.2em] uppercase text-sm">
            Trusted by Discerning Travelers Worldwide
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-16 opacity-60">
          {siteMetadata.trustIndicators.map((indicator, index) => (
            <div key={index} className="flex items-center gap-3 group hover:opacity-100 transition-opacity duration-300">
              <div className={`w-10 h-10 bg-gradient-to-br ${indicator.color} rounded-xl flex items-center justify-center`}>
                <span className="text-gray-700 font-bold text-lg">{indicator.icon}</span>
              </div>
              <span className="text-gray-700 font-light tracking-wide">{indicator.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
