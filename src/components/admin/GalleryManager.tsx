'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch, uploadFile } from '@/lib/admin-api';
import { useToast } from '@/components/admin/useToast';
import BulkActionsBar from '@/components/admin/gallery/BulkActionsBar';
import DeleteConfirmationDialog from '@/components/admin/gallery/DeleteConfirmationDialog';
import GalleryFilters from '@/components/admin/gallery/GalleryFilters';
import GalleryGrid from '@/components/admin/gallery/GalleryGrid';
import GalleryPagination from '@/components/admin/gallery/GalleryPagination';
import GalleryPreviewModal from '@/components/admin/gallery/GalleryPreviewModal';
import GalleryToolbar from '@/components/admin/gallery/GalleryToolbar';
import LoadingOverlay from '@/components/admin/gallery/LoadingOverlay';
import UploadDialog from '@/components/admin/gallery/UploadDialog';
import {
  DEFAULT_FILTERS,
  type GalleryFiltersState,
  type GalleryImage,
  type GalleryListResponse,
  type PendingUpload,
  type UploadFormData,
} from '@/components/admin/gallery/types';
import { buildGalleryQuery, parseTagsInput } from '@/components/admin/gallery/utils';

function imageToForm(image: GalleryImage): UploadFormData {
  return {
    title: image.title,
    description: image.description ?? '',
    altText: image.altText,
    category: image.category ?? 'events',
    tags: (image.tags ?? []).join(', '),
    photographerCredit: image.photographerCredit ?? '',
    featured: image.featured,
    sortOrder: image.sortOrder ?? 0,
  };
}

function normalizeImage(raw: GalleryImage): GalleryImage {
  return {
    ...raw,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    published: raw.published ?? true,
    viewCount: raw.viewCount ?? 0,
    photographerCredit: raw.photographerCredit ?? null,
    fileSizeBytes: raw.fileSizeBytes ?? null,
    width: raw.width ?? null,
    height: raw.height ?? null,
  };
}

export default function GalleryManager() {
  const { showToast, Toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [filters, setFilters] = useState<GalleryFiltersState>(DEFAULT_FILTERS);
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
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [loadingReorder, setLoadingReorder] = useState(false);
  const submitLock = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadImages = useCallback(
    async (targetPage: number, opts?: { all?: boolean; preserveOrder?: boolean }) => {
      setLoading(true);
      try {
        const data = await apiFetch<GalleryListResponse>(
          buildGalleryQuery(filters, targetPage, pageSize, { all: opts?.all })
        );
        const normalized = data.items.map(normalizeImage);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.page);
        setImages(normalized);
        if (!opts?.preserveOrder) {
          setOrderDirty(false);
        }
      } catch {
        showToast('Failed to load gallery');
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
      const data = await apiFetch<GalleryListResponse>(
        buildGalleryQuery(DEFAULT_FILTERS, 1, 24, { all: true })
      );
      const normalized = data.items.map(normalizeImage);
      setTotal(data.total);
      setTotalPages(1);
      setPage(1);
      setImages(normalized);
      setOrderDirty(false);
    } catch {
      showToast('Failed to load gallery for reordering');
    } finally {
      setLoadingReorder(false);
      setLoading(false);
    }
  }, [showToast]);

  const refreshGallery = useCallback(
    async (targetPage = page) => {
      if (reorderMode) {
        await loadImages(1, { all: true });
      } else {
        await loadImages(targetPage);
      }
    },
    [reorderMode, page, loadImages]
  );

  useEffect(() => {
    if (reorderMode) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void loadImages(1);
    }, filters.search ? 300 : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, pageSize, loadImages, reorderMode]);

  useEffect(() => {
    if (!reorderMode) return;
    void loadAllForReorder();
  }, [reorderMode, loadAllForReorder]);

  useEffect(() => {
    if (reorderMode || page === 1) return;
    void loadImages(page);
  }, [page, loadImages, reorderMode]);

  function openCreateDialog() {
    setDialogMode('create');
    setEditingImage(null);
    setDialogOpen(true);
  }

  function openEditDialog(image: GalleryImage) {
    setDialogMode('edit');
    setEditingImage(image);
    setPreviewImage(null);
    setDialogOpen(true);
  }

  async function uploadPendingFile(pending: PendingUpload) {
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadFile(pending.file, 'gallery', setUploadProgress);
      if (!result.imagePath) throw new Error('Upload failed');
      return result.imagePath;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function persistImage(
    form: UploadFormData,
    pending: PendingUpload | null,
    published: boolean,
    existing?: GalleryImage | null
  ) {
    if (submitLock.current) return;
    submitLock.current = true;
    setSaving(true);

    try {
      let imagePath = existing?.imagePath;
      let fileSizeBytes = existing?.fileSizeBytes ?? null;
      let width = existing?.width ?? null;
      let height = existing?.height ?? null;

      if (pending) {
        imagePath = await uploadPendingFile(pending);
        fileSizeBytes = pending.file.size;
        width = pending.width;
        height = pending.height;
      }

      if (!imagePath) {
        showToast('Please select an image to upload');
        return;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        altText: form.altText.trim(),
        category: form.category,
        tags: parseTagsInput(form.tags),
        featured: form.featured,
        published,
        photographerCredit: form.photographerCredit.trim() || null,
        sortOrder: form.sortOrder,
        fileSizeBytes,
        width,
        height,
        imagePath,
      };

      if (existing) {
        await apiFetch(`/api/gallery/${existing.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showToast(published ? 'Image published' : 'Image updated', 'success');
      } else {
        await apiFetch('/api/gallery', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showToast(published ? 'Image published' : 'Draft saved', 'success');
      }

      setDialogOpen(false);
      setEditingImage(null);
      await refreshGallery(existing ? page : 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
      submitLock.current = false;
    }
  }

  async function handleUnpublish() {
    if (!editingImage || submitLock.current) return;
    submitLock.current = true;
    setSaving(true);
    try {
      await apiFetch(`/api/gallery/${editingImage.id}`, {
        method: 'PUT',
        body: JSON.stringify({ published: false }),
      });
      setDialogOpen(false);
      setEditingImage(null);
      await refreshGallery(page);
      showToast('Image unpublished', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unpublish failed');
    } finally {
      setSaving(false);
      submitLock.current = false;
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/gallery/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      setPreviewImage(null);
      setDialogOpen(false);
      setEditingImage(null);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget.id);
        return next;
      });
      await refreshGallery(page);
      showToast('Image deleted', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  async function runBulkAction(
    action: 'delete' | 'publish' | 'unpublish' | 'setCategory',
    category?: string
  ) {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    if (action === 'delete') {
      setDeleteTarget({ id: '__bulk__', title: `${ids.length} images` } as GalleryImage);
      return;
    }

    setBulkLoading(true);
    try {
      await apiFetch('/api/gallery/bulk', {
        method: 'POST',
        body: JSON.stringify({ ids, action, category }),
      });
      setSelectedIds(new Set());
      await refreshGallery(page);
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
      await apiFetch('/api/gallery/bulk', {
        method: 'POST',
        body: JSON.stringify({ ids, action: 'delete' }),
      });
      setDeleteTarget(null);
      setSelectedIds(new Set());
      await refreshGallery(page);
      showToast(`${ids.length} image(s) deleted`, 'success');
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
    const list = [...images];
    const from = list.findIndex((i) => i.id === dragId);
    const to = list.findIndex((i) => i.id === targetId);
    if (from < 0 || to < 0) return;

    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);

    setImages(list);
    setOrderDirty(true);
    setDragId(null);
    setDragOverId(null);
  }

  async function saveOrder() {
    const list = images;
    if (list.length === 0) return;
    setSavingOrder(true);
    try {
      await apiFetch('/api/gallery/reorder', {
        method: 'PUT',
        body: JSON.stringify(
          list.map((img, index) => ({ id: img.id, sortOrder: index }))
        ),
      });
      setOrderDirty(false);
      showToast('Display order saved', 'success');
      await refreshGallery(page);
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
      await loadImages(1);
      return;
    }

    setReorderMode(true);
    setSelectedIds(new Set());
    await loadAllForReorder();
  }

  const initialLoading = loading && images.length === 0;

  if (initialLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {Toast}
      <LoadingOverlay visible={saving && !dialogOpen} label="Saving changes..." />

      <UploadDialog
        open={dialogOpen}
        mode={dialogMode}
        isPublished={editingImage?.published}
        initialForm={editingImage ? imageToForm(editingImage) : undefined}
        existingImagePath={editingImage?.imagePath}
        saving={saving}
        uploading={uploading}
        uploadProgress={uploadProgress}
        onClose={() => {
          if (!saving && !uploading) {
            setDialogOpen(false);
            setEditingImage(null);
          }
        }}
        onSaveDraft={(form, pending) =>
          void persistImage(form, pending, false, editingImage)
        }
        onPublish={(form, pending) =>
          void persistImage(form, pending, true, editingImage)
        }
        onUpdate={(form, pending) =>
          void persistImage(form, pending, editingImage?.published ?? true, editingImage)
        }
        onUnpublish={dialogMode === 'edit' ? () => void handleUnpublish() : undefined}
        onDelete={
          dialogMode === 'edit' && editingImage
            ? () => setDeleteTarget(editingImage)
            : undefined
        }
      />

      <GalleryPreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
        onEdit={openEditDialog}
        onDelete={setDeleteTarget}
      />

      <DeleteConfirmationDialog
        open={Boolean(deleteTarget)}
        title="Delete image"
        message={
          deleteTarget?.id === '__bulk__'
            ? `Delete ${selectedIds.size} selected image(s)? This cannot be undone.`
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
        <GalleryToolbar
          total={total}
          hasOrderChanges={orderDirty}
          savingOrder={savingOrder}
          reorderMode={reorderMode}
          loadingReorder={loadingReorder}
          onAddImage={openCreateDialog}
          onSaveOrder={() => void saveOrder()}
          onToggleReorderMode={() => void toggleReorderMode()}
        />

        {reorderMode && (
          <div
            className="mb-4 rounded-xl border border-[#012D26]/20 bg-[#012D26]/5 px-4 py-3 text-sm text-[#012D26]"
            role="status"
          >
            Reorder mode: showing all {images.length} image
            {images.length === 1 ? '' : 's'} in the gallery. Filters are paused. Drag
            cards to set global display order, then save.
          </div>
        )}

        <div className={reorderMode ? 'pointer-events-none opacity-50' : undefined}>
          <GalleryFilters
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
          <BulkActionsBar
            selectedCount={selectedIds.size}
            loading={bulkLoading}
            onPublish={() => void runBulkAction('publish')}
            onUnpublish={() => void runBulkAction('unpublish')}
            onDelete={() => void runBulkAction('delete')}
            onCategoryChange={(category) => void runBulkAction('setCategory', category)}
            onClearSelection={() => setSelectedIds(new Set())}
          />
        )}

        <GalleryGrid
          images={images}
          selectedIds={selectedIds}
          dragOverId={dragOverId}
          onSelect={handleSelect}
          onOpen={setPreviewImage}
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
          <>
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
          </>
        )}
      </div>
    </>
  );
}
