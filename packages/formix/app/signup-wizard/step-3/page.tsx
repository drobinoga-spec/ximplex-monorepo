'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const BILLING_OPTIONS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 29,
    period: '/month',
    description: 'Billed monthly. Cancel anytime.',
  },
  {
    id: 'annual',
    name: 'Annual',
    price: 290,
    period: '/year',
    description: 'Save 2 months with yearly billing',
    badge: 'Save 17%',
  },
];

export default function SignupWizardStep3() {
  const router = useRouter();
  const { data: session } = useSession();
  const [billingOption, setBillingOption] = useState('monthly');
  const [formData, setFormData] = useState({
    cardholderName: 'John Doe',
    cardNumber: '4242424242424242',
    expiryMonth: '12',
    expiryYear: '25',
    cvv: '123',
    country: 'Costa Rica',
    state: 'San José',
    city: 'San José',
    zipCode: '10101',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  if (!session) {
    router.push('/signin');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock payment - just save the plan selection
      const res = await fetch('/api/settings/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingOption,
          paymentMethod: 'mock',
          cardLast4: formData.cardNumber.slice(-4),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save plan');
      }

      // Proceed to next step (form templates - now step-4)
      router.push('/signup-wizard/step-4');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedOption = BILLING_OPTIONS.find(o => o.id === billingOption);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-400">Step 3 of 7</h2>
            <div className="h-1 flex-1 mx-4 bg-[#333] rounded-full overflow-hidden">
              <div className="h-full w-3/7 bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"></div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Choose Your Billing Plan</h1>
            <p className="text-gray-400">Select monthly or annual billing</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Billing Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {BILLING_OPTIONS.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setBillingOption(option.id)}
                className={`relative p-6 rounded-lg border-2 transition text-left ${
                  billingOption === option.id
                    ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                    : 'border-[#333] hover:border-[#ff6b35]/50'
                }`}
              >
                {option.badge && (
                  <div className="absolute top-3 right-3 bg-[#ff6b35] text-white text-xs font-semibold px-2 py-1 rounded">
                    {option.badge}
                  </div>
                )}
                <h3 className="text-white font-semibold mb-2">{option.name}</h3>
                <p className="text-2xl font-bold text-[#ff6b35] mb-1">
                  ${option.price}
                  <span className="text-sm text-gray-400">{option.period}</span>
                </p>
                <p className="text-xs text-gray-500">{option.description}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name *</label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
                required
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Card Number *</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition font-mono"
                required
              />
              <p className="text-xs text-gray-500 mt-2">Test: 4242 4242 4242 4242</p>
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Month *</label>
                <select
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, '0');
                    return (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year *</label>
                <select
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition"
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = (new Date().getFullYear() + i).toString().slice(-2);
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CVV *</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition font-mono"
                  required
                />
              </div>
            </div>

            {/* Address Fields */}
            <div className="pt-4 border-t border-[#333]">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Billing Address</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Costa Rica"
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State/Province *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="San José"
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="San José"
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10101"
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Processing...' : 'Continue to Next Step'}
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

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-400">
              💡 <strong>Test Mode:</strong> All data is mocked. No real payments are processed. The form comes pre-filled for testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}