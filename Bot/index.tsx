
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import App from './App';

// IMPORTANT: Replace this with your Convex deployment URL.
// You can get it from your project settings in the Convex dashboard.
const convexUrl = 'https://descriptive-starfish-159.convex.cloud';

if (convexUrl.includes('YOUR_CONVEX_URL_HERE')) {
  throw new Error("Please replace 'YOUR_CONVEX_URL_HERE' in index.tsx with your Convex deployment URL. You can get it from your Convex dashboard.");
}

const convex = new ConvexReactClient(convexUrl);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);