'use client';

interface Message {
  nombre: string;
  msg: string;
  hora: string;
  telefono?: string;
}

interface ClienteSidebarProps {
  messages: Message[];
  bundleApp?: string;
  bundlePrice?: number;
  bundleNormalPrice?: number;
  bundleDiscount?: string;
  onAddBundle?: () => void;
  onViewAllMessages?: () => void;
  onRepeatWizard?: () => void;
}

export default function ClienteSidebar({
  messages,
  bundleApp = 'Recoupli',
  bundlePrice = 12,
  bundleNormalPrice = 19,
  bundleDiscount = '-37%',
  onAddBundle,
  onViewAllMessages,
  onRepeatWizard,
}: ClienteSidebarProps) {
  return (
    <div className="w-64 border-l border-gray-800 bg-gray-900/50 flex flex-col">
      {/* Últimos Mensajes Section */}
      <div className="flex-1 border-b border-gray-800 p-6 overflow-y-auto max-h-96">
        <p className="text-xs font-semibold text-gray-400 mb-4 uppercase">📨 Últimos Mensajes</p>
        <div className="space-y-3">
          {messages.slice(0, 4).map((msg, idx) => (
            <div key={idx} className="text-xs p-3 bg-gray-800/50 rounded hover:bg-gray-800 cursor-pointer transition">
              <p className="font-medium text-gray-200 truncate">{msg.nombre}</p>
              <p className="text-gray-400 truncate text-xs">{msg.msg}</p>
              <p className="text-gray-500 text-xs mt-1">{msg.hora}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onViewAllMessages}
          className="w-full mt-4 text-xs py-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition"
        >
          Ver todos →
        </button>
      </div>

      {/* Bundle Advertising */}
      <div className="p-6 space-y-4">
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-800/50 rounded-lg p-4">
          <p className="text-xs font-semibold text-purple-300 mb-2">🚀 {bundleApp}</p>
          <p className="text-xs text-gray-300 mb-3">Recupera pagos fallidos en Stripe automáticamente</p>
          <div className="space-y-2 mb-4 text-xs">
            <p className="text-gray-400">
              Normal: <span className="line-through">${bundleNormalPrice}/mes</span>
            </p>
            <p className="font-bold text-green-400">Tu precio: ${bundlePrice}/mes</p>
            <p className="text-gray-400 text-xs">Bundle discount {bundleDiscount}</p>
          </div>
          <button
            onClick={onAddBundle}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 rounded font-semibold transition"
          >
            Agregar +
          </button>
        </div>

        <button
          onClick={onRepeatWizard}
          className="w-full text-xs py-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition"
        >
          Repetir Setup
        </button>
      </div>
    </div>
  );
}