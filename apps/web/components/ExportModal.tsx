"use client";

import React from 'react';
import Modal from './common/Modal';
import { Icon } from './common/Icon';
import { useUIStore } from '../store/uiStore';
import { useItineraryStore } from '../store/itineraryStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { useUserStore } from '../store/userStore';
import { useUpdateUserCredits, useUserByTelegramId } from '../hooks/useConvexQueries';

interface ExportModalProps {
  isOpen: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen }) => {
  const { closeExportModal } = useUIStore();
  const { itinerary } = useItineraryStore();
  const { preferences } = usePreferencesStore();
  const { user } = useUserStore();
  const updateCreditsMutation = useUpdateUserCredits();
  
  // Get live credits to check if user has enough for export
  const { data: liveUser } = useUserByTelegramId(user?.telegramId || null);
  const liveCredits = liveUser?.credits ?? 0;

  const handleExport = async (format: 'txt' | 'ics') => {
    if (!itinerary || !user) return;

    // Check if user has enough credits (1 credit for export)
    if (liveCredits < 1) {
      // TODO: Show error message about insufficient credits
      console.error('Insufficient credits for export');
      return;
    }

    try {
      // Deduct 1 credit for export
      await updateCreditsMutation.mutateAsync({
        userId: user._id,
        amount: -1,
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

    const content = format === 'txt' ? createTxtContent() : createIcsContent();
    
    const blob = new Blob([content], { type: format === 'txt' ? 'text/plain' : 'text/calendar' });
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
            <p className="text-center text-amber-400 text-xs mb-4">Each export costs 1 credit • You have {liveCredits} credits</p>
        
            <div className="flex flex-col gap-2.5">
                <button
                    onClick={() => handleExport('txt')}
                    disabled={liveCredits < 1}
                    className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg transition-transform transform ${
                      liveCredits < 1 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
                    }`}
                >
                    <Icon name="text-file" className="w-5 h-5" />
                    Export as Text (.txt)
                </button>
                <button
                    onClick={() => handleExport('ics')}
                    disabled={liveCredits < 1}
                    className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg transition-transform transform ${
                      liveCredits < 1 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-pink-600 text-white hover:bg-pink-700 hover:scale-105'
                    }`}
                >
                    <Icon name="calendar" className="w-5 h-5" />
                    Export to Calendar (.ics)
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default ExportModal;
