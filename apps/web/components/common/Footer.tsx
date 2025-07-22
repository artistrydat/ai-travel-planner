"use client";

import React from 'react';
import Link from 'next/link';
import { siteMetadata } from '../../data/metadata';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-amber-200/50 bg-gradient-to-br from-amber-50 to-rose-50" style={{
      backgroundColor: 'var(--tg-theme-bg-color, #fefdf8)',
      borderColor: 'var(--tg-theme-text-color, rgba(251, 191, 36, 0.3))'
    }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-2">
            <Link href="/landing" className="flex items-center space-x-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white text-lg font-bold">{siteMetadata.logo}</span>
              </div>
              <h3 className="text-2xl font-light text-gray-800 tracking-wide group-hover:text-amber-600 transition-colors duration-300">
                {siteMetadata.title}
              </h3>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md font-light leading-relaxed text-lg">
              {siteMetadata.footer.description}
            </p>
            <div className="text-gray-500 font-light tracking-wide">
              {siteMetadata.footer.copyright}
            </div>
          </div>
          
          {/* Footer Sections */}
          {siteMetadata.footer.sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-light text-gray-800 mb-6 text-lg tracking-wide uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3 text-gray-600 font-light">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="hover:text-amber-600 transition-colors duration-300 tracking-wide"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-amber-200/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-6 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✦</span>
              </div>
              <span className="text-gray-600 font-light tracking-wide">Curated with Care</span>
            </div>
            <div className="text-gray-500 font-light tracking-wide text-sm">
              {siteMetadata.footer.tagline}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
