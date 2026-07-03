'use client';

import { memo } from 'react';
import { Eye, GripVertical, Pencil, Star, Trash2 } from 'lucide-react';
import { formatDate } from './utils';
import { normalizeImagePath } from '@/lib/image-path';
import type { GalleryImage } from './types';

type GalleryCardProps = {
  image: GalleryImage;
  selected: boolean;
  draggable?: boolean;
  isDragOver?: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onOpen: (image: GalleryImage) => void;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
};

function GalleryCard({
  image,
  selected,
  draggable = true,
  isDragOver = false,
  onSelect,
  onOpen,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: GalleryCardProps) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-lg border bg-white transition-shadow ${
        selected
          ? 'border-[#012D26] shadow-md ring-1 ring-[#012D26]/30'
          : 'border-gray-200 shadow-sm hover:shadow-md'
      } ${isDragOver ? 'border-[#012D26]' : ''}`}
      draggable={draggable}
      onDragStart={() => onDragStart(image.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(image.id);
      }}
      onDragEnd={onDragEnd}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(image.id);
      }}
    >
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-2.5 py-2">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(image.id, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#012D26] focus:ring-[#012D26]"
            aria-label={`Select ${image.title}`}
          />
          <span className="text-xs text-gray-500">Select</span>
        </label>
        {draggable && (
          <button
            type="button"
            className="cursor-grab rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 active:cursor-grabbing"
            aria-label={`Drag to reorder ${image.title}`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical size={16} />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onOpen(image)}
        className="block w-full text-left"
        aria-label={`Preview ${image.title}`}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={normalizeImagePath(image.imagePath) || image.imagePath}
            alt={image.altText}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1 bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-6">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                image.published ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              {image.published ? 'Live' : 'Draft'}
            </span>
            {image.category && (
              <span className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium capitalize text-gray-800">
                {image.category}
              </span>
            )}
            {image.featured && (
              <span className="inline-flex items-center rounded bg-amber-400 px-1 py-0.5 text-white">
                <Star size={10} fill="white" aria-hidden />
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{image.title}</p>
          <p className="mt-0.5 text-xs text-gray-500">{formatDate(image.createdAt)}</p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-2">
          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
            <Eye size={12} aria-hidden />
            {image.viewCount ?? 0}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onEdit(image)}
              className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#012D26]"
              aria-label={`Edit ${image.title}`}
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(image)}
              className="rounded p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={`Delete ${image.title}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(GalleryCard);
