'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { apiFetch, uploadFile } from '@/lib/admin-api';
import { Upload, Trash2, Pencil, Star } from 'lucide-react';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  imagePath: string;
  altText: string;
  category: string | null;
  featured: boolean;
}

const CATEGORIES = ['weddings', 'portraits', 'events', 'landscapes', 'fashion', 'wildlife', 'urban'];

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState<GalleryImage | null>(null);

  const loadImages = useCallback(async () => {
    try {
      const data = await apiFetch<GalleryImage[]>('/api/gallery');
      setImages(data);
    } catch {
      setMessage('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
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
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'Upload failed');
      }
    }
    await loadImages();
    setMessage('Images uploaded');
    e.target.value = '';
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image?')) return;
    try {
      await apiFetch(`/api/gallery/${id}`, { method: 'DELETE' });
      await loadImages();
      setMessage('Image deleted');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  async function handleSave() {
    if (!editing) return;
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
      setMessage('Image updated');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function handleReplace(id: string, file: File) {
    try {
      const { imagePath } = await uploadFile(file, 'gallery');
      await apiFetch(`/api/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ imagePath }),
      });
      await loadImages();
      setMessage('Image replaced');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Replace failed');
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#012D26]">Gallery</h1>
          <p className="text-gray-500">{images.length} images</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-[#012D26] text-white rounded-lg cursor-pointer">
          <Upload size={16} /> Upload Images
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {message && (
        <div className="mb-6 px-4 py-3 bg-green-50 text-green-800 rounded-lg text-sm">{message}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-xl shadow-md overflow-hidden group">
            <div className="relative aspect-square">
              <Image src={img.imagePath} alt={img.altText} fill className="object-cover" />
              {img.featured && (
                <span className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded">
                  <Star size={12} fill="white" />
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="font-medium text-sm truncate">{img.title}</p>
              <p className="text-xs text-gray-500 capitalize">{img.category}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditing(img)}
                  className="p-1.5 text-gray-600 hover:text-[#012D26]"
                  aria-label="Edit image"
                >
                  <Pencil size={14} />
                </button>
                <label className="p-1.5 text-gray-600 hover:text-[#012D26] cursor-pointer" aria-label="Replace image">
                  <Upload size={14} />
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
                  onClick={() => handleDelete(img.id)}
                  className="p-1.5 text-red-600 hover:text-red-800"
                  aria-label="Delete image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Edit Image</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                title="Title"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alt Text</label>
              <input
                title="Alt Text"
                value={editing.altText}
                onChange={(e) => setEditing({ ...editing, altText: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                title="Description"
                value={editing.description ?? ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                title="Category"
                value={editing.category ?? ''}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input
                title="Featured on homepage"
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
              />
              Featured on homepage
            </label>
            <div className="flex gap-3">
              <button onClick={handleSave} className="flex-1 bg-[#012D26] text-white py-2 rounded-lg">Save</button>
              <button onClick={() => setEditing(null)} className="flex-1 border py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
