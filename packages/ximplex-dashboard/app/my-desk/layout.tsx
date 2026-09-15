'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyDeskLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 1. Primero chequea si existe la cookie secreta
    const secretCookie = document.cookie.split('; ').find(row => row.startsWith('formix_secret='));
    if (secretCookie) {
      // Si tiene la cookie, permite acceso directo
      return;
    }

    // 2. Si no tiene cookie, chequea NextAuth session
    if (status === 'unauthenticated') {
      signIn();
    }

    if (session && session.user?.email !== 'drobinoga@gmail.com') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Verificando acceso...</p>
      </div>
    );
  }

  // Permitir si tiene cookie O si tiene sesión válida
  const secretCookie = document.cookie.split('; ').find(row => row.startsWith('formix_secret='));
  if (!secretCookie && (!session || session.user?.email !== 'drobinoga@gmail.com')) {
    return null;
  }

  return <>{children}</>;
}