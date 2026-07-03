'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { GALLERY_CATEGORIES, inputClass } from './constants';
import type { GalleryFiltersState } from './types';

type GalleryFiltersProps = {
  filters: GalleryFiltersState;
  onChange: (filters: GalleryFiltersState) => void;
  onReset: () => void;
};

const selectClass = `${inputClass} min-w-0 w-full py-2 text-sm`;

export default function GalleryFilters({ filters, onChange, onReset }: GalleryFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.featured !== 'all' ||
    filters.dateFrom ||
    filters.dateTo;

  function update<K extends keyof GalleryFiltersState>(key: K, value: GalleryFiltersState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <section
      className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm"
      aria-label="Gallery filters"
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
        <div className="flex items-center gap-2 text-gray-700">
          <SlidersHorizontal size={15} className="text-gray-400" aria-hidden />
          <h2 className="text-sm font-medium text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 transition-colors hover:text-[#012D26]"
          >
            <X size={13} aria-hidden />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search by title..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className={`${inputClass} w-full py-2 pl-9`}
            aria-label="Search gallery by title"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
            className={selectClass}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) =>
              update('status', e.target.value as GalleryFiltersState['status'])
            }
            className={selectClass}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={filters.featured}
            onChange={(e) =>
              update('featured', e.target.value as GalleryFiltersState['featured'])
            }
            className={selectClass}
            aria-label="Filter by featured"
          >
            <option value="all">All featured</option>
            <option value="true">Featured only</option>
            <option value="false">Not featured</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => update('dateFrom', e.target.value)}
            className={`${selectClass} text-gray-700`}
            aria-label="Filter from date"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => update('dateTo', e.target.value)}
            className={`${selectClass} text-gray-700`}
            aria-label="Filter to date"
          />
        </div>
      </div>
    </section>
  );
}
