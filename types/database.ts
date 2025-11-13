export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          updated_at?: string;
        };
      };
      qr_codes: {
        Row: {
          id: string;
          client_id: string | null;
          slug: string;
          content_type: 'audio' | 'video';
          content_url: string;
          qr_image_url: string;
          qr_svg_url: string;
          event_type: string;
          event_date: string | null;
          event_name: string | null;
          template_id: string | null;
          qr_color: string | null;
          page_color: string | null;
          logo_url: string | null;
          package_type: 'basic' | 'premium' | 'deluxe' | null;
          price: number | null;
          status: 'draft' | 'published' | 'archived';
          published_at: string | null;
          expires_at: string | null;
          email_sent_at: string | null;
          total_scans: number;
          last_scan_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          slug: string;
          content_type: 'audio' | 'video';
          content_url: string;
          qr_image_url: string;
          qr_svg_url: string;
          event_type: string;
          event_date?: string | null;
          event_name?: string | null;
          template_id?: string | null;
          qr_color?: string | null;
          page_color?: string | null;
          logo_url?: string | null;
          package_type?: 'basic' | 'premium' | 'deluxe' | null;
          price?: number | null;
          status?: 'draft' | 'published' | 'archived';
          published_at?: string | null;
          expires_at?: string | null;
          email_sent_at?: string | null;
          total_scans?: number;
          last_scan_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string | null;
          slug?: string;
          content_type?: 'audio' | 'video';
          content_url?: string;
          qr_image_url?: string;
          qr_svg_url?: string;
          event_type?: string;
          event_date?: string | null;
          event_name?: string | null;
          template_id?: string | null;
          qr_color?: string | null;
          page_color?: string | null;
          logo_url?: string | null;
          package_type?: 'basic' | 'premium' | 'deluxe' | null;
          price?: number | null;
          status?: 'draft' | 'published' | 'archived';
          published_at?: string | null;
          expires_at?: string | null;
          email_sent_at?: string | null;
          total_scans?: number;
          last_scan_at?: string | null;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          qr_id: string | null;
          event_type: 'scan' | 'play' | 'pause' | 'complete';
          ip_address: string | null;
          country: string | null;
          city: string | null;
          user_agent: string | null;
          device_type: string | null;
          os: string | null;
          browser: string | null;
          metadata: unknown | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          qr_id?: string | null;
          event_type: 'scan' | 'play' | 'pause' | 'complete';
          ip_address?: string | null;
          country?: string | null;
          city?: string | null;
          user_agent?: string | null;
          device_type?: string | null;
          os?: string | null;
          browser?: string | null;
          metadata?: unknown | null;
          created_at?: string;
        };
        Update: {
          qr_id?: string | null;
          event_type?: 'scan' | 'play' | 'pause' | 'complete';
          ip_address?: string | null;
          country?: string | null;
          city?: string | null;
          user_agent?: string | null;
          device_type?: string | null;
          os?: string | null;
          browser?: string | null;
          metadata?: unknown | null;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          event_type: string | null;
          config: unknown;
          preview_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          event_type?: string | null;
          config: unknown;
          preview_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          event_type?: string | null;
          config?: unknown;
          preview_url?: string | null;
          is_active?: boolean;
        };
      };
      email_logs: {
        Row: {
          id: string;
          qr_id: string | null;
          recipient_email: string;
          subject: string | null;
          status: 'sent' | 'failed' | 'bounced' | null;
          provider_id: string | null;
          error_message: string | null;
          sent_at: string;
        };
        Insert: {
          id?: string;
          qr_id?: string | null;
          recipient_email: string;
          subject?: string | null;
          status?: 'sent' | 'failed' | 'bounced' | null;
          provider_id?: string | null;
          error_message?: string | null;
          sent_at?: string;
        };
        Update: {
          qr_id?: string | null;
          recipient_email?: string;
          subject?: string | null;
          status?: 'sent' | 'failed' | 'bounced' | null;
          provider_id?: string | null;
          error_message?: string | null;
        };
      };
      settings: {
        Row: {
          key: string;
          value: unknown;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: unknown;
          updated_at?: string;
        };
        Update: {
          value?: unknown;
          updated_at?: string;
        };
      };
    };
  };
}