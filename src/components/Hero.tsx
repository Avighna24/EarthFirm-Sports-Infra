/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CourtConfiguration } from '../types';
import { useLanguage } from '../LanguageContext';

interface HeroProps {
  onStartCustomizer: () => void;
  onViewCatalog: () => void;
  onSelectShowcase: (config: CourtConfiguration) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartCustomizer, onViewCatalog, onSelectShowcase }) => {
  const { t } = useLanguage();
  // Preset configurations for the three organic showcase landmarks
  const showcasePresets: Record<string, CourtConfiguration> = {
    showcase1: {
      sportType: 'BASKETBALL',
      length: 60,
      width: 30,
      surfaceMaterial: 'PP_TILES',
      primaryColor: 'emerald',
      secondaryColor: 'gray',
      lineColor: '#ffffff',
      subbase: 'POST_TENSION_CONCRETE',
      selectedSmartFeatures: ['PERIPHERAL_FENCING']
    },
    showcase2: {
      sportType: 'TENNIS',
      length: 120,
      width: 60,
      surfaceMaterial: 'PRO_ACRYLIC',
      primaryColor: 'orange',
      secondaryColor: 'blue',
      lineColor: '#ffffff',
      subbase: 'POST_TENSION_CONCRETE',
      selectedSmartFeatures: ['PERIPHERAL_FENCING', 'SMART_FLOODLIGHTS']
    },
    showcase3: {
      sportType: 'FOOTBALL',
      length: 150,
      width: 75,
      surfaceMaterial: 'COMPOSITE_TURF',
      primaryColor: 'green',
      secondaryColor: 'black',
      lineColor: '#ffffff',
      subbase: 'COMPACTED_STONE',
      selectedSmartFeatures: ['PERIPHERAL_FENCING']
    }
  };
  const { language } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden border-b border-stone-200/40">
        
        {/* Layer 1: Background Image (uid=743) */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 hover:scale-105" 
          style={{ backgroundImage: "url('https://images.pexels.com/photos/12160658/pexels-photo-12160658.jpeg')" }}
        />

        {/* Layer 2: Black Overlay (The element you selected, uid=744) */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Layer 3: Content (uid=745) */}
        <div className="relative z-10 text-center px-6 max-w-6xl py-12">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white font-mono font-bold block mb-4">
            {language === 'hi' ? 'मध्य भारत का सर्वश्रेष्ठ समूह' : "CENTRAL INDIA'S FINER INFRASTRUCTURE EXPERTS"}
          </span>
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase mb-6 text-white leading-none">
            {language === 'hi' ? (
              <>खेलों के भविष्य<br />का निर्माण</>
            ) : (
              <>Building The Future<br />Of Sports</>
            )}
          </h1>
          <p className="text-base sm:text-xl text-gray-300 mb-12 tracking-wide font-light max-w-3xl mx-auto leading-relaxed">
            {language === 'hi' 
              ? 'गुणवत्ता, सुरक्षा और विश्वसनीयता के उच्चतम मानकों को बनाए रखते हुए अभिनव, टिकाऊ और उच्च-प्रदर्शन वाले खेल बुनियादी ढांचे का निर्माण करना जिससे एथलीट, संस्थान और समुदाय विश्व स्तरीय खेल अनुकूल वातावरण का अनुभव कर सकें।'
              : "To deliver innovative, durable, and high-performance sports infrastructure that enables athletes, institutions, and communities to experience world-class sporting environments while maintaining the highest standards of quality, safety, and reliability."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onStartCustomizer}
              id="hero-btn-builder-custom"
              className="w-full sm:w-auto bg-white text-black hover:bg-neutral-100 font-bold px-8 py-4 uppercase tracking-wider text-xs transition duration-200 cursor-pointer"
            >
              {language === 'hi' ? 'परियोजना शुरू करें' : 'Start Your Project'}
            </button>
            <button 
              onClick={onViewCatalog}
              id="hero-btn-catalog-custom"
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold px-8 py-4 uppercase tracking-wider text-xs transition duration-200 cursor-pointer"
            >
              {language === 'hi' ? 'हमारे साथ निर्माण करें' : 'Build With Us'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

