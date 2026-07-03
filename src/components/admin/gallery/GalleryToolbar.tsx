'use client';

import { ArrowUpDown, Plus, Save, X } from 'lucide-react';
import { btnMuted, btnOutline, btnPrimary } from './constants';
import { formatMaxGallerySizeLabel } from '@/lib/upload-limits';

type GalleryToolbarProps = {
  total: number;
  hasOrderChanges: boolean;
  savingOrder: boolean;
  reorderMode: boolean;
  loadingReorder?: boolean;
  onAddImage: () => void;
  onSaveOrder: () => void;
  onToggleReorderMode: () => void;
};

export default function GalleryToolbar({
  total,
  hasOrderChanges,
  savingOrder,
  reorderMode,
  loadingReorder = false,
  onAddImage,
  onSaveOrder,
  onToggleReorderMode,
}: GalleryToolbarProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#012D26] sm:text-3xl">Gallery</h1>
        <p className="mt-1 text-sm text-gray-500">
          {total} image{total === 1 ? '' : 's'} · max {formatMaxGallerySizeLabel()} each · JPEG,
          PNG, WebP
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {reorderMode ? (
          <>
            {hasOrderChanges && (
              <button
                type="button"
                onClick={onSaveOrder}
                disabled={savingOrder}
                className={`inline-flex items-center gap-2 ${btnPrimary}`}
              >
                <Save size={16} aria-hidden />
                {savingOrder ? 'Saving order...' : 'Save order'}
              </button>
            )}
            <button
              type="button"
              onClick={onToggleReorderMode}
              disabled={savingOrder || loadingReorder}
              className={`inline-flex items-center gap-2 ${btnOutline}`}
            >
              <X size={16} aria-hidden />
              Exit reorder
            </button>
          </>
        ) : (
          <>
            {hasOrderChanges && (
              <button
                type="button"
                onClick={onSaveOrder}
                disabled={savingOrder}
                className={`inline-flex items-center gap-2 ${btnMuted}`}
              >
                <Save size={16} aria-hidden />
                {savingOrder ? 'Saving order...' : 'Save order'}
              </button>
            )}
            <button
              type="button"
              onClick={onToggleReorderMode}
              disabled={loadingReorder || total === 0}
              className={`inline-flex items-center gap-2 ${btnOutline}`}
            >
              <ArrowUpDown size={16} aria-hidden />
              {loadingReorder ? 'Loading...' : 'Reorder'}
            </button>
            <button
              type="button"
              onClick={onAddImage}
              className={`inline-flex items-center gap-2 ${btnPrimary}`}
            >
              <Plus size={16} aria-hidden />
              Add image
            </button>
          </>
        )}
      </div>
    </header>
  );
}
