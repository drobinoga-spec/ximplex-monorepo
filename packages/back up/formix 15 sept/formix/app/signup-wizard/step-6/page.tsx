'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupWizardStep6() {
  const router = useRouter();
  const [testMessage, setTestMessage] = useState('This is a test message to verify my WhatsApp configuration is working correctly.');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/settings/send-test-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testMessage.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send test message');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8 text-center">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-400">Step 6 of 6</h2>
                <div className="h-1 flex-1 mx-4 bg-[#333] rounded-full overflow-hidden">
                  <div className="h-full w-6/6 bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"></div>
                </div>
              </div>
            </div>

            {/* Success Content */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">All Set!</h1>
              <p className="text-gray-400">Your test message has been sent to WhatsApp</p>
            </div>

            {/* Message Details */}
            <div className="p-4 bg-[#2a2a2a] border border-[#333] rounded-lg mb-8 text-left">
              <p className="text-xs text-gray-500 mb-2">Test message sent:</p>
              <p className="text-sm text-gray-300 italic">"{testMessage}"</p>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-8">
              <p className="text-xs text-blue-400">
                💡 Check your WhatsApp to confirm you received the message
              </p>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 text-white font-semibold py-3 rounded-lg transition mb-3"
            >
              Go to Dashboard
            </button>

            <button
              onClick={() => router.push('/forms/new')}
              className="w-full border border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 font-semibold py-3 rounded-lg transition"
            >
              Create First Form
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-gray-400">Send a test message to verify everything works</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Test Message</label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">This message will be sent to your WhatsApp</p>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-400">
                📱 You'll receive this message on the WhatsApp number you provided
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Sending...' : 'Send Test Message'}
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