'use client';

import { memo } from 'react';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { getYouTubeThumbnail } from '@/lib/youtube';
import { formatDate } from './utils';
import type { Video } from './types';

type VideoCardProps = {
  video: Video;
  selected: boolean;
  draggable?: boolean;
  isDragOver?: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
};

function VideoCard({
  video,
  selected,
  draggable = true,
  isDragOver = false,
  onSelect,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: VideoCardProps) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-lg border bg-white transition-shadow ${
        selected
          ? 'border-[#012D26] shadow-md ring-1 ring-[#012D26]/30'
          : 'border-gray-200 shadow-sm hover:shadow-md'
      } ${isDragOver ? 'border-[#012D26]' : ''}`}
      draggable={draggable}
      onDragStart={() => onDragStart(video.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(video.id);
      }}
      onDragEnd={onDragEnd}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(video.id);
      }}
    >
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-2.5 py-2">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(video.id, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#012D26] focus:ring-[#012D26]"
            aria-label={`Select ${video.title}`}
          />
          <span className="text-xs text-gray-500">Select</span>
        </label>
        {draggable && (
          <button
            type="button"
            className="cursor-grab rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 active:cursor-grabbing"
            aria-label={`Drag to reorder ${video.title}`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical size={16} />
          </button>
        )}
      </div>

      <div className="relative overflow-hidden bg-gray-100">
        {video.sourceType === 'upload' && video.videoPath ? (
          <video
            src={video.videoPath}
            muted
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={getYouTubeThumbnail(video.youtubeId ?? '')}
            alt={video.title}
            className="aspect-video w-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1 bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-6">
          <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
            {video.sourceType === 'upload' ? 'Upload' : 'YouTube'}
          </span>
          {video.category && (
            <span className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium capitalize text-gray-800">
              {video.category}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{video.title}</p>
          <p className="mt-0.5 text-xs text-gray-500">{formatDate(video.createdAt)}</p>
        </div>

        <div className="flex items-center justify-end border-t border-gray-100 pt-2">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onEdit(video)}
              className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#012D26]"
              aria-label={`Edit ${video.title}`}
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(video)}
              className="rounded p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={`Delete ${video.title}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(VideoCard);
