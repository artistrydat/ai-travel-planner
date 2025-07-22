"use client";

import Link from 'next/link';
import { useEffect } from 'react';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    // Apply Telegram WebApp theme colors if available
    if (typeof window !== 'undefined') {
      const telegram = (window as any).Telegram;
      if (telegram?.WebApp) {
        telegram.WebApp.ready();
        // Set theme colors for better integration
        document.documentElement.style.setProperty('--tg-theme-bg-color', telegram.WebApp.backgroundColor || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', telegram.WebApp.textColor || '#000000');
        document.documentElement.style.setProperty('--tg-theme-button-color', telegram.WebApp.buttonColor || '#2481cc');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{
      backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      color: 'var(--tg-theme-text-color, #000000)'
    }}>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white" style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
      }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center space-x-3 hover:opacity-70 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center" style={{
                backgroundColor: 'var(--tg-theme-button-color, #2563eb)'
              }}>
                <span className="text-white text-sm">🤖</span>
              </div>
              <h1 className="text-lg font-semibold" style={{
                color: 'var(--tg-theme-text-color, #000000)'
              }}>AI Travel Planner</h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/landing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm" style={{
                color: 'var(--tg-theme-text-color, #6b7280)'
              }}>
                Home
              </Link>
              <Link href="/credits" className="text-gray-600 hover:text-gray-900 transition-colors text-sm" style={{
                color: 'var(--tg-theme-text-color, #6b7280)'
              }}>
                Credit Policy
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8" style={{
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
          borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
        }}>
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4" style={{
              backgroundColor: 'var(--tg-theme-button-color, #dbeafe)'
            }}>
              <span className="text-2xl">🔒</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4" style={{
              color: 'var(--tg-theme-text-color, #111827)'
            }}>
              Privacy Policy
            </h1>
            
            <p className="text-gray-600 text-sm" style={{
              color: 'var(--tg-theme-text-color, #6b7280)'
            }}>
              Last updated: July 19, 2025
            </p>
          </div>
        
        <div className="space-y-8">
          <section>
            <div className="flex items-start gap-4 p-6 border border-gray-100 rounded-lg" style={{
              borderColor: 'var(--tg-theme-text-color, #f3f4f6)'
            }}>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,17.4 15.4,18 14.8,18H9.2C8.6,18 8,17.4 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{
                  color: 'var(--tg-theme-text-color, #111827)'
                }}>Information We Collect</h3>
                <p className="text-gray-600 mb-3" style={{
                  color: 'var(--tg-theme-text-color, #6b7280)'
                }}>
                  We collect information you provide directly when using our travel planning services through Telegram.
                </p>
                <ul className="text-gray-500 space-y-1 text-sm" style={{
                  color: 'var(--tg-theme-text-color, #6b7280)'
                }}>
                  <li>• Travel preferences and destination requests</li>
                  <li>• Telegram user information (username, ID)</li>
                  <li>• Search history and saved itineraries</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 p-6 border border-gray-100 rounded-lg" style={{
              borderColor: 'var(--tg-theme-text-color, #f3f4f6)'
            }}>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{
                  color: 'var(--tg-theme-text-color, #111827)'
                }}>How We Use Your Data</h3>
                <p className="text-gray-600 mb-3" style={{
                  color: 'var(--tg-theme-text-color, #6b7280)'
                }}>
                  Your information helps us provide personalized travel recommendations and improve our services.
                </p>
                <ul className="text-gray-500 space-y-1 text-sm" style={{
                  color: 'var(--tg-theme-text-color, #6b7280)'
                }}>
                  <li>• Generate personalized travel itineraries</li>
                  <li>• Provide weather and flight information</li>
                  <li>• Enhance AI recommendations over time</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4 p-6 border border-gray-100 rounded-lg" style={{
              borderColor: 'var(--tg-theme-text-color, #f3f4f6)'
            }}>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10,4H14V6H10V4M9,2V8H15V2H9M15.5,22H8.5A1.5,1.5 0 0,1 7,20.5V19.5A1.5,1.5 0 0,1 8.5,18H15.5A1.5,1.5 0 0,1 17,19.5V20.5A1.5,1.5 0 0,1 15.5,22M15.5,16H8.5A3.5,3.5 0 0,0 5,19.5V20.5A3.5,3.5 0 0,0 8.5,24H15.5A3.5,3.5 0 0,0 19,20.5V19.5A3.5,3.5 0 0,0 15.5,16Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{
                  color: 'var(--tg-theme-text-color, #111827)'
                }}>Data Security</h3>
                <p className="text-gray-600 mb-3" style={{
                  color: 'var(--tg-theme-text-color, #6b7280)'
                }}>
                  We implement industry-standard security measures to protect your personal information.
                </p>
                <ul className="text-gray-500 space-y-1 text-sm" style={{
                  color: 'var(--tg-theme-text-color, #6b7280)'
                }}>
                  <li>• End-to-end encryption for sensitive data</li>
                  <li>• Secure storage with regular backups</li>
                  <li>• No sharing with third parties without consent</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center" style={{
          borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
        }}>
          <h3 className="text-xl font-semibold mb-3" style={{
            color: 'var(--tg-theme-text-color, #111827)'
          }}>
            Questions about our privacy practices?
          </h3>
          <p className="text-gray-600 mb-6" style={{
            color: 'var(--tg-theme-text-color, #6b7280)'
          }}>
            We're committed to transparency and protecting your data
          </p>
          <Link 
            href="/landing"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            style={{
              backgroundColor: 'var(--tg-theme-button-color, #2563eb)'
            }}
          >
            <span>🚀</span>
            <span>Back to AI Travel Planner</span>
          </Link>
        </div>
        </div>
      </main>      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16" style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
      }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center" style={{
                backgroundColor: 'var(--tg-theme-button-color, #2563eb)'
              }}>
                <span className="text-white text-xs">🤖</span>
              </div>
              <span className="font-medium" style={{
                color: 'var(--tg-theme-text-color, #111827)'
              }}>AI Travel Planner</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/landing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm" style={{
                color: 'var(--tg-theme-text-color, #6b7280)'
              }}>
                Home
              </Link>
              <Link href="/credits" className="text-gray-600 hover:text-gray-900 transition-colors text-sm" style={{
                color: 'var(--tg-theme-text-color, #6b7280)'
              }}>
                Credit Policy
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-gray-200" style={{
            borderColor: 'var(--tg-theme-text-color, #e5e7eb)'
          }}>
            <p className="text-gray-500 text-sm" style={{
              color: 'var(--tg-theme-text-color, #6b7280)'
            }}>
              © 2025 AI Travel Planner • Powered by Telegram • Made with ❤️ for travelers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
