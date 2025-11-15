'use client';

import { useState } from 'react';

interface PublishResponse {
  success: boolean;
  data: {
    qr_id: string;
    email_sent: boolean;
    recipient: string;
    sent_at: string;
    email_id: string;
    public_url: string;
  };
  error?: string;
}

export default function TestQRPublishPage() {
  const [qrId, setQrId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublishResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!qrId.trim()) {
      setError('Por favor ingresa un QR ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/qr/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qr_id: qrId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al publicar QR');
      }

      setResult(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Test: Publicar QR y Enviar Email
          </h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR ID (UUID del QR generado)
            </label>
            <input
              type="text"
              value={qrId}
              onChange={(e) => setQrId(e.target.value)}
              placeholder="Ej: 123e4567-e89b-12d3-a456-426614174000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500">
              Usa el QR ID que obtuviste al generar el QR
            </p>
          </div>

          <button
            onClick={handlePublish}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Publicando y enviando email...' : 'Publicar QR y Enviar Email'}
          </button>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-medium mb-2">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && result.success && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-green-800 font-bold text-xl mb-4">
                QR Publicado y Email Enviado
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded border">
                  <p className="text-sm text-gray-600">Destinatario:</p>
                  <p className="font-medium">{result.data.recipient}</p>
                </div>

                <div className="p-3 bg-white rounded border">
                  <p className="text-sm text-gray-600">Fecha de envío:</p>
                  <p className="font-medium">
                    {new Date(result.data.sent_at).toLocaleString()}
                  </p>
                </div>

                <div className="p-3 bg-white rounded border">
                  <p className="text-sm text-gray-600">Email ID:</p>
                  <p className="font-mono text-sm">{result.data.email_id}</p>
                </div>

                <div className="p-3 bg-white rounded border">
                  <p className="text-sm text-gray-600 mb-2">URL Pública:</p>
                  
                   <a href={result.data.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {result.data.public_url}
                  </a>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Próximo paso:</strong> Revisa el email en la bandeja de entrada del cliente.
                </p>
              </div>
            </div>
          )}

          {result && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                Ver JSON completo
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
} 