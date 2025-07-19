import { useCallback } from 'react';
import { useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useTelegramWebApp } from './useTelegramWebApp';
import { useToast } from '../components/auxiliary/useToast';

export function useFileExport() {
  const { showToast } = useToast();
  const { isTelegram, webApp } = useTelegramWebApp();
  const storeFileAction = useAction(api.actions.storeExportedFile);

  // Helper function to convert blob to base64
  const blobToBase64 = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:text/plain;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  // Helper function to call Telegram methods properly
  const callTelegramMethod = useCallback((method: string, params: any = {}) => {
    console.log('Calling Telegram method:', method, params);
    
    try {
      if (typeof window !== 'undefined') {
        if (window.TelegramWebviewProxy?.postEvent) {
          // For mobile/desktop apps
          console.log('Using TelegramWebviewProxy.postEvent');
          window.TelegramWebviewProxy.postEvent(method, JSON.stringify(params));
          return true;
        } else if (window.parent && window.parent !== window) {
          // For web version
          console.log('Using window.parent.postMessage');
          window.parent.postMessage(JSON.stringify({
            eventType: method,
            eventData: params
          }), 'https://web.telegram.org');
          return true;
        } else {
          console.log('No Telegram communication method available');
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to call Telegram method:', method, error);
      return false;
    }
  }, []);

  // Main export and store function
  const exportAndStoreFile = useCallback(async (
    blob: Blob, 
    filename: string, 
    format: 'txt' | 'pdf' | 'ics',
    userId: string
  ) => {
    try {
      console.log('Starting file export and storage:', { filename, format, size: blob.size });

      // Convert blob to base64 for storage
      const base64Content = await blobToBase64(blob);
      
      // Store in Convex
      const result = await storeFileAction({
        fileContent: base64Content,
        filename,
        contentType: blob.type,
        userId,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to store file');
      }

      console.log('File stored successfully:', result);

      // Get the download URL - use the HTTP action endpoint
      const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_HTTP_URL;
      const downloadUrl = `${convexSiteUrl}/files/download?storageId=${result.storageId}`;
      
      console.log('Download URL generated:', downloadUrl);

      // For Telegram, use the proper file opening method
      if (isTelegram && webApp) {
        const success = callTelegramMethod('web_app_open_link', {
          url: downloadUrl,
          try_instant_view: false
        });
        
        if (success) {
          showToast({
            title: 'File Ready',
            description: `Your ${format.toUpperCase()} file is opening in browser. File expires in 72 hours.`,
            variant: 'success',
            duration: 4000,
          });
          return { success: true, url: downloadUrl, storageId: result.storageId };
        } else {
          // Fallback: provide the URL for manual opening
          showToast({
            title: 'File Ready',
            description: 'File stored successfully. Use the "Open File" button to access it. File expires in 72 hours.',
            variant: 'info',
            duration: 5000,
          });
          return { success: true, url: downloadUrl, storageId: result.storageId, needsManualOpen: true };
        }
      } else {
        // For non-Telegram environments, open directly
        const newWindow = window.open(downloadUrl, '_blank');
        
        if (newWindow) {
          showToast({
            title: 'File Opened',
            description: `Your ${format.toUpperCase()} file has been opened in a new tab. File expires in 72 hours.`,
            variant: 'success',
            duration: 4000,
          });
          return { success: true, url: downloadUrl, storageId: result.storageId };
        } else {
          showToast({
            title: 'File Ready',
            description: 'File stored successfully. Click "Open File" to access it. File expires in 72 hours.',
            variant: 'info',
            duration: 5000,
          });
          return { success: true, url: downloadUrl, storageId: result.storageId, needsManualOpen: true };
        }
      }
    } catch (error) {
      console.error('Failed to export and store file:', error);
      showToast({
        title: 'Export Failed',
        description: 'Failed to store and open file',
        variant: 'destructive',
        duration: 3000,
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [storeFileAction, blobToBase64, isTelegram, webApp, callTelegramMethod, showToast]);

  // Function to open a stored file by URL
  const openStoredFile = useCallback((url: string, format: string) => {
    console.log('Opening stored file:', url);
    
    if (isTelegram && webApp) {
      const success = callTelegramMethod('web_app_open_link', {
        url,
        try_instant_view: false
      });
      
      if (success) {
        showToast({
          title: 'File Opened',
          description: `Your ${format.toUpperCase()} file is opening in browser`,
          variant: 'success',
          duration: 3000,
        });
        return true;
      }
    } else {
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        showToast({
          title: 'File Opened',
          description: `Your ${format.toUpperCase()} file has been opened in a new tab`,
          variant: 'success',
          duration: 3000,
        });
        return true;
      }
    }
    
    showToast({
      title: 'Cannot Open File',
      description: 'Unable to open file automatically',
      variant: 'info',
      duration: 3000,
    });
    return false;
  }, [isTelegram, webApp, callTelegramMethod, showToast]);

  return {
    exportAndStoreFile,
    openStoredFile,
  };
}
