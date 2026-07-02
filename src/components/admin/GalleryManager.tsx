'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { apiFetch, uploadFile } from '@/lib/admin-api';
import {
  MAX_GALLERY_SIZE_BYTES,
  formatMaxGallerySizeLabel,
} from '@/lib/upload-limits';
import { Upload, Trash2, Pencil, Star, X } from 'lucide-react';
import { useToast } from '@/components/admin/useToast';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { sortByDisplayOrder } from '@/lib/sort-media';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  imagePath: string;
  altText: string;
  category: string | null;
  featured: boolean;
  sortOrder?: number;
  createdAt?: string;
}

const CATEGORIES = [
  'weddings',
  'portraits',
  'events',
  'landscapes',
  'fashion',
  'wildlife',
  'urban',
];

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#012D26] focus:ring-2 focus:ring-[#012D26]/20';

const btnPrimary =
  'cursor-pointer rounded-lg bg-[#012D26] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50';

const btnOutline =
  'cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50';

function validateGalleryFile(file: File): string | null {
  if (file.size > MAX_GALLERY_SIZE_BYTES) {
    return `Image must be ${formatMaxGallerySizeLabel()} or smaller`;
  }
  return null;
}

export default function GalleryManager() {
  const { showToast, Toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<GalleryImage[]>('/api/gallery');
      setImages(sortByDisplayOrder(data));
    } catch {
      showToast('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    let uploaded = 0;

    for (const file of Array.from(files)) {
      const sizeError = validateGalleryFile(file);
      if (sizeError) {
        showToast(sizeError);
        continue;
      }
      try {
        const { imagePath } = await uploadFile(file, 'gallery');
        await apiFetch('/api/gallery', {
          method: 'POST',
          body: JSON.stringify({
            title: file.name.replace(/\.[^.]+$/, ''),
            imagePath,
            altText: file.name.replace(/\.[^.]+$/, ''),
            category: 'events',
          }),
        });
        uploaded += 1;
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Upload failed');
      }
    }

    e.target.value = '';

    if (uploaded > 0) {
      await loadImages();
      showToast(
        uploaded === 1 ? 'Image uploaded' : `${uploaded} images uploaded`,
        'success'
      );
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/gallery/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await loadImages();
      showToast('Image deleted', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      await apiFetch(`/api/gallery/${editing.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editing.title,
          description: editing.description,
          altText: editing.altText,
          category: editing.category,
          featured: editing.featured,
        }),
      });
      setEditing(null);
      await loadImages();
      showToast('Image updated', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleReplace(id: string, file: File) {
    const sizeError = validateGalleryFile(file);
    if (sizeError) {
      showToast(sizeError);
      return;
    }
    try {
      const { imagePath } = await uploadFile(file, 'gallery');
      await apiFetch(`/api/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ imagePath }),
      });
      await loadImages();
      showToast('Image replaced', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Replace failed');
    }
  }

  const editModal =
    mounted && editing
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex h-[100dvh] w-full items-end justify-center overflow-hidden bg-black/50 p-0 sm:items-center sm:p-4"
            onClick={() => setEditing(null)}
            role="presentation"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-gallery-title"
              className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-md sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 id="edit-gallery-title" className="text-lg font-semibold text-gray-900">
                  Edit image
                </h2>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="cursor-pointer rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="gallery-title" className="mb-1 block text-sm text-gray-600">
                    Title
                  </label>
                  <input
                    id="gallery-title"
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="gallery-alt" className="mb-1 block text-sm text-gray-600">
                    Alt text
                  </label>
                  <input
                    id="gallery-alt"
                    value={editing.altText}
                    onChange={(e) => setEditing({ ...editing, altText: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="gallery-desc" className="mb-1 block text-sm text-gray-600">
                    Description
                  </label>
                  <textarea
                    id="gallery-desc"
                    value={editing.description ?? ''}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={2}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="gallery-category" className="mb-1 block text-sm text-gray-600">
                    Category
                  </label>
                  <select
                    id="gallery-category"
                    value={editing.category ?? ''}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className={inputClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-[#012D26] focus:ring-[#012D26]"
                  />
                  Featured on homepage
                </label>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex-1 ${btnPrimary} py-2.5`}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className={`flex-1 ${btnOutline} py-2.5`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {Toast}
      {editModal}
      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete image"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        loadingLabel="Deleting..."
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#012D26] sm:text-3xl">Gallery</h1>
            <p className="mt-1 text-sm text-gray-500">
              {images.length} image{images.length === 1 ? '' : 's'} · max{' '}
              {formatMaxGallerySizeLabel()} each
            </p>
          </div>
          <label
            className={`inline-flex cursor-pointer items-center justify-center gap-2 self-start ${btnPrimary}`}
          >
            <Upload size={16} />
            Upload images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </header>

        {images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <p className="text-sm text-gray-500">No gallery images yet.</p>
            <label
              className={`mt-4 inline-flex cursor-pointer items-center gap-2 ${btnPrimary}`}
            >
              <Upload size={16} />
              Upload your first image
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {images.map((img) => (
              <article
                key={img.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="relative overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imagePath}
                    alt={img.altText}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                  {img.featured && (
                    <span className="absolute left-2 top-2 rounded bg-amber-500 p-1 text-white">
                      <Star size={12} fill="white" />
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-gray-900">{img.title}</p>
                  <p className="mt-0.5 text-xs capitalize text-gray-500">{img.category}</p>
                  <div className="mt-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(img)}
                      className="cursor-pointer rounded p-1.5 text-gray-600 hover:bg-gray-100 hover:text-[#012D26]"
                      aria-label="Edit image"
                    >
                      <Pencil size={14} />
                    </button>
                    <label className="cursor-pointer rounded p-1.5 text-gray-600 hover:bg-gray-100 hover:text-[#012D26]">
                      <Upload size={14} />
                      <span className="sr-only">Replace image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleReplace(img.id, f);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(img)}
                      className="cursor-pointer rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-800"
                      aria-label="Delete image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
