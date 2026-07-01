'use client';

import Link from 'next/link';
import Navbar from '@/app/Components/navbar';
import Footer from '@/app/Components/footer';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center py-20">
        <h1 className="text-4xl font-bold text-[#012D26] mb-4">Something went wrong</h1>
        <p className="text-6xl font-extrabold text-gray-300 mb-6" aria-hidden>
          500
        </p>
        <p className="text-gray-600 mb-8 max-w-md">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="bg-[#012D26] text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-[#012D26] text-[#012D26] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
