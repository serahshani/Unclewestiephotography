import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-config';

export const runtime = 'edge';
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #012D26 0%, #0a4a3f 50%, #012D26 100%)',
          padding: 64,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#ffffff',
          }}
        >
          <p
            style={{
              fontSize: 28,
              letterSpacing: 6,
              textTransform: 'uppercase',
              opacity: 0.85,
              marginBottom: 24,
            }}
          >
            Photography & Videography
          </p>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0,
              marginBottom: 32,
            }}
          >
            {SITE_NAME}
          </h1>
          <p
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              maxWidth: 900,
              opacity: 0.9,
              margin: 0,
            }}
          >
            {SITE_DESCRIPTION}
          </p>
          <p
            style={{
              fontSize: 24,
              marginTop: 40,
              opacity: 0.75,
            }}
          >
            Nairobi, Kenya
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
