'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PLANS = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    description: 'Para empezar',
    features: ['1 formulario', '20 leads/mes', 'Hasta 10 campos'],
    cta: 'Comenzar',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 12,
    description: 'Para crecer',
    features: ['5 formularios', 'Leads ilimitados', 'Hasta 20 campos', 'Integración WhatsApp'],
    cta: 'Suscribirse',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'Para escalar',
    features: ['Formularios ilimitados', 'Leads ilimitados', 'Campos personalizados', 'API access', 'Soporte prioritario'],
    cta: 'Suscribirse',
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleUpgrade = async (priceId: string) => {
    if (!session) {
      router.push('/auth/signin?redirect=/pricing');
      return;
    }

    setCheckingOut(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Nav */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ✨ Formix
          </Link>
          {session ? (
            <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Dashboard
            </Link>
          ) : (
            <Link href="/auth/signin" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">Planes simples y transparentes</h1>
        <p className="text-xl text-slate-600 mb-8">Elige el plan que se ajuste a tus necesidades</p>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`rounded-lg p-8 transition ${
                plan.popular
                  ? 'bg-blue-600 text-white shadow-2xl scale-105'
                  : 'bg-white text-slate-900 shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="mb-4">
                  <span className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.popular ? 'text-blue-100' : 'text-slate-600'}`}>
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className={plan.popular ? 'text-blue-100' : 'text-slate-600'}>/mes</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className={plan.popular ? 'text-blue-200' : 'text-green-600'}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <Link
                  href={session ? '/dashboard' : '/auth/signin'}
                  className={`w-full py-3 rounded-lg text-center font-medium transition ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                  }`}
                >
                  Empezar gratis
                </Link>
              ) : (
                <button
                  onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '')}
                  disabled={checkingOut}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {checkingOut ? 'Procesando...' : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Preguntas frecuentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">¿Puedo cambiar de plan?</h3>
              <p className="text-slate-600">Sí, en cualquier momento. Los cambios se aplican en tu próxima renovación.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">¿Hay período de prueba?</h3>
              <p className="text-slate-600">Sí, comienza con el plan Gratis sin límite de tiempo.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">¿Cómo cancelo?</h3>
              <p className="text-slate-600">Puedes cancelar desde tu cuenta en cualquier momento.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">¿Hay factura?</h3>
              <p className="text-slate-600">Sí, recibirás factura automática cada mes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}