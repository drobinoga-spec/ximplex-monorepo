'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface BillingData {
  plan: string;
  status: string;
  nextBillingDate?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  pricePerMonth?: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
}

const planDetails: Record<string, { name: string; price: number; features: string[] }> = {
  free: {
    name: 'Free',
    price: 0,
    features: ['1 formulario', '20 leads/mes', 'Hasta 10 campos por form'],
  },
  starter: {
    name: 'Starter',
    price: 12,
    features: ['5 formularios', 'Leads ilimitados', 'Hasta 20 campos por form'],
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: ['Formularios ilimitados', 'Leads ilimitados', 'Campos personalizados'],
  },
};

const UPGRADE_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 12,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
    features: ['5 formularios', 'Leads ilimitados', 'Hasta 20 campos por form'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    features: ['Formularios ilimitados', 'Leads ilimitados', 'Campos personalizados'],
  },
];

export default function BillingPage() {
  const router = useRouter();
  const sessionData = useSession();
  const { data: session, status } = sessionData || { data: null, status: 'unauthenticated' };
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?redirect=/account/billing');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBillingData();
    }
  }, [status]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setShowSuccess(true);
      window.history.replaceState({}, '', '/account/billing');
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/account/billing');

      if (!response.ok) {
        throw new Error('Error fetching billing data');
      }

      const data = await response.json();
      setBilling(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar datos de facturación');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    if (!priceId) return;

    try {
      setCheckingOut(true);
      setError(null);

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error('Error al crear sesión de checkout');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar pago');
      setCheckingOut(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error accessing billing portal');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error:', err);
      setError('Error al acceder al portal de facturación');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin">
            <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-purple-500"></div>
          </div>
          <p className="text-gray-400">Cargando datos de facturación...</p>
        </div>
      </div>
    );
  }

  const currentPlan = billing?.plan || 'free';
  const planInfo = planDetails[currentPlan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <nav className="border-b border-gray-800 bg-gray-900/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">X</span>
            </div>
            <span className="font-bold text-gray-100">Ximplex</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-200 text-sm">
              Dashboard
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-gray-200 text-sm">
              Planes
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg text-green-400">
            ✓ ¡Suscripción actualizada correctamente! Tu nuevo plan está activo.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Current Plan */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Mi Suscripción</h1>
          <p className="text-gray-400 mb-8">Gestiona tu plan y facturación</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-gray-400 text-sm mb-2">Plan Actual</p>
              <p className="text-3xl font-bold text-gray-100">{planInfo.name}</p>
              <p className="text-gray-500 text-sm mt-2">${planInfo.price}/mes</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Estado</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-lg font-semibold text-green-400 capitalize">
                  {billing?.status || 'Activo'}
                </p>
              </div>
            </div>

            {billing?.currentPeriodEnd && (
              <div>
                <p className="text-gray-400 text-sm mb-2">Próxima renovación</p>
                <p className="text-lg font-semibold text-gray-100">
                  {new Date(billing.currentPeriodEnd).toLocaleDateString('es-ES')}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-800 pt-8 mb-8">
            <p className="text-gray-100 font-semibold mb-4">Incluye:</p>
            <ul className="space-y-3">
              {planInfo.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleManageBilling}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition"
          >
            Cambiar plan / Cancelar →
          </button>
        </div>

        {/* Upgrade Plans */}
        {currentPlan === 'free' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Planes disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {UPGRADE_PLANS.map(plan => (
                <div
                  key={plan.id}
                  className="bg-gray-900 border border-gray-800 hover:border-purple-700 rounded-lg p-6 transition"
                >
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-gray-100 mb-1">
                    ${plan.price}
                    <span className="text-sm text-gray-400">/mes</span>
                  </p>

                  <ul className="space-y-3 my-6 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="text-purple-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(plan.priceId)}
                    disabled={checkingOut}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-semibold transition"
                  >
                    {checkingOut ? 'Procesando...' : 'Suscribirse'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing History */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h2 className="text-xl font-bold text-gray-100 mb-6">Historial de facturación</h2>
          <div className="text-gray-400 text-center py-8">
            <p>Aquí aparecerá tu historial de pagos.</p>
            <p className="text-sm mt-2">Puedes ver todos los detalles en el portal de facturación.</p>
          </div>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-gray-400">¿Preguntas sobre tu facturación?</p>
          <a href="mailto:soporte@formix.app" className="text-purple-400 hover:text-purple-300 font-semibold">
            Contacta a soporte →
          </a>
        </div>
      </div>
    </div>
  );
}