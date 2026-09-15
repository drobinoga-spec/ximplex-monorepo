'use client';

interface WizardFormixProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function WizardFormix({ onComplete, onSkip }: WizardFormixProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">
          {/* Logo + Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">¡Bienvenido a Formix!</h1>
              <p className="text-sm text-gray-400 mt-2">Vamos a configurar tu primer formulario en 2 minutos</p>
            </div>
          </div>

          {/* Wizard Steps */}
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-800">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500">
                  <span className="text-white font-semibold">1</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-100">Conecta WhatsApp</p>
                <p className="text-sm text-gray-400">Recibe leads automáticamente en WhatsApp</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-800">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500">
                  <span className="text-white font-semibold">2</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-100">Crea tu primer formulario</p>
                <p className="text-sm text-gray-400">Sin código, drag-and-drop fácil</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-800">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500">
                  <span className="text-white font-semibold">3</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-100">Comparte y recibe leads</p>
                <p className="text-sm text-gray-400">Copia el link y comparte donde quieras</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Empezar el Setup
            </button>
            <button
              onClick={onSkip}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 rounded-lg transition"
            >
              Saltar por ahora
            </button>
          </div>

          {/* Footer help */}
          <p className="text-xs text-gray-500 text-center">
            ¿Problemas? <a href="#" className="text-orange-400 hover:text-orange-300">Contacta soporte</a>
          </p>
        </div>
      </div>
    </div>
  );
}