import { supabase, ProductRow } from './supabase';

export interface CollectionItem {
  id: string;
  prodId: string;
  productName: string;
  photo: string | null;
  description: string | null;
  tag: string | null;
  size: string | null;
  mrp: number;
  sp: number;
  qty: number;
}

/**
 * Resolve product image_url whether it is an absolute URL or stored in `product_images` bucket.
 */
function resolveProductImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl || !imageUrl.trim()) return null;
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  const { data } = supabase.storage.from('product_images').getPublicUrl(trimmed);
  return data?.publicUrl || null;
}

function mapProductRow(
  row: ProductRow & { sizes?: { value?: string | null } | null }
): CollectionItem {
  return {
    id: row.id,
    prodId: row.prod_id,
    productName: row.name,
    photo: resolveProductImageUrl(row.image_url),
    description: row.description || null,
    tag: row.tag || null,
    size: row.sizes?.value || null,
    mrp: Number(row.mrp || 0),
    sp: Number(row.sp || 0),
    qty: Number(row.qty || 0),
  };
}

/**
 * Fetch active products from Supabase `products` table (with optional limit).
 */
export async function getOurCollection(limit?: number): Promise<CollectionItem[]> {
  try {
    let query = (supabase.from('products') as any)
      .select('*, sizes(value)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (!error && Array.isArray(data)) {
      return (data as (ProductRow & { sizes?: { value?: string | null } | null })[]).map(
        mapProductRow
      );
    }

    // Fallback without sizes join if sizes relation is restricted
    let fallbackQuery = (supabase.from('products') as any)
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (limit && limit > 0) {
      fallbackQuery = fallbackQuery.limit(limit);
    }

    const { data: fallbackData, error: fallbackError } = await fallbackQuery;
    if (fallbackError || !Array.isArray(fallbackData)) {
      if (fallbackError) {
        console.warn('Error fetching products from Supabase:', fallbackError.message);
      }
      return [];
    }

    return (fallbackData as ProductRow[]).map((row) => mapProductRow(row));
  } catch (err) {
    console.warn('Exception fetching products from Supabase:', err);
    return [];
  }
}

/**
 * Fetch single active product by ID from Supabase `products` table.
 */
export async function getCollectionItemById(id: string): Promise<CollectionItem | null> {
  try {
    const { data, error } = await (supabase.from('products') as any)
      .select('*, sizes(value)')
      .eq('id', id)
      .eq('status', 'active')
      .maybeSingle();

    if (!error && data) {
      return mapProductRow(data as ProductRow & { sizes?: { value?: string | null } | null });
    }

    const { data: fallbackData, error: fallbackError } = await (supabase.from('products') as any)
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .maybeSingle();

    if (fallbackError || !fallbackData) {
      return null;
    }

    return mapProductRow(fallbackData as ProductRow);
  } catch (err) {
    console.warn('Exception fetching product by id:', err);
    return null;
  }
}
