import { NextRequest, NextResponse } from 'next/server';
import { APIError } from './error-handler';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-token-12345';

export function verifyAuth(request: NextRequest): string {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    throw new APIError(401, 'No authorization header provided', 'UNAUTHORIZED');
  }

  const token = authHeader.replace('Bearer ', '');

  if (token !== ADMIN_TOKEN) {
    throw new APIError(401, 'Invalid token', 'INVALID_TOKEN');
  }

  return 'admin-user-1';
}

// ✅ CAMBIADO: Ahora usa NextRequest
export function withAuth(
  handler: (request: NextRequest, userId: string, context?: unknown) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: unknown) => {
    const userId = verifyAuth(request);
    return handler(request, userId, context);
  };
}