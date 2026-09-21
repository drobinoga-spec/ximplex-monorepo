'use client';

import { useState } from 'react';

interface WhatsAppSettingsProps {
  userId: string;
  currentPhone: string;
  onSave: (phone: string) => void;
}

export default function WhatsAppSettings({
  userId,
  currentPhone,
  onSave,
}: WhatsAppSettingsProps) {
  const [phone, setPhone] = useState(currentPhone || '');
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('El número de WhatsApp es requerido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Auto-add + if missing
      let phoneToSave = phone.trim();
      if (!phoneToSave.startsWith('+')) {
        phoneToSave = '+' + phoneToSave;
      }

      const res = await fetch('/api/settings/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneToSave }),
      });

      if (res.ok) {
        const data = await res.json();
        onSave(data.phone);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const err = await res.json();
        setError(err.error || 'Error al guardar');
      }
    } catch (err) {
      setError('Error al guardar los cambios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (!currentPhone) {
      setError('Guarda tu número de WhatsApp primero');
      return;
    }

    setTestLoading(true);
    setError('');

    try {
      const res = await fetch('/api/settings/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const err = await res.json();
        setError(err.error || 'Error al enviar test');
      }
    } catch (err) {
      setError('Error al enviar test');
      console.error(err);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuración de WhatsApp
        </h2>
        <p className="text-gray-600">
          Recibe notificaciones de nuevos leads directamente en WhatsApp
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-700 font-semibold">
            ✓ Configuración guardada correctamente
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de WhatsApp *
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+34 612 345 678"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formato: +[país][número] (ej: +34 612 345 678)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
        >
          {showHelp ? '▼' : '▶'} ¿Cómo encontro mi número de WhatsApp?
        </button>

        {showHelp && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Tu número de WhatsApp
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Abre WhatsApp en tu teléfono</li>
              <li>Ve a Configuración → Información sobre mí</li>
              <li>
                Verás tu número de teléfono (con el código del país)
              </li>
              <li>Cópialo exactamente (incluyendo el +)</li>
              <li>Pégalo en el campo arriba</li>
            </ol>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
          >
            {loading ? 'Guardando...' : '💬 Guardar Número'}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={testLoading || !currentPhone}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold"
          >
            {testLoading ? 'Enviando...' : '📤 Enviar Test'}
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">
          ¿Cómo funciona?
        </h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>✓ Cuando alguien completa tu formulario...</li>
          <li>✓ Recibirás un mensaje WhatsApp automático</li>
          <li>✓ Con los datos del lead (nombre, email, etc)</li>
          <li>✓ En tiempo real, sin esperar</li>
        </ul>
      </div>
    </div>
  );
}
