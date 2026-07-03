'use client';

import GalleryCard from './GalleryCard';
import type { GalleryImage } from './types';

type GalleryGridProps = {
  images: GalleryImage[];
  selectedIds: Set<string>;
  dragOverId: string | null;
  onSelect: (id: string, selected: boolean) => void;
  onOpen: (image: GalleryImage) => void;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
};

export default function GalleryGrid({
  images,
  selectedIds,
  dragOverId,
  onSelect,
  onOpen,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-sm text-gray-500">No images match your filters.</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
      aria-label="Gallery images"
    >
      {images.map((image) => (
        <div key={image.id} role="listitem">
          <GalleryCard
            image={image}
            selected={selectedIds.has(image.id)}
            isDragOver={dragOverId === image.id}
            onSelect={onSelect}
            onOpen={onOpen}
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
