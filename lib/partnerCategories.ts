/**
 * Partner Categories Data & Backend Service Layer
 * Currently operates with structured dummy data matching the PlyAqua schema.
 * Ready for future direct Supabase integration.
 */

export interface PartnerCategoryItem {
  id: string;
  categoryName: string;
  photo: string;
  description: string;
  points: string[];
  badge?: string;
}

export const DUMMY_PARTNER_CATEGORIES: PartnerCategoryItem[] = [
  {
    id: 'weddings-functions',
    categoryName: 'Wedding Functions & Celebrations',
    photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    description: 'Customized pure drinking water bottles adorned with bespoke wedding labels for memorable grand ceremonies.',
    points: [
      'Personalized couple branding & event date on labels',
      'Chilled delivery directly to mandap & dining hall',
      '100% recyclable food-grade eco bottles',
      'Flexible sizes: 250ml mini & 500ml regular bottles',
      'Dedicated wedding event hydration coordinator',
    ],
    badge: 'Custom Labels Available',
  },
  {
    id: 'retail-general-stores',
    categoryName: 'Retail Shops & General Stores',
    photo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=80',
    description: 'High-turnover packaged drinking water inventory tailored for daily walk-in shoppers, neighborhood marts, and retail counters.',
    points: [
      'High-demand shelf sizes (250ml, 500ml & 1L bottles)',
      'Attractive retail profit margins & retailer discounts',
      'Consistent weekly stock replenishment with zero stockouts',
      'Eye-catching branded bottle displays & floor chillers',
      'Instant customer digital rewards QR on every bottle',
    ],
    badge: 'Retail Partner',
  },
  {
    id: 'corporate-meetings',
    categoryName: 'Corporate Meetings & Conferences',
    photo: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
    description: 'Executive bottled water designed for boardrooms, summits, business conclaves, and conference tables.',
    points: [
      'Company logo & conference theme customized bottles',
      'Ergonomic, tamper-evident leakproof design',
      'Balanced electrolytes & TDS for maximum focus',
      'Scheduled recurring deliveries with GST invoicing',
      'VIP lounge & delegate hospitality supply',
    ],
    badge: 'Executive Grade',
  },
  {
    id: 'hotels-restaurants',
    categoryName: 'Hotels, Cafes & Fine Dining',
    photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
    description: 'Elegant bottled water presentation that matches luxury hospitality and gastronomic standards.',
    points: [
      'Chic tabletop bottle aesthetic matching table décor',
      'Certified multi-stage RO + UV + Ozoned purity',
      'Wholesale bulk pricing with zero-stockout SLA',
      'Complimentary bottle serving holders & chillers',
      'On-demand emergency same-day replenishment',
    ],
    badge: 'Hospitality Partner',
  },
  {
    id: 'gyms-fitness-sports',
    categoryName: 'Gyms, Fitness & Sports Arenas',
    photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
    description: 'Pure hydration engineered for high-intensity training, marathons, CrossFit, and sports tournaments.',
    points: [
      'Rich in vital electrolytes for optimal recovery',
      'Sports grip bottle with quick-twist cap',
      'Gym floor hydration bar partnership',
      'Exclusive member discount codes via QR scan',
      'Eco collection & container recycling drives',
    ],
    badge: 'Fitness Fuel',
  },
  {
    id: 'festivals-expos',
    categoryName: 'Festivals, Concerts & Public Expos',
    photo: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
    description: 'High-volume rapid supply for outdoor concerts, exhibitions, cultural fairs, and religious gatherings.',
    points: [
      'Instant capacity for 10,000+ attendee events',
      'Mobile refrigerated trucks and chilling hubs',
      'Interactive QR codes with Play & Cashback game',
      'On-site green waste & recycling team assistance',
      '24/7 dedicated event logistics support',
    ],
    badge: 'High Volume Capacity',
  },
];

/**
 * Fetch all partner categories (Simulated backend function ready for Supabase)
 */
export async function getPartnerCategories(): Promise<PartnerCategoryItem[]> {
  // Simulated brief delay for realistic async behavior
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DUMMY_PARTNER_CATEGORIES);
    }, 50);
  });
}

/**
 * Fetch a single partner category by ID
 */
export async function getPartnerCategoryById(id: string): Promise<PartnerCategoryItem | null> {
  const item = DUMMY_PARTNER_CATEGORIES.find((cat) => cat.id === id);
  return item || null;
}
