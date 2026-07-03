'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Upload, X, Youtube } from 'lucide-react';
import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
} from '@/lib/youtube';
import { formatMaxVideoSizeLabel } from '@/lib/upload-limits';
import type { VideoSourceType } from '@/lib/video-source';
import { btnOutline, btnPrimary, inputClass, VIDEO_CATEGORIES } from './constants';
import type { VideoFormData } from './types';

type VideoFormDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  initialForm?: VideoFormData;
  saving: boolean;
  uploading: boolean;
  uploadProgress: number;
  onClose: () => void;
  onSave: (form: VideoFormData) => void;
  onUpload: (file: File) => Promise<string | void>;
};

const sourceTabClass = (active: boolean) =>
  `flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    active
      ? 'bg-[#012D26] text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`;

export default function VideoFormDialog({
  open,
  mode,
  initialForm,
  saving,
  uploading,
  uploadProgress,
  onClose,
  onSave,
  onUpload,
}: VideoFormDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<VideoFormData>(
    initialForm ?? {
      title: '',
      description: '',
      sourceType: 'youtube',
      youtubeUrl: '',
      videoPath: '',
      category: 'events',
    }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && initialForm) {
      setForm(initialForm);
    } else if (open && mode === 'create') {
      setForm({
        title: '',
        description: '',
        sourceType: 'youtube',
        youtubeUrl: '',
        videoPath: '',
        category: 'events',
      });
    }
  }, [open, initialForm, mode]);

  if (!mounted || !open) return null;

  const previewId = extractYouTubeId(form.youtubeUrl);
  const busy = saving || uploading;

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const videoPath = await onUpload(file);
    if (videoPath) {
      setForm((prev) => ({ ...prev, sourceType: 'upload', videoPath }));
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex h-[100dvh] w-full items-end justify-center overflow-hidden bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-form-title"
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="video-form-title" className="text-lg font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit video' : 'Add video'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="cursor-pointer rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, sourceType: 'youtube' as VideoSourceType }))}
            className={sourceTabClass(form.sourceType === 'youtube')}
          >
            <Youtube size={16} />
            YouTube
          </button>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, sourceType: 'upload' as VideoSourceType }))}
            className={sourceTabClass(form.sourceType === 'upload')}
          >
            <Upload size={16} />
            Upload file
          </button>
        </div>

        <div className="space-y-4">
          {form.sourceType === 'youtube' ? (
            <>
              <div>
                <label htmlFor="video-url" className="mb-1 block text-sm text-gray-600">
                  YouTube URL
                </label>
                <input
                  id="video-url"
                  value={form.youtubeUrl}
                  onChange={(e) =>
                    setForm({ ...form, youtubeUrl: e.target.value, sourceType: 'youtube' })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supports youtube.com, youtu.be, and Shorts links
                </p>
              </div>

              {previewId ? (
                <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                  <iframe
                    src={getYouTubeEmbedUrl(previewId)}
                    title="Video preview"
                    className="absolute inset-0 h-full w-full"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </>
          ) : (
            <div>
              <label className="mb-1 block text-sm text-gray-600">Video file</label>
              <label
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition-colors hover:border-[#012D26]/40 hover:bg-gray-100 ${
                  uploading ? 'pointer-events-none opacity-60' : ''
                }`}
              >
                <Upload size={24} className="text-[#012D26]" />
                <span className="text-sm font-medium text-gray-800">
                  {uploading
                    ? `Uploading... ${uploadProgress}%`
                    : form.videoPath
                      ? 'Replace video file'
                      : 'Choose MP4, WebM, or MOV'}
                </span>
                <span className="text-xs text-gray-500">Max {formatMaxVideoSizeLabel()}</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                  onChange={(e) => void handleVideoUpload(e)}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {uploading && uploadProgress > 0 && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-[#012D26] transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {form.videoPath ? (
                <div className="mt-3 overflow-hidden rounded-lg bg-black">
                  <video
                    src={form.videoPath}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full"
                  />
                </div>
              ) : null}
            </div>
          )}

          <div>
            <label htmlFor="video-title" className="mb-1 block text-sm text-gray-600">
              Title
            </label>
            <input
              id="video-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="video-desc" className="mb-1 block text-sm text-gray-600">
              Description
            </label>
            <textarea
              id="video-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="video-category" className="mb-1 block text-sm text-gray-600">
              Category
            </label>
            <select
              id="video-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass}
            >
              {VIDEO_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => onSave(form)}
            disabled={busy}
            className={`flex-1 ${btnPrimary} py-2.5`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className={`flex-1 ${btnOutline} py-2.5`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
