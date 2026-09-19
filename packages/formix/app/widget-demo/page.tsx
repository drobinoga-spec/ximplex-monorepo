'use client';

import FormWidget from '@/components/FormWidget';

export default function WidgetDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Widget Demo
          </h1>
          <p className="text-gray-600 text-lg">
            Aquí puedes ver cómo se ve tu formulario embebido.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Demo Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Vista Previa del Widget
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              {/* Replace 'form-id-here' with an actual form ID for testing */}
              <FormWidget formId="form-id-here" apiUrl="http://localhost:3001" />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Cómo Usar
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">1. Importar</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`import FormWidget from '@/components/FormWidget';`}
                </pre>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">2. Usar</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<FormWidget
  formId="your-form-id"
  apiUrl="http://localhost:3001"
/>`}
                </pre>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">Props</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    <strong>formId:</strong> ID del formulario (obligatorio)
                  </li>
                  <li>
                    <strong>apiUrl:</strong> URL de tu servidor (default:
                    localhost:3001)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
