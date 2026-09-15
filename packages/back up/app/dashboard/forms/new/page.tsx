'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description: string;
  quality: 'ugly' | 'regular' | 'beautiful';
  preview: React.ReactNode;
  style: {
    formBg: string;
    inputBg: string;
    inputBorder: string;
    buttonColor: string;
    textColor: string;
    spacing: string;
  };
}

export default function NewFormPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [fields, setFields] = useState<string[]>(['name', 'email', 'phone']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Cargar campos del wizard
    const savedFields = localStorage.getItem('wizardFields');
    if (savedFields) {
      try {
        setFields(JSON.parse(savedFields));
      } catch (e) {
        console.error('Failed to parse wizard fields:', e);
      }
    }
  }, [status, router]);

  const templates: Template[] = [
    {
      id: 'minimal',
      name: 'Mínimo',
      description: 'Lo más simple',
      quality: 'ugly',
      preview: (
        <div className="bg-white p-6 space-y-4">
          <div className="space-y-1">
            <div className="text-xs text-gray-400">Nombre</div>
            <div className="border border-gray-200 px-2 py-1 text-xs text-gray-400">
              Nombre...
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-400">Email</div>
            <div className="border border-gray-200 px-2 py-1 text-xs text-gray-400">
              Email...
            </div>
          </div>
          <button className="w-full bg-gray-300 text-gray-600 px-2 py-1 text-xs">
            Enviar
          </button>
        </div>
      ),
      style: {
        formBg: 'bg-white',
        inputBg: 'bg-white',
        inputBorder: 'border border-gray-200',
        buttonColor: 'bg-gray-400',
        textColor: 'text-gray-700',
        spacing: 'space-y-3',
      },
    },
    {
      id: 'classic',
      name: 'Clásico',
      description: 'Limpio y profesional',
      quality: 'regular',
      preview: (
        <div className="bg-gray-50 p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-500"
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-500"
              disabled
            />
          </div>
          <button className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm font-semibold">
            Enviar
          </button>
        </div>
      ),
      style: {
        formBg: 'bg-gray-50',
        inputBg: 'bg-white',
        inputBorder: 'border border-gray-300',
        buttonColor: 'bg-gray-800',
        textColor: 'text-gray-700',
        spacing: 'space-y-4',
      },
    },
    {
      id: 'gradient',
      name: 'Moderno',
      description: 'Con colores vivos',
      quality: 'regular',
      preview: (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-indigo-900">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg bg-white text-xs text-gray-500 focus:border-indigo-400"
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-indigo-900">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg bg-white text-xs text-gray-500 focus:border-indigo-400"
              disabled
            />
          </div>
          <button className="w-full bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
            Enviar
          </button>
        </div>
      ),
      style: {
        formBg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
        inputBg: 'bg-white',
        inputBorder: 'border border-indigo-200',
        buttonColor: 'bg-indigo-600',
        textColor: 'text-indigo-900',
        spacing: 'space-y-4',
      },
    },
    {
      id: 'elegant',
      name: 'Elegante',
      description: 'Diseño premium',
      quality: 'beautiful',
      preview: (
        <div className="bg-white p-8 space-y-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Formulario</h3>
            <p className="text-xs text-gray-500 mt-1">
              Cuéntanos más sobre ti
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-800 tracking-wide">
              NOMBRE
            </label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 focus:bg-white focus:border-blue-400"
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-800 tracking-wide">
              EMAIL
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 focus:bg-white focus:border-blue-400"
              disabled
            />
          </div>
          <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition mt-4">
            Enviar Respuesta
          </button>
        </div>
      ),
      style: {
        formBg: 'bg-white',
        inputBg: 'bg-gray-50',
        inputBorder: 'border border-gray-200',
        buttonColor: 'bg-blue-600',
        textColor: 'text-gray-900',
        spacing: 'space-y-5',
      },
    },
    {
      id: 'card',
      name: 'Tarjeta',
      description: 'Estilo card moderno',
      quality: 'regular',
      preview: (
        <div className="bg-gradient-to-b from-blue-500 to-blue-600 p-6 rounded-2xl text-white space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-blue-100">
              NOMBRE
            </label>
            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-blue-100 text-xs border border-white border-opacity-30"
              disabled
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-blue-100">
              EMAIL
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-blue-100 text-xs border border-white border-opacity-30"
              disabled
            />
          </div>
          <button className="w-full bg-white text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold">
            Enviar
          </button>
        </div>
      ),
      style: {
        formBg: 'bg-gradient-to-b from-blue-500 to-blue-600',
        inputBg: 'bg-white',
        inputBorder: 'border border-blue-300',
        buttonColor: 'bg-white',
        textColor: 'text-white',
        spacing: 'space-y-4',
      },
    },
  ];

  const handleSelectTemplate = async (templateId: string) => {
    setSelectedTemplate(templateId);
    setLoading(true);

    try {
      const res = await fetch('/api/client/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Nuevo Formulario',
          description: 'Formulario creado desde template',
          template_id: templateId,
          fields: fields,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/forms/${data.id}/edit`);
      } else {
        alert('Error al crear formulario');
      }
    } catch (error) {
      console.error('Failed to create form:', error);
      alert('Error al crear formulario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard/forms" className="text-blue-600 hover:text-blue-700">
            ← Volver
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">
            Elige un Diseño
          </h1>
          <p className="text-gray-600">
            Selecciona un template para comenzar. Podrás editarlo después.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group cursor-pointer"
              onClick={() => handleSelectTemplate(template.id)}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border-2 border-transparent hover:border-blue-400">
                {/* Preview */}
                <div className="p-6 bg-gray-100 min-h-64 flex items-center justify-center overflow-hidden">
                  {template.preview}
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                    </div>
                    {template.quality === 'beautiful' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                        ⭐ Top
                      </span>
                    )}
                  </div>

                  <button
                    disabled={loading && selectedTemplate === template.id}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    {loading && selectedTemplate === template.id
                      ? 'Creando...'
                      : 'Usar este'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}