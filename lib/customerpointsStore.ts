import { supabase, CustomerRow, CustomerPointRow, CustomerPointsReqRow } from './supabase';

export interface VerifyCustomerResponse {
  success: boolean;
  customer?: CustomerRow;
  message?: string;
}

/**
 * 1. Verify Customer Credentials
 * Matches customers.mobile and customers.key
 */
export async function verifyCustomerCredentials(
  mobile: string,
  key: string
): Promise<VerifyCustomerResponse> {
  const cleanMobile = mobile.trim().replace(/\D/g, '');
  const cleanKey = key.trim();

  if (!cleanMobile || cleanMobile.length < 10) {
    return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
  }

  if (!cleanKey) {
    return { success: false, message: 'Please enter your 6-digit key.' };
  }

  try {
    const { data, error } = await (supabase.from('customers') as any)
      .select('*')
      .eq('mobile', cleanMobile)
      .eq('key', cleanKey)
      .maybeSingle();

    if (error) {
      console.error('Error verifying customer:', error.message);
      return { success: false, message: 'Database error verifying credentials. Please try again.' };
    }

    if (!data) {
      return { success: false, message: 'Invalid mobile number or 6-digit key. Please check and try again.' };
    }

    return { success: true, customer: data as CustomerRow };
  } catch (err: any) {
    console.error('Exception verifying customer:', err);
    return { success: false, message: err?.message || 'Failed to verify customer.' };
  }
}

/**
 * 2. Fetch Customer Points History
 * Returns records from customer_points table for this customer
 */
export async function fetchCustomerPointsHistory(
  customerId: string
): Promise<CustomerPointRow[]> {
  try {
    const { data, error } = await (supabase.from('customer_points') as any)
      .select('id, points, type, notes, created_at, updated_at, session_id, customer_id')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customer points:', error.message);
      return [];
    }

    return (data || []) as CustomerPointRow[];
  } catch (err) {
    console.error('Exception fetching customer points:', err);
    return [];
  }
}

export interface RedeemPointsPayload {
  customerId: string;
  pointsToRedeem: number;
  availablePoints: number;
}

export interface RedeemPointsResponse {
  success: boolean;
  message: string;
  req?: CustomerPointsReqRow;
}

/**
 * 3. Create Points Redemption Request
 * Checks available points > entered points.
 * Inserts into customer_points_reqs table with:
 *   - customer_id: customerId
 *   - points: entered points
 *   - status: 'pending'
 *   - notes: 'customer request'
 */
export async function createPointsRedemptionRequest({
  customerId,
  pointsToRedeem,
  availablePoints,
}: RedeemPointsPayload): Promise<RedeemPointsResponse> {
  const points = Math.floor(Number(pointsToRedeem));

  if (isNaN(points) || points <= 0) {
    return { success: false, message: 'Please enter a valid positive number of points.' };
  }

  // Requirement: available points should > Entered points
  if (availablePoints <= points) {
    return {
      success: false,
      message: `Available points (${availablePoints}) must be greater than entered points (${points}).`,
    };
  }

  try {
    const insertPayload = {
      customer_id: customerId,
      points: points,
      status: 'pending',
      notes: 'customer request',
    };

    const { data, error } = await (supabase.from('customer_points_reqs') as any)
      .insert([insertPayload])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase points redemption error:', error.message);
      return { success: false, message: `Failed to submit request: ${error.message}` };
    }

    return {
      success: true,
      message: 'Redemption request submitted successfully!',
      req: data as CustomerPointsReqRow,
    };
  } catch (err: any) {
    console.error('Exception creating redemption request:', err);
    return { success: false, message: err?.message || 'Error submitting redemption request.' };
  }
}
