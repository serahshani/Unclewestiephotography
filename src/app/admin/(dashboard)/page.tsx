import Link from 'next/link';
import {
  Image as ImageIcon,
  Video,
  Sparkles,
  ArrowRight,
  LayoutGrid,
} from 'lucide-react';
import { getDashboardStats } from '@/lib/data';

export const dynamic = 'force-dynamic';

const cards = [
  {
    label: 'Gallery Images',
    description: 'Upload and organize portfolio photos',
    href: '/admin/gallery',
    icon: ImageIcon,
    accent: 'bg-emerald-50 text-emerald-800',
  },
  {
    label: 'Videos',
    description: 'Manage YouTube showcase videos',
    href: '/admin/videos',
    icon: Video,
    accent: 'bg-sky-50 text-sky-800',
  },
  {
    label: 'Hero Slides',
    description: 'Edit homepage carousel and copy',
    href: '/admin/hero',
    icon: Sparkles,
    accent: 'bg-amber-50 text-amber-900',
  },
] as const;

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const counts: Record<string, number> = {
    '/admin/gallery': stats.galleryCount,
    '/admin/videos': stats.videoCount,
    '/admin/hero': stats.slideCount,
  };

  const totalItems = stats.galleryCount + stats.videoCount + stats.slideCount;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#012D26]/45 sm:text-sm">
              Overview
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#012D26] sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
              Manage gallery images, videos, and your homepage hero from one place.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#012D26]/10 bg-white px-4 py-3 sm:px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#012D26]/5 text-[#012D26]">
              <LayoutGrid size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total content items</p>
              <p className="text-xl font-bold text-[#012D26]">{totalItems}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-[#012D26] sm:mb-4 sm:text-base">
          Quick manage
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {cards.map(({ label, description, href, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-xl border border-gray-200/80 bg-white p-4 transition-all hover:border-[#012D26]/20 hover:shadow-sm sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}
                >
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <span className="text-2xl font-bold tabular-nums text-[#012D26] sm:text-3xl">
                  {counts[href] ?? 0}
                </span>
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{description}</p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#012D26] opacity-80 transition-opacity group-hover:opacity-100">
                Open
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
