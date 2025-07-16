import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api } from './_generated/api';

const http = httpRouter();

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
