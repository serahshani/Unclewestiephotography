import { isSafeImagePath } from '@/lib/upload-paths';

export function normalizeImagePath(imagePath: string | null | undefined): string {
  if (!imagePath || typeof imagePath !== 'string') return '';
  const trimmed = imagePath.trim();
  if (!trimmed.startsWith('/') || trimmed.includes('..')) return '';
  return trimmed;
}

export function isUploadedAssetPath(imagePath: string): boolean {
  return imagePath.startsWith('/uploads/');
}

/** Paths stored after admin upload should be served as-is in production. */
export function isTrustedStoredImagePath(imagePath: string): boolean {
  const normalized = normalizeImagePath(imagePath);
  if (!normalized) return false;
  if (isUploadedAssetPath(normalized)) {
    return (
      isSafeImagePath(normalized, 'gallery') ||
      isSafeImagePath(normalized, 'hero') ||
      /^\/uploads\/videos\/[a-zA-Z0-9._-]+\.(mp4|webm|mov)$/.test(normalized)
    );
  }
  return isSafeImagePath(normalized);
}

export function shouldUseUnoptimizedImage(imagePath: string): boolean {
  return isUploadedAssetPath(normalizeImagePath(imagePath));
}
