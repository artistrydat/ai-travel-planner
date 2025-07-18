// A simple client for the Telegram Bot API.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN environment variable not set!');
}
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function callTelegramApi(method: string, params: object) {
  const response = await fetch(`${API_URL}/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Telegram API error (${method}): ${response.status} ${errorBody}`);
  }

  const json = await response.json();
  if (!json.ok) {
    throw new Error(`Telegram API error (${method}): ${json.description}`);
  }
  return json.result;
}

// --- Specific API Method Wrappers ---

export async function sendMessage(params: {
  chat_id: number | string;
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
  reply_markup?: object;
}) {
  return callTelegramApi('sendMessage', params);
}

export async function sendInvoice(params: {
  chat_id: number | string;
  title: string;
  description: string;
  payload: string;
  provider_token: string;
  currency: 'XTR';
  prices: { label: string; amount: number }[];
}) {
  return callTelegramApi('sendInvoice', params);
}

export async function answerPreCheckoutQuery(params: {
  pre_checkout_query_id: string;
  ok: boolean;
  error_message?: string;
}) {
  return callTelegramApi('answerPreCheckoutQuery', params);
}

export async function refundStarPayment(params: {
  user_id: number;
  telegram_payment_charge_id: string;
}): Promise<boolean> {
  try {
    await callTelegramApi('refundStarPayment', params);
    return true;
  } catch (e) {
    console.error('Failed to refund star payment:', e);
    return false;
  }
}

export async function createInvoiceLink(params: {
  title: string;
  description: string;
  payload: string;
  provider_token: string;
  currency: 'XTR';
  prices: { label: string; amount: number }[];
}) {
  return callTelegramApi('createInvoiceLink', params);
}