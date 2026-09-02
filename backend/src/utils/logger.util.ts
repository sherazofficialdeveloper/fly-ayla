/**
 * Professional Operational Logger for Fly Ayla Enterprise Server
 * Automatically redacts sensitive fields like passwords, secrets, and authorization headers
 */

const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'secret', 'key', 'apiKey', 'creditCard', 'cvv'];

function redactSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(redactSensitiveData);

  const redacted: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      redacted[key] = redactSensitiveData(val);
    } else {
      redacted[key] = val;
    }
  }
  return redacted;
}

export class Logger {
  static info(message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    if (meta) {
      console.log(`[INFO] [${timestamp}] ${message}`, JSON.stringify(redactSensitiveData(meta)));
    } else {
      console.log(`[INFO] [${timestamp}] ${message}`);
    }
  }

  static warn(message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    if (meta) {
      console.warn(`[WARN] [${timestamp}] ${message}`, JSON.stringify(redactSensitiveData(meta)));
    } else {
      console.warn(`[WARN] [${timestamp}] ${message}`);
    }
  }

  static error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    if (error instanceof Error) {
      console.error(`[ERROR] [${timestamp}] ${message}: ${error.message}`);
    } else if (error) {
      console.error(`[ERROR] [${timestamp}] ${message}`, JSON.stringify(redactSensitiveData(error)));
    } else {
      console.error(`[ERROR] [${timestamp}] ${message}`);
    }
  }
}
