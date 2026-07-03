'use client';

import VideoCard from './VideoCard';
import type { Video } from './types';

type VideoGridProps = {
  videos: Video[];
  selectedIds: Set<string>;
  dragOverId: string | null;
  onSelect: (id: string, selected: boolean) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
};

export default function VideoGrid({
  videos,
  selectedIds,
  dragOverId,
  onSelect,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-sm text-gray-500">No videos match your filters.</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="list"
      aria-label="Videos"
    >
      {videos.map((video) => (
        <div key={video.id} role="listitem">
          <VideoCard
            video={video}
            selected={selectedIds.has(video.id)}
            isDragOver={dragOverId === video.id}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
          />
        </div>
      ))}
    </div>
  );
}
