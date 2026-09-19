'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import FieldBuilder, { Field } from '@/components/FieldBuilder';
import FormPreview from '@/components/FormPreview';
import EmbedCodeModal from '@/components/EmbedCodeModal';
import EditFormModal from '@/components/EditFormModal';
import WhatsAppConfigSection from '@/components/WhatsAppConfigSection';

interface Form {
  id: string;
  name: string;
  description: string;
  fields: Field[];
  status: string;
  whatsapp_phone?: string;
}

export default function FormDetailPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        if (res.ok) {
          const data = await res.json();
          setForm(data.form);
        } else {
          setError('Formulario no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el formulario');
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const handleFieldsChange = async (updatedFields: Field[]) => {
    if (!form) return;

    const res = await fetch(`/api/forms/${formId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: updatedFields }),
    });

    if (res.ok) {
      const data = await res.json();
      setForm(data.form);
    }
  };

  const handleEditForm = async (name: string, description: string) => {
    const res = await fetch(`/api/forms/${formId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      const data = await res.json();
      setForm(data.form);
      setShowEditModal(false);
    }
  };

  const handlePhoneChange = (newPhone: string) => {
    if (form) {
      setForm({ ...form, whatsapp_phone: newPhone });
    }
  };

  const handleDeleteForm = async () => {
    const res = await fetch(`/api/forms/${formId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      router.push('/dashboard/forms');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Cargando formulario...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Formulario no encontrado'}</p>
          <Link href="/dashboard/forms" className="text-purple-600 hover:underline">
            Volver a formularios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard/forms"
            className="text-purple-600 hover:underline mb-4 inline-block"
          >
            ← Volver a Formularios
          </Link>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{form.name}</h1>
              <p className="text-gray-600">{form.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <FieldBuilder
              formId={formId}
              fields={form.fields}
              onFieldsChange={handleFieldsChange}
            />
          </div>

          <div>
            <div className="sticky top-8">
              <FormPreview fields={form.fields} formName={form.name} />
            </div>
          </div>
        </div>

        <div className="mb-12">
          <WhatsAppConfigSection
            formId={formId}
            formName={form.name}
            currentPhone={form.whatsapp_phone || ''}
            fields={form.fields}
            onPhoneChange={handlePhoneChange}
          />
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowEmbedModal(true)}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
          >
            📋 Obtener Código Embebible
          </button>
        </div>

        {showEmbedModal && (
          <EmbedCodeModal
            formId={formId}
            isOpen={showEmbedModal}
            onClose={() => setShowEmbedModal(false)}
          />
        )}

        {showEditModal && (
          <EditFormModal
            formId={formId}
            isOpen={showEditModal}
            formName={form.name}
            formDescription={form.description}
            onSave={handleEditForm}
            onClose={() => setShowEditModal(false)}
          />
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                ¿Eliminar formulario?
              </h2>
              <p className="text-gray-600 mb-6">
                Esta acción no se puede deshacer. Todos los leads asociados también se eliminarán.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteForm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}