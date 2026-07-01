'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/admin-api';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';
import { Plus, Trash2, Pencil } from 'lucide-react';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  youtubeId: string;
  category: string | null;
}

const CATEGORIES = ['weddings', 'portraits', 'events', 'landscapes', 'fashion', 'wildlife', 'urban'];

export default function VideoManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState({ title: '', description: '', youtubeUrl: '', category: 'events' });

  const loadVideos = useCallback(async () => {
    try {
      const data = await apiFetch<Video[]>('/api/videos');
      setVideos(data);
    } catch {
      setMessage('Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  async function handleSubmit() {
    try {
      if (editing) {
        await apiFetch(`/api/videos/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        setMessage('Video updated');
      } else {
        await apiFetch('/api/videos', {
          method: 'POST',
          body: JSON.stringify(form),
        });
        setMessage('Video added');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', youtubeUrl: '', category: 'events' });
      await loadVideos();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this video?')) return;
    try {
      await apiFetch(`/api/videos/${id}`, { method: 'DELETE' });
      await loadVideos();
      setMessage('Video deleted');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  function startEdit(video: Video) {
    setEditing(video);
    setForm({
      title: video.title,
      description: video.description ?? '',
      youtubeUrl: video.youtubeUrl,
      category: video.category ?? 'events',
    });
    setShowForm(true);
  }

  const previewId = form.youtubeUrl ? form.youtubeUrl.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1] : null;

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#012D26]">Videos</h1>
          <p className="text-gray-500">{videos.length} YouTube videos</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', youtubeUrl: '', category: 'events' }); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#012D26] text-white rounded-lg"
        >
          <Plus size={16} /> Add Video
        </button>
      </div>

      {message && (
        <div className="mb-6 px-4 py-3 bg-green-50 text-green-800 rounded-lg text-sm">{message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={getYouTubeThumbnail(video.youtubeId)}
                alt={video.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
              <p className="text-xs text-gray-500 capitalize mt-1">{video.category}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => startEdit(video)} className="p-1.5 text-gray-600 hover:text-[#012D26]" aria-label="Edit video">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(video.id)} className="p-1.5 text-red-600" aria-label="Delete video">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">{editing ? 'Edit Video' : 'Add Video'}</h2>
            <div>
              <label className="block text-sm font-medium mb-1">YouTube URL</label>
              <input
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            {previewId && (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={getYouTubeEmbedUrl(previewId)}
                  title="Preview"
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                title="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                title="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                title="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="flex-1 bg-[#012D26] text-white py-2 rounded-lg">Save</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 border py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
