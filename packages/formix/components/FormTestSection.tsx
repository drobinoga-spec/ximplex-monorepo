'use client';

import { useState } from 'react';

interface FormTestSectionProps {
  formId: string;
  fields: Array<{ id: string; name: string; type: string }>;
}

export default function FormTestSection({
  formId,
  fields,
}: FormTestSectionProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSendTest = async () => {
    setLoading(true);
    setResult('');

    try {
      // Generate test data based on form fields
      const testData: Record<string, any> = {};

      fields.forEach((field) => {
        switch (field.type) {
          case 'email':
            testData[field.name] = 'test@example.com';
            break;
          case 'phone':
            testData[field.name] = '+1 555 123 4567';
            break;
          case 'number':
            testData[field.name] = '123';
            break;
          case 'date':
            testData[field.name] = new Date().toISOString().split('T')[0];
            break;
          case 'checkbox':
            testData[field.name] = true;
            break;
          case 'radio':
          case 'select':
            testData[field.name] = 'Option 1';
            break;
          case 'textarea':
            testData[field.name] = 'This is a test message';
            break;
          default:
            testData[field.name] = `Test ${field.name}`;
        }
      });

      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: testData }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(
          `✓ Test enviado exitosamente${
            data.whatsappSent
              ? ' - WhatsApp notificación enviada'
              : ' - (Sin notificación WhatsApp configurada)'
          }`
        );
      } else {
        setResult('✗ Error al enviar test');
      }
    } catch (error) {
      setResult('✗ Error al enviar test');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-bold text-yellow-900 mb-2">
        🧪 Enviar Test
      </h3>
      <p className="text-sm text-yellow-800 mb-4">
        Envía un mensaje de prueba con datos de ejemplo. Se rellenará automáticamente
        con datos como "test@example.com", "+1 555 123 4567", etc.
      </p>

      <button
        onClick={handleSendTest}
        disabled={loading}
        className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 font-semibold"
      >
        {loading ? 'Enviando test...' : '📤 Enviar Formulario de Test'}
      </button>

      {result && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm font-semibold ${
            result.includes('✓')
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
}