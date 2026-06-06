/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CourtConfiguration, SportType, SurfaceMaterialType, SubbaseType } from '../types';

const staggerItem = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
} as const;
import { SPORT_PRESETS, SURFACE_MATERIALS, SUB_BASES, SMART_FEATURES, COLORS } from '../constants';
import { CourtVisualizer } from './CourtVisualizer';
import { CostEstimator } from './CostEstimator';
import { TimelineTracker } from './TimelineTracker';
import { Dribbble, Activity, Zap, Play, Flame, Check, Info, Hammer, Settings, ArrowDown, Dumbbell, Target, Trophy, Waves, Layout, Volleyball } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface InteractiveBuilderProps {
  config: CourtConfiguration;
  onConfigChange: (config: CourtConfiguration) => void;
  triggerScrollToContact: () => void;
}

export const InteractiveBuilder: React.FC<InteractiveBuilderProps> = ({ config, onConfigChange, triggerScrollToContact }) => {
  const { t } = useLanguage();
  // 1. Core State
  const [sportType, setSportType] = useState<SportType>(config.sportType);
  const [length, setLength] = useState<number>(config.length);
  const [width, setWidth] = useState<number>(config.width);
  const [visualLength, setVisualLength] = useState<number>(config.length);
  const [visualWidth, setVisualWidth] = useState<number>(config.width);
  const [surfaceMaterial, setSurfaceMaterial] = useState<SurfaceMaterialType>(config.surfaceMaterial);
  const [primaryColor, setPrimaryColor] = useState<string>(config.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState<string>(config.secondaryColor);
  const [lineColor, setLineColor] = useState<string>(config.lineColor || '#ffffff');
  const [subbase, setSubbase] = useState<SubbaseType>(config.subbase);
  const [selectedSmartFeatures, setSelectedSmartFeatures] = useState<string[]>(config.selectedSmartFeatures);
  const [visualizePlayers, setVisualizePlayers] = useState<boolean>(config.visualizePlayers !== false);
  const [animatePlayers, setAnimatePlayers] = useState<boolean>(config.animatePlayers !== false);

  // Debounce visual input changes to heavy canvas/price state updates (100ms)
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

  // Sync state from parent's config prop (e.g. from Hero Showcase clicks or initialization)
  useEffect(() => {
    if (config.sportType !== sportType) setSportType(config.sportType);
    if (config.length !== length) {
      setLength(config.length);
      setVisualLength(config.length);
    }
    if (config.width !== width) {
      setWidth(config.width);
      setVisualWidth(config.width);
    }
    if (config.surfaceMaterial !== surfaceMaterial) setSurfaceMaterial(config.surfaceMaterial);
    if (config.primaryColor !== primaryColor) setPrimaryColor(config.primaryColor);
    if (config.secondaryColor !== secondaryColor) setSecondaryColor(config.secondaryColor);
    if (config.lineColor !== lineColor) setLineColor(config.lineColor || '#ffffff');
    if (config.subbase !== subbase) setSubbase(config.subbase);
    if (config.visualizePlayers !== undefined && config.visualizePlayers !== visualizePlayers) setVisualizePlayers(config.visualizePlayers);
    if (config.animatePlayers !== undefined && config.animatePlayers !== animatePlayers) setAnimatePlayers(config.animatePlayers);
    
    // Check if arrays match
    const equalArr = config.selectedSmartFeatures.length === selectedSmartFeatures.length &&
      config.selectedSmartFeatures.every(v => selectedSmartFeatures.includes(v));
    if (!equalArr) setSelectedSmartFeatures(config.selectedSmartFeatures);
  }, [config]);

  // Handle manual sport selection resets in dimensions and material suggestions
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const getFeatureBenefit = (category: string) => {
    switch (category) {
      case 'Lighting': return 'Extends operational hours & safety visibility.';
      case 'Hardware': return 'Minimizes maintenance frequency & protects structural integrity.';
      case 'Tech': return 'Modernizes user experience & offers advanced athletic analytics.';
      case 'Ecosystem': return 'Improves environmental integration & operational safety.';
      default: return 'Increases overall asset functional lifespan.';
    }
  };

  const handleSelectSport = (type: SportType) => {
    setSportType(type);
    const preset = SPORT_PRESETS[type];
    setLength(preset.defaultDimensions.length);
    setVisualLength(preset.defaultDimensions.length);
    setWidth(preset.defaultDimensions.width);
    setVisualWidth(preset.defaultDimensions.width);

    // Reset selected smart features/accessories on changing sport types to prevent bad state
    setSelectedSmartFeatures([]);

    // Dynamic defaults for sports
    if (type === 'FOOTBALL') {
      setSurfaceMaterial('COMPOSITE_TURF');
      setSubbase('FOOTBALL_DRAINAGE_AGGREGATE');
    } else if (type === 'CRICKET') {
      setSurfaceMaterial('COMPOSITE_TURF');
      setSubbase('CRICKET_COMPACT_STONE');
    } else if (type === 'SWIMMING_POOL') {
      setSurfaceMaterial('MOSAIC_CLASSIC');
      setSubbase('POOL_SHOTCRETE_SHELL');
    } else if (type === 'SQUASH') {
      setSurfaceMaterial('CANADIAN_MAPLE');
      setSubbase('SQUASH_DOUBLE_BATTEN');
    } else if (type === 'GYM') {
      setSurfaceMaterial('CANADIAN_MAPLE');
      setSubbase('GYM_ACOUSTIC_SLAB');
    } else if (type === 'BASKETBALL' || type === 'BADMINTON' || type === 'VOLLEYBALL') {
      setSurfaceMaterial('CANADIAN_MAPLE');
      setSubbase('POST_TENSION_CONCRETE');
    } else {
      setSurfaceMaterial('PRO_ACRYLIC');
      setSubbase('POST_TENSION_CONCRETE');
    }
  };

  // Bubble state changes up to App
  const activeConfig: CourtConfiguration = {
    sportType,
    length,
    width,
    surfaceMaterial,
    primaryColor,
    secondaryColor,
    lineColor,
    subbase,
    selectedSmartFeatures,
    visualizePlayers,
    animatePlayers
  };

  useEffect(() => {
    onConfigChange(activeConfig);
  }, [sportType, length, width, surfaceMaterial, primaryColor, secondaryColor, lineColor, subbase, selectedSmartFeatures, visualizePlayers, animatePlayers]);

  // Accessories toggle
  const toggleSmartFeature = (id: string) => {
    if (selectedSmartFeatures.includes(id)) {
      setSelectedSmartFeatures(selectedSmartFeatures.filter(f => f !== id));
    } else {
      setSelectedSmartFeatures([...selectedSmartFeatures, id]);
    }
  };

  // Sport presets rendering helpers
  const getSportIcon = (type: SportType) => {
    switch (type) {
      case 'BASKETBALL': return <Dribbble className="h-5 w-5" />;
      case 'TENNIS': return <Activity className="h-5 w-5" />;
      case 'PICKLEBALL': return <Zap className="h-5 w-5" />;
      case 'FOOTBALL': return <Play className="h-5 w-5" />;
      case 'TRACK_FIELD': return <Flame className="h-5 w-5" />;
      case 'GYM': return <Dumbbell className="h-5 w-5" />;
      case 'CRICKET': return <Target className="h-5 w-5" />;
      case 'BADMINTON': return <Trophy className="h-5 w-5" />;
      case 'SWIMMING_POOL': return <Waves className="h-5 w-5" />;
      case 'SQUASH': return <Layout className="h-5 w-5" />;
      case 'VOLLEYBALL': return <Volleyball className="h-5 w-5" />;
    }
  };

  const currentSportPreset = SPORT_PRESETS[sportType];

  return (
    <div className="bg-brand-cream py-16 text-brand-stone border-b border-stone-250/60" id="arena-configurator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Header */}
        <motion.div variants={staggerItem} className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-brand-sage font-mono font-bold block mb-2">Architectural Workspace</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-brand-stone mb-4">
            {t('build.title')}
          </h2>
          <p className="text-stone-650 text-sm sm:text-base leading-relaxed">
            {t('build.subtitle')}
          </p>
        </motion.div>

        {/* Master Double Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: CONFIGURATION TOOLS (lg:col-span-12 or 7) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Step 1: Sport Selection */}
            <motion.div variants={staggerItem} className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-8 shadow-sm">
              <label className="text-xs uppercase tracking-[0.15em] text-brand-sage font-mono font-bold block mb-4 border-b border-stone-100 pb-2">
                01. Sport Arena Type
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.keys(SPORT_PRESETS) as SportType[]).map((type) => {
                  const preset = SPORT_PRESETS[type];
                  const isSelected = sportType === type;
                  return (
                    <motion.button
                      key={type}
                      onClick={() => handleSelectSport(type)}
                      id={`sport-opt-${type}`}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-brand-sage-soft border-brand-sage text-brand-sage'
                          : 'bg-brand-cream/20 border-stone-200 hover:border-stone-400 text-stone-500 hover:text-brand-stone'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl mb-2.5 transition ${isSelected ? 'bg-brand-sage text-white' : 'bg-stone-100 text-stone-400'}`}>
                        {getSportIcon(type)}
                      </div>
                      <span className="text-xs font-bold font-sans tracking-wide block leading-snug">{preset.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-4 p-4 bg-brand-cream/80 rounded-2xl border border-stone-200/60 text-xs text-stone-600 leading-relaxed flex items-start gap-3">
                <Info className="h-4.5 w-4.5 text-brand-sage flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-brand-stone font-bold block mb-0.5">{currentSportPreset.tagline}</span>
                  {currentSportPreset.description}
                </div>
              </div>
            </motion.div>

            {/* Step 2: Dimensions Sub-section */}
            <motion.div variants={staggerItem} className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-brand-sage font-mono font-bold block mb-1">
                    02. Dimension Adjustments (feet)
                  </label>
                  <p className="text-xs text-stone-500">Scale boundary play ratios to fit backyard setups or pro fields.</p>
                </div>
                <div className="bg-brand-cream/75 px-4 py-2 rounded-2xl border border-stone-100/80 text-left sm:text-right">
                  <span className="text-[10px] font-mono text-brand-sage uppercase tracking-widest block font-bold">Total Footprint</span>
                  <span className="text-sm font-mono font-bold text-brand-stone">{(visualLength * visualWidth).toLocaleString()} sq. ft</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Length Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-stone-550 mb-2">
                    <span>Arena Length</span>
                    <span className="text-brand-stone font-bold">{visualLength} ft</span>
                  </div>
                  <input
                    type="range"
                    min={currentSportPreset.minDimensions.length}
                    max={currentSportPreset.maxDimensions.length}
                    value={visualLength}
                    onChange={(e) => setVisualLength(parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-ew-resize bg-stone-200 accent-brand-sage"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-stone-400 mt-1">
                    <span>Min {currentSportPreset.minDimensions.length} ft</span>
                    <span>Max {currentSportPreset.maxDimensions.length} ft</span>
                  </div>
                </div>

                {/* Width Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-stone-555 mb-2">
                    <span>Arena Width</span>
                    <span className="text-brand-stone font-bold">{visualWidth} ft</span>
                  </div>
                  <input
                    type="range"
                    min={currentSportPreset.minDimensions.width}
                    max={currentSportPreset.maxDimensions.width}
                    value={visualWidth}
                    onChange={(e) => setVisualWidth(parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-ew-resize bg-stone-200 accent-brand-sage"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-stone-400 mt-1">
                    <span>Min {currentSportPreset.minDimensions.width} ft</span>
                    <span>Max {currentSportPreset.maxDimensions.width} ft</span>
                  </div>
                </div>

                {/* Size Presets buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-100">
                  <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider my-auto mr-1">Ratios:</span>
                  <motion.button
                    onClick={() => {
                      setLength(currentSportPreset.minDimensions.length);
                      setVisualLength(currentSportPreset.minDimensions.length);
                      setWidth(currentSportPreset.minDimensions.width);
                      setVisualWidth(currentSportPreset.minDimensions.width);
                    }}
                    id="btn-ratio-compact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 text-[10px] font-mono font-bold rounded-full bg-brand-cream hover:bg-stone-200/50 border border-stone-200 text-stone-605 transition cursor-pointer"
                  >
                    Compact ({currentSportPreset.minDimensions.length}x{currentSportPreset.minDimensions.width})
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setLength(currentSportPreset.defaultDimensions.length);
                      setVisualLength(currentSportPreset.defaultDimensions.length);
                      setWidth(currentSportPreset.defaultDimensions.width);
                      setVisualWidth(currentSportPreset.defaultDimensions.width);
                    }}
                    id="btn-ratio-pro"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 text-[10px] font-mono font-bold rounded-full bg-brand-sage-soft border border-brand-sage text-brand-sage transition cursor-pointer"
                  >
                    Tournament Spec ({currentSportPreset.defaultDimensions.length}x{currentSportPreset.defaultDimensions.width})
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Material & Color Architecture */}
            <motion.div variants={staggerItem} className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-brand-sage font-mono font-bold block mb-1">
                  03. Cushioned Surfaces & Colors
                </label>
                <p className="text-xs text-stone-550">Specify material layering, elasticity, and visual color identities.</p>
              </div>

              {/* Material Radios */}
              <div className="space-y-3">
                {Object.values(SURFACE_MATERIALS).filter((material) => {
                  if (sportType === 'SWIMMING_POOL') {
                    return ['MOSAIC_CLASSIC', 'GLASS_BEAD_PLASTER', 'REINFORCED_PVC_LINER'].includes(material.id);
                  } else if (sportType === 'SQUASH') {
                    return ['CANADIAN_MAPLE', 'ARMOURCOAT_WALLS'].includes(material.id);
                  } else if (sportType === 'FOOTBALL') {
                    return ['COMPOSITE_TURF'].includes(material.id);
                  } else if (sportType === 'TRACK_FIELD') {
                    return !['COMPOSITE_TURF', 'CANADIAN_MAPLE', 'MOSAIC_CLASSIC', 'GLASS_BEAD_PLASTER', 'REINFORCED_PVC_LINER', 'ARMOURCOAT_WALLS'].includes(material.id);
                  } else {
                    return !['COMPOSITE_TURF', 'MOSAIC_CLASSIC', 'GLASS_BEAD_PLASTER', 'REINFORCED_PVC_LINER', 'ARMOURCOAT_WALLS'].includes(material.id);
                  }
                }).map((material) => {
                  const isSelected = surfaceMaterial === material.id;

                  return (
                    <motion.button
                      key={material.id}
                      onClick={() => setSurfaceMaterial(material.id)}
                      id={`surface-opt-${material.id}`}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`flex flex-col sm:flex-row justify-between text-left p-4 rounded-2xl border transition w-full ${
                        isSelected
                          ? 'bg-brand-sage-soft border-brand-sage text-brand-stone'
                          : 'bg-brand-cream/20 border-stone-200 hover:border-stone-400 text-stone-500 hover:text-brand-stone cursor-pointer'
                      }`}
                    >
                      <div className="mb-2 sm:mb-0 w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-brand-stone">{material.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] tracking-wider uppercase font-extrabold ${
                            material.category === 'Indoor' 
                              ? 'bg-amber-150 text-amber-800 font-mono border border-amber-200' 
                              : 'bg-stone-200 text-stone-700 font-mono border border-stone-250'
                          }`}>{material.category}</span>
                        </div>
                        <span className="text-xs text-stone-500 leading-snug block">{material.description}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Court Color Swatches Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100 pt-5">
                {/* Primary Inner Court */}
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wide block mb-2">A. Inner Play Zone Color</span>
                  <div className="flex flex-wrap gap-1.5">
                    {COLORS.map((c) => (
                      <motion.button
                        key={c.value}
                        title={c.name}
                        onClick={() => setPrimaryColor(c.value)}
                        whileHover={{ scale: 1.25, zIndex: 10 }}
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`w-7 h-7 rounded-full border-2 transition relative ${
                          primaryColor === c.value ? 'border-brand-sage scale-110 shadow-md' : 'border-stone-100/60 hover:border-stone-400'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {primaryColor === c.value && <Check className="h-3.5 w-3.5 text-white stroke-[3] absolute inset-0 m-auto" />}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Secondary Outer Border */}
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wide block mb-2">B. Runout Margin Color</span>
                  <div className="flex flex-wrap gap-1.5">
                    {COLORS.map((c) => (
                      <motion.button
                        key={c.value}
                        title={c.name}
                        onClick={() => setSecondaryColor(c.value)}
                        whileHover={{ scale: 1.25, zIndex: 10 }}
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`w-7 h-7 rounded-full border-2 transition relative ${
                          secondaryColor === c.value ? 'border-brand-sage scale-110 shadow-md' : 'border-stone-100/60 hover:border-stone-400'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {secondaryColor === c.value && <Check className="h-3.5 w-3.5 text-white stroke-[3] absolute inset-0 m-auto" />}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Line Marking Color */}
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wide block mb-2">C. Line Marking Color</span>
                  <div className="flex flex-wrap gap-1.5">
                    {COLORS.map((c) => (
                      <motion.button
                        key={c.value}
                        title={c.name}
                        onClick={() => setLineColor(c.value)}
                        whileHover={{ scale: 1.25, zIndex: 10 }}
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`w-7 h-7 rounded-full border-2 transition relative ${
                          lineColor === c.value ? 'border-brand-sage scale-110 shadow-md' : 'border-stone-100/60 hover:border-stone-400'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {lineColor === c.value && <Check className="h-3.5 w-3.5 text-white stroke-[3] absolute inset-0 m-auto" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 4: Foundation (Earthfirm Specialty) */}
            <motion.div variants={staggerItem} className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-brand-sage font-mono font-bold block mb-1">
                  04. Groundwork Sub-structures & Civil Foundations
                </label>
                <p className="text-xs text-stone-550">Earthfirm’s premier earthwork. Heavy slab pouring and custom underground drainage.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.values(SUB_BASES).filter((sub) => {
                  if (sportType === 'FOOTBALL') {
                    return ['FOOTBALL_DRAINAGE_AGGREGATE', 'FOOTBALL_SHOCKPAD_BASE'].includes(sub.id);
                  } else if (sportType === 'CRICKET') {
                    return ['CRICKET_HEAVY_CLAY', 'CRICKET_COMPACT_STONE'].includes(sub.id);
                  } else if (sportType === 'GYM') {
                    return ['GYM_ACOUSTIC_SLAB', 'GYM_RUBBER_DAMPENING'].includes(sub.id);
                  } else if (sportType === 'SWIMMING_POOL') {
                    return ['POOL_SHOTCRETE_SHELL', 'POOL_POURED_CONCRETE'].includes(sub.id);
                  } else if (sportType === 'SQUASH') {
                    return ['SQUASH_DOUBLE_BATTEN', 'SQUASH_SINGLE_ELASTIC'].includes(sub.id);
                  } else {
                    return ['POST_TENSION_CONCRETE', 'ASPHALT', 'COMPACTED_STONE', 'SUSPENDED_DECK'].includes(sub.id);
                  }
                }).map((sub) => {
                  const isSelected = subbase === sub.id;
                  return (
                    <motion.button
                      key={sub.id}
                      onClick={() => setSubbase(sub.id)}
                      id={`subbase-opt-${sub.id}`}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-brand-sage-soft border-brand-sage text-brand-stone'
                          : 'bg-brand-cream/20 border-stone-200 hover:border-stone-400 text-stone-500 hover:text-brand-stone'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs sm:text-sm text-brand-stone leading-tight block">{sub.name}</span>
                          {isSelected && <span className="h-2 w-2 rounded-full bg-brand-sage" />}
                        </div>
                        <span className="text-[11px] text-stone-500 leading-normal block mb-3">{sub.description}</span>
                      </div>
                      <div className="pt-2 border-t border-stone-100 mt-auto flex justify-end items-center text-[10px] text-stone-400 font-mono">
                        <span className="text-brand-sage font-bold">{sub.durability.split(' - ')[0]}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Step 5: High-Tech Upgrades (Iconic Specialities) */}
            <motion.div variants={staggerItem} className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-brand-sage font-mono font-bold block mb-1">
                  05. Iconic Smart Arena Upgrades & Equipment
                </label>
                <p className="text-xs text-stone-550">Toggle integrated electronic overlays, solar-chargers, performance cameras, or acoustic buffers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SMART_FEATURES.filter((feature) => {
                  return !feature.sports || feature.sports.includes(sportType);
                }).map((feature) => {
                  const isChecked = selectedSmartFeatures.includes(feature.id);
                  return (
                    <motion.div
                      key={feature.id}
                      onClick={() => toggleSmartFeature(feature.id)}
                      id={`smart-opt-${feature.id}`}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`p-4 rounded-2xl border flex gap-3 transition cursor-pointer select-none ${
                        isChecked
                          ? 'bg-brand-sage-soft border-brand-sage text-brand-stone'
                          : 'bg-brand-cream/20 border-stone-200 hover:border-stone-400 text-stone-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // toggled by parent div click
                        className="h-4 w-4 mt-0.5 rounded accent-brand-sage pointer-events-none"
                      />
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1 relative">
                          <span className="font-bold text-xs sm:text-sm text-brand-stone pr-6">{feature.name}</span>
                          <div
                            className="absolute top-0 right-0 p-1"
                            onMouseEnter={() => setActiveTooltip(feature.id)}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            <Info className="h-3.5 w-3.5 text-stone-400 hover:text-brand-sage transition-colors" />
                            <AnimatePresence>
                              {activeTooltip === feature.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute bottom-full mb-2 right-0 w-48 p-2.5 bg-[#0E0E0E] text-white text-[10px] rounded-lg shadow-xl z-50 pointer-events-none font-sans border border-white/10"
                                >
                                  <div className="font-bold text-brand-sage mb-1 uppercase tracking-wider">{feature.category} Upgrade</div>
                                  <div className="leading-relaxed text-stone-300">{getFeatureBenefit(feature.category)}</div>
                                  {/* Triangle arrow */}
                                  <div className="absolute top-full right-1.5 -mt-1 w-2 h-2 bg-[#0E0E0E] border-r border-b border-white/10 rotate-45" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <span className="text-[11px] text-stone-500 leading-normal block">{feature.description}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

          </div>

          {/* RIGHT PANEL: STICKY LIVE SIMULATION & DETAILED FINANCIAL SPEC (lg:col-span-5) */}
          <motion.div variants={staggerItem} className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            
            {/* Live simulation */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-mono font-bold block">
                  Live Physical Simulation
                </span>
                <span className="text-[10px] bg-brand-sage-soft text-brand-sage px-2 py-0.5 rounded-full font-mono font-bold">
                  3D Engine Active
                </span>
              </div>
              <CourtVisualizer config={activeConfig} />
              
              {/* Gameplay Visualizer Controls */}
              <div className="bg-white rounded-2xl border border-stone-200/60 p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <Flame className="h-4 w-4 text-brand-sage" />
                  <span className="text-xs font-mono font-bold text-brand-stone uppercase tracking-wide">Live Gameplay Visualizer</span>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-brand-stone block">Visualize Players</span>
                    <span className="text-[10px] text-stone-500 block">Render 3D athletic personnel on the arena turf.</span>
                  </div>
                  <button
                    onClick={() => setVisualizePlayers(!visualizePlayers)}
                    className={`relative inline-flex h-6.5 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      visualizePlayers ? 'bg-brand-sage' : 'bg-stone-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        visualizePlayers ? 'translate-x-4.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className={`flex items-center justify-between gap-4 transition-all duration-200 ${visualizePlayers ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <div>
                    <span className="text-xs font-bold text-brand-stone block">Simulate Live Play</span>
                    <span className="text-[10px] text-stone-500 block">Run real-time athletic matches, shots, and passes.</span>
                  </div>
                  <button
                    disabled={!visualizePlayers}
                    onClick={() => setAnimatePlayers(!animatePlayers)}
                    className={`relative inline-flex h-6.5 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      animatePlayers && visualizePlayers ? 'bg-brand-sage' : 'bg-stone-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        animatePlayers && visualizePlayers ? 'translate-x-4.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Lead trigger banner linking to budget planner */}
            <button
              onClick={() => {
                window.history.pushState({}, '', '/budget-planning');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              id="cta-lock-proposal"
              className="w-full inline-flex items-center justify-center gap-2 p-4 rounded-2xl bg-brand-sage hover:bg-brand-sage-dark text-white font-bold tracking-tight cursor-pointer transition-all duration-250 text-sm sm:text-base shadow-xl shadow-brand-sage/20 border-b-2 border-brand-sage-dark uppercase"
            >
              Get Cost Estimation in Budget Planner
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

