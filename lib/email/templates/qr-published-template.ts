interface QREmailData {
  clientName: string;
  eventName: string;
  eventDate: string;
  publicUrl: string;
  qrPngUrl: string;
  qrPdfUrl: string;
}

export function generateQRPublishedEmail(data: QREmailData): string {
  const { clientName, eventName, eventDate, publicUrl, qrPngUrl, qrPdfUrl } = data;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu código QR está listo</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f4f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #18181b;
      margin-bottom: 20px;
    }
    .event-info {
      background-color: #f4f4f5;
      border-radius: 12px;
      padding: 20px;
      margin: 30px 0;
    }
    .event-info h2 {
      margin: 0 0 15px 0;
      color: #18181b;
      font-size: 20px;
    }
    .event-detail {
      color: #52525b;
      margin: 8px 0;
      font-size: 15px;
    }
    .qr-preview {
      text-align: center;
      margin: 30px 0;
    }
    .qr-preview img {
      max-width: 300px;
      border: 3px solid #667eea;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .downloads {
      background-color: #fafafa;
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
    }
    .downloads h3 {
      margin: 0 0 15px 0;
      color: #18181b;
      font-size: 18px;
    }
    .download-link {
      display: block;
      color: #667eea;
      text-decoration: none;
      margin: 10px 0;
      font-size: 15px;
    }
    .download-link:hover {
      text-decoration: underline;
    }
    .instructions {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    .instructions h3 {
      margin: 0 0 15px 0;
      color: #1e40af;
      font-size: 18px;
    }
    .instructions ol {
      margin: 0;
      padding-left: 20px;
      color: #1e40af;
    }
    .instructions li {
      margin: 8px 0;
      line-height: 1.6;
    }
    .footer {
      background-color: #18181b;
      color: #a1a1aa;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🎉 Tu código QR está listo</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Hola <strong>${clientName}</strong>,</p>
      
      <p style="color: #52525b; line-height: 1.6;">
        ¡Excelente noticia! Tu código QR personalizado para <strong>${eventName}</strong> está listo para usar.
      </p>

      <!-- Event Info -->
      <div class="event-info">
        <h2>📅 Detalles del evento</h2>
        <p class="event-detail"><strong>Evento:</strong> ${eventName}</p>
        <p class="event-detail"><strong>Fecha:</strong> ${eventDate}</p>
      </div>

      <!-- QR Preview -->
      <div class="qr-preview">
        <img src="${qrPngUrl}" alt="Código QR" />
      </div>

      <!-- View Button -->
      <div style="text-align: center;">
        <a href="${publicUrl}" class="button">
          Ver página pública →
        </a>
      </div>

      <!-- Download Links -->
      <div class="downloads">
        <h3>📥 Descargar archivos</h3>
        <a href="${qrPngUrl}" class="download-link">⬇️ Descargar QR en PNG (para web)</a>
        <a href="${qrPdfUrl}" class="download-link">⬇️ Descargar QR en PDF (para imprimir)</a>
      </div>

      <!-- Instructions -->
      <div class="instructions">
        <h3>💡 Cómo usar tu código QR</h3>
        <ol>
          <li>Descarga el archivo que prefieras (PNG o PDF)</li>
          <li>Imprime el QR o úsalo digitalmente</li>
          <li>Compártelo con tus invitados</li>
          <li>Ellos escanean el QR y acceden al contenido multimedia</li>
        </ol>
      </div>

      <p style="color: #71717a; font-size: 14px; margin-top: 30px;">
        Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© ${new Date().getFullYear()} QR Multimedia</p>
      <p>Este email fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}