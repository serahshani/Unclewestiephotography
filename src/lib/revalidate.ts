import { revalidatePath } from 'next/cache';

export function revalidatePublicContent() {
  revalidatePath('/');
  revalidatePath('/portfolio');
  revalidatePath('/sitemap.xml');
}

export function revalidateGallerySlug(slug: string) {
  revalidatePath(`/portfolio/${slug}`);
}
