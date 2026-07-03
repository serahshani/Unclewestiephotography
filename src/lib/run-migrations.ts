import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getDatabaseUrl } from '@/lib/database-url';

function findPrismaCli(rootDir: string): string {
  const candidates = [path.join(rootDir, 'node_modules', 'prisma', 'build', 'index.js')];

  try {
    const pkgPath = require.resolve('prisma/package.json', { paths: [rootDir] });
    candidates.unshift(path.join(path.dirname(pkgPath), 'build', 'index.js'));
  } catch {
    // ignore
  }

  const home = process.env.HOME || '';
  if (home) {
    candidates.push(
      path.join(
        home,
        'nodevenv',
        'unclewestiephotography',
        '20',
        'lib',
        'node_modules',
        'prisma',
        'build',
        'index.js',
      ),
    );
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Prisma CLI not found. Run "npm install" on the server first.');
}

export function runMigrations(): string {
  process.env.DATABASE_URL = getDatabaseUrl();

  const rootDir = process.cwd();
  const prismaCli = findPrismaCli(rootDir);
  const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');

  const output = execSync(
    `node "${prismaCli}" migrate deploy --schema="${schemaPath}"`,
    {
      cwd: rootDir,
      env: process.env,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  );

  return output;
}
