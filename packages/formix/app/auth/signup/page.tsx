'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Signup failed');
      }

      // Redirect to wizard
      router.push('/signup-wizard/step-1');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 mb-8">Sign up to get started with Formix</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ff6b35]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ff6b35]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-sm text-gray-400 text-center mt-6">
            Already have an account?{' '}
            <Link href="/signin" className="text-[#ff6b35] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}