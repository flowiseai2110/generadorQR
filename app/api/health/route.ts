import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'QR Audio/Video API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV,
  });
}

// Configuración de la ruta
export const runtime = 'edge'; // Opcional: usar Edge Runtime
export const dynamic = 'force-dynamic'; // No cachear esta ruta