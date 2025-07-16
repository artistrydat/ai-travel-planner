import { action } from './_generated/server';
import { v } from 'convex/values';
import { api, internal } from './_generated/api';
import { ITEMS, MESSAGES } from './constants';
import {
  answerPreCheckoutQuery,
  refundStarPayment,
  sendInvoice,
  sendMessage,
} from './telegram';

// --- Main Telegram Update Handler ---

export const handleTelegramUpdate = action({
  args: { update: v.any() },
  handler: async (ctx, { update }) => {
    try {
      if (update.message) {
        await handleMessage(ctx, update.message);
      } else if (update.callback_query) {
        await handleCallbackQuery(ctx, update.callback_query);
      } else if (update.pre_checkout_query) {
        await handlePreCheckoutQuery(ctx, update.pre_checkout_query);
      }
    } catch (error) {
      console.error('Failed to handle update:', error);
      // Optionally, send an error message back to the user if a chat_id is available.
    }
  },
});

// --- Message & Command Handlers ---

async function handleMessage(ctx: any, message: any) {
  const text = message.text;
  const chat_id = message.chat.id;

  if (text?.startsWith('/start')) {
    const keyboard = Object.keys(ITEMS).map((itemId) => [
      {
        text: `${ITEMS[itemId].name} - ${ITEMS[itemId].price} ⭐`,
        callback_data: itemId,
      },
    ]);
    await sendMessage({
      chat_id,
      text: MESSAGES.welcome,
      reply_markup: { inline_keyboard: keyboard },
    });
  } else if (text?.startsWith('/help')) {
    await sendMessage({
      chat_id,
      text: MESSAGES.help,
      parse_mode: 'Markdown',
    });
  } else if (text?.startsWith('/refund')) {
    const args = text.split(' ');
    if (args.length < 2) {
      await sendMessage({ chat_id, text: MESSAGES.refund_usage });
      return;
    }
    const telegramChargeId = args[1];
    const userId = message.from.id.toString();
    await ctx.runAction(api.actions.processRefund, {
      userId,
      telegramChargeId,
      chatId: chat_id,
    });
  } else if (message.successful_payment) {
    await handleSuccessfulPayment(ctx, message);
  }
}

// --- Callback & Payment Handlers ---

async function handleCallbackQuery(ctx: any, query: any) {
  const item_id = query.data;
  const chat_id = query.message.chat.id;
  const item = ITEMS[item_id];

  if (item) {
    await sendInvoice({
      chat_id,
      title: item.name,
      description: item.description,
      payload: item_id,
      provider_token: '', // Must be empty for Telegram Stars
      currency: 'XTR',
      prices: [{ label: item.name, amount: item.price }],
    });
  }
}

async function handlePreCheckoutQuery(ctx: any, query: any) {
  const payload = query.invoice_payload;
  if (ITEMS[payload]) {
    await answerPreCheckoutQuery({ pre_checkout_query_id: query.id, ok: true });
  } else {
    await answerPreCheckoutQuery({
      pre_checkout_query_id: query.id,
      ok: false,
      error_message: 'Item not available.',
    });
  }
}

async function handleSuccessfulPayment(ctx: any, message: any) {
  const payment = message.successful_payment;
  const item_id = payment.invoice_payload;
  const item = ITEMS[item_id];
  const user_id = message.from.id.toString();

  // Record the purchase in the database
  await ctx.runMutation(internal.mutations.createPurchase, {
    userId: user_id,
    itemId: item_id,
    itemName: item.name,
    price: item.price,
    telegramChargeId: payment.telegram_payment_charge_id,
  });

  // Send confirmation message to the user
  const confirmationText =
    `Thank you for your purchase! 🎉\n\n` +
    `Here's your secret code for ${item.name}:\n` +
    `\`${item.secret}\`\n\n` +
    `To get a refund, use this command:\n` +
    `\`/refund ${payment.telegram_payment_charge_id}\`\n\n` +
    `Save this message to request a refund later if needed.`;

  await sendMessage({
    chat_id: message.chat.id,
    text: confirmationText,
    parse_mode: 'Markdown',
  });
}

// --- Refund Logic ---

export const processRefund = action({
  args: {
    userId: v.string(),
    telegramChargeId: v.string(),
    chatId: v.number(),
  },
  handler: async (ctx, { userId, telegramChargeId, chatId }) => {
    const purchase = await ctx.runQuery(internal.queries.getPurchaseByChargeId, {
      telegramChargeId,
    });

    if (!purchase) {
      await sendMessage({ chat_id: chatId, text: MESSAGES.refund_failed });
      console.error(`Refund failed: Purchase not found for charge ID ${telegramChargeId}.`);
      return;
    }
    if (purchase.isRefunded) {
      await sendMessage({ chat_id: chatId, text: 'This purchase has already been refunded.' });
      return;
    }

    try {
      const success = await refundStarPayment({
        user_id: parseInt(userId),
        telegram_payment_charge_id: telegramChargeId,
      });

      if (success) {
        await ctx.runMutation(internal.mutations.createRefund, {
          userId,
          telegramChargeId,
          purchaseId: purchase._id,
        });
        await ctx.runMutation(internal.mutations.markAsRefunded, {
          purchaseId: purchase._id,
        });
        await sendMessage({ chat_id: chatId, text: MESSAGES.refund_success });
      } else {
        await sendMessage({ chat_id: chatId, text: MESSAGES.refund_failed });
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      await sendMessage({ chat_id: chatId, text: `❌ Sorry, there was an error processing your refund.` });
    }
  },
});

// --- Create Invoice Link Action for Frontend ---

export const createInvoiceLink = action({
  args: {
    chat_id: v.number(),
    title: v.string(),
    description: v.string(),
    payload: v.string(),
    currency: v.string(),
    prices: v.array(v.object({
      label: v.string(),
      amount: v.number()
    }))
  },
  handler: async (ctx, args) => {
    try {
      console.log('Creating invoice link with args:', args);
      
      // Import telegram function
      const { createInvoiceLink } = await import('./telegram');
      
      // Create invoice link using Telegram API
      const invoiceLink = await createInvoiceLink({
        title: args.title,
        description: args.description,
        payload: args.payload,
        provider_token: '', // Empty for Telegram Stars
        currency: args.currency,
        prices: args.prices
      });
      
      return {
        success: true,
        invoiceLink: invoiceLink
      };
    } catch (error) {
      console.error('Error creating invoice link:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },
});
