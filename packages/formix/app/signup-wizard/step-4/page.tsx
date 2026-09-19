'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupWizardStep4() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    whatsappNumber: '',
    deliveryMethod: 'both',
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

    if (!formData.whatsappNumber.trim()) {
      setError('WhatsApp number is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/settings/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsappNumber: formData.whatsappNumber.trim(),
          deliveryMethod: formData.deliveryMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save WhatsApp settings');
      }

      router.push('/signup-wizard/step-5');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-400">Step 4 of 6</h2>
            <div className="h-1 flex-1 mx-4 bg-[#333] rounded-full overflow-hidden">
              <div className="h-full w-4/6 bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"></div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Configure WhatsApp</h1>
            <p className="text-gray-400">Where should leads be sent?</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your WhatsApp Number *</label>
              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="+506 86994672"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]"
                required
              />
              <p className="text-xs text-gray-500 mt-2">Include country code (e.g., +506 for Costa Rica)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Delivery Method *</label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 border border-[#333] rounded-lg hover:border-[#ff6b35] cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="whatsapp"
                    checked={formData.deliveryMethod === 'whatsapp'}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">WhatsApp Only</p>
                    <p className="text-xs text-gray-500">Send leads only via WhatsApp</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-[#333] rounded-lg hover:border-[#ff6b35] cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="email"
                    checked={formData.deliveryMethod === 'email'}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">Email Only</p>
                    <p className="text-xs text-gray-500">Send leads only via email</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-[#333] rounded-lg hover:border-[#ff6b35] cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="both"
                    checked={formData.deliveryMethod === 'both'}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">Both WhatsApp & Email</p>
                    <p className="text-xs text-gray-500">Send leads to both channels</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg"
            >
              {loading ? 'Saving...' : 'Continue to Next Step'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#333]">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-300 text-sm">
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}