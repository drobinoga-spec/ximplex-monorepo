'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeliveryMethod = 'whatsapp' | 'email' | 'both';

export default function SignupWizardStep4() {
  const router = useRouter();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('whatsapp');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateWhatsappNumber = (number: string) => {
    // Basic validation: remove non-digits and check length
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!whatsappNumber.trim()) {
      setError('WhatsApp number is required');
      return;
    }

    if (!validateWhatsappNumber(whatsappNumber)) {
      setError('Please enter a valid WhatsApp number (10-15 digits)');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/settings/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsappNumber: whatsappNumber.replace(/\D/g, ''),
          deliveryMethod: deliveryMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save WhatsApp settings');
      }

      router.push('/signup-wizard/step-5');
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
            <h2 className="text-sm font-medium text-gray-400">Step 4 of 6</h2>
            <div className="h-1 flex-1 mx-4 bg-[#333] rounded-full overflow-hidden">
              <div className="h-full w-4/6 bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"></div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">WhatsApp Configuration</h1>
            <p className="text-gray-400">Where should we send your form messages?</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number *</label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+1 (555) 000-0000 or 1234567890"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
              />
              <p className="text-xs text-gray-500 mt-2">Include country code for best results</p>
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">Delivery Method *</label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border border-[#333] rounded-lg hover:border-[#ff6b35] hover:bg-[#2a2a2a] transition cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="whatsapp"
                    checked={deliveryMethod === 'whatsapp'}
                    onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                    className="mt-1 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-white font-medium">WhatsApp Only</h4>
                    <p className="text-xs text-gray-500 mt-1">Receive all messages on WhatsApp</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-[#333] rounded-lg hover:border-[#ff6b35] hover:bg-[#2a2a2a] transition cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="email"
                    checked={deliveryMethod === 'email'}
                    onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                    className="mt-1 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-white font-medium">Email Only</h4>
                    <p className="text-xs text-gray-500 mt-1">Receive all messages via email</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-[#333] rounded-lg hover:border-[#ff6b35] hover:bg-[#2a2a2a] transition cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="both"
                    checked={deliveryMethod === 'both'}
                    onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                    className="mt-1 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-white font-medium">Both WhatsApp & Email</h4>
                    <p className="text-xs text-gray-500 mt-1">Receive messages on both channels</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-400">
                💡 You can change these settings anytime in your account settings
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Continue to Next Step'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#333]">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-300 text-sm transition"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}