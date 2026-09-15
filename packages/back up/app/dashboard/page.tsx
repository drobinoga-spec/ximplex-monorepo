'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Form {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  whatsapp_phone: string;
}

export default function FormsListPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/client/forms');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        throw new Error('Error al cargar formularios');
      }

      const data = await response.json();
      setForms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
              ← Volver
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Mis Formularios</h1>
            <p className="text-slate-600 mt-2">Gestiona tus formularios y respuestas</p>
          </div>
          <Link
            href="/dashboard/forms/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            + Crear formulario
          </Link>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar formularios..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center space-y-4">
              <div className="animate-spin inline-block">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full"></div>
              </div>
              <p className="text-slate-600">Cargando formularios...</p>
            </div>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {forms.length === 0 ? 'No tienes formularios aún' : 'No se encontraron resultados'}
            </h2>
            <p className="text-slate-600 mb-6">
              {forms.length === 0
                ? 'Crea tu primer formulario para empezar a recopilar respuestas'
                : 'Intenta con otro término de búsqueda'}
            </p>
            {forms.length === 0 && (
              <Link
                href="/dashboard/forms/new"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Crear formulario
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredForms.map(form => (
              <div
                key={form.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{form.name}</h3>
                    {form.description && (
                      <p className="text-slate-600 text-sm mt-1">{form.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      form.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {form.status === 'active' ? '● Activo' : '● Inactivo'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-slate-600">Creado</p>
                    <p className="text-slate-900 font-medium">{formatDate(form.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Actualizado</p>
                    <p className="text-slate-900 font-medium">{formatDate(form.updated_at)}</p>
                  </div>
                  {form.whatsapp_phone && (
                    <div>
                      <p className="text-slate-600">WhatsApp</p>
                      <p className="text-slate-900 font-medium text-xs">{form.whatsapp_phone}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/forms/${form.id}`}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition"
                  >
                    Ver respuestas
                  </Link>
                  <Link
                    href={`/dashboard/forms/${form.id}/edit`}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium transition"
                  >
                    Editar
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