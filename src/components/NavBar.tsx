import React from 'react';
import { motion } from 'motion/react';

interface NavBarProps {
  onNavigateHome: () => void;
  onNavigateTo: (path: string) => void;
  onScrollTo: (elementId: string) => void;
}

export function NavBar({ onNavigateHome, onNavigateTo, onScrollTo }: NavBarProps) {
  const currentPath = window.location.hash ? window.location.hash.slice(1) : window.location.pathname;

  const handleNavClick = (elementId: string, path: string = '/') => {
    const isTargetRoot = path === '/';
    // If we're on root already (or we're routed there)
    const isLocalRoot = currentPath === '/' || currentPath === '';
    
    if (isTargetRoot && !isLocalRoot) {
      onNavigateTo(path);
      setTimeout(() => onScrollTo(elementId), 100);
    } else if (!isTargetRoot && currentPath !== path) {
      onNavigateTo(path);
    } else {
      onScrollTo(elementId);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black border-b border-white/10 px-4 sm:px-6 lg:px-8 py-2" data-testid="navbar">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        
        {/* Logo combined */}
        <div className="cursor-pointer flex items-center" data-testid="nav-logo" onClick={onNavigateHome}>
          <img src="./Logo.png" alt="Earthfirm Sports Infra" className="h-[90px] w-auto object-contain" />
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <button
            onClick={() => handleNavClick('about-us', '/')}
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
            onClick={() => handleNavClick('contact-operations', '/')}
            data-testid="nav-contact"
            className="text-sm font-semibold tracking-wider uppercase text-gray-400 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
          >
            Contact Us
          </button>
        </nav>

      </div>
    </header>
  );
}
