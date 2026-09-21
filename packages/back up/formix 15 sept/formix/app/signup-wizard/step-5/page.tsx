'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const MESSAGE_TEMPLATES: Template[] = [
  {
    id: 'detailed',
    name: 'Detailed Notification',
    description: 'Receive complete form submission details',
    preview: '📋 New submission: John Doe\nEmail: john@example.com\nMessage: Help needed with billing...',
  },
  {
    id: 'summary',
    name: 'Brief Summary',
    description: 'Receive quick notification with sender info only',
    preview: '✓ New message from John Doe\n(john@example.com)',
  },
  {
    id: 'urgent-first',
    name: 'Urgent Priority',
    description: 'Receive urgent messages first, others in summary',
    preview: '🚨 URGENT: John Doe needs immediate assistance\n(3 other messages waiting)',
  },
  {
    id: 'daily-digest',
    name: 'Daily Digest',
    description: 'Receive all submissions once per day',
    preview: '📅 Daily Summary\n5 new submissions today\nTap to view all',
  },
];

export default function SignupWizardStep5() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('detailed');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/settings/whatsapp-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save template preference');
      }

      router.push('/signup-wizard/step-6');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const selectedTemplateData = MESSAGE_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-400">Step 5 of 6</h2>
            <div className="h-1 flex-1 mx-4 bg-[#333] rounded-full overflow-hidden">
              <div className="h-full w-5/6 bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"></div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Choose Message Format</h1>
            <p className="text-gray-400">How would you like to receive form submissions on WhatsApp?</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Template Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {MESSAGE_TEMPLATES.map(template => (
                <label
                  key={template.id}
                  className={`p-5 border rounded-lg cursor-pointer transition ${
                    selectedTemplate === template.id
                      ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                      : 'border-[#333] hover:border-[#ff6b35] hover:bg-[#2a2a2a]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={selectedTemplate === template.id}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="mt-1 cursor-pointer"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Preview Section */}
            {selectedTemplateData && (
              <div className="mb-8 p-5 bg-[#2a2a2a] border border-[#333] rounded-lg">
                <p className="text-xs font-medium text-gray-400 mb-3">📱 Preview</p>
                <div className="bg-[#1a1a1a] rounded p-4 border border-[#333]">
                  <p className="text-sm text-white whitespace-pre-wrap font-mono text-gray-300">
                    {selectedTemplateData.preview}
                  </p>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-8">
              <p className="text-xs text-blue-400">
                💡 You can change your message format anytime in settings
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Continue to Final Step'}
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