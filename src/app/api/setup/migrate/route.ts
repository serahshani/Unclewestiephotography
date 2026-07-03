import { timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';
import { runDatabaseSeed } from '@/lib/database-seed';
import {
  isMigrationComplete,
  markMigrationComplete,
  readMigrationLock,
} from '@/lib/migration-lock';
import { runMigrations } from '@/lib/run-migrations';
import { getDatabaseUrl, getDatabaseTargetLabel } from '@/lib/database-url';

export const runtime = 'nodejs';
export const maxDuration = 300;

function verifyToken(provided: string | null, expected: string): boolean {
  if (!provided || provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

function htmlPage(title: string, body: string, status = 200) {
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1rem; color: #111; line-height: 1.6; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; }
    pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; font-size: 0.85rem; }
    .ok { color: #0f5132; }
    .err { color: #842029; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${body}
</body>
</html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    }
  );
}

export async function GET(request: NextRequest) {
  if (await isMigrationComplete()) {
    const lock = await readMigrationLock();
    return htmlPage(
      'Setup already completed',
      `<p class="err">Database setup has already been run and this route is disabled.</p>
       <p>Completed at: <strong>${lock?.completedAt ?? 'unknown'}</strong></p>
       <p>Remove <code>MIGRATION_SECRET</code> from your server environment for extra safety.</p>`,
      410
    );
  }

  const secret = process.env.MIGRATION_SECRET;
  if (!secret) {
    return htmlPage(
      'Setup not configured',
      '<p class="err">MIGRATION_SECRET is not set on the server.</p>',
      503
    );
  }

  const token = request.nextUrl.searchParams.get('token');
  if (!verifyToken(token, secret)) {
    return htmlPage('Unauthorized', '<p class="err">Invalid or missing setup token.</p>', 401);
  }

  const shouldSeed = request.nextUrl.searchParams.get('seed') === '1';
  const skipMigrate = request.nextUrl.searchParams.get('skipMigrate') === '1';

  try {
    process.env.DATABASE_URL = getDatabaseUrl();
    const migrationOutput = skipMigrate
      ? 'Migrations skipped (manual SQL import).'
      : runMigrations();

    if (shouldSeed) {
      await runDatabaseSeed();
    }

    await markMigrationComplete(shouldSeed);

    return htmlPage(
      'Database setup complete',
      `<p class="ok">Migrations applied successfully.</p>
       ${shouldSeed ? '<p class="ok">Initial data seed completed.</p>' : '<p>Seed was skipped. Add <code>&amp;seed=1</code> on first run if you need default content.</p>'}
       <p><strong>This setup URL is now permanently disabled.</strong></p>
       <p>Remove <code>MIGRATION_SECRET</code> from your server environment.</p>
       <pre>${migrationOutput.trim()}</pre>`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Setup failed';
    const target = getDatabaseTargetLabel();
    return htmlPage(
      'Setup failed',
      `<p class="err">${message}</p>
       <p>Database target: <code>${target}</code></p>
       <p><strong>Try this in cPanel env vars:</strong></p>
       <ul>
         <li><code>DB_HOST=localhost</code></li>
         <li><code>DB_SOCKET=/var/lib/mysql/mysql.sock</code> (or <code>/tmp/mysql.sock</code>)</li>
         <li>Do not use the shared IP for the live app.</li>
       </ul>
       <p>If migrate still fails, import SQL in phpMyAdmin then visit this URL with <code>&amp;skipMigrate=1&amp;seed=1</code></p>
       <p>Fix the issue and try again. This route remains available until setup succeeds.</p>`,
      500
    );
  }
}
