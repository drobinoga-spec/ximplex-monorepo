'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface FormData {
  consultorio_name: string;
  whatsapp_phone: string;
}

export default function PublicFormPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<FormData | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      const res = await fetch(`/api/forms/${formId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setForm(data);
      } else {
        setError('Formulario no encontrado');
      }
    } catch (err) {
      console.error('Failed to load form:', err);
      setError('Error al cargar formulario');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validar campos requeridos
    if (!name.trim()) {
      setError('El nombre es requerido');
      setLoading(false);
      return;
    }

    if (!whatsapp.trim()) {
      setError('WhatsApp es requerido');
      setLoading(false);
      return;
    }

    if (!message.trim()) {
      setError('El mensaje es requerido');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          whatsapp: whatsapp.trim(),
          message: message.trim(),
          is_emergency: isEmergency,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
      // Limpiar formulario
      setName('');
      setEmail('');
      setWhatsapp('');
      setMessage('');
      setIsEmergency(false);

      // Redirigir a confirmación en 3 segundos
      setTimeout(() => {
        router.push(`/forms/${formId}/thank-you`);
      }, 3000);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Error al enviar formulario. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">{error || 'Cargando formulario...'}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Mensaje Recibido!
          </h1>
          <p className="text-gray-600 mb-6">
            Hola {name},
            <br />
            <br />
            Tu solicitud ha sido enviada exitosamente.
            <br />
            Alguien del equipo se pondrá en contacto contigo
            <br />
            lo más pronto posible.
          </p>
          <p className="text-gray-700 font-semibold">
            Tu mensaje es importante para nosotros.
            <br />
            Apreciamos tu paciencia.
          </p>
          <p className="text-sm text-gray-500 mt-8">
            — {form.consultorio_name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {form.consultorio_name}
            </h1>
            <p className="text-gray-600">
              ¿Cómo podemos ayudarte?
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu Nombre *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Opcional</p>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu WhatsApp *
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+506 8765 4321"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuéntanos qué necesitas *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tengo dolor de panza... o necesito una cita para planchado el lunes a las 4pm..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Emergencia */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emergency"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
              />
              <label htmlFor="emergency" className="text-sm font-medium text-gray-700">
                ¿Es urgente/emergencia?
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            * Campos requeridos
          </p>
        </div>
      </div>
    </div>
  );
}