"use client";

import { useEffect } from 'react';
import { siteMetadata, pageMetadata } from '../data/metadata';

type PageType = keyof typeof pageMetadata;

export const useSEO = (pageType: PageType, customTitle?: string, customDescription?: string) => {
  useEffect(() => {
    const page = pageMetadata[pageType];
    const title = customTitle || page.title;
    const description = customDescription || page.description;
    
    // Update document title
    document.title = title;
    
    // Update meta description
    updateMetaTag('description', description);
    
    // Update meta keywords
    updateMetaTag('keywords', page.keywords);
    
    // Update meta author
    updateMetaTag('author', siteMetadata.seo.author);
    
    // Update meta robots
    updateMetaTag('robots', siteMetadata.seo.robots);
    
    // Update Open Graph tags
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:type', 'website');
    updateMetaProperty('og:site_name', siteMetadata.title);
    updateMetaProperty('og:url', `${siteMetadata.seo.canonical}${pageType === 'landing' ? '' : `/${String(pageType)}`}`);
    
    // Update Twitter Card tags
    updateMetaProperty('twitter:card', 'summary_large_image');
    updateMetaProperty('twitter:title', title);
    updateMetaProperty('twitter:description', description);
    
    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = `${siteMetadata.seo.canonical}${pageType === 'landing' ? '' : `/${String(pageType)}`}`;
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = `${siteMetadata.seo.canonical}${pageType === 'landing' ? '' : `/${String(pageType)}`}`;
      document.head.appendChild(link);
    }
    
    // Update theme color
    updateMetaTag('theme-color', siteMetadata.primaryColor);
    
  }, [pageType, customTitle, customDescription]);
};

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}
