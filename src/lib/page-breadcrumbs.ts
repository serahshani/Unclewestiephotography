export interface PageBreadcrumbItem {
  name: string;
  path: string;
}

export const ABOUT_BREADCRUMBS: PageBreadcrumbItem[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];

export const CONTACT_BREADCRUMBS: PageBreadcrumbItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
];

export const SERVICES_BREADCRUMBS: PageBreadcrumbItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
];

export const PACKAGES_BREADCRUMBS: PageBreadcrumbItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Packages', path: '/packages' },
];

export const PORTFOLIO_BREADCRUMBS: PageBreadcrumbItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
];

export function portfolioDetailBreadcrumbs(title: string, slug: string): PageBreadcrumbItem[] {
  return [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: title, path: `/portfolio/${slug}` },
  ];
}
