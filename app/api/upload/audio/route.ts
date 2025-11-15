import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/middleware/error-handler';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { uploadToR2 } from '@/lib/storage/upload-helpers';
import { processAudio, validateAudioFile } from '@/lib/audio/process-audio';
import type { UploadAudioResponse } from '@/types/upload';
import { supabaseAdmin } from '@/lib/db/supabase-admin';

export const runtime = 'nodejs'; // Necesario para FFmpeg
// ✅ Función para generar slug único
function generateSlug(eventName: string = 'evento'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const cleanName = eventName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30);
  
  return `${cleanName}-${timestamp}${random}`;
}

export const POST = withErrorHandler(async (request: NextRequest) => {
  try {
    // Obtener archivo del FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse('No file provided', 'NO_FILE', 400);
    }

    // Validar archivo
    validateAudioFile(file);

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Processing audio file:', file.name);

    // Procesar audio (convertir, normalizar, optimizar)
    const processed = await processAudio(buffer, {
      maxDuration: 60,
      targetBitrate: 128,
      targetChannels: 1,
    });

    console.log('Audio processed successfully');

    // Subir a R2
    const uploadResult = await uploadToR2(processed.buffer, {
      folder: 'audio',
      contentType: 'audio/mpeg',
    });
  // ✅ Generar slug único
  const eventName = 'Evento Test';
  const slug = generateSlug(eventName);
      // ✅ NUEVO: Guardar en Supabase
  const { data: qrData, error: dbError } = await supabaseAdmin
    .from('qr_codes')
    .insert({
      slug: slug, // ✅ AGREGAR ESTO
      client_name: 'Cliente Test', // Temporal para testing
      client_email: 'flowiseai2110@gmail.com', // Temporal para testing
      event_name: eventName, // Temporal para testing
      event_date: new Date().toISOString(),
      content_url: uploadResult.url, // ✅ Este es el principal
      event_type: 'test',
      content_type: 'audio',
      audio_url: uploadResult.url,
      status: 'draft',
    })
    .select()
    .single();

  if (dbError) {
    throw new Error(`Failed to save to database: ${dbError.message}`);
  }

    console.log('Audio uploaded to R2:', uploadResult.key);

    // Preparar respuesta
    const response: UploadAudioResponse = {
      qr_id: qrData.id, // ✅ ESTE ES EL ID QUE NECESITAS
      slug: qrData.slug, // ✅ Incluir slug en respuesta
      url: uploadResult.url,
      filename: uploadResult.key.split('/').pop() || '',
      size: uploadResult.size,
      duration: processed.metadata.duration,
      format: processed.metadata.format,
      bitrate: processed.metadata.bitrate,
      key: uploadResult.key,
      message: 'Audio uploaded and QR created successfully',
    };

    return successResponse(response, 'Audio uploaded successfully');

  } catch (error: unknown) {
    console.error('Upload audio error:', error);

    if (error instanceof Error) {
      return errorResponse(error.message, 'UPLOAD_ERROR', 400);
    }

    return errorResponse('Failed to upload audio', 'UNKNOWN_ERROR', 500);
  }
});

// Configuración de tamaño máximo del body
export const config = {
  api: {
    bodyParser: false, // Deshabilitamos el parser por defecto
  },
};