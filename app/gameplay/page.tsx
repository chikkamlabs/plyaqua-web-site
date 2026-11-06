'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import confetti from 'canvas-confetti';
import {
  Phone,
  User,
  Sparkles,
  Trophy,
  CheckCircle2,
  Lock,
  RotateCw,
  Coins,
  KeyRound,
  ArrowDownCircle,
  RefreshCw,
  Play,
  Pause,
  AlertCircle,
  Check,
  Volume2,
  VolumeX,
  IndianRupee,
  Ticket,
} from 'lucide-react';
import Link from 'next/link';
import {
  CustomerRow,
  SessionRow,
  PlaycodeRow,
} from '@/lib/supabase';
import {
  getCustomerByMobile,
  createCustomer,
  createSession,
  fetchGamePointSlots,
  fetchRandomGameWord,
  addPointsWon,
  SpinSlot,
  WordPuzzle,
  MAX_WRONG_CHANCES,
} from '@/lib/gameplayStore';
import {
  validatePlaycode,
  fetchGameCashbackSlots,
  insertCustomerCashback,
  CashbackSpinSlot,
} from '@/lib/customercashbacksStore';

export default function GameplayPage() {
  // Mobile & Registration State (Strictly no local storage)
  const [mobileNumber, setMobileNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [authState, setAuthState] = useState<'IDLE' | 'ASK_NAME' | 'VERIFIED'>('IDLE');
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Active Customer & Session
  const [customer, setCustomer] = useState<CustomerRow | null>(null);
  const [session, setSession] = useState<SessionRow | null>(null);

  // Reward Mode Toggle: 'points' or 'cash'
  const [rewardMode, setRewardMode] = useState<'points' | 'cash'>('points');
  const [playcodeInput, setPlaycodeInput] = useState('');
  const [validPlaycode, setValidPlaycode] = useState<PlaycodeRow | null>(null);
  const [playcodeLoading, setPlaycodeLoading] = useState(false);
  const [playcodeError, setPlaycodeError] = useState('');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [cashbackSubmitting, setCashbackSubmitting] = useState(false);
  const [cashbackClaimed, setCashbackClaimed] = useState(false);
  const [cashbackMessage, setCashbackMessage] = useState('');
  const [cashbackError, setCashbackError] = useState('');

  // Spin Wheel State (One session only one spin. Once played, do not allow re-spin)
  const [slots, setSlots] = useState<SpinSlot[]>([]);
  const [cashSlots, setCashSlots] = useState<CashbackSpinSlot[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpunInSession, setHasSpunInSession] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [winningSlot, setWinningSlot] = useState<SpinSlot | null>(null);
  const [winningCashSlot, setWinningCashSlot] = useState<CashbackSpinSlot | null>(null);
  const [spinWonPoints, setSpinWonPoints] = useState<number | null>(null);
  const [spinWonCash, setSpinWonCash] = useState<number | null>(null);

  // Challenge & Video Stage State
  // 'IDLE' -> 'CHALLENGE_ACTIVE' (after spin) -> 'COMPLETED' (after word game completes)
  const [gameStage, setGameStage] = useState<'IDLE' | 'CHALLENGE_ACTIVE' | 'COMPLETED'>('IDLE');
  
  // Word Puzzle State
  const [puzzle, setPuzzle] = useState<WordPuzzle | null>(null);
  const [guessedSlots, setGuessedSlots] = useState<string[]>([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [wrongChancesLeft, setWrongChancesLeft] = useState<number>(MAX_WRONG_CHANCES);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
  const [slotShakeError, setSlotShakeError] = useState<boolean>(false);
  const [wordGuessedCorrectly, setWordGuessedCorrectly] = useState<boolean>(false);
  const [isAddingPoints, setIsAddingPoints] = useState<boolean>(false);

  // Video Player State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  const [canSkipGuess, setCanSkipGuess] = useState(false);

  const wheelSectionRef = useRef<HTMLElement | null>(null);
  const challengeSectionRef = useRef<HTMLElement | null>(null);
  const nativeInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-cycle hints one after one
  useEffect(() => {
    if (gameStage !== 'CHALLENGE_ACTIVE' || !puzzle || puzzle.hints.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHintIndex((prev) => (prev + 1) % puzzle.hints.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [gameStage, puzzle]);

  // Load available game points slots and game cashback slots on mount
  useEffect(() => {
    let mounted = true;
    async function loadAllSlots() {
      try {
        const [pointSlots, cashbackSlots] = await Promise.all([
          fetchGamePointSlots(),
          fetchGameCashbackSlots(),
        ]);
        if (mounted) {
          setSlots(pointSlots);
          setCashSlots(cashbackSlots);
        }
      } catch (err) {
        console.warn('Error loading wheel slots:', err);
      }
    }
    loadAllSlots();
    return () => {
      mounted = false;
    };
  }, []);

  // Multi-stage fireworks blast
  const triggerCongratsBlast = () => {
    try {
      // Center blast
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#12B8B0', '#06D6A0', '#FFD166', '#FF6B6B', '#8338EC', '#0B253A'],
      });

      // Left blast
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.05, y: 0.65 },
          colors: ['#12B8B0', '#FFD166', '#FF6B6B'],
        });
      }, 250);

      // Right blast
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.95, y: 0.65 },
          colors: ['#06D6A0', '#8338EC', '#118AB2'],
        });
      }, 450);
    } catch (e) {
      console.warn('Confetti animation error:', e);
    }
  };

  // STEP 1: Check mobile number
  const handleCheckMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanMobile = mobileNumber.trim().replace(/\D/g, '');

    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const existing = await getCustomerByMobile(cleanMobile);

      if (existing) {
        // Customer exists: Welcome back!
        setCustomer(existing);
        setIsNewCustomer(false);
        const newSession = await createSession(existing.id, existing.mobile);
        setSession(newSession);
        setAuthState('VERIFIED');
      } else {
        // Customer does not exist: ask name
        setIsNewCustomer(true);
        setAuthState('ASK_NAME');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not verify mobile number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Name submitted for new customer
  const handleRegisterName = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      const cleanMobile = mobileNumber.trim().replace(/\D/g, '');
      const newCustomer = await createCustomer(customerName.trim(), cleanMobile);
      setCustomer(newCustomer);

      const newSession = await createSession(newCustomer.id, newCustomer.mobile);
      setSession(newSession);

      setAuthState('VERIFIED');
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not register account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Playcode validation handler
  const handleValidatePlaycode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPlaycodeError('');
    if (!playcodeInput.trim()) {
      setPlaycodeError('Please enter a play code.');
      return;
    }
    setPlaycodeLoading(true);
    try {
      const res = await validatePlaycode(playcodeInput.trim());
      if (res.isValid && res.playcodeRow) {
        setValidPlaycode(res.playcodeRow);
        setPlaycodeError('');
      } else {
        setValidPlaycode(null);
        setPlaycodeError(res.message || 'Play code is invalid.');
      }
    } catch (err: any) {
      setPlaycodeError(err?.message || 'Error checking play code.');
    } finally {
      setPlaycodeLoading(false);
    }
  };

  // Switch or reset mobile
  const handleResetMobile = () => {
    setAuthState('IDLE');
    setCustomer(null);
    setSession(null);
    setCustomerName('');
    setWinningSlot(null);
    setWinningCashSlot(null);
    setSpinWonPoints(null);
    setSpinWonCash(null);
    setHasSpunInSession(false);
    setRewardMode('points');
    setPlaycodeInput('');
    setValidPlaycode(null);
    setPlaycodeError('');
    setUpiIdInput('');
    setCashbackSubmitting(false);
    setCashbackClaimed(false);
    setCashbackMessage('');
    setCashbackError('');
    setGameStage('IDLE');
    setPuzzle(null);
    setGuessedSlots([]);
    setWrongChancesLeft(MAX_WRONG_CHANCES);
    setErrorMessage('');
  };

  // Submit Cashback with entered UPI ID to customer_cashback table
  const handleSubmitCashback = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customer || !session || spinWonCash === null) return;

    const cleanUpi = upiIdInput.trim();
    if (!cleanUpi) {
      setCashbackError('Please enter your UPI ID.');
      return;
    }
    if (!cleanUpi.includes('@')) {
      setCashbackError('Please enter a valid UPI ID (e.g. mobile@upi or username@bank).');
      return;
    }

    setCashbackSubmitting(true);
    setCashbackError('');
    try {
      const res = await insertCustomerCashback({
        customer,
        cashbackAmount: spinWonCash,
        upiId: cleanUpi,
        playcodeId: validPlaycode?.id,
        playcodeString: validPlaycode?.code,
        sessionId: session.id,
      });

      if (res.success) {
        setCashbackClaimed(true);
        setCashbackMessage(res.message);
        if (res.updatedCustomer) {
          setCustomer(res.updatedCustomer);
        }
        triggerCongratsBlast();
      } else {
        setCashbackError(res.message);
      }
    } catch (err: any) {
      setCashbackError(err?.message || 'Error recording cashback.');
    } finally {
      setCashbackSubmitting(false);
    }
  };

  // Spin the wheel: One session only one spin. Once played, do not allow re-spin.
  const handleSpinClick = () => {
    if (isSpinning || !customer || hasSpunInSession) return;

    // In Cash mode, a verified active playcode is required
    if (rewardMode === 'cash') {
      if (!validPlaycode) {
        setPlaycodeError('Please enter and verify an active play code first to spin for Cash.');
        return;
      }
      if (cashSlots.length === 0) return;
    } else {
      if (slots.length === 0) return;
    }

    setIsSpinning(true);
    setHasSpunInSession(true);
    setWinningSlot(null);
    setWinningCashSlot(null);
    setSpinWonPoints(null);
    setSpinWonCash(null);
    setGameStage('IDLE');
    setPuzzle(null);
    setCanSkipGuess(false);
setVideoProgress(0);

    const isCash = rewardMode === 'cash';
    const activeSlotList = isCash ? cashSlots : slots;
    const slotCount = activeSlotList.length;
    const targetIndex = Math.floor(Math.random() * slotCount);

    const sliceAngle = 360 / slotCount;
    const targetSliceCenter = targetIndex * sliceAngle + sliceAngle / 2;

    const baseSpins = 360 * 6; // 6 full rotations
    const currentAngleNormalized = rotationDegree % 360;
    const desiredAngle = (360 - targetSliceCenter) % 360;
    let extraRotation = (desiredAngle - currentAngleNormalized + 360) % 360;
    if (extraRotation < 180) extraRotation += 360;

    const nextTotalRotation = rotationDegree + baseSpins + extraRotation;
    setRotationDegree(nextTotalRotation);

    // Rotate for exactly 4 seconds (4000ms)
    setTimeout(async () => {
      setIsSpinning(false);

      if (isCash) {
        const selectedCash = cashSlots[targetIndex];
        setWinningCashSlot(selectedCash);
        setSpinWonCash(selectedCash.amount);
      } else {
        const selectedPt = slots[targetIndex];
        setWinningSlot(selectedPt);
        setSpinWonPoints(selectedPt.points);
      }

      triggerCongratsBlast();

      // Fetch random word from game_words table for challenge
      const newPuzzle = await fetchRandomGameWord();
      setPuzzle(newPuzzle);
      setGuessedSlots(new Array(newPuzzle.word.length).fill(''));
      setSelectedSlotIndex(0);
      setWrongChancesLeft(MAX_WRONG_CHANCES);
      setActiveHintIndex(0);
      setWordGuessedCorrectly(false);
      setGameStage('CHALLENGE_ACTIVE');

      setTimeout(() => {
        challengeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => setIsVideoPlaying(false));
        }
      }, 500);
    }, 4000);
  };

  // Video play/pause toggle
  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => setIsVideoPlaying(false));
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  // Video ended handler
  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setCanSkipGuess(true);
  };

  // Word Game Completion Trigger
  // If points mode -> addPointsWon in customer_points & customers.available_points
  // If cash mode -> insert into customer_cashback with asked UPI ID
  const handleFinishWordPuzzle = useCallback(async (solved: boolean, finalGuessedSlots?: string[]) => {
    setWordGuessedCorrectly(solved);
    setGameStage('COMPLETED');

    if (finalGuessedSlots) {
      setGuessedSlots(finalGuessedSlots);
    }

    if (!customer || !session) return;

    setIsAddingPoints(true);
    try {
      if (rewardMode === 'points' && spinWonPoints !== null) {
        // ONLY insert into customer_points if toggle is points
        const updatedCustomer = await addPointsWon(customer, session.id, spinWonPoints);
        setCustomer(updatedCustomer);
        triggerCongratsBlast();
      } else if (rewardMode === 'cash' && spinWonCash !== null) {
        // Cash mode won! We will prompt or use UPI ID
        triggerCongratsBlast();
      }
    } catch (err) {
      console.error('Error recording reward after puzzle completion:', err);
    } finally {
      setIsAddingPoints(false);
    }
  }, [customer, session, rewardMode, spinWonPoints, spinWonCash]);

  // Handle letter guess at current selected slot
  const handleInputLetter = useCallback((letter: string) => {
    if (!puzzle || gameStage !== 'CHALLENGE_ACTIVE' || wrongChancesLeft <= 0) return;

    const targetWord = puzzle.word.toUpperCase();
    const currentCorrectLetter = targetWord[selectedSlotIndex];

    if (letter.toUpperCase() === currentCorrectLetter) {
      // Correct alphabet placement at index!
      const updated = [...guessedSlots];
      updated[selectedSlotIndex] = letter.toUpperCase();
      setGuessedSlots(updated);

      // Check if this completes the word
      const nextEmptyIndex = updated.findIndex((val, idx) => !val && idx !== selectedSlotIndex);
      const isWordFullyCompleted = updated.every((val) => Boolean(val));

      if (isWordFullyCompleted) {
        // All letters filled correctly!
        handleFinishWordPuzzle(true, updated);
      } else if (nextEmptyIndex !== -1) {
        setSelectedSlotIndex(nextEmptyIndex);
      }
    } else {
      // Wrong alphabet placement at index!
      setSlotShakeError(true);
      setTimeout(() => setSlotShakeError(false), 500);

      const nextWrong = wrongChancesLeft - 1;
      setWrongChancesLeft(nextWrong);

      // If user exhausts all 3 wrong chances:
      if (nextWrong <= 0) {
        handleFinishWordPuzzle(false);
      }
    }
  }, [puzzle, gameStage, wrongChancesLeft, selectedSlotIndex, guessedSlots, handleFinishWordPuzzle]);

  // Keyboard listener for desktop users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStage !== 'CHALLENGE_ACTIVE' || !puzzle) return;
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleInputLetter(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStage, puzzle, handleInputLetter]);

  // Render SVG Slices for the Spin Wheel (Points or Cash)
  const renderWheelSlices = () => {
    const isCash = rewardMode === 'cash';
    const activeList = isCash ? cashSlots : slots;
    const totalSlots = activeList.length;
    if (totalSlots === 0) return null;

    const radius = 145;
    const center = 160;
    const sliceAngle = (2 * Math.PI) / totalSlots;
    const sliceAngleDeg = 360 / totalSlots;

    return activeList.map((slot, i) => {
      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = (i + 1) * sliceAngle - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
      const midAngleDeg = i * sliceAngleDeg + sliceAngleDeg / 2 - 90;

      const labelText = isCash
        ? `₹${(slot as CashbackSpinSlot).amount}`
        : `${(slot as SpinSlot).points}`;

      return (
        <g key={slot.id || `slot_${i}`}>
          <path
            d={pathData}
            fill={slot.color}
            stroke="#0B253A"
            strokeWidth="2.5"
          />

          <g transform={`rotate(${midAngleDeg}, ${center}, ${center})`}>
            {/* Emoji */}
            <text
              x={center + radius * 0.76}
              y={center + 5}
              textAnchor="middle"
              className="text-xl select-none filter drop-shadow-sm pointer-events-none"
              transform={`rotate(90, ${center + radius * 0.76}, ${center + 5})`}
            >
              {slot.emoji}
            </text>

            {/* Label (Points or Cash Amount) */}
            <text
              x={center + radius * 0.42}
              y={center + 4}
              textAnchor="middle"
              fill={slot.textColor}
              fontSize={isCash ? "11.5" : "12.5"}
              fontWeight="800"
              className="select-none tracking-tight pointer-events-none"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textShadow: slot.textColor === '#FFFFFF' ? '0px 1px 2px rgba(0,0,0,0.45)' : 'none',
              }}
            >
              {labelText}
            </text>
          </g>
        </g>
      );
    });
  };

  const isVerified = authState === 'VERIFIED' && customer !== null;

  return (
    <div className="min-h-screen flex flex-col bg-pure-white text-deep-navy selection:bg-soft-aqua selection:text-deep-navy">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Page Content - Compact & Mobile Responsive */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* =========================================================================
            SECTION 1: ASK MOBILE NUMBER / GREETING
            - Small & responsive headings/text
            - Removed description when asking mobile number
            - 'Continue ->' placed beside mobile number and beside name input
            - Welcome greeting: only shows points, key removed, decreased font sizing
        ========================================================================= */}
        <section className="bg-pure-white rounded-2xl sm:rounded-3xl border-2 border-pale-blue-gray p-4 sm:p-6 shadow-xs transition-all duration-200">
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-soft-aqua text-aqua-teal text-[10px] sm:text-xs font-bold tracking-wide uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PlyAqua Lucky Spin</span>
          </div>

          <h1 className="text-lg sm:text-xl font-black text-deep-navy tracking-tight leading-snug">
            Spin the Wheel &amp; Win Points
          </h1>

          {/* Form State 1: Ask Mobile Number (Description removed, button beside input) */}
          {authState === 'IDLE' && (
            <div className="mt-3">
              <form onSubmit={handleCheckMobile} className="space-y-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-navy mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 min-w-0 flex items-center">
                      <span className="absolute left-3 text-sm font-bold text-deep-navy/50">+91</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit number"
                        className="w-full pl-11 pr-3 py-2 sm:py-2.5 bg-pure-white border-2 border-pale-blue-gray rounded-xl text-deep-navy placeholder:text-deep-navy/40 focus:border-aqua-teal focus:outline-none focus:ring-2 focus:ring-aqua-teal/20 text-sm font-semibold tracking-wide transition-all"
                        autoFocus
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || mobileNumber.length < 10}
                      className="shrink-0 py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl bg-aqua-teal hover:bg-deep-navy text-pure-white font-bold text-xs sm:text-sm shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>{loading ? 'Checking...' : 'Continue'}</span>
                      <span className="text-sm font-bold">&rarr;</span>
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-xs font-semibold text-vibrant-coral bg-soft-aqua/60 p-2 rounded-xl border border-pale-blue-gray">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Form State 2: Ask Name (Customer does NOT exist in table; Continue -> beside input) */}
          {authState === 'ASK_NAME' && (
            <div className="mt-3">
              <div className="p-2.5 bg-soft-aqua rounded-xl border border-pale-blue-gray mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-aqua-teal shrink-0" />
                <p className="text-xs font-medium text-deep-navy">
                  Mobile <span className="font-bold text-aqua-teal">+{mobileNumber}</span> is not registered. What is your name?
                </p>
              </div>

              <form onSubmit={handleRegisterName} className="space-y-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-navy mb-1.5">
                    Your Full Name
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      className="min-w-0 flex-1 px-3 py-2 sm:py-2.5 bg-pure-white border-2 border-pale-blue-gray rounded-xl text-deep-navy placeholder:text-deep-navy/40 focus:border-aqua-teal focus:outline-none focus:ring-2 focus:ring-aqua-teal/20 text-sm font-semibold transition-all"
                      autoFocus
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading || !customerName.trim()}
                      className="shrink-0 py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl bg-aqua-teal hover:bg-deep-navy text-pure-white font-bold text-xs sm:text-sm shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>{loading ? 'Saving...' : 'Continue'}</span>
                      <span className="text-sm font-bold">&rarr;</span>
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-xs font-semibold text-vibrant-coral bg-soft-aqua/60 p-2 rounded-xl border border-pale-blue-gray">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleResetMobile}
                    className="text-xs text-deep-navy/60 hover:text-deep-navy font-semibold transition-colors"
                  >
                    &larr; Change mobile number
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Form State 3: GREETING (Only show points, don't show key, decreased font sizing) */}
          {authState === 'VERIFIED' && customer && (
            <div className="mt-3 space-y-3">
              <div className="p-3 sm:p-3.5 bg-soft-aqua rounded-xl border border-aqua-teal/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-aqua-teal" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-aqua-teal">
                    {isNewCustomer ? 'Profile Created' : 'Customer Verified'}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-black text-deep-navy leading-snug">
                  {isNewCustomer ? (
                    <>Welcome, <span className="text-aqua-teal">{customer.name}</span>! 🎉</>
                  ) : (
                    <>Welcome back, <span className="text-aqua-teal">{customer.name}</span>! 🎉</>
                  )}
                </h2>

                <p className="text-xs text-deep-navy/70 mt-0.5">
                  Spin the wheel below to win points for your account.
                </p>

                {/* Only Show Points - Don't show Key */}
                <div className="mt-2.5 bg-pure-white p-2.5 sm:p-3 rounded-xl border border-pale-blue-gray flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-soft-aqua text-aqua-teal">
                      <Coins className="w-4 h-4 text-aqua-teal" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-navy/70">
                      Available Points
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-deep-navy">
                    {customer.available_points ?? 0} pts
                  </span>
                </div>

                {/* Reward Mode Toggle (Points vs Cash) with icons */}
                <div className="mt-3 p-3 bg-pure-white rounded-xl border border-pale-blue-gray">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-deep-navy/70 block mb-2">
                    Choose Spin Mode
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Points Toggle Option */}
                    <button
                      type="button"
                      disabled={hasSpunInSession || isSpinning}
                      onClick={() => setRewardMode('points')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        rewardMode === 'points'
                          ? 'bg-aqua-teal text-pure-white shadow-xs'
                          : 'bg-soft-aqua text-deep-navy/80 hover:bg-pale-blue-gray/60'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Points</span>
                    </button>

                    {/* Cash Toggle Option */}
                    <button
                      type="button"
                      disabled={hasSpunInSession || isSpinning}
                      onClick={() => setRewardMode('cash')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        rewardMode === 'cash'
                          ? 'bg-aqua-teal text-pure-white shadow-xs'
                          : 'bg-soft-aqua text-deep-navy/80 hover:bg-pale-blue-gray/60'
                      }`}
                    >
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>Cash</span>
                    </button>
                  </div>

                  {/* If Cash: Ask plycode (check if in playcodes table & status = active) */}
                  {rewardMode === 'cash' && (
                    <div className="mt-3 pt-3 border-t border-pale-blue-gray space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-deep-navy">
                        <Ticket className="w-3.5 h-3.5 text-aqua-teal" />
                        <span>Enter Play Code for Cash Spin</span>
                      </div>
                      <p className="text-[11px] text-deep-navy/70">
                        Check bottle cap or card for active redemption playcode.
                      </p>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={playcodeInput}
                          disabled={hasSpunInSession || isSpinning || (validPlaycode !== null)}
                          onChange={(e) => {
                            setPlaycodeInput(e.target.value.toUpperCase());
                            setPlaycodeError('');
                          }}
                          placeholder="e.g. A7K9P2"
                          className="min-w-0 flex-1 px-3 py-2 bg-pure-white border-2 border-pale-blue-gray rounded-xl text-deep-navy placeholder:text-deep-navy/40 focus:border-aqua-teal focus:outline-none text-xs font-mono font-bold tracking-wider uppercase transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleValidatePlaycode()}
                          disabled={playcodeLoading || !playcodeInput.trim() || hasSpunInSession || (validPlaycode !== null)}
                          className="shrink-0 py-2 px-3 rounded-xl bg-aqua-teal hover:bg-deep-navy text-pure-white font-bold text-xs shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          {playcodeLoading ? 'Verifying...' : validPlaycode ? 'Verified ✓' : 'Verify'}
                        </button>
                      </div>

                      {playcodeError && (
                        <div className="text-[11px] font-semibold text-vibrant-coral bg-soft-aqua/80 p-2 rounded-lg border border-pale-blue-gray">
                          {playcodeError}
                        </div>
                      )}

                      {validPlaycode && (
                        <div className="text-[11px] font-bold text-aqua-teal bg-soft-aqua p-2 rounded-lg border border-aqua-teal/30 flex items-center justify-between">
                          <span>✓ Active Code: {validPlaycode.code}</span>
                          <span className="text-[10px] text-deep-navy/60 uppercase">Unlocked</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    wheelSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-aqua-teal hover:text-deep-navy transition-colors cursor-pointer"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5" />
                  <span>Scroll to Spin Wheel</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetMobile}
                  className="inline-flex items-center gap-1 text-xs text-deep-navy/60 hover:text-deep-navy font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Change number</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 2: SPIN WHEEL
            - Replaced Lucky Spin Wheel with 'PlyAqua spin wheel'
            - Description at Spin removed
            - Decreased size of 'You won' banner
        ========================================================================= */}
        <section
          ref={wheelSectionRef}
          className="bg-pure-white rounded-2xl sm:rounded-3xl border-2 border-pale-blue-gray p-4 sm:p-6 shadow-xs flex flex-col items-center text-center relative overflow-hidden transition-all duration-300"
        >
          {/* Section Header: Description removed, Heading renamed */}
          <div className="w-full flex items-center justify-between mb-3">
            <div className="text-left">
              <h2 className="text-base sm:text-lg font-black text-deep-navy">
                PlyAqua spin wheel
              </h2>
            </div>

            {isVerified && customer && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-soft-aqua border border-aqua-teal/30 rounded-full">
                <Coins className="w-3.5 h-3.5 text-aqua-teal" />
                <span className="text-xs font-black text-deep-navy">
                  {customer.available_points ?? 0} pts
                </span>
              </div>
            )}
          </div>

          {/* Spin Wheel Wrapper with conditional blur effect */}
          <div className="relative w-full flex flex-col items-center justify-center py-2 sm:py-3">
            
            {/* The Blur Effect Overlay when mobile is not yet entered */}
            {!isVerified && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-pure-white/50 backdrop-blur-[2px] rounded-2xl p-4 select-none transition-all duration-300">
                <div className="p-4 rounded-xl bg-pure-white border-2 border-pale-blue-gray shadow-md max-w-xs text-center animate-in fade-in duration-200">
                  <div className="w-10 h-10 mx-auto rounded-full bg-soft-aqua flex items-center justify-center mb-2">
                    <Lock className="w-5 h-5 text-aqua-teal" />
                  </div>
                  <h3 className="text-sm font-black text-deep-navy leading-snug">
                    Spin Wheel is Locked
                  </h3>
                  <p className="text-xs text-deep-navy/70 mt-1 mb-3">
                    Enter mobile number above to unlock and play!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-aqua-teal hover:bg-deep-navy text-pure-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Enter Mobile Number &uarr;
                  </button>
                </div>
              </div>
            )}

            {/* Wheel Container */}
            <div
              className={`relative max-w-[300px] sm:max-w-[340px] flex flex-col items-center justify-center transition-all duration-300 ${
                !isVerified ? 'filter blur-[2.5px] opacity-75' : 'filter-none opacity-100'
              }`}
            >
              {/* Golden Pointer Indicator (at 12 o'clock) */}
              <div className="absolute top-0 z-20 flex flex-col items-center filter drop-shadow-md pointer-events-none">
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-sunburst-yellow relative">
                  <div className="absolute -top-[23px] -left-[6px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[14px] border-t-pure-white" />
                </div>
              </div>

              {/* Wheel Outer Rim Border */}
              <div className="relative p-2 rounded-full bg-soft-aqua border-3 border-deep-navy shadow-lg">
                <svg
                  viewBox="0 0 320 320"
                  className="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full select-none"
                  style={{
                    transform: `rotate(${rotationDegree}deg)`,
                    transition: isSpinning
                      ? 'transform 4000ms cubic-bezier(0.12, 0.85, 0.2, 1)'
                      : 'none',
                  }}
                >
                  {renderWheelSlices()}

                  {/* Inner Ring */}
                  <circle
                    cx="160"
                    cy="160"
                    r="40"
                    fill="#0B253A"
                    stroke="#FFD166"
                    strokeWidth="4"
                  />

                  {/* Center Hub */}
                  <circle
                    cx="160"
                    cy="160"
                    r="24"
                    fill="#12B8B0"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />

                  {/* Center Emoji */}
                  <text
                    x="160"
                    y="166"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="18"
                    className="select-none pointer-events-none"
                  >
                    💧
                  </text>
                </svg>

                {/* Center Spin Button */}
                <button
                  type="button"
                  onClick={handleSpinClick}
                  disabled={!isVerified || isSpinning || hasSpunInSession}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full z-10 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform disabled:cursor-not-allowed disabled:opacity-70"
                  aria-label="Spin Center Hub"
                >
                  <span className="text-[9px] font-black uppercase tracking-wider text-pure-white mt-3.5 drop-shadow">
                    {hasSpunInSession ? 'DONE' : 'SPIN'}
                  </span>
                </button>
              </div>

              {/* Status Info */}
              <div className="mt-3 mb-1.5 h-5 flex items-center justify-center">
                {isSpinning ? (
                  <div className="flex items-center gap-1.5 text-aqua-teal font-bold text-xs animate-pulse">
                    <RotateCw className="w-3.5 h-3.5 animate-spin text-aqua-teal" />
                    <span>Spinning for 4 seconds...</span>
                  </div>
                ) : hasSpunInSession ? (
                  <p className="text-xs text-aqua-teal font-bold">
                    ✓ Spin completed for this session! Complete the challenge below.
                  </p>
                ) : isVerified ? (
                  <p className="text-xs text-deep-navy/70">
                    Tap the button below to start your spin! (1 spin per session)
                  </p>
                ) : (
                  <p className="text-xs text-deep-navy/40">
                    Unlock with mobile number above to play
                  </p>
                )}
              </div>

              {/* Main Spin CTA Button */}
              <button
                type="button"
                onClick={handleSpinClick}
                disabled={
                  !isVerified ||
                  isSpinning ||
                  hasSpunInSession ||
                  (rewardMode === 'cash'
                    ? !validPlaycode || cashSlots.length === 0
                    : slots.length === 0)
                }
                className="w-full py-3 px-5 mt-1 rounded-xl bg-aqua-teal hover:bg-deep-navy text-pure-white font-black text-sm sm:text-base tracking-wider uppercase shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-pure-white" />
                <span>
                  {isSpinning
                    ? 'SPINNING...'
                    : hasSpunInSession
                    ? 'SPIN COMPLETED (1 PER SESSION)'
                    : rewardMode === 'cash' && !validPlaycode
                    ? 'VERIFY PLAY CODE TO SPIN'
                    : 'SPIN TO WIN! 🎯'}
                </span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              ON-SCREEN POINTS OR CASH WON BANNER (DECREASED SIZE)
          ========================================================================= */}
          {((winningSlot && spinWonPoints !== null) || (winningCashSlot && spinWonCash !== null)) && !isSpinning && (
            <div className="w-full mt-4 p-3.5 sm:p-4 rounded-xl bg-soft-aqua border-2 border-aqua-teal animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-center gap-2.5">
                <span className="text-2xl animate-bounce">
                  {rewardMode === 'cash' ? winningCashSlot?.emoji : winningSlot?.emoji}
                </span>
                <div className="text-left">
                  <div className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-aqua-teal text-pure-white text-[9px] font-black tracking-widest uppercase">
                    {rewardMode === 'cash' ? 'CASHBACK WINNER' : 'SPIN WINNER'}
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-deep-navy leading-tight mt-0.5">
                    {rewardMode === 'cash' ? (
                      <>You won <span className="text-aqua-teal">₹{spinWonCash} Cashback</span>!</>
                    ) : (
                      <>You won <span className="text-aqua-teal">+{spinWonPoints} Points</span>!</>
                    )}
                  </h3>
                  <p className="text-[11px] font-medium text-deep-navy/75 mt-0.5">
                    {rewardMode === 'cash'
                      ? 'Watch the video and guess the word below to claim your cashback to UPI!'
                      : 'Watch the video and guess the word below to claim your points!'}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-pale-blue-gray flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    challengeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-deep-navy hover:text-aqua-teal transition-colors uppercase tracking-wider"
                >
                  <span>Go to Word Challenge</span>
                  <ArrowDownCircle className="w-3.5 h-3.5 text-aqua-teal animate-bounce" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 3: BELOW SPIN WHEEL: VIDEO & WORD GUESSING CHALLENGE
            RULE: "and then below the spin wheel play a small 10 secs(just 200kb size video)
            video and below write guess the word to get points. ask them a word to guess
            (randomly select from the game_words table and display the hints(one after one)
            for that word). If video stops. Just stop the video. and allow user to give upto
            3 wrong chances(alphabet placement at index). After completing the word.
            No matter they guess or no. Just show there result. then Add points to customers
            table which they won in the spin wheel. then again do a blast and show won points
            & total points"
        {/* =========================================================================
            SECTION 3: BELOW SPIN WHEEL: VIDEO & WORD GUESSING CHALLENGE
            - Mobile responsive and compact
            - Video ratio strictly 3:2
            - Hints move one after one with decreased font size & padding
            - Alphabets input only, NO numbers
            - Small and responsive result card
        ========================================================================= */}
        {((winningSlot && spinWonPoints !== null) || (winningCashSlot && spinWonCash !== null)) && (
          <section
            ref={challengeSectionRef}
            className="bg-pure-white rounded-2xl sm:rounded-3xl border-2 border-pale-blue-gray p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5 transition-all duration-300"
          >
            {/* Header: Guess the word to get points or cashback */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-soft-aqua text-aqua-teal text-[10px] sm:text-xs font-black uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" />
                <span>
                  {rewardMode === 'cash'
                    ? `Claim Your ₹${spinWonCash} Cashback`
                    : `Claim Your ${spinWonPoints} Points`}
                </span>
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-black text-deep-navy tracking-tight">
                {rewardMode === 'cash' ? 'Guess the Word to Get Cashback' : 'Guess the Word to Get Points'}
              </h2>
              <p className="text-xs text-deep-navy/70 max-w-sm mx-auto">
                Watch the video clip below and use clues to complete the word. You have up to 3 wrong chances!
              </p>
            </div>

            {/* Mobile-First 3:2 Video Player */}
            <div className="relative w-full max-w-xs sm:max-w-sm mx-auto overflow-hidden rounded-xl border-2 border-pale-blue-gray bg-deep-navy shadow-xs">
              <video
                ref={videoRef}
                src="/gameplay_ad.mp4"
                playsInline
                muted={isVideoMuted}
                onTimeUpdate={(e) => {
                  const target = e.currentTarget;
                  if (target.duration) {
                    setVideoProgress((target.currentTime / target.duration) * 100);
                  }
                }}
                onEnded={handleVideoEnded}
                className="w-full aspect-[3/2] object-cover block"
              />

              {/* Progress Bar */}
              <div className="w-full h-1 bg-deep-navy/80 relative">
                <div
                  className="h-full bg-aqua-teal transition-all duration-100"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* Video Controls Bar */}
              <div className="px-2.5 py-1.5 bg-deep-navy flex items-center justify-between text-pure-white">
                <button
                  type="button"
                  onClick={toggleVideoPlayback}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-soft-aqua/20 hover:bg-soft-aqua/30 text-pure-white text-[11px] font-bold transition-colors cursor-pointer"
                  aria-label={isVideoPlaying ? 'Pause Video' : 'Play Video'}
                >
                  {isVideoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isVideoPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-pure-white/70">10s Ad</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isVideoMuted;
                        setIsVideoMuted(!isVideoMuted);
                      }
                    }}
                    className="p-1 rounded text-pure-white/80 hover:text-pure-white transition-colors cursor-pointer"
                    aria-label="Toggle Mute"
                  >
                    {isVideoMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
                  
                    {canSkipGuess && gameStage === 'CHALLENGE_ACTIVE' && (
  <div className="flex justify-center pt-3">
    <button
      type="button"
      onClick={() => {
        setWrongChancesLeft(0);
        handleFinishWordPuzzle(false);
      }}
      className="px-5 py-2.5 rounded-xl border-2 border-vibrant-coral
        text-vibrant-coral bg-white hover:bg-vibrant-coral
        hover:text-white font-bold text-sm transition-all
        active:scale-95"
    >
      Can't Guess? Skip Challenge
    </button>
  </div>
)}

            {/* Word Puzzle Game Interface */}
            {puzzle && (
              <div className="space-y-3 pt-1">
                {/* Hidden native input for mobile device keyboard support */}
                <input
                  ref={nativeInputRef}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  className="sr-only"
                  aria-label="Enter letter"
                  autoCapitalize="characters"
                  onChange={(e) => {
                    const val = e.target.value.trim().slice(-1);
                    if (val) handleInputLetter(val);
                    e.target.value = '';
                  }}
                />

                {/* 1. Hints in Single Line with Chances Left: "Write the Hint: Just write in single line and one after on hint displays and after put chances left." */}
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 py-1.5 px-3 rounded-lg bg-soft-aqua/70 border border-aqua-teal/20 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-aqua-teal shrink-0">Hint:</span>
                    <span className="truncate italic text-deep-navy font-medium">
                      &ldquo;{puzzle.hints[activeHintIndex] || 'Pure wellness and natural hydration.'}&rdquo;
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-deep-navy/80 shrink-0">
                    Chances left: <span className="font-black text-vibrant-coral">{wrongChancesLeft}</span>
                  </div>
                </div>

                {/* 2. Word Letter Slots (NO numbers inside empty slots) */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 transition-transform ${
                      slotShakeError ? 'animate-bounce text-vibrant-coral' : ''
                    }`}
                  >
                    {puzzle.word.split('').map((letter, idx) => {
                      const isGuessed = Boolean(guessedSlots[idx]);
                      const isSelected = selectedSlotIndex === idx && gameStage === 'CHALLENGE_ACTIVE';

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (gameStage === 'CHALLENGE_ACTIVE' && !isGuessed) {
                              setSelectedSlotIndex(idx);
                              nativeInputRef.current?.focus();
                            }
                          }}
                          disabled={gameStage !== 'CHALLENGE_ACTIVE' || isGuessed}
                          className={`w-9 h-11 sm:w-11 sm:h-12 rounded-lg sm:rounded-xl border-2 flex flex-col items-center justify-center text-lg sm:text-xl font-black font-mono transition-all cursor-pointer ${
                            isGuessed
                              ? 'bg-soft-aqua border-aqua-teal text-aqua-teal shadow-xs'
                              : isSelected
                              ? 'bg-pure-white border-deep-navy ring-2 ring-aqua-teal/30 text-deep-navy scale-105'
                              : 'bg-pale-blue-gray/50 border-pale-blue-gray text-deep-navy/40 hover:border-aqua-teal/50'
                          }`}
                        >
                          {isGuessed ? (
                            guessedSlots[idx]
                          ) : gameStage === 'COMPLETED' ? (
                            <span className="text-vibrant-coral">{letter}</span>
                          ) : (
                            <span className="w-2 sm:w-2.5 h-0.5 bg-deep-navy/20 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {gameStage === 'CHALLENGE_ACTIVE' && (
                    <p className="text-[11px] font-semibold text-deep-navy/60 text-center">
                      Tap a slot and type to fill the word
                    </p>
                  )}
                </div>

                {/* 3. Result Card: Small and Responsive on all screen sizes */}
                {gameStage === 'COMPLETED' && customer && (
                  <div className="p-3 sm:p-4 rounded-xl bg-soft-aqua border border-aqua-teal/40 text-center space-y-2 animate-in zoom-in-95 duration-200 max-w-sm mx-auto">
                    <div className="w-8 h-8 mx-auto rounded-lg bg-pure-white border border-aqua-teal flex items-center justify-center shadow-xs">
                      {wordGuessedCorrectly ? (
                        <Check className="w-4 h-4 text-emerald-mint stroke-[3]" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-vibrant-coral" />
                      )}
                    </div>

                    <div>
                      <div className="inline-block px-2 py-0.5 rounded-full bg-aqua-teal text-pure-white text-[9px] font-black tracking-widest uppercase mb-1">
                        {wordGuessedCorrectly ? 'CHALLENGE COMPLETE' : 'CHANCES COMPLETED'}
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-deep-navy leading-tight">
                        {wordGuessedCorrectly
                          ? '🎉 Word Guessed Correctly!'
                          : 'Better luck next time!'}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-deep-navy/70 mt-0.5">
                        The secret word was <span className="font-black text-deep-navy underline decoration-aqua-teal">{puzzle.word}</span>.
                      </p>
                    </div>

                    {/* Reward Details: Points or Cashback */}
                    {rewardMode === 'cash' ? (
                      <div className="space-y-2 py-0.5">
                        {/* Won Cash & Playcode Display */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-pure-white p-2 rounded-lg border border-pale-blue-gray">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-deep-navy/60 block">
                              Cash Won
                            </span>
                            <span className="text-base sm:text-lg font-black text-aqua-teal block">
                              ₹{spinWonCash}
                            </span>
                          </div>

                          <div className="bg-pure-white p-2 rounded-lg border border-pale-blue-gray">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-deep-navy/60 block">
                              Play Code
                            </span>
                            <span className="text-base sm:text-lg font-mono font-bold text-deep-navy block truncate">
                              {validPlaycode?.code || '—'}
                            </span>
                          </div>
                        </div>

                        {/* UPI ID Form for Cash Payout */}
                        {!cashbackClaimed ? (
                          <div className="bg-pure-white p-2.5 rounded-lg border border-pale-blue-gray text-left space-y-1.5">
                            <label className="text-[10px] font-bold text-deep-navy block uppercase tracking-wider">
                              Enter UPI ID to Claim ₹{spinWonCash}
                            </label>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={upiIdInput}
                                onChange={(e) => {
                                  setUpiIdInput(e.target.value);
                                  setCashbackError('');
                                }}
                                placeholder="e.g. mobile@upi or name@bank"
                                className="flex-1 px-2.5 py-1.5 bg-pure-white border-2 border-pale-blue-gray rounded-lg text-deep-navy text-xs font-semibold focus:border-aqua-teal focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={handleSubmitCashback}
                                disabled={cashbackSubmitting || !upiIdInput.trim()}
                                className="px-3 py-1.5 bg-aqua-teal hover:bg-deep-navy text-pure-white text-xs font-bold rounded-lg shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                              >
                                {cashbackSubmitting ? 'Saving...' : 'Claim'}
                              </button>
                            </div>
                            {cashbackError && (
                              <p className="text-[10px] font-semibold text-vibrant-coral">{cashbackError}</p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-pure-white p-2.5 rounded-lg border border-aqua-teal/40 text-center space-y-1">
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-aqua-teal">
                              <CheckCircle2 className="w-4 h-4 text-emerald-mint" />
                              <span>Cashback Recorded!</span>
                            </div>
                            <p className="text-[11px] text-deep-navy/70">
                              ₹{spinWonCash} payout queued for <span className="font-bold text-deep-navy font-mono">{upiIdInput}</span>.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Won Points & Total Points Display */
                      <div className="grid grid-cols-2 gap-2 py-0.5">
                        <div className="bg-pure-white p-2 rounded-lg border border-pale-blue-gray">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-deep-navy/60 block">
                            Points Won
                          </span>
                          <span className="text-base sm:text-lg font-black text-aqua-teal block">
                            +{spinWonPoints} Pts
                          </span>
                        </div>

                        <div className="bg-pure-white p-2 rounded-lg border border-pale-blue-gray">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-deep-navy/60 block">
                            Total Points
                          </span>
                          <span className="text-base sm:text-lg font-black text-deep-navy block">
                            {customer.available_points ?? 0} Pts
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Navigation: One session only one spin. No re-spin. */}
                    <div className="pt-1 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Link
                          href="/profile"
                          className="flex-1 py-2 px-3 rounded-lg bg-aqua-teal hover:bg-deep-navy text-pure-white font-black text-xs uppercase tracking-wider shadow-xs active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleResetMobile}
                          className="py-2 px-3 rounded-lg border border-pale-blue-gray bg-pure-white text-deep-navy text-xs font-bold hover:bg-pale-blue-gray/50 transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>New Session</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-deep-navy/60 font-medium text-center">
                        ✓ 1 spin allowed per session. Start a new session or check your profile.
                      </p>
                    </div>

                  </div>
                )}

              </div>
            )}
          </section>
        )}

      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
