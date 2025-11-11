import { NextRequest, NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error && typeof error === 'object' && 'issues' in error) {
    return NextResponse.json(
      {
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: (error as { issues: unknown }).issues,
        },
      },
      { status: 400 }
    );
  }

  const errorMessage = error instanceof Error ? error.message : 'Internal server error';
  
  return NextResponse.json(
    {
      error: {
        message: errorMessage,
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      },
    },
    { status: 500 }
  );
}

// ✅ CAMBIADO: Ahora usa NextRequest
export function withErrorHandler(
  handler: (request: NextRequest, context?: unknown) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: unknown) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}