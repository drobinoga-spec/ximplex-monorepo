'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type FieldType = 'text' | 'email' | 'phone' | 'textarea' | 'checkbox' | 'select' | 'date';

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface FormData {
  id: string;
  name: string;
  description: string;
  whatsapp_phone: string;
  fields: FormField[];
  status: string;
}

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/client/forms');
      if (!response.ok) throw new Error('Error al cargar formulario');
      const forms = await response.json();
      const form = forms.find((f: any) => f.id === formId);
      if (form) {
        setFormData({
          ...form,
          fields: form.fields || [],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    if (!formData) return;
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'Nuevo campo',
      type: 'text',
      required: false,
    };
    setFormData({
      ...formData,
      fields: [...formData.fields, newField],
    });
  };

  const removeField = (id: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      fields: formData.fields.filter(f => f.id !== id),
    });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      fields: formData.fields.map(f =>
        f.id === id ? { ...f, ...updates } : f
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/client/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar formulario');
      router.push(`/dashboard/forms/${formId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
          <div className="animate-spin inline-block">
            <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Formulario no encontrado
          </div>
        </div>
      </div>
    );
  }

  const fieldTypes: FieldType[] = ['text', 'email', 'phone', 'textarea', 'checkbox', 'select', 'date'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/dashboard/forms/${formId}`} className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Volver
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Editar formulario</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Info básica */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Información básica</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
              <input
                type="text"
                value={formData.whatsapp_phone}
                onChange={e => setFormData({ ...formData, whatsapp_phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Campos */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Campos</h2>
              <button
                type="button"
                onClick={addField}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                + Agregar
              </button>
            </div>

            <div className="space-y-4">
              {formData.fields.map((field, idx) => (
                <div key={field.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      value={field.label}
                      onChange={e => updateField(field.id, { label: e.target.value })}
                      placeholder="Etiqueta"
                      className="px-3 py-2 border border-slate-300 rounded text-sm"
                    />
                    <select
                      value={field.type}
                      onChange={e => updateField(field.id, { type: e.target.value as FieldType })}
                      className="px-3 py-2 border border-slate-300 rounded text-sm"
                    >
                      {fieldTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => updateField(field.id, { required: e.target.checked })}
                      />
                      <span className="text-sm text-slate-700">Requerido</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}