import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Providers from "../components/auxiliary/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AI Travel Planner",
  description:
    "An AI-powered travel planner that creates detailed itineraries based on your preferences, visualized on a map interface. Generated plans can be exported for offline use.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Telegram Web App SDK */}
        <Script 
          src="https://telegram.org/js/telegram-web-app.js?58"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker,places&v=beta&callback=initMap`}
          strategy="afterInteractive"
        />
        <Script id="google-maps-init" strategy="afterInteractive">
          {`
            function initMap() {
              window.dispatchEvent(new CustomEvent('google-maps-api-ready'));
            }
          `}
        </Script>
      </body>
    </html>
  );
}
