'use client';

import { X } from 'lucide-react';
import { VIDEO_CATEGORIES } from './constants';

type VideoBulkActionsBarProps = {
  selectedCount: number;
  loading: boolean;
  onDelete: () => void;
  onCategoryChange: (category: string) => void;
  onClearSelection: () => void;
};

export default function VideoBulkActionsBar({
  selectedCount,
  loading,
  onDelete,
  onCategoryChange,
  onClearSelection,
}: VideoBulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm"
      role="toolbar"
      aria-label="Bulk actions"
    >
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md bg-[#012D26] px-2 text-xs font-semibold text-white">
            {selectedCount}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {selectedCount === 1 ? 'item selected' : 'items selected'}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onCategoryChange(e.target.value);
                e.target.value = '';
              }
            }}
            disabled={loading}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#012D26] focus:ring-2 focus:ring-[#012D26]/20 disabled:opacity-50 sm:w-40"
            aria-label="Bulk change category"
          >
            <option value="">Set category</option>
            {VIDEO_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDelete}
              disabled={loading}
              className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 sm:flex-none"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClearSelection}
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 sm:flex-none"
            >
              <X size={14} aria-hidden />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
