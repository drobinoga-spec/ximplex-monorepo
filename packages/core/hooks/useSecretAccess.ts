'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseSecretAccessOptions {
  endpoint: string; // ej: '/api/auth/verify-secret'
  cookieName: string; // ej: 'ximplex_secret' o 'formix_secret'
  redirectUrl: string; // ej: '/my-desk'
}

export function useSecretAccess(options: UseSecretAccessOptions) {
  const { endpoint, cookieName, redirectUrl } = options;
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCopyrightClick = () => {
    setShowModal(true);
    setPasswordInput('');
    setErrorMessage('');
  };

  const handlePasswordSubmit = async (password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        // Guardar cookie válida por 24 horas
        document.cookie = `${cookieName}=${token}; path=/; max-age=86400`;
        setShowModal(false);
        router.push(redirectUrl);
      } else {
        setErrorMessage('Contraseña incorrecta');
        setPasswordInput('');
      }
    } catch (error) {
      console.error('Error verificando contraseña:', error);
      setErrorMessage('Error verificando contraseña');
      setPasswordInput('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setPasswordInput('');
    setErrorMessage('');
  };

  return {
    showModal,
    passwordInput,
    errorMessage,
    isLoading,
    handleCopyrightClick,
    handlePasswordSubmit,
    handleModalCancel,
    setPasswordInput,
  };
}