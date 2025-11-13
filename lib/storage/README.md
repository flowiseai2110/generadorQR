# Cloudflare R2 Storage

## Estructura de Carpetas
```
qr-audio-prod/
├── audio/           # Archivos de audio (MP3)
│   └── {uuid}.mp3
├── video/           # Archivos de video (MP4)
│   └── {uuid}.mp4
├── qr-codes/        # Códigos QR generados
│   ├── {uuid}.png
│   └── {uuid}.svg
├── logos/           # Logos de clientes
│   └── {client-id}_logo.png
└── temp/            # Archivos temporales (se limpian periódicamente)
    └── {uuid}_{filename}
```

## Uso

### Subir archivo
```typescript
import { uploadToR2 } from '@/lib/storage/upload-helpers';

const result = await uploadToR2(buffer, {
  folder: 'audio',
  filename: 'my-audio.mp3',
  contentType: 'audio/mpeg',
});

console.log(result.url); // URL pública o firmada
```

### Obtener URL firmada
```typescript
import { getSignedFileUrl } from '@/lib/storage/upload-helpers';

const url = await getSignedFileUrl('audio/my-audio.mp3', 3600); // expira en 1 hora
```

## Límites del Tier Gratuito

- ✅ 10 GB de almacenamiento
- ✅ 1M operaciones Clase A (writes) / mes
- ✅ 10M operaciones Clase B (reads) / mes
- ✅ Sin cargo por transferencia de datos (egress)

## Variables de Entorno
```bash
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=qr-audio-prod
R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://cdn.yourdomain.com # Opcional
```