"use client";

import React from 'react';
import { Layout, ContentSection, useSEO, siteMetadata } from '../../components';

const GalleryPage: React.FC = () => {
  useSEO('landing', 'Experience Gallery - AI Travel Planner', 'Discover stunning travel inspirations and curated experiences from our sophisticated travel community.');

  return (
    <Layout headerVariant="minimal">
      <ContentSection background="gradient" padding="large" maxWidth="xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-amber-200 rounded-full px-6 py-2 mb-6">
            <span className="text-amber-600 font-medium text-sm tracking-wide">CURATED INSPIRATIONS</span>
          </div>
          <h1 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
            Experience 
            <span className="font-bold bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent"> Gallery</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Discover breathtaking destinations and sophisticated travel experiences curated by our AI and refined by our community of discerning travelers.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl overflow-hidden mb-4 group-hover:shadow-2xl transition-all duration-500">
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-60">
                  🏔️
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg font-light text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                Swiss Alps Adventure
              </h3>
              <p className="text-gray-600 text-sm font-light">
                Luxury mountain retreat with curated alpine experiences
              </p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection background="white" padding="medium">
        <div className="text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-6">
            Ready to Create Your Own
            <span className="font-bold bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent"> Masterpiece?</span>
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto font-light">
            Let our AI craft a bespoke journey tailored to your sophisticated tastes and desires.
          </p>
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-light hover:shadow-xl transition-all duration-300 tracking-wide">
            <span className="mr-2">{siteMetadata.logo}</span>
            Begin Planning
          </button>
        </div>
      </ContentSection>
    </Layout>
  );
};

export default GalleryPage;
