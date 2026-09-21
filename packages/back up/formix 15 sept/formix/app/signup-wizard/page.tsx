'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupWizardStep1() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.address || !formData.phone) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create account
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          address: formData.address,
          phone: formData.phone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Signup failed');
      }

      // Store account info in session/state and continue to step 2
      router.push('/signup-wizard/step-2');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-400">Step 1 of 6</h2>
            <div className="h-1 flex-1 mx-4 bg-[#333] rounded-full overflow-hidden">
              <div className="h-full w-1/6 bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"></div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Formix</h1>
            </div>
            <p className="text-gray-400">Create your Ximplex account</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, Country"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Creating account...' : 'Continue to Next Step'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-6">
            This account is shared across all Ximplex apps
          </p>
        </div>
      </div>
    </div>
  );
}