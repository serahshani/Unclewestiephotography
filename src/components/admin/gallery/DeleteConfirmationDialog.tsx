'use client';

import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

type DeleteConfirmationDialogProps = {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmationDialog({
  open,
  title,
  message,
  loading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <AdminConfirmModal
      open={open}
      title={title}
      message={message}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      loading={loading}
      loadingLabel="Deleting..."
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
