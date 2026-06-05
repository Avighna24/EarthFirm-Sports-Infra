/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CourtConfiguration } from '../types';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

// Import high-fidelity multipurpose collage image
import multipurposeCollageImg from '../assets/images/multipurpose_collage_1780662230085.png';

interface HeroProps {
  onStartCustomizer: () => void;
  onViewCatalog: () => void;
  onSelectShowcase: (config: CourtConfiguration) => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1600&auto=format&fit=crop",
    tagline: "CENTRAL INDIA'S FINER INFRASTRUCTURE EXPERTS",
    taglineHi: "मध्य भारत का सर्वश्रेष्ठ समूह",
    title: "Building The Future\nOf Sports",
    titleHi: "खेलों के भविष्य\nका निर्माण",
    desc: "To deliver innovative, durable, and high-performance sports infrastructure that enables athletes, institutions, and communities to experience world-class sporting environments.",
    descHi: "गुणवत्ता, सुरक्षा और विश्वसनीयता के उच्चतम मानकों को बनाए रखते हुए अभिनव, टिकाऊ और उच्च-प्रदर्शन वाले खेल बुनियादी ढांचे का निर्माण करना जिससे एथलीट, संस्थान और समुदाय विश्व स्तरीय खेल अनुकूल वातावरण का अनुभव कर सकें।"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1600&auto=format&fit=crop",
    tagline: "TOURNAMENT-GRADE PERFORMANCE SURFACING",
    taglineHi: "टूर्नामेंट-ग्रेड खेल परिसर",
    title: "Precision Civil\nEngineering",
    titleHi: "सटीक सिविल\nइंजीनियरिंग",
    desc: "Every surface we lay combines FIBA & ITF-certified synthetic elastomers with 100% durable post-tensioned concrete structural bases designed for ultimate resilience.",
    descHi: "हमारे द्वारा तैयार की जाने वाली प्रत्येक सतह FIBA और ITF-प्रमाणित सिंथेटिक एलास्टोमर्स को 100% टिकाऊ पोस्ट-टेंशन वाले कंक्रीट संरचनात्मक आधारों के साथ जोड़ती है।"
  },
  {
    id: 3,
    image: multipurposeCollageImg,
    tagline: "INDORE'S LEADING INFRASTRUCTURE PIONEERS",
    taglineHi: "इंदौर का अग्रणी स्पोर्ट्स इंफ्रास्ट्रक्चर",
    title: "Elite Multipurpose\nPlaygrounds",
    titleHi: "अभिजात बहुउद्देशीय\nखेल मैदान",
    desc: "From state-of-the-art schools to professional academy complexes, EarthFirm designs safety-graded sports arenas that inspire athletic excellence and community play.",
    descHi: "अत्याधुनिक स्कूलों से लेकर पेशेवर अकादमियों तक, अर्थफ़र्म उत्तरदायी, सुरक्षा-वर्गीकृत खेल मैदान डिज़ाइन करता है जो भौतिक उत्कृष्टता और सामुदायिक खेल को प्रेरित करते हैं।"
  }
];

export const Hero: React.FC<HeroProps> = ({ onStartCustomizer, onViewCatalog }) => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [rotationTrigger, setRotationTrigger] = useState(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Restart autoplay timer
  const resetAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    autoplayTimerRef.current = setInterval(() => {
      setDirection('right');
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
      setRotationTrigger((p) => p + 1);
    }, 6000); // changes every 6 seconds
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, []);

  const handlePrev = () => {
    setDirection('left');
    setActiveIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
    setRotationTrigger((p) => p + 1);
    resetAutoplay();
  };

  const handleNext = () => {
    setDirection('right');
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setRotationTrigger((p) => p + 1);
    resetAutoplay();
  };

  const currentSlide = HERO_SLIDES[activeIndex];

  // Highly Optimized Cinematic Slide & Zoom Animation Variants
  const slideVariants: any = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '100%' : '-100%',
      scale: 1.05,
      opacity: 0,
    }),
    center: {
      x: '0%',
      scale: 1,
      opacity: 1,
      transition: {
        x: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.65 },
        scale: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.65 },
        opacity: { duration: 0.45, ease: "easeInOut" }
      }
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '-100%' : '100%',
      scale: 0.95,
      opacity: 0,
      transition: {
        x: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.65 },
        scale: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.65 },
        opacity: { duration: 0.45, ease: "easeInOut" }
      }
    })
  };

  return (
    <div className="flex flex-col bg-black">
      {/* Hero Section Container */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden border-b border-stone-900">
        
        {/* Visual slide background viewport with high-end crossfading */}
        <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none overflow-hidden bg-black">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 0.9, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('${currentSlide.image}')`,
              }}
            />
          </AnimatePresence>
          {/* High-quality static gradient overlay masks */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/70 z-5 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-6" />
        </div>

        {/* Upper Content Layer with Staggered Snappy Entrance */}
        <div className="relative z-10 text-center px-6 max-w-5xl py-12 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center w-full"
            >
              {/* Visual Tagline */}
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-emerald-400 font-mono font-bold block mb-5">
                {language === 'hi' ? currentSlide.taglineHi : currentSlide.tagline}
              </span>

              {/* Main Heading styled for premium impact */}
              <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase mb-6 text-white leading-[0.9] whitespace-pre-line">
                {language === 'hi' ? currentSlide.titleHi : currentSlide.title}
              </h1>

              {/* Context Description */}
              <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-12 tracking-wide font-light max-w-2xl mx-auto leading-relaxed">
                {language === 'hi' ? currentSlide.descHi : currentSlide.desc}
              </p>

              {/* Primary/Secondary Call-To-Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
                <button 
                  onClick={onStartCustomizer}
                  id="hero-btn-builder-custom"
                  className="w-full sm:w-auto bg-white text-black hover:bg-neutral-100 font-bold px-8 py-4 uppercase tracking-wider text-xs transition duration-200 cursor-pointer active:scale-95"
                >
                  {language === 'hi' ? 'परियोजना शुरू करें' : 'Start Your Project'}
                </button>
                <button 
                  onClick={onViewCatalog}
                  id="hero-btn-catalog-custom"
                  className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold px-8 py-4 uppercase tracking-wider text-xs transition duration-200 cursor-pointer active:scale-95"
                >
                  {language === 'hi' ? 'हमारे साथ निर्माण करें' : 'Build With Us'}
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Elegant Chevron Navigation controls situated on both sides */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 sm:left-6 z-25 p-3.5 rounded-full border border-white/10 hover:border-white/30 text-white bg-black/40 hover:bg-black/70 transition-all cursor-pointer backdrop-blur-xs select-none active:scale-90"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 sm:right-6 z-25 p-3.5 rounded-full border border-white/10 hover:border-white/30 text-white bg-black/40 hover:bg-black/70 transition-all cursor-pointer backdrop-blur-xs select-none active:scale-90"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide indicator dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > activeIndex ? 'right' : 'left');
                setActiveIndex(i);
                setRotationTrigger((p) => p + 1);
                resetAutoplay();
              }}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === i ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </section>
    </div>
  );
};
