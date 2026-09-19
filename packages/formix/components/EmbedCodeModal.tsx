'use client';

import { useState, useEffect } from 'react';

interface EmbedCodeModalProps {
  formId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmbedCodeModal({
  formId,
  isOpen,
  onClose,
}: EmbedCodeModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && !code) {
      fetchEmbedCode();
    }
  }, [isOpen]);

  const fetchEmbedCode = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/forms/${formId}/embed-code`);
      if (res.ok) {
        const data = await res.json();
        setCode(data.code);
      } else {
        setError('Error al obtener el código');
      }
    } catch (err) {
      setError('Error al obtener el código');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Error al copiar');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Código Embebible</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Copia este código y pégalo en tu sitio web donde quieras que aparezca el formulario:
          </p>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Generando código...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              {/* Code Display */}
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <pre className="p-4 text-sm text-gray-100 font-mono overflow-x-auto">
                  {code}
                </pre>
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? '✓ Copiado al portapapeles' : 'Copiar Código'}
              </button>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-blue-900">¿Cómo usarlo?</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Copia el código arriba</li>
                  <li>Abre el HTML de tu sitio web</li>
                  <li>Pega el código donde quieras que aparezca el formulario</li>
                  <li>¡Listo! El formulario se cargará automáticamente</li>
                </ol>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
