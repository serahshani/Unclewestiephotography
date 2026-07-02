'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { apiFetch, uploadFile } from '@/lib/admin-api';
import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
} from '@/lib/youtube';
import {
  MAX_VIDEO_SIZE_BYTES,
  formatMaxVideoSizeLabel,
} from '@/lib/upload-limits';
import type { VideoSourceType } from '@/lib/video-source';
import { Plus, Trash2, Pencil, X, Upload, Youtube } from 'lucide-react';
import { useToast } from '@/components/admin/useToast';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { sortByDisplayOrder } from '@/lib/sort-media';

interface Video {
  id: string;
  title: string;
  description: string | null;
  sourceType: VideoSourceType;
  youtubeUrl: string | null;
  youtubeId: string | null;
  videoPath: string | null;
  category: string | null;
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

const emptyForm = {
  title: '',
  description: '',
  sourceType: 'youtube' as VideoSourceType,
  youtubeUrl: '',
  videoPath: '',
  category: 'events',
};

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#012D26] focus:ring-2 focus:ring-[#012D26]/20';

const btnPrimary =
  'cursor-pointer rounded-lg bg-[#012D26] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50';

const btnOutline =
  'cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50';

const sourceTabClass = (active: boolean) =>
  `flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    active
      ? 'bg-[#012D26] text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`;

function validateVideoFile(file: File): string | null {
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return `Video must be ${formatMaxVideoSizeLabel()} or smaller`;
  }
  const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (!allowed.includes(file.type)) {
    return 'Only MP4, WebM, and MOV files are allowed';
  }
  return null;
}

export default function VideoManager() {
  const { showToast, Toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Video[]>('/api/videos');
      setVideos(sortByDisplayOrder(data));
    } catch {
      showToast('Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  function openAddForm() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(video: Video) {
    setEditing(video);
    setForm({
      title: video.title,
      description: video.description ?? '',
      sourceType: video.sourceType,
      youtubeUrl: video.youtubeUrl ?? '',
      videoPath: video.videoPath ?? '',
      category: video.category ?? 'events',
    });
    setShowForm(true);
  }

  function closeForm() {
    if (saving || uploading) return;
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const sizeError = validateVideoFile(file);
    if (sizeError) {
      showToast(sizeError);
      return;
    }

    setUploading(true);
    try {
      const { videoPath } = await uploadFile(file, 'video');
      setForm((prev) => ({ ...prev, sourceType: 'upload', videoPath }));
      showToast('Video uploaded', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!form.title.trim()) {
      showToast('Title is required');
      return;
    }

    if (form.sourceType === 'youtube') {
      if (!form.youtubeUrl.trim()) {
        showToast('YouTube URL is required');
        return;
      }
      if (!extractYouTubeId(form.youtubeUrl)) {
        showToast('Enter a valid YouTube URL');
        return;
      }
    } else if (!form.videoPath.trim()) {
      showToast('Upload a video file first');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        category: form.category,
        sourceType: form.sourceType,
        youtubeUrl: form.sourceType === 'youtube' ? form.youtubeUrl : null,
        videoPath: form.sourceType === 'upload' ? form.videoPath : null,
      };

      if (editing) {
        await apiFetch(`/api/videos/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showToast('Video updated', 'success');
      } else {
        await apiFetch('/api/videos', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showToast('Video added', 'success');
      }

      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      await loadVideos();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/videos/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await loadVideos();
      showToast('Video deleted', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  const previewId = extractYouTubeId(form.youtubeUrl);

  const formModal =
    mounted && showForm
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex h-[100dvh] w-full items-end justify-center overflow-hidden bg-black/50 p-0 sm:items-center sm:p-4"
            onClick={closeForm}
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
                  {editing ? 'Edit video' : 'Add video'}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving || uploading}
                  className="cursor-pointer rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      sourceType: 'youtube',
                    }))
                  }
                  className={sourceTabClass(form.sourceType === 'youtube')}
                >
                  <Youtube size={16} />
                  YouTube
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      sourceType: 'upload',
                    }))
                  }
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
                          ? 'Uploading...'
                          : form.videoPath
                            ? 'Replace video file'
                            : 'Choose MP4, WebM, or MOV'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Max {formatMaxVideoSizeLabel()}
                      </span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                        onChange={handleVideoUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>

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
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={saving || uploading}
                  className={`flex-1 ${btnPrimary} py-2.5`}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving || uploading}
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="aspect-video animate-pulse bg-gray-200" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {Toast}
      {formModal}
      <AdminConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete video"
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
            <h1 className="text-2xl font-bold text-[#012D26] sm:text-3xl">Videos</h1>
            <p className="mt-1 text-sm text-gray-500">
              {videos.length} video{videos.length === 1 ? '' : 's'} · YouTube or uploaded files
            </p>
          </div>
          <button
            type="button"
            onClick={openAddForm}
            className={`inline-flex items-center justify-center gap-2 self-start ${btnPrimary}`}
          >
            <Plus size={16} />
            Add video
          </button>
        </header>

        {videos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <p className="text-sm text-gray-500">No videos yet.</p>
            <button
              type="button"
              onClick={openAddForm}
              className={`mt-4 inline-flex items-center gap-2 ${btnPrimary}`}
            >
              <Plus size={16} />
              Add your first video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {videos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="relative overflow-hidden bg-gray-100">
                  {video.sourceType === 'upload' && video.videoPath ? (
                    <video
                      src={video.videoPath}
                      muted
                      playsInline
                      preload="metadata"
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getYouTubeThumbnail(video.youtubeId ?? '')}
                      alt={video.title}
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                    {video.sourceType === 'upload' ? 'Upload' : 'YouTube'}
                  </span>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{video.title}</h3>
                  <p className="mt-0.5 text-xs capitalize text-gray-500">{video.category}</p>
                  <div className="mt-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(video)}
                      className="cursor-pointer rounded p-1.5 text-gray-600 hover:bg-gray-100 hover:text-[#012D26]"
                      aria-label="Edit video"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(video)}
                      className="cursor-pointer rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-800"
                      aria-label="Delete video"
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
