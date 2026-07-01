'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { apiFetch, uploadFile } from '@/lib/admin-api';
import { MAX_HERO_SIZE_BYTES, formatMaxHeroSizeLabel } from '@/lib/upload-limits';
import { Upload, Trash2, Save, Send, ImageIcon } from 'lucide-react';
import { useToast } from '@/components/admin/useToast';

interface HeroData {
  title: string;
  subtitle: string | null;
  description: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  typewriterWords: string[];
  logoPath: string | null;
  slides: {
    id: string;
    imagePath: string;
    altText: string;
    sortOrder: number;
    isDraft?: boolean;
  }[];
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#012D26] focus:ring-2 focus:ring-[#012D26]/20';

const btnMuted =
  'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:py-2.5';

const btnPrimary =
  'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#012D26] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:py-2.5';

function parseTypewriterWords(input: string): string[] {
  return input
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);
}

function isDefaultSlide(id: string) {
  return id.startsWith('default-hero-slide-');
}

function validateHeroImage(file: File): string | null {
  if (file.size > MAX_HERO_SIZE_BYTES) {
    return `Image must be ${formatMaxHeroSizeLabel()} or smaller`;
  }
  return null;
}

function LogoPreview({
  src,
  alt,
  className,
  compact = false,
  onDark = false,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  compact?: boolean;
  onDark?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center ${
          onDark ? 'text-white/50' : 'text-gray-400'
        } ${compact ? 'h-full w-full' : 'py-2'}`}
      >
        <ImageIcon size={compact ? 28 : 32} strokeWidth={1.5} />
        {!compact && <span className="mt-1 text-xs">No logo</span>}
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      key={src}
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export default function HeroManager() {
  const { showToast, Toast } = useToast();
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [typewriterInput, setTypewriterInput] = useState('');
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [logoPreviewSrc, setLogoPreviewSrc] = useState<string | null>(null);

  const loadHero = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<HeroData>('/api/hero?preview=true');
      setHero(data);
      setTypewriterInput(data.typewriterWords.join(', '));
      setSelectedSlideId(data.slides[0]?.id ?? null);
      setLogoPreviewSrc(data.logoPath);
    } catch {
      showToast('Could not load hero content. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadHero();
  }, [loadHero]);

  function notify(text: string, type: 'success' | 'error' = 'success') {
    showToast(text, type);
  }

  async function persistDraft(options?: { silent?: boolean }) {
    if (!hero) return false;
    if (!options?.silent) setSaving(true);
    try {
      const typewriterWords = parseTypewriterWords(typewriterInput);
      const data = await apiFetch<HeroData>('/api/hero', {
        method: 'PUT',
        body: JSON.stringify({
          draftTitle: typewriterWords.join(' ') || hero.title,
          draftSubtitle: hero.subtitle,
          draftDescription: hero.description,
          draftCtaText: hero.ctaText,
          draftCtaUrl: hero.ctaUrl,
          draftTypewriterWords: typewriterWords,
          draftLogoPath: hero.logoPath,
        }),
      });
      setHero(data);
      setTypewriterInput(data.typewriterWords.join(', '));
      setLogoPreviewSrc(data.logoPath);
      if (!options?.silent) notify('Draft saved');
      return true;
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
      return false;
    } finally {
      if (!options?.silent) setSaving(false);
    }
  }

  async function saveDraft() {
    await persistDraft();
  }

  async function publish() {
    setPublishing(true);
    try {
      const saved = await persistDraft({ silent: true });
      if (!saved) return;
      await apiFetch('/api/hero/publish', { method: 'POST' });
      notify('Published — homepage updated');
      await loadHero();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Publish failed', 'error');
    } finally {
      setPublishing(false);
    }
  }

  async function handleSlideUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeError = validateHeroImage(file);
    if (sizeError) {
      notify(sizeError, 'error');
      e.target.value = '';
      return;
    }
    try {
      const { imagePath } = await uploadFile(file, 'hero');
      const slide = await apiFetch<{ id: string }>('/api/hero/slides', {
        method: 'POST',
        body: JSON.stringify({
          imagePath,
          altText: file.name.replace(/\.[^.]+$/, ''),
          isDraft: true,
        }),
      });
      await loadHero();
      setSelectedSlideId(slide.id);
      notify('Slide added');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Upload failed', 'error');
    }
    e.target.value = '';
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !hero) return;
    const sizeError = validateHeroImage(file);
    if (sizeError) {
      notify(sizeError, 'error');
      e.target.value = '';
      return;
    }
    try {
      const blobUrl = URL.createObjectURL(file);
      setLogoPreviewSrc(blobUrl);
      const { imagePath } = await uploadFile(file, 'hero');
      URL.revokeObjectURL(blobUrl);
      setHero((prev) => (prev ? { ...prev, logoPath: imagePath } : prev));
      setLogoPreviewSrc(`${imagePath}?v=${Date.now()}`);
      await apiFetch<HeroData>('/api/hero', {
        method: 'PUT',
        body: JSON.stringify({ draftLogoPath: imagePath }),
      });
      notify('Logo updated');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Upload failed', 'error');
    }
    e.target.value = '';
  }

  async function deleteSlide(id: string) {
    if (!confirm('Delete this slide?')) return;
    try {
      await apiFetch(`/api/hero/slides/${id}`, { method: 'DELETE' });
      await loadHero();
      if (selectedSlideId === id) {
        setSelectedSlideId(null);
      }
      notify('Slide removed');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  }

  function selectSlide(id: string) {
    setSelectedSlideId(id);
    document.getElementById('hero-live-preview')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 pb-24">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-44 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-48 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (!hero) {
    return (
      <>
        {Toast}
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load hero content.
        </div>
      </>
    );
  }

  const displayLogo = logoPreviewSrc ?? hero.logoPath;

  const headlinePreview =
    parseTypewriterWords(typewriterInput).join(' ') || 'Uncle Westiee Studios';
  const previewSlide =
    hero.slides.find((slide) => slide.id === selectedSlideId) ?? hero.slides[0];

  return (
    <>
      {Toast}
    <div className="mx-auto w-full max-w-3xl pb-28 sm:pb-8">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-[#012D26]">Hero Section</h1>
        <p className="mt-1 text-sm text-gray-500">
          Edit your homepage banner. Prefilled values are what visitors see today.
        </p>
      </header>

      <section
        id="hero-live-preview"
        className="mb-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="border-b border-gray-100 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-gray-500">
          Live preview
        </div>
        <div className="relative h-52 bg-black sm:h-64">
          {previewSlide && (
            <Image
              src={previewSlide.imagePath}
              alt="Homepage preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            {displayLogo ? (
              <LogoPreview
                src={displayLogo}
                alt="Logo preview"
                className="mb-3 max-h-28 w-auto max-w-[min(240px,75vw)] object-contain sm:max-h-36"
              />
            ) : null}
            <p className="text-lg font-bold leading-tight sm:text-xl">{headlinePreview}</p>
            {hero.ctaText && (
              <span className="mt-3 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#012D26] sm:text-sm">
                {hero.ctaText}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mb-5 hidden gap-3 sm:flex sm:justify-end">
        <button type="button" onClick={saveDraft} disabled={saving} className={btnMuted}>
          <Save size={16} />
          {saving ? 'Saving...' : 'Save draft'}
        </button>
        <button type="button" onClick={publish} disabled={publishing} className={btnPrimary}>
          <Send size={16} />
          {publishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      <div className="space-y-5">
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <h2 className="font-semibold text-gray-900">Headline</h2>
          <div>
            <label htmlFor="hero-typewriter" className="mb-1 block text-sm text-gray-600">
              Animated words
            </label>
            <input
              id="hero-typewriter"
              value={typewriterInput}
              onChange={(e) => setTypewriterInput(e.target.value)}
              placeholder="Uncle Westiee, Studios"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-gray-400">Separate words with commas</p>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <h2 className="font-semibold text-gray-900">Call to action</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="hero-cta-text" className="mb-1 block text-sm text-gray-600">
                Button text
              </label>
              <input
                id="hero-cta-text"
                value={hero.ctaText ?? ''}
                onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                placeholder="View Portfolio"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="hero-cta-url" className="mb-1 block text-sm text-gray-600">
                Button link
              </label>
              <input
                id="hero-cta-url"
                value={hero.ctaUrl ?? ''}
                onChange={(e) => setHero({ ...hero, ctaUrl: e.target.value })}
                placeholder="/portfolio"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <h2 className="mb-4 font-semibold text-gray-900">Logo</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#012D26]/30 bg-[#012D26] sm:h-32 sm:w-32">
              <LogoPreview
                src={displayLogo}
                alt="Current logo"
                onDark
                compact
                className="max-h-full max-w-full object-contain p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 self-start rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <Upload size={16} />
              {displayLogo ? 'Replace logo' : 'Upload logo'}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <p className="text-xs text-gray-400">JPEG, PNG, or WebP · max {formatMaxHeroSizeLabel()}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Background slides</h2>
              <p className="mt-0.5 text-xs text-gray-400">Tap a slide to preview · max {formatMaxHeroSizeLabel()} each</p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-lg bg-[#012D26] px-4 py-2.5 text-sm font-medium text-white hover:bg-green-900">
              <Upload size={14} />
              Add slide
              <input type="file" accept="image/*" onChange={handleSlideUpload} className="hidden" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {hero.slides.map((slide) => {
              const isSelected = slide.id === selectedSlideId;
              return (
              <div
                key={slide.id}
                className={`group relative overflow-hidden rounded-lg ${
                  isSelected ? 'ring-2 ring-[#012D26]' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectSlide(slide.id)}
                  className="block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#012D26]"
                  aria-label={`Preview ${slide.altText}${isSelected ? ' (selected)' : ''}`}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={slide.imagePath}
                      alt={slide.altText}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 200px"
                    />
                  </div>
                </button>
                {slide.isDraft && (
                  <span className="pointer-events-none absolute left-1.5 top-1.5 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Draft
                  </span>
                )}
                {isSelected && (
                  <span className="pointer-events-none absolute bottom-1.5 left-1.5 rounded bg-[#012D26] px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Preview
                  </span>
                )}
                {!isDefaultSlide(slide.id) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(slide.id);
                    }}
                    className="absolute right-1.5 top-1.5 z-10 rounded bg-red-600 p-1 text-white"
                    aria-label="Delete slide"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
            })}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] sm:hidden">
        <div className="mx-auto flex max-w-3xl gap-2">
          <button type="button" onClick={saveDraft} disabled={saving} className={btnMuted}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={publish} disabled={publishing} className={btnPrimary}>
            <Send size={16} />
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
