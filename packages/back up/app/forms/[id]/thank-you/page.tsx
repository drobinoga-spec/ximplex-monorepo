'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ThankYouPage() {
  const params = useParams();
  const formId = params.id as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Mensaje Recibido!
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Tu solicitud ha sido enviada exitosamente.
          <br />
          <br />
          Alguien del equipo se pondrá en contacto contigo
          <br />
          lo más pronto posible.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">
              Tu mensaje es importante para nosotros.
            </span>
            <br />
            Apreciamos tu paciencia.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}