import { CONTACT_FAQ_ITEMS } from '@/lib/contact-faq';

const PACKAGES_FAQ_QUESTIONS = new Set([
  'How much do you charge?',
  'How do I book and pay?',
  'What is included, and when will we get our photos?',
  'Do you travel outside Nairobi?',
]);

export const PACKAGES_FAQ_ITEMS = CONTACT_FAQ_ITEMS.filter((item) =>
  PACKAGES_FAQ_QUESTIONS.has(item.question)
);
