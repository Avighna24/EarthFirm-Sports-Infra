import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  onNavigateHome: () => void;
  onNavigateTo: (path: string) => void;
  onScrollTo: (elementId: string) => void;
}

export function NavBar({ onNavigateHome, onNavigateTo, onScrollTo }: NavBarProps) {
  const currentPath = window.location.hash ? window.location.hash.slice(1) : window.location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (elementId: string, path: string = '/') => {
    const isTargetRoot = path === '/';
    // If we're on root already (or we're routed there)
    const isLocalRoot = currentPath === '/' || currentPath === '';
    
    setMobileMenuOpen(false); // Close mobile menu when clicked
    
    if (isTargetRoot && !isLocalRoot) {
      onNavigateTo(path);
      setTimeout(() => onScrollTo(elementId), 100);
    } else if (!isTargetRoot && currentPath !== path) {
      onNavigateTo(path);
    } else {
      onScrollTo(elementId);
    }
  };

  const handleMobileRouteClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigateTo(path);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black border-b border-white/10 px-4 sm:px-6 lg:px-8 py-2 sm:py-3" data-testid="navbar">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        
        {/* Logo combined */}
        <div className="cursor-pointer flex items-center" data-testid="nav-logo" onClick={() => { setMobileMenuOpen(false); onNavigateHome(); }}>
          <img src="./Logo.png" alt="Earthfirm Sports Infra" className="h-[60px] sm:h-[90px] w-auto object-contain transition-all duration-300" />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <button
            onClick={() => onNavigateTo('/about-us')}
            data-testid="nav-about"
            className="text-sm font-semibold tracking-wider uppercase text-gray-400 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('arena-configurator', '/')}
            data-testid="nav-home"
            className="text-sm font-semibold tracking-wider uppercase text-gray-400 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
          >
            Interactive Customizer
          </button>
          <button
            onClick={() => onNavigateTo('/budget-planning')}
            className="text-sm font-semibold tracking-wider uppercase text-gray-400 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
          >
            Budget Planning
          </button>
          <button
            onClick={() => onNavigateTo('/faq')}
            data-testid="nav-faq"
            className="text-sm font-semibold tracking-wider uppercase text-gray-400 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
          >
            FAQ
          </button>
          <button
            onClick={() => onNavigateTo('/careers')}
            className="text-sm font-semibold tracking-wider uppercase text-gray-400 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
          >
            Careers
          </button>
          <button
            onClick={() => handleNavClick('contact-operations', '/')}
            data-testid="nav-contact"
            className="text-sm font-semibold tracking-wider uppercase text-gray-400 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
          >
            Contact Us
          </button>
        </nav>

        {/* Mobile Menu Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white focus:outline-none transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown with slide-down animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-2xl border-t border-white/5 mt-2 rounded-2xl"
          >
            <div className="flex flex-col gap-1 px-4 py-6 text-center">
              <button
                onClick={() => handleMobileRouteClick('/about-us')}
                className="w-full text-center py-3.5 text-sm font-bold tracking-widest uppercase text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition duration-200 cursor-pointer"
              >
                About Us
              </button>
              <button
                onClick={() => handleNavClick('arena-configurator', '/')}
                className="w-full text-center py-3.5 text-sm font-bold tracking-widest uppercase text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition duration-200 cursor-pointer"
              >
                Interactive Customizer
              </button>
              <button
                onClick={() => handleMobileRouteClick('/budget-planning')}
                className="w-full text-center py-3.5 text-sm font-bold tracking-widest uppercase text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition duration-200 cursor-pointer"
              >
                Budget Planning
              </button>
              <button
                onClick={() => handleMobileRouteClick('/faq')}
                className="w-full text-center py-3.5 text-sm font-bold tracking-widest uppercase text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition duration-200 cursor-pointer"
              >
                FAQ
              </button>
              <button
                onClick={() => handleMobileRouteClick('/careers')}
                className="w-full text-center py-3.5 text-sm font-bold tracking-widest uppercase text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition duration-200 cursor-pointer"
              >
                Careers
              </button>
              <button
                onClick={() => handleNavClick('contact-operations', '/')}
                className="w-full text-center py-3.5 text-sm font-bold tracking-widest uppercase text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition duration-200 cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
