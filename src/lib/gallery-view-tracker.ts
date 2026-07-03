const SESSION_PREFIX = 'gallery-view:';

function isTrackableGalleryId(id: string): boolean {
  return Boolean(id) && !id.startsWith('default-gallery-');
}

export function trackGalleryView(imageId: string | undefined): void {
  if (!imageId || !isTrackableGalleryId(imageId)) return;
  if (typeof window === 'undefined') return;

  const key = `${SESSION_PREFIX}${imageId}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, '1');

  void fetch(`/api/gallery/${imageId}/view`, {
    method: 'POST',
    credentials: 'same-origin',
  }).catch(() => {
    sessionStorage.removeItem(key);
  });
}
