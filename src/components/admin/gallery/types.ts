export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  imagePath: string;
  altText: string;
  slug?: string;
  category: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  photographerCredit: string | null;
  viewCount: number;
  fileSizeBytes: number | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryListResponse {
  items: GalleryImage[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type GalleryStatusFilter = 'all' | 'published' | 'draft';
export type GalleryFeaturedFilter = 'all' | 'true' | 'false';

export interface GalleryFiltersState {
  search: string;
  category: string;
  status: GalleryStatusFilter;
  featured: GalleryFeaturedFilter;
  dateFrom: string;
  dateTo: string;
}

export interface UploadFormData {
  title: string;
  description: string;
  altText: string;
  category: string;
  tags: string;
  photographerCredit: string;
  featured: boolean;
  sortOrder: number;
}

export interface PendingUpload {
  file: File;
  previewUrl: string;
  width: number | null;
  height: number | null;
}

export const DEFAULT_FILTERS: GalleryFiltersState = {
  search: '',
  category: 'all',
  status: 'all',
  featured: 'all',
  dateFrom: '',
  dateTo: '',
};

export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96] as const;
