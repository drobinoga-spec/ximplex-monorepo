// Almacenar sesiones en memoria (en prod, usar Redis o DB)
const secretSessions = new Map<string, { ip: string; createdAt: number }>();

export function createSecretSession(ip: string): string {
  const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  secretSessions.set(token, { ip, createdAt: Date.now() });
  return token;
}

export function validateSecretSession(token: string, currentIp: string): boolean {
  const session = secretSessions.get(token);
  
  if (!session) return false;
  
  // Validar IP
  if (session.ip !== currentIp) return false;
  
  // Validar que no haya expirado (24 horas)
  const expirationTime = 86400000; // 24 horas en milisegundos
  if (Date.now() - session.createdAt > expirationTime) {
    secretSessions.delete(token);
    return false;
  }
  
  return true;
}