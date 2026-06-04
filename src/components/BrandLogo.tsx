/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BrandLogoProps {
  className?: string; // Sizing and placement of layout
  iconSize?: number; // Approximate height of the ES monogram block
  showText?: boolean;
  lightMode?: boolean; // If true, colors will suit light backgrounds, otherwise dark ones
  layout?: 'vertical' | 'horizontal'; // Layout choice for navbars vs hero/footer
}

export function BrandLogo({
  className = '',
  iconSize = 36,
  showText = true,
  lightMode = true,
  layout = 'vertical'
}: BrandLogoProps) {
  // Setup colors based on mode for text elements
  const titleColorClass = lightMode ? 'text-zinc-900' : 'text-white';
  const subTitleColorClass = 'text-brand-sage';
  const dividerColorClass = lightMode ? 'via-zinc-300' : 'via-white/35';

  const isHorizontal = layout === 'horizontal';

  return (
    <div className={`flex ${isHorizontal ? 'flex-row items-center gap-2.5' : 'flex-col items-center justify-center'} select-none ${className}`}>
      
      {/* Dynamic Inline Vector Reproducing the Official "ES" Monogram */}
      <svg 
        viewBox="0 0 120 70" 
        style={{ height: iconSize, width: iconSize * 1.7 }} 
        className="overflow-visible shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic chrome gradient definitions to match the real corporate logo shine */}
          <linearGradient id="silverChromeDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#E2E8F0" />
            <stop offset="42%" stopColor="#94A3B8" />
            <stop offset="48%" stopColor="#FFFFFF" />
            <stop offset="52%" stopColor="#F1F5F9" />
            <stop offset="78%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id="silverChromeLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="18%" stopColor="#E2E8F0" />
            <stop offset="40%" stopColor="#64748B" />
            <stop offset="48%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#E2E8F0" />
            <stop offset="80%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* 3D Drop shadow filter for professional depth */}
          <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1.2" dy="1.8" stdDeviation="1.0" floodColor="#000000" floodOpacity="0.32" />
          </filter>
        </defs>

        {/* Outer skewed container group for energetic velocity angle */}
        <g 
          transform="skewX(-18) translate(12, 6)" 
          fill={lightMode ? "url(#silverChromeLight)" : "url(#silverChromeDark)"}
          filter="url(#logoShadow)"
        >
          {/* E Top Bar Segment (Detached) */}
          <path d="M 23,10 L 48,10 L 48,18 L 23,18 Z" />

          {/* S Component (Top-right bar connected to middle-right bar) */}
          <path d="M 53,10 L 85,10 L 85,26 L 77,26 L 77,34 L 50,34 L 50,26 L 77,26 L 77,18 L 53,18 Z" />

          {/* E Component (Middle-left bar connected to bottom stem) */}
          <path d="M 12,26 L 45,26 L 45,34 L 20,34 L 20,42 L 12,42 Z" />

          {/* Solid Base Plate (Shared bottom structural line) */}
          <path d="M 12,42 L 85,42 L 85,52 L 12,52 Z" />
        </g>
      </svg>

      {/* Corporate Brand Typography */}
      {showText && (
        isHorizontal ? (
          <div className="flex flex-col items-start leading-none text-left">
            {/* Primary Logo Name */}
            <span className={`font-sans font-black text-[13px] sm:text-sm tracking-[0.16em] uppercase ${titleColorClass}`}>
              EARTHFIRM
            </span>
            {/* Secondary Industry Moniker (Subtle gap) */}
            <span className={`font-mono text-[7px] sm:text-[8px] font-black tracking-[0.24em] ${subTitleColorClass} uppercase mt-1 pl-[0.1em]`}>
              SPORTS INFRA
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-2 w-full text-center">
            {/* Primary Logo Name */}
            <span className={`font-sans font-black text-base sm:text-lg tracking-[0.18em] leading-none uppercase ${titleColorClass}`}>
              EARTHFIRM
            </span>

            {/* Divider chrome line mirroring the logo shine strip */}
            <div className={`h-[1px] w-36 bg-gradient-to-r from-transparent ${dividerColorClass} to-transparent my-1.5`} />

            {/* Secondary Industry Moniker */}
            <span className={`font-mono text-[8px] sm:text-[9px] font-extrabold tracking-[0.38em] leading-none ${subTitleColorClass} uppercase pl-[0.38em]`}>
              SPORTS INFRA
            </span>
          </div>
        )
      )}
    </div>
  );
}
