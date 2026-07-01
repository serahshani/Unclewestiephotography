export function getDatabaseErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('sha256_password') || message.includes('authentication plugin')) {
    return 'Database connection failed. MySQL authentication is not configured correctly.';
  }

  if (
    message.includes('ECONNREFUSED') ||
    message.includes("Can't reach database") ||
    message.includes('connect ETIMEDOUT')
  ) {
    return 'Unable to reach the database. Please ensure MySQL is running and try again.';
  }

  if (message.includes('Access denied')) {
    return 'Database access denied. Please check your database credentials.';
  }

  if (message.includes('Unknown database')) {
    return 'Database not found. Please run migrations before signing in.';
  }

  return 'Service temporarily unavailable. Please try again later.';
}
