/**
 * Example Usage of Operation Costs Configuration
 * 
 * This file demonstrates how to use the operation costs configuration
 * in various parts of your application.
 */

import { 
  calculateItineraryCost, 
  getExportCost, 
  getExportOptions, 
  canAffordOperation, 
  formatCostDisplay,
  DEFAULT_OPERATION_COSTS,
  ACTIVE_OPERATION_COSTS
} from './operationCosts';

// Example 1: Calculate itinerary generation cost
export function exampleItineraryCost() {
  const duration = 5; // 5-day trip
  const cost = calculateItineraryCost(duration);
  
  console.log(`A ${duration}-day trip costs: ${formatCostDisplay(cost)}`);
  // Output: "A 5-day trip costs: 10 credits"
}

// Example 2: Check if user can afford an operation
export function exampleAffordabilityCheck() {
  const userCredits = 15;
  const tripDuration = 7;
  const tripCost = calculateItineraryCost(tripDuration);
  
  if (canAffordOperation(userCredits, tripCost)) {
    console.log(`User can afford the ${tripDuration}-day trip!`);
  } else {
    console.log(`User needs ${tripCost - userCredits} more credits for this trip.`);
  }
}

// Example 3: Get export costs
export function exampleExportCosts() {
  const txtCost = getExportCost('txt');
  const pdfCost = getExportCost('pdf');
  const icsCost = getExportCost('ics');
  
  console.log('Export costs:');
  console.log(`- Text: ${formatCostDisplay(txtCost)}`);
  console.log(`- PDF: ${formatCostDisplay(pdfCost)}`);
  console.log(`- Calendar: ${formatCostDisplay(icsCost)}`);
}

// Example 4: Dynamic export options for UI (return data structure for React components)
export function getExportMenuData(userCredits: number) {
  const options = getExportOptions();
  
  return options.map((option) => ({
    ...option,
    canAfford: canAffordOperation(userCredits, option.cost),
    disabled: !canAffordOperation(userCredits, option.cost),
    displayText: `${option.name} - ${formatCostDisplay(option.cost)}`,
  }));
}

// Example usage in a React component:
// const menuData = getExportMenuData(userCredits);
// return menuData.map(item => (
//   <button key={item.type} disabled={item.disabled}>
//     {item.displayText}
//   </button>
// ));

// Example 5: Custom cost calculation with overrides
export function exampleCustomCosts() {
  // Using default costs
  const defaultCost = calculateItineraryCost(3);
  
  // Using custom costs
  const customCosts = {
    ...DEFAULT_OPERATION_COSTS,
    itineraryGeneration: {
      ...DEFAULT_OPERATION_COSTS.itineraryGeneration,
      costPerDay: 1, // Reduced cost per day
      minimumCost: 2, // Lower minimum
    },
  };
  
  const customCost = calculateItineraryCost(3, customCosts);
  
  console.log(`Default cost for 3 days: ${formatCostDisplay(defaultCost)}`);
  console.log(`Custom cost for 3 days: ${formatCostDisplay(customCost)}`);
}

// Example 6: Environment-aware pricing
export function exampleEnvironmentPricing() {
  console.log('Active costs configuration:', ACTIVE_OPERATION_COSTS);
  
  // In development, costs might be reduced for testing
  // In production, full costs apply
  const tripCost = calculateItineraryCost(5, ACTIVE_OPERATION_COSTS);
  console.log(`Trip cost with environment settings: ${formatCostDisplay(tripCost)}`);
}

// Example 7: Bulk operations cost calculator
export function calculateBulkOperationsCost(
  itineraryDays: number,
  exportFormats: Array<'txt' | 'pdf' | 'ics'>
) {
  const itineraryCost = calculateItineraryCost(itineraryDays);
  const exportCosts = exportFormats.reduce((total, format) => {
    return total + getExportCost(format);
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
  };
}

// Example usage of bulk calculator
export function exampleBulkCalculation() {
  const result = calculateBulkOperationsCost(
    7, // 7-day trip
    ['txt', 'pdf', 'ics'] // All export formats
  );
  
  console.log('Bulk operation costs:');
  console.log(`- Generation: ${result.breakdown.generation}`);
  console.log(`- Exports: ${result.breakdown.exports}`);
  console.log(`- Total: ${result.breakdown.total}`);
}
