'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
  VIDEO_CATEGORIES,
  filterFieldSm,
  filterInputClass,
  filterSearchWidth,
  filterSelectClass,
} from './constants';
import type { VideoFiltersState } from './types';

type VideoFiltersProps = {
  filters: VideoFiltersState;
  onChange: (filters: VideoFiltersState) => void;
  onReset: () => void;
};

export default function VideoFilters({ filters, onChange, onReset }: VideoFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.sourceType !== 'all' ||
    filters.dateFrom ||
    filters.dateTo;

  function update<K extends keyof VideoFiltersState>(key: K, value: VideoFiltersState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <section
      className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm"
      aria-label="Video filters"
    >
      <div className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:gap-4 lg:p-3.5">
        <div className="flex shrink-0 items-center justify-between gap-3 lg:justify-start">
          <div className="flex items-center gap-1.5 text-gray-700">
            <SlidersHorizontal size={14} className="text-gray-400" aria-hidden />
            <h2 className="text-sm font-medium text-gray-900">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 transition-colors hover:text-[#012D26] lg:ml-1"
            >
              <X size={12} aria-hidden />
              Reset
            </button>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end lg:gap-x-2 lg:gap-y-2">
          <div className={`relative ${filterSearchWidth}`}>
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search title..."
              value={filters.search}
              onChange={(e) => update('search', e.target.value)}
              className={`${filterInputClass} w-full pl-8`}
              aria-label="Search videos by title"
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
            className={`${filterSelectClass} ${filterFieldSm}`}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {VIDEO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.sourceType}
            onChange={(e) =>
              update('sourceType', e.target.value as VideoFiltersState['sourceType'])
            }
            className={`${filterSelectClass} ${filterFieldSm}`}
            aria-label="Filter by source type"
          >
            <option value="all">All sources</option>
            <option value="youtube">YouTube</option>
            <option value="upload">Uploaded file</option>
          </select>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => update('dateFrom', e.target.value)}
              className={`${filterSelectClass} ${filterFieldSm} text-gray-700`}
              aria-label="Filter from date"
            />
            <span className="shrink-0 text-xs text-gray-400" aria-hidden>
              –
            </span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => update('dateTo', e.target.value)}
              className={`${filterSelectClass} ${filterFieldSm} text-gray-700`}
              aria-label="Filter to date"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
