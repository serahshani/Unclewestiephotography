import { NextRequest } from 'next/server';
import { getSessionFromRequest, validateCsrf } from '@/lib/auth';
import { processAndSaveImage, processAndSaveVideo, UploadType } from '@/lib/upload';
import { jsonError, jsonSuccess } from '@/lib/api-utils';

export const maxDuration = 120;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return jsonError('Unauthorized', 401);
  if (!validateCsrf(request)) return jsonError('Invalid CSRF token', 403);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError('Invalid form data');
  }

  const file = formData.get('file');
  const type = formData.get('type') as UploadType;

  if (!(file instanceof File)) {
    return jsonError('No file provided');
  }

  if (type !== 'hero' && type !== 'gallery' && type !== 'video') {
    return jsonError('Invalid upload type. Use "hero", "gallery", or "video"');
  }

  try {
    if (type === 'video') {
      const result = await processAndSaveVideo(file);
      return jsonSuccess(result, 201);
    }

    const result = await processAndSaveImage(file, type);
    return jsonSuccess(result, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return jsonError(message);
  }
}
