/**
 * Operation Costs Configuration
 * 
 * This file defines the credit costs for various user operations in the AI Travel Planner.
 * Modify these values to adjust pricing for different features.
 */

export interface OperationCosts {
  // Itinerary generation costs
  itineraryGeneration: {
    /** Cost per day of itinerary generated */
    costPerDay: number;
    /** Minimum cost for any itinerary generation */
    minimumCost: number;
    /** Maximum cost cap for very long itineraries */
    maximumCost: number;
  };
  
  // Export costs
  export: {
    /** Cost for exporting itinerary as text file (.txt) */
    textFile: number;
    /** Cost for exporting itinerary as PDF file (.pdf) */
    pdfFile: number;
    /** Cost for exporting itinerary as calendar file (.ics) */
    calendarFile: number;
  };
  
  // Additional operation costs (for future features)
  additional: {
    /** Cost for re-generating a specific day in an itinerary */
    regenerateDay: number;
    /** Cost for getting detailed local recommendations */
    localRecommendations: number;
    /** Cost for weather integration */
    weatherIntegration: number;
  };
}

/**
 * Default operation costs configuration
 */
export const DEFAULT_OPERATION_COSTS: OperationCosts = {
  itineraryGeneration: {
    costPerDay: 2, // 2 credits per day
    minimumCost: 3, // Minimum 3 credits even for 1-day trips
    maximumCost: 20, // Cap at 20 credits for very long trips
  },
  
  export: {
    textFile: 1, // 1 credit for text export
    pdfFile: 2, // 2 credits for PDF export (more processing required)
    calendarFile: 1, // 1 credit for calendar export
  },
  
  additional: {
    regenerateDay: 1, // 1 credit to regenerate a single day
    localRecommendations: 1, // 1 credit for enhanced local tips
    weatherIntegration: 1, // 1 credit for weather data
  },
};

/**
 * Calculate the cost for generating an itinerary based on duration
 * @param days Number of days in the itinerary
 * @param costs Optional custom costs configuration
 * @returns Number of credits required
 */
export function calculateItineraryCost(
  days: number, 
  costs: OperationCosts = DEFAULT_OPERATION_COSTS
): number {
  const baseCost = days * costs.itineraryGeneration.costPerDay;
  
  // Apply minimum and maximum cost constraints
  return Math.max(
    costs.itineraryGeneration.minimumCost,
    Math.min(baseCost, costs.itineraryGeneration.maximumCost)
  );
}

/**
 * Get the cost for a specific export operation
 * @param exportType Type of export operation
 * @param costs Optional custom costs configuration
 * @returns Number of credits required
 */
export function getExportCost(
  exportType: 'txt' | 'pdf' | 'ics',
  costs: OperationCosts = DEFAULT_OPERATION_COSTS
): number {
  switch (exportType) {
    case 'txt':
      return costs.export.textFile;
    case 'pdf':
      return costs.export.pdfFile;
    case 'ics':
      return costs.export.calendarFile;
    default:
      throw new Error(`Unknown export type: ${exportType}`);
  }
}

/**
 * Get all available export types with their costs
 * @param costs Optional custom costs configuration
 * @returns Array of export options with costs
 */
export function getExportOptions(costs: OperationCosts = DEFAULT_OPERATION_COSTS) {
  return [
    {
      type: 'txt' as const,
      name: 'Text File',
      description: 'Plain text format (.txt)',
      cost: costs.export.textFile,
      icon: 'text-file',
    },
    {
      type: 'pdf' as const,
      name: 'PDF Document',
      description: 'Formatted PDF document (.pdf)',
      cost: costs.export.pdfFile,
      icon: 'document',
    },
    {
      type: 'ics' as const,
      name: 'Calendar File',
      description: 'Import to calendar apps (.ics)',
      cost: costs.export.calendarFile,
      icon: 'calendar',
    },
  ];
}

/**
 * Check if user has sufficient credits for an operation
 * @param userCredits Current user credit balance
 * @param operationCost Cost of the operation
 * @returns True if user can afford the operation
 */
export function canAffordOperation(userCredits: number, operationCost: number): boolean {
  return userCredits >= operationCost;
}

/**
 * Format cost display for UI
 * @param cost Number of credits
 * @returns Formatted string for display
 */
export function formatCostDisplay(cost: number): string {
  return `${cost} credit${cost === 1 ? '' : 's'}`;
}

/**
 * Environment-specific cost overrides
 * You can override costs based on environment variables or feature flags
 */
export function getEnvironmentCosts(): OperationCosts {
  // Check for environment-specific overrides
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Development environment - reduced costs for testing
    return {
      ...DEFAULT_OPERATION_COSTS,
      itineraryGeneration: {
        ...DEFAULT_OPERATION_COSTS.itineraryGeneration,
        costPerDay: 1, // Reduced for testing
        minimumCost: 1,
      },
      export: {
        ...DEFAULT_OPERATION_COSTS.export,
        textFile: 1, // Free in development
        pdfFile: 2,
        calendarFile: 3,
      },
    };
  }
  
  // Production costs
  return DEFAULT_OPERATION_COSTS;
}

/**
 * Get the active costs configuration (with environment overrides)
 */
export const ACTIVE_OPERATION_COSTS = getEnvironmentCosts();
