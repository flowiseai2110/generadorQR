import { NextResponse } from 'next/server';
import { APIResponse } from '@/types/api';

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  const response: APIResponse<T> = {
    success: true,
    data,
    message,
  };

  return NextResponse.json(response, { status });
}

export function errorResponse(
  message: string,
  code: string = 'ERROR',
  status: number = 400,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    {
      error: {
        message,
        code,
        statusCode: status,
        details,
      },
    },
    { status }
  );
}