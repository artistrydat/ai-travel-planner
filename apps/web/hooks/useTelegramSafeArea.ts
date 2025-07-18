import { useEffect, useState } from 'react';
import type { TelegramWebAppExtended, SafeAreaInset } from '../types/telegram';

/**
 * Hook to manage Telegram WebApp safe areas and viewport
 * Follows Telegram's design guidelines for proper safe area handling
 */
export const useTelegramSafeArea = () => {
  const [safeAreaInset, setSafeAreaInset] = useState<SafeAreaInset>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const [contentSafeAreaInset, setContentSafeAreaInset] = useState<SafeAreaInset>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const [viewportInfo, setViewportInfo] = useState({
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    stableHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    isExpanded: false,
    isFullscreen: false,
    isActive: true,
  });

  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');
  const [isWebApp, setIsWebApp] = useState(false);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp as TelegramWebAppExtended;
    
    if (webApp) {
      setIsWebApp(true);
      
      // Initialize with current values
      if (webApp.safeAreaInset) {
        setSafeAreaInset(webApp.safeAreaInset);
      }
      
      if (webApp.contentSafeAreaInset) {
        setContentSafeAreaInset(webApp.contentSafeAreaInset);
      }
      
      setViewportInfo({
        height: webApp.viewportHeight || window.innerHeight,
        stableHeight: webApp.viewportStableHeight || window.innerHeight,
        isExpanded: webApp.isExpanded || false,
        isFullscreen: webApp.isFullscreen || false,
        isActive: webApp.isActive !== false, // Default to true if undefined
      });
      
      setColorScheme(webApp.colorScheme || 'dark');
      
      // Update CSS variables
      updateCSSVariables(webApp);
      
      // Set up event listeners
      const handleSafeAreaChange = () => {
        if (webApp.safeAreaInset) {
          setSafeAreaInset(webApp.safeAreaInset);
          updateSafeAreaCSS(webApp.safeAreaInset, 'safe-area-inset');
        }
      };
      
      const handleContentSafeAreaChange = () => {
        if (webApp.contentSafeAreaInset) {
          setContentSafeAreaInset(webApp.contentSafeAreaInset);
          updateSafeAreaCSS(webApp.contentSafeAreaInset, 'content-safe-area-inset');
        }
      };
      
      const handleViewportChange = () => {
        setViewportInfo({
          height: webApp.viewportHeight || window.innerHeight,
          stableHeight: webApp.viewportStableHeight || window.innerHeight,
          isExpanded: webApp.isExpanded || false,
          isFullscreen: webApp.isFullscreen || false,
          isActive: webApp.isActive !== false,
        });
        
        updateViewportCSS(webApp);
      };
      
      const handleThemeChange = () => {
        setColorScheme(webApp.colorScheme || 'dark');
        updateThemeCSS(webApp);
      };
      
      const handleFullscreenChange = () => {
        setViewportInfo(prev => ({
          ...prev,
          isFullscreen: webApp.isFullscreen || false,
        }));
      };
      
      // Register event listeners
      if (webApp.onEvent) {
        webApp.onEvent('safeAreaChanged', handleSafeAreaChange);
        webApp.onEvent('contentSafeAreaChanged', handleContentSafeAreaChange);
        webApp.onEvent('viewportChanged', handleViewportChange);
        webApp.onEvent('themeChanged', handleThemeChange);
        webApp.onEvent('fullscreenChanged', handleFullscreenChange);
      }
      
      // Signal that the app is ready
      if (webApp.ready) {
        webApp.ready();
      }
      
      // Cleanup function
      return () => {
        if (webApp.offEvent) {
          webApp.offEvent('safeAreaChanged', handleSafeAreaChange);
          webApp.offEvent('contentSafeAreaChanged', handleContentSafeAreaChange);
          webApp.offEvent('viewportChanged', handleViewportChange);
          webApp.offEvent('themeChanged', handleThemeChange);
          webApp.offEvent('fullscreenChanged', handleFullscreenChange);
        }
      };
    } else {
      // Fallback for non-Telegram environments
      setIsWebApp(false);
      
      // Use standard safe area environment variables
      const updateFallbackSafeArea = () => {
        const computedStyle = getComputedStyle(document.documentElement);
        const top = parseInt(computedStyle.getPropertyValue('--tg-safe-area-inset-top') || '0', 10);
        const bottom = parseInt(computedStyle.getPropertyValue('--tg-safe-area-inset-bottom') || '0', 10);
        const left = parseInt(computedStyle.getPropertyValue('--tg-safe-area-inset-left') || '0', 10);
        const right = parseInt(computedStyle.getPropertyValue('--tg-safe-area-inset-right') || '0', 10);
        
        setSafeAreaInset({ top, bottom, left, right });
      };
      
      updateFallbackSafeArea();
      
      // Listen for viewport changes
      const handleResize = () => {
        setViewportInfo(prev => ({
          ...prev,
          height: window.innerHeight,
          stableHeight: window.innerHeight,
        }));
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const updateCSSVariables = (webApp: TelegramWebApp) => {
    const root = document.documentElement;
    
    // Update safe area variables
    if (webApp.safeAreaInset) {
      updateSafeAreaCSS(webApp.safeAreaInset, 'safe-area-inset');
    }
    
    if (webApp.contentSafeAreaInset) {
      updateSafeAreaCSS(webApp.contentSafeAreaInset, 'content-safe-area-inset');
    }
    
    // Update viewport variables
    updateViewportCSS(webApp);
    
    // Update theme variables
    updateThemeCSS(webApp);
  };

  const updateSafeAreaCSS = (inset: SafeAreaInset, prefix: string) => {
    const root = document.documentElement;
    root.style.setProperty(`--tg-${prefix}-top`, `${inset.top}px`);
    root.style.setProperty(`--tg-${prefix}-bottom`, `${inset.bottom}px`);
    root.style.setProperty(`--tg-${prefix}-left`, `${inset.left}px`);
    root.style.setProperty(`--tg-${prefix}-right`, `${inset.right}px`);
  };

  const updateViewportCSS = (webApp: TelegramWebApp) => {
    const root = document.documentElement;
    if (webApp.viewportHeight) {
      root.style.setProperty(`--tg-viewport-height`, `${webApp.viewportHeight}px`);
    }
    if (webApp.viewportStableHeight) {
      root.style.setProperty(`--tg-viewport-stable-height`, `${webApp.viewportStableHeight}px`);
    }
  };

  const updateThemeCSS = (webApp: TelegramWebApp) => {
    const root = document.documentElement;
    root.style.setProperty(`--tg-color-scheme`, webApp.colorScheme || 'dark');
    
    if (webApp.themeParams) {
      Object.entries(webApp.themeParams).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(`--tg-theme-${key.replace(/_/g, '-')}`, value);
        }
      });
    }
  };

  return {
    safeAreaInset,
    contentSafeAreaInset,
    viewportInfo,
    colorScheme,
    isWebApp,
    
    // Utility functions
    webApp: window.Telegram?.WebApp,
    
    // Helper to get safe CSS class names
    getSafeAreaClasses: () => ({
      safeTop: 'safe-top',
      safeBottom: 'safe-bottom',
      safeLeft: 'safe-left',
      safeRight: 'safe-right',
      safeArea: 'safe-area',
      safeContent: 'tg-safe-content',
    }),
    
    // Helper to get current safe area as CSS custom properties
    getSafeAreaStyles: () => ({
      paddingTop: `max(var(--tg-safe-area-inset-top, 0px), var(--tg-content-safe-area-inset-top, 0px))`,
      paddingBottom: `max(var(--tg-safe-area-inset-bottom, 0px), var(--tg-content-safe-area-inset-bottom, 0px))`,
      paddingLeft: `max(var(--tg-safe-area-inset-left, 0px), var(--tg-content-safe-area-inset-left, 0px))`,
      paddingRight: `max(var(--tg-safe-area-inset-right, 0px), var(--tg-content-safe-area-inset-right, 0px))`,
    }),
  };
};
