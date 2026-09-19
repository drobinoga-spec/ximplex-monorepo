'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-400 to-gray-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-300/70 backdrop-blur border border-gray-400/50 rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-gray-700 text-center mb-8">
            Sign in to your Formix account
          </p>

          {message && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6 text-green-700 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 bg-gray-200/70 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-800 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-gray-200/70 border border-gray-400 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: '#c9845c' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-gray-700 text-center mt-6">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 transition" style={{ color: '#c9845c' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
