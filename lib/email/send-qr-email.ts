import { resend, EMAIL_FROM } from './resend-client';
import { generateQRPublishedEmail } from './templates/qr-published-template';

interface SendQREmailParams {
  to: string;
  clientName: string;
  eventName: string;
  eventDate: string;
  publicUrl: string;
  qrPngUrl: string;
  qrPdfUrl: string;
}

export async function sendQRPublishedEmail(params: SendQREmailParams) {
  const {
    to,
    clientName,
    eventName,
    eventDate,
    publicUrl,
    qrPngUrl,
    qrPdfUrl,
  } = params;

  // Generar HTML del email
  const htmlContent = generateQRPublishedEmail({
    clientName,
    eventName,
    eventDate,
    publicUrl,
    qrPngUrl,
    qrPdfUrl,
  });

  // Enviar email
  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [to],
    subject: `🎉 Tu código QR para ${eventName} está listo`,
    html: htmlContent,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return {
    emailId: data?.id,
    sentAt: new Date().toISOString(),
  };
}