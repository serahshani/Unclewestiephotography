'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { apiFetch, uploadFile } from '@/lib/admin-api';
import { Eye, Upload, Trash2, Save, Send } from 'lucide-react';

interface HeroData {
  title: string;
  subtitle: string | null;
  description: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  typewriterWords: string[];
  logoPath: string | null;
  slides: { id: string; imagePath: string; altText: string; sortOrder: number; isDraft?: boolean }[];
  published?: HeroData;
}

export default function HeroManager() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [typewriterInput, setTypewriterInput] = useState('');

  const loadHero = useCallback(async () => {
    try {
      const data = await apiFetch<HeroData>('/api/hero?preview=true');
      setHero(data);
      setTypewriterInput(data.typewriterWords.join(', '));
    } catch {
      setMessage('Failed to load hero data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHero();
  }, [loadHero]);

  async function saveDraft() {
    if (!hero) return;
    setSaving(true);
    setMessage('');
    try {
      const data = await apiFetch<HeroData>('/api/hero', {
        method: 'PUT',
        body: JSON.stringify({
          draftTitle: hero.title,
          draftSubtitle: hero.subtitle,
          draftDescription: hero.description,
          draftCtaText: hero.ctaText,
          draftCtaUrl: hero.ctaUrl,
          draftTypewriterWords: typewriterInput.split(',').map((w) => w.trim()).filter(Boolean),
          draftLogoPath: hero.logoPath,
        }),
      });
      setHero(data);
      setMessage('Draft saved');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setPublishing(true);
    setMessage('');
    try {
      await saveDraft();
      await apiFetch('/api/hero/publish', { method: 'POST' });
      setMessage('Published successfully');
      await loadHero();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setPublishing(false);
    }
  }

  async function handleSlideUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { imagePath } = await uploadFile(file, 'hero');
      await apiFetch('/api/hero/slides', {
        method: 'POST',
        body: JSON.stringify({
          imagePath,
          altText: file.name.replace(/\.[^.]+$/, ''),
          isDraft: true,
        }),
      });
      await loadHero();
      setMessage('Slide added');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    }
    e.target.value = '';
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !hero) return;
    try {
      const { imagePath } = await uploadFile(file, 'hero');
      setHero({ ...hero, logoPath: imagePath });
      setMessage('Logo uploaded — save draft to keep');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    }
    e.target.value = '';
  }

  async function deleteSlide(id: string) {
    if (!confirm('Delete this slide?')) return;
    try {
      await apiFetch(`/api/hero/slides/${id}`, { method: 'DELETE' });
      await loadHero();
      setMessage('Slide deleted');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!hero) return <p className="text-red-500">Failed to load hero</p>;

  const previewSlides = hero.slides.length > 0 ? hero.slides : [{ imagePath: '/Hero1.webp', altText: 'Preview' }];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#012D26]">Hero Section</h1>
          <p className="text-gray-500">Manage homepage hero carousel and content</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-[#012D26] text-[#012D26] rounded-lg hover:bg-gray-50"
          >
            <Eye size={16} /> {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
          <button
            onClick={saveDraft}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={publish}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 bg-[#012D26] text-white rounded-lg hover:bg-green-900 disabled:opacity-50"
          >
            <Send size={16} /> {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 px-4 py-3 bg-green-50 text-green-800 rounded-lg text-sm">{message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="font-semibold text-lg">Content</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                title="Title"
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                title="Subtitle"
                value={hero.subtitle ?? ''}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                title="Description"
                value={hero.description ?? ''}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">CTA Text</label>
                <input
                  title="CTA Text"
                  value={hero.ctaText ?? ''}
                  onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CTA URL</label>
                <input
                  title="CTA URL"
                  value={hero.ctaUrl ?? ''}
                  onChange={(e) => setHero({ ...hero, ctaUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Typewriter Words (comma-separated)</label>
              <input
                title="Typewriter Words (comma-separated)"
                value={typewriterInput}
                onChange={(e) => setTypewriterInput(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo</label>
              {hero.logoPath && (
                <div className="relative w-24 h-24 mb-2">
                  <Image src={hero.logoPath} alt="Logo" fill className="object-contain" />
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-gray-50 w-fit">
                <Upload size={16} /> Replace Logo
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Carousel Slides</h2>
              <label className="flex items-center gap-2 px-3 py-2 bg-[#012D26] text-white rounded-lg cursor-pointer text-sm">
                <Upload size={14} /> Add Slide
                <input type="file" accept="image/*" onChange={handleSlideUpload} className="hidden" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {hero.slides.map((slide) => (
                <div key={slide.id} className="relative group border rounded-lg overflow-hidden">
                  <div className="relative aspect-video">
                    <Image src={slide.imagePath} alt={slide.altText} fill className="object-cover" />
                  </div>
                  <div className="p-2 text-xs text-gray-600 truncate">{slide.altText}</div>
                  {slide.isDraft && (
                    <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded">Draft</span>
                  )}
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete slide"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8 h-fit">
            <div className="bg-gray-100 px-4 py-2 text-sm font-medium">Live Preview</div>
            <div className="relative h-80 bg-black">
              <Image
                src={previewSlides[0].imagePath}
                alt="Preview"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                {hero.logoPath && (
                  <div className="relative w-20 h-20 mb-3">
                    <Image src={hero.logoPath} alt="Logo" fill className="object-contain" />
                  </div>
                )}
                <h2 className="text-2xl font-bold">{hero.title}</h2>
                {hero.subtitle && <p className="text-sm mt-1 opacity-80">{hero.subtitle}</p>}
                {hero.ctaText && (
                  <span className="mt-4 px-4 py-2 bg-white text-[#012D26] rounded-lg text-sm font-semibold">
                    {hero.ctaText}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
