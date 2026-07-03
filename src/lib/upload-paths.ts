export const UPLOAD_IMAGE_PATH_REGEX =
  /^\/uploads\/(hero|gallery)\/[a-zA-Z0-9._-]+\.webp$/;

export const UPLOAD_VIDEO_PATH_REGEX =
  /^\/uploads\/videos\/[a-zA-Z0-9._-]+\.(mp4|webm|mov)$/;

export const LEGACY_PUBLIC_IMAGE_PATH_REGEX =
  /^\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp|gif)$/i;

export type UploadType = 'hero' | 'gallery' | 'video';

export function isSafeImagePath(imagePath: string, type?: UploadType): boolean {
  if (!imagePath.startsWith('/') || imagePath.includes('..')) return false;
  if (imagePath.startsWith('/uploads/')) {
    if (type && !imagePath.startsWith(`/uploads/${type}/`)) return false;
    return UPLOAD_IMAGE_PATH_REGEX.test(imagePath);
  }
  return LEGACY_PUBLIC_IMAGE_PATH_REGEX.test(imagePath);
}

export function isSafeVideoPath(videoPath: string): boolean {
  if (!videoPath.startsWith('/') || videoPath.includes('..')) return false;
  return UPLOAD_VIDEO_PATH_REGEX.test(videoPath);
}
