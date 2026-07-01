import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import { fileTypeFromBuffer } from 'file-type';

import {
  MAX_GALLERY_SIZE_BYTES,
  MAX_HERO_SIZE_BYTES,
  formatMaxHeroSizeLabel,
} from '@/lib/upload-limits';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_HERO_SIZE = MAX_HERO_SIZE_BYTES;
const MAX_GALLERY_SIZE = MAX_GALLERY_SIZE_BYTES;

const UPLOAD_PATH_REGEX = /^\/uploads\/(hero|gallery)\/[a-zA-Z0-9._-]+\.webp$/;
const LEGACY_PUBLIC_PATH_REGEX = /^\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp|gif)$/i;

export type UploadType = 'hero' | 'gallery';

export function isSafeImagePath(imagePath: string, type?: UploadType): boolean {
  if (!imagePath.startsWith('/') || imagePath.includes('..')) return false;
  if (imagePath.startsWith('/uploads/')) {
    if (type && !imagePath.startsWith(`/uploads/${type}/`)) return false;
    return UPLOAD_PATH_REGEX.test(imagePath);
  }
  return LEGACY_PUBLIC_PATH_REGEX.test(imagePath);
}

export function resolveUploadFilePath(imagePath: string): string | null {
  if (!UPLOAD_PATH_REGEX.test(imagePath)) return null;
  const relative = imagePath.replace(/^\//, '');
  const resolved = path.resolve(process.cwd(), 'public', relative);
  const uploadsRoot = path.resolve(process.cwd(), 'public', 'uploads');
  if (!resolved.startsWith(uploadsRoot + path.sep) && resolved !== uploadsRoot) {
    return null;
  }
  return resolved;
}

export async function processAndSaveImage(
  file: File,
  type: UploadType
): Promise<{ imagePath: string; filename: string }> {
  const maxSize = type === 'hero' ? MAX_HERO_SIZE : MAX_GALLERY_SIZE;
  if (file.size > maxSize) {
    throw new Error(
      `File too large. Maximum size is ${type === 'hero' ? formatMaxHeroSizeLabel() : '10MB'}`
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = await fileTypeFromBuffer(buffer);

  if (!detected || !ALLOWED_MIME.has(detected.mime)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed');
  }

  const sharp = (await import('sharp')).default;
  const optimized = await sharp(buffer)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const baseName = slugify(
    file.name.replace(/\.[^.]+$/, '') || 'image',
    { lower: true, strict: true }
  );
  const filename = `${baseName}-${Date.now()}.webp`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, optimized);

  return {
    imagePath: `/uploads/${type}/${filename}`,
    filename,
  };
}

export async function deleteUploadedFile(imagePath: string): Promise<void> {
  const filePath = resolveUploadFilePath(imagePath);
  if (!filePath) return;
  try {
    await unlink(filePath);
  } catch {
    // File may not exist
  }
}
