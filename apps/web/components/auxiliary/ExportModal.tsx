"use client";

import React from 'react';
import Modal from '../common/Modal';
import { Icon } from '../common/Icon';
import { useUIStore } from '../../store/uiStore';
import { useItineraryStore } from '../../store/itineraryStore';
import { usePreferencesStore } from '../../store/preferencesStore';
import { useUserStore } from '../../store/userStore';
import { useUpdateUserCredits } from '../../hooks/useConvexQueries';
import { useExportCosts, useOperationCosts } from '../../hooks/useOperationCosts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useFileExport } from '../../hooks/useFileExport';
import { useToast } from './useToast';

// Extend window interface for Telegram WebView Proxy
declare global {
  interface Window {
    TelegramWebviewProxy?: {
      postEvent: (eventType: string, data: string) => void;
    };
  }
}

interface ExportModalProps {
  isOpen: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen }) => {
  const { closeExportModal } = useUIStore();
  const { itinerary } = useItineraryStore();
  const { preferences } = usePreferencesStore();
  const { user } = useUserStore();
  const updateCreditsMutation = useUpdateUserCredits();
  
  // Use toast hook
  const { showToast } = useToast();

  // Use the file export hook
  const { exportAndStoreFile, openStoredFile } = useFileExport();

  const { options: exportOptions, formattedUserCredits } = useExportCosts();
  const { formatCost } = useOperationCosts();

  // State to track recently exported files for manual opening
  const [recentExport, setRecentExport] = React.useState<{
    url: string;
    filename: string;
    format: 'txt' | 'pdf' | 'ics';
  } | null>(null);

  // Clear recent export when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setRecentExport(null);
    }
  }, [isOpen]);

  // Main export handler using Convex storage
  const handleExport = async (format: 'txt' | 'pdf' | 'ics') => {
    if (!itinerary || !user) return;

    // Find export option
    const option = exportOptions?.find(opt => opt.type === format);
    if (!option) return;

    // Check credits
    if (!option.canAfford) {
      showToast({
        title: 'Insufficient Credits',
        description: `You don't have enough credits to export as ${format.toUpperCase()}`,
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    try {
      // Deduct credits
      await updateCreditsMutation.mutateAsync({
        userId: user._id,
        amount: -option.cost,
        action: `Export: ${itinerary.destination} (${format.toUpperCase()})`,
      });

      // Generate filename
      const filename = `itinerary-${itinerary.destination.toLowerCase().replace(/\s/g, '-')}.${format}`;
      let blob: Blob;

      // Handle each export format
      switch (format) {
        case 'txt':
          const txtContent = createTxtContent();
          blob = new Blob([txtContent], { type: 'text/plain' });
          break;
          
        case 'ics':
          const icsContent = createIcsContent();
          blob = new Blob([icsContent], { type: 'text/calendar' });
          break;
          
        case 'pdf':
          blob = await createPdf();
          break;
          
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      // Use Convex storage for reliable file handling
      const result = await exportAndStoreFile(blob, filename, format, user._id);
      
      if (result.success && result.url) {
        // Store for manual opening if needed
        setRecentExport({ 
          url: result.url, 
          filename, 
          format 
        });
        
        if (!result.needsManualOpen) {
          // File opened successfully, can close modal after a delay
          setTimeout(() => {
            closeExportModal();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      showToast({
        title: 'Export Failed',
        description: 'There was an issue exporting your file',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  // Create TXT content
  const createTxtContent = () => {
    if (!itinerary) return '';
    
    let content = `Trip Plan for: ${itinerary.destination}\n`;
    content += `-------------------------------------------------\n\n`;
    content += `Start Date: ${preferences.startDate}\n`;
    
    // Safely access optional properties
    if ('travelers' in preferences && preferences.travelers) {
      content += `Travelers: ${preferences.travelers}\n`;
    }
    if ('budget' in preferences && preferences.budget) {
      content += `Budget: ${preferences.budget}\n`;
    }
    content += '\n';
    
    itinerary.itinerary.forEach(activity => {
        content += `Day ${activity.day} - ${activity.startTime}\n`;
        content += `Title: ${activity.title} (${activity.category})\n`;
        content += `Duration: ${activity.durationHours} hours\n`;
        content += `Description: ${activity.description}\n`;
        content += `Local Tip: ${activity.localTip}\n\n`;
    });
    return content;
  };

  // Create ICS content
  const createIcsContent = () => {
    if (!itinerary) return '';
    
    let content = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AI-Travel-Planner//EN',
      'CALSCALE:GREGORIAN',
    ];

    const startDate = new Date(preferences.startDate + 'T00:00:00Z');

    itinerary.itinerary.forEach((activity, index) => {
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + activity.day - 1);
      
      const [hours, minutes] = activity.startTime.split(':').map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
      
      const dtstart = eventDate.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
      
      const endDate = new Date(eventDate);
      endDate.setHours(eventDate.getHours() + activity.durationHours);
      const dtend = endDate.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
      
      content = content.concat([
        'BEGIN:VEVENT',
        `UID:${Date.now()}-${index}@ai-planner.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        `SUMMARY:${activity.title}`,
        `DESCRIPTION:${activity.description.replace(/\n/g, '\\n')}\\nLocal Tip: ${activity.localTip}`,
        `LOCATION:${itinerary.destination}`,
        `CATEGORIES:${activity.category}`,
        'END:VEVENT'
      ]);
    });

    content.push('END:VCALENDAR');
    return content.join('\r\n');
  };

  // Create PDF document
  const createPdf = async () => {
    return new Promise<Blob>((resolve) => {
      if (!itinerary) {
        resolve(new Blob());
        return;
      }
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text(`Trip Plan: ${itinerary.destination}`, 14, 15);
      
      // Add trip details
      let yPosition = 25;
      doc.setFontSize(12);
      doc.text(`Start Date: ${preferences.startDate}`, 14, yPosition);
      yPosition += 7;
      
      // Safely access optional properties
      if ('travelers' in preferences && preferences.travelers) {
        doc.text(`Travelers: ${preferences.travelers}`, 14, yPosition);
        yPosition += 7;
      }
      if ('budget' in preferences && preferences.budget) {
        doc.text(`Budget: ${preferences.budget}`, 14, yPosition);
        yPosition += 7;
      }
      
      // Prepare table data
      const tableData = itinerary.itinerary.map(activity => [
        `Day ${activity.day}`,
        activity.startTime,
        activity.title,
        activity.category,
        `${activity.durationHours} hrs`
      ]);
      
      // Create table
      autoTable(doc, {
        head: [['Day', 'Time', 'Activity', 'Category', 'Duration']],
        body: tableData,
        startY: yPosition + 5,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] }
      });
      
      // Add activity details
      yPosition = (doc as any).lastAutoTable.finalY + 10;
      
      itinerary.itinerary.forEach(activity => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 15;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.text(`Day ${activity.day}: ${activity.title} (${activity.startTime})`, 14, yPosition);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        yPosition += 7;
        doc.text(`Description: ${activity.description}`, 14, yPosition);
        
        yPosition += 7;
        doc.text(`Local Tip: ${activity.localTip}`, 14, yPosition);
        
        yPosition += 10;
      });
      
      // Return as Blob
      const blob = doc.output('blob');
      resolve(blob);
    });
  };

  if (!itinerary) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeExportModal} title="">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-4 w-full max-w-xs mx-auto relative border border-white/10 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500" />
             <button onClick={closeExportModal} className="absolute top-2 right-2 p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Icon name="close" className="w-4 h-4 text-gray-300" />
            </button>
            <h2 className="text-lg font-bold text-white text-center mt-3">Export Options</h2>
            <p className="text-center text-gray-400 mt-1.5 mb-1.5 text-sm">Choose format to save your itinerary for {itinerary.destination}.</p>
            <p className="text-center text-amber-400 text-xs mb-4">You have {formattedUserCredits}</p>
        
            <div className="flex flex-col gap-2.5">
                {exportOptions?.map((option) => {
                  return (
                    <button
                        key={option.type}
                        onClick={() => handleExport(option.type)}
                        disabled={!option.canAfford}
                        className={`w-full flex items-center justify-between gap-2 text-sm font-semibold py-2.5 px-3 rounded-lg transition-transform transform ${
                          !option.canAfford 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : option.type === 'txt' 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
                              : option.type === 'pdf'
                                ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                                : 'bg-pink-600 text-white hover:bg-pink-700 hover:scale-105'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                          <Icon name={option.icon} className="w-5 h-5" />
                          <span>{option.name}</span>
                        </div>
                        <span className="text-xs opacity-75">{formatCost(option.cost)}</span>
                    </button>
                  );
                })}
                
                {/* Show manual controls after successful export */}
                {recentExport && (
                  <>
                    <div className="border-t border-white/20 my-2"></div>
                    <div className="text-center text-gray-400 text-xs mb-2">
                      {recentExport.filename} ready
                    </div>
                    
                    <button
                      onClick={() => openStoredFile(recentExport.url, recentExport.format)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-3 rounded-lg text-sm transition-colors"
                    >
                      Open File in Browser
                    </button>
                    
                    <button
                      onClick={() => {
                        window.open(recentExport.url, '_blank');
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Icon name="download" className="w-4 h-4" />
                      Re-download File
                    </button>
                  </>
                )}
            </div>
            
            <button
              onClick={closeExportModal}
              className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 px-3 rounded-lg text-sm transition-colors"
            >
              Close
            </button>
        </div>
    </Modal>
  );
};

export default ExportModal;
