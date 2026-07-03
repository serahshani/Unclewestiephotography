import Breadcrumbs from './Breadcrumbs';
import type { PageBreadcrumbItem } from '@/lib/page-breadcrumbs';

export default function HeroBreadcrumbs({ items }: { items: PageBreadcrumbItem[] }) {
  return (
    <div className="relative z-30 w-full px-4 pb-4 pt-32 sm:absolute sm:inset-x-0 sm:top-0 sm:z-20 sm:px-6 sm:pb-0 sm:pt-28 lg:px-10">
      <div className="container mx-auto w-full max-w-full">
        <Breadcrumbs items={items} variant="light" />
      </div>
    </div>
  );
}
