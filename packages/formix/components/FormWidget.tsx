'use client';

import { useState, useEffect } from 'react';

interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  order: number;
}

interface FormData {
  id: string;
  name: string;
  description: string;
  fields: Field[];
}

interface FormWidgetProps {
  formId: string;
  apiUrl?: string;
}

const FIELD_TYPES: Record<string, string> = {
  text: 'Texto Corto',
  email: 'Email',
  phone: 'Teléfono',
  number: 'Número',
  textarea: 'Texto Largo',
  date: 'Fecha',
  select: 'Seleccionar',
  checkbox: 'Checkbox',
  radio: 'Radio',
};

export default function FormWidget({
  formId,
  apiUrl = 'http://localhost:3001',
}: FormWidgetProps) {
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/forms/public/${formId}`);
        if (!res.ok) {
          throw new Error('Form not found');
        }
        const data = await res.json();
        setForm(data.form);

        // Initialize form values
        const initialValues: Record<string, string> = {};
        data.form.fields.forEach((field: Field) => {
          initialValues[field.id] = '';
        });
        setFormValues(initialValues);
      } catch (err: any) {
        setError(err.message || 'Error loading form');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, apiUrl]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formValues }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormValues({});
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const err = await res.json();
        setError(err.error || 'Error submitting form');
      }
    } catch (err: any) {
      setError('Error submitting form');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: Field) => {
    const value = formValues[field.id] || '';
    const commonProps = {
      id: field.id,
      value,
      onChange: (e: React.ChangeEvent<any>) =>
        handleInputChange(field.id, e.target.value),
      className:
        'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      placeholder: field.placeholder || '',
      required: field.required,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={field.id}
            {...commonProps}
            rows={4}
            className={`${commonProps.className} resize-none`}
          />
        );

      case 'email':
        return (
          <input
            key={field.id}
            type="email"
            {...commonProps}
          />
        );

      case 'phone':
        return (
          <input
            key={field.id}
            type="tel"
            {...commonProps}
          />
        );

      case 'number':
        return (
          <input
            key={field.id}
            type="number"
            {...commonProps}
          />
        );

      case 'date':
        return (
          <input
            key={field.id}
            type="date"
            {...commonProps}
          />
        );

      case 'select':
        return (
          <select
            key={field.id}
            {...commonProps}
          >
            <option value="">Selecciona una opción</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={value === 'on'}
              onChange={(e) =>
                handleInputChange(field.id, e.target.checked ? 'on' : '')
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor={field.id}
              className="ml-2 text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="flex items-center">
            <input
              type="radio"
              id={field.id}
              name={field.id}
              checked={value === 'on'}
              onChange={(e) =>
                handleInputChange(field.id, e.target.checked ? 'on' : '')
              }
              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor={field.id}
              className="ml-2 text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
          </div>
        );

      case 'text':
      default:
        return (
          <input
            key={field.id}
            type="text"
            {...commonProps}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-600">Cargando formulario...</p>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg p-6 shadow-md">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {form.name}
          </h2>
          {form.description && (
            <p className="text-gray-600 text-sm">{form.description}</p>
          )}
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 font-semibold">
              ✓ Formulario enviado exitosamente
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id}>
                {!['checkbox', 'radio'].includes(field.type) && (
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {field.label}
                    {field.required && (
                      <span className="text-red-600 ml-1">*</span>
                    )}
                  </label>
                )}
                {renderField(field)}
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold mt-8"
            >
              {submitting ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        )}
      </div>

      {/* Powered by Formix */}
      <p className="text-center text-xs text-gray-500 mt-4">
        Powered by{' '}
        <span className="font-semibold text-gray-700">Formix</span>
      </p>
    </div>
  );
}
