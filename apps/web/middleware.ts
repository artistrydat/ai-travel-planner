import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /landing, /privacy, etc.)
  const path = request.nextUrl.pathname;

  // Define public pages that should be accessible without restrictions
  const publicPages = ['/landing', '/privacy', '/credits'];
  
  // Check for obvious Telegram indicators (only the most reliable ones)
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  
  // Only check for very clear Telegram indicators
  const isTelegramBot = userAgent.includes('TelegramBot');
  const isTelegramReferer = referer.includes('t.me') || referer.includes('telegram');
  const hasTelegramParams = request.nextUrl.searchParams.has('tgWebAppStartParam') ||
                           request.nextUrl.searchParams.has('tgWebAppData');
  
  // More permissive detection - only block obvious non-Telegram traffic
  const isProbablyTelegram = isTelegramBot || isTelegramReferer || hasTelegramParams ||
                            userAgent.includes('Telegram');

  console.log('Middleware - Path:', path, 'User-Agent:', userAgent.substring(0, 100));
  console.log('Middleware - Is probably Telegram:', isProbablyTelegram);

  // Allow all access to main app - let client-side handle Telegram detection
  if (path === '/') {
    console.log('Middleware: Allowing access to main app, client will handle Telegram detection');
    return NextResponse.next();
  }

  // Allow access to public pages
  if (publicPages.includes(path)) {
    console.log('Middleware: Allowing access to public page:', path);
    return NextResponse.next();
  }

  // For all other cases, continue
  console.log('Middleware: Allowing access to', path);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
