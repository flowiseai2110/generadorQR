import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from './r2-client';
import { randomUUID } from 'crypto';

export interface UploadOptions {
  folder: 'audio' | 'video' | 'qr-codes' | 'logos' | 'temp';
  filename?: string;
  contentType: string;
}

/**
 * Sube un archivo a R2
 */
export async function uploadToR2(
  buffer: Buffer,
  options: UploadOptions
): Promise<{ url: string; key: string; size: number }> {
  const { folder, filename, contentType } = options;

  // Generar nombre único si no se proporciona
  const fileExtension = getFileExtension(contentType);
  const uniqueFilename = filename || `${randomUUID()}${fileExtension}`;
  const key = `${folder}/${uniqueFilename}`;

  // Comando para subir
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Generar URL pública o firmada
  // ✅ CAMBIO: Máximo 7 días (604800 segundos) en lugar de 1 año
  const url = R2_PUBLIC_URL
    ? `${R2_PUBLIC_URL}/${key}`
    : await getSignedUrl(r2Client, new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      }), { expiresIn: 604800 }); // 7 días (máximo permitido por R2)

  return {
    url,
    key,
    size: buffer.length,
  };
}

/**
 * Obtener URL firmada para un archivo privado
 */
export async function getSignedFileUrl(
  key: string,
  expiresIn: number = 3600 // Por defecto 1 hora
): Promise<string> {
  // ✅ VALIDACIÓN: No permitir más de 7 días
  if (expiresIn > 604800) {
    throw new Error('R2 signed URLs cannot expire more than 7 days (604800 seconds) in the future');
  }

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Helper: Obtener extensión de archivo desde content type
 */
function getFileExtension(contentType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/mp4': '.m4a',
    'video/mp4': '.mp4',
    'video/quicktime': '.mov',
    'application/pdf': '.pdf',
  };

  return extensions[contentType] || '';
}

/**
 * Helper: Detectar content type desde extensión
 */
export function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  
  const types: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'm4a': 'audio/mp4',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'pdf': 'application/pdf',
  };

  return types[ext || ''] || 'application/octet-stream';
}