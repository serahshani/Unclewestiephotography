import { access, mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const LOCK_FILE = path.join(DATA_DIR, 'migration-complete.json');

export type MigrationLockRecord = {
  completedAt: string;
  seeded: boolean;
};

export async function isMigrationComplete(): Promise<boolean> {
  try {
    await access(LOCK_FILE);
    return true;
  } catch {
    return false;
  }
}

export async function readMigrationLock(): Promise<MigrationLockRecord | null> {
  try {
    const raw = await readFile(LOCK_FILE, 'utf8');
    return JSON.parse(raw) as MigrationLockRecord;
  } catch {
    return null;
  }
}

export async function markMigrationComplete(seeded: boolean): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const record: MigrationLockRecord = {
    completedAt: new Date().toISOString(),
    seeded,
  };
  await writeFile(LOCK_FILE, JSON.stringify(record, null, 2), 'utf8');
}
