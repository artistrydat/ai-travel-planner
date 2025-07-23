import React from 'react';
import Link from 'next/link';

interface FooterProps {
    onNavigate?: (page: 'privacy' | 'terms') => void;
    useDirectLinks?: boolean;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, useDirectLinks = false }) => {
  return (
    <footer className="bg-[#0a4848] dark:bg-teal-950/80 text-center text-sm text-gray-400 py-4 border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs">© 2025 AI Trip Planner. Travel planning for the digital age – faster, cheaper, and locked inside your favorite app. 🧳✨</p>
            <div className="flex gap-4 text-xs">
                {useDirectLinks ? (
                    <>
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </>
                ) : (
                    <>
                        <button onClick={() => onNavigate?.('privacy')} className="hover:text-white transition-colors">
                            Privacy Policy
                        </button>
                        <button onClick={() => onNavigate?.('terms')} className="hover:text-white transition-colors">
                            Terms of Service
                        </button>
                    </>
                )}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;