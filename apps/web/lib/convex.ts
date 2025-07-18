import { ConvexReactClient } from "convex/react";

// Get Convex URL with fallback and validation
const getConvexUrl = () => {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL || "https://descriptive-starfish-159.convex.site";
  
  if (!url) {
    console.error('NEXT_PUBLIC_CONVEX_URL is not defined');
    throw new Error('Convex URL not configured. Please set NEXT_PUBLIC_CONVEX_URL environment variable.');
  }
  
  if (!url.startsWith('https://')) {
    console.error('Invalid Convex URL format:', url);
    throw new Error('Invalid Convex URL format. Must start with https://');
  }
  
  console.log('Initializing Convex client with URL:', url);
  return url;
};

let convexClient: ConvexReactClient;

try {
  convexClient = new ConvexReactClient(getConvexUrl());
  console.log('Convex client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Convex client:', error);
  throw error;
}

export const convex = convexClient;
