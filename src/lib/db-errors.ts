export function getDatabaseErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('sha256_password') || message.includes('authentication plugin')) {
    return 'Database connection failed. MySQL authentication is not configured correctly.';
  }

  if (
    message.includes('ECONNREFUSED') ||
    message.includes("Can't reach database") ||
    message.includes("Can't reach database server") ||
    message.includes('P1001') ||
    message.includes('connect ETIMEDOUT')
  ) {
    return 'Unable to reach the database. Set DB_SOCKET in cPanel (e.g. /var/lib/mysql/mysql.sock).';
  }

  if (message.includes('did not initialize')) {
    return 'Database client not ready. Run prisma:generate on the server, then restart the app.';
  }

  if (message.includes('Access denied')) {
    return 'Database access denied. Please check your database credentials.';
  }

  if (message.includes('Unknown database')) {
    return 'Database not found. Please run migrations before signing in.';
  }

  return 'Service temporarily unavailable. Please try again later.';
}
