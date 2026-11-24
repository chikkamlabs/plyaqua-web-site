import { supabase, PartnerCategoryRow } from './supabase';

export interface PartnerCategoryItem {
  id: string;
  pCatId: string | null;
  categoryName: string;
  photo: string | null;
  description: string;
  points: string[];
  badge?: string;
}

/**
 * Resolve image_url whether it is an absolute URL or stored in `partner_catergory_images` bucket.
 */
function resolveCategoryImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl || !imageUrl.trim()) return null;
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  const { data } = supabase.storage.from('partner_catergory_images').getPublicUrl(trimmed);
  return data?.publicUrl || null;
}

/**
 * Safely parse `points` JSONB column into a string array.
 */
function parseCategoryPoints(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          return String(obj.label || obj.name || obj.title || obj.text || JSON.stringify(obj)).trim();
        }
        return String(item).trim();
      })
      .filter(Boolean);
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return parseCategoryPoints(parsed);
    } catch {
      return raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  if (typeof raw === 'object') {
    return Object.values(raw as Record<string, unknown>)
      .map((v) => String(v).trim())
      .filter(Boolean);
  }
  return [];
}

function mapCategoryRow(
  row: PartnerCategoryRow & { description?: string | null }
): PartnerCategoryItem {
  return {
    id: row.id,
    pCatId: row.p_cat_id || null,
    categoryName: row.name,
    photo: resolveCategoryImageUrl(row.image_url),
    description: row.descripiton || row.description || '',
    points: parseCategoryPoints(row.points),
    badge: row.badge || undefined,
  };
}

/**
 * Fetch all active partner categories from Supabase `partner_categories` table.
 */
export async function getPartnerCategories(): Promise<PartnerCategoryItem[]> {
  try {
    const { data, error } = await (supabase.from('partner_categories') as any)
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    if (error || !Array.isArray(data)) {
      if (error) {
        console.warn('Error fetching partner_categories from Supabase:', error.message);
      }
      return [];
    }

    return (data as (PartnerCategoryRow & { description?: string | null })[]).map(mapCategoryRow);
  } catch (err) {
    console.warn('Exception fetching partner_categories from Supabase:', err);
    return [];
  }
}

/**
 * Fetch a single active partner category by ID from Supabase `partner_categories` table.
 */
export async function getPartnerCategoryById(id: string): Promise<PartnerCategoryItem | null> {
  try {
    const { data, error } = await (supabase.from('partner_categories') as any)
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapCategoryRow(data as PartnerCategoryRow & { description?: string | null });
  } catch (err) {
    console.warn('Exception fetching partner category by id:', err);
    return null;
  }
}
