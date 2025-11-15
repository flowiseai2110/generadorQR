-- =====================================================
-- TABLA: clients
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para clients
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

-- =====================================================
-- TABLA: qr_codes
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Identificación
  slug VARCHAR(100) UNIQUE NOT NULL,
  
  -- Tipo de contenido
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('audio', 'video')),
  
  -- URLs de archivos
  content_url TEXT NOT NULL,
  qr_image_url TEXT NOT NULL,
  qr_svg_url TEXT NOT NULL,
  
  -- Metadatos del evento
  event_type VARCHAR(50) NOT NULL,
  event_date DATE,
  event_name VARCHAR(255),
  
  -- Personalización
  template_id VARCHAR(50),
  qr_color VARCHAR(7),
  page_color VARCHAR(7),
  logo_url TEXT,
  
  -- Paquete y precio
  package_type VARCHAR(20) CHECK (package_type IN ('basic', 'premium', 'deluxe')),
  price DECIMAL(10,2),
  
  -- Estado
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Tracking
  email_sent_at TIMESTAMP WITH TIME ZONE,
  total_scans INTEGER DEFAULT 0,
  last_scan_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para qr_codes
CREATE INDEX idx_qr_codes_slug ON qr_codes(slug);
CREATE INDEX idx_qr_codes_client_id ON qr_codes(client_id);
CREATE INDEX idx_qr_codes_status ON qr_codes(status);
CREATE INDEX idx_qr_codes_event_date ON qr_codes(event_date);
CREATE INDEX idx_qr_codes_created_at ON qr_codes(created_at DESC);

-- =====================================================
-- TABLA: analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE,
  
  -- Evento
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('scan', 'play', 'pause', 'complete')),
  
  -- Información del usuario
  ip_address VARCHAR(45),
  country VARCHAR(2),
  city VARCHAR(100),
  
  -- Información del dispositivo
  user_agent TEXT,
  device_type VARCHAR(20),
  os VARCHAR(50),
  browser VARCHAR(50),
  
  -- Metadata adicional
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para analytics
CREATE INDEX idx_analytics_qr_id ON analytics(qr_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX idx_analytics_qr_created ON analytics(qr_id, created_at DESC);

-- =====================================================
-- TABLA: templates
-- =====================================================
CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  event_type VARCHAR(50),
  
  -- Configuración del template
  config JSONB NOT NULL,
  
  preview_url TEXT,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: email_logs
-- =====================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE,
  
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  status VARCHAR(20) CHECK (status IN ('sent', 'failed', 'bounced')),
  
  provider_id VARCHAR(255),
  error_message TEXT,
  
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para email_logs
CREATE INDEX idx_email_logs_qr_id ON email_logs(qr_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);

-- =====================================================
-- TABLA: settings
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FUNCIONES: Actualizar updated_at automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES: Templates por defecto
-- =====================================================
INSERT INTO templates (id, name, description, event_type, config) VALUES
('wedding-romantic', 'Boda Romántica', 'Template elegante para bodas', 'wedding', '{"duration": 60, "transition": "fade", "music": "romantic"}'),
('birthday-celebration', 'Cumpleaños Celebración', 'Template festivo para cumpleaños', 'birthday', '{"duration": 45, "transition": "slide", "music": "upbeat"}'),
('quinceanera-elegant', 'Quinceañera Elegante', 'Template especial para quinceañeras', 'quinceanera', '{"duration": 60, "transition": "zoom", "music": "elegant"}'),
('babyshower-sweet', 'Baby Shower Tierno', 'Template dulce para baby showers', 'babyshower', '{"duration": 45, "transition": "fade", "music": "soft"}'),
('anniversary-classic', 'Aniversario Clásico', 'Template clásico para aniversarios', 'anniversary', '{"duration": 60, "transition": "slide", "music": "classic"}')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para incrementar contador de escaneos
CREATE OR REPLACE FUNCTION increment_scan_count(qr_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE qr_codes 
  SET 
    total_scans = total_scans + 1,
    last_scan_at = NOW()
  WHERE id = qr_uuid;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de un QR
CREATE OR REPLACE FUNCTION get_qr_stats(qr_uuid UUID)
RETURNS TABLE (
  total_scans BIGINT,
  scans_today BIGINT,
  scans_this_week BIGINT,
  unique_devices BIGINT,
  top_country VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_scans,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::BIGINT as scans_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::BIGINT as scans_this_week,
    COUNT(DISTINCT ip_address)::BIGINT as unique_devices,
    MODE() WITHIN GROUP (ORDER BY country) as top_country
  FROM analytics
  WHERE qr_id = qr_uuid;
END;
$$ LANGUAGE plpgsql;