import { createClient } from '@supabase/supabase-js';

// ============================================================================
// PlyAqua Schema Enums (mirrored from lib/schemas.sql)
// ============================================================================
export type UserRole = 'admin' | 'partner';
export type ActiveStatus = 'active' | 'deactive';
export type BillStatus = 'pending' | 'delivered' | 'accepted';
export type TransactionType = 'add' | 'sub';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'other' | 'bill';
export type PointsTransType = 'add' | 'delete';

// ============================================================================
// Table Row Types (mirrored from lib/schemas.sql)
// ============================================================================
export interface UserRow {
  id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface PartnerCategoryRow {
  id: string;
  p_cat_id: string | null;
  name: string;
  status: ActiveStatus;
  created_at: string;
  updated_at: string;
}

export interface SizeRow {
  id: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface AdContentRow {
  id: string;
  title: string;
  media_url: string | null;
  status: ActiveStatus;
  created_at: string;
  updated_at: string;
}

export interface GamePlaySettingRow {
  id: string;
  title: string;
  value: Record<string, unknown> | string | number | boolean | unknown[];
  created_at: string;
  updated_at: string;
}

export interface GamePointRow {
  id: string;
  values: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface GameCashbackRow {
  id: string;
  range_from: number;
  range_to: number;
  created_at: string;
  updated_at: string;
}

export interface GameWordRow {
  id: string;
  name: string;
  status: string;
  hints?: string[] | any;
  created_at: string;
  updated_at: string;
}

export interface PlaycodeRow {
  id: string;
  code: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerRow {
  id: string;
  name: string;
  mobile: string;
  available_points: number;
  key: string | null;
  total_points: number;
  total_cashback: number;
  created_at: string;
  updated_at: string;
}

export interface PartnerProfileRow {
  id: string;
  partner_id: string | null;
  address: string | null;
  available_points: number;
  credit_amount: number;
  partner_category: string | null;
  total_points: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  prod_id: string;
  name: string;
  size: string | null;
  mrp: number;
  sp: number;
  qty: number;
  status: ActiveStatus;
  created_at: string;
  updated_at: string;
}

export interface CampaignRow {
  id: string;
  title: string;
  description: string | null;
  content_id: string | null;
  views: number;
  status: ActiveStatus;
  created_at: string;
  updated_at: string;
}

export interface SessionRow {
  id: string;
  customer_id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
}

export interface BillRow {
  id: string;
  bill_id: string;
  partner_id: string;
  amount: number;
  status: BillStatus;
  notes: string | null;
  balance: number;
  bill_date: string;
  created_at: string;
  updated_at: string;
}

export interface BillItemRow {
  id: string;
  bill_id: string;
  product_id: string;
  sp: number;
  qty: number;
  row_total: number;
  created_at: string;
  updated_at: string;
}

export interface PartnerTransactionRow {
  id: string;
  partner_id: string;
  type: TransactionType;
  bill_id: string | null;
  amount: number;
  method: PaymentMethod;
  notes: string | null;
  balance: number;
  payment_date: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerPointRow {
  id: string;
  partner_id: string;
  type: PointsTransType;
  points: number;
  avl_points: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerInventoryRow {
  id: string;
  partner_id: string;
  product_id: string;
  qty: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerPointRow {
  id: string;
  type: string;
  points: number;
  customer_id: string;
  notes: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerPointsReqRow {
  id: string;
  customer_id: string;
  points: number;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCashbackRow {
  id: string;
  customer_id: string;
  mbl: string | null;
  cashback_amnt: number;
  upi_id: string | null;
  status: string;
  playcode: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerPlayRow {
  id: string;
  customer_id: string;
  playcode: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Supabase Database Type Schema
// ============================================================================
export interface Database {
  public: {
    Tables: {
      users: { Row: UserRow; Insert: Partial<UserRow> & { id: string; name: string; role: UserRole }; Update: Partial<UserRow> };
      partner_categories: { Row: PartnerCategoryRow; Insert: Partial<PartnerCategoryRow> & { name: string }; Update: Partial<PartnerCategoryRow> };
      sizes: { Row: SizeRow; Insert: Partial<SizeRow> & { value: string }; Update: Partial<SizeRow> };
      ad_content: { Row: AdContentRow; Insert: Partial<AdContentRow> & { title: string }; Update: Partial<AdContentRow> };
      game_play_settings: { Row: GamePlaySettingRow; Insert: Partial<GamePlaySettingRow> & { title: string; value: unknown }; Update: Partial<GamePlaySettingRow> };
      game_points: { Row: GamePointRow; Insert: Partial<GamePointRow> & { values: number; name: string }; Update: Partial<GamePointRow> };
      game_cashback: { Row: GameCashbackRow; Insert: Partial<GameCashbackRow> & { range_from: number; range_to: number }; Update: Partial<GameCashbackRow> };
      game_words: { Row: GameWordRow; Insert: Partial<GameWordRow> & { name: string }; Update: Partial<GameWordRow> };
      playcodes: { Row: PlaycodeRow; Insert: Partial<PlaycodeRow> & { code: string }; Update: Partial<PlaycodeRow> };
      customers: { Row: CustomerRow; Insert: Partial<CustomerRow> & { name: string; mobile: string }; Update: Partial<CustomerRow> };
      partner_profile: { Row: PartnerProfileRow; Insert: Partial<PartnerProfileRow> & { id: string }; Update: Partial<PartnerProfileRow> };
      products: { Row: ProductRow; Insert: Partial<ProductRow> & { prod_id: string; name: string; mrp: number; sp: number }; Update: Partial<ProductRow> };
      campaigns: { Row: CampaignRow; Insert: Partial<CampaignRow> & { title: string }; Update: Partial<CampaignRow> };
      sessions: { Row: SessionRow; Insert: Partial<SessionRow> & { customer_id: string; session_id: string }; Update: Partial<SessionRow> };
      bills: { Row: BillRow; Insert: Partial<BillRow> & { bill_id: string; partner_id: string; amount: number }; Update: Partial<BillRow> };
      bill_items: { Row: BillItemRow; Insert: Partial<BillItemRow> & { bill_id: string; product_id: string; sp: number; qty: number; row_total: number }; Update: Partial<BillItemRow> };
      partner_transactions: { Row: PartnerTransactionRow; Insert: Partial<PartnerTransactionRow> & { partner_id: string; type: TransactionType; amount: number; method: PaymentMethod; balance: number }; Update: Partial<PartnerTransactionRow> };
      partner_points: { Row: PartnerPointRow; Insert: Partial<PartnerPointRow> & { partner_id: string; type: PointsTransType; points: number; avl_points: number }; Update: Partial<PartnerPointRow> };
      partner_inventory: { Row: PartnerInventoryRow; Insert: Partial<PartnerInventoryRow> & { partner_id: string; product_id: string }; Update: Partial<PartnerInventoryRow> };
      customer_points: { Row: CustomerPointRow; Insert: Partial<CustomerPointRow> & { type: string; points: number; customer_id: string }; Update: Partial<CustomerPointRow> };
      customer_points_reqs: { Row: CustomerPointsReqRow; Insert: Partial<CustomerPointsReqRow> & { customer_id: string; points: number }; Update: Partial<CustomerPointsReqRow> };
      customer_cashback: { Row: CustomerCashbackRow; Insert: Partial<CustomerCashbackRow> & { customer_id: string; cashback_amnt: number }; Update: Partial<CustomerCashbackRow> };
      customer_plays: { Row: CustomerPlayRow; Insert: Partial<CustomerPlayRow> & { customer_id: string }; Update: Partial<CustomerPlayRow> };
    };
  };
}

// ============================================================================
// Supabase Client Initialization
// ============================================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
