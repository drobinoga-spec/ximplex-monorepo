'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifySecret() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Código inválido');
      }

      // Redirect to my-desk
      const redirectUrl = searchParams.get('redirect') || '/my-desk';
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Error al verificar código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] rounded-lg flex items-center justify-center font-bold text-white text-xl">
            F
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">Formix - My Desk</h1>
        <p className="text-gray-400 text-center mb-8">Ingresa el código de acceso</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="secret" className="block text-sm font-medium text-gray-300 mb-2">
              Código de acceso
            </label>
            <input
              id="secret"
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Ingresa el código"
              required
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          ¿No tienes código?{' '}
          <a href="/" className="text-[#ff6b35] hover:text-[#f7931e]">
            Volver a inicio
          </a>
        </p>
      </div>
    </div>
  );
}