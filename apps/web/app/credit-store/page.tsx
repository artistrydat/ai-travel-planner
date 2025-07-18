'use client';

import { useEffect, useState } from 'react';
import { ITEMS, Item } from '@/app/data/items';

// Import components
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import ItemsList from '@/components/ItemsList';

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
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        color: 'var(--tg-theme-text-color, #000000)',
      }}
    >
      <div className="max-w-md mx-auto p-0 relative">
        {/* Minimal loading overlay - only shows during API call */}
        {isLoading && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
            }}
          >
            <div className="text-center">
              <div 
                className="animate-spin rounded-full h-8 w-8 border-2 border-transparent mx-auto mb-4"
                style={{
                  borderTopColor: 'var(--tg-theme-button-color, #3b82f6)',
                  borderRightColor: 'var(--tg-theme-button-color, #3b82f6)',
                }}
              ></div>
              <p 
                className="text-sm"
                style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}
              >
                Creating invoice...
              </p>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div 
          className="sticky top-0 z-10 p-4 border-b"
          style={{
            backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
            borderBottomColor: 'var(--tg-theme-section-separator-color, #e5e7eb)',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Back button for non-Telegram environments */}
            {!window.Telegram?.WebApp && (
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center text-sm transition-colors p-2 -ml-2 rounded-lg"
                style={{ 
                  color: 'var(--tg-theme-link-color, #3b82f6)'
                }}
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            
            <div className="flex-1 text-center">
              <h1 
                className="text-xl font-semibold"
                style={{ color: 'var(--tg-theme-text-color, #000000)' }}
              >
                ⭐ Credit Store
              </h1>
              {telegramUser && (
                <p 
                  className="text-sm mt-1"
                  style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}
                >
                  Welcome, {telegramUser.first_name}!
                </p>
              )}
            </div>
            
            {/* Spacer for symmetry when back button is present */}
            {!window.Telegram?.WebApp && (
              <div className="w-16"></div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 pb-20">
          <ItemsList 
            items={ITEMS}
            onPurchase={handlePurchase}
          />
        </div>
      </div>
    </div>
  );
}
