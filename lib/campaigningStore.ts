import { supabase, CampaignRow, AdContentRow } from './supabase';

export interface PlayableCampaign {
  campaignId: string;
  title: string;
  description: string | null;
  views: number;
  locationName: string | null;
  latitude: number | null;
  longitude: number | null;
  radiusMtrs: number | null;
  locationEnabled: boolean;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  adTitle: string;
  distanceMeters: number | null;
}

/**
 * Haversine formula to compute great-circle distance in meters between two coordinates.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Resolve media_url whether it is an absolute URL or a Supabase Storage path.
 */
function resolveAdMediaUrl(mediaUrl: string | null, mediaType: 'image' | 'video'): string | null {
  if (!mediaUrl || !mediaUrl.trim()) return null;
  const trimmed = mediaUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  const bucket = mediaType === 'video' ? 'adv_content_vid' : 'adv_content_img';
  const { data } = supabase.storage.from(bucket).getPublicUrl(trimmed);
  return data?.publicUrl || null;
}

/**
 * Fetch an active campaign from `campaigns` joined with active `ad_content`.
 * - Checks campaign.status === 'active' and ad_content.status === 'active'
 * - Checks optional start_date / end_date and max_views
 * - If player coordinates are provided, prioritizes active geo-targeted campaigns
 *   where the player's current coordinates lie within `radius_mtrs` of (`latitude`, `longitude`).
 * - Falls back to non-location-restricted active campaigns if no geo-targeted campaign matches.
 */
export async function fetchMatchingActiveCampaign(
  userLat: number | null,
  userLng: number | null
): Promise<PlayableCampaign | null> {
  try {
    const { data: campaignsData, error: campaignsError } = await (supabase.from('campaigns') as any)
      .select('*, ad_content(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (campaignsError || !campaignsData || campaignsData.length === 0) {
      return null;
    }

    const now = Date.now();
    const allActiveCampaigns: PlayableCampaign[] = [];
    const generalActiveCampaigns: PlayableCampaign[] = [];
    const geoMatched: PlayableCampaign[] = [];

    for (const raw of campaignsData as (CampaignRow & { ad_content?: AdContentRow | null })[]) {
      if (raw.status !== 'active') continue;

      // Check date window if configured
      if (raw.start_date && new Date(raw.start_date).getTime() > now) continue;
      if (raw.end_date && new Date(raw.end_date).getTime() < now) continue;

      // Check max views if configured
      if (raw.max_views !== null && raw.max_views !== undefined && Number(raw.max_views) > 0) {
        if (Number(raw.views || 0) >= Number(raw.max_views)) continue;
      }

      // Resolve linked ad_content
      let ad = raw.ad_content;
      if (!ad && raw.content_id) {
        const { data: adRow } = await (supabase.from('ad_content') as any)
          .select('*')
          .eq('id', raw.content_id)
          .eq('status', 'active')
          .maybeSingle();
        ad = adRow as AdContentRow | null;
      }

      if (!ad || ad.status !== 'active') continue;

      const mediaType: 'image' | 'video' = ad.media_type === 'image' ? 'image' : 'video';
      const resolvedUrl = resolveAdMediaUrl(ad.media_url, mediaType);
      if (!resolvedUrl) continue;

      const lat = raw.latitude !== null && raw.latitude !== undefined ? Number(raw.latitude) : null;
      const lng = raw.longitude !== null && raw.longitude !== undefined ? Number(raw.longitude) : null;
      const radius = raw.radius_mtrs !== null && raw.radius_mtrs !== undefined ? Number(raw.radius_mtrs) : null;
      const hasGeoFence = lat !== null && lng !== null && radius !== null && !Number.isNaN(lat) && !Number.isNaN(lng) && !Number.isNaN(radius);

      let distanceMeters: number | null = null;
      if (hasGeoFence && userLat !== null && userLng !== null) {
        distanceMeters = calculateDistanceMeters(userLat, userLng, lat, lng);
      }

      const item: PlayableCampaign = {
        campaignId: raw.id,
        title: raw.title,
        description: raw.description,
        views: Number(raw.views || 0),
        locationName: raw.location_name,
        latitude: lat,
        longitude: lng,
        radiusMtrs: radius,
        locationEnabled: Boolean(raw.location_enabled),
        mediaUrl: resolvedUrl,
        mediaType,
        adTitle: ad.title,
        distanceMeters,
      };

      allActiveCampaigns.push(item);

      if (hasGeoFence) {
        if (distanceMeters !== null && distanceMeters <= (radius as number)) {
          geoMatched.push(item);
        }
      } else {
        generalActiveCampaigns.push(item);
      }
    }

    if (geoMatched.length > 0) {
      geoMatched.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
      return geoMatched[0];
    }

    // If no location matches, play any random active campaign
    const fallbackPool = generalActiveCampaigns.length > 0 ? generalActiveCampaigns : allActiveCampaigns;
    if (fallbackPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * fallbackPool.length);
      return fallbackPool[randomIndex];
    }

    return null;
  } catch (err) {
    console.warn('Error fetching active campaign:', err);
    return null;
  }
}

/**
 * Increment played campaign views by +1 in the `campaigns` table.
 */
export async function incrementCampaignViews(
  campaignId: string,
  currentViews: number
): Promise<number | null> {
  try {
    const nextViews = Number(currentViews || 0) + 1;
    const { data, error } = await (supabase.from('campaigns') as any)
      .update({
        views: nextViews,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId)
      .select('views')
      .maybeSingle();

    if (error) {
      console.warn('Notice incrementing campaign views:', error.message);
      return null;
    }

    return data?.views !== undefined ? Number(data.views) : nextViews;
  } catch (err) {
    console.warn('Error incrementing campaign views:', err);
    return null;
  }
}
