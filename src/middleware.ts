import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './utils/auth';

// --- Rate Limiting Setup ---
// In-memory store (resets on server restart, sufficient for basic protection)
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_MINUTE = 200; // Safe threshold to prevent spam without breaking normal usage

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  record.count += 1;
  return record.count <= MAX_REQUESTS_PER_MINUTE;
}

export const onRequest = defineMiddleware(async (context, next) => {
  // 1. Rate Limiting
  const ip = context.clientAddress || 'unknown-ip';
  if (!checkRateLimit(ip)) {
    return new Response('Too Many Requests - Rate Limit Exceeded', { 
      status: 429,
      headers: { 'Retry-After': '60' }
    });
  }

  // 2. Auth Logic
  const isAppRoute = context.url.pathname.startsWith('/app');
  const isAuthRoute = context.url.pathname === '/login' || context.url.pathname === '/register';
  
  const token = context.cookies.get('session')?.value;
  let userId: string | null = null;
  
  if (token) {
    userId = await verifySessionToken(token);
  }

  if (isAppRoute && !userId) {
    return context.redirect('/login');
  }

  if (isAuthRoute && userId) {
    return context.redirect('/app');
  }

  if (userId) {
    context.locals.userId = userId;
  }
  
  // 3. Process Request
  const response = await next();

  // 4. Security Headers
  // Mencegah Clickjacking (aplikasi tidak bisa di-embed di iframe situs lain)
  response.headers.set('X-Frame-Options', 'DENY');
  // Mencegah MIME-sniffing (browser harus mengikuti Content-Type)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Memaksa koneksi HTTPS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Basic XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
});
