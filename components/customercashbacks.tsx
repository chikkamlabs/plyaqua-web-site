'use client';

import React, { useEffect, useState } from 'react';
import { X, IndianRupee, Calendar, RefreshCw, Smartphone, Layers, CheckCircle, Clock, XCircle } from 'lucide-react';
import { CustomerCashbackRow } from '@/lib/supabase';
import { fetchCustomerCashbackData } from '@/lib/customercashbacksStore';

interface CustomerCashbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  totalCashback: number;
}

export default function CustomerCashbackReqsModal({
  isOpen,
  onClose,
  customerId,
  customerName,
  totalCashback,
}: CustomerCashbackModalProps) {
  const [cashbacks, setCashbacks] = useState<CustomerCashbackRow[]>([]);
  const [sessionsCount, setSessionsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Load cashback data when modal opens
  useEffect(() => {
    if (!isOpen || !customerId) return;
    let active = true;

    async function fetchData() {
      try {
        const res = await fetchCustomerCashbackData(customerId);
        if (active) {
          setCashbacks(res.cashbacks);
          setSessionsCount(res.totalSessionsCount);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading cashback data:', err);
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [isOpen, customerId]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetchCustomerCashbackData(customerId);
      setCashbacks(res.cashbacks);
      setSessionsCount(res.totalSessionsCount);
    } catch (err) {
      console.error('Error refreshing cashback data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Format date only (e.g. Nov 4, 2026 or 2026-11-04)
  const formatDateOnly = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr.split('T')[0] || dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr.split('T')[0] || dateStr;
    }
  };

  // Status badge styling helper
  const renderStatusBadge = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'completed' || s === 'approved' || s === 'success') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-soft-aqua text-aqua-teal border border-aqua-teal/40">
          <CheckCircle className="w-3 h-3" />
          <span>{status}</span>
        </span>
      );
    }
    if (s === 'rejected' || s === 'failed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-vibrant-coral/10 text-vibrant-coral border border-vibrant-coral/30">
          <XCircle className="w-3 h-3" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sunburst-yellow/15 text-deep-navy border border-sunburst-yellow/40">
        <Clock className="w-3 h-3 text-deep-navy/70" />
        <span>{status || 'pending'}</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-deep-navy/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-pure-white rounded-3xl border-2 border-pale-blue-gray p-5 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-deep-navy/60 hover:text-deep-navy hover:bg-soft-aqua transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-soft-aqua border border-aqua-teal/40 flex items-center justify-center text-aqua-teal shrink-0">
            <IndianRupee className="w-6 h-6 text-aqua-teal" />
          </div>
          <div>
            <h3 className="text-xl font-black text-deep-navy tracking-tight">
              Cashback Activity
            </h3>
            <p className="text-xs text-deep-navy/70">
              Account: <span className="font-semibold text-aqua-teal">{customerName}</span>
            </p>
          </div>
        </div>

        {/* Top Summary Cards: Total Cashback & Total Cashback Sessions Count */}
        <div className="grid grid-cols-2 gap-3 mb-5 shrink-0">
          {/* Card 1: Total Cashback Amount */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-soft-aqua/60 border border-pale-blue-gray flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-deep-navy/60">
              Total Cashback
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-base font-bold text-aqua-teal">₹</span>
              <span className="text-2xl sm:text-3xl font-black text-deep-navy">
                {totalCashback ?? 0}
              </span>
            </div>
          </div>

          {/* Card 2: Total Cashback Sessions (Count) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-soft-aqua/60 border border-pale-blue-gray flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-deep-navy/60">
              Cashback Sessions
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Layers className="w-5 h-5 text-aqua-teal" />
              <span className="text-2xl sm:text-3xl font-black text-deep-navy">
                {sessionsCount}
              </span>
              <span className="text-xs text-deep-navy/60 font-semibold">sessions</span>
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h4 className="text-sm font-bold text-deep-navy">
            Cashback Claims ({cashbacks.length})
          </h4>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-pale-blue-gray text-xs font-semibold text-deep-navy hover:bg-soft-aqua transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-aqua-teal ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Scrollable Cashback List Area */}
        <div className="flex-1 overflow-y-auto min-h-[180px] border border-pale-blue-gray rounded-2xl">
          {loading ? (
            <div className="py-12 text-center text-sm text-deep-navy/60">
              Loading cashback records...
            </div>
          ) : cashbacks.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <IndianRupee className="w-10 h-10 text-aqua-teal/40 mx-auto mb-2" />
              <p className="text-sm font-bold text-deep-navy">No cashback claims recorded</p>
              <p className="text-xs text-deep-navy/60 mt-1">
                Cashback rewards from promo codes and gameplay sessions will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-soft-aqua/90 backdrop-blur-xs border-b border-pale-blue-gray">
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-deep-navy/70">
                    <th className="py-3 px-3.5">Cashback Amount</th>
                    <th className="py-3 px-3.5">UPI ID</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pale-blue-gray text-sm font-medium">
                  {cashbacks.map((item) => (
                    <tr key={item.id} className="hover:bg-soft-aqua/30 transition-colors">
                      {/* Cashback Amount */}
                      <td className="py-3 px-3.5">
                        <span className="font-extrabold text-aqua-teal text-base">
                          ₹{Number(item.cashback_amnt).toFixed(2)}
                        </span>
                      </td>

                      {/* UPI ID */}
                      <td className="py-3 px-3.5 text-deep-navy/80 text-xs font-mono">
                        {item.upi_id ? (
                          <span className="inline-flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5 text-aqua-teal shrink-0" />
                            <span>{item.upi_id}</span>
                          </span>
                        ) : (
                          <span className="text-deep-navy/40 italic">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* Date (Date only) */}
                      <td className="py-3 px-3.5 text-deep-navy/80 font-mono text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-aqua-teal shrink-0" />
                          <span>{formatDateOnly(item.created_at || item.updated_at)}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-pale-blue-gray/60 hover:bg-pale-blue-gray text-deep-navy font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
