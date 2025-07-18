'use client';

import { useEffect, useState } from 'react';
import { ITEMS, Item } from '@/components/creditstore/data/items';

// Import components
import LoadingState from '@/components/Error/LoadingState';
import ErrorState from '@/components/Error/ErrorState';
import ItemsList from '@/components/creditstore/ItemsList';

// Import Telegram types (types are already declared globally in types/telegram.ts)

export default function CreditStore() {
  const [initialized, setInitialized] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Telegram Web App
    const initTelegram = () => {
      try {
        const WebApp = window.Telegram?.WebApp;
        
        if (WebApp) {
          // Initialize Telegram Web App
          WebApp.ready();
          if (WebApp.expand) {
            WebApp.expand();
          }
          
          // Apply theme
          const applyTheme = () => {
            const root = document.documentElement;
            const themeParams = WebApp.themeParams;
            
            // Apply all available theme colors
            if (themeParams.bg_color) root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
            if (themeParams.text_color) root.style.setProperty('--tg-theme-text-color', themeParams.text_color);
            if (themeParams.hint_color) root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
            if (themeParams.link_color) root.style.setProperty('--tg-theme-link-color', themeParams.link_color);
            if (themeParams.button_color) root.style.setProperty('--tg-theme-button-color', themeParams.button_color);
            if (themeParams.button_text_color) root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
            if (themeParams.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
          };
          
          // Apply theme initially
          applyTheme();
          
          // Get user ID from initData
          if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
            const user = WebApp.initDataUnsafe.user;
            setUserId(user.id?.toString() || 'demo_user_123');
            setTelegramUser(user);
          } else {
            // For testing, use a demo user ID
            setUserId('demo_user_123');
          }
          
          // Setup back button
          WebApp.BackButton.show();
          WebApp.BackButton.onClick(() => {
            // Navigate back to main page instead of closing the app
            window.location.href = '/';
          });
        } else {
          // Not in Telegram, use demo user for testing
          console.log('Not running in Telegram Web App environment');
          setUserId('demo_user_123');
        }

        setInitialized(true);
      } catch (e) {
        console.error('Failed to initialize Telegram Web App:', e);
        setError('Failed to initialize Telegram Web App');
        setInitialized(true);
      }
    };

    // Wait for Telegram script to load
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        initTelegram();
      } else {
        // Wait a bit for the script to load
        const timer = setTimeout(initTelegram, 100);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handlePurchase = async (item: Item) => {
    const WebApp = window.Telegram?.WebApp;
    
    if (!WebApp) {
      alert('This feature is only available in Telegram');
      return;
    }

    // Haptic feedback for button press
    if (WebApp.HapticFeedback) {
      WebApp.HapticFeedback.impactOccurred('light');
    }
    
    // Show confirm dialog first - this provides instant feedback
    if (WebApp.showConfirm) {
      WebApp.showConfirm(
        `Buy "${item.name}" for ⭐${item.price}?`,
        async (confirmed) => {
          if (!confirmed) {
            if (WebApp.HapticFeedback) {
              WebApp.HapticFeedback.selectionChanged();
            }
            return;
          }

          try {
            setIsLoading(true);
            
            // Call Convex backend to create invoice
            const convexUrl = process.env.NEXT_PUBLIC_CONVEX_HTTP_URL || 'https://descriptive-starfish-159.convex.site';
            const response = await fetch(`${convexUrl}/createInvoice`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                itemId: item.id,
                userId: userId || '123456789'
              })
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to create invoice');
            }

            const { invoiceLink } = await response.json();
            
            // Hide loading immediately before opening payment
            setIsLoading(false);
            
            console.log('Opening invoice:', invoiceLink);
            
            // Open Telegram Stars payment
            if (WebApp.openInvoice && typeof WebApp.openInvoice === 'function') {
              WebApp.openInvoice(invoiceLink, (status: string) => {
                console.log('Payment callback received with status:', status);
                
                if (status === 'paid') {
                  // Success haptic feedback
                  if (WebApp.HapticFeedback) {
                    WebApp.HapticFeedback.notificationOccurred('success');
                  }
                  
                  // Show success message with back button option
                  if (WebApp.showPopup) {
                    WebApp.showPopup({
                      title: '✨ Payment Successful!',
                      message: `You've purchased ${item.credits} credits${item.bonus ? ` (+${item.bonus} bonus credits)` : ''}.\n\nYour credits are now available for AI trip planning!`,
                      buttons: [
                        { id: 'back_to_main', type: 'default', text: '🏠 Back to Main' },
                        { id: 'stay_here', type: 'default', text: '🛒 Buy More' }
                      ]
                    }, (buttonId) => {
                      if (buttonId === 'back_to_main') {
                        // Navigate back to main page
                        window.location.href = '/';
                      }
                      // If 'stay_here' or close, just stay on current page
                    });
                  } else if (WebApp.showAlert) {
                    WebApp.showAlert(`✨ Payment successful!\n\nYou've purchased ${item.credits} credits.`, () => {
                      // Fallback: ask if they want to go back to main
                      if (WebApp.showConfirm) {
                        WebApp.showConfirm('Would you like to go back to the main page?', (confirmed) => {
                          if (confirmed) {
                            window.location.href = '/';
                          }
                        });
                      }
                    });
                  } else {
                    alert('Payment successful! Thank you for your purchase.');
                  }
                } else if (status === 'cancelled') {
                  // Soft haptic feedback for cancellation
                  if (WebApp.HapticFeedback) {
                    WebApp.HapticFeedback.selectionChanged();
                  }
                } else if (status === 'failed') {
                  // Error haptic feedback
                  if (WebApp.HapticFeedback) {
                    WebApp.HapticFeedback.notificationOccurred('error');
                  }
                  
                  if (WebApp.showAlert) {
                    WebApp.showAlert('⚠️ Payment failed.\n\nPlease try again or contact support if the issue persists.');
                  } else {
                    alert('Payment failed. Please try again.');
                  }
                }
              });
            } else {
              // Fallback for environments without openInvoice
              if (invoiceLink.includes('t.me')) {
                window.location.href = invoiceLink;
              } else {
                alert('Payment can only be processed within Telegram. Please use the bot directly.');
              }
            }
            
          } catch (e) {
            setIsLoading(false);
            console.error('Error during purchase:', e);
            
            // Error haptic feedback
            if (WebApp.HapticFeedback) {
              WebApp.HapticFeedback.notificationOccurred('error');
            }
            
            const errorMessage = `❌ Purchase Error\n\n${e instanceof Error ? e.message : 'Unknown error occurred'}\n\nPlease try again.`;
            if (WebApp.showAlert) {
              WebApp.showAlert(errorMessage);
            } else {
              alert(errorMessage);
            }
          }
        }
      );
    } else {
      // Fallback for browsers without showConfirm
      const confirmed = confirm(`Buy "${item.name}" for ⭐${item.price}?`);
      if (confirmed) {
        // Continue with purchase logic...
        alert('This feature requires Telegram Web App environment');
      }
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    window.location.reload();
  };

  // Loading state
  if (!initialized) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  // Main app UI with Telegram-native styling
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: 'var(--tg-theme-bg-color, #0f172a)',
        color: 'var(--tg-theme-text-color, #ffffff)',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-20 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-10 w-22 h-22 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-2000" />
        <div className="absolute bottom-10 right-5 w-18 h-18 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="max-w-md mx-auto p-0 relative z-10">
        {/* Enhanced loading overlay */}
        {isLoading && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
            style={{
              backgroundColor: 'var(--tg-theme-bg-color, rgba(15, 23, 42, 0.95))',
            }}
          >
            <div className="text-center bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="relative mb-4">
                <div 
                  className="animate-spin rounded-full h-8 w-8 border-2 border-transparent mx-auto"
                  style={{
                    borderTopColor: 'var(--tg-theme-button-color, #3b82f6)',
                    borderRightColor: 'var(--tg-theme-button-color, #3b82f6)',
                    borderBottomColor: 'transparent',
                    borderLeftColor: 'transparent',
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-sm" />
              </div>
              <p 
                className="text-sm font-medium"
                style={{ color: 'var(--tg-theme-hint-color, #94a3b8)' }}
              >
                Creating invoice...
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Header */}
        <div 
          className="sticky top-0 z-20 p-2.5 border-b backdrop-blur-lg"
          style={{
            backgroundColor: 'var(--tg-theme-bg-color, rgba(15, 23, 42, 0.95))',
            borderBottomColor: 'var(--tg-theme-section-separator-color, rgba(255, 255, 255, 0.1))',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Back button for non-Telegram environments */}
            {!window.Telegram?.WebApp && (
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center text-xs transition-all duration-200 p-1 -ml-1 rounded-lg hover:bg-white/5 group"
                style={{ 
                  color: 'var(--tg-theme-link-color, #60a5fa)'
                }}
              >
                <svg className="w-3 h-3 mr-0.5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            
            <div className="flex-1 text-center">
              <div className="relative">
                <h1 
                  className="text-base font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  ⭐ Credit Store
                </h1>
              </div>
              {telegramUser && (
                <p 
                  className="text-xs mt-0.5 font-medium"
                  style={{ color: 'var(--tg-theme-hint-color, #94a3b8)' }}
                >
                  Welcome, <span className="text-blue-300">{telegramUser.first_name}</span>!
                </p>
              )}
            </div>
            
            {/* Spacer for symmetry when back button is present */}
            {!window.Telegram?.WebApp && (
              <div className="w-10"></div>
            )}
          </div>
        </div>
        
        {/* Enhanced Content */}
        <div className="p-2.5 pb-10">
          {/* Welcome message - ultra compact */}
          <div className="mb-3 text-center">
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-lg p-2.5 border border-white/10 shadow-md">
              <div className="text-lg mb-1">🚀</div>
              <h2 className="text-sm font-semibold text-white mb-0.5">
                Power up your travel planning!
              </h2>
              <p className="text-gray-300 text-xs leading-tight">
                Get credits for AI travel features
              </p>
            </div>
          </div>
          
          <ItemsList 
            items={ITEMS}
            onPurchase={handlePurchase}
          />
          
          {/* Footer message - ultra compact */}
          <div className="mt-3 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-1.5 border border-white/10">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="text-green-400 text-xs">🔒</span>
                <span className="text-xs font-medium text-green-300">Secure Payment</span>
              </div>
              <p className="text-xs text-gray-400 leading-tight">
                Processed via Telegram Stars
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
