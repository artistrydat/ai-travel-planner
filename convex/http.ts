import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api } from './_generated/api';

const http = httpRouter();
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Helper for error responses
const errorResponse = (error: unknown) => new Response(
  JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
  { status: 500, headers: corsHeaders }
);

// Telegram webhook
http.route({
  path: '/telegram',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const update = JSON.parse(await request.text());
      await ctx.scheduler.runAfter(0, api.actions.handleTelegramUpdate, { update });
      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Telegram webhook error:', error);
      return errorResponse(error);
    }
  }),
});

// User endpoints
const userRoutes = {
  path: '/user',
  method: "OPTIONS" as const,
  handler: httpAction(async () => Promise.resolve(new Response(null, { status: 200, headers: corsHeaders })))
};
http.route(userRoutes);

http.route({
  ...userRoutes,
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const { telegramId, firstName, lastName, username } = JSON.parse(await request.text());
      let user = await ctx.runQuery(api.queries.getUserByTelegramId, { telegramId });
      if (!user) {
        await ctx.runMutation(api.mutations.createUser, { telegramId, firstName, lastName, username });
        user = await ctx.runQuery(api.queries.getUserByTelegramId, { telegramId });
      }
      return new Response(JSON.stringify({ user }), { status: 200, headers: corsHeaders });
    } catch (error) {
      return errorResponse(error);
    }
  }),
});

// Generic endpoint creator
const createEndpoint = (path: string, action: any) => {
  http.route({ path, method: 'OPTIONS', handler: httpAction(() => 
    Promise.resolve(new Response(null, { status: 200, headers: corsHeaders }))
  )});
  
  http.route({
    path,
    method: 'POST',
    handler: httpAction(async (ctx, request) => {
      try {
        const data = JSON.parse(await request.text());
        const result = await action(ctx, data);
        return new Response(JSON.stringify(result), { status: 200, headers: corsHeaders });
      } catch (error) {
        return errorResponse(error);
      }
    })
  });
};

// Create multiple endpoints using the helper
createEndpoint('/user-data', async (ctx: any, { userId }: any) => {
  const [searchHistory, creditHistory, preferences] = await Promise.allSettled([
    ctx.runQuery(api.queries.getUserSearchHistory, { userId }),
    ctx.runQuery(api.queries.getUserCreditHistory, { userId }),
    ctx.runQuery(api.queries.getUserPreferences, { userId })
  ]);
  return {
    searchHistory: searchHistory.status === 'fulfilled' ? searchHistory.value || [] : [],
    creditHistory: creditHistory.status === 'fulfilled' ? creditHistory.value || [] : [],
    preferences: preferences.status === 'fulfilled' ? preferences.value : null
  };
});

createEndpoint('/update-credits', (ctx: any, { userId, amount, action }: any) => 
  ctx.runMutation(api.mutations.updateUserCredits, { userId, amount, action }));

createEndpoint('/add-search-history', (ctx: any, { userId, destination, preferences, itinerary }: any) => 
  ctx.runMutation(api.mutations.addSearchHistory, { userId, destination, preferences, itinerary }));

createEndpoint('/set-preferences', (ctx: any, { userId, ...preferences }: any) => 
  ctx.runMutation(api.mutations.setUserPreferences, { userId, ...preferences }));

// Invoice endpoint
http.route({
  path: '/createInvoice',
  method: 'OPTIONS',
  handler: httpAction(() => Promise.resolve(new Response(null, { status: 200, headers: corsHeaders })))
});

http.route({
  path: '/createInvoice',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const { itemId } = JSON.parse(await request.text());
      const { ITEMS } = await import('./constants');
      const item = ITEMS[itemId];
      if (!item) throw new Error('Invalid item ID');
      
      const result = await ctx.runAction(api.actions.createInvoiceLink, {
        chat_id: 123456789,
        title: item.name,
        description: item.description,
        payload: itemId,
        currency: 'XTR',
        prices: [{ label: item.name, amount: item.price }]
      });
      
      return result.success 
        ? new Response(JSON.stringify({ invoiceLink: result.invoiceLink }), { status: 200, headers: corsHeaders })
        : new Response(JSON.stringify({ error: result.error }), { status: 500, headers: corsHeaders });
    } catch (error) {
      return errorResponse(error);
    }
  }),
});

// File serving endpoint
http.route({
  path: '/files/download',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    try {
      const { searchParams } = new URL(request.url);
      const storageId = searchParams.get('storageId');
      
      if (!storageId) {
        return new Response('Missing storageId parameter', { status: 400 });
      }
      
      // Get the file from storage
      const blob = await ctx.storage.get(storageId);
      
      if (!blob) {
        return new Response('File not found', { status: 404 });
      }
      
      // Get file metadata
      const fileRecord = await ctx.runQuery(api.queries.getExportedFileByStorageId, { storageId });
      
      // Set appropriate headers
      const headers = new Headers();
      headers.set('Content-Type', fileRecord?.contentType || 'application/octet-stream');
      headers.set('Content-Disposition', `attachment; filename="${fileRecord?.filename || 'download'}"`);
      headers.set('Access-Control-Allow-Origin', '*');
      
      return new Response(blob, { headers });
    } catch (error) {
      console.error('File download error:', error);
      return errorResponse(error);
    }
  }),
});

export default http;