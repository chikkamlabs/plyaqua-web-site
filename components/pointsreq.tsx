'use client';

import React, { useState } from 'react';
import { X, Gift, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createPointsRedemptionRequest } from '@/lib/customerpointsStore';

interface PointsReqModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  availablePoints: number;
  onSuccess: () => void;
}

export default function PointsReqModal({
  isOpen,
  onClose,
  customerId,
  customerName,
  availablePoints,
  onSuccess,
}: PointsReqModalProps) {
  const [pointsInput, setPointsInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const enteredPoints = Math.floor(Number(pointsInput));

    if (!pointsInput || isNaN(enteredPoints) || enteredPoints <= 0) {
      setErrorMessage('Please enter a valid points amount to redeem.');
      return;
    }

    // Check available points > entered points
    if (availablePoints <= enteredPoints) {
      setErrorMessage(
        `Available points (${availablePoints}) must be greater than entered points (${enteredPoints}).`
      );
      return;
    }

    setLoading(true);
    try {
      const res = await createPointsRedemptionRequest({
        customerId,
        pointsToRedeem: enteredPoints,
        availablePoints,
      });

      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage('Points redemption request submitted successfully!');
        setPointsInput('');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-navy/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-pure-white rounded-3xl border-2 border-pale-blue-gray p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-soft-aqua border border-aqua-teal/40 flex items-center justify-center text-aqua-teal shrink-0">
            <Gift className="w-6 h-6 text-aqua-teal" />
          </div>
          <div>
            <h3 className="text-xl font-black text-deep-navy tracking-tight">
              Redeem Points
            </h3>
            <p className="text-xs text-deep-navy/70">
              For <span className="font-semibold text-aqua-teal">{customerName}</span>
            </p>
          </div>
        </div>

        {/* Balance Notice */}
        <div className="p-3.5 mb-5 rounded-2xl bg-soft-aqua border border-aqua-teal/30 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-deep-navy/70">
            Current Available Points
          </span>
          <span className="text-lg font-black text-deep-navy">
            {availablePoints} <span className="text-xs text-aqua-teal font-bold">pts</span>
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-deep-navy mb-1.5">
              Points to Redeem
            </label>
            <input
              type="number"
              min="1"
              max={Math.max(0, availablePoints - 1)}
              value={pointsInput}
              onChange={(e) => setPointsInput(e.target.value)}
              placeholder={`Enter points (Must be less than ${availablePoints})`}
              className="w-full px-4 py-3 bg-pure-white border-2 border-pale-blue-gray rounded-xl text-deep-navy placeholder:text-deep-navy/40 focus:border-aqua-teal focus:outline-none focus:ring-2 focus:ring-aqua-teal/20 text-base font-semibold transition-all"
              autoFocus
              required
            />
            <p className="text-[11px] text-deep-navy/60 mt-1">
              * Note: Your available points must be strictly greater than the entered points.
            </p>
          </div>

          {/* Preset Notes Info */}
          <div className="text-[11px] text-deep-navy/70 bg-pale-blue-gray/50 p-2.5 rounded-xl border border-pale-blue-gray">
            <span className="font-bold text-deep-navy">Request Details:</span> Notes: &quot;customer request&quot; • Status: &quot;pending&quot;
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-soft-aqua text-vibrant-coral border border-pale-blue-gray text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-soft-aqua text-aqua-teal border border-aqua-teal/40 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              disabled={loading || !pointsInput}
              className="flex-1 py-3 px-5 rounded-xl bg-aqua-teal hover:bg-deep-navy text-pure-white font-bold text-sm shadow-sm active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Save Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-3 px-5 rounded-xl border-2 border-pale-blue-gray text-deep-navy hover:bg-pale-blue-gray/50 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
