'use client';

import { useEffect } from 'react';
import { trackGalleryView } from '@/lib/gallery-view-tracker';

type GalleryViewTrackerProps = {
  imageId: string;
};

export default function GalleryViewTracker({ imageId }: GalleryViewTrackerProps) {
  useEffect(() => {
    trackGalleryView(imageId);
  }, [imageId]);

  return null;
}
