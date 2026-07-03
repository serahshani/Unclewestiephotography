import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center py-20">
        <h1 className="text-4xl font-bold text-[#012D26] mb-4">Page Not Found</h1>
        <p className="text-6xl font-extrabold text-gray-300 mb-6" aria-hidden>
          404
        </p>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you are looking for might have been moved or does not exist.
        </p>
        <Link
          href="/"
          className="bg-[#012D26] text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </PublicLayout>
  );
}
