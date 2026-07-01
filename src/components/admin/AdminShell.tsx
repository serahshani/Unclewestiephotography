'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { apiFetch, getCsrfToken } from '@/lib/admin-api';
import { ADMIN_AVATAR_IMAGE } from '@/lib/admin-avatar';

const COLLAPSE_KEY = 'admin-sidebar-collapsed';

const PAGE_TITLES: Record<string, string> = {
  admin: 'Dashboard',
  hero: 'Hero Section',
  gallery: 'Gallery',
  videos: 'Videos',
};

function getPageTitle(pathname: string) {
  const segment = pathname.split('/').filter(Boolean).pop() ?? 'admin';
  return PAGE_TITLES[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [adminUsername, setAdminUsername] = useState('admin');

  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    const stored = localStorage.getItem(COLLAPSE_KEY);
    if (stored === 'true') setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const locked = mobileOpen || logoutModalOpen;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, logoutModalOpen]);

  useEffect(() => {
    apiFetch<{ username: string }>('/api/auth/me')
      .then((data) => {
        if (data.username) setAdminUsername(data.username);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;

    const onClickOutside = () => setUserMenuOpen(false);
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };

    window.addEventListener('click', onClickOutside);
    window.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('click', onClickOutside);
      window.removeEventListener('keydown', onEscape);
    };
  }, [userMenuOpen]);

  const openLogoutModal = () => {
    setUserMenuOpen(false);
    setLogoutModalOpen(true);
  };

  const performLogout = async () => {
    setLogoutLoading(true);
    try {
      const csrf = getCsrfToken();
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: csrf ? { 'X-CSRF-Token': csrf } : {},
      });
      window.location.href = '/admin/login';
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
      <AdminConfirmModal
        open={logoutModalOpen}
        title="Logout"
        message="Are you sure you want to logout? You will need to sign in again to access the admin panel."
        confirmLabel="Logout"
        cancelLabel="Stay signed in"
        loading={logoutLoading}
        onConfirm={() => void performLogout()}
        onCancel={() => setLogoutModalOpen(false)}
      />

      <div className="h-screen w-full overflow-hidden bg-[#012D26]">
        <div className="flex h-full w-full overflow-hidden">
          <div className="hidden border-r border-white/10 md:block">
            <AdminSidebar
              collapsed={collapsed}
              onToggle={() => setCollapsed((v) => !v)}
              onLogout={openLogoutModal}
              adminUsername={adminUsername}
              avatarSrc={ADMIN_AVATAR_IMAGE}
            />
          </div>

          {mobileOpen ? (
            <div
              className="fixed inset-0 z-[95] bg-black/55 md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            >
              <div
                className="h-full w-[300px] bg-[#012D26]"
                onClick={(e) => e.stopPropagation()}
              >
                <AdminSidebar
                  collapsed={false}
                  onToggle={() => setMobileOpen(false)}
                  onNavigate={() => setMobileOpen(false)}
                  onLogout={openLogoutModal}
                  adminUsername={adminUsername}
                  avatarSrc={ADMIN_AVATAR_IMAGE}
                />
              </div>
            </div>
          ) : null}

          <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-[#f4f5f7]">
            <header className="border-b border-[#012D26]/10 bg-white px-4 py-3 sm:px-7 sm:pt-[18px]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    title="Open menu"
                    aria-label="Open menu"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setMobileOpen(true);
                    }}
                    className="cursor-pointer shrink-0 p-1 text-[#012D26] md:hidden"
                  >
                    <Menu size={18} />
                  </button>
                  <p className="truncate text-[12.5px] text-[#012D26]/45">
                    Home <span className="mx-1 opacity-40">/</span>{' '}
                    <span className="font-semibold text-[#012D26]">{pageTitle}</span>
                  </p>
                </div>
                <div className="relative shrink-0">
                  <button
                    type="button"
                    title="Account menu"
                    aria-label={`Account menu for ${adminUsername}`}
                    aria-expanded={userMenuOpen ? 'true' : 'false'}
                    aria-haspopup="menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileOpen(false);
                      setUserMenuOpen((open) => !open);
                    }}
                    className="cursor-pointer rounded-full border-2 border-[#012D26]/15 p-0.5 transition-colors hover:border-[#012D26]/35"
                  >
                    <Image
                      src={ADMIN_AVATAR_IMAGE}
                      alt={`${adminUsername} profile`}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  </button>

                  {userMenuOpen ? (
                    <div
                      role="menu"
                      className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-[#012D26]/10 bg-white shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 border-b border-[#012D26]/10 px-4 py-3">
                        <Image
                          src={ADMIN_AVATAR_IMAGE}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#012D26]">
                            {adminUsername}
                          </p>
                          <p className="text-xs text-[#012D26]/55">Administrator</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={openLogoutModal}
                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-7 sm:pb-7 sm:pt-[18px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
