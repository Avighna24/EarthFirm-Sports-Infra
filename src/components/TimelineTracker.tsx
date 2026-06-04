/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CourtConfiguration } from '../types';
import { Clock, Calendar, Hammer, Layers, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface TimelineTrackerProps {
  config: CourtConfiguration;
}

interface TimelineStep {
  title: string;
  days: string;
  icon: React.ReactNode;
  desc: string;
}

export const TimelineTracker: React.FC<TimelineTrackerProps> = ({ config }) => {
  const { surfaceMaterial, subbase } = config;
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const { language, t } = useLanguage();

  // Dynamic values based on selected material
  let installTypeTitle = "";
  let durationRange = "";
  let durationText = "";
  let steps: TimelineStep[] = [];
  let noteAlert = "";

  if (surfaceMaterial === 'CANADIAN_MAPLE') {
    installTypeTitle = language === 'hi' ? "कनाडाई मेपल लकड़ी प्रीमियम स्थापना" : "Canadian Maple Wood Premium Installation";
    durationRange = language === 'hi' ? "5 - 12 कार्य दिवस" : "5 - 12 Working Days";
    durationText = language === 'hi'
      ? "सटीक इनडोर लकड़ी बढ़ईगीरी, मल्टी-पास सैंडिंग और पॉलीयुरेथेन कोट प्रक्रिया।"
      : "Precise indoor carpentry, multiple precision sanding meshes, and layered polyurethane curing cycles.";
    steps = [
      {
        title: language === 'hi' ? "स्लैब नमी परीक्षण" : "Slab Moisture Testing",
        days: language === 'hi' ? "दिन 1 - 2" : "Days 1 - 2",
        icon: <Clock className="h-4 w-4" />,
        desc: language === 'hi'
          ? "डिजिटल नमी की जांच (सापेक्षित आर्द्रता 4% से कम होनी चाहिए) और एंटी-माइक्रोबियल मॉइस्चर सीलिंग।"
          : "Strict digital moisture checking (must exceed below 4% relative humidity) followed by antimicrobial moisture sealing."
      },
      {
        title: language === 'hi' ? "नींव और वाष्प पैड" : "Sleeper Foundation & Vapor Pads",
        days: language === 'hi' ? "दिन 3 - 4" : "Days 3 - 4",
        icon: <Layers className="h-4 w-4" />,
        desc: language === 'hi'
          ? "एंटी-वाइब्रेशन शॉक पैड बिछाना और ठोस लकड़ी के स्लीपरों को सुरक्षित करना।"
          : "Laying modular anti-vibration shock pads and securing dual-ply intersecting softwood joists/sleepers."
      },
      {
        title: language === 'hi' ? "मेपल लकड़ी की स्थापना" : "Maple Cleat Securing",
        days: language === 'hi' ? "दिन 5 - 7" : "Days 5 - 7",
        icon: <Hammer className="h-4 w-4" />,
        desc: language === 'hi'
          ? "कनाडाई मेपल के तख्तों को फैलाना ताकि लकड़ी को मौसम के अनुसार ढलने की जगह मिल सके।"
          : "Cleating premium tongue-and-groove Canadian Maple blanks with expansion spacers to allow seasonal wood breathing."
      },
      {
        title: language === 'hi' ? "सैंडिंग और मार्किंग" : "Multi-Grit Sanding & Markings",
        days: language === 'hi' ? "दिन 8 - 9" : "Days 8 - 9",
        icon: <Layers className="h-4 w-4" />,
        desc: language === 'hi'
          ? "मशीनी सैंडिंग के तीन चरण, उसके बाद खेल मैदान की सीमाओं की सटीक पेंटिंग।"
          : "Three-pass professional machine sanding with dual grain meshes, followed by precision paint bounding layers."
      },
      {
        title: language === 'hi' ? "पॉलीयुरेथेन ग्लैज सीलिंग" : "Polyurethane Glaze Sealing",
        days: language === 'hi' ? "दिन 10 - 12" : "Days 10 - 12",
        icon: <Sparkles className="h-4 w-4" />,
        desc: language === 'hi'
          ? "पॉलीयुरेथेन की मजबूत कोट लगाना। सुखने के लिए 3 अलग-अलग परतों की आवश्यकता होती है।"
          : "Applying high-gloss athletic polyurethane layers. Needs 3 separate coats, each requiring 24 hours of curing state."
      }
    ];
    noteAlert = language === 'hi'
      ? "हार्डवुड निर्माण के लिए पूरी तरह से समतल इनडोर कंक्रीट सबबेस की आवश्यकता होती है। कंक्रीट सूखने में 21-28 दिन लग सकते हैं।"
      : "Hardwood builds mandate a pre-cured, perfectly level indoor concrete subbase. Constructing the concrete itself requires an additional 21-28 days of drying before our specialized carpentry can launch.";
  } else if (surfaceMaterial === 'PP_TILES') {
    installTypeTitle = language === 'hi' ? "इंटरलॉकिंग पीपी टाइल स्थापना" : "Interlocking PP Tile Installation";
    durationRange = language === 'hi' ? "2 - 3 कार्य दिवस" : "2 - 3 Working Days";
    durationText = language === 'hi'
      ? "तेजी से होने वाली असेंबली, न्यूनतम चिपचिपापन बंधन, और तत्काल खेल योग्यता।"
      : "High-speed modular snaps, minimal adhesive bonding, and instantaneous playability.";
    steps = [
      {
        title: language === 'hi' ? "ग्राउंड ग्रेडिंग" : "Groundwork Grading",
        days: language === 'hi' ? "दिन 1" : "Day 1",
        icon: <Clock className="h-4 w-4" />,
        desc: language === 'hi'
          ? "तैयार सबबेस की सफाई करना, संरेखण स्थापित करना, और एक पतली ध्वनि-अवशोषण चटाई बिछाना।"
          : "Cleaning the prepared subbase, setting horizontal layout alignments, and applying a thin noise-absorption mesh mat."
      },
      {
        title: language === 'hi' ? "टाइल इंटरलॉकिंग" : "Interlocking Mesh Snaps",
        days: language === 'hi' ? "दिन 2" : "Day 2",
        icon: <Hammer className="h-4 w-4" />,
        desc: language === 'hi'
          ? "उच्च-स्थायित्व वाले पॉलीप्रोपाइलीन टाइल्स को आपस में जोड़ना।"
          : "Snapping high-durability polypropylene tiles. High-speed interlocking loops secure the area with integrated lines."
      },
      {
        title: language === 'hi' ? "सुरक्षा रैंप और उपकरण" : "Perimeter Ramps & Anchor Lock",
        days: language === 'hi' ? "दिन 3" : "Day 3",
        icon: <CheckCircle className="h-4 w-4" />,
        desc: language === 'hi'
          ? "किनारे की सुरक्षा आवश्यकताओं को जोड़ना और अंतिम भौतिक सुरक्षा और गुणवत्ता निरीक्षण।"
          : "Installing expander expansion joint strips, edge security ramps, play equipment, and finishing physical safety inspections."
      }
    ];
    noteAlert = language === 'hi'
      ? "पॉलीप्रोपाइलीन मॉड्यूलर टाइल्स को शुष्क मौसम पर कम निर्भरता की आवश्यकता होती है और ये असेंबली के तुरंत बाद उपयोग योग्य हो जाते हैं।"
      : "Polypropylene modular structures require significantly less dry weather dependence and are immediately playable right after interlocking is complete.";
  } else if (surfaceMaterial === 'COMPOSITE_TURF') {
    installTypeTitle = language === 'hi' ? "टूर्नामेंट सिंथेटिक टर्फ रोल स्थापना" : "Tournament synthetic Turf Roll Installation";
    durationRange = language === 'hi' ? "3 - 5 कार्य दिवस" : "3 - 5 Working Days";
    durationText = language === 'hi'
      ? "सटीक रोल सिलाई, सीमिंग टेप और उच्च घनत्व वाले सिलिका सैंड का छिड़काव।"
      : "Precision roll stitching, joint seaming tape adhesion, and dense sand/rubber infill dispersion.";
    steps = [
      {
        title: language === 'hi' ? "टर्फ रोल संरेखण" : "Roll Alignment & Trimming",
        days: language === 'hi' ? "दिन 1 - 2" : "Days 1 - 2",
        icon: <Clock className="h-4 w-4" />,
        desc: language === 'hi'
          ? "साइट पर बड़े टर्फ रोल बिछाना और कस्टम खेल व्यवस्था के अनुसार सीमाएं काटना।"
          : "Acclimating large composite turf rolls on-site, cutting parameters, and arranging custom sport fiber layouts."
      },
      {
        title: language === 'hi' ? "सीमिंग टेप बोर्डिंग" : "Seaming Tape Bonding",
        days: language === 'hi' ? "दिन 3" : "Day 3",
        icon: <Layers className="h-4 w-4" />,
        desc: language === 'hi'
          ? "पेशेवर जिओटेक्सटाइल सीमिंग बैकअप टेप बिछाना और नमी-प्रतिरोधी गोंद से सीमों को चिपकाना।"
          : "Laying professional geotextile seaming backing tapes. Gluing heavy joints with moisture-resistant polyurethane glue."
      },
      {
        title: language === 'hi' ? "सिलिका सैंड डिस्पर्शन" : "Granular Sand Dispersion",
        days: language === 'hi' ? "दिन 4 - 5" : "Days 4 - 5",
        icon: <Hammer className="h-4 w-4" />,
        desc: language === 'hi'
          ? "टर्फ के धागों को सीधा रखने के लिए धुली हुई सिलिका रेत और रबर क्रम्ब्स का समान रूप से छिड़काव।"
          : "Spreading dense washed silica sand and resilient rubber crumbs across grass strands to sustain grass posture."
      }
    ];
    noteAlert = language === 'hi'
      ? "टर्फ स्थापना के दौरान बारिश से बचना चाहिए ताकि सीमिंग ग्लू टेप को पूरी पकड़ मिल सके।"
      : "Turf installation must avoid rainfall windows to ensure high-strength binder tape holds secure seams flawlessly.";
  } else {
    // PRO_ACRYLIC
    installTypeTitle = language === 'hi' ? "प्रो कुशन एक्रिलिक परतें बिछाना" : "Pro Cushion Acrylic Laying";
    durationRange = language === 'hi' ? "4 - 7 कार्य दिवस" : "4 - 7 Working Days";
    durationText = language === 'hi'
      ? "क्रमिक प्राइमर छिड़काव, कई कुशन रबर परतें, और बनावट वाले रंग के कोट।"
      : "Sequential primer layer spread, multiple micro-rubber cushions, and textured color coats.";
    steps = [
      {
        title: language === 'hi' ? "सबबेस एसिड वॉश" : "Subbase Stripping & Acid Wash",
        days: language === 'hi' ? "दिन 1" : "Day 1",
        icon: <Clock className="h-4 w-4" />,
        desc: language === 'hi'
          ? "सबबेस की उच्च-दबाव सफाई और सीमेंट सतह पर बेहतर पकड़ के लिए सूक्ष्म दरार की मरम्मत।"
          : "Acid washing, high-pressure washing, and minor crack-repair fillers to establish solid substrate grip."
      },
      {
        title: language === 'hi' ? "लचीला कुशन प्राइमर" : "Resilient Cushion Priming",
        days: language === 'hi' ? "दिन 2 - 3" : "Days 2 - 3",
        icon: <Layers className="h-4 w-4" />,
        desc: language === 'hi'
          ? "जोड़ों की सुरक्षा के लिए इलास्टोमेरिक एक्रिलिक बाइंडर कोट लगाना।"
          : "Applying structured elastomeric acrylic binder coats to integrate rubber granules for joint protection."
      },
      {
        title: language === 'hi' ? "संरचित कलर स्किन्स" : "Acrylic Texture Color Skins",
        days: language === 'hi' ? "दिन 4 - 5" : "Days 4 - 5",
        icon: <Hammer className="h-4 w-4" />,
        desc: language === 'hi'
          ? "अत्यधिक टिकाऊ मौसमरोधी सिलिका रंग की परतें वाइप-सप्लायर द्वारा लगाना।"
          : "Squeegeeing highly durable color coatings. Two separate weatherproofing layers embedded with silica grains."
      },
      {
        title: language === 'hi' ? "आईटीएफ मार्किंग और सीलिंग" : "ITF Line Layout & Clear Seal",
        days: language === 'hi' ? "दिन 6 - 7" : "Days 6 - 7",
        icon: <Sparkles className="h-4 w-4" />,
        desc: language === 'hi'
          ? "एंटी-ग्लेयर गैर-चमकदार पेंट के साथ सटीक सीमा रेखाएं बनाना, और यूवी सीलर लगाना।"
          : "Precision layout tape and line markers with anti-glare paints, locked with final UV sealer protection strips."
      }
    ];
    noteAlert = language === 'hi'
      ? "एक्रिलिक बिछाने की प्रक्रिया तेज धूप पर अत्यधिक निर्भर करती है। अचानक बारिश से कोट प्रभावित हो सकते हैं।"
      : "Acrylic installations are extremely dependent on warm sunshine. Any humidity or unexpected rain can interrupt curing cycles.";
  }

  return (
    <div className="bg-white border border-stone-200/60 rounded-3xl p-6 shadow-md text-brand-stone font-sans" id="project-timeline-interactive">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-brand-sage" />
          <h3 className="font-bold text-base tracking-tight font-serif text-brand-stone select-none">
            {language === 'hi' ? "परियोजना लामबंदी समयरेखा" : "Project Mobilization Timeline"}
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-mono bg-brand-sage/10 text-brand-sage border border-brand-sage/20 px-2.5 py-1 rounded-full font-bold select-none">
          {language === 'hi' ? "गतिशील समयरेखा" : "Dynamic Timeline"}
        </span>
      </div>

      {/* Target Span Meter */}
      <div className="bg-brand-cream/80 border border-stone-150 p-4 rounded-2xl mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase font-bold">
            {language === 'hi' ? "नियोजित असेंबली अवधि" : "Planned Assembly duration"}
          </span>
          <span className="text-sm font-mono font-black text-brand-sage">{durationRange}</span>
        </div>
        <h4 className="text-sm font-serif font-bold text-brand-stone mb-1">{installTypeTitle}</h4>
        <p className="text-xs text-stone-550 leading-relaxed">{durationText}</p>
      </div>

      {/* Dynamic Milestones / Visual Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-100 before:content-['']">
        {steps.map((step, idx) => {
          const isHovered = hoveredStep === idx;
          return (
            <div 
              key={idx}
              className="relative group transition-all duration-200"
              onMouseEnter={() => setHoveredStep(idx)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Timeline bubble bullet marker */}
              <div className={`absolute -left-[22px] top-1 h-[10px] w-[10px] rounded-full border-2 bg-white transition-all duration-300 ${
                isHovered 
                  ? 'border-brand-sage bg-brand-sage scale-125 shadow-sm shadow-brand-sage/40' 
                  : 'border-stone-300'
              }`} />

              <div className={`p-3.5 rounded-2xl border transition-all duration-250 ${
                isHovered
                  ? 'bg-brand-cream border-brand-sage/45 shadow-sm'
                  : 'bg-white border-stone-150 hover:border-stone-300'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-serif font-black text-brand-stone">{step.title}</span>
                  <span className="text-[10px] font-mono font-bold bg-stone-105 text-stone-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                    {step.icon}
                    {step.days}
                  </span>
                </div>
                <p className="text-[11px] text-stone-550 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Technical reality alert warning box */}
      <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex gap-3 text-[11px] leading-relaxed text-amber-900">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-950 block mb-0.5">
            {language === 'hi' ? "स्लैब तैयारी सूचना:" : "Slab Preparation Notice:"}
          </span>
          {noteAlert}
        </div>
      </div>
    </div>
  );
};
