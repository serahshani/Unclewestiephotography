import { execSync } from 'child_process';
import path from 'path';
import { getDatabaseUrl } from '@/lib/database-url';

export function runMigrations(): string {
  process.env.DATABASE_URL = getDatabaseUrl();

  const prismaCli = path.join(process.cwd(), 'node_modules', 'prisma', 'build', 'index.js');
  const output = execSync(`node "${prismaCli}" migrate deploy`, {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  return output;
}
