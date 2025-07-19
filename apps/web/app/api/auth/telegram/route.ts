import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface TelegramAuthRequest {
  initData: string;
}

interface TelegramAuthResponse {
  valid: boolean;
  user?: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<TelegramAuthResponse>> {
  try {
    const { initData }: TelegramAuthRequest = await request.json();

    if (!initData) {
      return NextResponse.json(
        { valid: false, error: 'No initData provided' },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN environment variable is not set');
      return NextResponse.json(
        { valid: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse the initData
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      return NextResponse.json(
        { valid: false, error: 'No hash found in initData' },
        { status: 400 }
      );
    }

    // Remove hash from params for verification
    urlParams.delete('hash');

    // Create data check string
    const dataCheckString = Array.from(urlParams.entries())
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n');

    // Create secret key
    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Compute expected hash
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(dataCheckString)
      .digest('hex');

    // Verify hash
    const isValid = expectedHash === hash;

    if (!isValid) {
      return NextResponse.json(
        { valid: false, error: 'Invalid hash' },
        { status: 401 }
      );
    }

    // Check auth_date (optional but recommended for security)
    const authDate = urlParams.get('auth_date');
    if (authDate) {
      const authTimestamp = parseInt(authDate, 10);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const maxAge = 24 * 60 * 60; // 24 hours in seconds

      if (currentTimestamp - authTimestamp > maxAge) {
        return NextResponse.json(
          { valid: false, error: 'Authentication data is too old' },
          { status: 401 }
        );
      }
    }

    // Parse user data
    const userParam = urlParams.get('user');
    let user = null;
    
    if (userParam) {
      try {
        user = JSON.parse(userParam);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return NextResponse.json(
          { valid: false, error: 'Invalid user data format' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      valid: true,
      user,
    });

  } catch (error) {
    console.error('Telegram auth verification error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
