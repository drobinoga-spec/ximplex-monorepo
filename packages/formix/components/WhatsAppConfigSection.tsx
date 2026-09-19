'use client';

import { useState } from 'react';

interface WhatsAppConfigSectionProps {
  formId: string;
  formName: string;
  currentPhone: string;
  fields: Array<{ label: string; type: string }>;
  onPhoneChange: (phone: string) => void;
}

export default function WhatsAppConfigSection({
  formId,
  formName,
  currentPhone,
  fields,
  onPhoneChange,
}: WhatsAppConfigSectionProps) {
  const [phone, setPhone] = useState(currentPhone || '');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Generate test data based on fields
  const generateTestData = () => {
    const testData: Record<string, any> = {};
    fields.forEach((field) => {
      switch (field.type) {
        case 'email':
          testData[field.label] = 'test@example.com';
          break;
        case 'phone':
          testData[field.label] = '+1 555 123 4567';
          break;
        case 'number':
          testData[field.label] = '123';
          break;
        case 'date':
          testData[field.label] = new Date().toISOString().split('T')[0];
          break;
        default:
          testData[field.label] = `Test ${field.label}`;
      }
    });
    return testData;
  };

  // Generate preview message
  const generatePreviewMessage = () => {
    const testData = generateTestData();
    const dataString = Object.entries(testData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    return `🚨 *Nuevo Lead - ${formName}*\n\n${dataString}\n\n_Formix_`;
  };

  const handleSavePhone = async () => {
    if (!phone.trim()) {
      setMessage('El número de WhatsApp es requerido');
      setMessageType('error');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      // Auto-add + if missing
      let phoneToSave = phone.trim();
      if (!phoneToSave.startsWith('+')) {
        phoneToSave = '+' + phoneToSave;
      }

      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp_phone: phoneToSave }),
      });

      if (res.ok) {
        setMessage('✓ Número de WhatsApp guardado');
        setMessageType('success');
        onPhoneChange(phoneToSave);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error al guardar el número');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error al guardar el número');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!currentPhone) {
      setMessage('Guarda tu número primero');
      setMessageType('error');
      return;
    }

    setTesting(true);
    setMessage('');

    try {
      const testData = generateTestData();
      const res = await fetch(`/api/forms/${formId}/test-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: testData }),
      });

      if (res.ok) {
        setMessage('✓ Mensaje de test enviado a tu WhatsApp');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const err = await res.json();
        setMessage(err.error || 'Error al enviar test');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error al enviar test');
      setMessageType('error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        💬 Notificaciones por WhatsApp
      </h3>

      {/* Phone Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tu número de WhatsApp *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+506 8123 4567"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleSavePhone}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Formato: +506 8123 4567 (con código de país)
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg mb-6 text-sm font-semibold ${
            messageType === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {message}
        </div>
      )}

      {/* Preview */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vista previa del mensaje:
        </label>
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 whitespace-pre-wrap text-sm font-mono text-gray-800">
          {generatePreviewMessage()}
        </div>
      </div>

      {/* Test Button */}
      <button
        onClick={handleTest}
        disabled={testing || !currentPhone}
        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
      >
        {testing ? '📤 Enviando test...' : '📤 Enviar Test a mi WhatsApp'}
      </button>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">¿Cómo funciona?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Guarda tu número de WhatsApp arriba</li>
          <li>✓ Cada vez que alguien complete tu formulario...</li>
          <li>✓ Recibirás un mensaje automático con los datos</li>
          <li>✓ Sin delays, en tiempo real</li>
        </ul>
      </div>
    </div>
  );
}