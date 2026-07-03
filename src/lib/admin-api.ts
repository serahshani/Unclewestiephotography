'use client';

export function getCsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

type ApiPayload = Record<string, unknown> & { error?: string };

function fallbackErrorMessage(status: number): string {
  if (status === 401) return 'Invalid username or password';
  if (status === 403) return 'You do not have permission to perform this action';
  if (status === 429) return 'Too many attempts. Please wait and try again';
  if (status === 503) return 'Service temporarily unavailable. Please try again later';
  if (status >= 500) return 'Server error. Please try again later';
  return 'Request failed';
}

export async function parseApiResponse(response: Response): Promise<ApiPayload> {
  const text = await response.text();

  if (!text.trim()) {
    return response.ok ? {} : { error: fallbackErrorMessage(response.status) };
  }

  try {
    return JSON.parse(text) as ApiPayload;
  } catch {
    return {
      error: response.ok
        ? 'Received an invalid response from the server'
        : fallbackErrorMessage(response.status),
    };
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  const method = (options.method ?? 'GET').toUpperCase();

  if (method !== 'GET' && method !== 'HEAD') {
    const csrf = getCsrfToken();
    if (csrf) headers.set('X-CSRF-Token', csrf);
  }

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers, credentials: 'include' });
  const data = await parseApiResponse(response);

  if (!response.ok) {
    throw new Error(
      typeof data.error === 'string' ? data.error : fallbackErrorMessage(response.status)
    );
  }

  return data as T;
}

export async function uploadFile(
  file: File,
  type: 'hero' | 'gallery',
  onProgress?: (percent: number) => void
): Promise<{ imagePath: string; filename: string }>;
export async function uploadFile(
  file: File,
  type: 'video',
  onProgress?: (percent: number) => void
): Promise<{ videoPath: string; filename: string }>;
export async function uploadFile(
  file: File,
  type: 'hero' | 'gallery' | 'video',
  onProgress?: (percent: number) => void
): Promise<{ imagePath?: string; videoPath?: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const csrf = getCsrfToken();

  if (!onProgress) {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: csrf ? { 'X-CSRF-Token': csrf } : {},
    });

    const data = await parseApiResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data.error === 'string' ? data.error : fallbackErrorMessage(response.status)
      );
    }

    return data as { imagePath?: string; videoPath?: string; filename: string };
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    xhr.withCredentials = true;
    if (csrf) xhr.setRequestHeader('X-CSRF-Token', csrf);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      void (async () => {
        try {
          const text = xhr.responseText;
          const data = text.trim()
            ? (JSON.parse(text) as ApiPayload)
            : { error: fallbackErrorMessage(xhr.status) };

          if (xhr.status < 200 || xhr.status >= 300) {
            reject(
              new Error(
                typeof data.error === 'string' ? data.error : fallbackErrorMessage(xhr.status)
              )
            );
            return;
          }

          resolve(data as { imagePath?: string; videoPath?: string; filename: string });
        } catch {
          reject(new Error('Received an invalid response from the server'));
        }
      })();
    };

    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(formData);
  });
}
