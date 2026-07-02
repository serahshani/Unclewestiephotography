export const MAX_HERO_SIZE_BYTES = 50 * 1024 * 1024;
export const MAX_GALLERY_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;

export function formatMaxHeroSizeLabel(): string {
  return '50MB';
}

export function formatMaxGallerySizeLabel(): string {
  return '10MB';
}

export function formatMaxVideoSizeLabel(): string {
  return '100MB';
}
