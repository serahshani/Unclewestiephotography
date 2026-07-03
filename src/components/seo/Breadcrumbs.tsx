import Link from 'next/link';
import type { PageBreadcrumbItem } from '@/lib/page-breadcrumbs';

type BreadcrumbVariant = 'light' | 'dark';

const variantStyles: Record<
  BreadcrumbVariant,
  { link: string; current: string; separator: string }
> = {
  light: {
    link: 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] transition-colors hover:text-white',
    current: 'font-serif font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] sm:text-[0.95rem]',
    separator: 'text-white/60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]',
  },
  dark: {
    link: 'text-gray-500 transition-colors hover:text-[#012D26] hover:underline hover:underline-offset-[6px] hover:decoration-[#012D26]/25',
    current: 'font-serif text-[0.95rem] text-[#012D26]',
    separator: 'text-[#012D26]/20',
  },
};

export default function Breadcrumbs({
  items,
  variant = 'dark',
}: {
  items: PageBreadcrumbItem[];
  variant?: BreadcrumbVariant;
}) {
  const styles = variantStyles[variant];
  const isHero = variant === 'light';

  return (
    <nav aria-label="Breadcrumb" className={isHero ? 'max-w-full' : undefined}>
      <ol
        className={
          isHero
            ? 'flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs tracking-wide sm:gap-x-3 sm:text-sm'
            : 'flex flex-wrap items-center gap-x-3 gap-y-1 text-sm tracking-wide'
        }
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.path}
              className={
                isHero
                  ? 'flex min-w-0 max-w-full items-center gap-1.5 sm:gap-3'
                  : 'flex items-center gap-3'
              }
            >
              {index > 0 && (
                <span className={`${styles.separator} shrink-0 select-none`} aria-hidden>
                  /
                </span>
              )}
              {isLast ? (
                <span
                  className={`${styles.current} ${isHero ? 'truncate sm:max-w-[16rem] md:max-w-none' : ''}`}
                  aria-current="page"
                  title={isHero ? item.name : undefined}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={`${styles.link} ${isHero ? 'shrink-0' : ''}`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
