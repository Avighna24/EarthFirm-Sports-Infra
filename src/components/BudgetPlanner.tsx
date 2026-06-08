/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  FileText 
} from 'lucide-react';
import { SPORT_PRESETS, SURFACE_MATERIALS, SUB_BASES } from '../constants';
import { SportType, SurfaceMaterialType, SubbaseType } from '../types';
import { saveDocument } from '../firebase';

// Import high-fidelity visual assets generated according to user specification
import squashCourtImg from '../assets/images/squash_court_1780661148365.png';
import boxCricketImg from '../assets/images/box_cricket_1780661166756.png';
import footballTurfImg from '../assets/images/football_turf_1780661183867.png';
import pickleballArenaImg from '../assets/images/pickleball_arena_stadium_1780662080721.png';
import basketballCourtImg from '../assets/images/basketball_court_premium_1780724785961.png';
import multipurposeCollageImg from '../assets/images/multipurpose_collage_1780662230085.png';

interface BudgetPlannerProps {
  onBackToMain: () => void;
  language: 'en' | 'hi';
}

const STEP_IMAGES = {
  0: {
    url: multipurposeCollageImg,
    alt: "Tennis Court Synthetic Construction blueprint design"
  },
  1: {
    url: multipurposeCollageImg,
    alt: "Sport category selection surface"
  },
  2: {
    url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
    alt: "Playground physical dimensions configuration track and boundaries"
  },
  3: {
    url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
    alt: "Precision subbase and upper synthetic overlay flooring"
  },
  4: {
    url: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=800&auto=format&fit=crop",
    alt: "Soil cores mobilization design contact and regional freight setup"
  },
  5: {
    url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    alt: "Final calculated contract estimation sheets"
  }
};

const SPORT_BACKGROUNDS: Record<SportType, string> = {
  BASKETBALL: basketballCourtImg,
  TENNIS: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=1600&auto=format&fit=crop",
  PICKLEBALL: pickleballArenaImg,
  FOOTBALL: footballTurfImg,
  TRACK_FIELD: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop",
  GYM: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop",
  CRICKET: boxCricketImg,
  BADMINTON: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1600&auto=format&fit=crop",
  SWIMMING_POOL: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1600&auto=format&fit=crop",
  SQUASH: squashCourtImg,
  VOLLEYBALL: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=1600&auto=format&fit=crop"
};

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ onBackToMain, language }) => {
  // Wizard flow state
  // 0: Intro (Requested HTML mockup), 1: Sport, 2: Dimensions, 3: Surface + Subbase, 4: Contact, 5: Result Report
  const [step, setStep] = useState<number>(0);

  // User input states
  const [sportType, setSportType] = useState<SportType | null>(null);
  const [length, setLength] = useState<number>(94);
  const [width, setWidth] = useState<number>(50);
  const [visualLength, setVisualLength] = useState<number>(94);
  const [visualWidth, setVisualWidth] = useState<number>(50);
  const [poolDepth, setPoolDepth] = useState<number>(6);
  const [visualPoolDepth, setVisualPoolDepth] = useState<number>(6);
  const [surfaceMaterial, setSurfaceMaterial] = useState<SurfaceMaterialType>('CANADIAN_MAPLE');
  const [subbase, setSubbase] = useState<SubbaseType>('POST_TENSION_CONCRETE');
  const [budgetTier, setBudgetTier] = useState<'Standard' | 'Premium' | 'Luxury Elite'>('Premium');
  
  // Client contact states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [timeline, setTimeline] = useState('Immediate (Next 30 days)');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCode, setSubmissionCode] = useState('');
  const [validationError, setValidationError] = useState('');

  // Debounce visual input changes to heavier calculations (80ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (visualLength !== length) setLength(visualLength);
    }, 80);
    return () => clearTimeout(timer);
  }, [visualLength, length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visualWidth !== width) setWidth(visualWidth);
    }, 80);
    return () => clearTimeout(timer);
  }, [visualWidth, width]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visualPoolDepth !== poolDepth) setPoolDepth(visualPoolDepth);
    }, 80);
    return () => clearTimeout(timer);
  }, [visualPoolDepth, poolDepth]);

  // Handle sport preset changes to update default dimensions
  const handleSportSelect = (sport: SportType) => {
    setSportType(sport);
    const preset = SPORT_PRESETS[sport];
    if (preset) {
      setLength(preset.defaultDimensions.length);
      setVisualLength(preset.defaultDimensions.length);
      setWidth(preset.defaultDimensions.width);
      setVisualWidth(preset.defaultDimensions.width);
      
      // Smartly adjust default materials for outdoor/indoor sports
      if (sport === 'FOOTBALL') {
        setSurfaceMaterial('COMPOSITE_TURF');
        setSubbase('FOOTBALL_DRAINAGE_AGGREGATE');
      } else if (sport === 'CRICKET') {
        setSurfaceMaterial('COMPOSITE_TURF');
        setSubbase('CRICKET_COMPACT_STONE');
      } else if (sport === 'SWIMMING_POOL') {
        setSurfaceMaterial('MOSAIC_CLASSIC');
        setSubbase('POOL_SHOTCRETE_SHELL');
      } else if (sport === 'SQUASH') {
        setSurfaceMaterial('CANADIAN_MAPLE');
        setSubbase('SQUASH_DOUBLE_BATTEN');
      } else if (sport === 'GYM') {
        setSurfaceMaterial('CANADIAN_MAPLE');
        setSubbase('GYM_ACOUSTIC_SLAB');
      } else if (sport === 'TENNIS' || sport === 'PICKLEBALL') {
        setSurfaceMaterial('PRO_ACRYLIC');
        setSubbase('POST_TENSION_CONCRETE');
      } else if (sport === 'BASKETBALL' || sport === 'BADMINTON' || sport === 'VOLLEYBALL') {
        setSurfaceMaterial('CANADIAN_MAPLE');
        setSubbase('POST_TENSION_CONCRETE');
      } else {
        setSurfaceMaterial('PRO_ACRYLIC');
        setSubbase('POST_TENSION_CONCRETE');
      }
    }
  };

  // Precalculated metrics
  const areaSqFt = length * width;
  const poolDepthMultiplier = sportType === 'SWIMMING_POOL' ? Math.max(1, poolDepth / 6.0) : 1.0;
  const sportPreset = sportType ? SPORT_PRESETS[sportType] : SPORT_PRESETS['BASKETBALL'];
  const materialPreset = SURFACE_MATERIALS[surfaceMaterial];
  const subbasePreset = SUB_BASES[subbase];

  // Dynamically calculate interactive sports infrastructure budget
  const baseCost = areaSqFt * (sportPreset?.basePricePerSqFt || 300) * poolDepthMultiplier;
  const surfaceCost = areaSqFt * (materialPreset?.costPerSqFt || 600) * (sportType === 'SWIMMING_POOL' ? Math.max(1, (poolDepth / 6.0) * 0.7) : 1.0);
  const subbaseCost = areaSqFt * (subbasePreset?.costPerSqFt || 500) * poolDepthMultiplier;
  const engineeringSetup = 45000 + areaSqFt * 1.5 * poolDepthMultiplier;
  const transportationDispatch = 25000 + (location ? 15000 : 0);
  const markingCivilWork = 12500 + areaSqFt * 0.9;
  
  // Apply budgettier modifiers for aesthetic markup
  const budgetMultiplier = budgetTier === 'Standard' ? 0.9 : budgetTier === 'Luxury Elite' ? 1.25 : 1.0;
  
  const rawTotal = (baseCost * 0.15 + surfaceCost + subbaseCost + engineeringSetup + transportationDispatch + markingCivilWork) * budgetMultiplier;
  const projectTotal = Math.round(rawTotal);
  const minCostRange = Math.round(projectTotal * 0.95);
  const maxCostRange = Math.round(projectTotal * 1.05);

  const handleSubmitPlanning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sportType) {
      setValidationError('Please select a sport facility type first.');
      return;
    }
    if (!fullName || !email || !location) {
      setValidationError(language === 'hi' ? 'कृपया आवश्यक संपर्क फ़ील्ड भरें।' : 'Please fill in the required contact fields to view your expert plan.');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);

    const code = `EF-PLAN-${sportType.substring(0, 3)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setSubmissionCode(code);

    try {
      await saveDocument('budget_rfps', code, {
        sportType: sportType,
        length: Number(length),
        width: Number(width),
        surfaceMaterial: surfaceMaterial,
        subbase: subbase,
        budgetTier: budgetTier,
        fullName: fullName,
        email: email,
        phone: phone || null,
        location: location,
        timeline: timeline,
        projectTotalCost: Number(projectTotal),
        submissionCode: code
      });
    } catch (err) {
      console.error('Error saving budget plan to Firestore:', err);
    } finally {
      setIsSubmitting(false);
      setStep(5);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentStepImage = STEP_IMAGES[step as keyof typeof STEP_IMAGES] || STEP_IMAGES[0];
  const bgImageUrl = (step === 0 || !sportType) ? multipurposeCollageImg : (SPORT_BACKGROUNDS[sportType] || multipurposeCollageImg);

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white relative overflow-x-hidden font-sans select-none min-h-screen flex flex-col" data-testid="budget-planning-page">
      
      {/* Immersive Cross-Fading Dynamic Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={bgImageUrl}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.75, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImageUrl})` }}
          />
        </AnimatePresence>
        {/* Soft, premium dark filter overlay to allow the background image to shine while maintaining high text readibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.7)_100%)]" />
      </div>

      {/* Content Wrapper centered inside a high-end glass cabinet card */}
      <div className="relative z-10 flex-grow flex items-center justify-center max-w-4xl mx-auto w-full px-4 sm:px-6 pt-12 pb-36">
        <div className="w-full bg-[#0E0E0E]/75 backdrop-blur-2xl border border-white/5 p-6 sm:p-10 rounded-3xl shadow-2xl shadow-black/90 space-y-6">
          
          {/* Nav Back Header block */}
          <div className="flex justify-start">
            <button
              onClick={onBackToMain}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition cursor-pointer bg-white/5 border border-white/5 hover:border-white/20 px-4 py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="w-full text-left space-y-6 progress-card-container animate-fade-in" 
                data-testid="intro-screen"
              >
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-400 font-bold block">PLANNING MODULE</span>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none" data-testid="intro-headline">
                  {language === 'hi' ? <>स्पोर्ट्स इन्फ्रास्ट्रक्चर<br />की योजनाएं</> : <>Plan Your Sports<br />Infrastructure</>}
                </h1>
                
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
                  {language === 'hi' 
                    ? 'अपने प्रोजेक्ट स्थान, आकार और खेल आवश्यकताओं के आधार पर विश्व-स्तरीय खेल परिसरों के बजट की तुरंत और उच्च-परिशुद्धता गणना करें।' 
                    : 'Calculate robust high-precision budgets, required aggregate civil stabilizers, and surface coating requirements customized for your target sports project.'}
                </p>

                <button 
                  onClick={() => setStep(1)}
                  className="bg-white text-black font-bold hover:bg-neutral-250 transition-colors px-8 py-4 text-xs font-mono tracking-widest uppercase flex items-center gap-3 cursor-pointer" 
                  data-testid="start-planning-button"
                >
                  {language === 'hi' ? 'योजना शुरू करें' : 'Start Planning'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full space-y-6 flex flex-col justify-center"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-400 font-bold block">STEP 01 OF 04</span>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">Select Target Sport Platform</h2>
                  <p className="text-xs text-neutral-400">Each sport requires specialized elastic subfloors, paint line configurations, and load calculations.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div className="lg:col-span-7 grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 customize-scrollbar">
                    {Object.keys(SPORT_PRESETS).map((key) => {
                      const s = SPORT_PRESETS[key];
                      const active = sportType === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleSportSelect(s.id as SportType)}
                          className={`p-4 border text-left flex flex-col justify-between h-32 transition-all cursor-pointer rounded-xl ${
                            active 
                              ? 'bg-white text-black border-white shadow-xl shadow-white/5' 
                              : 'bg-zinc-900/40 border-white/5 hover:bg-zinc-900/80 text-white'
                          }`}
                        >
                          <span className="text-[8px] font-mono uppercase tracking-wider opacity-60">CODE: {s.id.slice(0,3)}</span>
                          <div>
                            <h3 className="font-extrabold text-sm uppercase leading-none mb-1">{s.name}</h3>
                            <p className={`text-[10px] leading-tight line-clamp-1 ${active ? 'text-neutral-700' : 'text-neutral-400'}`}>
                              {s.tagline}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sport Specific Live Media Showcase */}
                  <div className="lg:col-span-5">
                    {sportType && sportPreset ? (
                      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-lg h-full flex flex-col justify-between">
                        <div className="relative h-44 w-full overflow-hidden">
                          <img 
                            src={SPORT_BACKGROUNDS[sportType]} 
                            alt={sportPreset.name} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent z-1" />
                          <span className="absolute bottom-3 left-3 bg-red-500 text-white font-mono text-[9px] px-2.5 py-1 tracking-wider uppercase font-bold rounded-lg z-2">
                            EST. ₹{sportPreset.basePricePerSqFt}/sqft
                          </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#0E0E0E]/90">
                          <div>
                            <h4 className="text-base font-black uppercase text-white tracking-tight">{sportPreset.name}</h4>
                            <p className="text-[11px] text-emerald-400 font-mono tracking-wide leading-snug">{sportPreset.tagline}</p>
                            <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed font-light line-clamp-3">{sportPreset.description}</p>
                          </div>
                          <div className="border-t border-white/5 pt-3 flex flex-col gap-1 text-[9px] text-neutral-400 font-mono">
                            <div className="flex justify-between">
                              <span>MIN CONSTRAINTS:</span>
                              <span className="text-white">{sportPreset.minDimensions.length}&apos; &times; {sportPreset.minDimensions.width}&apos;</span>
                            </div>
                            <div className="flex justify-between">
                              <span>STANDARD DEFAULTS:</span>
                              <span className="text-white">{sportPreset.defaultDimensions.length}&apos; &times; {sportPreset.defaultDimensions.width}&apos;</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-lg h-full flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                         <FileText className="w-8 h-8 mb-4 opacity-50" />
                         <p className="text-xs font-mono uppercase tracking-widest leading-relaxed">
                           PLEASE SELECT A<br/>SPORT MODULE TO VIEW DETAILS
                         </p>
                      </div>
                    )}
                  </div>
                </div>

                {validationError && (
                  <div className="mt-4 p-3 bg-red-950/40 border border-red-500/20 text-red-300 text-xs rounded-xl font-mono text-center">
                    {validationError}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => sportType ? (setValidationError(''), setStep(2)) : setValidationError('Please select a sport facility type first.')}
                    className={`px-6 py-3 uppercase tracking-wider font-bold text-xs flex items-center gap-2 transition cursor-pointer ${sportType ? 'bg-white text-black hover:bg-neutral-200' : 'bg-white/20 text-white/50 cursor-not-allowed'}`}
                  >
                    Configure Dimensions
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full space-y-6 flex flex-col justify-center"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-400 font-bold block">STEP 02 OF 04</span>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">Establish Playground Scale</h2>
                  <p className="text-xs text-neutral-400">Specify physical dimensions. Larger areas require heavy civil compaction grids.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div className="lg:col-span-7 bg-zinc-900/45 border border-white/5 p-6 space-y-6 rounded-2xl flex flex-col justify-between">
                    
                    {/* Physical Preset buttons */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono uppercase text-zinc-400 block tracking-wider">Quick Dimension Presets</span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            setLength(Math.round(sportPreset.minDimensions.length));
                            setVisualLength(Math.round(sportPreset.minDimensions.length));
                            setWidth(Math.round(sportPreset.minDimensions.width));
                            setVisualWidth(Math.round(sportPreset.minDimensions.width));
                          }}
                          className="p-3 bg-neutral-900 text-[10px] font-bold font-mono tracking-wider uppercase border border-white/5 hover:bg-neutral-800 cursor-pointer rounded-lg"
                        >
                          Min Compact
                        </button>
                        <button
                          onClick={() => {
                            setLength(Math.round(sportPreset.defaultDimensions.length));
                            setVisualLength(Math.round(sportPreset.defaultDimensions.length));
                            setWidth(Math.round(sportPreset.defaultDimensions.width));
                            setVisualWidth(Math.round(sportPreset.defaultDimensions.width));
                          }}
                          className="p-3 bg-white text-black text-[10px] font-bold font-mono tracking-wider uppercase cursor-pointer rounded-lg"
                        >
                          Official Std
                        </button>
                        <button
                          onClick={() => {
                            setLength(Math.round(sportPreset.maxDimensions.length));
                            setVisualLength(Math.round(sportPreset.maxDimensions.length));
                            setWidth(Math.round(sportPreset.maxDimensions.width));
                            setVisualWidth(Math.round(sportPreset.maxDimensions.width));
                          }}
                          className="p-3 bg-neutral-900 text-[10px] font-bold font-mono tracking-wider uppercase border border-white/5 hover:bg-neutral-800 cursor-pointer rounded-lg"
                        >
                          Max Expanded
                        </button>
                      </div>
                    </div>

                    <div className="space-y-5 py-4 border-t border-b border-white/5">
                      {/* Length Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                          <span>LENGTH: <strong className="text-white text-xs">{visualLength} Feet</strong> ({Math.round(visualLength * 0.3048)} m)</span>
                          <span>Range: {sportPreset.minDimensions.length}&apos; - {sportPreset.maxDimensions.length}&apos;</span>
                        </div>
                        <input
                          type="range"
                          min={sportPreset.minDimensions.length}
                          max={sportPreset.maxDimensions.length}
                          value={visualLength}
                          onChange={(e) => setVisualLength(Number(e.target.value))}
                          className="w-full accent-emerald-400 bg-neutral-800 h-1 rounded cursor-col-resize"
                        />
                      </div>

                      {/* Width Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                          <span>WIDTH: <strong className="text-white text-xs">{visualWidth} Feet</strong> ({Math.round(visualWidth * 0.3048)} m)</span>
                          <span>Range: {sportPreset.minDimensions.width}&apos; - {sportPreset.maxDimensions.width}&apos;</span>
                        </div>
                        <input
                          type="range"
                          min={sportPreset.minDimensions.width}
                          max={sportPreset.maxDimensions.width}
                          value={visualWidth}
                          onChange={(e) => setVisualWidth(Number(e.target.value))}
                          className="w-full accent-emerald-400 bg-neutral-800 h-1 rounded cursor-col-resize"
                        />
                      </div>

                      {/* Pool Depth Slider */}
                      {sportType === 'SWIMMING_POOL' && (
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                            <span>DEPTH: <strong className="text-emerald-400 text-xs">{visualPoolDepth} Feet</strong> ({Math.round(visualPoolDepth * 0.3048 * 10) / 10} m)</span>
                            <span>Range: 4&apos; - 12&apos;</span>
                          </div>
                          <input
                            type="range"
                            min={4}
                            max={12}
                            step={1}
                            value={visualPoolDepth}
                            onChange={(e) => setVisualPoolDepth(Number(e.target.value))}
                            className="w-full accent-emerald-400 bg-neutral-800 h-1 rounded cursor-col-resize"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-stone-500 mt-1 uppercase">
                            <span>Kids (4 ft)</span>
                            <span>Olympic (6-8 ft)</span>
                            <span>Dive (12 ft)</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Live Area Snapshot */}
                    <div className="pt-2 flex justify-between items-center text-xs text-neutral-400">
                      <span>Computed {sportType === 'SWIMMING_POOL' ? 'Surface Area' : 'Area'}:</span>
                      <span className="font-mono text-emerald-400 text-base font-bold">{(visualLength * visualWidth).toLocaleString()} Sq. Ft</span>
                    </div>
                    {sportType === 'SWIMMING_POOL' && (
                      <div className="flex justify-between items-center text-xs text-neutral-400">
                        <span>Computed Volume:</span>
                        <span className="font-mono text-emerald-400 text-base font-bold">{(visualLength * visualWidth * visualPoolDepth).toLocaleString()} Cu. Ft</span>
                      </div>
                    )}

                  </div>

                  {/* Sport Specific Sizing Preview Card */}
                  <div className="lg:col-span-5">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-lg h-full flex flex-col justify-between">
                      <div className="relative h-32 w-full overflow-hidden">
                        <img 
                          src={sportType ? SPORT_BACKGROUNDS[sportType] : multipurposeCollageImg} 
                          alt={sportPreset.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent z-1" />
                        <span className="absolute bottom-3 left-3 bg-emerald-500 text-white font-mono text-[9px] px-2.5 py-1 tracking-wider uppercase font-bold rounded-lg z-2">
                          {(visualLength * visualWidth).toLocaleString()} SQ. FT {sportType === 'SWIMMING_POOL' && `/ ${(visualLength * visualWidth * visualPoolDepth).toLocaleString()} CU. FT`}
                        </span>
                      </div>
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4 bg-[#0E0E0E]/90">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-red-400 font-bold block">Live Scale Geometry</span>
                          <h4 className="text-sm font-black uppercase text-white tracking-tight">{sportPreset.name} Layout</h4>
                        </div>
                        
                        {/* Interactive Scale schematic box resembling a mini court */}
                        <div className="bg-black/60 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center relative aspect-video w-full overflow-hidden my-auto">
                          <div 
                            className="border border-emerald-400/40 flex items-center justify-center bg-emerald-400/5 transition-all duration-300 rounded-md"
                            style={{
                              width: `${Math.max(30, Math.min(100, (visualWidth / sportPreset.maxDimensions.width) * 100))}%`,
                              height: `${Math.max(30, Math.min(100, (visualLength / sportPreset.maxDimensions.length) * 100))}%`
                            }}
                          >
                            <div className="text-center font-mono text-[8px] text-emerald-400 font-bold px-1 py-0.5 bg-black/60 rounded">
                              {visualLength}&apos; &times; {visualWidth}&apos;
                            </div>
                          </div>
                          <span className="absolute bottom-1 right-2 font-mono text-[7px] text-zinc-500">MAX LAYOUT BOUNDS</span>
                        </div>
                        
                        <p className="text-[10px] text-zinc-400 font-light leading-snug">
                          Our engineering team scales materials, base-pours, and lane marking layouts accurately based on these exact measurements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-transparent text-white border border-white/10 hover:bg-neutral-900 px-5 py-3 uppercase tracking-wider font-bold text-xs cursor-pointer rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-white text-black hover:bg-neutral-200 px-6 py-3 uppercase tracking-wider font-bold text-xs flex items-center gap-2 transition cursor-pointer rounded-lg"
                  >
                    Surface Setup
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full space-y-6 flex flex-col justify-center"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-400 font-bold block">STEP 03 OF 04</span>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">Surface & Base Substructure</h2>
                  <p className="text-xs text-neutral-400">The combination of subbase load aggregate and upper elastic court defines real life bounce consistency.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Surface Material choice panel */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase tracking-wider font-mono text-zinc-400">01. Upper Elastomer Layer</h3>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 customize-scrollbar">
                      {Object.keys(SURFACE_MATERIALS).filter((key) => {
                        if (sportType === 'SWIMMING_POOL') {
                          return ['MOSAIC_CLASSIC', 'GLASS_BEAD_PLASTER', 'REINFORCED_PVC_LINER'].includes(key);
                        } else if (sportType === 'SQUASH') {
                          return ['CANADIAN_MAPLE', 'ARMOURCOAT_WALLS'].includes(key);
                        } else if (sportType === 'FOOTBALL') {
                          return ['COMPOSITE_TURF'].includes(key);
                        } else if (sportType === 'TRACK_FIELD') {
                          return !['COMPOSITE_TURF', 'CANADIAN_MAPLE', 'MOSAIC_CLASSIC', 'GLASS_BEAD_PLASTER', 'REINFORCED_PVC_LINER', 'ARMOURCOAT_WALLS'].includes(key);
                        } else {
                          return !['COMPOSITE_TURF', 'MOSAIC_CLASSIC', 'GLASS_BEAD_PLASTER', 'REINFORCED_PVC_LINER', 'ARMOURCOAT_WALLS'].includes(key);
                        }
                      }).map((key) => {
                        const m = SURFACE_MATERIALS[key];
                        const active = surfaceMaterial === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setSurfaceMaterial(key as SurfaceMaterialType)}
                            className={`w-full p-3 rounded-xl text-left border flex justify-between items-center transition cursor-pointer ${
                              active ? 'bg-white text-black border-white' : 'bg-zinc-900/40 border-white/5 hover:bg-zinc-900/85 text-white'
                            }`}
                          >
                            <div className="pr-2">
                              <span className="font-extrabold text-xs block uppercase">{m.name}</span>
                              <span className={`text-[9px] font-mono uppercase ${active ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                ₹{m.costPerSqFt}/sqft
                              </span>
                            </div>
                            {active && <CheckCircle2 className="h-4 w-4 text-black shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subbase Foundation material choice panel */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase tracking-wider font-mono text-zinc-400">02. Foundation Subbase Civil Slab</h3>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 customize-scrollbar">
                      {Object.keys(SUB_BASES).filter((key) => {
                        if (sportType === 'FOOTBALL') {
                          return ['FOOTBALL_DRAINAGE_AGGREGATE', 'FOOTBALL_SHOCKPAD_BASE'].includes(key);
                        } else if (sportType === 'CRICKET') {
                          return ['CRICKET_HEAVY_CLAY', 'CRICKET_COMPACT_STONE'].includes(key);
                        } else if (sportType === 'GYM') {
                          return ['GYM_ACOUSTIC_SLAB', 'GYM_RUBBER_DAMPENING'].includes(key);
                        } else if (sportType === 'SWIMMING_POOL') {
                          return ['POOL_SHOTCRETE_SHELL', 'POOL_POURED_CONCRETE'].includes(key);
                        } else if (sportType === 'SQUASH') {
                          return ['SQUASH_DOUBLE_BATTEN', 'SQUASH_SINGLE_ELASTIC'].includes(key);
                        } else {
                          return ['POST_TENSION_CONCRETE', 'ASPHALT', 'COMPACTED_STONE', 'SUSPENDED_DECK'].includes(key);
                        }
                      }).map((key) => {
                        const b = SUB_BASES[key];
                        const active = subbase === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setSubbase(key as SubbaseType)}
                            className={`w-full p-3 rounded-xl text-left border flex justify-between items-center transition cursor-pointer ${
                              active ? 'bg-white text-black border-white' : 'bg-zinc-900/40 border-white/5 hover:bg-zinc-900/85 text-white'
                            }`}
                          >
                            <div className="pr-2">
                              <span className="font-extrabold text-xs block uppercase">{b.name}</span>
                              <span className={`text-[9px] font-mono uppercase ${active ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                ₹{b.costPerSqFt}/sqft
                              </span>
                            </div>
                            {active && <CheckCircle2 className="h-4 w-4 text-black shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Budget tier selector */}
                <div className="bg-zinc-900/30 p-4 border border-white/5 rounded-2xl text-center space-y-2">
                  <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider">03. Project Procurement Budget Class</span>
                  <div className="flex justify-center gap-3">
                    {['Standard', 'Premium', 'Luxury Elite'].map((tier) => {
                      const active = budgetTier === tier;
                      return (
                        <button
                          key={tier}
                          onClick={() => setBudgetTier(tier as any)}
                          className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                            active ? 'bg-white text-black' : 'bg-neutral-900 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-transparent text-white border border-white/10 hover:bg-neutral-900 px-5 py-3 uppercase tracking-wider font-bold text-xs cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="bg-white text-black hover:bg-neutral-200 px-6 py-3 uppercase tracking-wider font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    Contact Info
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full space-y-6 flex flex-col justify-center font-sans"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-400 font-bold block">STEP 04 OF 04</span>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">Civil Mobilization Info</h2>
                  <p className="text-xs text-neutral-400">Our Indore corporate lab uses these variables to calculate site freight configurations.</p>
                </div>

                <form onSubmit={handleSubmitPlanning} className="space-y-4 bg-zinc-900/30 border border-white/5 p-6 rounded-2xl">
                  
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block mb-1 font-bold">Contact Person Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-neutral-900 border border-white/5 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-white text-xs outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block mb-1 font-bold">Inbound Corporate Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ramesh@projectinfra.in"
                        className="w-full bg-neutral-900 border border-white/5 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-white text-xs outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block mb-1 font-bold">WhatsApp Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-neutral-900 border border-white/5 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-white text-xs outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block mb-1 font-bold">State / City *</label>
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Indore, MP"
                          className="w-full bg-neutral-900 border border-white/5 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-white text-xs outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block mb-1 font-bold">Time Window</label>
                      <select
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/5 rounded-xl px-3 py-2.5 text-white text-xs outline-none cursor-pointer"
                      >
                        <option value="Immediate (Next 30 days)">Immediate (30 days)</option>
                        <option value="Standard (Within 3 months)">Standard (3 months)</option>
                        <option value="Conceptual planning phase">Planning Phase</option>
                      </select>
                    </div>

                  </div>

                  {validationError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-red-300 text-xs font-mono text-center">
                      {validationError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition duration-200 cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? "COMPILING SPECIFICATIONS..." : "View Architectural Estimate"}
                  </button>

                </form>

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-transparent text-white border border-white/10 hover:bg-neutral-900 px-5 py-3 uppercase tracking-wider font-bold text-xs cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full space-y-6 print:bg-white print:text-neutral-951"
              >
                
                {/* Header Details */}
                <div className="border border-white/5 p-6 sm:p-8 bg-zinc-900/30 rounded-2xl space-y-6 relative overflow-hidden print:bg-white print:text-black print:border-neutral-300">
                  
                  {/* Print/Corporate Metadata bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 print:border-neutral-200">
                    <div className="space-y-1">
                      <span className="text-red-400 text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold block">EARTHFIRM CIVIL DIRECTIVE</span>
                      <h2 className="text-xl font-serif font-black uppercase tracking-tight text-white print:text-black">Sports Infrastructure Spec</h2>
                    </div>
                    <div className="bg-neutral-900 p-2.5 border border-white/5 rounded-xl text-right print:bg-neutral-100 print:border-neutral-300 print:text-black">
                      <span className="text-[8px] font-mono text-zinc-400 block uppercase">PLAN ASSIGNMENT TOKEN</span>
                      <strong className="text-sm font-mono text-white font-extrabold print:text-black tracking-wide">{submissionCode}</strong>
                    </div>
                  </div>

                  {/* Success Banner */}
                  <div className="p-4 bg-zinc-900 flex gap-3.5 items-start text-xs leading-relaxed text-zinc-300 print:bg-neutral-50 print:border-neutral-300 print:text-neutral-800 border border-white/5 rounded-xl">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 print:text-emerald-700 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5 uppercase print:text-black">Conceptual Planning Registered</span>
                      Dear <strong>{fullName}</strong>, our engineering lab has mapped your specifications for {sportPreset.name} in <strong>{location}</strong>. 
                      An advisor from our Indore unit was notified about your draft token ID: <strong className="text-white print:text-black">{submissionCode}</strong> and will connect in {timeline}.
                    </div>
                  </div>

                  {/* Main Spec grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                    
                    {/* Dynamic Cost Estimate card */}
                    <div className="space-y-4 bg-neutral-950 p-5 border border-white/5 print:bg-neutral-50 print:border-neutral-300 print:text-black flex flex-col justify-between rounded-xl">
                      <div className="space-y-1.5 text-center sm:text-left">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-400 block">TOTAL STRUCTURAL CONTRACT ESTIMATE CONTRACT RECKONING</span>
                        <div className="text-2xl sm:text-3xl font-mono font-black text-white print:text-black mt-1">
                          ₹{minCostRange.toLocaleString('en-IN')} - ₹{maxCostRange.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[8px] text-zinc-500 block leading-tight pt-1">
                          * Based on {areaSqFt.toLocaleString()} sqft layout, Indore manufacturing output freight, and onsite layout adjustments.
                        </span>
                      </div>

                      <div className="border-t border-white/5 my-2.5 pt-2.5 space-y-1.5 text-[10px] text-neutral-400 print:border-neutral-300">
                        <div className="flex justify-between">
                          <span>Upper Cushion ({materialPreset.name})</span>
                          <span className="font-mono text-white print:text-black">₹{surfaceCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aggregate Core subbase ({subbasePreset.name})</span>
                          <span className="font-mono text-white print:text-black">₹{subbaseCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Civil Grading Engineering + Shipping dispatch</span>
                          <span className="font-mono text-white print:text-black">₹{(transportationDispatch + engineeringSetup).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Specification Breakdown items */}
                    <div className="space-y-3">
                      <h3 className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 font-extrabold pb-1.5 border-b border-white/5 print:border-neutral-200">
                        PHYSICAL SPECS SNAPSHOT
                      </h3>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Category Layout</span>
                          <span className="font-bold text-white print:text-black uppercase">{sportPreset.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Total Play Boundary Area</span>
                          <span className="font-mono font-bold text-white print:text-black">{length}&apos; &times; {width}&apos; ({areaSqFt.toLocaleString()} sq ft)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Resurface Overlay Material</span>
                          <span className="font-bold text-white print:text-black uppercase">{materialPreset.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Core Subbase Support</span>
                          <span className="font-bold text-white print:text-black uppercase">{subbasePreset.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Procurement Class</span>
                          <span className="px-2 py-0.5 rounded bg-white text-black font-extrabold text-[9px] uppercase font-mono">
                            {budgetTier}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Adaptive expert engineering notice/warnings */}
                  <div className="p-4 bg-amber-500/5 text-amber-300 border border-amber-500/10 rounded-xl flex gap-3 text-xs leading-relaxed print:bg-white print:border-neutral-300 print:text-black">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-400 block mb-0.5 uppercase print:text-black">Indore Technical Lab Advisory Report</span>
                      {surfaceMaterial === 'CANADIAN_MAPLE' && (
                        <p>Canadian Maple hardwood is highly organic. For locations subject to heavy precipitation, adequate structural storm drainage slopes (typically 1%) and waterproofing membranes must be configured to avoid hardwood moisture bloating.</p>
                      )}
                      {surfaceMaterial === 'PRO_ACRYLIC' && (
                        <p>Your cushioned acrylic specification is optimal for thermal stress resistance. Ensure concrete compaction cure times strictly exceed 28 full days prior to installing multi-layer pigments coat to prevent subbase vapor bubble lifting.</p>
                      )}
                      {surfaceMaterial === 'PP_TILES' && (
                        <p>PP Interlocking Matrix structure provides seamless drainage logic. Ensure aggregate subbase has a fine layout gravel sweep to prevent small aggregate ticks from pressing under flexible polymeric joints during rapid player foot work.</p>
                      )}
                      {surfaceMaterial === 'COMPOSITE_TURF' && (
                        <p>FIFA grade synthetic grass turf demands silica and cooling sand compaction. Ensure localized heavy soil compaction is handled with vibratory steel drums to maintain optimal true-rolling ball physics.</p>
                      )}
                      {surfaceMaterial === 'MOSAIC_CLASSIC' && (
                        <p>Royal Mosaic Ceramic & Glass Tiles require premium grade high-density shotcrete concrete structures. Always verify complete subbase moisture sealing to avoid calcium leaching or grout peeling from continuous chlorine/bromine water chemistry exposure.</p>
                      )}
                      {surfaceMaterial === 'GLASS_BEAD_PLASTER' && (
                        <p>Premium Quartz & Glass Bead Plaster must be spray-applied and hand-troweled under optimal thermal shelter. Strictly monitor water calcium hardness and pH values during the initial 30 days of filling to prevent surface etching.</p>
                      )}
                      {surfaceMaterial === 'REINFORCED_PVC_LINER' && (
                        <p>Heavy-Duty Reinforced PVC Liner welding requires a fully debris-free dry substrate. Ensure protective geofleece membranes are correctly underlaid to prevent underground pebble wear and maintain dynamic thermal elasticity.</p>
                      )}
                      {surfaceMaterial === 'ARMOURCOAT_WALLS' && (
                        <p>Armourcoat Squash Wall Plaster requires a level substrate with maximum 2mm deflection over standard WSF height criteria. Adequate structural backing cure is critical to prevent acoustic dead spots during heavy ball rebounds.</p>
                      )}
                    </div>
                  </div>

                  {/* Spec Action Buttons at the bottom */}
                  <div className="flex flex-col sm:flex-row justify-between pt-4 border-t border-white/5 gap-4 print:hidden">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3 border border-white/10 text-[10px] text-neutral-400 uppercase tracking-wider font-bold hover:bg-neutral-900 transition cursor-pointer text-center"
                    >
                      Modify Parameters
                    </button>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={onBackToMain}
                        className="px-5 py-3 border border-white/10 text-[10px] text-white bg-neutral-900 uppercase tracking-wider font-bold hover:bg-neutral-850 transition cursor-pointer text-center"
                      >
                        Return to Showcase
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-5 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-200 transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <FileText className="h-4 w-4" />
                        Print Specs Sheet
                      </button>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};
