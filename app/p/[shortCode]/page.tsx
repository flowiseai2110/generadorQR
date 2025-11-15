import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/admin';
import AudioPlayer from '@/components/AudioPlayer';

interface PageProps {
  params: Promise<{  // ✅ Cambiar tipo a Promise
    shortCode: string;
  }>;
}

// Función para obtener datos del QR
async function getQRData(shortCode: string) {
    console.log('🔍 Buscando QR con short_code:', shortCode);

  const { data, error } = await supabaseAdmin
    .from('qr_codes')
    .select('*')
    .eq('short_code', shortCode)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// Función para registrar escaneo (analytics)
// async function registerScan(qrId: string) {
//   try {
//     const { error } = await supabaseAdmin
//       .from('qr_codes')
//       .update({
//         total_scans: supabaseAdmin.raw('total_scans + 1'),
//         last_scan_at: new Date().toISOString(),
//       })
//       .eq('id', qrId);

//     if (error) {
//       console.error('Error registering scan:', error);
//     }
//   } catch (err) {
//     console.error('Error registering scan:', err);
//   }
// }

export default async function PublicQRPage({ params }: PageProps) {
  const { shortCode } = await params;  // ✅ Await params

  // Obtener datos del QR
  console.log("shortCode--->",shortCode);
  const qrData = await getQRData(shortCode);

  if (!qrData) {
    notFound();
  }

  // Registrar escaneo (no bloqueante)
//   registerScan(qrData.id).catch(console.error);

  // Formatear fecha del evento
  const eventDate = qrData.event_date
    ? new Date(qrData.event_date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {qrData.event_name || 'Evento Especial'}
          </h1>
          {eventDate && (
            <p className="text-lg text-gray-600">{eventDate}</p>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Header */}
          <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>

          {/* Content */}
          <div className="p-8">
            {/* Client Info */}
            {qrData.client_name && (
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-500 mb-1">De parte de</p>
                <p className="text-xl font-semibold text-gray-900">
                  {qrData.client_name}
                </p>
              </div>
            )}

            {/* Audio Player */}
            {qrData.audio_url && (
              <div className="mb-6">
                <AudioPlayer
                  audioUrl={qrData.audio_url}
                  eventName={qrData.event_name || 'Audio'}
                />
              </div>
            )}

            {/* Message */}
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
              <p className="text-gray-700 leading-relaxed">
                Gracias por escanear este código QR. Esperamos que disfrutes este
                mensaje especial.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Creado con QR Multimedia</span>
            </div>
          </div>
        </div>

        {/* Stats (opcional) */}
        {qrData.total_scans > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Este QR ha sido escaneado{' '}
              <span className="font-semibold text-purple-600">
                {qrData.total_scans}
              </span>{' '}
              {qrData.total_scans === 1 ? 'vez' : 'veces'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Metadata dinámica para SEO
export async function generateMetadata({ params }: PageProps) {
  const { shortCode } = params;
  const qrData = await getQRData(shortCode);

  if (!qrData) {
    return {
      title: 'QR no encontrado',
    };
  }

  return {
    title: `${qrData.event_name || 'Evento'} - QR Multimedia`,
    description: `Contenido multimedia para ${qrData.event_name || 'tu evento'}`,
  };
}