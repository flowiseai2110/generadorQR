export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface QRCode {
  id: string;
  client_id: string;
  slug: string;
  content_type: 'audio' | 'video';
  content_url: string;
  qr_image_url: string;
  event_type: string;
  package_type: 'basic' | 'premium' | 'deluxe';
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}