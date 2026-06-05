/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Calculator, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Settings, 
  DollarSign, 
  Activity, 
  Ruler, 
  Layers, 
  FileText 
} from 'lucide-react';
import { SPORT_PRESETS, SURFACE_MATERIALS, SUB_BASES } from '../constants';
import { SportType, SurfaceMaterialType, SubbaseType } from '../types';
import { saveDocument } from '../firebase';

interface BudgetPlannerProps {
  onBackToMain: () => void;
  language: 'en' | 'hi';
}

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ onBackToMain, language }) => {
  // Wizard flow state
  // 0: Intro (Requested HTML mockup), 1: Sport, 2: Dimensions, 3: Surface + Subbase, 4: Contact, 5: Result Report
  const [step, setStep] = useState<number>(0);

  // User input states
  const [sportType, setSportType] = useState<SportType>('BASKETBALL');
  const [length, setLength] = useState<number>(94);
  const [width, setWidth] = useState<number>(50);
  const [visualLength, setVisualLength] = useState<number>(94);
  const [visualWidth, setVisualWidth] = useState<number>(50);
  const [surfaceMaterial, setSurfaceMaterial] = useState<SurfaceMaterialType>('CANADIAN_MAPLE');
  const [subbase, setSubbase] = useState<SubbaseType>('POST_TENSION_CONCRETE');
  const [budgetTier, setBudgetTier] = useState<'Standard' | 'Premium' | 'Luxury Elite'>('Premium');
  
  // Client contact states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [timeline, setTimeline] = useState('Immediate (Next 30 days)');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCode, setSubmissionCode] = useState('');

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
  const sportPreset = SPORT_PRESETS[sportType];
  const materialPreset = SURFACE_MATERIALS[surfaceMaterial];
  const subbasePreset = SUB_BASES[subbase];

  // Dynamically calculate interactive sports infrastructure budget
  const baseCost = areaSqFt * (sportPreset?.basePricePerSqFt || 300);
  const surfaceCost = areaSqFt * (materialPreset?.costPerSqFt || 600);
  const subbaseCost = areaSqFt * (subbasePreset?.costPerSqFt || 500);
  const engineeringSetup = 45000 + areaSqFt * 1.5;
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
    if (!fullName || !email || !location) {
      alert(language === 'hi' ? 'कृपया आवश्यक संपर्क फ़ील्ड भरें।' : 'Please fill in the required contact fields to view your expert plan.');
      return;
    }
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

  return (
    <div className="flex-1 bg-[#0A0A0A] text-white relative overflow-x-hidden font-sans select-none" data-testid="budget-planning-page">
      
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/13498650/pexels-photo-13498650.jpeg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col justify-start py-12">
        
        <AnimatePresence mode="wait">
          {step === 0 && (
            /* Hero / Intro Section exactly as requested */
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex items-center justify-center px-6 py-24" 
              data-testid="intro-screen"
            >
              <div className="text-center max-w-3xl">
                
                <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter uppercase mb-6" data-testid="intro-headline">
                  {language === 'hi' ? <>स्पोर्ट्स इन्फ्रास्ट्रक्चर<br />की योजना बनाएं</> : <>Plan Your Sports<br />Infrastructure</>}
                </h1>
                
                <p className="text-lg text-gray-400 mb-12">
                  {language === 'hi' ? 'कुछ सवालों के जवाब दें। विशेषज्ञ मार्गदर्शन प्राप्त करें।' : 'Answer a few questions. Get expert guidance.'}
                </p>

                {/* CTA Button */}
                <button 
                  onClick={() => setStep(1)}
                  className="bg-white text-black font-bold rounded-none hover:bg-gray-200 transition-colors px-8 py-4 text-sm uppercase tracking-wider flex items-center gap-3 mx-auto cursor-pointer" 
                  data-testid="start-planning-button"
                >
                  {language === 'hi' ? 'योजना शुरू करें' : 'Start Planning'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>

              </div>
            </motion.div>
          )}

          {step === 1 && (
            /* Step 1: Sport Selection */
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto w-full px-4 py-12 space-y-8 flex-1 flex flex-col justify-center"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 font-bold block">STEP 01 OF 04</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">Select Target Sport Platform</h2>
                <p className="text-sm text-neutral-400 max-w-lg mx-auto">Each sport requires specialized elastic subfloors, paint line configurations, and foundation load calculations.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(SPORT_PRESETS).map((key) => {
                  const s = SPORT_PRESETS[key];
                  const active = sportType === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSportSelect(s.id as SportType)}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-40 transition-all cursor-pointer ${
                        active 
                          ? 'bg-white text-black border-white' 
                          : 'bg-neutral-950/80 border-neutral-850 hover:bg-neutral-900 text-white'
                      }`}
                    >
                      <span className="text-xs font-mono uppercase tracking-wider opacity-60">CODE: {s.id.slice(0,3)}</span>
                      <div>
                        <h3 className="font-bold text-base leading-tight uppercase">{s.name}</h3>
                        <p className={`text-[10px] mt-1.5 leading-snug line-clamp-2 ${active ? 'text-neutral-750' : 'text-neutral-400'}`}>
                          {s.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="bg-white text-black hover:bg-neutral-200 px-6 py-3 uppercase tracking-wider font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  Configure Dimensions
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            /* Step 2: Dimensions & Range scale */
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto w-full px-4 py-12 space-y-8 flex-1 flex flex-col justify-center"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 font-bold block">STEP 02 OF 04</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">Establish Playground Scale</h2>
                <p className="text-sm text-neutral-400">Specify physical dimensions. Larger areas require heavy civil compaction grids.</p>
              </div>

              <div className="bg-neutral-950/90 border border-neutral-900 rounded-3xl p-6 sm:p-8 space-y-8">
                
                {/* Physical Preset buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setLength(Math.round(sportPreset.minDimensions.length));
                      setVisualLength(Math.round(sportPreset.minDimensions.length));
                      setWidth(Math.round(sportPreset.minDimensions.width));
                      setVisualWidth(Math.round(sportPreset.minDimensions.width));
                    }}
                    className="p-3 bg-neutral-900 text-xs font-bold font-mono tracking-wider uppercase border border-neutral-800 hover:bg-neutral-800 rounded-xl cursor-pointer"
                  >
                    Minimum Compact
                  </button>
                  <button
                    onClick={() => {
                      setLength(Math.round(sportPreset.defaultDimensions.length));
                      setVisualLength(Math.round(sportPreset.defaultDimensions.length));
                      setWidth(Math.round(sportPreset.defaultDimensions.width));
                      setVisualWidth(Math.round(sportPreset.defaultDimensions.width));
                    }}
                    className="p-3 bg-white text-black text-xs font-bold font-mono tracking-wider uppercase rounded-xl cursor-pointer"
                  >
                    Official Standard
                  </button>
                  <button
                    onClick={() => {
                      setLength(Math.round(sportPreset.maxDimensions.length));
                      setVisualLength(Math.round(sportPreset.maxDimensions.length));
                      setWidth(Math.round(sportPreset.maxDimensions.width));
                      setVisualWidth(Math.round(sportPreset.maxDimensions.width));
                    }}
                    className="p-3 bg-neutral-900 text-xs font-bold font-mono tracking-wider uppercase border border-neutral-800 hover:bg-neutral-800 rounded-xl cursor-pointer"
                  >
                    Maximum Expanded
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Length Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                      <span>LENGTH: <strong className="text-white text-sm">{visualLength} Feet</strong> ({Math.round(visualLength * 0.3048)} m)</span>
                      <span>Range: {sportPreset.minDimensions.length}&apos; - {sportPreset.maxDimensions.length}&apos;</span>
                    </div>
                    <input
                      type="range"
                      min={sportPreset.minDimensions.length}
                      max={sportPreset.maxDimensions.length}
                      value={visualLength}
                      onChange={(e) => setVisualLength(Number(e.target.value))}
                      className="w-full accent-white bg-neutral-805 h-1.5 rounded cursor-col-resize"
                    />
                  </div>

                  {/* Width Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                      <span>WIDTH: <strong className="text-white text-sm">{visualWidth} Feet</strong> ({Math.round(visualWidth * 0.3048)} m)</span>
                      <span>Range: {sportPreset.minDimensions.width}&apos; - {sportPreset.maxDimensions.width}&apos;</span>
                    </div>
                    <input
                      type="range"
                      min={sportPreset.minDimensions.width}
                      max={sportPreset.maxDimensions.width}
                      value={visualWidth}
                      onChange={(e) => setVisualWidth(Number(e.target.value))}
                      className="w-full accent-white bg-neutral-805 h-1.5 rounded cursor-col-resize"
                    />
                  </div>
                </div>

                {/* Live Area Snapshot */}
                <div className="py-4 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-400">
                  <span>Computed Playground Ground Area:</span>
                  <span className="font-mono text-white text-lg font-bold">{(visualLength * visualWidth).toLocaleString()} Sq. Ft</span>
                </div>

              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="bg-transparent text-white border border-neutral-800 hover:bg-neutral-950 px-5 py-3 uppercase tracking-wider font-bold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-white text-black hover:bg-neutral-200 px-6 py-3 uppercase tracking-wider font-bold text-xs flex items-center gap-2 transition"
                >
                  Surface Setup
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            /* Step 3: Material Specification and Subbase */
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto w-full px-4 py-12 space-y-8 flex-1 flex flex-col justify-center"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 font-bold block">STEP 03 OF 04</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">Surface & Base Substructure</h2>
                <p className="text-sm text-neutral-400">The combination of subbase load aggregate and upper elastic court defines real life bounce consistency.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Surface Material choice panel */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-mono text-zinc-400">01. Premium Performance Coating</h3>
                  <div className="space-y-3">
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
                          className={`w-full p-4 rounded-xl text-left border flex justify-between items-center transition cursor-pointer ${
                            active ? 'bg-white text-black border-white' : 'bg-neutral-955 border-neutral-890 hover:bg-neutral-900 text-white'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sm tracking-tight block uppercase">{m.name}</span>
                            <span className={`text-[10px] font-mono uppercase ${active ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              {m.category} &bull; Approx. ₹{m.costPerSqFt}/sqft
                            </span>
                          </div>
                          {active && <CheckCircle2 className="h-5 w-5 text-black shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subbase Foundation material choice panel */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-wider font-mono text-zinc-400">02. Foundation Subbase Civil Slab</h3>
                  <div className="space-y-3">
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
                          className={`w-full p-4 rounded-xl text-left border flex justify-between items-center transition cursor-pointer ${
                            active ? 'bg-white text-black border-white' : 'bg-neutral-955 border-neutral-890 hover:bg-neutral-900 text-white'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sm tracking-tight block uppercase">{b.name}</span>
                            <span className={`text-[10px] font-mono uppercase ${active ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              Est: ₹{b.costPerSqFt}/sqft &bull; {b.durability.split(' &bull; ')[0]}
                            </span>
                          </div>
                          {active && <CheckCircle2 className="h-5 w-5 text-black shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Budget tier selector */}
              <div className="bg-neutral-950/80 p-5 rounded-2xl border border-neutral-900/60 text-center space-y-3">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">03. Project Procurement Budget Class</span>
                <div className="flex justify-center gap-4">
                  {['Standard', 'Premium', 'Luxury Elite'].map((tier) => {
                    const active = budgetTier === tier;
                    return (
                      <button
                        key={tier}
                        onClick={() => setBudgetTier(tier as any)}
                        className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                          active ? 'bg-white text-black' : 'bg-neutral-900 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tier}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="bg-transparent text-white border border-neutral-800 hover:bg-neutral-955 px-5 py-3 uppercase tracking-wider font-bold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-white text-black hover:bg-neutral-200 px-6 py-3 uppercase tracking-wider font-bold text-xs flex items-center gap-2 transition"
                >
                  Contact Info
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            /* Step 4: Contact & Target Parameters */
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto w-full px-4 py-12 space-y-8 flex-1 flex flex-col justify-center"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 font-bold block">STEP 04 OF 04</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">Civil Mobilization Info</h2>
                <p className="text-sm text-neutral-400">Our Indore corporate engineering lab uses these variables to design soil core drills, site slopes and local shipping layouts.</p>
              </div>

              <form onSubmit={handleSubmitPlanning} className="space-y-5 bg-neutral-950/90 border border-neutral-900 p-6 sm:p-8 rounded-3xl">
                
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1.5 font-bold">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:bg-neutral-950 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
                    />
                  </div>

                  {/* Corporate Email */}
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1.5 font-bold">Inbound Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ramesh@projectinfra.in"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:bg-neutral-950 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
                    />
                  </div>

                  {/* Active Mobile WhatsApp */}
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1.5 font-bold">WhatsApp / Active Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:bg-neutral-950 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Project Location */}
                    <div>
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1.5 font-bold">Project State/City *</label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Indore, MP"
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:bg-neutral-950 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
                      />
                    </div>

                    {/* Timeline */}
                    <div>
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1.5 font-bold">Time Window</label>
                      <select
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:bg-neutral-950 rounded-xl px-3 py-3 text-white text-xs outline-none transition cursor-pointer"
                      >
                        <option value="Immediate (Next 30 days)">Immediate (30 days)</option>
                        <option value="Standard (Within 3 months)">Standard (3 months)</option>
                        <option value="Conceptual planning phase">Planning Phase</option>
                      </select>
                    </div>
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition duration-250 cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-neutral-500 border-t-black rounded-full animate-spin" />
                      COMPILING SPECIFICATIONS...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      View Architectural Estimate
                    </>
                  )}
                </button>

              </form>

              <div className="flex justify-start">
                <button
                  onClick={() => setStep(3)}
                  className="bg-transparent text-white border border-neutral-800 hover:bg-neutral-955 px-5 py-3 uppercase tracking-wider font-bold text-xs"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            /* Step 5: Final Calculated Specification Sheet */
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto w-full px-4 py-12 space-y-8 print:bg-white print:text-neutral-951"
            >
              
              {/* Header Details */}
              <div className="border border-neutral-900 p-6 sm:p-10 bg-neutral-955/90 rounded-3xl space-y-8 relative overflow-hidden print:bg-white print:text-black print:border-neutral-300">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/2 rounded-full blur-2xl pointer-events-none" />

                {/* Print/Corporate Metadata bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6 print:border-neutral-200">
                  <div className="space-y-1">
                    <span className="text-red-400 text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold block">EARTHFIRM CIVIL DIRECTIVE</span>
                    <h2 className="text-2xl font-serif font-black uppercase tracking-tight text-white print:text-black">Sports Infrastructure Spec</h2>
                  </div>
                  <div className="bg-neutral-905 p-3.5 border border-neutral-850 rounded-xl text-right print:bg-neutral-100 print:border-neutral-300 print:text-black">
                    <span className="text-[8px] font-mono text-zinc-400 block uppercase">PLAN ASSIGNMENT TOKEN</span>
                    <strong className="text-sm font-mono text-white font-extrabold print:text-black tracking-wide">{submissionCode}</strong>
                  </div>
                </div>

                {/* Success Banner */}
                <div className="p-4 bg-white/3 border border-white/10 rounded-2xl flex gap-3.5 items-start text-xs leading-relaxed text-zinc-300 print:bg-neutral-50 print:border-neutral-300 print:text-neutral-800">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 shrink-0 print:text-emerald-700" />
                  <div>
                    <span className="font-bold text-white block mb-0.5 uppercase print:text-black">Conceptual Planning Registered</span>
                    Dear <strong>{fullName}</strong>, our engineering lab has mapped your specifications for {sportPreset.name} in <strong>{location}</strong>. 
                    An advisor from our Indore unit was notified about your draft token ID: <strong className="text-white print:text-black">{submissionCode}</strong> and will connect in {timeline}.
                  </div>
                </div>

                {/* Main Spec grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  
                  {/* Dynamic Cost Estimate card */}
                  <div className="space-y-5 bg-neutral-950/80 p-6 rounded-2xl border border-neutral-900 print:bg-neutral-50 print:border-neutral-300 print:text-black flex flex-col justify-between">
                    <div className="space-y-1.5 text-center sm:text-left">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 block">TOTAL STRUCTURAL CONTRACT ESTIMATE RECKONING</span>
                      <div className="text-3xl sm:text-4xl font-mono font-black text-white print:text-black mt-2">
                        ₹{minCostRange.toLocaleString('en-IN')} - ₹{maxCostRange.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-zinc-500 block leading-tight pt-1">
                        * Based on {areaSqFt.toLocaleString()} sqft layout, Indore manufacturing output freight, and onsite layout adjustments.
                      </span>
                    </div>

                    <div className="border-t border-neutral-900 my-4 pt-4 space-y-2 text-xs leading-none print:border-neutral-300 text-neutral-400">
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
                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 font-extrabold pb-1.5 border-b border-neutral-900 print:border-neutral-200">
                      PHYSICAL SPECS SNAPSHOT
                    </h3>

                    <div className="space-y-2.5 text-xs">
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
                        <span className="px-2 py-0.5 rounded bg-white text-black font-extrabold text-[10px] uppercase font-mono">
                          {budgetTier}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Adaptive expert engineering notice/warnings */}
                <div className="p-4 bg-amber-500/5 text-amber-300 border border-amber-500/10 rounded-2xl flex gap-3 text-xs leading-relaxed print:bg-white print:border-neutral-300 print:text-black">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-400 block mb-0.5 uppercase print:text-black">Indore Technical Lab Advisory Report</span>
                    {surfaceMaterial === 'CANADIAN_MAPLE' && (
                      <p>Canadian Maple hardwood is highly organic. For locations subject to heavy precipitation, adequate structural storm drainage slopes (typically 1%) and dynamic waterproofing membranes must be pre-planned to avoid hardwood moisture bloating.</p>
                    )}
                    {surfaceMaterial === 'PRO_ACRYLIC' && (
                      <p>Your cushioned acrylic specification is optimal for thermal stress resistance. Ensure concrete compaction cure times strictly exceed 28 full days prior to installing multi-layer pigments coat to prevent subbase vapor bubble lifting.</p>
                    )}
                    {surfaceMaterial === 'PP_TILES' && (
                      <p>PP Interlocking Matrix structure provides seamless drainage logic. Ensure aggregate subbase has a fine layout gravel sweep to prevent small aggregate ticks from pressing under flexible polymeric joints during rapid player foot work.</p>
                    )}
                    {surfaceMaterial === 'COMPOSITE_TURF' && (
                      <p>FIFA grade synthetic grass turf demands professional silica and cooling sand compaction. Ensure localized heavy soil compaction is handled with vibratory steel drums to maintain optimal true-rolling ball physics.</p>
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
                      <p>Armourcoat Squash Wall Plaster requires a perfectly level substrate with maximum 2mm deflection over standard WSF height criteria. Adequate structural backing cure is critical to prevent acoustic dead spots during heavy ball rebounds.</p>
                    )}
                  </div>
                </div>

                {/* Spec Action Buttons at the bottom */}
                <div className="flex flex-col sm:flex-row justify-between pt-6 border-t border-neutral-900 gap-4 print:hidden">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 border border-neutral-800 text-xs text-neutral-400 uppercase tracking-wider font-bold hover:bg-neutral-950 transition cursor-pointer text-center"
                  >
                    Modify Parameters
                  </button>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={onBackToMain}
                      className="px-5 py-3 border border-neutral-800 text-xs text-white bg-neutral-900 uppercase tracking-wider font-bold hover:bg-neutral-850 transition cursor-pointer text-center"
                    >
                      Return to Showcase
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-5 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Download className="h-4 w-4" />
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
  );
};
