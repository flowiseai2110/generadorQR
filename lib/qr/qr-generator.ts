import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

interface QRGeneratorOptions {
  url: string;
  size?: number;
  logo?: string;
}

interface QRFiles {
  png: Buffer;
  svg: string;
  pdf: Buffer;
}

/**
 * Genera QR en múltiples formatos
 */
export async function generateQRCode(
  options: QRGeneratorOptions
): Promise<QRFiles> {
  const { url, size = 512, logo } = options;

  // Configuración del QR
  const qrOptions = {
    errorCorrectionLevel: 'H' as const,
    type: 'png' as const,
    quality: 1,
    margin: 2,
    width: size,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };

  // 1. Generar PNG
  const pngBuffer = await QRCode.toBuffer(url, qrOptions);

  // 2. Generar SVG
  const svgString = await QRCode.toString(url, {
    ...qrOptions,
    type: 'svg',
  });

  // 3. Generar PDF
  const pdfBuffer = await generateQRPDF(url, size);

  return {
    png: pngBuffer,
    svg: svgString,
    pdf: pdfBuffer,
  };
}

/**
 * Genera QR en formato PDF listo para imprimir
 */
async function generateQRPDF(url: string, size: number): Promise<Buffer> {
  // Generar QR como data URL
  const qrDataURL = await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    width: 512,
    margin: 2,
  });

  // Crear PDF A4
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Centrar QR en la página
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const qrSize = 150; // mm
  const x = (pageWidth - qrSize) / 2;
  const y = (pageHeight - qrSize) / 2;

  // Agregar QR
  pdf.addImage(qrDataURL, 'PNG', x, y, qrSize, qrSize);

  // Agregar texto debajo
  pdf.setFontSize(12);
  pdf.text('Escanea este código QR', pageWidth / 2, y + qrSize + 10, {
    align: 'center',
  });

  // Convertir a Buffer
  const pdfOutput = pdf.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

/**
 * Genera código corto único para la URL pública
 */
export function generateShortCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}