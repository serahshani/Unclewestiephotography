import Link from 'next/link';
import { Image, Video, Sparkles } from 'lucide-react';
import { getDashboardStats } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: 'Gallery Images', count: stats.galleryCount, href: '/admin/gallery', icon: Image },
    { label: 'Videos', count: stats.videoCount, href: '/admin/videos', icon: Video },
    { label: 'Hero Slides', count: stats.slideCount, href: '/admin/hero', icon: Sparkles },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#012D26] mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your website content</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ label, count, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className="text-[#012D26]" size={28} />
              <span className="text-3xl font-bold text-[#012D26]">{count}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
