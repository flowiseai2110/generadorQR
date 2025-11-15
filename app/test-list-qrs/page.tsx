'use client';

import { useState, useEffect } from 'react';

interface QRCode {
  id: string;
  client_name: string;
  client_email: string;
  event_name: string;
  audio_url: string;
  status: string;
  created_at: string;
}

export default function TestListQRsPage() {
  const [qrs, setQrs] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQRs();
  }, []);

  const fetchQRs = async () => {
    try {
      const response = await fetch('/api/qr/list');
      const data = await response.json();
      if (data.success) {
        setQrs(data.data.qr_codes);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('ID copiado al portapapeles!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Lista de QRs Creados
          </h1>

          {qrs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay QRs creados aún</p>
              
               <a href="/test-audio-upload"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Subir un audio primero
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {qrs.map((qr) => (
                <div
                  key={qr.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {qr.client_name || 'Sin nombre'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {qr.event_name || 'Sin evento'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {qr.client_email}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        qr.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {qr.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">QR ID:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-blue-600 break-all">
                        {qr.id}
                      </code>
                      <button
                        onClick={() => copyToClipboard(qr.id)}
                        className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    
                     <a href={qr.audio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ver Audio
                    </a>
                    <span className="text-gray-300">|</span>
                    
                     <a href={`/test-qr-generate?id=${qr.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Generar QR
                    </a>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Creado: {new Date(qr.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}