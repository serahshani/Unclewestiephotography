'use client';

import Image, { type ImageProps } from 'next/image';
import { shouldUseUnoptimizedImage } from '@/lib/image-path';

type PublicImageProps = Omit<ImageProps, 'unoptimized'> & {
  src: string;
};

export default function PublicImage({ src, ...props }: PublicImageProps) {
  return (
    <Image
      src={src}
      unoptimized={shouldUseUnoptimizedImage(src)}
      {...props}
    />
  );
}
