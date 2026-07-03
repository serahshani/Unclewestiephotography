import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import { fileTypeFromBuffer } from 'file-type';

import {
  MAX_GALLERY_SIZE_BYTES,
  MAX_HERO_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  formatMaxHeroSizeLabel,
  formatMaxGallerySizeLabel,
  formatMaxVideoSizeLabel,
} from '@/lib/upload-limits';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_VIDEO_MIME = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
const MAX_HERO_SIZE = MAX_HERO_SIZE_BYTES;
const MAX_GALLERY_SIZE = MAX_GALLERY_SIZE_BYTES;
const MAX_VIDEO_SIZE = MAX_VIDEO_SIZE_BYTES;

import {
  isSafeImagePath,
  isSafeVideoPath,
  UPLOAD_IMAGE_PATH_REGEX,
  UPLOAD_VIDEO_PATH_REGEX,
  type UploadType,
} from '@/lib/upload-paths';

export type { UploadType } from '@/lib/upload-paths';
export { isSafeImagePath, isSafeVideoPath } from '@/lib/upload-paths';

const VIDEO_EXT_BY_MIME: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

export function resolveUploadFilePath(imagePath: string): string | null {
  if (!UPLOAD_IMAGE_PATH_REGEX.test(imagePath) && !UPLOAD_VIDEO_PATH_REGEX.test(imagePath)) {
    return null;
  }
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
      `File too large. Maximum size is ${type === 'hero' ? formatMaxHeroSizeLabel() : formatMaxGallerySizeLabel()}`
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

export async function processAndSaveVideo(
  file: File
): Promise<{ videoPath: string; filename: string }> {
  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error(`File too large. Maximum size is ${formatMaxVideoSizeLabel()}`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = await fileTypeFromBuffer(buffer);

  if (!detected || !ALLOWED_VIDEO_MIME.has(detected.mime)) {
    throw new Error('Invalid file type. Only MP4, WebM, and MOV are allowed');
  }

  const ext = VIDEO_EXT_BY_MIME[detected.mime];
  if (!ext) {
    throw new Error('Unsupported video format');
  }

  const baseName = slugify(
    file.name.replace(/\.[^.]+$/, '') || 'video',
    { lower: true, strict: true }
  );
  const filename = `${baseName}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return {
    videoPath: `/uploads/videos/${filename}`,
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
