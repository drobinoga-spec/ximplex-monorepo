'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  urgent: boolean;
}

const FORM_TEMPLATES = [
  {
    id: 'contact',
    name: 'Contact Form',
    description: 'Collect name, email, and message',
    fields: [
      { id: '1', name: 'Full Name', type: 'text', required: true, urgent: false },
      { id: '2', name: 'Email', type: 'email', required: true, urgent: false },
      { id: '3', name: 'Message', type: 'textarea', required: true, urgent: false },
    ],
  },
  {
    id: 'support',
    name: 'Support Request',
    description: 'Collect issue details and priority',
    fields: [
      { id: '1', name: 'Name', type: 'text', required: true, urgent: false },
      { id: '2', name: 'Email', type: 'email', required: true, urgent: false },
      { id: '3', name: 'Issue', type: 'textarea', required: true, urgent: false },
      { id: '4', name: 'Priority', type: 'select', required: true, urgent: false },
    ],
  },
  {
    id: 'feedback',
    name: 'Feedback Form',
    description: 'Collect customer feedback',
    fields: [
      { id: '1', name: 'Name', type: 'text', required: false, urgent: false },
      { id: '2', name: 'Email', type: 'email', required: true, urgent: false },
      { id: '3', name: 'Feedback', type: 'textarea', required: true, urgent: false },
      { id: '4', name: 'Rating', type: 'select', required: true, urgent: false },
    ],
  },
];

export default function SignupWizardStep3() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [formName, setFormName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectTemplate = (templateId: string) => {
    const template = FORM_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setFields(template.fields);
      setFormName(template.name);
    }
  };

  const toggleFieldProperty = (fieldId: string, property: 'required' | 'urgent') => {
    setFields(fields.map(f =>
      f.id === fieldId ? { ...f, [property]: !f[property] } : f
    ));
  };

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      name: 'New Field',
      type: 'text',
      required: false,
      urgent: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId));
  };

  const updateField = (fieldId: string, key: string, value: any) => {
    setFields(fields.map(f =>
      f.id === fieldId ? { ...f, [key]: value } : f
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formName.trim()) {
      setError('Form name is required');
      return;
    }

    if (fields.length === 0) {
      setError('Add at least one field');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          fields: fields,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create form');
      }

      router.push('/signup-wizard/step-4');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-400">Step 3 of 6</h2>
            <div className="h-1 flex-1 mx-4 bg-[#333] rounded-full overflow-hidden">
              <div className="h-full w-3/6 bg-gradient-to-r from-[#ff6b35] to-[#f7931e]"></div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create Your First Form</h1>
            <p className="text-gray-400">Choose a template or build from scratch</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Templates */}
          {!selectedTemplate && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Quick Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {FORM_TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className="p-4 border border-[#333] rounded-lg hover:border-[#ff6b35] hover:bg-[#2a2a2a] transition text-left"
                  >
                    <h4 className="text-white font-medium mb-1">{template.name}</h4>
                    <p className="text-xs text-gray-500">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Form Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Form Name *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Customer Inquiry"
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35] transition"
              />
            </div>

            {/* Fields */}
            {fields.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-4">Form Fields</h3>
                <div className="space-y-3">
                  {fields.map((field) => (
                    <div key={field.id} className="p-4 border border-[#333] rounded-lg bg-[#2a2a2a]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => updateField(field.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-white text-sm mb-3 focus:outline-none focus:border-[#ff6b35] transition"
                          />

                          <div className="flex flex-wrap gap-4 text-sm">
                            <label className="flex items-center gap-2 text-gray-400 hover:text-gray-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={() => toggleFieldProperty(field.id, 'required')}
                                className="w-4 h-4 cursor-pointer"
                              />
                              Required
                            </label>
                            <label className="flex items-center gap-2 text-gray-400 hover:text-gray-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.urgent}
                                onChange={() => toggleFieldProperty(field.id, 'urgent')}
                                className="w-4 h-4 cursor-pointer"
                              />
                              Urgent
                            </label>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeField(field.id)}
                          className="text-red-500 hover:text-red-400 transition text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Warning */}
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-yellow-600">⚠️ Use urgent with caution - if everything is urgent, nothing is urgent</p>
                </div>
              </div>
            )}

            {/* Add Field Button */}
            <button
              type="button"
              onClick={addField}
              className="mb-6 px-4 py-2 text-sm border border-[#ff6b35] text-[#ff6b35] rounded-lg hover:bg-[#ff6b35]/10 transition"
            >
              + Add Field
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || fields.length === 0}
              className="w-full bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Creating Form...' : 'Continue to Next Step'}
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