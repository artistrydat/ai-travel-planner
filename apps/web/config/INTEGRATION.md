# Operation Costs Integration Guide

This guide documents the successful integration of the operation costs configuration system with your existing Zustand stores and TanStack Query setup.

## ✅ Integration Complete

The operation costs system has been successfully integrated into your application with the following components:

### 1. **Zustand Store Integration** (`/store/operationCostsStore.ts`)

A new Zustand store that provides:
- ✅ **Persistent cost configuration** (saved to localStorage)
- ✅ **Cached calculations** for better performance
- ✅ **Affordability caching** to avoid repeated calculations
- ✅ **Reactive updates** when costs change

Key features:
```typescript
// Cost calculations with caching
getItineraryCost(days: number)
getExportCostCached(format: 'txt' | 'pdf' | 'ics')

// Affordability checks
checkAffordability(userCredits, operationType, operationCost)

// Bulk operations
calculateTotalTripCost(days, exportFormats)
```

### 2. **TanStack Query Integration** (`/hooks/useOperationCosts.ts`)

Custom React hooks that combine operation costs with reactive user data:

#### `useOperationCosts()`
- ✅ **Real-time user credits** from Convex queries
- ✅ **Reactive affordability checks** that update when credits change
- ✅ **Cached calculations** for performance
- ✅ **Loading states** handled automatically

#### `useItineraryCosts(days: number)`
- ✅ **Specific to itinerary generation**
- ✅ **Returns cost, affordability, and formatted strings**
- ✅ **Calculates shortfall** when insufficient credits

#### `useExportCosts(format?: string)`
- ✅ **Specific to export operations**
- ✅ **Returns all export options with affordability**
- ✅ **Format-specific or all formats**

### 3. **Component Updates**

#### **ExportModal.tsx** ✅
- Uses `useExportCosts()` for reactive export options
- Shows real-time credit balance
- Disables buttons when insufficient credits
- Displays cost for each export option

#### **PlannerControls.tsx** ✅
- Uses `useItineraryCosts(days)` for real-time cost calculation
- Shows cost indicator that updates with duration changes
- Disables generate button when insufficient credits
- Shows shortfall amount when needed

#### **page.tsx** (Main App) ✅
- Uses `useItineraryCosts(days)` for validation
- Integrates with existing TanStack Query mutations
- Provides user-friendly error messages
- Maintains existing functionality

## 🔄 How It Works

### Real-time Updates Flow:
1. **User credits change** (via purchase or spending)
2. **TanStack Query detects change** (through Convex subscription)
3. **Hooks automatically recalculate** affordability
4. **Components re-render** with updated states
5. **UI updates** (buttons enable/disable, costs update)

### Performance Optimizations:
- **Caching**: Repeated cost calculations are cached
- **Debouncing**: Affordability checks are debounced
- **Selective updates**: Only affected components re-render
- **Stale time**: Query results cached for 30 seconds

## 🎯 Key Benefits

### For Developers:
- ✅ **Type-safe** with full TypeScript support
- ✅ **Reactive** - automatically updates when data changes
- ✅ **Performant** - with intelligent caching
- ✅ **Maintainable** - centralized configuration
- ✅ **Testable** - clear separation of concerns

### For Users:
- ✅ **Real-time feedback** on costs and affordability
- ✅ **Clear error messages** when insufficient credits
- ✅ **Responsive UI** that updates immediately
- ✅ **Consistent experience** across all features

## 🛠 Configuration

### Updating Costs:
```typescript
import { useOperationCostsStore } from '../store/operationCostsStore';

const { updateCosts } = useOperationCostsStore();

// Update specific costs
updateCosts({
  export: {
    pdfFile: 3, // Changed from 2 to 3 credits
  }
});
```

### Environment-Specific Costs:
The system automatically uses different costs for development vs production:
- **Development**: Reduced costs for testing
- **Production**: Full costs as configured

## 🔍 Debugging

### Check Current Configuration:
```typescript
const { costs } = useOperationCosts();
console.log('Current costs:', costs);
```

### Monitor Affordability:
```typescript
const { affordability, userCredits } = useOperationCosts();
console.log('User credits:', userCredits);
console.log('Affordability:', affordability);
```

### Clear Caches (if needed):
```typescript
const { clearAffordabilityCache } = useOperationCostsStore();
clearAffordabilityCache();
```

## 🚀 Ready to Use

The system is now fully integrated and ready for production use. All existing functionality is preserved while adding the new cost management features seamlessly.

### Test the Integration:
1. Change trip duration → See cost update in real-time
2. Try export with different formats → See different costs
3. Spend credits → See buttons disable when insufficient
4. Buy credits → See options re-enable automatically

The operation costs system is now a core part of your application architecture! 🎉
