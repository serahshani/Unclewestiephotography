'use client';

import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaTiktok, FaChevronDown } from 'react-icons/fa';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import PageHero from '@/components/layout/PageHero';
import { CONTACT_FAQ_ITEMS } from '@/lib/contact-faq';
import { CONTACT, SITE_NAME, SOCIAL } from '@/lib/site-config';
import { CONTACT_BREADCRUMBS } from '@/lib/page-breadcrumbs';

const SOCIAL_LINKS = [
  { href: SOCIAL.instagram, label: 'Instagram', icon: FaInstagram },
  { href: SOCIAL.facebook, label: 'Facebook', icon: FaFacebook },
  { href: SOCIAL.youtube, label: 'YouTube', icon: FaYoutube },
  { href: SOCIAL.tiktok, label: 'TikTok', icon: FaTiktok },
];

const BRANCHES = [
  { label: 'Main branch', location: 'Nairobi, Kenya' },
  { label: 'Other branches', location: 'Maralal, Samburu, Kenya' },
];

const SUBJECT_OPTIONS = [
  { value: '', label: 'Select a subject' },
  { value: 'Wedding photography', label: 'Wedding photography' },
  { value: 'Portrait session', label: 'Portrait session' },
  { value: 'Event coverage', label: 'Event coverage' },
  { value: 'Commercial & product', label: 'Commercial & product' },
  { value: 'Videography', label: 'Videography' },
  { value: 'Aerial / drone', label: 'Aerial / drone' },
  { value: 'General enquiry', label: 'General enquiry' },
];

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = String(data.get('name') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();
  const subject = String(data.get('subject') ?? '').trim() || 'General enquiry';
  const message = String(data.get('message') ?? '').trim();

  const text = [
    `Hello! I'm ${name} (${email}).`,
    '',
    `*${subject}*`,
    '',
    message,
  ].join('\n');

  window.open(`${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        image="/Hero3.webp"
        imageAlt="Contact Uncle Westiee Studios for photography and videography in Kenya"
        title={`Contact ${SITE_NAME}`}
        subtitle="Reach out to book a session or discuss your wedding, portrait, or event coverage."
        breadcrumbs={CONTACT_BREADCRUMBS}
        heightClass="h-96"
        imagePosition="object-[center_30%]"
        imageBrightness="brightness-50"
        priority
      />

      <section id="contact-section" className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-20">
            <div className="lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Enquiry</p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-[#012D26] sm:text-4xl">
                Tell us about your shoot
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600">
                Weddings, portraits, events, and commercial work across Kenya. We read every message
                and respond as soon as we can.
              </p>

              <form className="mt-10 space-y-7" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="name"
                      className="w-full border-b border-gray-200 bg-transparent py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#012D26]/50 focus:outline-none"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      className="w-full border-b border-gray-200 bg-transparent py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#012D26]/50 focus:outline-none"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-gray-700">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    defaultValue=""
                    className="w-full border-b border-gray-200 bg-transparent py-2.5 text-sm text-gray-800 focus:border-[#012D26]/50 focus:outline-none"
                    required
                  >
                    {SUBJECT_OPTIONS.map((option) => (
                      <option key={option.value || 'placeholder'} value={option.value} disabled={option.value === ''}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-semibold text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full resize-y border border-gray-200 bg-[#faf9f7] px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#012D26]/50 focus:outline-none"
                    placeholder="Date, location, and what you have in mind..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#012D26] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#014a3d]"
                >
                  Send via WhatsApp
                </button>
              </form>
            </div>

            <aside className="lg:col-span-2">
              <div className="border-t border-[#012D26]/10 pt-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <h2 className="font-serif text-2xl font-medium text-[#012D26]">Reach us directly</h2>

                <address className="mt-8 space-y-7 not-italic">
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="flex gap-4 transition-colors hover:text-[#012D26]"
                  >
                    <FaPhone className="mt-0.5 shrink-0 text-base text-[#012D26]/75" aria-hidden />
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-gray-600">Phone</span>
                      <span className="mt-1 block text-sm text-gray-700">{CONTACT.phone}</span>
                    </span>
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex gap-4 transition-colors hover:text-[#012D26]"
                  >
                    <FaEnvelope className="mt-0.5 shrink-0 text-base text-[#012D26]/75" aria-hidden />
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-gray-600">Email</span>
                      <span className="mt-1 block break-all text-sm text-gray-700">{CONTACT.email}</span>
                    </span>
                  </a>
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 transition-colors hover:text-[#012D26]"
                  >
                    <FaWhatsapp className="mt-0.5 shrink-0 text-base text-[#012D26]/75" aria-hidden />
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-gray-600">WhatsApp</span>
                      <span className="mt-1 block text-sm text-gray-700">Start a conversation</span>
                    </span>
                  </a>
                  {BRANCHES.map((branch) => (
                    <div key={branch.label} className="flex gap-4">
                      <FaMapMarkerAlt className="mt-0.5 shrink-0 text-base text-[#012D26]/75" aria-hidden />
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-gray-600">{branch.label}</span>
                        <span className="mt-1 block text-sm text-gray-600">{branch.location}</span>
                      </span>
                    </div>
                  ))}
                </address>

                <div className="mt-10 border-t border-[#012D26]/10 pt-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Social</p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label={`${SITE_NAME} on ${label}`}
                        className="text-[#012D26]/70 transition-colors hover:text-[#012D26]"
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-10 overflow-hidden">
                  <iframe
                    title="Uncle Westiee Studios location on Google Maps"
                    src="https://maps.google.com/maps?q=Uncle+Westiee+Studios,Nairobi,Kenya&hl=en&z=14&output=embed"
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        id="faq"
        aria-labelledby="contact-faq-heading"
        className="border-t border-[#012D26]/10 bg-[#faf9f7]"
      >
        <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">FAQ</p>
          <h2
            id="contact-faq-heading"
            className="mt-2 font-serif text-3xl font-medium text-[#012D26] sm:text-4xl"
          >
            Common questions before you reach out
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            The questions we get most often on WhatsApp — booking, travel, pricing, and delivery.
          </p>

          <div className="mt-10 divide-y divide-[#012D26]/10 border-y border-[#012D26]/10">
            {CONTACT_FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-[#012D26] transition-colors hover:text-[#014a3d] [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <FaChevronDown
                    className="mt-0.5 shrink-0 text-xs text-[#012D26]/50 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="pb-5 pr-8 text-sm leading-relaxed text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
