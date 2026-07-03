import { z } from 'zod';
import { isSafeImagePath, isSafeVideoPath } from '@/lib/upload';

const imagePathSchema = z
  .string()
  .min(1)
  .refine((val) => isSafeImagePath(val), 'Invalid image path');

const uploadImagePathSchema = (type?: 'hero' | 'gallery') =>
  z
    .string()
    .min(1)
    .refine((val) => isSafeImagePath(val, type), `Invalid ${type ?? 'image'} path`);

export const loginSchema = z.object({
  username: z.string().min(3).max(64),
  password: z.string().min(8).max(128),
});

export const heroUpdateSchema = z.object({
  draftTitle: z.string().min(1).max(200).optional(),
  draftSubtitle: z.string().max(300).optional().nullable(),
  draftDescription: z.string().max(2000).optional().nullable(),
  draftCtaText: z.string().max(100).optional().nullable(),
  draftCtaUrl: z
    .string()
    .max(500)
    .refine((val) => val === '' || val.startsWith('/'), 'CTA URL must be a relative path')
    .optional()
    .nullable()
    .or(z.literal('')),
  draftTypewriterWords: z.array(z.string().max(50)).max(10).optional().nullable(),
  draftLogoPath: imagePathSchema.optional().nullable(),
});

export const heroSlideSchema = z.object({
  imagePath: imagePathSchema,
  altText: z.string().min(1).max(300),
  sortOrder: z.number().int().min(0).optional(),
  isDraft: z.boolean().optional(),
});

export const heroSlideReorderSchema = z.array(
  z.object({
    id: z.string().min(1),
    sortOrder: z.number().int().min(0),
  })
);

export const galleryCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  imagePath: imagePathSchema,
  altText: z.string().min(1).max(300),
  category: z.string().max(50).optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
});

export const galleryUpdateSchema = galleryCreateSchema.partial();

export const videoSourceTypeSchema = z.enum(['youtube', 'upload']);

export const videoCreateSchema = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional().nullable(),
    category: z.string().max(50).optional().nullable(),
    sortOrder: z.number().int().min(0).optional(),
    sourceType: videoSourceTypeSchema,
    youtubeUrl: z.string().url().max(500).optional().nullable(),
    videoPath: z.string().max(500).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.sourceType === 'youtube') {
      if (!data.youtubeUrl?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'YouTube URL is required',
          path: ['youtubeUrl'],
        });
      }
    } else if (!data.videoPath?.trim() || !isSafeVideoPath(data.videoPath)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A valid uploaded video is required',
        path: ['videoPath'],
      });
    }
  });

export const videoUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  sourceType: videoSourceTypeSchema.optional(),
  youtubeUrl: z.string().url().max(500).optional().nullable(),
  videoPath: z.string().max(500).optional().nullable(),
});
