'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupWizardStep6() {
  const router = useRouter();
  const [testMessage, setTestMessage] = useState('🎉 Welcome to Formix! This is a test message from your new form.');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/settings/send-test-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send test message');
      }

      setSuccess('✅ Test message sent! Check your WhatsApp.');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-400">Step 6 of 6</h2>
            <div className="h-1 flex-1 mx-4 bg-[#333] rounded-full overflow-hidden">
              <div className="h-full w-6/6 bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"></div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Test Your Setup</h1>
            <p className="text-gray-400">Send a test message to make sure everything works</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSendTest} className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Test Message</label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Sending...' : '📱 Send Test Message'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#333]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a1a1a] text-gray-500">Ready to go?</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 text-white font-semibold py-3 rounded-lg transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/signup-wizard/step-3')}
              className="w-full border border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 font-semibold py-3 rounded-lg transition"
            >
              Create Another Form
            </button>
          </div>

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