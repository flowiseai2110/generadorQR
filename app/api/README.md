# API Documentation

Base URL: `http://localhost:3000/api`

## Endpoints Disponibles

### Health Check
- **GET** `/api/health`
- **Descripción**: Verificar estado de la API
- **Auth**: No requerida
- **Response**:
```json
{
  "status": "ok",
  "message": "QR Audio/Video API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Test Endpoint
- **GET** `/api/test` - Público
- **POST** `/api/test` - Protegido (requiere auth)
- **Headers** (POST):
```
Authorization: Bearer dev-token-12345
Content-Type: application/json
```

## Estructura de Respuestas

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": { ... }
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error