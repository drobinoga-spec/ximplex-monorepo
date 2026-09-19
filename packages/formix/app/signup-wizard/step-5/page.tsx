'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MESSAGE_TEMPLATES = [
  {
    id: 'detailed',
    name: 'Detailed',
    description: 'Complete form response with all fields',
    example: '📋 New Lead\nName: John Doe\nEmail: john@example.com\nMessage: Interested in your services',
  },
  {
    id: 'brief',
    name: 'Brief',
    description: 'Concise summary of the most important fields',
    example: '✉️ New Lead: John Doe (john@example.com)',
  },
  {
    id: 'urgent',
    name: 'Urgent Priority',
    description: 'Highlights urgent fields with priority indicators',
    example: '🚨 URGENT: John Doe\n⚡ High Priority Field\nMessage: Contact me ASAP',
  },
  {
    id: 'digest',
    name: 'Daily Digest',
    description: 'Batch multiple leads into a single daily summary',
    example: '📊 Daily Summary (5 leads)\n1. John Doe\n2. Jane Smith\n3. Bob Johnson',
  },
];

export default function SignupWizardStep5() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState('detailed');
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
        throw new Error(data.error || 'Failed to save template');
      }

      router.push('/signup-wizard/step-6');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const currentTemplate = MESSAGE_TEMPLATES.find(t => t.id === selectedTemplate);

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
            <p className="text-gray-400">How should leads appear in your WhatsApp?</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {MESSAGE_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    selectedTemplate === template.id
                      ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                      : 'border-[#333] hover:border-[#ff6b35]/50'
                  }`}
                >
                  <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                  <p className="text-xs text-gray-400">{template.description}</p>
                </button>
              ))}
            </div>

            {/* Preview */}
            {currentTemplate && (
              <div className="mb-8 p-4 bg-[#2a2a2a] rounded-lg border border-[#333]">
                <p className="text-xs text-gray-400 mb-3">Preview:</p>
                <div className="bg-white/5 rounded p-3 text-sm text-gray-200 whitespace-pre-wrap font-mono">
                  {currentTemplate.example}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
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