'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Message {
  id: string;
  data: Record<string, any>;
  submitted_at: string;
  whatsapp_sent: boolean;
}

interface FormInfo {
  id: string;
  name: string;
  description: string;
  fields: any[];
}

export default function FormMessagesPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [formInfo, setFormInfo] = useState<FormInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchData();
  }, [formId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Obtener respuestas
      const messagesRes = await fetch(`/api/client/forms/messages?formId=${formId}`);
      if (!messagesRes.ok) {
        if (messagesRes.status === 401) {
          router.push('/auth/signin');
          return;
        }
        throw new Error('Error al cargar respuestas');
      }

      const messagesData = await messagesRes.json();
      setMessages(Array.isArray(messagesData) ? messagesData : []);

      // Obtener info del formulario
      const formsRes = await fetch('/api/client/forms');
      if (formsRes.ok) {
        const formsData = await formsRes.json();
        const form = formsData.find((f: any) => f.id === formId);
        if (form) {
          setFormInfo(form);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return JSON.stringify(msg.data).toLowerCase().includes(searchLower);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center space-y-4">
              <div className="animate-spin inline-block">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full"></div>
              </div>
              <p className="text-slate-600">Cargando respuestas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/forms" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Volver a formularios
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{formInfo?.name || 'Formulario'}</h1>
          {formInfo?.description && (
            <p className="text-slate-600 mt-2">{formInfo.description}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-slate-600 text-sm">Total de respuestas</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{messages.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-slate-600 text-sm">Respuestas hoy</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {messages.filter(m => {
                const date = new Date(m.submitted_at);
                const today = new Date();
                return date.toDateString() === today.toDateString();
              }).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-slate-600 text-sm">Enviadas a WhatsApp</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {messages.filter(m => m.whatsapp_sent).length}
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Search bar */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <input
            type="text"
            placeholder="Buscar en respuestas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Messages Table */}
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {messages.length === 0 ? 'Sin respuestas aún' : 'No se encontraron resultados'}
            </h2>
            <p className="text-slate-600">
              {messages.length === 0
                ? 'Comparte tu formulario para empezar a recibir respuestas'
                : 'Intenta con otro término de búsqueda'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Respuesta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">WhatsApp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredMessages.map((message) => (
                    <tr key={message.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {formatDate(message.submitted_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="max-w-xs truncate">
                          {Object.entries(message.data)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(' • ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          message.whatsapp_sent
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {message.whatsapp_sent ? '✓ Enviado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Detalles de respuesta</h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-500 hover:text-slate-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Fecha de envío</p>
                <p className="text-lg font-semibold text-slate-900">
                  {formatDate(selectedMessage.submitted_at)}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600 mb-3">Respuestas</p>
                <div className="space-y-2">
                  {Object.entries(selectedMessage.data).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-600">{key}</p>
                      <p className="text-slate-900 font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">Estado WhatsApp</p>
                <p className={`font-semibold mt-2 ${
                  selectedMessage.whatsapp_sent ? 'text-green-600' : 'text-slate-600'
                }`}>
                  {selectedMessage.whatsapp_sent ? '✓ Enviado a WhatsApp' : 'Pendiente de envío'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}