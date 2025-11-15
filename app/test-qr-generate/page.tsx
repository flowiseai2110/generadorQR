'use client';

import { useState } from 'react';

interface QRGenerateResponse {
  success: boolean;
  data: {
    qr_id: string;
    files: {
      png: string;
      svg: string;
      pdf: string;
    };
    public_url: string;
    short_code: string;
  };
  error?: string;
}

export default function TestQRGeneratePage() {
  const [qrId, setQrId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QRGenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!qrId.trim()) {
      setError('Por favor ingresa un QR ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qr_id: qrId.trim(),
          size: 512,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar QR');
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
            Test: Generar QR
          </h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR ID (UUID del audio subido)
            </label>
            <input
              type="text"
              value={qrId}
              onChange={(e) => setQrId(e.target.value)}
              placeholder="Ej: 123e4567-e89b-12d3-a456-426614174000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500">
              Usa el ID que obtuviste al subir un audio
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generando...' : 'Generar QR Codes'}
          </button>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-medium mb-2">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && result.success && (
            <div>
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-green-800 font-bold text-xl mb-4">
                QR Generado Exitosamente
              </h3>

              <div className="mb-4 p-4 bg-white rounded border">
                <p className="text-sm text-gray-600 mb-1">Short Code:</p>
                <p className="text-2xl font-mono font-bold text-blue-600">
                  {result.data.short_code}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">URL Pública:</p>
                
                  <a href={result.data.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {result.data.public_url}
                </a>
              </div>

              <div className="space-y-3">
                <p className="font-medium text-gray-700">Archivos generados:</p>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">QR.png</span>
                  </div>
                  
                   </div>
                   
                   <a href={result.data.files.png}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Ver
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">QR.svg</span>
                  </div>
                  
                   <a href={result.data.files.svg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Ver
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">QR.pdf</span>
                  </div>
                  
                  <a  href={result.data.files.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Ver
                  </a>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">Preview del QR:</p>
                <img
                  src={result.data.files.png}
                  alt="QR Code"
                  className="mx-auto border-4 border-gray-200 rounded-lg shadow-lg max-w-xs"
                />
              </div>
            </div>
            
          )}

          {result && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                Ver JSON
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