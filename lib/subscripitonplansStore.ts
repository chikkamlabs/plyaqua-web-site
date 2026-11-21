import { supabase, SubscriptionPlanRow } from './supabase';

export interface SubscriptionPlan {
  id: string;
  name: string;
  actual_price: number;
  selling_price: number;
  includes: string[];
  image_url: string | null;
  status: 'active' | 'deactive';
}

/**
 * Safely parse `includes` JSONB column into a clean string array.
 */
function parseIncludes(raw: unknown): string[] {
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
      return parseIncludes(parsed);
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

/**
 * Resolve plan image_url whether it is an absolute URL or stored in `subscription_plans_bucket`.
 */
function resolvePlanImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl || !imageUrl.trim()) return null;
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  const { data } = supabase.storage.from('subscription_plans_bucket').getPublicUrl(trimmed);
  return data?.publicUrl || null;
}

/**
 * Fetch all active subscription plans from `subscription_plans` table.
 */
export async function fetchActiveSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const { data, error } = await (supabase.from('subscription_plans') as any)
      .select('*')
      .eq('status', 'active')
      .order('selling_price', { ascending: true });

    if (error || !data) {
      if (error) console.warn('Error fetching subscription_plans:', error.message);
      return [];
    }

    return (data as SubscriptionPlanRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      actual_price: Number(row.actual_price || 0),
      selling_price: Number(row.selling_price || 0),
      includes: parseIncludes(row.includes),
      image_url: resolvePlanImageUrl(row.image_url),
      status: row.status,
    }));
  } catch (err) {
    console.warn('Exception fetching subscription_plans:', err);
    return [];
  }
}
