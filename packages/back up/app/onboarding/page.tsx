'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    consultorio_name: '',
    whatsapp_phone: '',
    plan: 'free',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handleNext = async () => {
    setError('');
    setLoading(true);

    try {
      if (step === 1) {
        // Validar Step 1
        if (!formData.consultorio_name?.trim()) {
          setError('Nombre del consultorio es requerido');
          setLoading(false);
          return;
        }
        if (!formData.whatsapp_phone?.trim()) {
          setError('WhatsApp es requerido');
          setLoading(false);
          return;
        }

        // Guardar en profile
        const res = await fetch('/api/client/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.consultorio_name,
            whatsapp_phone: formData.whatsapp_phone,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to save profile');
        }

        setStep(2);
      } else if (step === 2) {
        // Step 2: Plan - crear formulario automático
        const createRes = await fetch('/api/client/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Formulario - ${formData.consultorio_name}`,
            description: `Formulario de contacto para ${formData.consultorio_name}`,
            plan: formData.plan,
          }),
        });

        if (!createRes.ok) {
          throw new Error('Failed to create form');
        }

        const newForm = await createRes.json();
        router.push('/dashboard/forms');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Un error ocurrió';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const progress = (step / 2) * 100;

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Paso {step} de 2
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Step 1: Datos Básicos */}
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenido a Formix
              </h1>
              <p className="text-gray-600 mb-6">
                Cuéntanos sobre tu consultorio
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Consultorio
                  </label>
                  <input
                    type="text"
                    value={formData.consultorio_name}
                    onChange={(e) =>
                      setFormData({ ...formData, consultorio_name: e.target.value })
                    }
                    placeholder="Ej: Palo Alto Consultorio Médico"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp (con código de país)
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp_phone: e.target.value })
                    }
                    placeholder="+506 8765 4321"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Aquí recibirás notificaciones de nuevas solicitudes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Plan Selection */}
          {step === 2 && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Elige tu Plan
              </h1>
              <p className="text-gray-600 mb-6">
                Puedes cambiar cuando quieras
              </p>

              <div className="space-y-3">
                {[
                  {
                    id: 'free',
                    name: 'Gratis',
                    price: '$0',
                    description: 'Perfecto para probar',
                    features: ['1 formulario', 'Respuestas ilimitadas', 'Dashboard básico'],
                  },
                  {
                    id: 'starter',
                    name: 'Starter',
                    price: '$29',
                    description: 'Para consultorio pequeño',
                    features: ['5 formularios', 'Respuestas ilimitadas', 'Dashboard avanzado', 'Bloquear spam'],
                  },
                  {
                    id: 'pro',
                    name: 'Pro',
                    price: '$99',
                    description: 'Para consultorio grande',
                    features: ['Formularios ilimitados', 'Usuarios múltiples', 'API', 'Prioridad'],
                  },
                ].map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                      formData.plan === plan.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {plan.price}
                        <span className="text-sm text-gray-500">/mes</span>
                      </span>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {plan.features.map((feature) => (
                        <li key={feature}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                ← Atrás
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
            >
              {loading ? 'Procesando...' : step === 2 ? '¡Empezar!' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}