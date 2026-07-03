export const GALLERY_CATEGORIES = [
  'weddings',
  'portraits',
  'events',
  'landscapes',
  'fashion',
  'wildlife',
  'urban',
] as const;

export const SUPPORTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export const SUPPORTED_IMAGE_EXTENSIONS = '.jpg,.jpeg,.png,.webp';

export const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#012D26] focus:ring-2 focus:ring-[#012D26]/20';

export const btnPrimary =
  'cursor-pointer rounded-lg bg-[#012D26] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50';

export const btnOutline =
  'cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50';

export const btnMuted =
  'cursor-pointer rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50';

export const btnDanger =
  'cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50';

export const filterInputClass =
  'min-w-0 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#012D26] focus:ring-2 focus:ring-[#012D26]/20';

export const filterSelectClass = `${filterInputClass} w-full`;

export const filterFieldSm =
  'w-full sm:w-auto sm:min-w-[8.25rem] sm:max-w-[10rem] lg:min-w-[7.5rem] lg:max-w-[9.5rem]';

export const filterSearchWidth =
  'w-full sm:w-auto sm:min-w-[10rem] sm:max-w-[12rem] lg:min-w-[9rem] lg:max-w-[11rem]';
