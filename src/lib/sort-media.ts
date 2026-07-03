export type SortableMedia = {
  sortOrder?: number;
  createdAt?: Date | string | number;
};

function createdAtMs(value: Date | string | number | undefined): number {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  return new Date(value).getTime();
}

export function sortByDisplayOrder<T extends SortableMedia>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return createdAtMs(b.createdAt) - createdAtMs(a.createdAt);
  });
}
