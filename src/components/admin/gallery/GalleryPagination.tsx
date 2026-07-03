'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { btnOutline } from './constants';
import { PAGE_SIZE_OPTIONS } from './types';

type GalleryPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export default function GalleryPagination({
  page,
  pageSize,
  total,
  totalPages,
  loading = false,
  onPageChange,
  onPageSizeChange,
}: GalleryPaginationProps) {
  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <nav
      className="mt-8 border-t border-gray-200 pt-6 pb-2"
      aria-label="Gallery pagination"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{start}–{end}</span> of{' '}
          <span className="font-medium text-gray-900">{total}</span>
        </p>

        <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <span className="shrink-0">Per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="min-w-0 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-[#012D26] focus:ring-2 focus:ring-[#012D26]/20"
              aria-label="Items per page"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || loading}
              className={`inline-flex items-center gap-1 px-3 py-2 text-sm ${btnOutline}`}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} aria-hidden />
              Prev
            </button>
            <span
              className="min-w-[4.5rem] text-center text-sm font-medium text-gray-900"
              aria-live="polite"
            >
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className={`inline-flex items-center gap-1 px-3 py-2 text-sm ${btnOutline}`}
              aria-label="Next page"
            >
              Next
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
