import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/middleware/error-handler';
import { handleCORS, withCORS } from '@/lib/middleware/cors';
import { withAuth } from '@/lib/middleware/auth';
import { successResponse } from '@/lib/utils/api-response';

// GET - Endpoint público
export const GET = withErrorHandler(async (request: NextRequest) => {
  // Manejar CORS
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const origin = request.headers.get('origin');
  
  const response = successResponse(
    {
      message: 'Test endpoint working!',
      method: 'GET',
      timestamp: new Date().toISOString(),
    },
    'Public endpoint'
  );

  return withCORS(response, origin);
});

// POST - Endpoint protegido
export const POST = withErrorHandler(
  withAuth(async (request: NextRequest, userId: string) => {
    // Manejar CORS
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;

    const origin = request.headers.get('origin');
    const body = await request.json();

    const response = successResponse(
      {
        message: 'Test POST endpoint working!',
        userId,
        receivedData: body,
        timestamp: new Date().toISOString(),
      },
      'Protected endpoint'
    );

    return withCORS(response, origin);
  })
);

// OPTIONS - Preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}