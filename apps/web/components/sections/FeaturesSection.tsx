"use client";

import React from 'react';
import { siteMetadata } from '../../data/metadata';

const FeaturesSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-amber-200 rounded-full px-6 py-2 mb-6">
            <span className="text-amber-600 font-medium text-sm tracking-wide">
              {siteMetadata.features.badge}
            </span>
          </div>
          <h3 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
            The Art of 
            <span className="font-bold bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent"> Sophisticated Travel</span>
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            {siteMetadata.features.description}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {siteMetadata.features.items.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h4 className="text-xl font-light text-gray-900 mb-3 tracking-wide">{feature.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
