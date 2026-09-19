'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import WhatsAppSettings from '@/components/WhatsAppSettings';

interface UserProfile {
  whatsapp_phone: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/settings/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleSavePhone = (phone: string) => {
    if (profile) {
      setProfile({ ...profile, whatsapp_phone: phone });
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Acceso denegado</p>
          <Link href="/" className="text-purple-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-purple-600 hover:underline mb-4 inline-block"
          >
            ← Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Configuración</h1>
          <p className="text-gray-600">Personaliza tu experiencia en Formix</p>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Información de Cuenta
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {session.user?.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="text-lg font-semibold text-purple-600">
                Free (Próximamente: Professional $12/mes)
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Settings */}
        {profile && (
          <WhatsAppSettings
            userId={session.user?.id || ''}
            currentPhone={profile.whatsapp_phone || ''}
            onSave={handleSavePhone}
          />
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">
            💡 Próximas Configuraciones
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Configuración de facturación (próximamente)</li>
            <li>✓ Integración de Google Analytics (próximamente)</li>
            <li>✓ Preferencias de notificación (próximamente)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}