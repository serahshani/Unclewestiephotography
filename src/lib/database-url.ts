function encodePassword(password: string): string {
  return encodeURIComponent(password);
}

export function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
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

  return `mysql://${username}:${encodePassword(password)}@${host}:${port}/${database}`;
}
