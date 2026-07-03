import type { VideoSourceType } from '@/lib/video-source';

export interface Video {
  id: string;
  title: string;
  description: string | null;
  sourceType: VideoSourceType;
  youtubeUrl: string | null;
  youtubeId: string | null;
  videoPath: string | null;
  category: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface VideoListResponse {
  items: Video[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type VideoSourceFilter = 'all' | 'youtube' | 'upload';

export interface VideoFiltersState {
  search: string;
  category: string;
  sourceType: VideoSourceFilter;
  dateFrom: string;
  dateTo: string;
}

export interface VideoFormData {
  title: string;
  description: string;
  sourceType: VideoSourceType;
  youtubeUrl: string;
  videoPath: string;
  category: string;
}

export const DEFAULT_FILTERS: VideoFiltersState = {
  search: '',
  category: 'all',
  sourceType: 'all',
  dateFrom: '',
  dateTo: '',
};

export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96] as const;

export const EMPTY_FORM: VideoFormData = {
  title: '',
  description: '',
  sourceType: 'youtube',
  youtubeUrl: '',
  videoPath: '',
  category: 'events',
};
