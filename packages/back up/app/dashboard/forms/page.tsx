'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Form {
  id: string;
  name: string;
  description: string;
  created_at: string;
  message_count?: number;
}

export default function FormsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.id) {
      loadForms();
    }
  }, [session?.user?.id, status, router]);

  const loadForms = async () => {
    try {
      const res = await fetch('/api/client/forms');
      if (res.ok) {
        const data = await res.json();
        setForms(data);
      }
    } catch (error) {
      console.error('Failed to load forms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mis Formularios</h1>
          <Link
            href="/dashboard/forms/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Nuevo Formulario
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center text-gray-500">Cargando...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Aún no tienes formularios</p>
            <Link
              href="/dashboard/forms/new"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Crear el primero
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {form.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {form.description || 'Sin descripción'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {form.message_count || 0} respuestas
                  </span>
                  <Link
                    href={`/dashboard/forms/${form.id}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    Ver →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}