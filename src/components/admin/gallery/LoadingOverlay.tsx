'use client';

type LoadingOverlayProps = {
  visible: boolean;
  label?: string;
};

export default function LoadingOverlay({
  visible,
  label = 'Saving...',
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/30 backdrop-blur-[1px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-2xl">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-[#012D26]/20 border-t-[#012D26]"
          aria-hidden
        />
        <p className="text-sm font-medium text-gray-700">{label}</p>
      </div>
    </div>
  );
}
