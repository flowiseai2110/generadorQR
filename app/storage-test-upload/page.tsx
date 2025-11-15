export default function StorageTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🗄️ Test de Cloudflare R2
        </h1>

        <div className="space-y-6">
          {/* Test automático */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Test Automático</h2>
            <button
              onClick={async () => {
                const response = await fetch('/api/storage-test');
                const data = await response.json();
                alert(JSON.stringify(data, null, 2));
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Ejecutar Test GET
            </button>
          </div>

          {/* Upload manual */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Test de Upload</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const response = await fetch('/api/storage-test', {
                  method: 'POST',
                  body: formData,
                });
                
                const data = await response.json();
                alert(JSON.stringify(data, null, 2));
              }}
            >
              <input
                type="file"
                name="file"
                required
                className="w-full mb-3 p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Subir Archivo
              </button>
            </form>
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded">
            <p className="font-semibold mb-2">💡 Instrucciones:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Click en Ejecutar Test GET para subir un archivo de prueba
              </li>
              <li>O selecciona cualquier archivo y súbelo</li>
              <li>Verifica en Cloudflare R2 que el archivo se subió</li>
              <li>Intenta acceder a la URL retornada</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}