import {
  MAX_VIDEO_SIZE_BYTES,
  formatMaxVideoSizeLabel,
} from '@/lib/upload-limits';
import type { VideoFiltersState } from './types';

export function validateVideoFile(file: File): string | null {
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return `Video must be ${formatMaxVideoSizeLabel()} or smaller`;
  }
  const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (!allowed.includes(file.type)) {
    return 'Only MP4, WebM, and MOV files are allowed';
  }
  return null;
}

export function formatDate(value: string | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function buildVideoQuery(
  filters: VideoFiltersState,
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
  if (filters.sourceType !== 'all') params.set('sourceType', filters.sourceType);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);

  return `/api/videos?${params.toString()}`;
}
