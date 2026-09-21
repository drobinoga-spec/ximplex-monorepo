'use client';

import { useState } from 'react';

export interface Field {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  order: number;
}

interface FieldBuilderProps {
  formId: string;
  fields: Field[];
  onFieldsChange: (fields: Field[]) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texto Corto' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Teléfono' },
  { value: 'number', label: 'Número' },
  { value: 'textarea', label: 'Texto Largo' },
  { value: 'date', label: 'Fecha' },
  { value: 'select', label: 'Seleccionar' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
];

export default function FieldBuilder({
  formId,
  fields,
  onFieldsChange,
}: FieldBuilderProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      alert('El nombre del campo es requerido');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/forms/${formId}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        onFieldsChange(data.form.fields);
        setFormData({ label: '', type: 'text', required: false, placeholder: '' });
        setIsAdding(false);
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      alert('Error al agregar campo');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('¿Eliminar este campo?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/forms/${formId}/fields`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldId }),
      });

      if (res.ok) {
        const data = await res.json();
        onFieldsChange(data.form.fields);
      } else {
        alert('Error al eliminar campo');
      }
    } catch (err) {
      alert('Error al eliminar campo');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveField = async (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = fields.findIndex(f => f.id === fieldId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === fields.length - 1)
    ) {
      return;
    }

    const newFields = [...fields];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];

    // Update order numbers
    newFields.forEach((field, idx) => {
      field.order = idx + 1;
    });

    setIsLoading(true);
    try {
      const res = await fetch(`/api/forms/${formId}/fields/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: newFields }),
      });

      if (res.ok) {
        const data = await res.json();
        onFieldsChange(data.form.fields);
      } else {
        alert('Error al reordenar campo');
      }
    } catch (err) {
      alert('Error al reordenar campo');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Field Form */}
      {isAdding && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Campo</h3>
          <form onSubmit={handleAddField} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Campo *
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Ej: Nombre, Email, etc"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Campo *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder (opcional)
              </label>
              <input
                type="text"
                value={formData.placeholder}
                onChange={(e) =>
                  setFormData({ ...formData, placeholder: e.target.value })
                }
                placeholder="Texto que aparece dentro del campo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) =>
                  setFormData({ ...formData, required: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="required"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Campo requerido
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
              >
                {isLoading ? 'Agregando...' : 'Agregar Campo'}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Field Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + Agregar Campo
        </button>
      )}

      {/* Fields List */}
      {fields && fields.length > 0 ? (
        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition flex justify-between items-start gap-4"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{field.label}</p>
                <div className="flex gap-2 mt-1">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {FIELD_TYPES.find((t) => t.value === field.type)?.label ||
                      field.type}
                  </span>
                  {field.required && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                      Requerido
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveField(field.id, 'up')}
                  disabled={idx === 0 || isLoading}
                  className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Mover arriba"
                >
                  ⬆️
                </button>
                <button
                  onClick={() => handleMoveField(field.id, 'down')}
                  disabled={idx === fields.length - 1 || isLoading}
                  className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Mover abajo"
                >
                  ⬇️
                </button>
                <button
                  onClick={() => handleDeleteField(field.id)}
                  disabled={isLoading}
                  className="p-2 text-gray-600 hover:text-red-600 disabled:opacity-50 transition"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isAdding && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600 mb-4">No hay campos aún</p>
            <p className="text-sm text-gray-500">Comienza agregando tu primer campo</p>
          </div>
        )
      )}
    </div>
  );
}