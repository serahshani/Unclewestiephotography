'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  Sparkles,
  ChevronLeft,
  MoreVertical,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/hero', label: 'Hero Section', icon: Sparkles },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/videos', label: 'Videos', icon: Video },
];

function isNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AdminSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  onLogout: () => void;
  adminUsername: string;
  avatarSrc: string;
};

export default function AdminSidebar({
  collapsed,
  onToggle,
  onNavigate,
  onLogout,
  adminUsername,
  avatarSrc,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const linkBase =
    'flex items-center rounded-[9px] px-3 py-3 text-[13.5px] transition-colors';
  const linkActive = 'bg-white/20 text-white';
  const linkInactive = 'text-white/70 hover:bg-white/10 hover:text-white/95';

  return (
    <aside
      className={`flex h-full flex-col bg-[#012D26] px-[14px] py-[22px] text-white transition-[width] duration-300 ${
        collapsed ? 'w-[90px]' : 'w-[270px]'
      }`}
    >
      <div className="flex items-center gap-[10px] px-[10px] pb-[18px]">
        <Image
          src="/Westieelogo.png"
          alt="Uncle Westiee Studios"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-md object-contain"
        />
        {!collapsed ? (
          <span className="truncate text-[17px] font-bold leading-none">
            Uncle Westiee
          </span>
        ) : null}
        <button
          type="button"
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
          onClick={onToggle}
          className="ml-auto cursor-pointer rounded-md p-1 text-white/60 hover:text-white"
        >
          <ChevronLeft size={14} className={collapsed ? 'rotate-180' : ''} />
        </button>
      </div>

      <nav className="mt-2 flex flex-col gap-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isNavActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              className={`${linkBase} ${active ? linkActive : linkInactive} ${
                collapsed ? 'justify-center' : 'gap-[11px]'
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {!collapsed ? <span>{label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" aria-hidden="true" />

      <button
        type="button"
        onClick={onLogout}
        title={collapsed ? 'Logout' : undefined}
        className={`flex cursor-pointer items-center rounded-[9px] px-3 py-3 text-left hover:bg-white/10 ${
          collapsed ? 'justify-center' : 'gap-2'
        }`}
        aria-label="Logout"
      >
        <Image
          src={avatarSrc}
          alt={`${adminUsername} profile`}
          width={34}
          height={34}
          className="h-[34px] w-[34px] shrink-0 rounded-full object-cover ring-2 ring-white/20"
        />
        {!collapsed ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-white/90">
                Admin
              </p>
              <p className="truncate text-[11px] text-white/55">{adminUsername}</p>
            </div>
            <MoreVertical size={14} className="shrink-0 text-white/55" />
          </>
        ) : null}
      </button>
    </aside>
  );
}
