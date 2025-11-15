import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/middleware/error-handler';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendQRPublishedEmail } from '@/lib/email/send-qr-email';

interface PublishQRRequest {
  qr_id: string;
}

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body: PublishQRRequest = await request.json();
  const { qr_id } = body;

  if (!qr_id) {
    return errorResponse('qr_id is required', "400");
  }

  // Obtener datos del QR
  const { data: qrData, error: qrError } = await supabaseAdmin
    .from('qr_codes')
    .select('*')
    .eq('id', qr_id)
    .single();

  if (qrError || !qrData) {
    return errorResponse('QR code not found', "404");
  }

  // Validar que no esté publicado ya
  if (qrData.status === 'published') {
    return errorResponse('QR code is already published', "400");
  }

  // Validar que tenga los archivos QR generados
  if (!qrData.qr_code_url || !qrData.qr_code_pdf_url || !qrData.public_url) {
    return errorResponse(
      'QR code files not generated yet. Please generate QR first.',
      "400"
    );
  }

  // Validar que tenga email del cliente
  if (!qrData.client_email) {
    return errorResponse('Client email is missing', "400");
  }

  // Formatear fecha del evento
  const eventDate = qrData.event_date
    ? new Date(qrData.event_date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Fecha no especificada';

  // Enviar email
  try {
    const emailResult = await sendQRPublishedEmail({
      to: qrData.client_email,
      clientName: qrData.client_name || 'Cliente',
      eventName: qrData.event_name || 'Evento',
      eventDate: eventDate,
      publicUrl: qrData.public_url,
      qrPngUrl: qrData.qr_code_url,
      qrPdfUrl: qrData.qr_code_pdf_url,
    });

    // Actualizar status a published y registrar envío de email
    const { error: updateError } = await supabaseAdmin
      .from('qr_codes')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        email_sent_at: emailResult.sentAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', qr_id);

    if (updateError) {
      throw new Error(`Failed to update QR status: ${updateError.message}`);
    }

    return successResponse({
      qr_id,
      email_sent: true,
      recipient: qrData.client_email,
      sent_at: emailResult.sentAt,
      email_id: emailResult.emailId,
      public_url: qrData.public_url,
    });
  } catch (emailError: any) {
    // Si falla el email, no actualizar status
    throw new Error(`Failed to send email: ${emailError.message}`);
  }
});