export const FEATURED_SERVICES = [
  {
    id: 'wedding',
    number: '01',
    title: 'Wedding Photography',
    description:
      'Capture the magic and emotion of your special day. From intimate ceremonies to grand celebrations, we ensure every precious moment is preserved beautifully.',
    features: [
      'Full-day coverage',
      'Engagement shoots',
      'High-resolution digital gallery',
      'Custom album design available',
    ],
    image: '/Services-hero.jpg',
    imageAlt: 'Wedding photography coverage by Uncle Westiee Studios in Kenya',
  },
  {
    id: 'portrait',
    number: '02',
    title: 'Portrait Sessions',
    description:
      'From striking headshots to heartwarming family portraits, we capture your unique personality and connections in stunning detail.',
    features: [
      'Individual & family portraits',
      'Maternity & newborn shoots',
      'Professional headshots',
      'On-location or studio options',
    ],
    image: '/couple.jpg',
    imageAlt: 'Portrait photography session in Nairobi and across Kenya',
  },
  {
    id: 'events',
    number: '03',
    title: 'Event Coverage',
    description:
      'Ensure every moment of your corporate event, celebration, or public gathering is documented with dynamic and professional imagery.',
    features: [
      'Corporate events & conferences',
      'Birthday parties & anniversaries',
      'Concerts & festivals',
      'Candid and posed shots',
    ],
    image: '/Gallery5.jpg',
    imageAlt: 'Professional event photography and videography in Kenya',
  },
] as const;

export const SUPPORTING_SERVICES = [
  {
    id: 'commercial',
    title: 'Commercial & Product',
    description: 'Product photography, brand imagery, and real estate shoots for marketing.',
  },
  {
    id: 'videography',
    title: 'Professional Videography',
    description: 'Highlight reels, promos, and cinematic productions.',
  },
  {
    id: 'drone',
    title: 'Drone Services',
    description: 'Aerial photography and videography for landscapes and events.',
  },
  {
    id: 'editing',
    title: 'Expert Retouching & Editing',
    description: 'Color grading, retouching, and creative composites.',
  },
] as const;
