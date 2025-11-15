'use client';
 
import { UploadAudioResponse } from '@/types/upload';
import { useState } from 'react';

export default function TestAudioUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadAudioResponse| null>(null);
  const [error, setError] = useState<string>('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/audio', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('ID copiado!');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🎵 Test Upload de Audio
        </h1>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona archivo de audio
            </label>
            <input
              type="file"
              accept="audio/mpeg,audio/wav,audio/mp4,audio/ogg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              disabled={uploading}
            />
            <p className="text-sm text-gray-500 mt-2">
              Formatos: MP3, WAV, M4A, OGG | Máx: 10MB | Máx duración: 60s
            </p>
          </div>

          {file && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Archivo:</strong> {file.name}
              </p>
              <p className="text-sm text-blue-900">
                <strong>Tamaño:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-sm text-blue-900">
                <strong>Tipo:</strong> {file.type}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {uploading ? 'Procesando y subiendo...' : 'Subir Audio'}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">❌ Error:</p>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium mb-3">✅ Audio subido exitosamente!</p>
            
            {/* QR ID - LO MÁS IMPORTANTE */}
            <div className="mb-4 p-4 bg-white border-2 border-green-500 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                QR ID (copia esto):
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                  {result.qr_id}
                </code>
                <button
                  onClick={() => copyToClipboard(result.qr_id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
              
                <a href={`/test-qr-generate?id=${result.qr_id}`}
                className="mt-3 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Generar QR ahora →
              </a>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Filename:</strong> {result.filename}</p>
              <p><strong>Tamaño:</strong> {(result.size / 1024).toFixed(2)} KB</p>
              <p><strong>Duración:</strong> {result.duration.toFixed(2)}s</p>
              <p><strong>Formato:</strong> {result.format}</p>
              <p><strong>Bitrate:</strong> {(result.bitrate / 1000).toFixed(0)} kbps</p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Reproducir:</p>
              <audio controls src={result.url} className="w-full">
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">URL:</p>
              <input
                type="text"
                value={result.url}
                readOnly
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-xs"
              />
            </div>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-600 bg-blue-50 p-4 rounded">
          <p className="font-semibold mb-2">💡 Proceso automático:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Validación de formato y tamaño</li>
            <li>Conversión a MP3 (si es necesario)</li>
            <li>Normalización de audio</li>
            <li>Optimización a 128kbps mono</li>
            <li>Upload a Cloudflare R2</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
 
 