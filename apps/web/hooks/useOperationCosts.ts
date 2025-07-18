import { useQuery } from '@tanstack/react-query';
import { useOperationCostsStore } from '../store/operationCostsStore';
import { useUserStore } from '../store/userStore';
import { useUserByTelegramId } from './useConvexQueries';

/**
 * React hook that provides operation costs with real-time user affordability checks
 * Integrates with TanStack Query for reactive updates when user credits change
 */
export const useOperationCosts = () => {
  const {
    costs,
    getItineraryCost,
    getExportCostCached,
    getExportOptionsWithAffordability,
    checkAffordability,
    formatCost,
    calculateTotalTripCost,
    updateCosts,
    resetCosts,
  } = useOperationCostsStore();
  
  const { user } = useUserStore();
  
  // Get live user data with TanStack Query for reactive updates
  const { data: liveUser } = useUserByTelegramId(user?.telegramId || null);
  const liveCredits = liveUser?.credits ?? 0;
  
  // Create a reactive query that updates when credits change
  const { data: operationAffordability } = useQuery({
    queryKey: ['operationAffordability', liveCredits, costs],
    queryFn: () => {
      // Return affordability for common operations
      return {
        itinerary1Day: checkAffordability(liveCredits, 'itinerary-1-day', getItineraryCost(1)),
        itinerary3Days: checkAffordability(liveCredits, 'itinerary-3-days', getItineraryCost(3)),
        itinerary7Days: checkAffordability(liveCredits, 'itinerary-7-days', getItineraryCost(7)),
        exportTxt: checkAffordability(liveCredits, 'export-txt', getExportCostCached('txt')),
        exportPdf: checkAffordability(liveCredits, 'export-pdf', getExportCostCached('pdf')),
        exportIcs: checkAffordability(liveCredits, 'export-ics', getExportCostCached('ics')),
      };
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });
  
  return {
    // Current costs configuration
    costs,
    
    // User credits (reactive)
    userCredits: liveCredits,
    
    // Cost calculation functions
    getItineraryCost,
    getExportCost: getExportCostCached,
    formatCost,
    
    // Affordability checks (reactive)
    canAffordItinerary: (days: number) => checkAffordability(liveCredits, `itinerary-${days}-days`, getItineraryCost(days)),
    canAffordExport: (format: 'txt' | 'pdf' | 'ics') => checkAffordability(liveCredits, `export-${format}`, getExportCostCached(format)),
    
    // Pre-calculated affordability for common operations
    affordability: operationAffordability || {
      itinerary1Day: false,
      itinerary3Days: false,
      itinerary7Days: false,
      exportTxt: false,
      exportPdf: false,
      exportIcs: false,
    },
    
    // Export options with affordability
    getExportOptions: () => getExportOptionsWithAffordability(liveCredits),
    
    // Bulk calculations
    calculateTotalTripCost,
    
    // Configuration management
    updateCosts,
    resetCosts,
    
    // Utility functions
    isLoading: !liveUser && !!user, // Loading if we have a user but no live data yet
  };
};

/**
 * Hook specifically for itinerary generation costs and affordability
 */
export const useItineraryCosts = (days: number) => {
  const { getItineraryCost, canAffordItinerary, formatCost, userCredits } = useOperationCosts();
  
  const cost = getItineraryCost(days);
  const canAfford = canAffordItinerary(days);
  
  return {
    cost,
    canAfford,
    formattedCost: formatCost(cost),
    userCredits,
    formattedUserCredits: formatCost(userCredits),
    shortfall: canAfford ? 0 : cost - userCredits,
    formattedShortfall: canAfford ? '' : formatCost(cost - userCredits),
  };
};

/**
 * Hook specifically for export costs and affordability
 */
export const useExportCosts = (format?: 'txt' | 'pdf' | 'ics') => {
  const { getExportCost, canAffordExport, getExportOptions, formatCost, userCredits } = useOperationCosts();
  
  if (format) {
    const cost = getExportCost(format);
    const canAfford = canAffordExport(format);
    
    return {
      cost,
      canAfford,
      formattedCost: formatCost(cost),
      userCredits,
      formattedUserCredits: formatCost(userCredits),
    };
  }
  
  // Return all export options if no specific format requested
  return {
    options: getExportOptions(),
    userCredits,
    formattedUserCredits: formatCost(userCredits),
  };
};
