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

interface ExportModalProps {
  isOpen: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen }) => {
  const { closeExportModal } = useUIStore();
  const { itinerary } = useItineraryStore();
  const { preferences } = usePreferencesStore();
  const { user } = useUserStore();
  const updateCreditsMutation = useUpdateUserCredits();
  
  // Use the new export costs hook for reactive updates
  const { options: exportOptions, userCredits, formattedUserCredits } = useExportCosts();
  const { formatCost } = useOperationCosts();

  const handleExport = async (format: 'txt' | 'pdf' | 'ics') => {
    if (!itinerary || !user) return;

    // Find the option for this format to get cost and check affordability
    const option = exportOptions?.find(opt => opt.type === format);
    if (!option) return;

    // Check if user has enough credits
    if (!option.canAfford) {
      // TODO: Show error message about insufficient credits
      console.error('Insufficient credits for export');
      return;
    }

    try {
      // Deduct credits for export
      await updateCreditsMutation.mutateAsync({
        userId: user._id,
        amount: -option.cost,
        action: `Export: ${itinerary.destination} (${format.toUpperCase()})`,
      });

      // Proceed with export

    const createTxtContent = () => {
        let content = `Trip Plan for: ${itinerary.destination}\n`;
        content += `-------------------------------------------------\n\n`;
        itinerary.itinerary.forEach(activity => {
            content += `Day ${activity.day} - ${activity.startTime}\n`;
            content += `Title: ${activity.title} (${activity.category})\n`;
            content += `Duration: ${activity.durationHours} hours\n`;
            content += `Description: ${activity.description}\n`;
            content += `Local Tip: ${activity.localTip}\n\n`;
        });
        return content;
    };

    const createIcsContent = () => {
        let content = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//AI-Travel-Planner//EN',
        ];

        const startDate = new Date(preferences.startDate + 'T00:00:00Z');

        itinerary.itinerary.forEach(activity => {
            const eventDate = new Date(startDate.getTime());
            eventDate.setUTCDate(startDate.getUTCDate() + activity.day - 1);

            const [hours, minutes] = activity.startTime.split(':').map(Number);
            eventDate.setUTCHours(hours, minutes, 0, 0);

            const dtstart = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            
            eventDate.setUTCHours(eventDate.getUTCHours() + activity.durationHours);
            const dtend = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

            content.push('BEGIN:VEVENT');
            content.push(`UID:${Date.now()}${Math.random()}@ai-planner.com`);
            content.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}`);
            content.push(`DTSTART:${dtstart}`);
            content.push(`DTEND:${dtend}`);
            content.push(`SUMMARY:${activity.title}`);
            content.push(`DESCRIPTION:${activity.description}\\nLocal Tip: ${activity.localTip}`);
            content.push(`LOCATION:${activity.latitude},${activity.longitude}`);
            content.push(`CATEGORIES:${activity.category}`);
            content.push('END:VEVENT');
        });

        content.push('END:VCALENDAR');
        return content.join('\r\n');
    };

    const createPdfContent = () => {
      // This would require a PDF generation library like jsPDF or puppeteer
      // For now, return the same as text content
      return createTxtContent();
    };

    let content: string;
    let mimeType: string;
    
    switch (format) {
      case 'txt':
        content = createTxtContent();
        mimeType = 'text/plain';
        break;
      case 'ics':
        content = createIcsContent();
        mimeType = 'text/calendar';
        break;
      case 'pdf':
        content = createPdfContent();
        mimeType = 'text/plain'; // Would be 'application/pdf' for actual PDF
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itinerary-${itinerary.destination.toLowerCase().replace(/\s/g, '-')}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeExportModal();
    } catch (error) {
      console.error('Export failed:', error);
      // TODO: Show error message to user
    }
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
                          {option.name} ({option.description.split(' ')[option.description.split(' ').length - 1]})
                        </div>
                        <span className="text-xs opacity-75">
                          {formatCost(option.cost)}
                        </span>
                    </button>
                  );
                })}
            </div>
        </div>
    </Modal>
  );
};

export default ExportModal;
