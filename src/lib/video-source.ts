import { extractYouTubeId } from '@/lib/youtube';
import { isSafeVideoPath } from '@/lib/upload';

export type VideoSourceType = 'youtube' | 'upload';

type VideoFields = {
  title: string;
  description?: string | null;
  category?: string | null;
  sortOrder?: number;
  sourceType: VideoSourceType;
  youtubeUrl?: string | null;
  youtubeId?: string | null;
  videoPath?: string | null;
};

export function buildVideoCreateData(input: {
  title: string;
  description?: string | null;
  category?: string | null;
  sortOrder?: number;
  sourceType: VideoSourceType;
  youtubeUrl?: string | null;
  videoPath?: string | null;
}): { data: VideoFields; error?: string } {
  if (input.sourceType === 'youtube') {
    const youtubeId = extractYouTubeId(input.youtubeUrl ?? '');
    if (!youtubeId) {
      return { data: input as VideoFields, error: 'Invalid YouTube URL' };
    }
    return {
      data: {
        title: input.title,
        description: input.description,
        category: input.category,
        sortOrder: input.sortOrder,
        sourceType: 'youtube',
        youtubeUrl: input.youtubeUrl ?? null,
        youtubeId,
        videoPath: null,
      },
    };
  }

  const videoPath = input.videoPath ?? '';
  if (!isSafeVideoPath(videoPath)) {
    return { data: input as VideoFields, error: 'Invalid uploaded video file' };
  }

  return {
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      sortOrder: input.sortOrder,
      sourceType: 'upload',
      youtubeUrl: null,
      youtubeId: null,
      videoPath,
    },
  };
}

export function buildVideoUpdateData(
  existing: {
    sourceType: string;
    youtubeUrl: string | null;
    youtubeId: string | null;
    videoPath: string | null;
  },
  input: {
    sourceType?: VideoSourceType;
    youtubeUrl?: string | null;
    videoPath?: string | null;
  }
): { data: Record<string, unknown>; error?: string; deleteVideoPath?: string | null } {
  const sourceType = (input.sourceType ?? existing.sourceType) as VideoSourceType;
  const deleteVideoPath =
    existing.sourceType === 'upload' &&
    existing.videoPath &&
    (sourceType !== 'upload' ||
      (input.videoPath && input.videoPath !== existing.videoPath))
      ? existing.videoPath
      : null;

  if (sourceType === 'youtube') {
    const youtubeUrl = input.youtubeUrl ?? existing.youtubeUrl ?? '';
    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return { data: {}, error: 'Invalid YouTube URL' };
    }
    return {
      data: {
        sourceType: 'youtube',
        youtubeUrl,
        youtubeId,
        videoPath: null,
      },
      deleteVideoPath,
    };
  }

  const videoPath = input.videoPath ?? existing.videoPath ?? '';
  if (!isSafeVideoPath(videoPath)) {
    return { data: {}, error: 'Invalid uploaded video file' };
  }

  return {
    data: {
      sourceType: 'upload',
      videoPath,
      youtubeUrl: null,
      youtubeId: null,
    },
    deleteVideoPath,
  };
}
