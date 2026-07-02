import { config } from 'dotenv';
import { getDatabaseUrl } from '../src/lib/database-url';
import { prisma } from '../src/lib/prisma';
import { runDatabaseSeed } from '../src/lib/database-seed';

config();
process.env.DATABASE_URL = getDatabaseUrl();

runDatabaseSeed()
  .then(() => {
    console.log('Seed completed successfully');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
