import { supabase, CustomerRow, SessionRow, GamePointRow, GameWordRow } from './supabase';

export interface SpinSlot {
  id: string;
  points: number;
  label: string;
  emoji: string;
  color: string;
  textColor: string;
}

export interface WordPuzzle {
  id: string;
  word: string;
  hints: string[];
}

export const MAX_WRONG_CHANCES = 3;

// Fallback emoji list for game points
const EMOJI_PALETTE = ['💧', '🌊', '💎', '⚡', '🌟', '👑', '🍀', '🎯', '✨', '🔥'];
const COLOR_PALETTE = [
  { bg: '#12B8B0', text: '#FFFFFF' }, // aqua-teal
  { bg: '#0B253A', text: '#FFFFFF' }, // deep-navy
  { bg: '#06D6A0', text: '#0B253A' }, // emerald-mint
  { bg: '#FFD166', text: '#0B253A' }, // sunburst-yellow
  { bg: '#FF6B6B', text: '#FFFFFF' }, // vibrant-coral
  { bg: '#118AB2', text: '#FFFFFF' }, // electric-blue
  { bg: '#8338EC', text: '#FFFFFF' }, // royal-purple
  { bg: '#FF006E', text: '#FFFFFF' }, // neon-pink
];

// Curated fallback words with hints matching the new hints(jsonb) column
const FALLBACK_WORDS: WordPuzzle[] = [
  {
    id: 'def-w1',
    word: 'PURITY',
    hints: [
      'The prime quality of untouched mountain spring water.',
      'Completely free from any contaminants or impurities.',
      'The core promise and gold standard of PlyAqua.',
    ],
  },
  {
    id: 'def-w2',
    word: 'MINERAL',
    hints: [
      'Naturally occurring nutrients enriched from deep rock layers.',
      'Includes essential electrolytes like calcium and magnesium.',
      'Gives premium drinking water its crisp, revitalizing taste.',
    ],
  },
  {
    id: 'def-w3',
    word: 'AQUA',
    hints: [
      'The ancient Latin root word meaning water.',
      'Found in the second half of our brand name.',
      'The foundation of every living organism on Earth.',
    ],
  },
  {
    id: 'def-w4',
    word: 'SPRING',
    hints: [
      'A natural source where pristine groundwater emerges.',
      'Bubbles up from deep underground aquifers.',
      'Also shares its name with the season of renewal.',
    ],
  },
  {
    id: 'def-w5',
    word: 'HYDRATE',
    hints: [
      'The essential action your body requires multiple times a day.',
      'Experts recommend getting at least 8 full glasses daily.',
      'Restores energy, radiant skin, and sharp mental clarity.',
    ],
  },
  {
    id: 'def-w6',
    word: 'ECO',
    hints: [
      'A three-letter prefix representing harmony with nature.',
      'Reflects sustainable packaging and recyclable bottles.',
      'Short for ecological awareness.',
    ],
  },
];

// RFC4122 v4 compliant UUID generator for guaranteed valid Postgres UUIDs
export function generateValidUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // fallback
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Helper to safely extract hints string array from Supabase JSONB or fallback
 */
export function parseWordHints(hints: unknown): string[] {
  if (!hints) return [];
  if (Array.isArray(hints)) {
    return hints.map((h) => (typeof h === 'string' ? h : JSON.stringify(h)));
  }
  if (typeof hints === 'string') {
    try {
      const parsed = JSON.parse(hints);
      if (Array.isArray(parsed)) return parsed.map(String);
      return [hints];
    } catch {
      return [hints];
    }
  }
  if (typeof hints === 'object') {
    return Object.values(hints as Record<string, unknown>).map(String);
  }
  return [];
}

/**
 * 1. Check if customer exists by mobile number directly in `customers` table
 * (No local storage used)
 */
export async function getCustomerByMobile(mobile: string): Promise<CustomerRow | null> {
  const cleanMobile = mobile.trim();
  try {
    const { data, error } = await (supabase.from('customers') as any)
      .select('*')
      .eq('mobile', cleanMobile)
      .maybeSingle();

    if (error) {
      console.warn('Supabase getCustomerByMobile notice:', error.message);
      return null;
    }

    if (data) {
      return data as CustomerRow;
    }

    return null;
  } catch (err) {
    console.warn('Error querying customer by mobile:', err);
    return null;
  }
}

/**
 * 2. Create customer row if mobile doesn't exist directly in `customers` table
 * (No local storage used)
 */
export async function createCustomer(name: string, mobile: string): Promise<CustomerRow> {
  const cleanName = name.trim();
  const cleanMobile = mobile.trim();
  const randomKey = Math.floor(100000 + Math.random() * 900000).toString();

  // Verify directly in Supabase first
  try {
    const { data: existing } = await (supabase.from('customers') as any)
      .select('*')
      .eq('mobile', cleanMobile)
      .maybeSingle();

    if (existing) {
      return existing as CustomerRow;
    }
  } catch (err) {
    console.warn('Error checking existing customer in Supabase:', err);
  }

  // Insert into Supabase customers table
  const newCustomerPayload = {
    name: cleanName,
    mobile: cleanMobile,
    key: randomKey,
    available_points: 0,
    total_points: 0,
    total_cashback: 0,
  };

  try {
    const { data, error } = await (supabase.from('customers') as any)
      .insert([newCustomerPayload])
      .select('*')
      .maybeSingle();

    if (error) {
      console.warn('Supabase createCustomer notice:', error.message);

      // Check if customer was concurrently inserted
      const { data: retryCheck } = await (supabase.from('customers') as any)
        .select('*')
        .eq('mobile', cleanMobile)
        .maybeSingle();

      if (retryCheck) {
        return retryCheck as CustomerRow;
      }

      // Try once more with a new random key in case key collided
      const secondKey = Math.floor(100000 + Math.random() * 900000).toString();
      const { data: retryData, error: retryError } = await (supabase.from('customers') as any)
        .insert([{ ...newCustomerPayload, key: secondKey }])
        .select('*')
        .maybeSingle();

      if (!retryError && retryData) {
        return retryData as CustomerRow;
      }

      // In-memory fallback if database write fails
      return {
        id: generateValidUUID(),
        name: cleanName,
        mobile: cleanMobile,
        key: randomKey,
        available_points: 0,
        total_points: 0,
        total_cashback: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return data as CustomerRow;
  } catch (err) {
    console.warn('Error in createCustomer:', err);
    return {
      id: generateValidUUID(),
      name: cleanName,
      mobile: cleanMobile,
      key: randomKey,
      available_points: 0,
      total_points: 0,
      total_cashback: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

/**
 * 3. Create a session row for the customer in `sessions` table
 * (No local storage used)
 */
export async function createSession(customerId: string, customerMobile?: string): Promise<SessionRow> {
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  try {
    let verifiedCustomerId = customerId;

    // Verify customer actually exists in Supabase
    const { data: custCheck } = await (supabase.from('customers') as any)
      .select('id')
      .eq('id', customerId)
      .maybeSingle();

    if (!custCheck && customerMobile) {
      const { data: custByMobile } = await (supabase.from('customers') as any)
        .select('id')
        .eq('mobile', customerMobile)
        .maybeSingle();

      if (custByMobile?.id) {
        verifiedCustomerId = custByMobile.id;
      }
    }

    if (!custCheck && (!customerMobile || verifiedCustomerId === customerId)) {
      return {
        id: generateValidUUID(),
        customer_id: customerId,
        session_id: sessionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const { data, error } = await (supabase.from('sessions') as any)
      .insert({
        customer_id: verifiedCustomerId,
        session_id: sessionId,
      })
      .select('*')
      .single();

    if (error) {
      console.warn('Supabase createSession insert notice:', error.message);
      return {
        id: generateValidUUID(),
        customer_id: verifiedCustomerId,
        session_id: sessionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return data as SessionRow;
  } catch (err) {
    console.warn('createSession caught exception:', err);
    return {
      id: generateValidUUID(),
      customer_id: customerId,
      session_id: sessionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

/**
 * 4. Fetch available slots from `game_points` table
 */
export async function fetchGamePointSlots(): Promise<SpinSlot[]> {
  const defaultSlots: SpinSlot[] = [
    { id: 'def_1', points: 10, label: '10 Pts', emoji: '💧', color: '#12B8B0', textColor: '#FFFFFF' },
    { id: 'def_2', points: 25, label: '25 Pts', emoji: '🌊', color: '#0B253A', textColor: '#FFFFFF' },
    { id: 'def_3', points: 50, label: '50 Pts', emoji: '💎', color: '#06D6A0', textColor: '#0B253A' },
    { id: 'def_4', points: 100, label: '100 Pts', emoji: '⚡', color: '#FFD166', textColor: '#0B253A' },
    { id: 'def_5', points: 200, label: '200 Pts', emoji: '🌟', color: '#FF6B6B', textColor: '#FFFFFF' },
    { id: 'def_6', points: 500, label: '500 Pts', emoji: '👑', color: '#8338EC', textColor: '#FFFFFF' },
    { id: 'def_7', points: 30, label: '30 Pts', emoji: '🍀', color: '#118AB2', textColor: '#FFFFFF' },
    { id: 'def_8', points: 150, label: '150 Pts', emoji: '🎯', color: '#FF006E', textColor: '#FFFFFF' },
  ];

  try {
    const { data, error } = await supabase
      .from('game_points')
      .select('*')
      .order('values', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultSlots;
    }

    const rows = data as GamePointRow[];
    return rows.map((item, index) => {
      const palette = COLOR_PALETTE[index % COLOR_PALETTE.length];
      const emoji = EMOJI_PALETTE[index % EMOJI_PALETTE.length];
      return {
        id: item.id,
        points: item.values,
        label: `${item.values} Pts`,
        emoji: emoji,
        color: palette.bg,
        textColor: palette.text,
      };
    });
  } catch (err) {
    console.warn('Error fetching game_points from Supabase:', err);
    return defaultSlots;
  }
}

/**
 * 5. Fetch a random word from `game_words` table including hints(jsonb)
 */
export async function fetchRandomGameWord(): Promise<WordPuzzle> {
  try {
    const { data, error } = await (supabase.from('game_words') as any)
      .select('*')
      .eq('status', 'active');

    if (error || !data || data.length === 0) {
      const randomIndex = Math.floor(Math.random() * FALLBACK_WORDS.length);
      return FALLBACK_WORDS[randomIndex];
    }

    const rows = data as (GameWordRow & { hints?: unknown })[];
    const randomIndex = Math.floor(Math.random() * rows.length);
    const selected = rows[randomIndex];

    let hintsList = parseWordHints(selected.hints);
    if (hintsList.length === 0) {
      // If hints column is empty for this word, check if fallback exists or provide generic hints
      const matchedFallback = FALLBACK_WORDS.find(
        (f) => f.word.toUpperCase() === selected.name.trim().toUpperCase()
      );
      if (matchedFallback) {
        hintsList = matchedFallback.hints;
      } else {
        hintsList = [
          `This word has ${selected.name.trim().length} letters.`,
          `Relates to PlyAqua pure hydration and natural wellness.`,
          `Starts with letter "${selected.name.trim().charAt(0).toUpperCase()}".`,
        ];
      }
    }

    return {
      id: selected.id,
      word: selected.name.trim().toUpperCase(),
      hints: hintsList,
    };
  } catch (err) {
    console.warn('Error fetching random game word from Supabase:', err);
    const randomIndex = Math.floor(Math.random() * FALLBACK_WORDS.length);
    return FALLBACK_WORDS[randomIndex];
  }
}

/**
 * 6. Add won points to customer in `customers` table and record transactions
 * (Executed after word puzzle is completed)
 * (No local storage used)
 */
export async function addPointsWon(
  customer: CustomerRow,
  sessionId: string,
  pointsWon: number
): Promise<CustomerRow> {
  const newAvailable = (customer.available_points || 0) + pointsWon;
  const newTotal = (customer.total_points || 0) + pointsWon;

  const updatedCustomerData: Partial<CustomerRow> = {
    available_points: newAvailable,
    total_points: newTotal,
    updated_at: new Date().toISOString(),
  };

  try {
    // 1. Update customer row in Supabase
    const { data, error } = await (supabase.from('customers') as any)
      .update(updatedCustomerData)
      .eq('id', customer.id)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Notice updating customer points:', error.message);
    }

    // 2. Insert into customer_points & customer_plays
    const { data: custExists } = await (supabase.from('customers') as any)
      .select('id')
      .eq('id', customer.id)
      .maybeSingle();

    if (custExists) {
      try {
        await (supabase.from('customer_points') as any).insert({
          customer_id: customer.id,
          points: pointsWon,
          type: 'add',
          notes: `Spin Wheel & Word Game Win: +${pointsWon} points`,
          session_id: sessionId,
        });
      } catch (e) {
        console.warn('customer_points insert notice:', e);
      }

      try {
        await (supabase.from('customer_plays') as any).insert({
          customer_id: customer.id,
          session_id: sessionId,
        });
      } catch (e) {
        console.warn('customer_plays insert notice:', e);
      }
    }

    const updated: CustomerRow = (data as CustomerRow) || {
      ...customer,
      available_points: newAvailable,
      total_points: newTotal,
      updated_at: new Date().toISOString(),
    };

    return updated;
  } catch (err) {
    console.warn('Error in addPointsWon:', err);
    return {
      ...customer,
      available_points: newAvailable,
      total_points: newTotal,
      updated_at: new Date().toISOString(),
    };
  }
}
