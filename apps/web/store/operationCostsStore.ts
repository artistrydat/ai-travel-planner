import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  OperationCosts, 
  DEFAULT_OPERATION_COSTS, 
  ACTIVE_OPERATION_COSTS,
  calculateItineraryCost,
  getExportCost,
  getExportOptions,
  canAffordOperation,
  formatCostDisplay
} from '../config/operationCosts';

type OperationCostsState = {
  // Current costs configuration
  costs: OperationCosts;
  
  // Cached calculations for performance
  cachedItineraryCosts: Record<number, number>; // days -> cost
  cachedExportCosts: Record<string, number>; // format -> cost
  
  // User affordability state
  lastCheckedCredits: number;
  affordabilityCache: Record<string, boolean>; // operation -> can afford
};

type OperationCostsActions = {
  // Cost configuration
  updateCosts: (newCosts: Partial<OperationCosts>) => void;
  resetCosts: () => void;
  
  // Cost calculations with caching
  getItineraryCost: (days: number) => number;
  getExportCostCached: (format: 'txt' | 'pdf' | 'ics') => number;
  getExportOptionsWithAffordability: (userCredits: number) => Array<{
    type: 'txt' | 'pdf' | 'ics';
    name: string;
    description: string;
    cost: number;
    icon: string;
    canAfford: boolean;
    disabled: boolean;
  }>;
  
  // Affordability checks with caching
  checkAffordability: (userCredits: number, operationType: string, operationCost: number) => boolean;
  clearAffordabilityCache: () => void;
  
  // Utility functions
  formatCost: (cost: number) => string;
  
  // Bulk operations
  calculateTotalTripCost: (days: number, exportFormats: Array<'txt' | 'pdf' | 'ics'>) => {
    itineraryCost: number;
    exportCosts: number;
    totalCost: number;
    breakdown: {
      generation: string;
      exports: string;
      total: string;
    };
    canAfford: (userCredits: number) => boolean;
  };
};

export const useOperationCostsStore = create(
  persist<OperationCostsState & OperationCostsActions>(
    (set, get) => ({
      // Initial state
      costs: ACTIVE_OPERATION_COSTS,
      cachedItineraryCosts: {},
      cachedExportCosts: {},
      lastCheckedCredits: 0,
      affordabilityCache: {},
      
      // Actions
      updateCosts: (newCosts) => {
        set((state) => ({
          costs: { ...state.costs, ...newCosts },
          // Clear caches when costs change
          cachedItineraryCosts: {},
          cachedExportCosts: {},
          affordabilityCache: {},
        }));
      },
      
      resetCosts: () => {
        set({
          costs: ACTIVE_OPERATION_COSTS,
          cachedItineraryCosts: {},
          cachedExportCosts: {},
          affordabilityCache: {},
        });
      },
      
      getItineraryCost: (days) => {
        const state = get();
        
        // Check cache first
        if (state.cachedItineraryCosts[days] !== undefined) {
          return state.cachedItineraryCosts[days];
        }
        
        // Calculate and cache
        const cost = calculateItineraryCost(days, state.costs);
        set((prevState) => ({
          cachedItineraryCosts: {
            ...prevState.cachedItineraryCosts,
            [days]: cost,
          },
        }));
        
        return cost;
      },
      
      getExportCostCached: (format) => {
        const state = get();
        
        // Check cache first
        if (state.cachedExportCosts[format] !== undefined) {
          return state.cachedExportCosts[format];
        }
        
        // Calculate and cache
        const cost = getExportCost(format, state.costs);
        set((prevState) => ({
          cachedExportCosts: {
            ...prevState.cachedExportCosts,
            [format]: cost,
          },
        }));
        
        return cost;
      },
      
      getExportOptionsWithAffordability: (userCredits) => {
        const state = get();
        const options = getExportOptions(state.costs);
        
        return options.map((option) => ({
          ...option,
          canAfford: canAffordOperation(userCredits, option.cost),
          disabled: !canAffordOperation(userCredits, option.cost),
        }));
      },
      
      checkAffordability: (userCredits, operationType, operationCost) => {
        const state = get();
        const cacheKey = `${operationType}-${operationCost}-${userCredits}`;
        
        // Check cache first (only if credits haven't changed significantly)
        if (
          Math.abs(state.lastCheckedCredits - userCredits) < 1 &&
          state.affordabilityCache[cacheKey] !== undefined
        ) {
          return state.affordabilityCache[cacheKey];
        }
        
        // Calculate and cache
        const canAfford = canAffordOperation(userCredits, operationCost);
        set((prevState) => ({
          lastCheckedCredits: userCredits,
          affordabilityCache: {
            ...prevState.affordabilityCache,
            [cacheKey]: canAfford,
          },
        }));
        
        return canAfford;
      },
      
      clearAffordabilityCache: () => {
        set({ affordabilityCache: {}, lastCheckedCredits: 0 });
      },
      
      formatCost: (cost) => formatCostDisplay(cost),
      
      calculateTotalTripCost: (days, exportFormats) => {
        const state = get();
        const itineraryCost = get().getItineraryCost(days);
        const exportCosts = exportFormats.reduce((total, format) => {
          return total + get().getExportCostCached(format);
        }, 0);
        
        const totalCost = itineraryCost + exportCosts;
        
        return {
          itineraryCost,
          exportCosts,
          totalCost,
          breakdown: {
            generation: formatCostDisplay(itineraryCost),
            exports: formatCostDisplay(exportCosts),
            total: formatCostDisplay(totalCost),
          },
          canAfford: (userCredits: number) => canAffordOperation(userCredits, totalCost),
        };
      },
    }),
    {
      name: 'operation-costs-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
