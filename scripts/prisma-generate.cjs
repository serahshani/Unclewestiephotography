const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const rootDir = path.join(__dirname, '..');
const clientDir = path.join(rootDir, 'src', 'generated', 'prisma');
const clientIndex = path.join(clientDir, 'index.js');

function detectLinuxMysqlSocket() {
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
      // ignore
    }
  }
  return undefined;
}

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const username = process.env.DB_USERNAME || 'root';
  const password = encodeURIComponent(process.env.DB_PASSWORD || '');
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '3306';
  const database = process.env.DB_DATABASE || 'unclewestie';
  const socket = process.env.DB_SOCKET?.trim() || detectLinuxMysqlSocket();

  let url = `mysql://${username}:${password}@${host}:${port}/${database}`;
  if (socket) {
    url += `?socket=${encodeURIComponent(socket)}`;
  }
  return url;
}

function findPrismaCli() {
  const candidates = [
    path.join(rootDir, 'node_modules', 'prisma', 'build', 'index.js'),
  ];

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

  return null;
}

process.env.DATABASE_URL = getDatabaseUrl();

const prismaCli = findPrismaCli();
if (!prismaCli) {
  console.error('Prisma CLI not found. Run "npm install" first.');
  process.exit(1);
}

console.log('Using Prisma CLI:', prismaCli);
console.log('Generating client into:', clientDir);

try {
  execSync(`node "${prismaCli}" generate --schema="${path.join(rootDir, 'prisma', 'schema.prisma')}"`, {
    stdio: 'inherit',
    env: process.env,
    cwd: rootDir,
  });
} catch {
  console.error('\nPrisma generate failed. Ensure DATABASE_URL or DB_* env vars are set.');
  process.exit(1);
}

if (!fs.existsSync(clientIndex)) {
  console.error('\nPrisma generate finished but client is missing at:', clientIndex);
  process.exit(1);
}

const linuxEngine = path.join(clientDir, 'query-engine-debian-openssl-1.1.x');
if (process.platform === 'linux') {
  if (!fs.existsSync(linuxEngine)) {
    console.error('\nLinux query engine missing after generate:', linuxEngine);
    console.error('Upload query-engine-debian-openssl-1.1.x from your PC or run npm run prisma:generate on the server.');
    process.exit(1);
  }
  fs.chmodSync(linuxEngine, 0o755);
}

console.log('Prisma client ready:', clientIndex);
if (fs.existsSync(linuxEngine)) {
  console.log('Linux engine ready:', linuxEngine);
}
