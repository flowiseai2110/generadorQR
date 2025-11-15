# Supabase Database Setup

## Configuración Inicial

1. Crear proyecto en https://supabase.com
2. Copiar credenciales a `.env.local`
3. Ejecutar `supabase/schema.sql` en SQL Editor

## Estructura de Tablas

- **clients**: Información de clientes
- **qr_codes**: QRs generados con su configuración
- **analytics**: Eventos de escaneo y reproducción
- **templates**: Plantillas predefinidas para videos
- **email_logs**: Registro de emails enviados
- **settings**: Configuración general del sistema

## Funciones Útiles

### Incrementar contador de escaneos
```sql
SELECT increment_scan_count('qr-uuid-aqui');
```

### Obtener estadísticas de un QR
```sql
SELECT * FROM get_qr_stats('qr-uuid-aqui');
```

## Conexión

### Desde el navegador (público)
```typescript
import { supabase } from '@/lib/db/supabase-client';
```

### Desde el servidor (admin)
```typescript
import { supabaseAdmin } from '@/lib/db/supabase-admin';
```

## Variables de Entorno
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... # ⚠️ MANTENER SECRETO
```