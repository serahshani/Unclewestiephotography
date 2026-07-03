'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CONTACT, NAV_LINKS, SITE_DESCRIPTION, SITE_NAME, SOCIAL } from '@/lib/site-config';

const MARQUEE_TEXT = 'UNCLE WESTIEE STUDIOS';
const MARQUEE_HIGHLIGHT = new Set(['U', 'W', 'E', 'S']);
const MARQUEE_REPEATS = 8;

const socials = [
  {
    label: 'Instagram',
    href: SOCIAL.instagram,
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'Facebook',
    href: SOCIAL.facebook,
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'YouTube',
    href: SOCIAL.youtube,
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'TikTok',
    href: SOCIAL.tiktok,
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
];

function animEl(el, fromProps, toProps, delay, dur) {
  if (!el) return;
  Object.assign(el.style, fromProps);
  el.style.transition = 'none';
  setTimeout(() => {
    el.style.transition = Object.keys(toProps)
      .map((k) => `${k} ${dur}s cubic-bezier(0.22, 1, 0.36, 1)`)
      .join(',');
    Object.assign(el.style, toProps);
  }, delay * 1000);
}

function MarqueeSegment({ index }) {
  return (
    <span className="ft-marquee-segment" aria-hidden={index > 0}>
      {MARQUEE_TEXT.split('').map((ch, charIndex) => {
        if (ch === ' ') {
          return <span key={charIndex} className="ft-mchar-space" />;
        }
        return (
          <span
            key={charIndex}
            className={`ft-mchar${MARQUEE_HIGHLIGHT.has(ch) ? ' hi' : ''}`}
          >
            {ch}
          </span>
        );
      })}
      <span className="ft-marquee-logo-wrap">
        <Image
          src="/Westieelogo.png"
          alt=""
          width={112}
          height={36}
          className="ft-marquee-logo"
          aria-hidden
        />
      </span>
      <span className="ft-msep">•</span>
    </span>
  );
}

export default function FooterClient({ siteUrl }) {
  const currentYear = new Date().getFullYear();
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => {
        if (!cancelled && res.ok) setAdminLoggedIn(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    let fired = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.05 || fired) return;
        fired = true;
        obs.disconnect();

        const marquee = document.getElementById('ft-marquee-el');
        const border = document.getElementById('ft-border');
        const navEls = Array.from(document.querySelectorAll('.ft-nav-link'));
        const socEls = Array.from(document.querySelectorAll('.ft-soc-link'));
        const contactCol = document.querySelector('.ft-contact-col');
        const ctaCol = document.querySelector('.ft-cta-col');
        const copy = document.getElementById('ft-copyright');

        animEl(marquee, { opacity: '0' }, { opacity: '1' }, 0, 1.2);
        setTimeout(() => border?.classList.add('drawn'), 500);

        navEls.forEach((el, i) => {
          animEl(
            el,
            { opacity: '0', transform: 'translateX(-30px)' },
            { opacity: '1', transform: 'translateX(0)' },
            0.65 + i * 0.08,
            0.4
          );
        });

        socEls.forEach((el, i) => {
          animEl(
            el,
            { opacity: '0', transform: 'translateX(30px)' },
            { opacity: '1', transform: 'translateX(0)' },
            0.65 + i * 0.08,
            0.4
          );
        });

        animEl(
          contactCol,
          { opacity: '0', transform: 'translateY(20px)' },
          { opacity: '1', transform: 'translateY(0)' },
          0.9,
          0.5
        );
        animEl(
          ctaCol,
          { opacity: '0', transform: 'translateY(20px)' },
          { opacity: '1', transform: 'translateY(0)' },
          1.0,
          0.5
        );

        setTimeout(() => copy?.classList.add('in'), 1100);
      },
      { threshold: 0.05 }
    );

    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  return (
    <footer id="site-footer" role="contentinfo" itemScope itemType="https://schema.org/LocalBusiness">
      <meta itemProp="name" content={SITE_NAME} />
      <meta itemProp="description" content={SITE_DESCRIPTION} />
      <link itemProp="url" href={siteUrl} />
      <link itemProp="image" href={`${siteUrl}/Westieelogo.png`} />
      <link itemProp="logo" href={`${siteUrl}/Westieelogo.png`} />

      <h2 className="sr-only">{SITE_NAME} footer</h2>

      <div id="ft-marquee-el" className="ft-marquee-wrap" aria-hidden="true">
        <div className="ft-marquee-fade-l" />
        <div className="ft-marquee-fade-r" />
        <div className="ft-marquee-track" id="ft-track">
          {Array.from({ length: MARQUEE_REPEATS }).map((_, index) => (
            <MarqueeSegment key={index} index={index} />
          ))}
        </div>
      </div>

      <div id="ft-border" />

      <div className="ft-inner">
        <div className="ft-grid">
          <nav aria-label="Footer navigation">
            <p className="ft-col-label">Navigation</p>
            <div className="ft-links">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="ft-link ft-nav-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div>
            <p className="ft-col-label">Social</p>
            <div className="ft-socials" itemProp="sameAs">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="ft-soc-link"
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={`${SITE_NAME} on ${s.label}`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <address className="ft-contact-col not-italic" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <p className="ft-col-label">Contact</p>
            <div className="ft-contact-list">
              <a href={`mailto:${CONTACT.email}`} className="ft-link ft-link-icon" itemProp="email">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone}`} className="ft-link ft-link-icon" itemProp="telephone">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.63A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {CONTACT.phone}
              </a>
              <span className="ft-link ft-link-icon">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span itemProp="addressLocality">Nairobi</span>,{' '}
                <span itemProp="addressCountry">Kenya</span>
              </span>
            </div>
          </address>

          <div className="ft-cta-col">
            <Link href="/contact" className="ft-cta">
              Book a session
              <span className="ft-cta-circle">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M7 17 17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        <div id="ft-copyright">
          <div className="ft-copyright-text">
            <p>
              &copy; {currentYear} {SITE_NAME}. All rights reserved.
            </p>
            <p>Professional photography &amp; videography in Kenya.</p>
          </div>
          <Link
            href={adminLoggedIn ? '/admin' : '/admin/login'}
            className="ft-admin-link"
            aria-label={adminLoggedIn ? 'Admin dashboard' : 'Admin login'}
          >
            {adminLoggedIn ? 'Dashboard' : 'Admin'}
          </Link>
        </div>
      </div>
    </footer>
  );
}
