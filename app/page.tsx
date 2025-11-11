export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          QR Audio/Video System
        </h1>
        <p className="text-xl text-gray-600">
          Sistema de QR con Audio/Video para Eventos
        </p>
        <div className="mt-8"> 
          <a 
            href="/dashboard"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Ir al Panel Admin
          </a>
        </div>
      </div>
    </main>
  );
}