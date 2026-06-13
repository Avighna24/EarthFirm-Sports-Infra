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

      {/* Mobile Menu Slide-out Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-[60]"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-zinc-950 border-l border-white/10 z-[70] md:hidden flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-white/5">
                <span className="text-white font-serif font-bold uppercase tracking-wider text-sm">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-grow py-8 px-6 space-y-2">
                {[
                  { label: 'About Us', onClick: () => handleMobileRouteClick('/about-us') },
                  { label: 'Interactive Customizer', onClick: () => handleNavClick('arena-configurator', '/') },
                  { label: 'Budget Planning', onClick: () => handleMobileRouteClick('/budget-planning') },
                  { label: 'FAQ', onClick: () => handleMobileRouteClick('/faq') },
                  { label: 'Careers', onClick: () => handleMobileRouteClick('/careers') },
                  { label: 'Contact Us', onClick: () => handleNavClick('contact-operations', '/') }
                ].map((item, idx) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    onClick={item.onClick}
                    className="w-full text-left py-4 text-sm font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-brand-sage transition-colors border-b border-white/5"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              <div className="p-8 border-t border-white/5">
                <img src="./Logo.png" alt="Earthfirm" className="h-16 w-auto object-contain mx-auto opacity-50 grayscale" />
                <p className="text-[10px] text-zinc-600 font-mono text-center mt-4 uppercase tracking-widest">Constructing Excellence</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
