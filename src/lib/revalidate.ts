import { revalidatePath } from 'next/cache';

export function revalidatePublicContent() {
  revalidatePath('/', 'layout');
  revalidatePath('/');
  revalidatePath('/portfolio', 'layout');
  revalidatePath('/portfolio');
  revalidatePath('/sitemap.xml');
}

export function revalidateGallerySlug(slug: string) {
  revalidatePath(`/portfolio/${slug}`);
}
