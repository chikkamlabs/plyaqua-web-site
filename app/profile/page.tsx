'use client';

import React, { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PointsReqModal from '@/components/pointsreq';
import CustomerCashbackReqsModal from '@/components/customercashbacks';
import {
  User,
  Phone,
  KeyRound,
  Coins,
  ArrowRight,
  Gift,
  Clock,
  Sparkles,
  LogOut,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  Calendar,
} from 'lucide-react';
import { CustomerRow, CustomerPointRow } from '@/lib/supabase';
import {
  verifyCustomerCredentials,
  fetchCustomerPointsHistory,
} from '@/lib/customerpointsStore';

export default function ProfilePage() {
  // Input fields for verification
  const [mobile, setMobile] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Verified Customer and Data State
  const [customer, setCustomer] = useState<CustomerRow | null>(null);
  const [pointsHistory, setPointsHistory] = useState<CustomerPointRow[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Modals state
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isCashbackOpen, setIsCashbackOpen] = useState(false);

  // Handle Verification / Login
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanMobile = mobile.trim().replace(/\D/g, '');
    const cleanKey = key.trim();

    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!cleanKey) {
      setErrorMsg('Please enter your 6-digit key.');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyCustomerCredentials(cleanMobile, cleanKey);
      if (!result.success || !result.customer) {
        setErrorMsg(result.message || 'Credentials do not match our records.');
        setCustomer(null);
      } else {
        setCustomer(result.customer);
        loadPointsHistory(result.customer.id);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error verifying credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch / refresh customer points history
  const loadPointsHistory = async (customerId: string) => {
    setLoadingHistory(true);
    try {
      const history = await fetchCustomerPointsHistory(customerId);
      setPointsHistory(history);
    } catch (err) {
      console.error('Error fetching points history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Reset verification to enter another mobile/key
  const handleLogout = () => {
    setCustomer(null);
    setPointsHistory([]);
    setMobile('');
    setKey('');
    setErrorMsg('');
  };

  // Format date helper: Date only (e.g. 2026-11-04 or Nov 4, 2026)
  const formatDateOnly = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr.split('T')[0] || dateStr;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr.split('T')[0] || dateStr;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pure-white text-deep-navy selection:bg-soft-aqua selection:text-deep-navy">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* =========================================================================
            STATE 1: ASK MOBILE NUMBER & KEY + ENTER BUTTON
        ========================================================================= */}
        {!customer ? (
          <section className="max-w-md mx-auto bg-pure-white rounded-3xl border-2 border-pale-blue-gray p-6 sm:p-8 shadow-sm">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soft-aqua text-aqua-teal text-xs font-bold tracking-wide uppercase mb-3">
              <User className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-deep-navy tracking-tight leading-tight">
              Customer Profile
            </h1>
            <p className="text-sm text-deep-navy/70 mt-2 mb-6">
              Enter your registered mobile number and 6-digit key to view your points, transaction history, and submit point redemptions.
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              {/* Mobile Number Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-deep-navy mb-1.5">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-base font-bold text-deep-navy/50">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    className="w-full pl-14 pr-4 py-3 bg-pure-white border-2 border-pale-blue-gray rounded-xl text-deep-navy placeholder:text-deep-navy/40 focus:border-aqua-teal focus:outline-none focus:ring-2 focus:ring-aqua-teal/20 text-base font-semibold tracking-wide transition-all"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* 6-Digit Key Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-deep-navy mb-1.5">
                  6-Digit Key
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-base font-mono font-bold text-deep-navy/50">#</span>
                  <input
                    type="text"
                    maxLength={10}
                    value={key}
                    onChange={(e) => setKey(e.target.value.trim())}
                    placeholder="e.g. 671234"
                    className="w-full pl-10 pr-4 py-3 bg-pure-white border-2 border-pale-blue-gray rounded-xl text-deep-navy placeholder:text-deep-navy/40 focus:border-aqua-teal focus:outline-none focus:ring-2 focus:ring-aqua-teal/20 text-base font-mono font-semibold tracking-wider transition-all"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="text-xs font-semibold text-vibrant-coral bg-soft-aqua/60 p-3 rounded-xl border border-pale-blue-gray">
                  {errorMsg}
                </div>
              )}

              {/* Enter Button */}
              <button
                type="submit"
                disabled={loading || mobile.length < 10 || !key}
                className="w-full py-3.5 px-6 rounded-xl bg-aqua-teal hover:bg-deep-navy text-pure-white font-bold text-base shadow-sm active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Verifying...' : 'Enter Profile'}</span>
                <ArrowRight className="w-4 h-4 text-pure-white" />
              </button>
            </form>
          </section>
        ) : (
          /* =========================================================================
              STATE 2: DISPLAY CUSTOMER DETAILS, POINTS & REDEEM BUTTON & POINTS LIST
          ========================================================================= */
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Top Customer Summary Card */}
            <section className="bg-pure-white rounded-3xl border-2 border-pale-blue-gray p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-pale-blue-gray">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-soft-aqua border border-aqua-teal/30 flex items-center justify-center text-aqua-teal font-black text-xl shadow-xs">
                    {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-deep-navy tracking-tight">
                      {customer.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-deep-navy/70 mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-aqua-teal" />
                        +91 {customer.mobile}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <KeyRound className="w-3.5 h-3.5 text-aqua-teal" />
                        Key: #{customer.key}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Points Redeem Button */}
                  <button
                    type="button"
                    onClick={() => setIsRedeemOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-aqua-teal hover:bg-deep-navy text-pure-white font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Gift className="w-4 h-4 text-pure-white" />
                    <span>Points Redeem</span>
                  </button>

                  {/* Switch / Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2.5 rounded-xl border border-pale-blue-gray hover:bg-soft-aqua text-deep-navy/70 hover:text-deep-navy transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-6">
                <div className="bg-soft-aqua/60 p-4 rounded-2xl border border-pale-blue-gray flex flex-col items-center sm:items-start">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-deep-navy/60">
                    Available Points
                  </span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Coins className="w-5 h-5 text-aqua-teal" />
                    <span className="text-2xl sm:text-3xl font-black text-deep-navy">
                      {customer.available_points ?? 0}
                    </span>
                  </div>
                </div>

                <div className="bg-soft-aqua/60 p-4 rounded-2xl border border-pale-blue-gray flex flex-col items-center sm:items-start">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-deep-navy/60">
                    Total Earned Points
                  </span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Sparkles className="w-5 h-5 text-aqua-teal" />
                    <span className="text-2xl sm:text-3xl font-black text-deep-navy">
                      {customer.total_points ?? 0}
                    </span>
                  </div>
                </div>

                {/* Total Cashback Card (Clickable to open customer cashback sessions modal) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsCashbackOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsCashbackOpen(true);
                    }
                  }}
                  className="col-span-2 sm:col-span-1 bg-soft-aqua/60 hover:bg-soft-aqua p-4 rounded-2xl border-2 border-transparent hover:border-aqua-teal/40 transition-all cursor-pointer flex flex-col items-center sm:items-start group select-none shadow-xs"
                  title="Click to view cashback sessions & history"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-deep-navy/60 group-hover:text-deep-navy">
                      Total Cashback
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-aqua-teal group-hover:underline">
                      View Sessions &rarr;
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-lg font-bold text-aqua-teal">₹</span>
                    <span className="text-2xl sm:text-3xl font-black text-deep-navy">
                      {customer.total_cashback ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* List of customer_points table: points, type, updated_at date only */}
            <section className="bg-pure-white rounded-3xl border-2 border-pale-blue-gray p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-deep-navy tracking-tight">
                    Points Activity History
                  </h2>
                  <p className="text-xs text-deep-navy/60">
                    Recorded entries from the customer_points ledger
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => loadPointsHistory(customer.id)}
                  disabled={loadingHistory}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-pale-blue-gray text-xs font-semibold text-deep-navy hover:bg-soft-aqua transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-aqua-teal ${loadingHistory ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {loadingHistory ? (
                <div className="py-12 text-center text-sm text-deep-navy/60">
                  Loading points history...
                </div>
              ) : pointsHistory.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-soft-aqua/40 border border-pale-blue-gray p-6">
                  <Coins className="w-10 h-10 text-aqua-teal/50 mx-auto mb-2" />
                  <p className="text-sm font-bold text-deep-navy">No points records found yet</p>
                  <p className="text-xs text-deep-navy/60 mt-1">
                    Play the Spin Wheel game to earn instant points!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-pale-blue-gray text-[11px] font-bold uppercase tracking-wider text-deep-navy/70">
                        <th className="py-3 px-3">Points</th>
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3">Updated Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pale-blue-gray text-sm font-medium">
                      {pointsHistory.map((item) => {
                        const isAdd = item.type === 'add';
                        return (
                          <tr key={item.id} className="hover:bg-soft-aqua/40 transition-colors">
                            {/* Points Column */}
                            <td className="py-3.5 px-3">
                              <span className={`inline-flex items-center gap-1.5 font-bold ${
                                isAdd ? 'text-aqua-teal' : 'text-vibrant-coral'
                              }`}>
                                {isAdd ? (
                                  <PlusCircle className="w-4 h-4 shrink-0" />
                                ) : (
                                  <MinusCircle className="w-4 h-4 shrink-0" />
                                )}
                                <span>{isAdd ? `+${item.points}` : `-${item.points}`}</span>
                              </span>
                            </td>

                            {/* Type Column */}
                            <td className="py-3.5 px-3">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                isAdd
                                  ? 'bg-soft-aqua text-aqua-teal border border-aqua-teal/30'
                                  : 'bg-vibrant-coral/10 text-vibrant-coral border border-vibrant-coral/30'
                              }`}>
                                {item.type}
                              </span>
                            </td>

                            {/* Updated_at Date Only Column */}
                            <td className="py-3.5 px-3 text-deep-navy/80 font-mono text-xs">
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-aqua-teal" />
                                <span>{formatDateOnly(item.updated_at || item.created_at)}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Redeem Points Modal */}
            <PointsReqModal
              isOpen={isRedeemOpen}
              onClose={() => setIsRedeemOpen(false)}
              customerId={customer.id}
              customerName={customer.name}
              availablePoints={customer.available_points || 0}
              onSuccess={() => {
                // Refresh customer points & list
                loadPointsHistory(customer.id);
              }}
            />

            {/* Customer Cashback Sessions Modal */}
            <CustomerCashbackReqsModal
              isOpen={isCashbackOpen}
              onClose={() => setIsCashbackOpen(false)}
              customerId={customer.id}
              customerName={customer.name}
              totalCashback={customer.total_cashback || 0}
            />

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
