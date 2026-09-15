'use client';

import { useSession } from 'next-auth/react';

export function useSessionSafe() {
  const session = useSession();
  return session || { data: null, status: 'loading' };
}