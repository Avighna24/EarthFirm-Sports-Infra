/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, Variants } from 'motion/react';
import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { AboutUs } from './components/AboutUs';
import { InteractiveBuilder } from './components/InteractiveBuilder';
import { ProductCatalog } from './components/ProductCatalog';
import { BudgetPlanner } from './components/BudgetPlanner';
import { ContactUs } from './components/ContactUs';
import { FAQ } from './components/FAQ';
import { Careers } from './components/Careers';
import { FloatingActions } from './components/FloatingActions';
import { CourtConfiguration } from './types';
import { saveDocument } from './components/firebase';
import { Landmark, Trophy, ShieldCheck, Zap, Info, ArrowUp, Sparkles, MapPin, Mail, Phone, Clock, Globe, Building, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { ScrollAnimate } from './components/ScrollAnimate';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05
    }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const } 
  }
};

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    await saveDocument('newsletter_signups', '', { email: newsletterEmail });
    setNewsletterSubmitted(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubmitted(false), 3000);
  };

  // Real-time SPA Path routing
  const [currentPath, setCurrentPath] = useState(() => {
    if (window.location.hash) {
      return window.location.hash.slice(1);
    }
    const path = window.location.pathname;
    const base = (import.meta as any).env.BASE_URL || '/';
    if (base !== '/' && path.startsWith(base)) {
      return path.slice(base.length - 1);
    }
    return path;
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash) {
        setCurrentPath(window.location.hash.slice(1));
      } else {
        const path = window.location.pathname;
        const base = (import.meta as any).env.BASE_URL || '/';
        if (base !== '/' && path.startsWith(base)) {
          setCurrentPath(path.slice(base.length - 1));
        } else {
          setCurrentPath(path);
        }
      }
    };
    const handleHashChange = () => {
      if (window.location.hash) {
        setCurrentPath(window.location.hash.slice(1));
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    if (path === '/' || path === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [activeConfig, setActiveConfig] = useState<CourtConfiguration>(() => {
    try {
      const saved = localStorage.getItem('earthfirm_court_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing saved config from localStorage', e);
    }
    return {
      sportType: 'BASKETBALL',
      length: 94,
      width: 50,
      surfaceMaterial: 'CANADIAN_MAPLE',
      primaryColor: 'white',
      secondaryColor: 'white',
      lineColor: '#ffffff',
      subbase: 'POST_TENSION_CONCRETE',
      selectedSmartFeatures: ['PERIPHERAL_FENCING', 'SMART_FLOODLIGHTS'],
      visualizePlayers: true,
      animatePlayers: true,
      glassPool: true,
      crystalClearWater: false
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('earthfirm_court_config', JSON.stringify(activeConfig));
    } catch (e) {
      console.error('Error saving config to localStorage', e);
    }
  }, [activeConfig]);

  const scrollSmoothTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToContact = (elementId: string) => {
    if (isPlanningPage || isFAQPage || isAboutPage || isCareersPage) {
      navigateTo('/');
      setTimeout(() => {
        scrollSmoothTo(elementId);
      }, 150);
    } else {
      scrollSmoothTo(elementId);
    }
  };

  // Check if current page is the Budget Planning page (pathname or custom parameter)
  const isPlanningPage = currentPath === '/budget-planning' || currentPath === '/budget-planning/';
  const isFAQPage = currentPath === '/faq' || currentPath === '/faq/';
  const isAboutPage = currentPath === '/about-us' || currentPath === '/about-us/';
  const isCareersPage = currentPath === '/careers' || currentPath === '/careers/';

  if (isPlanningPage) {
    return (
      <div className="flex flex-col min-h-screen font-sans">
        <NavBar onNavigateHome={() => navigateTo('/')} onNavigateTo={navigateTo} onScrollTo={scrollSmoothTo} />
        <BudgetPlanner onBackToMain={() => navigateTo('/')} language={language} />
        <FloatingActions onScrollToContact={handleScrollToContact} />
      </div>
    );
  }

  if (isFAQPage) {
    return (
      <div className="flex flex-col min-h-screen font-sans">
        <NavBar onNavigateHome={() => navigateTo('/')} onNavigateTo={navigateTo} onScrollTo={scrollSmoothTo} />
        <FAQ onBackToMain={() => navigateTo('/')} language={language} />
        <FloatingActions onScrollToContact={handleScrollToContact} />
      </div>
    );
  }

  if (isAboutPage) {
    return (
      <div className="flex flex-col min-h-screen font-sans">
        <NavBar onNavigateHome={() => navigateTo('/')} onNavigateTo={navigateTo} onScrollTo={scrollSmoothTo} />
        <AboutUs onBackToMain={() => navigateTo('/')} />
        <FloatingActions onScrollToContact={handleScrollToContact} />
      </div>
    );
  }

  if (isCareersPage) {
    return (
      <div className="flex flex-col min-h-screen font-sans">
        <NavBar onNavigateHome={() => navigateTo('/')} onNavigateTo={navigateTo} onScrollTo={scrollSmoothTo} />
        <Careers onBackToMain={() => navigateTo('/')} />
        <FloatingActions onScrollToContact={handleScrollToContact} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream/30 text-brand-stone font-sans selection:bg-brand-sage/20 selection:text-brand-stone">
      
      <NavBar onNavigateHome={() => navigateTo('/')} onNavigateTo={navigateTo} onScrollTo={scrollSmoothTo} />

      {/* 1. HERO SECTION */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Hero
          onStartCustomizer={() => scrollSmoothTo('arena-configurator')}
          onViewCatalog={() => scrollSmoothTo('materials-portfolio')}
          onSelectShowcase={(config) => {
            setActiveConfig(config);
            setTimeout(() => {
              scrollSmoothTo('arena-configurator');
            }, 80);
          }}
        />
      </motion.div>

      {/* 2. INTERACTIVE BUILDER & LIVE VISUAL ESTIMATOR */}
      <ScrollAnimate
        direction="up"
        duration={800}
        threshold={0.05}
        margin="0px 0px -100px 0px"
      >
        <InteractiveBuilder
          config={activeConfig}
          onConfigChange={setActiveConfig}
          triggerScrollToContact={() => scrollSmoothTo('assessment-rfp')}
        />
      </ScrollAnimate>

      {/* 3. MATERIAL PORTFOLIO TAB LAB & CROSS SECTION EXPLODER */}
      <ScrollAnimate
        direction="up"
        duration={800}
        threshold={0.05}
        margin="0px 0px -100px 0px"
      >
        <ProductCatalog />
      </ScrollAnimate>

      <ScrollAnimate
        direction="up"
        duration={800}
        threshold={0.05}
        margin="0px 0px -100px 0px"
      >
        <ContactUs />
      </ScrollAnimate>

      {/* FOOTER */}
      <footer className="bg-brand-stone text-brand-cream/80 py-16 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
            
            {/* Branding */}
            <div className="space-y-4">
              <img src="./Logo.png" alt="Earthfirm Sports Infra" className="h-[120px] w-auto object-contain grayscale opacity-80 mix-blend-screen" />
              <p className="max-w-xs text-brand-cream/70 leading-relaxed text-xs">
                We Build The Ground Work For Champions. High-performance civil basketball courts, tournament-grade cricket turf, ITF tennis systems, and bespoke sports arenas.
              </p>
              <div className="space-y-1 font-mono text-[11px] pt-1">
                <p className="text-brand-cream/50">Email: <a href="mailto:sportsinfraearthfirm@gmail.com" className="text-white hover:text-brand-sage transition">sportsinfraearthfirm@gmail.com</a></p>
                <p className="text-brand-cream/50">Hotline: <a href="tel:+919893777095" className="text-white hover:text-brand-sage transition">+91 98937 77095</a> / <a href="tel:+919893777092" className="text-white hover:text-brand-sage transition">+91 98937 77092</a></p>
              </div>
            </div>

            {/* Locations */}
            <div>
              <h5 className="font-bold font-mono uppercase text-white mb-3 tracking-widest text-[11px]">Corporate Headquarters</h5>
              <div className="space-y-2.5 text-brand-cream/70 text-xs">
                <a 
                  href="https://maps.google.com/?q=Sector+B,+Sanwer+Road+Industrial+Area,+Indore,+Madhya+Pradesh+452015"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 max-w-xs group cursor-pointer"
                >
                  <MapPin className="h-3.5 w-3.5 text-brand-sage shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">Central Corporate Office: Sector B, Sanwer Road Industrial Area, Indore, Madhya Pradesh 452015</span>
                </a>
              </div>
            </div>

            {/* Hours and Socials */}
            <div>
              <h5 className="font-bold font-mono uppercase text-white mb-3 tracking-widest text-[11px]">Operational Hours</h5>
              <div className="space-y-1.5 text-brand-cream/70 text-xs mb-6">
                <p>Monday &ndash; Saturday: 08:00 AM &ndash; 08:00 PM</p>
                <p>Sunday: Closed (Dispatch Available Only)</p>
              </div>

              <h5 className="font-bold font-mono uppercase text-white mb-3 tracking-widest text-[11px]">Follow Us</h5>
              <div className="flex gap-4 mb-8">
                <a 
                  href="https://www.instagram.com/earthfirm_sportsinfra/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-900 border border-neutral-800/80 text-[#E1306C] hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-[#ee2a7b]/20"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-900 border border-neutral-800/80 text-[#1877F2] hover:text-white hover:bg-[#1877F2] hover:border-transparent transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-[#1877F2]/20"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/earthfirm-sports-infra-4b3b70413?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-900 border border-neutral-800/80 text-[#0077B5] hover:text-white hover:bg-[#0077B5] hover:border-transparent transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-[#0077B5]/20"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a 
                  href="mailto:sportsinfraearthfirm@gmail.com" 
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-900 border border-neutral-800/80 text-brand-sage hover:text-white hover:bg-brand-sage hover:border-transparent transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-brand-sage/20"
                >
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </a>
              </div>

              <h5 className="font-bold font-mono uppercase text-white mb-3 tracking-widest text-[11px]">Stay Updated</h5>
              <form onSubmit={handleNewsletterSignup} className="flex gap-2 relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-sage flex-grow"
                />
                <button
                  type="submit"
                  className="bg-brand-sage text-black font-bold text-[10px] px-3 py-2 rounded-lg hover:bg-white transition"
                >
                  JOIN
                </button>
                {newsletterSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-10 right-0 bg-brand-sage text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg"
                  >
                    Subscribed!
                  </motion.div>
                )}
              </form>
            </div>

          </div>

          {/* Slogans copyright */}
          <div className="border-t border-brand-cream/10 pt-8 flex flex-col sm:flex-row justify-between gap-4 text-[10px] text-brand-cream/40 font-mono">
            <span>&copy; {new Date().getFullYear()} Earthfirm Sports Infrastructures. All architectural designs and software layout rights reserved.</span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-brand-sage animate-pulse" />
              Sovereign Arena Constructors
            </span>
          </div>

        </div>
      </footer>

      <FloatingActions onScrollToContact={handleScrollToContact} />

    </div>
  );
}
