'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import {
  GALLERY_CATEGORIES,
  SUPPORTED_IMAGE_EXTENSIONS,
  btnDanger,
  btnMuted,
  btnOutline,
  btnPrimary,
  inputClass,
} from './constants';
import {
  defaultUploadFormFromFile,
  readImageDimensions,
  validateGalleryFile,
} from './utils';
import type { PendingUpload, UploadFormData } from './types';
import { formatMaxGallerySizeLabel } from '@/lib/upload-limits';

type UploadDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  isPublished?: boolean;
  initialForm?: UploadFormData;
  existingImagePath?: string;
  saving: boolean;
  uploading: boolean;
  uploadProgress: number;
  onClose: () => void;
  onSaveDraft: (form: UploadFormData, pending: PendingUpload | null) => void;
  onPublish: (form: UploadFormData, pending: PendingUpload | null) => void;
  onUpdate?: (form: UploadFormData, pending: PendingUpload | null) => void;
  onUnpublish?: () => void;
  onDelete?: () => void;
};

export default function UploadDialog({
  open,
  mode,
  isPublished = false,
  initialForm,
  existingImagePath,
  saving,
  uploading,
  uploadProgress,
  onClose,
  onSaveDraft,
  onPublish,
  onUpdate,
  onUnpublish,
  onDelete,
}: UploadDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<UploadFormData>({
    title: '',
    description: '',
    altText: '',
    category: 'events',
    tags: '',
    photographerCredit: '',
    featured: false,
    sortOrder: 0,
  });
  const [pending, setPending] = useState<PendingUpload | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setForm(
      initialForm ?? {
        title: '',
        description: '',
        altText: '',
        category: 'events',
        tags: '',
        photographerCredit: '',
        featured: false,
        sortOrder: 0,
      }
    );
    setPending(null);
    setValidationError(null);
  }, [open, initialForm]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const previewSrc = pending?.previewUrl ?? existingImagePath ?? null;

  const processFile = useCallback(async (file: File) => {
    const error = validateGalleryFile(file);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    const dims = await readImageDimensions(file);
    const previewUrl = URL.createObjectURL(file);
    setPending({
      file,
      previewUrl,
      width: dims?.width ?? null,
      height: dims?.height ?? null,
    });
    setForm((prev) => {
      const defaults = defaultUploadFormFromFile(file);
      return mode === 'create'
        ? { ...defaults, featured: prev.featured, sortOrder: prev.sortOrder }
        : { ...prev, altText: prev.altText || defaults.altText };
    });
  }, [mode]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const file = Array.from(files)[0];
      if (!file) return;
      await processFile(file);
    },
    [processFile]
  );

  function updateForm<K extends keyof UploadFormData>(key: K, value: UploadFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isBusy = saving || uploading;
  const canSubmit = form.title.trim() && form.altText.trim() && !isBusy;
  const isCreate = mode === 'create';

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex h-[100dvh] w-full items-end justify-center overflow-hidden bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={() => !isBusy && onClose()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-dialog-title"
        className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 id="upload-dialog-title" className="text-lg font-semibold text-gray-900">
            {isCreate ? 'Add gallery image' : 'Edit gallery image'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="cursor-pointer rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className={`relative flex min-h-[220px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
                dragOver
                  ? 'border-[#012D26] bg-[#012D26]/5'
                  : 'border-gray-300 bg-gray-50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                void handleFiles(e.dataTransfer.files);
              }}
            >
              {previewSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewSrc}
                  alt="Upload preview"
                  className="max-h-64 w-full rounded-lg object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-center text-gray-500">
                  <ImageIcon size={40} strokeWidth={1.25} className="mb-2" />
                  <p className="text-sm font-medium">Drag & drop an image here</p>
                  <p className="mt-1 text-xs">JPEG, PNG, WebP · max {formatMaxGallerySizeLabel()}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className={`mt-4 inline-flex items-center gap-2 ${btnOutline} text-xs`}
              >
                <Upload size={14} />
                {previewSrc ? 'Replace file' : 'Browse files'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept={SUPPORTED_IMAGE_EXTENSIONS}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) void handleFiles(e.target.files);
                  e.target.value = '';
                }}
              />

              {validationError && (
                <p className="mt-3 text-center text-xs text-red-600" role="alert">
                  {validationError}
                </p>
              )}

              {uploading && (
                <div className="mt-4 w-full" role="status" aria-live="polite">
                  <div className="mb-1 flex justify-between text-xs text-gray-600">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-[#012D26] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="upload-title" className="mb-1 block text-sm text-gray-600">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="upload-title"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="upload-alt" className="mb-1 block text-sm text-gray-600">
                  Alt text <span className="text-red-500">*</span>
                </label>
                <input
                  id="upload-alt"
                  value={form.altText}
                  onChange={(e) => updateForm('altText', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="upload-desc" className="mb-1 block text-sm text-gray-600">
                  Description
                </label>
                <textarea
                  id="upload-desc"
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  rows={2}
                  className={inputClass}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="upload-category" className="mb-1 block text-sm text-gray-600">
                    Category
                  </label>
                  <select
                    id="upload-category"
                    value={form.category}
                    onChange={(e) => updateForm('category', e.target.value)}
                    className={inputClass}
                  >
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="upload-order" className="mb-1 block text-sm text-gray-600">
                    Display order
                  </label>
                  <input
                    id="upload-order"
                    type="number"
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) => updateForm('sortOrder', Number(e.target.value) || 0)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="upload-tags" className="mb-1 block text-sm text-gray-600">
                  Tags
                </label>
                <input
                  id="upload-tags"
                  value={form.tags}
                  onChange={(e) => updateForm('tags', e.target.value)}
                  placeholder="wedding, outdoor, sunset"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="upload-credit" className="mb-1 block text-sm text-gray-600">
                  Photographer / credit
                </label>
                <input
                  id="upload-credit"
                  value={form.photographerCredit}
                  onChange={(e) => updateForm('photographerCredit', e.target.value)}
                  className={inputClass}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateForm('featured', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#012D26] focus:ring-[#012D26]"
                />
                Featured on homepage
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4">
          {isCreate ? (
            <>
              <button
                type="button"
                onClick={() => onSaveDraft(form, pending)}
                disabled={!canSubmit || (isCreate && !pending)}
                className={`inline-flex items-center gap-2 ${btnMuted}`}
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save draft
              </button>
              <button
                type="button"
                onClick={() => onPublish(form, pending)}
                disabled={!canSubmit || (isCreate && !pending)}
                className={`inline-flex items-center gap-2 ${btnPrimary}`}
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : null}
                Publish
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onUpdate?.(form, pending)}
                disabled={!canSubmit}
                className={`inline-flex items-center gap-2 ${btnPrimary}`}
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Update
              </button>
              {!isPublished && (
                <button
                  type="button"
                  onClick={() => onPublish(form, pending)}
                  disabled={!canSubmit}
                  className={`inline-flex items-center gap-2 ${btnMuted}`}
                >
                  Publish
                </button>
              )}
              {onUnpublish && (
                <button
                  type="button"
                  onClick={onUnpublish}
                  disabled={isBusy}
                  className={btnOutline}
                >
                  Unpublish
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isBusy}
                  className={btnDanger}
                >
                  Delete
                </button>
              )}
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className={`ml-auto ${btnOutline}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
