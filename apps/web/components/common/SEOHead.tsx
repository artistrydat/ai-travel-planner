"use client";

import { useEffect } from 'react';
import { siteMetadata, pageMetadata } from '../../data/metadata';

type PageType = keyof typeof pageMetadata;

interface SEOHeadProps {
  pageType: PageType;
  customTitle?: string;
  customDescription?: string;
  ogImage?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  pageType, 
  customTitle, 
  customDescription,
  ogImage 
}) => {
  useEffect(() => {
    const page = pageMetadata[pageType];
    const title = customTitle || page.title;
    const description = customDescription || page.description;
    
    // Update document title
    document.title = title;
    
    // Create or update meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', page.keywords);
    updateMetaTag('name', 'author', siteMetadata.seo.author);
    updateMetaTag('name', 'robots', siteMetadata.seo.robots);
    
    // Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:site_name', siteMetadata.title);
    updateMetaTag('property', 'og:url', `${siteMetadata.seo.canonical}${pageType === 'landing' ? '' : `/${String(pageType)}`}`);
    
    if (ogImage) {
      updateMetaTag('property', 'og:image', ogImage);
    }
    
    // Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    
    if (ogImage) {
      updateMetaTag('name', 'twitter:image', ogImage);
    }
    
    // Canonical URL
    updateCanonicalLink(`${siteMetadata.seo.canonical}${pageType === 'landing' ? '' : `/${String(pageType)}`}`);
    
    // Theme color for mobile browsers
    updateMetaTag('name', 'theme-color', siteMetadata.primaryColor);
    
  }, [pageType, customTitle, customDescription, ogImage]);

  return null; // This component doesn't render anything
};

function updateMetaTag(attribute: string, name: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateCanonicalLink(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

export default SEOHead;
