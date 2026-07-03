'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch, uploadFile } from '@/lib/admin-api';
import { extractYouTubeId } from '@/lib/youtube';
import { useToast } from '@/components/admin/useToast';
import DeleteConfirmationDialog from '@/components/admin/gallery/DeleteConfirmationDialog';
import GalleryPagination from '@/components/admin/gallery/GalleryPagination';
import LoadingOverlay from '@/components/admin/gallery/LoadingOverlay';
import VideoBulkActionsBar from '@/components/admin/video/VideoBulkActionsBar';
import VideoFilters from '@/components/admin/video/VideoFilters';
import VideoFormDialog from '@/components/admin/video/VideoFormDialog';
import VideoGrid from '@/components/admin/video/VideoGrid';
import VideoToolbar from '@/components/admin/video/VideoToolbar';
import {
  DEFAULT_FILTERS,
  type Video,
  type VideoFiltersState,
  type VideoFormData,
  type VideoListResponse,
} from '@/components/admin/video/types';
import { buildVideoQuery, validateVideoFile } from '@/components/admin/video/utils';

function videoToForm(video: Video): VideoFormData {
  return {
    title: video.title,
    description: video.description ?? '',
    sourceType: video.sourceType,
    youtubeUrl: video.youtubeUrl ?? '',
    videoPath: video.videoPath ?? '',
    category: video.category ?? 'events',
  };
}

function normalizeVideo(raw: Video): Video {
  return {
    ...raw,
    sortOrder: raw.sortOrder ?? 0,
    category: raw.category ?? null,
  };
}

export default function VideoManager() {
  const { showToast, Toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [filters, setFilters] = useState<VideoFiltersState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [loadingReorder, setLoadingReorder] = useState(false);
  const submitLock = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadVideos = useCallback(
    async (targetPage: number, opts?: { all?: boolean; preserveOrder?: boolean }) => {
      setLoading(true);
      try {
        const data = await apiFetch<VideoListResponse>(
          buildVideoQuery(filters, targetPage, pageSize, { all: opts?.all })
        );
        const normalized = data.items.map(normalizeVideo);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
        setVideos(normalized);
        if (!opts?.preserveOrder) {
          setOrderDirty(false);
        }
      } catch {
        showToast('Failed to load videos');
      } finally {
        setLoading(false);
      }
    },
    [filters, pageSize, showToast]
  );

  const loadAllForReorder = useCallback(async () => {
    setLoadingReorder(true);
    setLoading(true);
    try {
      const data = await apiFetch<VideoListResponse>(
        buildVideoQuery(DEFAULT_FILTERS, 1, 24, { all: true })
      );
      const normalized = data.items.map(normalizeVideo);
      setTotal(data.total);
      setTotalPages(1);
      setPage(1);
      setVideos(normalized);
      setOrderDirty(false);
    } catch {
      showToast('Failed to load videos for reordering');
    } finally {
      setLoadingReorder(false);
      setLoading(false);
    }
  }, [showToast]);

  const refreshVideos = useCallback(
    async (targetPage = page) => {
      if (reorderMode) {
        await loadVideos(1, { all: true });
      } else {
        await loadVideos(targetPage);
      }
    },
    [reorderMode, page, loadVideos]
  );

  useEffect(() => {
    if (reorderMode) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void loadVideos(1);
    }, filters.search ? 300 : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, pageSize, loadVideos, reorderMode]);

  useEffect(() => {
    if (!reorderMode) return;
    void loadAllForReorder();
  }, [reorderMode, loadAllForReorder]);

  useEffect(() => {
    if (reorderMode || page === 1) return;
    void loadVideos(page);
  }, [page, loadVideos, reorderMode]);

  function openCreateDialog() {
    setDialogMode('create');
    setEditingVideo(null);
    setDialogOpen(true);
  }

  function openEditDialog(video: Video) {
    setDialogMode('edit');
    setEditingVideo(video);
    setDialogOpen(true);
  }

  async function handleUpload(file: File): Promise<string | void> {
    const sizeError = validateVideoFile(file);
    if (sizeError) {
      showToast(sizeError);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const { videoPath } = await uploadFile(file, 'video', setUploadProgress);
      if (!videoPath) throw new Error('Upload failed');
      showToast('Video uploaded', 'success');
      return videoPath;
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function persistVideo(form: VideoFormData) {
    if (submitLock.current) return;

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

    submitLock.current = true;
    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        sourceType: form.sourceType,
        youtubeUrl: form.sourceType === 'youtube' ? form.youtubeUrl : null,
        videoPath: form.sourceType === 'upload' ? form.videoPath : null,
      };

      if (editingVideo) {
        await apiFetch(`/api/videos/${editingVideo.id}`, {
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

      setDialogOpen(false);
      setEditingVideo(null);
      await refreshVideos(editingVideo ? page : 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
      submitLock.current = false;
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/videos/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      setDialogOpen(false);
      setEditingVideo(null);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
      await refreshVideos(page);
      showToast('Video deleted', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  async function runBulkAction(action: 'delete' | 'setCategory', category?: string) {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    if (action === 'delete') {
      setDeleteTarget({ id: '__bulk__', title: `${ids.length} videos` } as Video);
      return;
    }

    setBulkLoading(true);
    try {
      await apiFetch('/api/videos/bulk', {
        method: 'POST',
        body: JSON.stringify({ ids, action, category }),
      });
      setSelectedIds(new Set());
      await refreshVideos(page);
      showToast('Bulk action completed', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Bulk action failed');
    } finally {
      setBulkLoading(false);
    }
  }

  async function confirmBulkDelete() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      setDeleteTarget(null);
      return;
    }
    setDeleting(true);
    try {
      await apiFetch('/api/videos/bulk', {
        method: 'POST',
        body: JSON.stringify({ ids, action: 'delete' }),
      });
      setDeleteTarget(null);
      setSelectedIds(new Set());
      await refreshVideos(page);
      showToast(`${ids.length} video(s) deleted`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  function handleSelect(id: string, selected: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function reorderLocal(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const list = [...videos];
    const from = list.findIndex((v) => v.id === dragId);
    const to = list.findIndex((v) => v.id === targetId);
    if (from < 0 || to < 0) return;

    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);

    setVideos(list);
    setOrderDirty(true);
    setDragId(null);
    setDragOverId(null);
  }

  async function saveOrder() {
    const list = videos;
    if (list.length === 0) return;
    setSavingOrder(true);
    try {
      await apiFetch('/api/videos/reorder', {
        method: 'PUT',
        body: JSON.stringify(
          list.map((video, index) => ({ id: video.id, sortOrder: index }))
        ),
      });
      setOrderDirty(false);
      showToast('Display order saved', 'success');
      await refreshVideos(page);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save order');
    } finally {
      setSavingOrder(false);
    }
  }

  async function toggleReorderMode() {
    if (reorderMode) {
      if (orderDirty) {
        const leave = window.confirm(
          'You have unsaved order changes. Leave reorder mode without saving?'
        );
        if (!leave) return;
      }
      setReorderMode(false);
      setOrderDirty(false);
      setPage(1);
      await loadVideos(1);
      return;
    }

    setReorderMode(true);
    setSelectedIds(new Set());
    await loadAllForReorder();
  }

  const initialForm = editingVideo ? videoToForm(editingVideo) : undefined;

  const initialLoading = loading && videos.length === 0;

  if (initialLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
      <LoadingOverlay visible={saving && !dialogOpen} label="Saving changes..." />

      <VideoFormDialog
        open={dialogOpen}
        mode={dialogMode}
        initialForm={initialForm}
        saving={saving}
        uploading={uploading}
        uploadProgress={uploadProgress}
        onClose={() => {
          if (!saving && !uploading) {
            setDialogOpen(false);
            setEditingVideo(null);
          }
        }}
        onSave={(form) => void persistVideo(form)}
        onUpload={handleUpload}
      />

      <DeleteConfirmationDialog
        open={Boolean(deleteTarget)}
        title="Delete video"
        message={
          deleteTarget?.id === '__bulk__'
            ? `Delete ${selectedIds.size} selected video(s)? This cannot be undone.`
            : deleteTarget
              ? `Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`
              : ''
        }
        loading={deleting}
        onConfirm={() =>
          void (deleteTarget?.id === '__bulk__' ? confirmBulkDelete() : confirmDelete())
        }
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />

      <div className="mx-auto w-full max-w-6xl">
        <VideoToolbar
          total={total}
          hasOrderChanges={orderDirty}
          savingOrder={savingOrder}
          reorderMode={reorderMode}
          loadingReorder={loadingReorder}
          onAddVideo={openCreateDialog}
          onSaveOrder={() => void saveOrder()}
          onToggleReorderMode={() => void toggleReorderMode()}
        />

        {reorderMode && (
          <div
            className="mb-4 rounded-xl border border-[#012D26]/20 bg-[#012D26]/5 px-4 py-3 text-sm text-[#012D26]"
            role="status"
          >
            Reorder mode: showing all {videos.length} video
            {videos.length === 1 ? '' : 's'}. Filters are paused. Drag cards to set global
            display order, then save.
          </div>
        )}

        <div className={reorderMode ? 'pointer-events-none opacity-50' : undefined}>
          <VideoFilters
            filters={filters}
            onChange={(next) => {
              if (reorderMode) return;
              setFilters(next);
              setPage(1);
            }}
            onReset={() => {
              if (reorderMode) return;
              setFilters(DEFAULT_FILTERS);
              setPage(1);
            }}
          />
        </div>

        {!reorderMode && (
          <VideoBulkActionsBar
            selectedCount={selectedIds.size}
            loading={bulkLoading}
            onDelete={() => void runBulkAction('delete')}
            onCategoryChange={(category) => void runBulkAction('setCategory', category)}
            onClearSelection={() => setSelectedIds(new Set())}
          />
        )}

        <VideoGrid
          videos={videos}
          selectedIds={selectedIds}
          dragOverId={dragOverId}
          onSelect={handleSelect}
          onEdit={openEditDialog}
          onDelete={setDeleteTarget}
          onDragStart={setDragId}
          onDragOver={setDragOverId}
          onDragEnd={() => {
            setDragId(null);
            setDragOverId(null);
          }}
          onDrop={reorderLocal}
        />

        {!reorderMode && (
          <GalleryPagination
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            loading={loading}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </div>
    </>
  );
}
