import ffmpeg from 'fluent-ffmpeg';
import { parseBuffer } from 'music-metadata';
import { randomUUID } from 'crypto';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';
import path from 'path';

export interface AudioMetadata {
  duration: number;
  format: string;
  bitrate: number;
  sampleRate: number;
  channels: number;
  size: number;
}

export interface ProcessedAudio {
  buffer: Buffer;
  metadata: AudioMetadata;
  originalFormat: string;
  uuid: string;
}

/**
 * Obtener metadata de un archivo de audio
 * Maneja casos donde music-metadata falla
 */
export async function getAudioMetadata(buffer: Buffer): Promise<Partial<AudioMetadata>> {
  try {
    const metadata = await parseBuffer(buffer);

    return {
      duration: metadata.format.duration || 0,
      format: metadata.format.container || 'unknown',
      bitrate: metadata.format.bitrate || 0,
      sampleRate: metadata.format.sampleRate || 0,
      channels: metadata.format.numberOfChannels || 0,
      size: buffer.length,
    };
  } catch (error) {
    // Si music-metadata falla (común con algunos MP4 de WhatsApp),
    // intentamos con FFmpeg
    console.warn('music-metadata failed, will use FFmpeg for metadata:', error);
    return {
      format: 'unknown',
      size: buffer.length,
      duration: 0,
      bitrate: 0,
      sampleRate: 0,
      channels: 0,
    };
  }
}

/**
 * Obtener duración del audio usando FFmpeg (más robusto)
 */
export async function getAudioDurationWithFFmpeg(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const duration = metadata.format.duration || 0;
      resolve(duration);
    });
  });
}

/**
 * Procesar audio: convertir a MP3, normalizar, optimizar
 * Optimizado para audios de WhatsApp y otros formatos
 */
export async function processAudio(
  inputBuffer: Buffer,
  options: {
    maxDuration?: number; // segundos
    targetBitrate?: number; // kbps
    targetChannels?: number; // 1=mono, 2=stereo
    normalize?: boolean; // aplicar normalización de volumen
  } = {}
): Promise<ProcessedAudio> {
  const {
    maxDuration = 60,
    targetBitrate = 128,
    targetChannels = 1,
    normalize = true,
  } = options;

  const uuid = randomUUID();
  
  // Crear archivos temporales (sin extensión específica en input para dejar que FFmpeg detecte)
  const tempInputPath = `/tmp/input-${uuid}`;
  const tempOutputPath = `/tmp/output-${uuid}.mp3`;

  // Escribir buffer a archivo temporal
  writeFileSync(tempInputPath, inputBuffer);

  try {
    // Obtener duración real con FFmpeg antes de procesar
    let duration = 0;
    try {
      duration = await getAudioDurationWithFFmpeg(tempInputPath);
      console.log(`Audio duration detected: ${duration.toFixed(2)}s`);
    } catch (error) {
      console.warn('Could not get duration with ffprobe:', error);
      // Continuamos el procesamiento de todas formas
    }

    // Validar duración solo si pudimos obtenerla
    if (duration > 0 && duration > maxDuration) {
      // Limpiar archivos temporales
      unlinkSync(tempInputPath);
      
      throw new Error(
        `Audio duration (${duration.toFixed(1)}s) exceeds maximum (${maxDuration}s)`
      );
    }

    // Obtener metadata original (intento con music-metadata)
    const originalMetadata = await getAudioMetadata(inputBuffer);

    // Procesar con FFmpeg
    await new Promise<void>((resolve, reject) => {
      let command = ffmpeg(tempInputPath)
        // Formato de salida
        .toFormat('mp3')
        // Codec de audio explícito
        .audioCodec('libmp3lame')
        // Configuración de calidad
        .audioBitrate(targetBitrate)
        .audioChannels(targetChannels)
        .audioFrequency(44100); // Sample rate estándar

      // Aplicar normalización si está habilitada
      if (normalize) {
        command = command.audioFilters([
          'loudnorm=I=-16:TP=-1.5:LRA=11' // Normalización EBU R128
        ]);
      }

      command
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`Processing: ${progress.percent.toFixed(1)}%`);
          }
        })
        .on('end', () => {
          console.log('FFmpeg processing completed');
          resolve();
        })
        .on('error', (err, stdout, stderr) => {
          console.error('FFmpeg error:', err);
          console.error('FFmpeg stderr:', stderr);
          reject(new Error(`FFmpeg processing failed: ${err.message}`));
        })
        .save(tempOutputPath);
    });

    // Verificar que el archivo de salida existe
    if (!existsSync(tempOutputPath)) {
      throw new Error('Output file was not created');
    }

    // Leer archivo procesado
    const processedBuffer = readFileSync(tempOutputPath);

    if (processedBuffer.length === 0) {
      throw new Error('Output file is empty');
    }

    // Obtener metadata del audio procesado
    const processedMetadata = await getAudioMetadata(processedBuffer);

    // Si no obtuvimos la duración antes, intentamos obtenerla del archivo procesado
    if (duration === 0 && processedMetadata.duration) {
      duration = processedMetadata.duration;
    }

    // Limpiar archivos temporales
    unlinkSync(tempInputPath);
    unlinkSync(tempOutputPath);

    console.log('Audio processing successful:', {
      originalSize: inputBuffer.length,
      processedSize: processedBuffer.length,
      duration: duration.toFixed(2),
      compression: ((1 - processedBuffer.length / inputBuffer.length) * 100).toFixed(1) + '%'
    });

    return {
      buffer: processedBuffer,
      metadata: {
        duration,
        format: 'mp3',
        bitrate: targetBitrate * 1000, // convertir a bps
        sampleRate: 44100,
        channels: targetChannels,
        size: processedBuffer.length,
      },
      originalFormat: originalMetadata.format || 'unknown',
      uuid,
    };
  } catch (error) {
    // Limpiar archivos en caso de error
    try {
      if (existsSync(tempInputPath)) unlinkSync(tempInputPath);
      if (existsSync(tempOutputPath)) unlinkSync(tempOutputPath);
    } catch (cleanupError) {
      console.error('Error cleaning up temp files:', cleanupError);
    }

    throw error;
  }
}

/**
 * Validar que el archivo sea un audio válido
 * Incluye soporte para audios de WhatsApp (MP4/M4A)
 */
export function validateAudioFile(file: File): void {
  const allowedTypes = [
    // MP3
    'audio/mpeg',
    'audio/mp3',
    // WAV
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    // M4A / MP4 (WhatsApp y otros)
    'audio/mp4',
    'audio/x-m4a',
    'audio/m4a',
    'video/mp4', // WhatsApp a veces usa este MIME type
    // OGG
    'audio/ogg',
    'audio/vorbis',
    // WEBM
    'audio/webm',
    // AAC
    'audio/aac',
    'audio/x-aac',
  ];

  // Validar extensión del archivo
  const fileName = file.name.toLowerCase();
  const allowedExtensions = ['.mp3', '.wav', '.m4a', '.mp4', '.ogg', '.webm', '.aac'];
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

  // Validar MIME type O extensión (WhatsApp puede tener MIME type inconsistente)
  const hasValidMimeType = allowedTypes.includes(file.type);

  if (!hasValidMimeType && !hasValidExtension) {
    throw new Error(
      `Invalid audio format: ${file.type} (${fileName}). Allowed: MP3, WAV, M4A, MP4, OGG, AAC`
    );
  }

  // Validar tamaño
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error(
      `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum (10MB)`
    );
  }

  // Validar que el archivo no esté vacío
  if (file.size === 0) {
    throw new Error('File is empty');
  }

  console.log('Audio file validation passed:', {
    name: file.name,
    type: file.type,
    size: `${(file.size / 1024).toFixed(2)}KB`,
  });
}

/**
 * Convertir File a Buffer (para uso en Node.js)
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}