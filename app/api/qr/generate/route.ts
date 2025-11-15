import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/middleware/error-handler';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
 
import { generateQRCode, generateShortCode } from '@/lib/qr/qr-generator';
import { uploadToR2 } from '@/lib/storage/upload-helpers';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';
 

interface GenerateQRRequest {
  qr_id: string;
  size?: number;
  logo?: string;
}

export const POST = withErrorHandler(
  async (request: NextRequest) => {
    const body: GenerateQRRequest = await request.json();
    const { qr_id, size = 512, logo } = body;

    // Validaciones
    if (!qr_id) {
      return errorResponse('qr_id is required', "400");
    }

    // Obtener datos del QR de la base de datos
    
    const { data: qrData, error: qrError } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', qr_id)
      .single();

    if (qrError || !qrData) {
      return errorResponse('QR code not found', "404");
    }

    // Generar short_code si no existe
    let shortCode = qrData.short_code;
    if (!shortCode) {
      shortCode = generateShortCode(8);
      
      // Verificar que sea único
      const { data: existing } = await supabase
        .from('qr_codes')
        .select('id')
        .eq('short_code', shortCode)
        .single();

      if (existing) {
        // Si existe, generar otro
        shortCode = generateShortCode(10);
      }
    }

    // URL pública de reproducción
    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${shortCode}`;

    // Generar QR en múltiples formatos
    const qrFiles = await generateQRCode({
      url: publicUrl,
      size,
      logo,
    });

    // Subir archivos a R2
    const folder = `qr-codes/${qr_id}` as const;

    const [pngUpload, svgUpload, pdfUpload] = await Promise.all([
      uploadToR2(qrFiles.png, {
        folder,
        filename: 'qr.png',
        contentType: 'image/png',
      }),
      uploadToR2(Buffer.from(qrFiles.svg), {
        folder,
        filename: 'qr.svg',
        contentType: 'image/svg+xml',
      }),
      uploadToR2(qrFiles.pdf, {
        folder,
        filename: 'qr.pdf',
        contentType: 'application/pdf',
      }),
    ]);

    // Actualizar registro en BD
    const { error: updateError } = await supabase
      .from('qr_codes')
      .update({
        short_code: shortCode,
        qr_image_url: pngUpload.url, // ✅ Campo obligatorio
        qr_svg_url: svgUpload.url,    // ✅ Campo obligatorio
        qr_code_url: pngUpload.url,
        qr_code_svg_url: svgUpload.url,
        qr_code_pdf_url: pdfUpload.url,
        public_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', qr_id);

    if (updateError) {
      throw new Error(`Failed to update QR code: ${updateError.message}`);
    }

    return successResponse({
      qr_id,
      files: {
        png: pngUpload.url,
        svg: svgUpload.url,
        pdf: pdfUpload.url,
      },
      public_url: publicUrl,
      short_code: shortCode,
    });
  }
);