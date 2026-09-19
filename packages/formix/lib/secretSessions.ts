interface SecretSession {
  ip: string;
  createdAt: number;
}

// Map en memoria para almacenar sesiones secretas
const secretSessions = new Map<string, SecretSession>();

/**
 * Crea una nueva sesión secreta para una IP específica
 * Devuelve un token único válido por 24 horas desde esa IP
 */
export function createSecretSession(ip: string): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  secretSessions.set(token, {
    ip,
    createdAt: Date.now(),
  });
  return token;
}

/**
 * Valida un token secreto verificando:
 * 1. El token existe
 * 2. La IP actual coincide con la IP de creación
 * 3. El token no ha expirado (24 horas)
 */
export function validateSecretSession(token: string, currentIp: string): boolean {
  const session = secretSessions.get(token);
  if (!session) return false;

  // Verificar que la IP coincida
  if (session.ip !== currentIp) return false;

  // Verificar que no haya expirado (24 horas = 86400000 ms)
  if (Date.now() - session.createdAt > 86400000) return false;

  return true;
}