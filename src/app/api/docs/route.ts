import { NextResponse } from 'next/server';

const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>API Documentation - Uncle Westiee Studios</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/api/docs',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
    });
  </script>
</body>
</html>`;

export async function GET(request: Request) {
  const accept = request.headers.get('accept') ?? '';
  if (accept.includes('text/html')) {
    return new NextResponse(swaggerHtml, {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const { getSiteUrl } = await import('@/lib/api-utils');
  const siteUrl = getSiteUrl();

  return NextResponse.json({
    openapi: '3.0.3',
    info: {
      title: 'Uncle Westiee Studios CMS API',
      version: '1.0.0',
      description: 'Serverless API for managing hero content, gallery images, and YouTube videos.',
    },
    servers: [{ url: siteUrl }],
    paths: {
      '/api/auth/login': {
        post: {
          summary: 'Admin login',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string', minLength: 3 },
                    password: { type: 'string', minLength: 8 },
                  },
                  required: ['username', 'password'],
                },
              },
            },
          },
          responses: { '200': { description: 'Login successful' } },
        },
      },
      '/api/auth/logout': {
        post: { summary: 'Admin logout', tags: ['Auth'], responses: { '200': { description: 'Logged out' } } },
      },
      '/api/auth/me': {
        get: { summary: 'Current session', tags: ['Auth'], responses: { '200': { description: 'Session info' } } },
      },
      '/api/hero': {
        get: {
          summary: 'Get hero section',
          tags: ['Hero'],
          parameters: [{ name: 'preview', in: 'query', schema: { type: 'boolean' } }],
          responses: { '200': { description: 'Hero data' } },
        },
        put: { summary: 'Update draft hero', tags: ['Hero'], responses: { '200': { description: 'Updated' } } },
      },
      '/api/hero/publish': {
        post: { summary: 'Publish hero draft', tags: ['Hero'], responses: { '200': { description: 'Published' } } },
      },
      '/api/hero/slides': {
        get: { summary: 'List hero slides', tags: ['Hero'], responses: { '200': { description: 'Slides' } } },
        post: { summary: 'Add hero slide', tags: ['Hero'], responses: { '201': { description: 'Created' } } },
        put: { summary: 'Reorder slides', tags: ['Hero'], responses: { '200': { description: 'Reordered' } } },
      },
      '/api/gallery': {
        get: {
          summary: 'List gallery images',
          tags: ['Gallery'],
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'featured', in: 'query', schema: { type: 'boolean' } },
          ],
          responses: { '200': { description: 'Images' } },
        },
        post: { summary: 'Create gallery image', tags: ['Gallery'], responses: { '201': { description: 'Created' } } },
      },
      '/api/videos': {
        get: { summary: 'List videos', tags: ['Videos'], responses: { '200': { description: 'Videos' } } },
        post: { summary: 'Add YouTube video', tags: ['Videos'], responses: { '201': { description: 'Created' } } },
      },
      '/api/upload': {
        post: {
          summary: 'Upload image',
          tags: ['Upload'],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: { type: 'string', format: 'binary' },
                    type: { type: 'string', enum: ['hero', 'gallery'] },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Uploaded' } },
        },
      },
    },
    components: {
      securitySchemes: {
        cookieAuth: { type: 'apiKey', in: 'cookie', name: 'admin_token' },
        csrfHeader: { type: 'apiKey', in: 'header', name: 'X-CSRF-Token' },
      },
    },
    security: [{ cookieAuth: [], csrfHeader: [] }],
  });
}
