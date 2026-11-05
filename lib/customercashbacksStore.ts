import { supabase, CustomerCashbackRow, GameCashbackRow, PlaycodeRow, CustomerRow } from './supabase';

export interface CustomerCashbacksResponse {
  cashbacks: CustomerCashbackRow[];
  totalSessionsCount: number;
}

export interface ValidatePlaycodeResponse {
  isValid: boolean;
  playcodeRow?: PlaycodeRow;
  message?: string;
}

export interface CashbackSpinSlot {
  id: string;
  amount: number;
  label: string;
  emoji: string;
  color: string;
  textColor: string;
}

const CASH_EMOJI_PALETTE = ['💰', '💵', '💎', '🪙', '✨', '🎁', '⚡', '🌟'];
const CASH_COLOR_PALETTE = [
  { bg: '#12B8B0', text: '#FFFFFF' },
  { bg: '#0B253A', text: '#FFFFFF' },
  { bg: '#06D6A0', text: '#0B253A' },
  { bg: '#FFD166', text: '#0B253A' },
  { bg: '#FF6B6B', text: '#FFFFFF' },
  { bg: '#118AB2', text: '#FFFFFF' },
  { bg: '#8338EC', text: '#FFFFFF' },
  { bg: '#FF006E', text: '#FFFFFF' },
];

/**
 * 1. Fetch Customer Cashback Requests and Sessions Count
 */
export async function fetchCustomerCashbackData(
  customerId: string
): Promise<CustomerCashbacksResponse> {
  try {
    const { data: cashbacksData, error: cashbacksError } = await (supabase.from('customer_cashback') as any)
      .select('id, customer_id, mbl, cashback_amnt, upi_id, status, playcode, session_id, created_at, updated_at')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (cashbacksError) {
      console.error('Error fetching customer cashback requests:', cashbacksError.message);
    }

    const cashbacks: CustomerCashbackRow[] = (cashbacksData || []) as CustomerCashbackRow[];

    const cashbackSessionIds = new Set(
      cashbacks.map((c) => c.session_id).filter((s): s is string => Boolean(s))
    );

    let totalSessionsCount = cashbackSessionIds.size;
    try {
      const { count, error: countError } = await (supabase.from('sessions') as any)
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', customerId);

      if (!countError && typeof count === 'number') {
        totalSessionsCount = Math.max(totalSessionsCount, count);
      }
    } catch (e) {
      console.warn('Notice fetching sessions count:', e);
    }

    return {
      cashbacks,
      totalSessionsCount,
    };
  } catch (err) {
    console.error('Exception fetching customer cashback data:', err);
    return {
      cashbacks: [],
      totalSessionsCount: 0,
    };
  }
}

/**
 * 2. Validate Playcode
 * Checks if code exists in playcodes table and status = 'active'
 */
export async function validatePlaycode(code: string): Promise<ValidatePlaycodeResponse> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { isValid: false, message: 'Please enter a play code.' };
  }

  try {
    const { data, error } = await (supabase.from('playcodes') as any)
      .select('*')
      .eq('code', cleanCode)
      .maybeSingle();

    if (error) {
      console.error('Error checking playcode:', error.message);
      return { isValid: false, message: 'Database error validating play code.' };
    }

    if (!data) {
      return { isValid: false, message: 'Play code not found. Please check and try again.' };
    }

    const playcodeRow = data as PlaycodeRow;
    const status = (playcodeRow.status || '').toLowerCase();

    if (status !== 'active') {
      return {
        isValid: false,
        message: `Play code is ${playcodeRow.status} (only active codes can be used for cash spins).`,
      };
    }

    return { isValid: true, playcodeRow };
  } catch (err: any) {
    console.error('Exception validating playcode:', err);
    return { isValid: false, message: err?.message || 'Error validating play code.' };
  }
}

/**
 * 3. Fetch Game Cashback Slots from game_cashback table
 * Uses range_from and range_to to generate 8 evenly spaced cashback slots
 */
export async function fetchGameCashbackSlots(): Promise<CashbackSpinSlot[]> {
  try {
    const { data, error } = await (supabase.from('game_cashback') as any)
      .select('*')
      .limit(1)
      .maybeSingle();

    let fromRange = 5;
    let toRange = 50;

    if (!error && data) {
      const row = data as GameCashbackRow;
      fromRange = Number(row.range_from) || 5;
      toRange = Number(row.range_to) || 50;
      if (toRange < fromRange) {
        toRange = fromRange + 10;
      }
    }

    // Generate 8 discrete slots between fromRange and toRange
    const slotCount = 8;
    const step = (toRange - fromRange) / (slotCount - 1);
    const slots: CashbackSpinSlot[] = [];

    for (let i = 0; i < slotCount; i++) {
      const val = Math.round(fromRange + step * i);
      const palette = CASH_COLOR_PALETTE[i % CASH_COLOR_PALETTE.length];
      const emoji = CASH_EMOJI_PALETTE[i % CASH_EMOJI_PALETTE.length];

      slots.push({
        id: `cash_slot_${i}_${val}`,
        amount: val,
        label: `₹${val}`,
        emoji,
        color: palette.bg,
        textColor: palette.text,
      });
    }

    return slots;
  } catch (err) {
    console.warn('Error fetching game_cashback ranges, using defaults:', err);
    return [5, 10, 15, 20, 25, 30, 40, 50].map((val, idx) => ({
      id: `cash_def_${idx}`,
      amount: val,
      label: `₹${val}`,
      emoji: CASH_EMOJI_PALETTE[idx % CASH_EMOJI_PALETTE.length],
      color: CASH_COLOR_PALETTE[idx % CASH_COLOR_PALETTE.length].bg,
      textColor: CASH_COLOR_PALETTE[idx % CASH_COLOR_PALETTE.length].text,
    }));
  }
}

export interface InsertCashbackParams {
  customer: CustomerRow;
  cashbackAmount: number;
  upiId: string;
  playcodeId?: string;
  playcodeString?: string;
  sessionId?: string;
}

export interface InsertCashbackResponse {
  success: boolean;
  message: string;
  cashbackRow?: CustomerCashbackRow;
  updatedCustomer?: CustomerRow;
}

/**
 * 4. Insert into customer_cashback table
 * Marks playcode used if provided, updates customer total_cashback, logs play
 */
export async function insertCustomerCashback({
  customer,
  cashbackAmount,
  upiId,
  playcodeId,
  playcodeString,
  sessionId,
}: InsertCashbackParams): Promise<InsertCashbackResponse> {
  const cleanUpi = upiId.trim();
  if (!cleanUpi) {
    return { success: false, message: 'Please enter a valid UPI ID for payout.' };
  }

  const roundedAmount = Number(cashbackAmount);
  if (isNaN(roundedAmount) || roundedAmount <= 0) {
    return { success: false, message: 'Invalid cashback amount.' };
  }

  try {
    // 1. Insert into customer_cashback table
    const payload = {
      customer_id: customer.id,
      mbl: customer.mobile,
      cashback_amnt: roundedAmount,
      upi_id: cleanUpi,
      status: 'pending',
      playcode: playcodeId || null,
      session_id: sessionId || null,
    };

    const { data: cbData, error: cbError } = await (supabase.from('customer_cashback') as any)
      .insert([payload])
      .select('*')
      .single();

    if (cbError) {
      console.error('Error inserting customer_cashback:', cbError.message);
      return { success: false, message: `Failed to record cashback: ${cbError.message}` };
    }

    // 2. Mark playcode as used so it cannot be re-used
    if (playcodeString) {
      try {
        await (supabase.from('playcodes') as any)
          .update({ status: 'used', updated_at: new Date().toISOString() })
          .eq('code', playcodeString.trim().toUpperCase());
      } catch (err) {
        console.warn('Notice updating playcode status:', err);
      }
    }

    // 3. Update customer total_cashback
    const newTotalCashback = Number((Number(customer.total_cashback || 0) + roundedAmount).toFixed(2));
    let updatedCustomer: CustomerRow = {
      ...customer,
      total_cashback: newTotalCashback,
    };

    try {
      const { data: updData, error: updError } = await (supabase.from('customers') as any)
        .update({ total_cashback: newTotalCashback, updated_at: new Date().toISOString() })
        .eq('id', customer.id)
        .select('*')
        .maybeSingle();

      if (!updError && updData) {
        updatedCustomer = updData as CustomerRow;
      }
    } catch (e) {
      console.warn('Notice updating customer total_cashback:', e);
    }

    // 4. Log into customer_plays table
    try {
      await (supabase.from('customer_plays') as any).insert({
        customer_id: customer.id,
        playcode: playcodeId || null,
        session_id: sessionId || null,
      });
    } catch (e) {
      console.warn('Notice logging customer_plays:', e);
    }

    return {
      success: true,
      message: `₹${roundedAmount} cashback recorded successfully! Payout will be processed to ${cleanUpi}.`,
      cashbackRow: cbData as CustomerCashbackRow,
      updatedCustomer,
    };
  } catch (err: any) {
    console.error('Exception in insertCustomerCashback:', err);
    return { success: false, message: err?.message || 'Error processing cashback reward.' };
  }
}
