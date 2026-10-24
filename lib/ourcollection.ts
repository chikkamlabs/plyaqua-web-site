/**
 * Our Collection Data & Backend Service Layer
 * Structured dummy data matching the PlyAqua collection specifications.
 * Ready for future Supabase database integration.
 */

export interface CollectionItem {
  id: string;
  productName: string;
  photo: string;
  description: string;
  tag: string;
  size?: string;
  mrp?: number;
  sp?: number;
}

export const DUMMY_COLLECTION: CollectionItem[] = [
  {
    id: 'plyaqua-250ml',
    productName: 'PlyAqua Pocket Splash',
    photo: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    description: 'Compact 250ml pocket bottle, perfect for high-table executive meetings, short commutes, and quick on-the-go hydration.',
    tag: '250ml Mini',
    size: '250ml',
    mrp: 10,
    sp: 8,
  },
  {
    id: 'plyaqua-500ml',
    productName: 'PlyAqua Classic Pure',
    photo: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=800&q=80',
    description: 'Our signature 500ml everyday packaged drinking water bottle featuring interactive QR game codes with cashback rewards.',
    tag: '500ml Most Popular',
    size: '500ml',
    mrp: 20,
    sp: 15,
  },
  {
    id: 'plyaqua-1000ml',
    productName: 'PlyAqua Hydrate Plus',
    photo: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    description: 'Generous 1 Litre bottle engineered for fitness enthusiasts, road trips, outdoor treks, and full-day sustained hydration.',
    tag: '1 Litre Active',
    size: '1000ml',
    mrp: 30,
    sp: 25,
  },
  {
    id: 'plyaqua-wedding-edition',
    productName: 'PlyAqua Celebration Custom',
    photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Bespoke event edition with customized client branding, metallic foil accents, and premium aesthetic for weddings & galas.',
    tag: 'Event Special',
    size: 'Custom 300ml',
    mrp: 25,
    sp: 20,
  },
  {
    id: 'plyaqua-corporate-edition',
    productName: 'PlyAqua Executive Summit',
    photo: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    description: 'Tailored for corporate summits, boardroom conferences, and VIP lounges with dedicated partner sponsor messaging.',
    tag: 'Corporate Edition',
    size: '500ml Sleek',
    mrp: 22,
    sp: 18,
  },
  {
    id: 'plyaqua-play-edition',
    productName: 'PlyAqua Gamers Edition',
    photo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    description: 'Special edition bottle with guaranteed instant Play Code scratch card and UPI cashback coupon on every scan.',
    tag: 'Play & Win Edition',
    size: '500ml Game',
    mrp: 20,
    sp: 15,
  },
];

/**
 * Fetch all collection products
 */
export async function getOurCollection(): Promise<CollectionItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DUMMY_COLLECTION);
    }, 50);
  });
}

/**
 * Fetch single product by ID
 */
export async function getCollectionItemById(id: string): Promise<CollectionItem | null> {
  const item = DUMMY_COLLECTION.find((prod) => prod.id === id);
  return item || null;
}
