# Operation Costs Configuration

This directory contains the configuration system for managing operation costs in the AI Travel Planner application.

## Files

- `operationCosts.ts` - Main configuration file with cost definitions and utility functions
- `operationCosts.examples.ts` - Examples showing how to use the cost configuration system

## Overview

The operation costs system allows you to:

1. **Configure costs for different operations**:
   - Itinerary generation (cost per day with min/max limits)
   - Export operations (text, PDF, calendar files)
   - Additional features (regenerate day, local recommendations, etc.)

2. **Environment-specific pricing**:
   - Development environment has reduced costs for testing
   - Production environment uses full pricing

3. **Utility functions for common operations**:
   - Calculate itinerary costs based on duration
   - Check if user can afford an operation
   - Format cost displays for UI
   - Get available export options with costs

## Quick Start

### Basic Usage

```typescript
import { 
  calculateItineraryCost, 
  getExportCost, 
  canAffordOperation, 
  formatCostDisplay 
} from './config/operationCosts';

// Calculate cost for a 5-day trip
const tripCost = calculateItineraryCost(5);

// Check if user can afford it
const userCredits = 12;
if (canAffordOperation(userCredits, tripCost)) {
  // User can afford the trip
}

// Get export cost
const pdfCost = getExportCost('pdf');

// Format for display
const displayText = formatCostDisplay(tripCost); // "10 credits"
```

### Updating Costs

To change operation costs, modify the `DEFAULT_OPERATION_COSTS` object in `operationCosts.ts`:

```typescript
export const DEFAULT_OPERATION_COSTS: OperationCosts = {
  itineraryGeneration: {
    costPerDay: 3, // Changed from 2 to 3 credits per day
    minimumCost: 5, // Changed from 3 to 5 credits minimum
    maximumCost: 25, // Changed from 20 to 25 credits maximum
  },
  export: {
    textFile: 1,
    pdfFile: 3, // Changed from 2 to 3 credits
    calendarFile: 1,
  },
  // ... other settings
};
```

### Environment-Specific Costs

The system automatically applies different costs based on the environment:

- **Development**: Reduced costs for testing (1 credit per day, free text exports)
- **Production**: Full costs as defined in `DEFAULT_OPERATION_COSTS`

## Current Default Costs

### Itinerary Generation
- **Cost per day**: 2 credits
- **Minimum cost**: 3 credits (even for 1-day trips)
- **Maximum cost**: 20 credits (cap for very long trips)

### Export Operations
- **Text file (.txt)**: 1 credit
- **PDF file (.pdf)**: 2 credits
- **Calendar file (.ics)**: 1 credit

### Additional Features
- **Regenerate single day**: 1 credit
- **Enhanced local recommendations**: 1 credit
- **Weather integration**: 1 credit

## Integration Points

The cost system is integrated into:

1. **Main page (`page.tsx`)**: Validates credits before generation and deducts costs after successful generation
2. **Export modal (`ExportModal.tsx`)**: Shows costs and validates credits for export operations
3. **Planner controls (`PlannerControls.tsx`)**: Shows real-time cost calculation and disables generation when insufficient credits

## Development vs Production

In development mode, costs are automatically reduced to make testing easier:
- Itinerary generation: 1 credit per day (minimum 1 credit)
- Text exports: Free
- Calendar exports: Free
- PDF exports: 1 credit

This helps developers test the application without worrying about credit management during development.

## Adding New Operations

To add a new operation cost:

1. Add it to the `OperationCosts` interface
2. Set default values in `DEFAULT_OPERATION_COSTS`
3. Create utility functions if needed
4. Update the development overrides in `getEnvironmentCosts()` if applicable

Example:
```typescript
// 1. Add to interface
interface OperationCosts {
  // ... existing properties
  newFeature: {
    weatherForecast: number;
  };
}

// 2. Set default value
export const DEFAULT_OPERATION_COSTS: OperationCosts = {
  // ... existing properties
  newFeature: {
    weatherForecast: 2, // 2 credits for weather forecast
  },
};

// 3. Create utility function
export function getWeatherForecastCost(costs: OperationCosts = DEFAULT_OPERATION_COSTS): number {
  return costs.newFeature.weatherForecast;
}
```
