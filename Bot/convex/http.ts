import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api } from './_generated/api';

const http = httpRouter();

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Test endpoint to verify HTTP routing is working
http.route({
  path: '/test',
  method: 'GET',
  handler: httpAction(async (_ctx, _request) => {
    console.log('Test endpoint hit!');
    return new Response('Test successful!', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }),
});

/**
 * To set up this webhook:
 * 1. Add your Telegram Bot Token to your Convex project's environment variables as `BOT_TOKEN`.
 * 2. Run the following command, replacing the placeholders:
 *    curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_CONVEX_URL>/telegram"
 *    (Your Convex URL is https://descriptive-starfish-159.convex.cloud)
 */
http.route({
  path: '/telegram',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    console.log('Received webhook request');
    try {
      const body = await request.text();
      console.log('Request body:', body);
      
      const update = JSON.parse(body);
      console.log('Processing Telegram update:', update);
      
      // Schedule the action to run in the background to avoid timeouts
      // and immediately return a 200 OK to Telegram.
      await ctx.scheduler.runAfter(0, api.actions.handleTelegramUpdate, { update });
      console.log('Scheduled action successfully');
    } catch (error) {
      console.error('Error processing Telegram update:', error);
    }
    
    // Always respond to Telegram with a 200 OK
    return new Response('OK', { status: 200 });
  }),
});

// User-related endpoints

// Get or create user by Telegram ID
http.route({
  path: '/user',
  method: 'OPTIONS',
  handler: httpAction(async (_ctx, _request) => {
    return new Response(null, { status: 200, headers: corsHeaders });
  }),
});

http.route({
  path: '/user',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      const { telegramId, firstName, lastName, username } = JSON.parse(body);
      
      // Check if user exists
      let user = await ctx.runQuery(api.queries.getUserByTelegramId, { telegramId });
      
      if (!user) {
        // Create new user
        await ctx.runMutation(api.mutations.createUser, {
          telegramId,
          firstName,
          lastName,
          username,
        });
        
        user = await ctx.runQuery(api.queries.getUserByTelegramId, { telegramId });
      }
      
      return new Response(JSON.stringify({ user }), {
        status: 200,
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Error handling user request:', error);
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }),
});

// Get user data (credits, history, preferences)
http.route({
  path: '/user-data',
  method: 'OPTIONS',
  handler: httpAction(async (_ctx, _request) => {
    return new Response(null, { status: 200, headers: corsHeaders });
  }),
});

http.route({
  path: '/user-data',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      const { userId } = JSON.parse(body);
      
      // Use Promise.allSettled to handle individual query failures gracefully
      const [searchHistoryResult, creditHistoryResult, preferencesResult] = await Promise.allSettled([
        ctx.runQuery(api.queries.getUserSearchHistory, { userId }),
        ctx.runQuery(api.queries.getUserCreditHistory, { userId }),
        ctx.runQuery(api.queries.getUserPreferences, { userId }),
      ]);
      
      // Extract results or use fallback values
      const searchHistory = searchHistoryResult.status === 'fulfilled' ? searchHistoryResult.value || [] : [];
      const creditHistory = creditHistoryResult.status === 'fulfilled' ? creditHistoryResult.value || [] : [];
      const preferences = preferencesResult.status === 'fulfilled' ? preferencesResult.value : null;
      
      // Log any failed queries for debugging
      if (searchHistoryResult.status === 'rejected') {
        console.error('Failed to fetch search history:', searchHistoryResult.reason);
      }
      if (creditHistoryResult.status === 'rejected') {
        console.error('Failed to fetch credit history:', creditHistoryResult.reason);
      }
      if (preferencesResult.status === 'rejected') {
        console.error('Failed to fetch preferences:', preferencesResult.reason);
      }
      
      return new Response(JSON.stringify({
        searchHistory,
        creditHistory,
        preferences,
      }), {
        status: 200,
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }),
});

// Update user credits
http.route({
  path: '/update-credits',
  method: 'OPTIONS',
  handler: httpAction(async (_ctx, _request) => {
    return new Response(null, { status: 200, headers: corsHeaders });
  }),
});

http.route({
  path: '/update-credits',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      const { userId, amount, action } = JSON.parse(body);
      
      const newCredits = await ctx.runMutation(api.mutations.updateUserCredits, {
        userId,
        amount,
        action,
      });
      
      return new Response(JSON.stringify({ credits: newCredits }), {
        status: 200,
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Error updating credits:', error);
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }),
});

// Add search history
http.route({
  path: '/add-search-history',
  method: 'OPTIONS',
  handler: httpAction(async (_ctx, _request) => {
    return new Response(null, { status: 200, headers: corsHeaders });
  }),
});

http.route({
  path: '/add-search-history',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      const { userId, destination, preferences, itinerary } = JSON.parse(body);
      
      await ctx.runMutation(api.mutations.addSearchHistory, {
        userId,
        destination,
        preferences,
        itinerary,
      });
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Error adding search history:', error);
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }),
});

// Set user preferences
http.route({
  path: '/set-preferences',
  method: 'OPTIONS',
  handler: httpAction(async (_ctx, _request) => {
    return new Response(null, { status: 200, headers: corsHeaders });
  }),
});

http.route({
  path: '/set-preferences',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      const { userId, ...preferences } = JSON.parse(body);
      
      await ctx.runMutation(api.mutations.setUserPreferences, {
        userId,
        ...preferences,
      });
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Error setting preferences:', error);
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }),
});

// CORS preflight handler for createInvoice
http.route({
  path: '/createInvoice',
  method: 'OPTIONS',
  handler: httpAction(async (_ctx, _request) => {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }),
});

// HTTP endpoint for creating invoices from the frontend
http.route({
  path: '/createInvoice',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    console.log('Creating invoice request received');
    
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    try {
      const body = await request.text();
      const { itemId, userId } = JSON.parse(body);
      console.log('Request data:', { itemId, userId });
      
      // Get item details from ITEMS constant
      const { ITEMS } = await import('./constants');
      const item = ITEMS[itemId];
      
      if (!item) {
        return new Response(JSON.stringify({ 
          error: 'Invalid item ID' 
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      // Call the createInvoiceLink action
      const result = await ctx.runAction(api.actions.createInvoiceLink, {
        chat_id: 123456789, // Use a valid dummy chat_id since this is for createInvoiceLink
        title: item.name,
        description: item.description,
        payload: itemId,
        currency: 'XTR',
        prices: [{ label: item.name, amount: item.price }]
      });
      
      if (result.success) {
        return new Response(JSON.stringify({ 
          invoiceLink: result.invoiceLink 
        }), {
          status: 200,
          headers: corsHeaders
        });
      } else {
        return new Response(JSON.stringify({ 
          error: result.error || 'Failed to create invoice'
        }), {
          status: 500,
          headers: corsHeaders
        });
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }),
});

export default http;
