import { execSync } from 'child_process';
import { config } from 'dotenv';
import { getDatabaseUrl } from '../src/lib/database-url';

config();
process.env.DATABASE_URL = getDatabaseUrl();

const command = process.argv.slice(2).join(' ');
if (!command) {
  console.error('No command provided');
  process.exit(1);
}

execSync(command, { stdio: 'inherit', env: process.env });
