import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from './r2-client';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

// ✅ Expandir tipos para permitir paths dinámicos
type FolderType = 'audio' | 'video' | 'qr-codes' | 'logos' | 'temp';

interface UploadOptions {
  folder: FolderType | `qr-codes/${string}` | `audio/${string}` | `video/${string}`; // ✅ Permite subfolders
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
  const url = R2_PUBLIC_URL
    ? `${R2_PUBLIC_URL}/${key}`
    : await getSignedUrl(
        r2Client,
        new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        }),
        { expiresIn: 604800 } // 7 días
      );

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
  expiresIn: number = 3600
): Promise<string> {
  // Validar que expiresIn no exceda 7 días (604800 segundos)
  const maxExpiration = 604800;
  const validExpiresIn = Math.min(expiresIn, maxExpiration);

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: validExpiresIn });
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
    'audio/ogg': '.ogg',
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
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    m4a: 'audio/mp4',
    ogg: 'audio/ogg',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    pdf: 'application/pdf',
  };

  return types[ext || ''] || 'application/octet-stream';
}