import {
  MAX_GALLERY_SIZE_BYTES,
  formatMaxGallerySizeLabel,
} from '@/lib/upload-limits';
import { SUPPORTED_IMAGE_TYPES } from './constants';
import type { GalleryFiltersState } from './types';

export function validateGalleryFile(file: File): string | null {
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    return 'Only JPEG, PNG, and WebP images are supported';
  }
  if (file.size > MAX_GALLERY_SIZE_BYTES) {
    return `Image must be ${formatMaxGallerySizeLabel()} or smaller`;
  }
  return null;
}

export function parseTagsInput(input: string): string[] {
  return input
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatResolution(
  width: number | null | undefined,
  height: number | null | undefined
): string {
  if (!width || !height) return '—';
  return `${width} × ${height}`;
}

export function formatDate(value: string | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function formatDateTime(value: string | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function buildGalleryQuery(
  filters: GalleryFiltersState,
  page: number,
  pageSize: number,
  options?: { all?: boolean }
): string {
  const params = new URLSearchParams({
    admin: 'true',
    page: String(page),
    pageSize: String(pageSize),
  });

  if (options?.all) {
    params.set('all', 'true');
  }

  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.featured !== 'all') params.set('featured', filters.featured);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);

  return `/api/gallery?${params.toString()}`;
}

export async function readImageDimensions(
  file: File
): Promise<{ width: number; height: number } | null> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      const dims = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return dims;
    } catch {
      // fall through
    }
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export function defaultUploadFormFromFile(file: File) {
  const baseName = file.name.replace(/\.[^.]+$/, '');
  return {
    title: baseName,
    description: '',
    altText: baseName,
    category: 'events',
    tags: '',
    photographerCredit: '',
    featured: false,
    sortOrder: 0,
  };
}
