// Response estándar de éxito
export interface APIResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

// Response estándar de error
export interface APIErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: unknown;
  };
}

// Tipos para upload
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// Tipos para QR
export interface QRGenerateRequest {
  client_name: string;
  client_email: string;
  event_type: string;
  event_date: string;
  content_url: string;
  content_type: 'audio' | 'video';
  package_type: 'basic' | 'premium' | 'deluxe';
  customization?: {
    qr_color?: string;
    logo_url?: string;
    page_color?: string;
  };
}

export interface QRGenerateResponse {
  qr_id: string;
  slug: string;
  qr_png_url: string;
  qr_svg_url: string;
  preview_url: string;
}