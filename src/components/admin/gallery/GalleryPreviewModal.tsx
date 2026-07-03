'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, Pencil, Trash2, X } from 'lucide-react';
import { btnDanger, btnOutline, btnPrimary } from './constants';
import {
  formatDate,
  formatDateTime,
  formatFileSize,
  formatResolution,
} from './utils';
import type { GalleryImage } from './types';

type GalleryPreviewModalProps = {
  image: GalleryImage | null;
  onClose: () => void;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
};

export default function GalleryPreviewModal({
  image,
  onClose,
  onEdit,
  onDelete,
}: GalleryPreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resolvedSize, setResolvedSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!image) return;
    setCopied(false);
    setResolvedSize(null);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [image]);

  useEffect(() => {
    if (!image) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [image, onClose]);

  async function copyUrl() {
    if (!image) return;
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${image.imagePath}`
        : image.imagePath;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be unavailable
    }
  }

  if (!image || !mounted) return null;

  const displayWidth = image.width ?? resolvedSize?.width;
  const displayHeight = image.height ?? resolvedSize?.height;

  return createPortal(
    <div
      className="fixed inset-0 z-[210] flex h-[100dvh] w-full items-end justify-center overflow-hidden bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full flex-col border-b border-gray-100 lg:w-[340px] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 id="preview-title" className="text-lg font-semibold text-gray-900">
              Image details
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5 text-sm">
            <DetailRow label="Title" value={image.title} />
            <DetailRow label="Description" value={image.description || '—'} />
            <DetailRow label="Category" value={image.category || '—'} capitalize />
            <DetailRow
              label="Tags"
              value={image.tags?.length ? image.tags.join(', ') : '—'}
            />
            <DetailRow
              label="Status"
              value={image.published ? 'Published' : 'Draft'}
              badge={image.published ? 'green' : 'amber'}
            />
            <DetailRow label="Upload date" value={formatDate(image.createdAt)} />
            <DetailRow label="Last updated" value={formatDateTime(image.updatedAt)} />
            <DetailRow label="File size" value={formatFileSize(image.fileSizeBytes)} />
            <DetailRow
              label="Resolution"
              value={formatResolution(displayWidth, displayHeight)}
            />
            <DetailRow label="Alt text" value={image.altText} />
            {image.photographerCredit && (
              <DetailRow label="Credit" value={image.photographerCredit} />
            )}
            <DetailRow label="Views" value={String(image.viewCount ?? 0)} />

            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                Image URL
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-gray-100 px-2 py-1.5 text-xs text-gray-700">
                  {image.imagePath}
                </code>
                <button
                  type="button"
                  onClick={() => void copyUrl()}
                  className="shrink-0 rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
                  aria-label="Copy image URL"
                >
                  {copied ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4">
            <button
              type="button"
              onClick={() => onEdit(image)}
              className={`inline-flex flex-1 items-center justify-center gap-2 ${btnPrimary}`}
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(image)}
              className={`inline-flex items-center justify-center gap-2 ${btnDanger}`}
            >
              <Trash2 size={14} />
            </button>
            <button type="button" onClick={onClose} className={btnOutline}>
              Close
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-gray-900 p-4 sm:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.imagePath}
            alt={image.altText}
            className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl"
            onLoad={(e) => {
              const target = e.currentTarget;
              if (!image.width && !image.height) {
                setResolvedSize({
                  width: target.naturalWidth,
                  height: target.naturalHeight,
                });
              }
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

function DetailRow({
  label,
  value,
  capitalize = false,
  badge,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
  badge?: 'green' | 'amber';
}) {
  return (
    <div>
      <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      {badge ? (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            badge === 'green'
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {value}
        </span>
      ) : (
        <p className={`text-gray-900 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
      )}
    </div>
  );
}
