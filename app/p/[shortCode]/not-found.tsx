export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-block p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
            <svg
              className="w-20 h-20 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          QR no encontrado
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          El código QR que buscas no existe o ha sido eliminado.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-4">
            Posibles razones:
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>El código QR aún no ha sido publicado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>El enlace es incorrecto</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>El contenido ha sido eliminado</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 