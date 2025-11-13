import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/middleware/error-handler';
import { successResponse } from '@/lib/utils/api-response';
import { uploadToR2 } from '@/lib/storage/upload-helpers';

export const GET = withErrorHandler(async (request: NextRequest) => {
  // Crear un archivo de texto simple para probar
  const testContent = `
    Test file uploaded at: ${new Date().toISOString()}
    This is a test to verify R2 storage is working correctly.
  `;
  
  const buffer = Buffer.from(testContent, 'utf-8');

  // Subir a R2
  const result = await uploadToR2(buffer, {
    folder: 'temp',
    filename: 'test-file.txt',
    contentType: 'text/plain',
  });

  return successResponse({
    message: 'File uploaded successfully to R2!',
    file: result,
    instructions: 'You can access this file using the URL above',
  });
});

// POST - Subir archivo desde FormData
export const POST = withErrorHandler(async (request: NextRequest) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json(
      { error: 'No file provided' },
      { status: 400 }
    );
  }

  // Convertir File a Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Subir a R2
  const result = await uploadToR2(buffer, {
    folder: 'temp',
    filename: file.name,
    contentType: file.type,
  });

  return successResponse({
    message: 'File uploaded successfully!',
    file: result,
    originalName: file.name,
    size: file.size,
    type: file.type,
  });
});