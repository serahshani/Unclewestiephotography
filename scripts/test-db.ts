import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from '../src/lib/database-url';

config();

async function test(label: string, url: string) {
  process.env.DATABASE_URL = url;
  const prisma = new PrismaClient({
    datasources: { db: { url } },
  });

  try {
    const count = await prisma.admin.count();
    console.log(`${label}: OK (${count} admin(s))`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`${label}: FAIL - ${message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const base = getDatabaseUrl();
  await test('localhost URL', base);
  await test('127.0.0.1 URL', base.replace('@localhost:', '@127.0.0.1:'));
}

main();
