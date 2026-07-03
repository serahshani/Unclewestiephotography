import fs from 'fs';

function encodePassword(password: string): string {
  return encodeURIComponent(password);
}

function appendQueryParam(url: string, key: string, value: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${key}=${encodeURIComponent(value)}`;
}

function resolveMysqlSocket(): string | undefined {
  const configured = process.env.DB_SOCKET?.trim();
  if (configured) return configured;

  if (process.platform !== 'linux') return undefined;

  const candidates = [
    '/var/lib/mysql/mysql.sock',
    '/tmp/mysql.sock',
    '/var/run/mysqld/mysqld.sock',
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch {
      // ignore permission errors
    }
  }

  return undefined;
}

export function getDatabaseUrl(): string {
  const socket = resolveMysqlSocket();

  if (process.env.DATABASE_URL) {
    if (socket && !process.env.DATABASE_URL.includes('socket=')) {
      return appendQueryParam(process.env.DATABASE_URL, 'socket', socket);
    }
    return process.env.DATABASE_URL;
  }

  const connection = process.env.DB_CONNECTION ?? 'mysql';
  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '3306';
  const database = process.env.DB_DATABASE ?? 'unclewestie';
  const username = process.env.DB_USERNAME ?? 'root';
  const password = process.env.DB_PASSWORD ?? '';

  if (connection !== 'mysql') {
    throw new Error(`Unsupported DB_CONNECTION: ${connection}`);
  }

  let url = `mysql://${username}:${encodePassword(password)}@${host}:${port}/${database}`;

  if (socket) {
    url = appendQueryParam(url, 'socket', socket);
  }

  return url;
}

export function getDatabaseTargetLabel(): string {
  const socket = resolveMysqlSocket();
  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '3306';
  const database = process.env.DB_DATABASE ?? '(not set)';

  if (socket) {
    return `${host} (socket: ${socket}) / ${database}`;
  }

  return `${host}:${port} / ${database}`;
}
